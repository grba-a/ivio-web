export const SITE = {
  name: 'Ivio Bilić',
  role: 'All-in-one guide · Dubrovnik & Cavtat',
  phone: '+385 92 437 7722',
  phoneRaw: '385924377722',
  email: 'iviobilic@gmail.com',
  instagram: 'https://www.instagram.com/iviobilic',
  url: 'https://iviobilic.com',
  areas: ['Dubrovnik', 'Cavtat', 'Župa dubrovačka', 'Elaphiti Islands'],
} as const;

/**
 * Only what actually exists goes in here. Add a row the moment Ivio confirms an
 * account - the footer and the contact block both read from this list, so a new
 * network is one line and no markup.
 */
export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', handle: '@iviobilic', href: SITE.instagram },
] as const;

/** wa.me refuses a leading +, and every space must be encoded. */
export const whatsapp = (message: string) =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(message)}`;

export const DEFAULT_MESSAGE =
  "Hi Ivio — I found your site. I'd like to ask about a day in Dubrovnik.";
