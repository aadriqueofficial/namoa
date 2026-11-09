// Vercel serverless function behind POST /api/enquiry.
//
// The site is deployed to Vercel as a static build, so backend/server.py has no
// process to run in; this mirrors its enquiry endpoint — same validation, same
// two emails through Resend. Keep the two in step when either changes.
//
// Set in the Vercel project (Settings -> Environment Variables):
//   RESEND_API_KEY      a Resend API key with send permission
//   ENQUIRY_TO_EMAIL    inbox that receives enquiries (comma-separate several)
//   ENQUIRY_FROM_EMAIL  sender on a domain verified in Resend

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_SENDER = "NAMOA Website <onboarding@resend.dev>";
const COMPANY_NAME = "NAMOA Global Ventures";
const SEND_ERROR = "We couldn't send your enquiry. Please try again shortly.";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const clean = (value) => (typeof value === "string" ? value.trim() : "");

/* Returns the trimmed fields, or the one message to show the sender. Each
   message names the field at fault, so the form never says "check your
   details" without saying which. */
function validate(body) {
  const f = {
    name: clean(body.name),
    company: clean(body.company),
    email: clean(body.email),
    phone: clean(body.phone),
    enquiry_type: clean(body.enquiry_type),
    message: clean(body.message),
    website: clean(body.website),
  };

  if (!f.name) return { error: "Please enter your name." };
  if (f.name.length > 120) return { error: "That name is too long." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (f.email.length > 254) return { error: "That email address is too long." };
  if (f.company.length > 160) return { error: "That company name is too long." };
  if (f.phone.length > 40) return { error: "That phone number is too long." };
  if (!f.enquiry_type) return { error: "Please choose an enquiry type." };
  if (f.enquiry_type.length > 80) return { error: "Please choose an enquiry type." };
  if (f.message.length < 10) {
    return { error: "Please tell us a little more — at least 10 characters." };
  }
  if (f.message.length > 5000) return { error: "That message is too long." };

  return { fields: f };
}

function notificationEmail(f) {
  const rows = [
    ["Name", f.name],
    ["Company", f.company],
    ["Email", f.email],
    ["Phone", f.phone],
    ["Enquiry type", f.enquiry_type],
  ].filter(([, value]) => value);

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#687583">${label}</td>` +
        `<td style="padding:6px 0;color:#0B2742;font-weight:600">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return {
    // Collapse whitespace so a pasted newline can't break the subject line.
    subject: `New enquiry: ${f.enquiry_type} — ${f.name}`.split(/\s+/).join(" "),
    html:
      '<div style="font-family:Arial,sans-serif;font-size:14px">' +
      '<h2 style="color:#0B2742;margin:0 0 16px">New enquiry from the NAMOA website</h2>' +
      `<table>${table}</table>` +
      `<p style="white-space:pre-wrap;color:#13202B;margin-top:20px">${escapeHtml(f.message)}</p>` +
      "</div>",
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n") + `\n\n${f.message}`,
  };
}

function acknowledgementEmail(f) {
  return {
    subject: `We've received your enquiry — ${COMPANY_NAME}`,
    html:
      '<div style="font-family:Arial,sans-serif;font-size:14px;color:#13202B">' +
      '<div style="border-top:3px solid #C8A44D;padding-top:22px">' +
      '<h2 style="color:#0B2742;margin:0 0 16px">Thank you for your enquiry</h2>' +
      `<p style="line-height:1.7;margin:0">Hi ${escapeHtml(f.name)}, your enquiry has reached ` +
      `the ${COMPANY_NAME} team and we'll get back to you shortly.</p>` +
      '<div style="background:#F7F8FA;border-left:3px solid #C8A44D;padding:16px 20px;margin:24px 0">' +
      `<div style="color:#687583;font-size:11px;letter-spacing:2px">${escapeHtml(
        f.enquiry_type.toUpperCase()
      )}</div>` +
      `<p style="white-space:pre-wrap;margin:10px 0 0">${escapeHtml(f.message)}</p>` +
      "</div>" +
      '<p style="color:#687583;line-height:1.7;margin:0">This is an automatic acknowledgement — ' +
      "reply to this email if you have anything to add.</p>" +
      `<p style="color:#0B2742;font-weight:600;margin:24px 0 0">${COMPANY_NAME}</p>` +
      "</div></div>",
    text:
      `Hi ${f.name},\n\n` +
      `Thank you for your enquiry. It has reached the ${COMPANY_NAME} team and we'll get ` +
      "back to you shortly.\n\n" +
      `${f.enquiry_type}\n${f.message}\n\n` +
      "This is an automatic acknowledgement — reply to this email if you have anything to " +
      `add.\n\n${COMPANY_NAME}`,
  };
}

async function sendThroughResend(apiKey, payload) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ detail: "Method not allowed." });
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return res.status(400).json({ detail: "Please check your details and try again." });
    }
  }

  const { fields, error } = validate(body);
  if (error) return res.status(422).json({ detail: error });

  // Honeypot: the form hides this field from people, so any value means a bot.
  // Answer like a success so bots get no signal to adapt to.
  if (fields.website) return res.status(200).json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.ENQUIRY_TO_EMAIL || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey || recipients.length === 0) {
    console.error("Enquiry email is not configured: set RESEND_API_KEY and ENQUIRY_TO_EMAIL");
    return res.status(503).json({ detail: SEND_ERROR });
  }

  const from = process.env.ENQUIRY_FROM_EMAIL || DEFAULT_SENDER;

  try {
    await sendThroughResend(apiKey, {
      from,
      to: recipients,
      reply_to: fields.email,
      ...notificationEmail(fields),
    });
  } catch (err) {
    console.error("Resend rejected the enquiry email:", err.message);
    return res.status(502).json({ detail: SEND_ERROR });
  }

  // NAMOA has the enquiry by this point, so a failed acknowledgement is logged
  // for us rather than reported to the sender as a failed enquiry.
  try {
    await sendThroughResend(apiKey, {
      from,
      to: [fields.email],
      reply_to: recipients[0],
      ...acknowledgementEmail(fields),
    });
  } catch (err) {
    console.error(`Enquiry acknowledgement to ${fields.email} was not sent:`, err.message);
  }

  return res.status(200).json({ ok: true });
};
