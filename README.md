# Bacara Club

Website, SEO, Google Business Profile, and Meta Ads build for **Bacara Club** — Miami Beach's first streaming nightclub, at 235 23rd St, Miami Beach, FL. Recently acquired by Clavicular. Flagship nights: Wednesday and Saturday. Instagram: [@bacaraclub](https://www.instagram.com/bacaraclub/).

Built by [Outpace Strategy Group](https://outpacestrategygroup.com).

## Status

**Planning complete. Code not yet scaffolded.** This repo currently contains the project brief, site plan, and marketing strategy. The next Claude Code session will scaffold the Next.js app per the milestones in `CLAUDE.md`.

## Start here

If you are a human (or a new Claude session) opening this repo for the first time, read these files in this order:

1. [`CLAUDE.md`](./CLAUDE.md) — project conventions, locked decisions, build milestones, hard rules
2. [`overview.md`](./overview.md) — who Bacara is, positioning, audience, scope
3. [`docs/site-plan.md`](./docs/site-plan.md) — sitemap, page-by-page build spec, conversion logic
4. [`brand/brand-direction.md`](./brand/brand-direction.md) — colors, typography, tone, motion language
5. [`docs/seo-geo-strategy.md`](./docs/seo-geo-strategy.md) — keyword map, schema, GEO, authority plan
6. [`docs/meta-ads-strategy.md`](./docs/meta-ads-strategy.md) — campaign structure, pixel events, budget
7. [`docs/google-business-strategy.md`](./docs/google-business-strategy.md) — GBP claim, optimization, reviews, cadence

## Repo structure

```
bacara-club/
├── CLAUDE.md                        # Source of truth for Claude Code sessions
├── README.md                        # This file
├── overview.md                      # Client brief
├── brand/
│   └── brand-direction.md           # Visual + tone system
├── docs/
│   ├── site-plan.md                 # Sitemap + page specs
│   ├── seo-geo-strategy.md          # Organic search plan
│   ├── meta-ads-strategy.md         # Paid social plan
│   └── google-business-strategy.md  # GBP plan
└── research/                        # Reference material, screenshots, client assets
```

Once scaffolding starts, the Next.js app lives alongside these folders in the standard structure defined by the `create-website` skill (`src/`, `public/`, `package.json`, etc.).

## Tech stack (locked)

Next.js 14+ App Router · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Spline (hero) · Three.js + react-three-fiber (CTA globe) · Supabase · Netlify

## Local development

```bash
npm install
cp .env.local.example .env.local    # fill in real values
npm run dev                          # http://localhost:3000
```

All `NEXT_PUBLIC_*` env vars are inlined at build time. The analytics scripts (GA4 + Meta Pixel) render nothing unless their measurement IDs are set, so local dev stays beacon-free by default.

## Deployment (Netlify)

Production is deployed to Netlify. Configuration lives in [`netlify.toml`](./netlify.toml).

### One-time setup

1. **Create site** — `netlify init` from this directory, or link an existing site to the `main` branch in the Netlify UI.
2. **Verify build settings** — Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`. The plugin handles SSR, ISR, image optimization, and App Router. Build command is `npm run build`; publish directory is `.next`.
3. **Set environment variables** — in Site settings → Environment variables, paste every value from `.env.local.example` except the Supabase service role key (server-only — do not prefix with `NEXT_PUBLIC_`). List:
   - `NEXT_PUBLIC_SITE_URL` — `https://bacaraclub.com`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 Measurement ID (G-XXXXXXXXXX)
   - `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID (numeric)
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Search Console token
   - `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION` — Meta domain verification token
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — once Supabase is wired
4. **Attach the custom domain** — add `bacaraclub.com` + `www.bacaraclub.com` in Domain management. Netlify provisions the TLS cert automatically via Let's Encrypt.
5. **Redeploy after env var changes** — `NEXT_PUBLIC_*` vars are baked into the client bundle at build time, so changing any of them requires a fresh deploy, not just a restart.

### Deploy

```bash
git push origin main    # Netlify auto-builds and deploys
```

Preview deploys fire automatically on every PR. They inherit all env vars except any scoped to `production` in the Netlify UI — keep analytics and verification tokens production-scoped so preview deploys don't pollute real measurement data or trigger verification on unintended hosts.

### Security headers

`netlify.toml` sets HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and a year-long immutable cache on `/brand/*` and `/_next/static/*`. These mirror `vercel.json` so the app ships with the same baseline regardless of which host serves it.

## Google + Meta integrations

| Surface | Where it lives | How to enable |
|---|---|---|
| Google Analytics 4 | `src/components/analytics/GoogleAnalytics.tsx` | Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Meta Pixel | `src/components/analytics/MetaPixel.tsx` | Set `NEXT_PUBLIC_META_PIXEL_ID` |
| SPA pageview tracking | `src/components/analytics/AnalyticsRouteListener.tsx` | Auto-wired in root layout |
| Event helpers | `src/lib/analytics.ts` — `trackConversion`, `trackGAEvent`, `trackPixelEvent` | Import from any client component |
| Google Search Console verification | `metadata.verification.google` in `src/app/layout.tsx` | Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |
| Meta Business domain verification | `metadata.verification.other` in `src/app/layout.tsx` | Set `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION` |
| Google Business Profile | External — see [`docs/google-business-strategy.md`](./docs/google-business-strategy.md) | Claim listing, match NAP to NightClub JSON-LD |
| NightClub JSON-LD (Local Pack) | `src/components/seo/NightClubSchema.tsx` | Rendered on `/` and `/contact` |
| Organization JSON-LD (Knowledge Panel) | `src/components/seo/OrganizationSchema.tsx` | Rendered on `/` |
| WebSite + SearchAction JSON-LD | `src/components/seo/WebSiteSchema.tsx` | Rendered on `/` |
| Sitemap + robots | `src/app/sitemap.ts`, `src/app/robots.ts` | Auto-served at `/sitemap.xml` + `/robots.txt` |

After the first production deploy:

1. **Search Console** — submit `https://bacaraclub.com/sitemap.xml`, request indexing for `/`, `/wednesdays`, `/saturdays`, `/reserve`.
2. **Meta Events Manager** — verify the pixel fires on `/`, `/wednesdays`, `/saturdays`, `/reserve` using the Meta Pixel Helper Chrome extension. **Hard rule:** per `CLAUDE.md`, do not launch Meta Ads at any page that isn't pixel-verified.
3. **GA4 DebugView** — confirm pageviews and custom events using the GA Debugger extension before turning on production reporting.
4. **Google Business Profile** — follow `docs/google-business-strategy.md` for the claim + optimization sequence.

## Hero video CDN (Cloudflare R2)

The home page hero autoplays `public/brand/bacara-hero.mp4` (~7 MB, 720×1280 H.264). Serving that file from Netlify on every visit is the single largest bandwidth line item on this site — by an order of magnitude. To keep Netlify bandwidth credits free for actual SSR traffic, the MP4 is offloaded to **Cloudflare R2** in production. R2 has free egress to the public internet, so the video is effectively free to serve at any traffic volume.

The `<video>` tag in `src/components/sections/Hero.tsx` reads `NEXT_PUBLIC_HERO_VIDEO_URL` and falls back to the committed local file if the env var is empty, so local dev and preview deploys work with zero setup.

### One-time R2 setup

1. **Create a bucket** — Cloudflare dashboard → R2 → *Create bucket* → name it `bacara-club-assets` (region: Automatic).
2. **Enable public access** — Bucket → Settings → *Public access* → enable the `r2.dev` subdomain (fastest path) or bind a custom domain like `cdn.bacaraclub.com` via a CNAME.
3. **Upload the video** — drag `public/brand/bacara-hero.mp4` into the bucket. Keep the filename identical so cache keys stay stable across re-uploads.
4. **Set `Content-Type: video/mp4`** on the object (R2 usually infers this from the extension; double-check in the object metadata).
5. **Set Cache-Control** on the object → `public, max-age=31536000, immutable`. Update the filename (e.g. append `-v2`) and the env var together whenever the video itself changes, since the URL is the cache key.
6. **Copy the public URL** — something like `https://pub-<hash>.r2.dev/bacara-hero.mp4`, or your custom-domain equivalent.
7. **Set the Netlify env var** — Site settings → Environment variables → `NEXT_PUBLIC_HERO_VIDEO_URL` = the R2 URL. Trigger a fresh deploy (the value is baked in at build time).
8. **Verify** — open the deployed site, DevTools → Network → filter `.mp4`. The request domain should be R2, not Netlify. Response headers should include the year-long `Cache-Control`.

Once verified, the local `public/brand/bacara-hero.mp4` can stay in the repo as a fallback — it's small enough that committing it costs nothing and it keeps dev self-contained. If storage in the repo ever becomes an issue, swap it for a placeholder poster frame.

## Open questions for the client

Tracked in [`CLAUDE.md`](./CLAUDE.md) under "Open questions." Before Milestone 1, we need answers on: final domain, GBP ownership status after the acquisition, existing footage, email platform, phone number, and CRM timing.
