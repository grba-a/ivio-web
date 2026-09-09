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
  "Hi Ivio — I found your website. Could you tell me what a day with you would look like?\n\nMy name: \nDates: ";

/**
 * The three questions that gate the tap: what will it cost, will anyone reply,
 * am I committing to something. With no price list on the page, leaving them
 * unanswered reads as concealment.
 *
 * Everything here is structurally true - there is no booking system, so nothing
 * CAN be charged or held. The one behavioural promise is the price in the first
 * reply: Ivio has to actually agree to do that.
 */
export const REASSURANCE = "I answer personally, and I'll send you a price in that first reply. No deposit, no booking form — nothing is fixed until we both agree it.";

/** Shorter form, for use directly under a button. */
export const REASSURANCE_SHORT = "No deposit, no form. I'll send you a price in the first reply.";
