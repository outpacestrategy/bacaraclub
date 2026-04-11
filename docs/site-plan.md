# Bacara Club — Site Plan & Conversion Architecture

This document is the build spec. It defines the sitemap, section-by-section content, and the conversion logic behind every page. The site is modeled structurally after monaclub.miami but visually and thematically repositioned around Bacara's streaming-club differentiator.

## The one job of this site
Drive **table reservation requests** as the primary conversion, with **guest list signups** and **Instagram follows** as secondary conversions. Everything else — brand, copy, animations, SEO — serves those three actions.

## Primary KPI funnel
1. Ad click / organic visit → Land on `/` or an event landing page
2. Scroll engagement → See Wednesday + Saturday programming
3. CTA click → `/reserve` (reservation request quiz) or `/guestlist`
4. Form submission → Lead in Supabase + notification to the door team
5. Follow-up → SMS/email confirmation → Instagram follow prompt

## Sitemap (mirroring monaclub.miami's proven structure)

```
/                       — Home (hero + weekly programming + streamer angle + social proof + CTA)
/about                  — The Bacara story, Clavicular acquisition, what "streaming club" means
/events                 — All upcoming nights, filtered by Wed / Sat / Special
/events/[slug]          — Individual event landing page (dynamic, built from CMS or constants)
/wednesdays             — Evergreen landing page for Wednesday night programming (SEO + ads LP)
/saturdays              — Evergreen landing page for Saturday night programming (SEO + ads LP)
/private                — Private events, buyouts, corporate, artist afterparties
/reserve                — Multi-step reservation request quiz (primary conversion)
/guestlist              — Guest list signup form (secondary conversion)
/streamers              — Creator program: streamer tables, collabs, rig specs, apply form
/gallery                — Photo + video wall, embedded IG feed
/contact                — Address, hours, email, map, contact form
/faq                    — Schema-marked FAQ (SEO + GEO food)
/admin                  — Gated CRM for reservations, guest list, streamer applications
```

## Navigation (desktop)
Keep the top nav short — exactly like Mona Club. Too many links kill conversion.

```
EVENTS   |   RESERVE   |   STREAMERS   |   PRIVATE   |   ABOUT   |   [RESERVE A TABLE →]
```

Mobile: hamburger drawer with the same links, plus a sticky floating "Reserve a Table" bottom bar that appears after the hero.

---

## Page-by-page build spec

### `/` — Home

**Goal:** In 6 seconds the visitor must understand (1) this is a Miami Beach nightclub, (2) it's different because it's built for streaming, (3) the next big night is X, (4) how to book a table. Then keep them scrolling.

**Sections in order:**

