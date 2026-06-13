import { Router, type Response } from "express";
import { env } from "../config/env.js";
import { sendMail } from "../services/mailer.js";
import { isLocale, translate } from "@floydee/shared";

export const inquiriesRouter = Router();

const donationPrograms = new Set([
  "AAROHI",
  "SAKHI",
  "VIDYA",
  "Where needed most"
]);

const donationFrequencies = new Set(["One-time", "Monthly"]);
const donationTargetTypes = new Set(["program", "campaign", "workshop", "generic"]);

const contactIntents = new Set([
  "Partner with the foundation",
  "Volunteer",
  "Collaborate With Us",
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

function logOptionalEmailFailure(label: string, error: unknown) {
  console.warn(label, error instanceof Error ? error.message : error);
}

inquiriesRouter.post("/api/donation-inquiries", async (request, response) => {
  const locale = isLocale(request.body.locale) ? request.body.locale : "en";
  const name = getString(request.body.name);
  const email = getEmail(request.body.email);
  const frequency = getString(request.body.frequency);
  const amount = getPositiveAmount(request.body.amount);
  const program = getString(request.body.program);
  const targetName = getString(request.body.targetName);
  const targetSlug = getString(request.body.targetSlug);
  const targetType = getString(request.body.targetType) || "program";
  const consentStatus = getString(request.body.consentStatus) || "Accepted by submitting the donation enquiry form.";
  const needsProgram = targetType === "program" || targetType === "campaign" || targetType === "workshop";
  const needsTargetName = targetType === "campaign" || targetType === "workshop";

  if (
    !name ||
    !email ||
    !donationFrequencies.has(frequency) ||
    !amount ||
    !donationTargetTypes.has(targetType) ||
    (needsProgram && !donationPrograms.has(program)) ||
    (needsTargetName && (!targetName || !targetSlug))
  ) {
    response.status(400).json({
      ok: false,
      message: "Please complete the required donation fields correctly."
    });
    return;
  }

  const donorText = [
    `${translate(locale, "Dear")} ${name},`,
    "",
    translate(locale, "Thank you for supporting Floydee Future Foundation."),
    translate(locale, "We have received your donation enquiry. Our team will connect with donation/payment details and 80G receipt information."),
    "",
    translate(locale, "With gratitude,"),
    "Floydee Future Foundation"
  ].join("\n");

  const donorHtml = `
    <p>${escapeHtml(translate(locale, "Dear"))} ${escapeHtml(name)},</p>
    <p>${escapeHtml(translate(locale, "Thank you for supporting Floydee Future Foundation."))}</p>
    <p>${escapeHtml(translate(locale, "We have received your donation enquiry. Our team will connect with donation/payment details and 80G receipt information."))}</p>
    <p>${escapeHtml(translate(locale, "With gratitude,"))}<br />Floydee Future Foundation</p>
  `;

  const internalFields: Array<[string, string | number]> = [
    ["Name", name],
    ["Email", email],
    ["Frequency", frequency],
    ["Amount", `Rs ${amount}`],
    ["Giving target", targetType],
    ["Program focus", program || "Generic donation"],
    ...(targetName ? [["Target name", targetName] as [string, string | number]] : []),
    ...(targetSlug ? [["Target slug", targetSlug] as [string, string | number]] : []),
    ["Consent status", consentStatus]
  ];

  const internalText = [
    "New donation enquiry received.",
    "",
    ...internalFields.map(([label, value]) => `${label}: ${value}`)
  ].join("\n");

  try {
    await sendMail({
      to: env.foundationNotifyEmail,
      subject: "New donation enquiry",
      text: internalText,
      html: `<p>New donation enquiry received.</p>${asHtmlList(internalFields)}`
    });

    const confirmationSent = await sendMail({
      to: email,
      subject: translate(locale, "Thank you for supporting Floydee Future Foundation"),
      text: donorText,
      html: donorHtml
    })
      .then(() => true)
      .catch((error) => {
        logOptionalEmailFailure("Donation confirmation email failed", error);
        return false;
      });

    response.json({
      ok: true,
      message: confirmationSent
        ? translate(locale, "Thank you. We emailed your confirmation and the Floydee team will connect with donation details.")
        : translate(locale, "Thank you. Your enquiry has been sent and the Floydee team will connect with donation details.")
    });
  } catch (error) {
    sendError(response, error);
  }
});

inquiriesRouter.post("/api/contact-inquiries", async (request, response) => {
  const locale = isLocale(request.body.locale) ? request.body.locale : "en";
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
    `${translate(locale, "Dear")} ${name},`,
    "",
    translate(locale, "Thank you for contacting Floydee Future Foundation."),
    translate(locale, "We have received your enquiry and our team will get in touch soon."),
    "",
    translate(locale, "Warmly,"),
    "Floydee Future Foundation"
  ].join("\n");

  const visitorHtml = `
    <p>${escapeHtml(translate(locale, "Dear"))} ${escapeHtml(name)},</p>
    <p>${escapeHtml(translate(locale, "Thank you for contacting Floydee Future Foundation."))}</p>
    <p>${escapeHtml(translate(locale, "We have received your enquiry and our team will get in touch soon."))}</p>
    <p>${escapeHtml(translate(locale, "Warmly,"))}<br />Floydee Future Foundation</p>
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
    await sendMail({
      to: env.foundationNotifyEmail,
      subject: "New contact enquiry",
      text: internalText,
      html: `<p>New contact enquiry received.</p>${asHtmlList(internalFields)}`
    });

    const confirmationSent = await sendMail({
      to: email,
      subject: translate(locale, "Thank you for contacting Floydee Future Foundation"),
      text: visitorText,
      html: visitorHtml
    })
      .then(() => true)
      .catch((error) => {
        logOptionalEmailFailure("Contact confirmation email failed", error);
        return false;
      });

    response.json({
      ok: true,
      message: confirmationSent
        ? translate(locale, "Thank you. We emailed your confirmation and the Floydee team will get in touch soon.")
        : translate(locale, "Thank you. Your enquiry has been sent and the Floydee team will get in touch soon.")
    });
  } catch (error) {
    sendError(response, error);
  }
});
