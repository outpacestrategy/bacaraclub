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

Next.js 14+ App Router · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Spline (hero) · Three.js + react-three-fiber (CTA globe) · Supabase · Vercel

## Open questions for the client

Tracked in [`CLAUDE.md`](./CLAUDE.md) under "Open questions." Before Milestone 1, we need answers on: final domain, GBP ownership status after the acquisition, existing footage, email platform, phone number, and CRM timing.
