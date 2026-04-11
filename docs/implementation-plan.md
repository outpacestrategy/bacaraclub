# Bacara Club — Implementation Plan from Competitive Research

This plan translates the findings in `research/competitive-analysis.md` into specific, prioritized changes to the Bacara build. Items are tagged **NEW** (additions to the original site plan), **AMEND** (modifications to existing locked decisions), or **CONFIRM** (research validates what was already in the plan, no change needed).

Priority levels:
- **P0** — must ship in Milestone 1–4. Blocks launch.
- **P1** — must ship before paid traffic begins. Blocks Meta ads.
- **P2** — must ship in the first 30 days post-launch.
- **P3** — second-quarter / nice-to-have / requires client input.

---

## 1. Booking flow upgrades

### 1.1 Event-first reservation flow [AMEND, P0]
The current `/reserve` quiz has "Which night?" as step 1, with Wednesday / Saturday / Other. The research shows top clubs route every reservation through a *specific event*, not a generic night. **Change:** step 1 becomes "Which event?" — a list of the next 4–6 upcoming Wed/Sat nights pulled from the events data, each with date, DJ/theme, and hero image. "Other date" stays as a fallback option for private/unusual asks. This is a small UX change with a large conversion impact.

### 1.2 VIP host SLA promise on success state [NEW, P0]
After quiz submit, the success screen reads: *"You're in. A Bacara VIP host will text you within 30 minutes to lock in your table."* This sets the expectation that closes the next step. The promise must be operationally real — Clavicular's team needs to staff a VIP host on Wed/Sat afternoons to honor it. If 30 min isn't realistic, drop to "within 2 hours." Don't ship a promise we can't keep.

### 1.3 Multi-channel reservation paths [NEW, P0]
Every reservation page (`/reserve`, `/wednesdays`, `/saturdays`) gets a small block at the bottom listing all booking channels:
- **Form** (the quiz above) — primary
- **Email:** `tables@bacaraclub.com` (set up alias to `admin@bacaraclub.com`)
- **Text:** TBD VIP host number (P0 — needs phone provisioning)
- **Tablelist** widget link (P2 — see 1.6)

This mirrors the LIV / E11EVEN multi-channel pattern. Some high-spend buyers will only email, some will only text, some will only fill the form. Capture all three paths.

### 1.4 Pricing range guidance on every event lander [NEW, P0]
`/wednesdays` and `/saturdays` each get a "Table pricing guidance" block showing ranges, not fixed prices:
- Main Floor table — *from $X*
- VIP Booth — *from $Y*
- Streamer Table — *from $Z*
- Private Area — *contact for quote*

Mona Club and LIV both publish ranges; this qualifies budget upfront and reduces wasted lead time. **Numbers must come from Clavicular's team** — currently in the open questions list in `CLAUDE.md`.

### 1.5 Interactive 3D floor plan [NEW, P3, defensible UX]
No competitor in Miami has a first-party interactive floor plan. Bacara should build a top-down wireframe of the room as a Three.js scene with tappable table zones. Tap a zone → see that table type's range, how many it seats, and a "Reserve this section" CTA that pre-fills the quiz. This doubles as content for ads and social.

The `create-website` skill already mandates a Three.js wireframe globe in the CTA section. Reuse the WebGL setup and replace the globe with the floor plan on a dedicated `/reserve/floor-plan` route. Defer to P3 — ship a static floor plan image first if needed for launch.

### 1.6 Tablelist or Discotech aggregator presence [NEW, P2]
A meaningful share of Miami nightlife traffic only ever uses Tablelist or Discotech. Set up a Bacara venue listing on at least one of these aggregators so that the search "Miami Beach club Saturday" inside Discotech surfaces Bacara. The aggregator listing should link back to the Bacara site for the full reservation flow rather than completing in-app, so Bacara owns the data and the customer relationship.

---

## 2. UI / UX additions to the site plan

