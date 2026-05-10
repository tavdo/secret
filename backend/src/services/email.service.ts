import { getMailer } from "../config/mailer.js";
import { env } from "../config/env.js";

export async function sendTransactionalEmail(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const transporter = getMailer();

  const mail = transporter ?? null;
  const payload = `${opts.subject}\n\n${opts.text}`;

  if (!mail) {
    // Avoid silent failures during local development — logs are searchable.
    // eslint-disable-next-line no-console
    console.warn("[email stub]", { to: opts.to, preview: payload.slice(0, 500) });
    return { ok: false as const };
  }

  await mail.sendMail({
    from: env.EMAIL_FROM,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  });
  return { ok: true as const };
}
