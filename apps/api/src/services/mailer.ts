import nodemailer from "nodemailer";
import { env } from "../config/env.js";

type MailMessage = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

let transporter: nodemailer.Transporter | undefined;

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    throw new Error("Email service is not configured.");
  }

  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });

  return transporter;
}

export async function sendMail(message: MailMessage) {
  await getTransporter().sendMail({
    from: `"Floydee Future Foundation" <${env.mailFrom}>`,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html
  });
}
