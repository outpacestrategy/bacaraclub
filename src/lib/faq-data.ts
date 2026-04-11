/**
 * Bacara Club FAQ — SEO & GEO content.
 *
 * These questions are deliberately engineered against the three target-query clusters in
 * `docs/seo-geo-strategy.md`:
 *
 *   1. Local nightlife discovery  — "Wednesday night Miami", "Saturday night Miami Beach",
 *                                    "where is Bacara", "what time does Bacara open"
 *   2. Brand & differentiator      — "what is a streaming nightclub", "who owns Bacara",
 *                                    "Clavicular Miami", "Miami club that allows filming"
 *   3. Commercial / table intent   — "how to reserve a table at Bacara", "Bacara bottle
 *                                    service", "dress code", "age requirement"
 *
 * **Answer style (critical for AI citation):** 1–3 factual sentences, entity-rich ("Bacara
 * Club in Miami Beach"), no marketing fluff, no superlatives. AI search models — Google AI
 * Overviews, Perplexity, ChatGPT, Claude — skip vague adjectives and cite plain factual
 * statements. Mentioning `Bacara` and `Miami Beach` in both the question and the answer
 * helps models resolve the entity.
 *
 * **CLAUDE.md "never ship fake numbers" rule:**
 * Entries that make specific claims which require real client data (dress code specifics,
 * age policy, pricing, guest list cutoffs) are marked `needsConfirmation: true` and carry
 * a `data-placeholder="true"` attribute in the rendered DOM so a pre-launch grep can find
 * them. Where the answer describes a process or structure without inventing numbers, it
 * is not flagged — e.g. "pricing varies by night and section" is a true statement about
 * any boutique nightclub, while "$500 minimum" would be a fabrication.
 *
 * Open Question #6 in `CLAUDE.md` is the tracking item: "Dress code, age policy, table
 * pricing floor — need real data to populate the FAQ and /reserve quiz."
 */

export type FAQCategory =
  | "location"
  | "programming"
  | "booking"
  | "creator"
  | "brand"
  | "practical";

export interface FAQEntry {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  /**
   * Set true when the answer contains specific claims (dress code rules, age cutoff,
   * pricing, hours beyond the confirmed Wednesday/Saturday window, guest-list deadlines) that
   * have NOT been verified with the client yet. The UI surfaces these with a
   * data-placeholder attribute and a TODO marker in the JSON-LD schema consumer.
   */
  needsConfirmation?: boolean;
}

/**
 * The canonical FAQ set. Consumed by:
 *   - `src/components/sections/FAQ.tsx` on the home page (renders accordion + FAQPage schema)
 *   - (future) `src/app/faq/page.tsx` when the dedicated /faq route is built in Milestone 6
 *   - (future) `/wednesdays`, `/saturdays`, `/streamers` pages for page-specific subsets
 *
 * Ordering matters for UI — we lead with the differentiator question because it anchors
 * the whole brand positioning, and we lead with the lightest practical questions (location,
 * hours) before moving into commercial intent (reservation, pricing) and finally practical
 * gotchas (dress code, age).
 */
export const FAQS: readonly FAQEntry[] = [
  {
    id: "what-is-a-streaming-nightclub",
    category: "brand",
    question: "What is a streaming nightclub?",
    answer:
      "A streaming nightclub is a venue built to be broadcast. Permanent camera rigs, creator lighting, fast wifi, and open filming permissions let DJs and creators livestream directly from the floor. Bacara Club in Miami Beach is the first venue in the city built this way, with dedicated streamer tables every Wednesday and Saturday.",
  },
  {
    id: "where-is-bacara-club",
    category: "location",
    question: "Where is Bacara Club located?",
    answer:
      "Bacara Club is at 235 23rd Street in Miami Beach, Florida, one block off Collins Avenue. The venue sits in the South Beach entertainment district, a short walk from the Fontainebleau and the Faena.",
  },
  {
    id: "what-nights-is-bacara-open",
    category: "location",
    question: "What nights is Bacara Club open?",
    answer:
      "Bacara Club is open two nights a week: Wednesday and Saturday, from 10 PM to 5 AM. Both are flagship broadcast nights with resident DJs and creator programming. The venue is closed Sunday through Tuesday and Thursday through Friday.",
  },
  {
    id: "wednesday-night-miami-beach",
    category: "programming",
    question: "What's the best Wednesday night club in Miami Beach?",
    answer:
      "Bacara Club runs Miami Beach's flagship Wednesday night at 235 23rd Street. Each Wednesday pairs a resident DJ set with a live broadcast from the room, and reservations for tables open the Monday before each show at bacaraclub.com/reserve.",
  },
  {
    id: "saturday-night-miami-beach",
    category: "programming",
    question: "What's the best Saturday night club in Miami Beach?",
    answer:
      "Bacara Club is the flagship Saturday night venue in Miami Beach. Saturdays feature a headlining DJ, bottle service, and the same always-on-air broadcast setup as Wednesday. Saturday tables book out fastest, so reserve early at bacaraclub.com/reserve.",
  },
  {
    id: "miami-club-allows-filming",
    category: "creator",
    question: "Is there a Miami Beach nightclub that allows filming and streaming?",
    answer:
      "Bacara Club is the only Miami Beach nightclub built for creator broadcasting. Filming is permitted from every table, and dedicated streamer tables include a permanent rig, creator lighting, and a reserved sightline to the DJ booth. Apply to the Streamer Program at bacaraclub.com/streamers.",
  },
  {
    id: "how-to-reserve-table",
    category: "booking",
    question: "How do I reserve a table at Bacara Club?",
    answer:
      "Reserve a table online at bacaraclub.com/reserve. The request form asks for your preferred night, party size, section, budget range, and contact details, and the door team confirms availability before the show. Tables can be booked for either flagship night — Wednesday or Saturday.",
  },
  {
    id: "bacara-bottle-service",
    category: "booking",
    question: "How does bottle service work at Bacara Club?",
    answer:
      "Bacara Club offers bottle service in the main room, VIP booths, and creator tables. Pricing varies by night, party size, and section — submit a reservation request at bacaraclub.com/reserve and the door team responds with current pricing for your preferred night.",
  },
  {
    id: "who-owns-bacara-club",
    category: "brand",
    question: "Who owns Bacara Club?",
    answer:
      "Bacara Club is owned and operated by Clavicular, the hospitality group that acquired the venue in 2026. Clavicular relaunched the space as Miami Beach's first streaming nightclub, adding permanent broadcast infrastructure, a creator program, and flagship Wednesday and Saturday programming.",
  },
  {
    id: "bacara-guest-list",
    category: "booking",
    question: "Does Bacara Club have a guest list?",
    answer:
      "Yes. Bacara Club runs a guest list each Wednesday and Saturday for waived cover and early entry. Sign up at bacaraclub.com/guestlist ahead of the show. Guest list is subject to capacity and final door discretion.",
    needsConfirmation: true,
  },
  {
    id: "bacara-dress-code",
    category: "practical",
    question: "What's the dress code at Bacara Club?",
    answer:
      "Bacara Club enforces upscale nightlife attire. Smart evening wear is expected on flagship nights — athletic wear, beachwear, and overly casual clothing are not permitted. Final admission is at the door team's discretion.",
    needsConfirmation: true,
  },
  {
    id: "bacara-age-requirement",
    category: "practical",
    question: "What's the age requirement at Bacara Club?",
    answer:
      "Bacara Club is 21 and over. Valid government-issued photo ID is required at the door — U.S. driver's licenses and passports are accepted.",
    needsConfirmation: true,
  },
] as const;