1. **Hero** — HeroVideo variant from the component library. Background is a looping montage of the room mid-stream: DJ booth, crowd, bottle sparklers, camera rigs visible. Blur-reveal headline: *"Miami Beach's First Streaming Nightclub."* Subtext: *"Wednesdays and Saturdays, always on air."* Two CTAs: **[Reserve a Table]** (primary) and **[This Week's Lineup]** (secondary, scrolls to events). Floating badge pill top-left: *"Now Broadcasting Live Wed & Sat."*

2. **Weekly Pillars Strip** — Two massive split cards, Wednesday and Saturday. Each card shows the night's brand name, resident DJ or theme, a 15s looping clip, and a "Reserve Wednesday / Reserve Saturday" CTA that deep-links into `/reserve` with the night pre-selected.

3. **The Streaming Club Story** — Short, punchy. 3 columns or alternating left-right: (a) *Built for Broadcast* — permanent rigs, creator lighting, no filming rules. (b) *Backed by Clavicular* — credibility anchor. (c) *Every Night is a Drop* — the IG/TikTok/Kick integration. This is the GEO/AI-search content — written in clean factual sentences so AI models will cite it.

4. **Upcoming Events Carousel** — Horizontal scroll of the next 4–6 nights. Each card: date, DJ/host, night name, "Reserve" button. Pulls from `/events` data.

5. **Social Proof Strip** — Auto-playing testimonial carousel + animated counters: bottles popped, streams broadcast, creators hosted, nights sold out. Only use counters if we have real numbers from the client — do not fabricate.

6. **Instagram Wall** — Live-pulled grid from @bacaraclub (6–9 posts). Click-through to IG. This builds trust and gives Meta pixel a signal.

7. **CTA Section** — Three.js wireframe globe background (from the create-website skill's Three.js spec) with centered copy: *"Your table is waiting."* Single **[Reserve a Table]** button. This is the last chance CTA before footer.

8. **Footer** — Address, hours, IG link, contact, private events link, "Built by Outpace Strategy Group" credit.

---

### `/wednesdays` and `/saturdays` — Evergreen Event Landing Pages

These are the SEO and ads workhorses. They exist year-round, even if the specific night's lineup changes weekly. The URL, headings, and schema target high-intent queries like *"Wednesday night Miami club"* and *"Saturday night Miami Beach club."*

**Required sections on each:**
- H1 that matches the target query exactly (*"Wednesday Nights at Bacara Miami Beach"*)
- Subhead explaining the night's vibe and what makes it different
- This week's lineup (dynamic, from the events data)
- Past nights gallery (photos/clips — builds social proof)
- Table pricing guidance (ranges, not fixed prices — matches Mona Club's dynamic pricing model)
- Reservation CTA deep-linked to `/reserve?night=wednesday` (or saturday)
- FAQ specific to that night (schema-marked)
- Map + hours + address block

These are the pages Meta Ads should point to, not the homepage. They carry the ad's intent context all the way to the CTA.

---

### `/reserve` — Reservation Request Quiz (primary conversion)

This is the most important page on the site. Built as a multi-step quiz per the create-website skill's `ContactQuiz` pattern, not a single big form.

**Steps:**
1. **Which night?** — Wednesday / Saturday / Other (opens date picker)
2. **Party size** — 2 / 4 / 6 / 8 / 10+
3. **Vibe / section** — Main Room / VIP Booth / Streamer Table / Private Area
4. **Budget range** — $500–1000 / $1000–2500 / $2500–5000 / $5000+
5. **Contact details** — name, phone (required, inputMode="tel"), email, IG handle (optional but captured for creator ID)
6. **Success state** — animated confirmation, auto-triggers a pixel event, shows IG follow button and "Add to Calendar" link

**Pixel events:** `ReserveQuizStart`, `ReserveQuizStep2`, `ReserveQuizStep3`, `ReserveQuizStep4`, `ReserveQuizSubmit`, `Lead`. These are the events we'll optimize Meta ads against.

---

### `/guestlist` — Secondary conversion

Shorter. One step. Name, phone, IG handle, night (Wed/Sat), party size. Submits to the same Supabase table with `type: 'guestlist'`. Lower barrier, higher volume — feeds retargeting audiences.

---

### `/streamers` — The differentiator page

This is what makes Bacara uniquely rankable and shareable. It's also a lead gen page for creator partnerships, which Clavicular's team will care about.

**Sections:**
- Hero: *"Stream from the best seat in Miami."*
- What we provide: rigs, lighting, fast wifi, no filming restrictions, dedicated tables
- Who's streamed here: creator logos/handles (once we have them)
- Apply form: IG/TikTok/Kick/Twitch handles, follower count, what night they want, pitch
- FAQ for creators (schema-marked)

This page is also bait for press and AI search — "Miami streaming club," "nightclub that allows filming Miami," "creator-friendly club Miami" all funnel here.

---

### `/private` — Buyouts & private events

Mirrors Mona Club's *Mona Private* page. Clean, upscale, enquiry-focused. Short form (event type, date, party size, contact).

---

### `/about`, `/gallery`, `/contact`, `/faq`
Standard per the create-website skill. FAQ is schema-marked for GEO. Contact has embedded Google Map, phone tap-to-call, IG link.

---

## Conversion principles (applied everywhere)

1. **Every page has a reservation CTA above the fold and in the footer.** Always.
2. **Mobile sticky bottom bar** with "Reserve" + "Guest List" is visible on every page after the hero scrolls out.
3. **Scarcity cues where honest** — "limited tables remaining for Saturday" when the backend confirms it. Never fake it.
4. **One quiz, not one form.** Quizzes convert 2–3x better than flat contact forms in nightlife. The create-website skill already has the pattern.
5. **Deep-link everything from ads.** A Wednesday ad lands on `/wednesdays`, not `/`. A creator ad lands on `/streamers`. Context preserved = conversion preserved.
6. **Pixel and GA4 fire on every micro-conversion**, not just the final submit. Meta's algorithm optimizes much better with a fuller event graph.
7. **Dark, premium, cinematic.** Per create-website skill design rules: no emoji, no generic gradients, Delius headings, Inter body, radial glows, Framer Motion blur-reveals, GSAP scroll sections.
