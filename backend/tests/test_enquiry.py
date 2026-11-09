import os
import sys
from pathlib import Path

import pytest
import requests
from fastapi.testclient import TestClient

# server.py reads these at import; nothing here touches the database.
os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "test_database")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import server  # noqa: E402

client = TestClient(server.app)

VALID = {
    "name": "Asha Rao",
    "company": "Rao Traders",
    "email": "asha@example.com",
    "phone": "+91 90000 00000",
    "enquiry_type": "Procurement Requirements",
    "message": "We need <b>bulk</b> cement supply in Hyderabad.",
    "website": "",
}


class FakeResponse:
    def __init__(self, status_code=200, text='{"id":"email_123"}'):
        self.status_code = status_code
        self.text = text
        self.ok = status_code < 400


class FakeResend:
    def __init__(self):
        self.calls = []
        self.response = FakeResponse()
        # Queued one-per-call responses; falls back to self.response once empty.
        self.responses = []
        self.error = None

    def post(self, url, **kwargs):
        self.calls.append({"url": url, **kwargs})
        if self.error:
            raise self.error
        return self.responses.pop(0) if self.responses else self.response


@pytest.fixture
def resend(monkeypatch):
    monkeypatch.setenv("RESEND_API_KEY", "re_test_key")
    monkeypatch.setenv("ENQUIRY_TO_EMAIL", "team@namoa.test, ops@namoa.test")
    monkeypatch.setenv("ENQUIRY_FROM_EMAIL", "NAMOA Website <enquiries@namoa.test>")
    fake = FakeResend()
    monkeypatch.setattr(server.requests, "post", fake.post)
    return fake


def test_sends_enquiry_email_through_resend(resend):
    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 200
    assert res.json() == {"ok": True}
    call = resend.calls[0]
    assert call["url"] == "https://api.resend.com/emails"
    assert call["headers"] == {"Authorization": "Bearer re_test_key"}
    body = call["json"]
    assert body["from"] == "NAMOA Website <enquiries@namoa.test>"
    assert body["to"] == ["team@namoa.test", "ops@namoa.test"]
    assert body["reply_to"] == "asha@example.com"
    assert body["subject"] == "New enquiry: Procurement Requirements — Asha Rao"
    assert "&lt;b&gt;bulk&lt;/b&gt;" in body["html"]
    assert "<b>bulk</b>" not in body["html"]
    assert "Company: Rao Traders" in body["text"]


def test_acknowledges_the_enquirer_after_notifying_namoa(resend):
    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 200
    notification, acknowledgement = (c["json"] for c in resend.calls)
    assert notification["to"] == ["team@namoa.test", "ops@namoa.test"]
    assert acknowledgement["from"] == "NAMOA Website <enquiries@namoa.test>"
    assert acknowledgement["to"] == ["asha@example.com"]
    # A reply to the acknowledgement should reach NAMOA, not the sender themselves.
    assert acknowledgement["reply_to"] == "team@namoa.test"
    assert acknowledgement["subject"] == "We've received your enquiry — NAMOA Global Ventures"
    assert "Asha Rao" in acknowledgement["html"]
    assert "PROCUREMENT REQUIREMENTS" in acknowledgement["html"]
    assert "&lt;b&gt;bulk&lt;/b&gt;" in acknowledgement["html"]
    assert "<b>bulk</b>" not in acknowledgement["html"]
    assert "Hi Asha Rao," in acknowledgement["text"]


def test_a_failed_acknowledgement_still_reports_the_enquiry_as_sent(resend):
    # NAMOA has the enquiry; only the courtesy copy back to the sender bounced.
    resend.responses = [FakeResponse(), FakeResponse(status_code=422, text='{"message":"invalid to"}')]

    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 200
    assert res.json() == {"ok": True}
    assert len(resend.calls) == 2


def test_blank_optional_fields_are_left_out_of_the_email(resend):
    res = client.post("/api/enquiry", json={**VALID, "company": "", "phone": "   "})

    assert res.status_code == 200
    text = resend.calls[0]["json"]["text"]
    assert "Company:" not in text
    assert "Phone:" not in text


def test_subject_cannot_carry_newlines(resend):
    client.post("/api/enquiry", json={**VALID, "name": "Asha\r\nBcc: x@evil.test"})

    assert "\n" not in resend.calls[0]["json"]["subject"]
    assert "\r" not in resend.calls[0]["json"]["subject"]


def test_honeypot_submission_is_accepted_but_not_sent(resend):
    res = client.post("/api/enquiry", json={**VALID, "website": "http://spam.test"})

    assert res.status_code == 200
    assert resend.calls == []


def test_invalid_email_is_rejected(resend):
    res = client.post("/api/enquiry", json={**VALID, "email": "not-an-email"})

    assert res.status_code == 422
    assert resend.calls == []


def test_missing_configuration_returns_503(resend, monkeypatch):
    monkeypatch.delenv("RESEND_API_KEY")

    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 503
    assert resend.calls == []


def test_resend_rejection_returns_502(resend):
    resend.response = FakeResponse(status_code=403, text='{"message":"domain is not verified"}')

    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 502
    assert res.json()["detail"] == server.ENQUIRY_ERROR


def test_resend_network_failure_returns_502(resend):
    resend.error = requests.ConnectionError("connection refused")

    res = client.post("/api/enquiry", json=VALID)

    assert res.status_code == 502
