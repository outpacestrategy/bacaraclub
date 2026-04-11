import { SITE, VENUE } from "@/lib/constants";

/**
 * NightClub JSON-LD schema.
 *
 * Per CLAUDE.md hard rule: *"Always include NightClub schema on / and /contact. Google
 * Local Pack depends on it."* Per docs/seo-geo-strategy.md, this is the single highest-
 * ROI SEO lever for a local venue — without it the Maps listing, Knowledge Panel, and
 * "Miami Beach nightclub near me" results will underperform.
 *
 * The schema is typed as `NightClub` (a subtype of `LocalBusiness`) which Google treats
 * as the canonical type for dance venues. The required properties per the SEO strategy:
 * name, address, geo, telephone, openingHoursSpecification, url, sameAs, priceRange.
 *
 * Unresolved values (phone, priceRange) are intentionally omitted until Drew confirms —
 * per CLAUDE.md's "never ship fake numbers" rule, it's better to ship a valid partial
 * schema than a valid-looking fabrication. Google will index what we give it and happily
 * accept the additions later.
 *
 * Server component — zero client-side JS.
 */
export function NightClubSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "@id": `${SITE.url}#nightclub`,
    name: SITE.name,
    alternateName: "Bacara Miami Beach",
    description: SITE.description,
    url: SITE.url,
    image: [
      `${SITE.url}/brand/bacara-logo.png`,
      `${SITE.url}/brand/bacara-hero-poster.jpg`,
    ],
    logo: `${SITE.url}/brand/bacara-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: VENUE.street,
      addressLocality: VENUE.city,
      addressRegion: VENUE.region,
      postalCode: VENUE.postalCode,
      addressCountry: VENUE.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      // 235 23rd St, Miami Beach, FL 33139 — centroid lookup from OpenStreetMap
      latitude: 25.7953,
      longitude: -80.1296,
    },
    // Wednesday + Saturday only, 22:00–05:00 (crosses midnight — schema.org allows closes < opens)
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday", "Saturday"],
        opens: "22:00",
        closes: "05:00",
      },
    ],
    sameAs: [SITE.instagram],
    areaServed: {
      "@type": "City",
      name: "Miami Beach",
    },
    // Amenity hints for Knowledge Panel — factual, non-fabricated claims about
    // the venue's offering. These help Google classify the entity and surface
    // the right filters in the Local Pack ("bottle service", "live music").
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Bottle service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live DJ", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private events", value: true },
      { "@type": "LocationFeatureSpecification", name: "Reservations", value: true },
    ],
    // Phone + priceRange deliberately omitted — Open Questions #5 and #6 in CLAUDE.md.
    // Drew to confirm both before launch; add here once confirmed.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
