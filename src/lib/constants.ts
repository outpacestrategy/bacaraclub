/**
 * Site-wide constants for Bacara Club.
 * Single source of truth for nav, venue info, and copy that appears in multiple places.
 */

export const SITE = {
  name: "Bacara Club",
  shortName: "Bacara",
  tagline: "Miami Beach's First Streaming Nightclub",
  description:
    "Miami Beach's first streaming nightclub. Wednesdays and Saturdays, always on air. Reserve a table at 235 23rd St, Miami Beach.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bacaraclub.com",
  instagram: "https://www.instagram.com/bacaraclub/",
  instagramHandle: "@bacaraclub",
} as const;

export const VENUE = {
  street: "235 23rd St",
  city: "Miami Beach",
  region: "FL",
  postalCode: "33139",
  country: "US",
  get fullAddress() {
    return `${this.street}, ${this.city}, ${this.region} ${this.postalCode}`;
  },
  // Bacara operates Wednesday and Saturday only. Overnight hours cross midnight.
  hoursHuman: "Wed & Sat · 10:00 PM – 5:00 AM",
  // Placeholder — replace once Drew confirms the real number (Open Question #5 in CLAUDE.md).
  phoneDisplay: null as string | null,
  phoneTel: null as string | null,
  email: "admin@bacaraclub.com",
} as const;

export type NavLink = {
  label: string;
  href: string;
};

/**
 * Primary navigation — kept intentionally short per site-plan.md.
 * EVENTS | RESERVE | STREAMERS | PRIVATE | ABOUT, with the Reserve a Table button as the final CTA.
 */
export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Events", href: "/events" },
  { label: "Reserve", href: "/reserve" },
  { label: "Streamers", href: "/streamers" },
  { label: "Private", href: "/private" },
  { label: "About", href: "/about" },
] as const;

/**
 * Footer nav — fuller map of the site, grouped in the footer component itself.
 */
export const FOOTER_NAV = {
  visit: [
    { label: "Wednesdays", href: "/wednesdays" },
    { label: "Saturdays", href: "/saturdays" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
  ],
  book: [
    { label: "Reserve a Table", href: "/reserve" },
    { label: "Guest List", href: "/guestlist" },
    { label: "Private Events", href: "/private" },
    { label: "Streamer Program", href: "/streamers" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

/**
 * Primary CTA copy — kept centralized so we never drift between pages.
 * Every page has a Reserve a Table CTA above the fold per conversion principles.
 */
export const CTA = {
  reserve: { label: "Reserve a Table", href: "/reserve" },
  guestlist: { label: "Guest List", href: "/guestlist" },
} as const;