### 2.1 Hero video build spec [AMEND, P0]
The hero is already speced as `HeroVideo`. Add the production constraints discovered in research:
- 10–30 second loop
- Muted, looped, `playsinline`, `autoplay`
- Target file size < 5MB, 720p, ~24fps
- Mobile fallback: hide video file via responsive `<picture>` or CSS, swap to a still poster
- Preload poster, lazy-load video file
- Loop animation must not block LCP — measure on every iteration
- Disable loop if a form ever gets placed in the hero (won't apply to Bacara — hero CTAs are buttons, not a form)

### 2.2 Live Broadcast indicator [NEW, P1, differentiator]
A pulsing "ON AIR" badge in the header that goes live when an actual stream is active. When live, the badge links to the stream (or to a `/live` aggregator page that shows all active streams from the venue). When dark, the badge swaps to "Next stream: [day, time]." This makes the streaming-club positioning visceral instead of just a tagline.

Implementation: Supabase table `stream_status` with `is_live`, `current_stream_url`, `next_stream_at`. A simple cron or webhook from the streamer's platform updates the row. Frontend polls every 60s.

### 2.3 Newsletter signup separate from guest list [NEW, P1]
Add a thin newsletter capture in the footer and as a single-line form on `/wednesdays` and `/saturdays`. Field: email only. Purpose: ticket drops, lineup reveals, monthly recap. Different list segment from guest list. Connect to Klaviyo or whatever email platform Drew confirms (open question in `CLAUDE.md`).

### 2.4 Press / accolades strip [NEW, P1]
A small horizontal strip below the hero (or above the footer) showing:
- "Backed by Clavicular" — already approved
- Press logos with linked sources (Miami New Times, Complex, Yahoo on the Clavicular acquisition)
- "Open Wednesday – Saturday" badge

When/if Bacara earns rankings (best club lists, etc.), add accolade badges. Always link logos to the source article — link equity matters.

### 2.5 Now Streaming / Recently Streamed section [NEW, P2]
On the homepage and on `/streamers`, render a rotating block showing creators currently or recently streaming from the venue. Each card: creator name, IG/TikTok/Kick handle, last stream date, link to their channel. This is a content asset that markets itself — every featured creator gets traffic, which incentivizes them to feature Bacara back.

### 2.6 Mobile sticky bottom bar [CONFIRM, P0]
Already in the site plan. Research validates: every winning club's mobile experience has a sticky reserve bar. Confirmed — ship as planned.

### 2.7 Single primary CTA discipline [CONFIRM, P0]
Already in the site plan. Hero has one primary (Reserve a Table) and one secondary (This Week's Lineup). Research validates that clubs with cluttered hero CTAs convert worse. Hold the line.

---

## 3. SEO additions

### 3.1 Event schema on every upcoming night [NEW, P0]
The biggest under-utilized SEO lever in this category. Every event on `/events` and `/events/[slug]` gets `Event` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Saturday Night at Bacara feat. [DJ NAME]",
  "startDate": "2026-04-11T23:30:00-04:00",
  "endDate": "2026-04-12T05:00:00-04:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": { "@type": "NightClub", "name": "Bacara", "address": "..." },
  "performer": { "@type": "PerformingGroup", "name": "[DJ]" },
  "offers": [
    { "@type": "Offer", "name": "Guest List", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": "https://bacaraclub.com/guestlist" },
    { "@type": "Offer", "name": "Table Reservation", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "1000", "priceCurrency": "USD" }, "url": "https://bacaraclub.com/reserve" }
  ],
  "organizer": { "@type": "Organization", "name": "Bacara Club", "url": "https://bacaraclub.com" }
}
```

Without this, Bacara is invisible to Google's Events surface and AI search. With it, every Wed/Sat shows up in dedicated event-rich results.

### 3.2 NightClub schema confirmed [CONFIRM, P0]
The strategy doc already specifies `NightClub` (a subtype of `LocalBusiness` via `EntertainmentBusiness`). Research confirms this is the right choice. No change.

### 3.3 FAQPage schema as a GEO weapon [AMEND, P1]
Already in the plan. Research confirms STORY and LIV have weak FAQ pages — a content gap Bacara should attack. **Amend:** make FAQ content much deeper than originally scoped. Target ~25 questions on `/faq`, ~10 on each pillar page (`/wednesdays`, `/saturdays`, `/streamers`). Every question is a real query someone types. Every answer is 1–3 factual sentences, no fluff.

Question categories: hours, dress code, age, parking, table pricing, reservations, guest list, dress code enforcement, ID, walkups, private events, streaming policy (this is the differentiator surface), what to expect on Wednesday vs Saturday, accessibility, lost & found, payment methods, large groups, birthdays.

### 3.4 Editorial guide content for informational queries [NEW, P2]
No top Miami club has serious editorial content on its own site. Every "best clubs in Miami" guide is owned by a third party (Discotech, Club Bookers, VIP South Beach), and those third parties capture the click and pass it to whichever club pays them most. **Bacara should publish 4–8 evergreen guide pages in year one** to compete for those informational queries directly:

Suggested initial set:
1. "Best Wednesday Nightclubs in Miami Beach 2026"
2. "Best Saturday Nightclubs in Miami Beach 2026"
3. "Miami Beach Nightclub Dress Code Guide"
4. "How Bottle Service Works at a Miami Beach Nightclub"
5. "What is a Streaming Nightclub? A Guide to Miami's First"
6. "Where to Stream Live from Miami Beach (For Creators)"
7. "Miami Beach Nightclub Etiquette: Tipping, Dress, ID, Lines"
8. "How to Reserve a VIP Table at a Miami Beach Club"

Each is a long-form page (1500–2500 words), schema-marked, internally linked to `/reserve`, `/wednesdays`, `/saturdays`, and `/streamers`. Each ranks for one specific query cluster and pulls warm informational traffic into the conversion funnel. These are the SEO retainer's monthly deliverables — one or two per month after launch.

### 3.5 Bilingual SEO (Spanish) [NEW, P2]
Half of Miami's audience is Spanish-dominant. Add a `/es` version of the homepage and pillar pages. At minimum: Spanish meta titles + descriptions + H1 + key copy. Use `hreflang` tags so Google serves the right version. This is a low-effort, high-Miami-specific moat — very few competitors do it.

### 3.6 Booking interactions wired to GBP [NEW, P0]
Google now reads "booking" button clicks on Google Business Profile as a ranking signal. When the GBP gets set up, the "Reserve" button must point at `https://bacaraclub.com/reserve` (with a UTM tag), not at a phone number. This creates a click-tracked signal Google rewards.

### 3.7 GBP post cadence increased [AMEND, P0]
The GBP plan currently says weekly. **Amend:** 2× weekly minimum, ideally 3×. Monday "This Wednesday at Bacara," Thursday "This Saturday at Bacara," Sunday "This week's recap." 2026 ranking signals reward post frequency more heavily than they used to.

### 3.8 Photo cadence increased [AMEND, P0]
The GBP plan currently says 10 photos in week 1, 10/week thereafter. **Amend:** validated by research — photo freshness now matters as much as count. Hold to 10/week and never let a week go by without new uploads.

---

## 4. Media / social additions

### 4.1 TikTok-first organic content stream [NEW, P1]
Meta ads strategy already plans 9:16 vertical creative. **Amend the scope:** also ship organic TikTok content as a deliverable. Bacara needs a @bacaraclub presence on TikTok with 3–5 posts/week minimum. Same vertical assets that fuel the Meta ads can fuel TikTok organic. Top venues like E11EVEN are pulling millions of monthly views from TikTok — that's free top-of-funnel reach the Meta ads strategy currently has to pay for.

### 4.2 Bilingual captions [NEW, P1]
Every IG / TikTok caption: English line 1, Spanish line 2. Same for ad copy.

### 4.3 Press kit page [NEW, P2]
A `/press` page with: high-res logos, brand color codes, founder/operator bios (Clavicular), key messaging, link to a downloadable press kit ZIP, contact email for press inquiries. This is bait for journalists writing about the streaming club story — every press hit is a backlink and a citation surface for AI search. Mona Club doesn't have one. STORY doesn't have one. E11EVEN has a barely-functional one. Bacara having a real press kit is an unfair advantage.

### 4.4 Creator program page upgrade [AMEND, P1]
The original `/streamers` spec is good. Add to it:
- A live "now streaming" indicator (ties to 2.2 above)
- Featured creator showcase (rotating)
- A creator leaderboard ranked by last stream date / total streams
- Embedded clips of recent streams (privacy-cleared with creators)
- A press kit download link specifically for creators

### 4.5 First-party gallery on `/gallery` not just IG embed [AMEND, P1]
The current plan has `/gallery` showing an IG wall. **Amend:** also host first-party photo and video galleries that don't depend on IG's API or rate limits. IG embeds break, get rate-limited, and don't index for image search. First-party media on Bacara's domain feeds Google Image Search, can be schema-marked with `ImageObject`, and never breaks when Meta changes their embed policy.

---

## 5. Things from research we explicitly NOT adopting

These are patterns the top clubs use that Bacara should reject. Recording them so we don't backslide.

1. **Squarespace.** STORY uses it. Slow, weak schema, mediocre LCP. Bacara stays on Next.js.
2. **Hidden hours.** Multiple clubs bury hours in the footer. Bacara surfaces hours in the hero, GBP, schema, AND footer.
3. **Stock nightlife photography.** Already a hard rule in `brand/brand-direction.md`. Confirmed.
4. **Multiple clashing hero CTAs.** Some clubs run 3–4 CTAs in the hero. Bacara stays at one primary + one secondary.
5. **Logos without links.** When Bacara has press logos, they always link to the original article for link equity.
6. **Self-checkout for high-ticket tables.** No top club lets a user self-checkout for a $5,000 table. Bacara holds to a quiz-capture + human-close model.

---

## 6. Open dependencies and asks for Drew / Clavicular

These items are blocked on client decisions before the listed milestones can ship.

| Item | Blocked on | Needed by |
|---|---|---|
| 1.2 VIP host SLA promise | Confirmation that a host can actually respond within 30 min on Wed/Sat | Milestone 5 (`/reserve`) |
| 1.3 Tracked text/phone number | Phone provisioning decision (Twilio / existing line) | Milestone 5 |
| 1.4 Table pricing ranges | Real numbers from Clavicular's team | Milestone 4 (`/wednesdays`, `/saturdays`) |
| 1.5 Interactive floor plan | Floor plan asset (DWG / layout PDF) | P3 |
| 1.6 Tablelist or Discotech listing | Decision on which aggregator + venue listing setup | P2 |
| 2.2 Live Broadcast indicator | Webhook source from streamer platform | Milestone 6 |
| 2.3 Newsletter platform | Klaviyo / Mailchimp / other decision | Milestone 5 |
| 2.4 Press logos | Press hits in hand to link to | P1 (already have Miami New Times + Complex + Yahoo on the acquisition) |
| 2.5 Now-streaming creator data | Creator partnerships in place | P2 |
| 4.1 TikTok organic | Decide if Outpace runs the channel or Clavicular's team does | Pre-launch |
| 4.4 Creator embed clips | Privacy clearances from creators | P2 |

---

## 7. Sequenced rollout summary

**Pre-launch (must ship before Bacara goes live):**
- 1.1 Event-first quiz, 1.2 VIP SLA, 1.3 Multi-channel paths, 1.4 Pricing ranges
- 2.1 Hero video spec, 2.6 Sticky CTA, 2.7 Single CTA discipline
- 3.1 Event schema, 3.2 NightClub schema, 3.6 GBP booking link, 3.7 GBP cadence, 3.8 Photo cadence

**Pre-paid-traffic (must ship before Meta ads run):**
- 2.2 Live Broadcast indicator, 2.3 Newsletter, 2.4 Press strip
- 3.3 Deep FAQ schema
- 4.1 TikTok organic stream, 4.2 Bilingual captions, 4.4 Creator program upgrade, 4.5 First-party gallery

**First 30 days post-launch:**
- 1.6 Aggregator listing
- 2.5 Now Streaming section
- 3.4 First two editorial guide pages
- 3.5 Bilingual `/es` versions of homepage and pillar pages
- 4.3 Press kit page

**Quarter 2:**
- 1.5 Interactive 3D floor plan
- 3.4 Remaining editorial guide pages
- Continued GBP / TikTok / SEO retainer cadence
