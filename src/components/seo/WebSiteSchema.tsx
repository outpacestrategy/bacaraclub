import { SITE } from "@/lib/constants";

/**
 * WebSite JSON-LD schema with SearchAction.
 *
 * Per docs/seo-geo-strategy.md, this is what gives the site a Google sitelinks search
 * box in the search results. When a user searches the brand name, Google shows a
 * search box that queries the site directly — big CTR win for brand queries.
 *
 * The `SearchAction` target points at /events?q={search_term_string} which is where
 * the future /events page search will live. Even though that page doesn't handle `q`
 * yet, declaring the schema now primes Google for when it does.
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/events?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
