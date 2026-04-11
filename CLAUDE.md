# CLAUDE.md — Bacara Club project

You are building the Bacara Club website. This file is the source of truth for every future Claude session working in this repo. Read it first, then read `overview.md` and the files in `/docs`.

## Project context
- **Client:** Bacara Club, 235 23rd St, Miami Beach, FL
- **Owner:** Clavicular (acquired 2026)
- **Positioning:** Miami Beach's first streaming nightclub. Flagship nights = Wednesday and Saturday.
- **Instagram:** @bacaraclub
- **Outpace scope:** website, SEO, Google Business Profile, Meta Ads
- **Structural reference:** monaclub.miami (copy the sitemap and information architecture, NOT the visuals)

## What has already been decided (do not re-litigate)
All of these are locked. If you think one needs to change, raise it with Drew before touching code.

1. **Tech stack:** Next.js 14+ App Router, TypeScript, Tailwind, shadcn/ui, Framer Motion, GSAP + ScrollTrigger, Spline (hero 3D), Three.js + react-three-fiber (CTA globe), Supabase (contacts + admin CRM), Vercel deployment. This is mandated by the `create-website` skill — do not substitute.
2. **Design system:** Dark-themed, Delius (headings) + Inter (body), champagne-gold accent `#d4a548`, broadcast-red `#ef4444` for live indicators only. Full spec in `brand/brand-direction.md`.
3. **Sitemap:** Defined in `docs/site-plan.md`. The URL structure, nav, and page purposes are not open for modification without approval.
4. **Primary conversion:** `/reserve` multi-step quiz. Not a flat form.
5. **Evergreen SEO landers:** `/wednesdays` and `/saturdays` are permanent, URL-stable pages — Meta ads point to these, not to `/`.

## Repo structure (as of handoff)

```
bacara-club/
├── CLAUDE.md                        ← you are here
├── README.md                        ← setup, scripts, deploy notes
├── overview.md                      ← who the client is, positioning, scope
├── brand/
│   └── brand-direction.md           ← colors, type, tone, motion language
├── docs/
│   ├── site-plan.md                 ← sitemap + page-by-page build spec
│   ├── seo-geo-strategy.md          ← keywords, schema, GEO, authority
│   ├── meta-ads-strategy.md         ← campaign structure, pixel events, budget
│   └── google-business-strategy.md  ← GBP claim, optimization, reviews, cadence
├── research/                        ← reference screenshots, mona club notes (to be added)
└── [src/, public/, package.json, etc. to be created by you on first build]
```

## Your first session checklist

When a new Claude Code session opens this repo, do these in order:

1. **Read** `overview.md`, `docs/site-plan.md`, `docs/seo-geo-strategy.md`, and `brand/brand-direction.md`. Do not skip.
2. **Confirm the target directory** is empty of Next.js scaffolding. If `src/` already exists, this isn't a fresh scaffold — go to step 4.
3. **Scaffold** using the `create-website` skill's Step 1 scaffolding process. Use `bacara-club` as the project name. Install all dependencies listed in the skill (Next.js, Tailwind, shadcn/ui, Framer Motion, GSAP, Three.js, R3F, Spline, Supabase, Zod, Lucide).
4. **Create the file structure** exactly as defined in `create-website`'s Step 1. Match the pages in `docs/site-plan.md` — Home, `/wednesdays`, `/saturdays`, `/events`, `/reserve`, `/guestlist`, `/streamers`, `/private`, `/about`, `/gallery`, `/contact`, `/faq`, `/admin`.
5. **Build in this order** (ship each milestone before moving to the next):
   - Milestone 1: Layout shell (Header, Footer, globals.css with radial glow, fonts loaded, metadataBase set)
   - Milestone 2: Home hero (HeroVideo variant from `references/component-library.md`, but wait for client to supply footage — use a temp poster in the meantime)
   - Milestone 3: Home body sections (Weekly Pillars, Streaming Club Story, Events carousel, Social Proof, IG Wall, CTA w/ Three.js globe)
   - Milestone 4: `/wednesdays` and `/saturdays` landers — these MUST be live before any Meta ads run
   - Milestone 5: `/reserve` multi-step quiz with Supabase submission and pixel events
   - Milestone 6: `/guestlist`, `/streamers`, `/private`, `/about`, `/contact`, `/faq`
   - Milestone 7: SEO — sitemap, robots, JSON-LD (NightClub + FAQPage + Event), per-page metadata
   - Milestone 8: Analytics — Meta Pixel + GA4 + event firing on every micro-conversion (see `docs/meta-ads-strategy.md` for the event list)
   - Milestone 9: `/admin` CRM (only if Drew explicitly requests it — otherwise defer)
   - Milestone 10: Security pass + QA self-check per the `create-website` skill's Step 13

## Hard rules for this project

- **Never hardcode secrets.** Everything sensitive goes in `.env.local` and is referenced via `process.env`. `.env.local.example` stays committed with placeholders only.
- **Never ship a fake number.** Do not fabricate bottle counts, attendance numbers, celebrity visits, or reviews. Use real data or omit the section.
- **Never run Meta ads at a page that isn't pixel-verified.** This is a hard gate.
- **Never use emoji in UI.** Lucide React only. Icons listed in the skill.
- **Always deep-link ads to intent-matching pages.** A Wednesday ad goes to `/wednesdays`, not `/`. A creator ad goes to `/streamers`. Never break this rule.
- **Always include `NightClub` schema on `/` and `/contact`.** Google Local Pack depends on it.
- **Always set `metadataBase`** in `app/layout.tsx` so OG images resolve correctly on previews and shares.
- **Always respect `prefers-reduced-motion`.** Wrap animations with the hook from the component library.

## Resolved answers
- **Domain:** `bacaraclub.com` (confirmed). `metadataBase`, canonical URLs, OG image resolution, and the `NEXT_PUBLIC_SITE_URL` fallback in `src/lib/constants.ts` all reference this.
- **Contact email:** `admin@bacaraclub.com` (set as `VENUE.email` in `src/lib/constants.ts`).

## Open questions (ask Drew before guessing)

1. Who controls the current Google Business Profile — was it included in the acquisition?
2. Is there existing brand footage / photography from @bacaraclub we can license, or do we need a shoot?
3. Is a pre-existing email provider (Klaviyo, Mailchimp) in place? Otherwise set up from scratch.
4. Phone number — use Clavicular's team line, a tracked number, or spin up a new one via Twilio?
5. Admin/CRM — build now, or defer until after launch?
6. Dress code, age policy, table pricing floor — need real data to populate the FAQ and `/reserve` quiz.

## Known constraints

- The venue operates Wed–Sat only. Any "open now" indicator must respect that.
- Overnight hours (crossing midnight) are tricky for schema and GBP — use the `openingHoursSpecification` format with explicit opens/closes per day.
- The streaming angle is the differentiator. Do not water it down. If a copy change would bury it, push back.
- The client wants the monaclub.miami **structure** — not its look. Reviewers who compare the two should see the same IA and nav, but an entirely different visual identity.

## Handoff status

Repo scaffolded with overview, site plan, SEO/GEO strategy, Meta ads strategy, GBP strategy, and brand direction. **Next.js code has NOT been written yet.** Next session's job is to scaffold the Next.js app per Milestone 1–3 above.
