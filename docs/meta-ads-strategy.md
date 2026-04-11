# Bacara Club — Meta Ads Strategy (Instagram + Facebook)

## Goal
Drive weekly reservation requests and guest list signups for Wednesday and Saturday nights, with a secondary objective of growing @bacaraclub followers and retargetable audiences.

## Funnel architecture

```
COLD (TOF)                    WARM (MOF)                    HOT (BOF)
Reach / Video Views    →    Traffic / Engagement    →    Leads / Conversions
Broad Miami audience        Retargeting + lookalikes      Quiz submit / guest list
```

## Account structure

### Pixel & Events API setup (day 1, blocking)
- Install Meta Pixel via `next/script` per create-website skill rules
- Deploy Conversions API server-side (Next.js API route forwarding to Meta) for iOS 14.5+ accuracy
- Define custom events matching the `/reserve` quiz funnel:
  - `ReserveQuizStart` — step 1 loads
  - `ReserveQuizStep2` / `Step3` / `Step4` — progression signals
  - `ReserveQuizSubmit` — primary conversion (mapped to Meta standard `Lead`)
  - `GuestListSubmit` — secondary (`Lead` with custom parameter)
  - `ClickReserveCTA`, `ClickGuestList`, `ClickIGFollow`, `ClickPhone` — micro-conversions
- Verify domain and configure Aggregated Event Measurement with `ReserveQuizSubmit` as the #1 priority event

### Campaigns

**Campaign 1 — Cold reach/awareness (TOF)**
- Objective: Video Views (thruplay) or Reach
- Audience: Broad Miami-Dade + Broward, age 21–44, interests optional (nightlife, DJs, streaming, specific creator interests)
- Creatives: 9:16 short vertical clips from inside the club. Stream energy. DJ moments. Sparkler trains. Text overlay: "Wednesdays & Saturdays in Miami Beach."
- Budget: start $30–50/day, scale on cost-per-thruplay
- Purpose: Build retargeting pools + deliver the brand story cheaply

**Campaign 2 — Conversion: Wednesdays**
- Objective: Leads (optimizing for `ReserveQuizSubmit`)
- Landing page: `/wednesdays`
- Audiences:
  - Lookalike 1% of past table buyers (once we have 100+ seeded)
  - Lookalike 1% of Instagram engagers (@bacaraclub)
  - Retargeting: video 50%+ viewers from Campaign 1, site visitors 30 days, quiz starters who didn't finish
- Creatives: Wednesday-night-specific clips. Call out the DJ/theme. UGC from prior Wednesdays.
- Ad copy lead-in: "Wednesdays at Bacara. Miami Beach's first streaming nightclub. Tables from $X."
- CTA: "Book Now"

**Campaign 3 — Conversion: Saturdays**
- Mirror of Campaign 2 but for Saturday. Different creative, different LP (`/saturdays`).
- Higher budget allocation — Saturdays are the bigger night.

**Campaign 4 — Guest list (always-on)**
- Objective: Leads optimizing for `GuestListSubmit`
- Lower budget, broader audience, lower-friction creative ("Free guest list — link in profile")
- Purpose: Audience builder and fallback for people who won't buy a table
- Landing page: `/guestlist`

**Campaign 5 — Streamer/creator acquisition**
- Objective: Leads optimizing for streamer application submits
- Audience: narrow interest targeting (Kick, Twitch, streaming, specific big creator interests) + lookalikes off IG followers
- Creatives: BTS of streamers at Bacara, rig shots, "stream from the best seat in Miami"
- Landing page: `/streamers`
- Purpose: Feeds the differentiator and generates content to fuel Campaigns 1–3

## Creative principles

1. **Vertical first.** 9:16 Reels/Stories placements get 3–5x the reach of feed placements for nightlife.
2. **Sound-on design** — music is half the product. But always have captions for sound-off viewers.
3. **Hook in 1 second.** The first frame is the entire ad. Open on peak moment (drop, sparkler, crowd POV), not a logo.
4. **UGC > polished.** Real phone footage from inside outperforms branded production for nightlife ads.
5. **Rotate creative weekly.** Ad fatigue is brutal for local nightlife — 7–14 day creative lifespan.
6. **Show the night being advertised.** A Saturday ad must show Saturday energy. Don't reuse Wednesday footage for Saturday campaigns.

## Budget pacing (starter month)

| Campaign | Daily budget | Monthly |
|---|---|---|
| 1 — Cold reach | $40 | $1,200 |
| 2 — Wednesday conversion | $60 | $1,800 |
| 3 — Saturday conversion | $100 | $3,000 |
| 4 — Guest list always-on | $20 | $600 |
| 5 — Streamer acquisition | $30 | $900 |
| **Total** | **$250** | **$7,500** |

Adjust after week 2 based on CPA and table conversion rate. Saturday gets the lion's share because it's the highest-revenue night.

## KPIs and thresholds

- **CPL (cost per reservation lead):** target <$15, kill ads at >$30
- **CPL (guest list):** target <$3
- **Table close rate:** track offline in CRM — expect 20–40% of quiz submits to convert to confirmed tables after the door team follows up
- **ROAS proxy:** assumed average table spend × close rate ÷ CPL
- **IG follower growth:** secondary — 500+/week from paid during active season

## Weekly rhythm

- **Monday:** Review weekend performance, kill underperformers, brief creative refresh
- **Tuesday:** Launch new Wednesday-specific creatives
- **Wednesday morning:** Push budget to Wednesday campaign, monitor throughout the day
- **Thursday:** Post-Wednesday retargeting burst (attended-the-vibe lookalikes)
- **Friday:** Launch new Saturday-specific creatives, push budget to Saturday campaign
- **Saturday:** Monitor + intraday budget increase if CPL holds
- **Sunday:** Attribution cleanup, prep weekly report for the client

## Dependencies (blocking items before launch)

- [ ] Pixel + CAPI installed and verified on the live site
- [ ] Domain verified in Business Manager
- [ ] Instagram account @bacaraclub added to Business Manager with content permission
- [ ] At least 5 cold creatives shot/edited (can be IG archive in week 1)
- [ ] `/reserve`, `/wednesdays`, `/saturdays`, `/guestlist` live and firing events
- [ ] Offline CRM in place to track quiz-submit → confirmed table close rate (see `/admin`)
