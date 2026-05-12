# Claude Code Kickoff Prompt — Bacara Club

Paste the block below into Claude Code from inside the `bacara-club/` directory. It reads the full project context, confirms scaffold state, and starts applying the P0 amendments from the competitive research. Reuse this file verbatim any time a fresh Claude Code session needs to pick the project back up.

---

You're working on the Bacara Club project — Miami Beach's first streaming nightclub, acquired by Clavicular, built by Outpace Strategy Group. Domain is bacaraclub.com. Instagram is @bacaraclub. Flagship nights are Wednesday and Saturday.

Before writing any code, read these files in this exact order and treat them as the source of truth:

1. `CLAUDE.md` — locked decisions, hard rules, handoff status, resolved answers
2. `overview.md` — client positioning, audience, scope
3. `docs/site-plan.md` — sitemap and page-by-page build spec
4. `brand/brand-direction.md` — colors, typography, tone, motion language
5. `research/competitive-analysis.md` — what the top Miami nightclubs (E11EVEN, LIV, STORY, Mona, Space, Treehouse, Mynt) do well and what they miss
6. `docs/implementation-plan.md` — prioritized amendments tagged P0/P1/P2/P3 with NEW/AMEND/CONFIRM status
7. `docs/seo-geo-strategy.md`, `docs/meta-ads-strategy.md`, `docs/google-business-strategy.md` — paid/organic strategy the site must support

Then do a state check before touching anything:

- Run `npm run build` and confirm it passes with zero errors
- Run `npx tsc --noEmit` and confirm zero type errors
- Open `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/reserve/page.tsx`, `src/app/wednesdays/page.tsx`, and `src/app/saturdays/page.tsx` and summarize for me what's currently implemented vs what's still stubbed
- Confirm the analytics components, schema components, sitemap, robots, and Netlify config all exist and look correct
- Report the delta between the current code and what `docs/site-plan.md` describes

Once the state check is clear, start working through the **P0** items in `docs/implementation-plan.md` in this order, shipping each one as a clean commit before moving on. Do not skip ahead to P1 or higher. Do not re-litigate any locked decision in `CLAUDE.md` — if something looks wrong, raise it as a question before touching the file.

**P0 work order:**

1. **Event-first `/reserve` quiz (item 1.1).** Step 1 of the quiz becomes a list of the next 4–6 specific upcoming Wed/Sat events pulled from an events data source, each with date, DJ/theme, and hero image. "Other date" remains as a fallback option. Wire the selected event through the rest of the quiz state and into the Supabase submission payload.

2. **VIP host SLA promise (item 1.2).** The quiz success state reads: "You're in. A Bacara VIP host will text you within 30 minutes to lock in your table." Include an "Add to Calendar" button for the selected night and an Instagram follow CTA.

3. **Multi-channel reservation paths (item 1.3).** Every reservation page (`/reserve`, `/wednesdays`, `/saturdays`) gets a "Prefer another way to book?" block listing email (`tables@bacaraclub.com`), text (placeholder `TBD` until the phone number is provisioned — render as a coming-soon slot, do not invent a number), and a future Tablelist link (stubbed for now).

4. **Table pricing range guidance (item 1.4).** `/wednesdays` and `/saturdays` each get a "Table pricing guidance" section showing ranges for Main Floor, VIP Booth, Streamer Table, and Private Area. Use placeholder ranges with a visible note that reads "Pricing confirmed with the Bacara team — update before launch." Do not invent real numbers.

5. **Hero video build spec (item 2.1).** Implement the HeroVideo component with a 10–30 second loop, muted, looped, `playsinline`, `autoplay`, target file size under 5MB, 720p ~24fps. Mobile fallback swaps the video for a still poster via a responsive `<picture>` or CSS breakpoint. Preload the poster, lazy-load the video file. Confirm LCP isn't impacted by running Lighthouse on the home page after the change.

6. **Event JSON-LD on every upcoming night (item 3.1).** Create `src/components/seo/EventSchema.tsx` that accepts an event object (name, startDate, endDate, performer, offers, etc.) and renders the full `Event` JSON-LD per the spec in `docs/implementation-plan.md` section 3.1. Use it on `/events/[slug]` and on any upcoming-event cards that surface on `/`, `/wednesdays`, `/saturdays`.

7. **GBP booking link wiring (item 3.6).** This is a GBP operational task, not a code task, but drop a note in `docs/google-business-strategy.md` confirming the "Reserve" button on the future GBP listing must point at `https://bacaraclub.com/reserve?utm_source=gbp&utm_medium=booking` so the click fires as a ranking signal. Do not modify the GBP itself from code.

After P0 is shipped, pause and show me:
- A diff summary of what changed
- Any new env vars or Supabase tables the changes depend on
- Which "Open questions" in `CLAUDE.md` are now unblocked or still outstanding
- A Lighthouse score for `/`, `/wednesdays`, `/saturdays`, and `/reserve` on mobile
- The top three risks or concerns you hit along the way

Do not touch P1 items (Live Broadcast indicator, newsletter, press strip, deep FAQ, TikTok plan, bilingual captions, creator program upgrade, first-party gallery) until I explicitly approve the P0 commit.

Hard rules still apply:
- Never hardcode secrets. Everything sensitive goes in `.env.local`, referenced via `process.env`.
- Never fabricate numbers — bottle counts, attendance, reviews, pricing, celebrity visits. If data isn't available, leave a clearly marked placeholder.
- Never use emoji in UI. Lucide React icons only.
- Never ship analytics changes at a page that hasn't been Pixel/GA-verified end-to-end.
- Always respect `prefers-reduced-motion` on any new animation.
- Always keep `metadataBase`, canonical URLs, and `NEXT_PUBLIC_SITE_URL` pointing at `https://bacaraclub.com`.

Start now. First action: read the files listed above, then run the state check, then report back before writing any code.
