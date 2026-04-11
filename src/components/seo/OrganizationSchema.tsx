import { SITE } from "@/lib/constants";

/**
 * Organization JSON-LD schema.
 *
 * Complements NightClubSchema on the home page. NightClub covers the physical
 * venue for the Local Pack; Organization covers the brand entity for the
 * Knowledge Panel and is what Google uses to correlate the site with the
 * business's social profiles, logo, and domain authority signals.
 *
 * Per docs/seo-geo-strategy.md, the Organization + WebSite + NightClub trio is
 * the minimum-viable schema set for a venue like Bacara. Keep them in sync
 * whenever `SITE.url` or `SITE.instagram` change.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/brand/bacara-logo.png`,
    },
    sameAs: [SITE.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
