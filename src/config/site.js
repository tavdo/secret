/** Site contact — change WhatsApp number here. */
export const REGISTRATION_FEE_GEL = 600;

/** Digits only with country code. e.g. 9955XXXXXXXX */
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

/** Contact / booking via site WhatsApp. */
export function whatsappContactUrl({ profileName, slug, intent = 'message' } = {}) {
  const intentLine =
    intent === 'booking'
      ? 'მინდა ჯავშნის მოთხოვნა.'
      : 'მინდა დავუკავშირდე პროვაიდერს.';
  const lines = [
    'გამარჯობა!',
    intentLine,
    '',
    profileName ? `პროფილი: ${profileName}` : null,
    slug ? `ბმული: /profile/${slug}` : null,
    `ქალაქი: ${CITY}`,
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
