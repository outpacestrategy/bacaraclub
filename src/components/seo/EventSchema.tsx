import { SITE, VENUE } from "@/lib/constants";
import type { UpcomingEvent } from "@/lib/events";
import { getEventUrl } from "@/lib/events";

/**
 * Event JSON-LD schema.
 *
 * Implements docs/implementation-plan.md §3.1. This is the single most
 * under-utilized SEO lever in Miami nightclub listings — without it Bacara is
 * invisible to Google's Events rich result surface and AI-search answer boxes
 * ("what's happening in Miami Beach this Saturday").
 *
 * Per the plan's template every upcoming event emits:
 *   - name              — "{Title} at Bacara" (brand anchored for entity resolution)
 *   - startDate         — ISO 8601 with Miami offset
 *   - endDate           — next calendar day (Bacara operates overnight)
 *   - eventStatus       — EventScheduled
 *   - eventAttendanceMode — OfflineEventAttendanceMode
 *   - location          — NightClub reference resolved by @id so Google merges
 *                         the entity with the sitewide NightClubSchema
 *   - performer         — PerformingGroup with the DJ / host line
 *   - offers            — Guest List (free) + Table Reservation (min price)
 *   - organizer         — Bacara Club (Organization, @id-linked to the home page)
 *
 * Rendered on:
 *   - `/events/[slug]` — canonical event page
 *   - Home (`/`), `/wednesdays`, `/saturdays` — one per upcoming card surfaced
 *     on the page, so each card has its own rich-result candidate
 *
 * Server component. Zero client JS. Uses dangerouslySetInnerHTML because the
 * official Google rich-result guidance for Event is <script type="application/ld+json">.
 */
export function EventSchema({ event }: { event: UpcomingEvent }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": getEventUrl(event.slug),
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE.url}${event.heroImage}`],
    url: getEventUrl(event.slug),
    location: {
      // Reference the sitewide NightClub entity by @id so Google merges the
      // Event into the same business entity in its graph.
      "@type": "NightClub",
      "@id": `${SITE.url}#nightclub`,
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: VENUE.street,
        addressLocality: VENUE.city,
        addressRegion: VENUE.region,
        postalCode: VENUE.postalCode,
        addressCountry: VENUE.country,
      },
    },
    performer: {
      "@type": "PerformingGroup",
      name: event.host,
    },
    organizer: {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Guest List",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/guestlist`,
        // validFrom = 30 days before event so Google's Events surface shows
        // the offer for the full ad-buying window
        validFrom: shiftDays(event.startDate, -30),
      },
      {
        "@type": "Offer",
        name: "Table Reservation",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: event.tableMinPrice,
          priceCurrency: "USD",
        },
        availability: "https://schema.org/LimitedAvailability",
        url: `${SITE.url}/reserve?event=${event.slug}`,
        validFrom: shiftDays(event.startDate, -30),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Return an ISO string shifted by `days` from the given start date. Used for
 * Offer.validFrom so Google surfaces the event's offer in the ad-eligible
 * window instead of only on the day itself.
 */
function shiftDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
