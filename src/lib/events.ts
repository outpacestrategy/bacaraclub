/**
 * Canonical upcoming-event data.
 *
 * Single source of truth for every surface that renders a Wednesday / Saturday
 * lineup card: the home upcoming-events carousel, /events, /events/[slug],
 * /wednesdays + /saturdays lineup blocks, the /reserve quiz step 1
 * (event-first flow per docs/implementation-plan.md §1.1), and the Event
 * JSON-LD rendered on those pages per §3.1.
 *
 * Every field here is a placeholder until Clavicular's team supplies real
 * programming — the DJ names, themes, and images are intentionally generic so
 * a pre-launch QA can grep `data-placeholder` and confirm nothing fake shipped.
 * Per CLAUDE.md's "never ship fake numbers / names / reviews" rule.
 *
 * Authoring notes:
 *   - `startDate` / `endDate` are ISO 8601 with the Miami timezone offset.
 *     Bacara operates overnight (10 PM → 5 AM) so `endDate` is the *next*
 *     calendar day. schema.org `Event.endDate` supports this form.
 *   - `slug` is URL-safe; it's the only identifier /events/[slug] resolves on.
 *   - `heroImage` is a path under `/public/` — replace with real imagery on
 *     launch. Until then we use the existing site hero poster so nothing
 *     fabricated (stock nightlife shots, picsum faces) ships to the event page.
 *   - `offers` follows the Event-schema contract in implementation-plan.md §3.1.
 *     `priceSpecification.minPrice` is a directional range floor and maps to
 *     the same numbers rendered in the /wednesdays + /saturdays pricing block.
 *     Real numbers land here once Drew confirms (Open Question #6 in CLAUDE.md).
 */

import { SITE } from "@/lib/constants";

export type EventNight = "wednesday" | "saturday" | "special";

export type UpcomingEvent = {
  /** URL-safe identifier for /events/[slug] */
  slug: string;
  /** Which pillar night this event belongs to */
  night: EventNight;
  /** Human display of the date; used on cards ("WED · APR 15") */
  dateLine: string;
  /** Card/SEO title. Include "Bacara" for brand entity repetition (GEO). */
  title: string;
  /** Performer / DJ / theme line — plain text, no HTML */
  host: string;
  /** ISO 8601 start with Miami offset (-04:00 during DST, -05:00 otherwise) */
  startDate: string;
  /** ISO 8601 end — this is typically the *next* calendar day (cross-midnight) */
  endDate: string;
  /** Public hero image for the event */
  heroImage: string;
  /** Alt text for the hero image (plain factual description) */
  heroAlt: string;
  /** Short factual description for SEO meta + schema.org Event.description */
  description: string;
  /** Tailwind gradient classes used as a placeholder card cover */
  gradient: string;
  /** Indicative table minimum (USD) for the Event offer schema */
  tableMinPrice: number;
};

/**
 * Order: earliest first. UI consumers sort by startDate to stay safe if this
 * is ever edited out of order. Keep the first 6 slots as a rolling 3-week
 * window of upcoming Wed + Sat dates.
 */
export const UPCOMING_EVENTS: readonly UpcomingEvent[] = [
  {
    slug: "saturday-apr-11-2026",
    night: "saturday",
    dateLine: "SAT · APR 11",
    title: "Saturday Broadcast at Bacara",
    host: "Resident · TBD",
    startDate: "2026-04-11T22:00:00-04:00",
    endDate: "2026-04-12T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club main room during a Saturday night broadcast.",
    description:
      "Saturday night at Bacara Club — Miami Beach's first streaming nightclub. Resident DJ, bottle service, and a full broadcast of the room.",
    gradient: "from-accent/40 via-accent/5 to-transparent",
    tableMinPrice: 1500,
  },
  {
    slug: "wednesday-apr-15-2026",
    night: "wednesday",
    dateLine: "WED · APR 15",
    title: "Wednesday On Air at Bacara",
    host: "Resident · TBD",
    startDate: "2026-04-15T22:00:00-04:00",
    endDate: "2026-04-16T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club booth during a Wednesday night live broadcast.",
    description:
      "Wednesday night broadcast at Bacara Club on Miami Beach. Mid-week flagship, permanent camera rigs on the floor, and resident DJ.",
    gradient: "from-live/25 via-live/5 to-transparent",
    tableMinPrice: 1000,
  },
  {
    slug: "saturday-apr-18-2026",
    night: "saturday",
    dateLine: "SAT · APR 18",
    title: "Bacara Presents — Saturday",
    host: "Guest · TBD",
    startDate: "2026-04-18T22:00:00-04:00",
    endDate: "2026-04-19T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club crowd on a Saturday headline night.",
    description:
      "Bacara Presents — a headline Saturday at Miami Beach's first streaming nightclub. Guest DJ, bottle service, and the Bacara broadcast rig on air all night.",
    gradient: "from-purple-600/35 via-purple-600/5 to-transparent",
    tableMinPrice: 1500,
  },
  {
    slug: "wednesday-apr-22-2026",
    night: "wednesday",
    dateLine: "WED · APR 22",
    title: "Mid-Week Stream at Bacara",
    host: "Resident · TBD",
    startDate: "2026-04-22T22:00:00-04:00",
    endDate: "2026-04-23T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club streamer table mid-broadcast on a Wednesday.",
    description:
      "Mid-week streaming night at Bacara Club Miami Beach. Creator tables, resident DJ, and the full broadcast rig live from 10 PM.",
    gradient: "from-emerald-600/30 via-emerald-600/5 to-transparent",
    tableMinPrice: 1000,
  },
  {
    slug: "saturday-apr-25-2026",
    night: "saturday",
    dateLine: "SAT · APR 25",
    title: "Late Spring Saturday",
    host: "Guest · TBD",
    startDate: "2026-04-25T22:00:00-04:00",
    endDate: "2026-04-26T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club dance floor on a late spring Saturday.",
    description:
      "Late spring Saturday at Bacara — Miami Beach's first streaming nightclub. Guest DJ and bottle service at every section.",
    gradient: "from-amber-600/35 via-amber-600/5 to-transparent",
    tableMinPrice: 1500,
  },
  {
    slug: "wednesday-apr-29-2026",
    night: "wednesday",
    dateLine: "WED · APR 29",
    title: "Creator Night — Wednesday Takeover",
    host: "Streamer Takeover",
    startDate: "2026-04-29T22:00:00-04:00",
    endDate: "2026-04-30T05:00:00-04:00",
    heroImage: "/brand/bacara-hero-poster.jpg",
    heroAlt: "Bacara Club creator table during a Wednesday streamer takeover.",
    description:
      "Streamer takeover Wednesday at Bacara — rotating creators broadcasting live from dedicated creator tables in the main room.",
    gradient: "from-sky-600/35 via-sky-600/5 to-transparent",
    tableMinPrice: 1000,
  },
] as const;

/** Filter helpers used by /wednesdays, /saturdays, and the reserve quiz. */
export function getUpcomingEventsByNight(
  night: EventNight,
): readonly UpcomingEvent[] {
  return UPCOMING_EVENTS.filter((e) => e.night === night);
}

/** Slug lookup for the dynamic route. */
export function getEventBySlug(slug: string): UpcomingEvent | undefined {
  return UPCOMING_EVENTS.find((e) => e.slug === slug);
}

/**
 * Canonical absolute URL for an event. Uses SITE.url so /events/[slug] and
 * the Event JSON-LD both resolve to the same href.
 */
export function getEventUrl(slug: string): string {
  return `${SITE.url}/events/${slug}`;
}
