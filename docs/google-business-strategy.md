# Bacara Club — Google Business Profile Strategy

## Why this matters
For a local venue, Google Business Profile (GBP) is the single highest-ROI marketing asset. "Nightclub near me," "Miami Beach club Saturday," "Wednesday night Miami" — these almost always surface the Local Pack before any organic blue links. Winning the Local Pack means winning the reservation.

## Phase 1 — Claim & verify (week 1)

- [ ] Confirm who owns the current GBP listing (prior owner may still control it; Clavicular's acquisition may not have transferred it)
- [ ] Initiate ownership transfer or file for ownership if the listing is abandoned
- [ ] Verify via postcard / video / phone (video verification is fastest for venues)
- [ ] Set primary category: **Night Club**
- [ ] Add secondary categories: **Dance Club**, **Live Music Venue**, **Event Venue**, **Bar**
- [ ] Set precise address: 235 23rd St, Miami Beach, FL 33139
- [ ] Set service area: none (venue is destination-based)
- [ ] Set hours: Wed 11:30 PM – Sat 5:00 AM (use the "overnight hours" format — Wed/Thu/Fri/Sat entries crossing midnight)
- [ ] Add website URL pointing to the new Bacara site
- [ ] Add phone number (tracked number if possible, so we can attribute GBP calls)
- [ ] Add IG, FB, TikTok, YouTube as linked profiles

## Phase 2 — Build out (weeks 1–2)

### Description
Write a 750-character description leading with "Bacara is Miami Beach's first streaming nightclub." Include: address, hours, flagship nights (Wed + Sat), owner mention (Clavicular), what makes it different (broadcast-friendly, creator program), and one clear CTA ("Reserve a table at bacaraclub.com").

### Attributes to enable
- Dance floor
- Live DJ
- VIP tables / bottle service
- Reservations recommended
- Wheelchair accessible (verify)
- LGBTQ+ friendly (verify)
- Accepts credit cards
- Dress code: upscale / enforced
- Age restriction: 21+
- Good for groups
- Private events available

### Photos (upload 50+ in week 1)
- **Exterior:** day + night shots of the 235 23rd St facade, signage, entrance
- **Interior:** DJ booth, main room, VIP sections, streamer tables, bar
- **Crowd:** recent nights (face blur where needed for privacy)
- **Staff:** door team, bartenders, DJs (with permission)
- **Events:** sparklers, bottles, big moments
- **Branding:** logo tiles, event graphics for upcoming Wed/Sat

Minimum 10 photos uploaded per week thereafter. GBP rewards recency.

### Products / Services
Add as "Products":
- Table Reservations — link to `/reserve`
- Guest List — link to `/guestlist`
- Private Events & Buyouts — link to `/private`
- Streamer Program — link to `/streamers`

### Booking link (GBP "Reserve a table" button) — P0
GBP surfaces a dedicated **Reserve a table** / **Book** button in the Knowledge Panel and on Maps when a booking URL is set on the profile. Per `docs/implementation-plan.md` §3.6, this button must be wired before we put any paid spend against the profile.

- **Primary booking URL:** `https://bacaraclub.com/reserve?utm_source=gbp&utm_medium=booking&utm_campaign=gbp_reserve_button`
- **Secondary/deeplink URLs** (for weekly Updates posts — see Phase 4):
  - Wednesday post → `https://bacaraclub.com/wednesdays?utm_source=gbp&utm_medium=post&utm_campaign=gbp_wed`
  - Saturday post → `https://bacaraclub.com/saturdays?utm_source=gbp&utm_medium=post&utm_campaign=gbp_sat`
  - Streamer program post → `https://bacaraclub.com/streamers?utm_source=gbp&utm_medium=post&utm_campaign=gbp_streamers`
- **Set via:** GBP dashboard → Info → "Add menu link" / "Add reservations link." If GBP forces a third-party provider (Resy, OpenTable, Tablelist), use the direct URL field instead — do NOT let GBP auto-populate a third-party link it discovers.
- **Verification step:** after setting, search `Bacara Club Miami Beach` in an incognito window and confirm the Reserve button on the Knowledge Panel resolves to the exact UTM URL above. UTM tags must land in GA4 Acquisition → Traffic acquisition as `gbp / booking`.
- **Pixel/GA4 gate:** the `/reserve` page must be verified as firing both Meta Pixel and GA4 events (per CLAUDE.md's "Never run ads at a page that isn't pixel-verified" rule) before the GBP button goes live, because GBP traffic is the cheapest warm traffic we get and we cannot afford to lose attribution on it.

### Menu (if GBP allows for nightclub category)
Add a bottle menu with price ranges if the category permits. If not, include pricing guidance in Products.

## Phase 3 — Reviews flywheel (ongoing)

Google Local Pack ranking is heavily influenced by review count, velocity, and response rate.

**Target:** 5+ new reviews per week, >4.5 average.

**Tactics:**
- Door team asks happy table guests to leave a review as they're leaving — with a branded QR card that deep-links to the GBP review form
- Post-visit SMS follow-up (next morning): "Thanks for closing out the night with us. If you had a great time, a Google review means everything — [link]"
- Respond to every review within 24 hours. Template responses for 5-star, personalized for 4-star and below. Never argue with bad reviews — acknowledge, move offline.
- Flag fake / competitor-sabotage reviews through GBP's dispute flow

## Phase 4 — Weekly content (ongoing)

GBP "Posts" (now called "Updates") are weak for SEO on their own but strong for conversion — they show up in the Knowledge Panel when users search the brand.

**Weekly cadence:**
- **Monday:** "This Wednesday at Bacara" — event post with lineup, photo, "Reserve" CTA deep-linked
- **Thursday:** "This Saturday at Bacara" — same
- **Sunday:** Recap post — photo from the prior weekend + link back to the site
- **Ad hoc:** Any special event, private buyout availability, press mention

Each post gets a call-to-action button ("Book," "Learn more," "Sign up") and a UTM-tagged link.

## Phase 5 — Q&A section

Seed the Q&A section proactively so we control the narrative:
- "What nights is Bacara open?" → "Wednesday through Saturday, 11:30 PM – 5 AM."
- "Does Bacara allow filming or streaming?" → "Yes. Bacara is built for creators — filming and livestreaming are welcome."
- "How do I reserve a table?" → link to `/reserve`
- "What's the dress code?" → upscale, enforced at the door
- "Is there a guest list?" → yes, link to `/guestlist`
- "Who owns Bacara?" → Clavicular acquired the venue in 2026.

All seeded via different Google accounts (staff, not the owner account) with the owner-verified answer marked official.

## Phase 6 — Measurement

Track monthly in the client report:
- Searches (direct vs discovery)
- Profile views
- Website clicks, call clicks, direction requests, "book" clicks
- New reviews count and average rating
- Photo views vs competitors
- Local Pack ranking for the primary query cluster ("Miami Beach nightclub," "Wednesday night Miami," "Saturday night Miami Beach club")

Competitor set to benchmark against: Mona Club, E11EVEN, LIV, Story, Basement, Gala.

## Risks & edge cases

- **Old GBP listing:** The prior Bacara listing (pre-Clavicular) may have outdated info, stale photos, or bad reviews. Plan is to claim and update — NOT create a duplicate. Creating a duplicate triggers Google suppression.
- **Category confusion:** Google sometimes auto-categorizes clubs as "Bar" or "Lounge." Must manually lock primary to Night Club.
- **Review bombing:** Nightlife venues get competitor/incident-based review attacks. Have a playbook ready: document, dispute, respond professionally, never delete.
- **Hours transition at midnight:** Google's hours UI handles overnight hours but it's finicky. Test in incognito after setting, because displayed hours sometimes lag the actual config.
