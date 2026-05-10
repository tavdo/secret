import nodemailer from "nodemailer";
import { env } from "./env.js";

/** Returns null when SMTP isn't configured — callers should log URLs in dev instead. */
export function getMailer() {
  if (!env.SMTP_HOST || !env.SMTP_PORT) return null;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
}
