import { Router, type Response } from "express";
import { env } from "../config/env.js";
import { sendMail } from "../services/mailer.js";

export const inquiriesRouter = Router();

const donationPrograms = new Set([
  "AAROHI",
  "SAKHI",
  "VIDYA",
  "Where needed most"
]);

const donationFrequencies = new Set(["One-time", "Monthly"]);

const contactIntents = new Set([
  "Partner with the foundation",
  "Volunteer",
  "Book a program",
  "Request media information"
]);

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getEmail(value: unknown) {
  const email = getString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function getPositiveAmount(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function asHtmlList(items: Array<[string, string | number]>) {
  return `<ul>${items
    .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</li>`)
    .join("")}</ul>`;
}

function sendError(response: Response, error: unknown) {
  console.error("Inquiry email failed", error instanceof Error ? error.message : error);
  response.status(502).json({
    ok: false,
    message: "We could not send your enquiry right now. Please try again or email contact@floydeefoundation.org."
  });
}

inquiriesRouter.post("/api/donation-inquiries", async (request, response) => {
  const name = getString(request.body.name);
  const email = getEmail(request.body.email);
  const frequency = getString(request.body.frequency);
  const amount = getPositiveAmount(request.body.amount);
  const program = getString(request.body.program);
  const consentStatus = getString(request.body.consentStatus) || "Accepted by submitting the donation enquiry form.";

  if (!name || !email || !donationFrequencies.has(frequency) || !amount || !donationPrograms.has(program)) {
    response.status(400).json({
      ok: false,
      message: "Please complete the required donation fields correctly."
    });
    return;
  }

  const donorText = [
    `Dear ${name},`,
    "",
    "Thank you for supporting Floydee Future Foundation.",
    "We have received your donation enquiry. Our team will connect with donation/payment details and 80G receipt information.",
    "",
    "With gratitude,",
    "Floydee Future Foundation"
  ].join("\n");

  const donorHtml = `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for supporting Floydee Future Foundation.</p>
    <p>We have received your donation enquiry. Our team will connect with donation/payment details and 80G receipt information.</p>
    <p>With gratitude,<br />Floydee Future Foundation</p>
  `;

  const internalFields: Array<[string, string | number]> = [
    ["Name", name],
    ["Email", email],
    ["Frequency", frequency],
    ["Amount", `Rs ${amount}`],
    ["Program focus", program],
    ["Consent status", consentStatus]
  ];

  const internalText = [
    "New donation enquiry received.",
    "",
    ...internalFields.map(([label, value]) => `${label}: ${value}`)
  ].join("\n");

  try {
    await Promise.all([
      sendMail({
        to: email,
        subject: "Thank you for supporting Floydee Future Foundation",
        text: donorText,
        html: donorHtml
      }),
      sendMail({
        to: env.foundationNotifyEmail,
        subject: "New donation enquiry",
        text: internalText,
        html: `<p>New donation enquiry received.</p>${asHtmlList(internalFields)}`
      })
    ]);

    response.json({
      ok: true,
      message: "Thank you. We emailed your confirmation and the Floydee team will connect with donation details."
    });
  } catch (error) {
    sendError(response, error);
  }
});

inquiriesRouter.post("/api/contact-inquiries", async (request, response) => {
  const name = getString(request.body.name);
  const email = getEmail(request.body.email);
  const intent = getString(request.body.intent);
  const message = getString(request.body.message);

  if (!name || !email || !contactIntents.has(intent) || !message) {
    response.status(400).json({
      ok: false,
      message: "Please complete the required contact fields correctly."
    });
    return;
  }

  const visitorText = [
    `Dear ${name},`,
    "",
    "Thank you for contacting Floydee Future Foundation.",
    "We have received your enquiry and our team will get in touch soon.",
    "",
    "Warmly,",
    "Floydee Future Foundation"
  ].join("\n");

  const visitorHtml = `
    <p>Dear ${escapeHtml(name)},</p>
    <p>Thank you for contacting Floydee Future Foundation.</p>
    <p>We have received your enquiry and our team will get in touch soon.</p>
    <p>Warmly,<br />Floydee Future Foundation</p>
  `;

  const internalFields: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Intent", intent],
    ["Message", message]
  ];

  const internalText = [
    "New contact enquiry received.",
    "",
    ...internalFields.map(([label, value]) => `${label}: ${value}`)
  ].join("\n");

  try {
    await Promise.all([
      sendMail({
        to: email,
        subject: "Thank you for contacting Floydee Future Foundation",
        text: visitorText,
        html: visitorHtml
      }),
      sendMail({
        to: env.foundationNotifyEmail,
        subject: "New contact enquiry",
        text: internalText,
        html: `<p>New contact enquiry received.</p>${asHtmlList(internalFields)}`
      })
    ]);

    response.json({
      ok: true,
      message: "Thank you. We emailed your confirmation and the Floydee team will get in touch soon."
    });
  } catch (error) {
    sendError(response, error);
  }
});
