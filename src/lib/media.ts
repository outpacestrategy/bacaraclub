/**
 * Curated photo manifest for non-event surfaces.
 *
 * All assets are first-party photographs from Bacara Club's 4/16/2026 opening
 * night, encoded by `scripts/encode-media.sh` into two aspects:
 *   - <n>-portrait.jpg   — original aspect, max 1600px on long edge
 *   - <n>-landscape.jpg  — 16:9 center crop at 2400×1350
 *
 * Event card imagery lives in `src/lib/events.ts` (per-event `heroImage`).
 * Home-page Streamers/Experience sections still use placeholder data because
 * the real streamer-partner roster is open question #3 in CLAUDE.md.
 *
 * Alt text rule (CLAUDE.md): factual descriptions only. No fabricated names.
 */

const BASE = "/media/opening-night";

type Photo = {
  /** Public path under /public */
  src: string;
  /** Plain factual alt text */
  alt: string;
};

/** All 20 photos, addressable by source number — for /gallery and ad-hoc use. */
export const OPENING_NIGHT: readonly Photo[] = [
  { src: `${BASE}/1-portrait.jpg`, alt: "Bacara Club host in a grey suit on the opening-night step-and-repeat backdrop." },
  { src: `${BASE}/2-portrait.jpg`, alt: "Packed dance floor at Bacara Club Miami Beach on opening night, raised hands and stage lighting." },
  { src: `${BASE}/3-portrait.jpg`, alt: "Performer with microphone on the Bacara stage on opening night." },
  { src: `${BASE}/4-portrait.jpg`, alt: "Two artists posing in the outdoor cabana area at Bacara Club on opening night." },
  { src: `${BASE}/5-portrait.jpg`, alt: "Guest on the Bacara opening-night step-and-repeat backdrop." },
  { src: `${BASE}/6-portrait.jpg`, alt: "Guests on the Bacara outdoor patio under festival lighting on opening night." },
  { src: `${BASE}/7-portrait.jpg`, alt: "Two guests on the Bacara outdoor patio with palm trees in the background." },
  { src: `${BASE}/8-portrait.jpg`, alt: "Three guests inside Bacara on opening night, broadcast camera rig visible in the foreground." },
  { src: `${BASE}/9-portrait.jpg`, alt: "Bacara host in front of the venue's snake-pattern LED wall." },
  { src: `${BASE}/10-portrait.jpg`, alt: "Stage performance at Bacara on opening night, audience filming with phones." },
  { src: `${BASE}/11-portrait.jpg`, alt: "Phone-on-gimbal rig live-streaming a Bacara performance from the floor." },
  { src: `${BASE}/12-portrait.jpg`, alt: "Bacara dance floor under blue stage lighting on opening night." },
  { src: `${BASE}/13-portrait.jpg`, alt: "Performer on the Bacara stage shooting a selfie video of the crowd." },
  { src: `${BASE}/14-portrait.jpg`, alt: "Bacara guests taking a phone selfie in the middle of the dance floor." },
  { src: `${BASE}/15-portrait.jpg`, alt: "Performer in a Bacara cap with microphone in front of the venue's snake LED wall." },
  { src: `${BASE}/16-portrait.jpg`, alt: "Performer on the intimate Bacara stage on opening night." },
  { src: `${BASE}/17-portrait.jpg`, alt: "Two guests in Bacara's gold-arched entrance hallway." },
  { src: `${BASE}/18-portrait.jpg`, alt: "Bottle service moment at Bacara Club: guest raising two champagne bottles surrounded by bubble effects." },
  { src: `${BASE}/19-portrait.jpg`, alt: "Bacara opening-night marquee reading 'WELCOME BLUE FACE' with the venue's trident logo." },
  { src: `${BASE}/20-portrait.jpg`, alt: "Headlining performer on the Bacara stage on opening night." },
] as const;

/** Convenience accessor by source number (1-indexed). */
export function photo(n: number): Photo {
  const p = OPENING_NIGHT[n - 1];
  if (!p) throw new Error(`opening-night photo #${n} not found`);
  return p;
}

/** 16:9 landscape variant for the same source number. */
export function landscape(n: number): Photo {
  const portrait = photo(n);
  return { src: portrait.src.replace("-portrait.jpg", "-landscape.jpg"), alt: portrait.alt };
}

/** Curated subset for the /gallery page. */
export const GALLERY_PICKS: readonly number[] = [
  2, 18, 11, 14, 4, 6, 7, 8, 17, 10, 13, 19,
] as const;

/** Hero strip imagery for landing pages. */
export const LANDER_HERO = {
  wednesdays: landscape(2),
  saturdays: landscape(18),
  streamers: landscape(11),
  private: landscape(4),
} as const;

/** /about portraits. */
export const ABOUT_PORTRAITS = {
  host: photo(1),
  venue: photo(9),
} as const;
