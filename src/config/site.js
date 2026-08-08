/** Public site contact — edit WhatsApp number here. */
export const REGISTRATION_FEE_GEL = 600;

/** Digits only with country code, no + or spaces. Example: 9955XXXXXXXX */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '') || '995568002517';

export const CITY = 'Batumi';

export function whatsappRegistrationUrl({ name, phone, email } = {}) {
  const lines = [
    'Hello! I want to register on the website.',
    '',
    `Name: ${name || '—'}`,
    `Phone: ${phone || '—'}`,
    email ? `Email: ${email}` : null,
    `City: ${CITY}`,
    `Registration fee: ${REGISTRATION_FEE_GEL} GEL`,
    '',
    'Please tell me where to pay.',
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
