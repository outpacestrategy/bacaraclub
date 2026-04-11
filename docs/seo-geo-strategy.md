# Bacara Club — SEO & GEO Strategy

## Target searchers
Three high-value intent clusters feed the reservation funnel:

1. **Local nightlife discovery** — "best club Miami Beach," "Miami Beach nightclub tonight," "Wednesday night Miami," "Saturday night Miami Beach club," "where to go out Miami Beach this weekend"
2. **Brand & differentiator** — "Bacara Miami," "Bacara Club," "Clavicular club Miami," "streaming nightclub Miami," "Miami club that allows filming"
3. **Commercial / table intent** — "Miami Beach bottle service," "VIP table Miami club," "reserve table Miami nightclub," "Miami nightclub table pricing"

## Primary keyword → page mapping

| Query cluster | Landing page | Reason |
|---|---|---|
| "Wednesday night Miami," "Wednesday Miami Beach club" | `/wednesdays` | Evergreen URL, H1 match, weekly refresh |
| "Saturday night Miami," "Saturday Miami Beach club" | `/saturdays` | Same — these are the two pillar pages |
| "Bacara Miami," "Bacara Club," "Bacara Miami Beach" | `/` | Brand homepage |
| "streaming nightclub Miami," "Miami club allows filming," "creator club Miami" | `/streamers` | Unique defensible angle, low competition |
| "Miami Beach bottle service," "Miami VIP table" | `/reserve` | Commercial-intent landing |
| "private event nightclub Miami," "club buyout Miami" | `/private` | Matches Mona Club's proven split |
| "Miami nightclub FAQ" + long-tail questions | `/faq` | GEO bait — AI search cites FAQ schema heavily |

## On-page SEO checklist (applies to every page)

- Exactly one H1, matching the primary target query for that page
- Meta title under 60 characters, meta description under 160 characters, both unique per page
- Canonical URL set on every page
- OpenGraph + Twitter card tags with a unique OG image per pillar page
- Clean semantic HTML — `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`
- Image `alt` text that describes the content, not just "photo"
- Internal linking: every page links to `/reserve`, `/wednesdays`, and `/saturdays`
- Breadcrumb navigation with `BreadcrumbList` schema
- Page load under 2.5s LCP on mobile (per create-website skill performance targets)

## Structured data (JSON-LD) required

| Schema | Where | Purpose |
|---|---|---|
| `NightClub` (subtype of `LocalBusiness`) | `/` and `/contact` | Google Knowledge Panel, Maps, Local Pack |
| `Event` | Every upcoming night on `/events` and `/events/[slug]` | Google Events rich results |
| `FAQPage` | `/faq`, `/wednesdays`, `/saturdays`, `/streamers` | AI search citations + rich snippets |
| `BreadcrumbList` | Every page | Navigation context |
| `WebSite` with `SearchAction` | `/` root | Sitelinks search box |
| `ImageObject` | Gallery items | Image search visibility |

The `NightClub` schema must include: `name`, `address` (with street, city, state, postal), `geo` (lat/lng), `telephone`, `openingHoursSpecification` (Wed–Sat, 23:30–05:00), `url`, `sameAs` (IG, FB, TikTok), `priceRange` ("$$$"), `servesCuisine` or `amenityFeature` where applicable.

## GEO (Generative Engine Optimization) — getting cited by AI search

AI models (Google AI Overviews, Perplexity, ChatGPT, Claude) pull answers from pages with clean, factual, entity-rich content. To get cited:

1. **Write in Q&A format** on `/faq`, `/wednesdays`, `/saturdays`, `/streamers`. Every question is a query someone actually types; every answer is 1–3 factual sentences.
2. **Mention the entity explicitly and often** — "Bacara" and "Bacara Miami Beach" in H1, first paragraph, and throughout. AI models need to resolve the entity.
3. **State facts plainly** — address, hours, owner (Clavicular), what makes it different (streaming-first), what nights are flagship (Wednesday, Saturday). No marketing fluff — AI skips superlatives.
4. **Get cited externally** — press mentions (Miami New Times, Complex, Yahoo already picked up the Clavicular acquisition), blog posts, Miami nightlife guides. AI citation weight tracks external authority.
5. **Structured data on everything cite-able** — FAQ schema is the single biggest GEO lever.

## Off-page / authority building

- **Google Business Profile** — see `google-business-strategy.md`. This is the single highest-ROI SEO lever for a local venue.
- **Citations & directories** — Yelp, TripAdvisor, Eventbrite, Resident Advisor, Clubbable, Miami VIP Life, The Infatuation Miami, Thrillist Miami. Claim and standardize NAP (name, address, phone) across all.
- **Press pickup** — pitch the streaming-club angle to Miami New Times, Racket, Complex, Hypebeast, DJ Mag. The Clavicular acquisition is already a story hook.
- **Backlinks from creator ecosystems** — when streamers broadcast from Bacara, get them to link from their stream-schedule pages.
- **Inbound from hotel concierge sites** — pitch Fontainebleau, 1 Hotel, W, Faena as nightlife partners.

## Local Pack ranking factors to hit

1. Complete, verified Google Business Profile with 50+ photos
2. Consistent NAP across 20+ directories
3. Review velocity — 5+ new reviews per week, respond to every one
4. Posts on GBP weekly (use the Wed/Sat programming)
5. Proximity to "Miami Beach" centroid (fixed, but the 23rd St location is ideal)
6. On-site NightClub schema with matching address/geo

## Content cadence (for ongoing SEO retainer)

- **Weekly:** New event pages on `/events` for upcoming Wed + Sat
- **Weekly:** GBP post recap of the prior weekend
- **Monthly:** One editorial post (blog or in-page) — "Best Nightclubs in Miami Beach 2026," "What is a streaming nightclub?" — targeting informational queries
- **Quarterly:** Refresh `/wednesdays` and `/saturdays` with new photos, updated copy, new FAQ entries

## Measurement

- Google Search Console connected on day 1 — track impressions and clicks per page and query
- GA4 with enhanced measurement + custom events for quiz funnel
- Rank tracking weekly on the primary cluster (use whichever tool the retainer includes)
- Monthly report: organic sessions, table reservations attributed to organic, top-performing queries, new backlinks, GBP actions
