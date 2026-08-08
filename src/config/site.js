/** Site contact / registration desk WhatsApp (admin). */
export const REGISTRATION_FEE_GEL = 600;

/** Digits only with country code. e.g. 9955XXXXXXXX */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '') || '995568002517';

export const CITY = 'ბათუმი';

export function normalizePhoneDigits(phone) {
  return String(phone || '').replace(/\D/g, '');
}

/** Direct call link for a provider phone. */
export function telHref(phone) {
  const d = normalizePhoneDigits(phone);
  return d ? `tel:+${d}` : null;
}

/** WhatsApp chat with a specific provider. */
export function whatsappToProfile(phone, { profileName } = {}) {
  const d = normalizePhoneDigits(phone);
  if (!d) return null;
  const hello = profileName
    ? `გამარჯობა, ${profileName}!`
    : 'გამარჯობა!';
  return `https://wa.me/${d}?text=${encodeURIComponent(hello)}`;
}

export function whatsappRegistrationUrl({
  name,
  phone,
  email,
  age,
  services,
  bio,
  rate,
} = {}) {
  const lines = [
    'გამარჯობა! მინდა დავრეგისტრირდე საიტზე.',
    '',
    `სახელი: ${name || '—'}`,
    `ტელეფონი: ${phone || '—'}`,
    age ? `ასაკი: ${age}` : null,
    email ? `ელფოსტა: ${email}` : null,
    `ქალაქი: ${CITY}`,
    rate ? `ტარიფი: ${rate}₾/სთ` : null,
    services ? `სერვისები:\n${services}` : null,
    bio ? `შესახებ:\n${bio}` : null,
    `რეგისტრაციის საფასური: ${REGISTRATION_FEE_GEL}₾`,
    '',
    'გთხოვთ მომწეროთ, სად გადავიხადო.',
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
