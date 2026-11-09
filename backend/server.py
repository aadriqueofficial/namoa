from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import html
import logging
import requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Website enquiry form -> two emails through Resend: the enquiry to NAMOA, and
# an acknowledgement back to the person who sent it.
# Configure in backend/.env:
#   RESEND_API_KEY      Resend API key
#   ENQUIRY_TO_EMAIL    inbox that receives enquiries (comma-separate several)
#   ENQUIRY_FROM_EMAIL  sender on a domain verified in Resend, e.g. "NAMOA Website <enquiries@yourdomain>".
#                       Defaults to Resend's test sender, which only delivers to the Resend account
#                       owner — so acknowledgements need a verified domain before they reach enquirers.
RESEND_API_URL = "https://api.resend.com/emails"
DEFAULT_ENQUIRY_SENDER = "NAMOA Website <onboarding@resend.dev>"
COMPANY_NAME = "NAMOA Global Ventures"
ENQUIRY_ERROR = "We couldn't send your enquiry. Please try again shortly."


class EnquiryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=120)
    company: str = Field(default="", max_length=160)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    enquiry_type: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=10, max_length=5000)
    # Honeypot: the form hides this field from people, so any value means a bot.
    website: str = Field(default="", max_length=200)


def build_enquiry_email(enquiry: EnquiryCreate) -> dict:
    rows = [
        ("Name", enquiry.name),
        ("Company", enquiry.company),
        ("Email", enquiry.email),
        ("Phone", enquiry.phone),
        ("Enquiry type", enquiry.enquiry_type),
    ]
    rows = [(label, value) for label, value in rows if value]
    table = "".join(
        f'<tr><td style="padding:6px 16px 6px 0;color:#687583">{label}</td>'
        f'<td style="padding:6px 0;color:#0B2742;font-weight:600">{html.escape(value)}</td></tr>'
        for label, value in rows
    )
    return {
        # Collapse whitespace so a pasted newline can't break the subject line.
        "subject": " ".join(f"New enquiry: {enquiry.enquiry_type} — {enquiry.name}".split()),
        "html": (
            '<div style="font-family:Arial,sans-serif;font-size:14px">'
            '<h2 style="color:#0B2742;margin:0 0 16px">New enquiry from the NAMOA website</h2>'
            f"<table>{table}</table>"
            f'<p style="white-space:pre-wrap;color:#13202B;margin-top:20px">{html.escape(enquiry.message)}</p>'
            "</div>"
        ),
        "text": "\n".join(f"{label}: {value}" for label, value in rows) + f"\n\n{enquiry.message}",
    }


def build_confirmation_email(enquiry: EnquiryCreate) -> dict:
    """The acknowledgement the enquirer receives, echoing back what they sent."""
    return {
        "subject": f"We've received your enquiry — {COMPANY_NAME}",
        "html": (
            '<div style="font-family:Arial,sans-serif;font-size:14px;color:#13202B">'
            '<div style="border-top:3px solid #C8A44D;padding-top:22px">'
            '<h2 style="color:#0B2742;margin:0 0 16px">Thank you for your enquiry</h2>'
            f'<p style="line-height:1.7;margin:0">Hi {html.escape(enquiry.name)}, your enquiry has '
            f"reached the {COMPANY_NAME} team and we'll get back to you shortly.</p>"
            '<div style="background:#F7F8FA;border-left:3px solid #C8A44D;padding:16px 20px;margin:24px 0">'
            '<div style="color:#687583;font-size:11px;letter-spacing:2px">'
            f"{html.escape(enquiry.enquiry_type.upper())}</div>"
            f'<p style="white-space:pre-wrap;margin:10px 0 0">{html.escape(enquiry.message)}</p>'
            "</div>"
            '<p style="color:#687583;line-height:1.7;margin:0">This is an automatic acknowledgement — '
            "reply to this email if you have anything to add.</p>"
            f'<p style="color:#0B2742;font-weight:600;margin:24px 0 0">{COMPANY_NAME}</p>'
            "</div></div>"
        ),
        "text": (
            f"Hi {enquiry.name},\n\n"
            f"Thank you for your enquiry. It has reached the {COMPANY_NAME} team and we'll get "
            "back to you shortly.\n\n"
            f"{enquiry.enquiry_type}\n{enquiry.message}\n\n"
            "This is an automatic acknowledgement — reply to this email if you have anything to "
            f"add.\n\n{COMPANY_NAME}"
        ),
    }


def send_through_resend(api_key: str, payload: dict) -> None:
    """Send one email. Raises a 502 if Resend doesn't take it."""
    try:
        response = requests.post(
            RESEND_API_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
            timeout=10,
        )
    except requests.RequestException:
        logger.exception("Resend request failed")
        raise HTTPException(status_code=502, detail=ENQUIRY_ERROR)

    if not response.ok:
        logger.error("Resend rejected the email: %s %s", response.status_code, response.text)
        raise HTTPException(status_code=502, detail=ENQUIRY_ERROR)


# A plain def, so FastAPI runs the blocking Resend calls in its threadpool.
@api_router.post("/enquiry")
def create_enquiry(enquiry: EnquiryCreate):
    if enquiry.website:
        # Answer like a success so bots get no signal to adapt to.
        return {"ok": True}

    api_key = os.environ.get("RESEND_API_KEY")
    recipients = [a.strip() for a in os.environ.get("ENQUIRY_TO_EMAIL", "").split(",") if a.strip()]
    if not api_key or not recipients:
        logger.error("Enquiry email is not configured: set RESEND_API_KEY and ENQUIRY_TO_EMAIL")
        raise HTTPException(status_code=503, detail=ENQUIRY_ERROR)

    sender = os.environ.get("ENQUIRY_FROM_EMAIL", DEFAULT_ENQUIRY_SENDER)

    send_through_resend(
        api_key,
        {
            "from": sender,
            "to": recipients,
            "reply_to": enquiry.email,
            **build_enquiry_email(enquiry),
        },
    )

    # The enquiry is already with NAMOA by this point, so a failed acknowledgement
    # is logged for us rather than reported to the sender as a failed enquiry.
    try:
        send_through_resend(
            api_key,
            {
                "from": sender,
                "to": [enquiry.email],
                "reply_to": recipients[0],
                **build_confirmation_email(enquiry),
            },
        )
    except HTTPException:
        logger.error("Enquiry acknowledgement to %s was not sent", enquiry.email)

    return {"ok": True}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()