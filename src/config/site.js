/** საიტის კონტაქტი — WhatsApp ნომერი აქ შეცვალეთ. */
export const REGISTRATION_FEE_GEL = 600;

/** მხოლოდ ციფრები, ქვეყნის კოდით. მაგ: 9955XXXXXXXX */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '') || '995568002517';

export const CITY = 'ბათუმი';

export function whatsappRegistrationUrl({ name, phone, email } = {}) {
  const lines = [
    'გამარჯობა! მინდა დავრეგისტრირდე საიტზე.',
    '',
    `სახელი: ${name || '—'}`,
    `ტელეფონი: ${phone || '—'}`,
    email ? `ელფოსტა: ${email}` : null,
    `ქალაქი: ${CITY}`,
    `რეგისტრაციის საფასური: ${REGISTRATION_FEE_GEL}₾`,
    '',
    'გთხოვთ მომწეროთ, სად გადავიხადო.',
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
