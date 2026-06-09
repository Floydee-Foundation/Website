import dotenv from "dotenv";

dotenv.config({
  path: new URL("../../../../.env", import.meta.url),
  override: false
});
dotenv.config({ override: false });

const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI,
  corsOrigins,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== "false",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  mailFrom: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "contact@floydeefoundation.org",
  foundationNotifyEmail: process.env.FOUNDATION_NOTIFY_EMAIL ?? "contact@floydeefoundation.org"
};
