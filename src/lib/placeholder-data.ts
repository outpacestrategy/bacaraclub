/**
 * DEV PLACEHOLDER DATA — DO NOT SHIP.
 *
 * Per CLAUDE.md hard rule: "Never ship a fake number. Do not fabricate bottle counts,
 * attendance numbers, celebrity visits, or reviews."
 *
 * Everything in this file is a placeholder used only to scaffold the Milestone 3 sections
 * while the client supplies real events, photos, stats, and streamer partners. Every
 * consumer of this file is marked with a `data-placeholder` attribute in the DOM so that
 * a pre-launch QA pass can grep for it and verify nothing placeholder ships to production.
 *
 * Open questions tracked in CLAUDE.md:
 *  - Real capacity numbers, table count, square footage (Stats)
 *  - Real streamer partner list (Streamers)
 *  - Real upcoming event calendar (UpcomingEvents)
 *  - Real photography for the Experience carousel
 */

export type PlaceholderEvent = {
  slug: string;
  night: "wednesday" | "saturday" | "special";
  dateLine: string; // e.g. "SAT · APR 11"
  title: string;
  host: string;
  gradient: string; // Tailwind gradient classes for the card cover placeholder
};

export const PLACEHOLDER_EVENTS: readonly PlaceholderEvent[] = [
  {
    slug: "saturday-apr-11",
    night: "saturday",
    dateLine: "SAT · APR 11",
    title: "Saturday Broadcast",
    host: "Resident · TBD",
    gradient: "from-accent/40 via-accent/5 to-transparent",
  },
  {
    slug: "wednesday-apr-15",
    night: "wednesday",
    dateLine: "WED · APR 15",
    title: "Wednesday On Air",
    host: "Resident · TBD",
    gradient: "from-live/25 via-live/5 to-transparent",
  },
  {
    slug: "saturday-apr-18",
    night: "saturday",
    dateLine: "SAT · APR 18",
    title: "Bacara Presents",
    host: "Guest · TBD",
    gradient: "from-purple-600/35 via-purple-600/5 to-transparent",
  },
  {
    slug: "wednesday-apr-22",
    night: "wednesday",
    dateLine: "WED · APR 22",
    title: "Mid-Week Stream",
    host: "Resident · TBD",
    gradient: "from-emerald-600/30 via-emerald-600/5 to-transparent",
  },
  {
    slug: "saturday-apr-25",
    night: "saturday",
    dateLine: "SAT · APR 25",
    title: "Late Spring",
    host: "Guest · TBD",
    gradient: "from-amber-600/35 via-amber-600/5 to-transparent",
  },
  {
    slug: "wednesday-apr-29",
    night: "wednesday",
    dateLine: "WED · APR 29",
    title: "Creator Night",
    host: "Streamer Takeover",
    gradient: "from-sky-600/35 via-sky-600/5 to-transparent",
  },
] as const;

/**
 * Placeholder stats. These are illustrative only — real numbers come from the client.
 * Numbers roughly match a typical boutique Miami Beach club footprint.
 */
export type PlaceholderStat = {
  value: number;
  suffix: string;
  label: string;
};

export const PLACEHOLDER_STATS: readonly PlaceholderStat[] = [
  { value: 15, suffix: "+", label: "Tables" },
  { value: 4200, suffix: "+", label: "Square Feet" },
  { value: 199, suffix: "+", label: "Guest Capacity" },
] as const;

export type PlaceholderStreamer = {
  name: string;
  handle: string;
  platform: "Twitch" | "Kick" | "TikTok" | "IG Live" | "YouTube";
  followers: string;
  gradient: string;
  /**
   * Portrait URL. Uses picsum.photos with a stable seed so builds are deterministic
   * and the image cache stays warm. Replace with real creator headshots on launch.
   */
  portrait: string;
};

// Picsum seeds chosen for portrait-style compositions. Grayscale + 800x1000 portrait ratio
// so the curved WebGL gallery renders moody, nightclub-appropriate tiles.
const portrait = (seed: string) =>
  `https://picsum.photos/seed/bacara-${seed}/800/1000?grayscale&blur=1`;

export const PLACEHOLDER_STREAMERS: readonly PlaceholderStreamer[] = [
  {
    name: "Alex R.",
    handle: "@alexrstreams",
    platform: "Twitch",
    followers: "420K",
    gradient: "from-purple-600/60 via-indigo-600/30 to-transparent",
    portrait: portrait("alex"),
  },
  {
    name: "Jordan K.",
    handle: "@jordankicks",
    platform: "Kick",
    followers: "180K",
    gradient: "from-emerald-600/60 via-teal-600/30 to-transparent",
    portrait: portrait("jordan"),
  },
  {
    name: "Mia L.",
    handle: "@mialive",
    platform: "TikTok",
    followers: "1.2M",
    gradient: "from-pink-600/60 via-rose-600/30 to-transparent",
    portrait: portrait("mia"),
  },
  {
    name: "Devin B.",
    handle: "@devinbroadcast",
    platform: "IG Live",
    followers: "310K",
    gradient: "from-amber-600/60 via-orange-600/30 to-transparent",
    portrait: portrait("devin"),
  },
  {
    name: "Sasha V.",
    handle: "@sashav_live",
    platform: "YouTube",
    followers: "620K",
    gradient: "from-red-600/60 via-rose-600/30 to-transparent",
    portrait: portrait("sasha"),
  },
  {
    name: "Rico M.",
    handle: "@ricomiami",
    platform: "Kick",
    followers: "95K",
    gradient: "from-cyan-600/60 via-sky-600/30 to-transparent",
    portrait: portrait("rico"),
  },
  {
    name: "Naomi P.",
    handle: "@naomistream",
    platform: "Twitch",
    followers: "240K",
    gradient: "from-fuchsia-600/60 via-purple-600/30 to-transparent",
    portrait: portrait("naomi"),
  },
  {
    name: "Theo D.",
    handle: "@theobroadcasts",
    platform: "YouTube",
    followers: "510K",
    gradient: "from-lime-600/60 via-emerald-600/30 to-transparent",
    portrait: portrait("theo"),
  },
] as const;

/**
 * Opening hours.
 * Per CLAUDE.md: "The venue operates Wed–Sat only." Flagship streaming nights are Wed + Sat,
 * but Thu + Fri are also open for regular service. dayIndex matches JS Date.getDay() (0 = Sunday).
 */
export type OpeningDay = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  short: string;
  hours: string | null; // null = closed
  flagship: boolean; // flagship streaming night
  dayIndex: number;
};

export const OPENING_HOURS: readonly OpeningDay[] = [
  { day: "Monday", short: "Mon", hours: null, flagship: false, dayIndex: 1 },
  { day: "Tuesday", short: "Tue", hours: null, flagship: false, dayIndex: 2 },
  { day: "Wednesday", short: "Wed", hours: "10 PM – 5 AM", flagship: true, dayIndex: 3 },
  { day: "Thursday", short: "Thu", hours: "10 PM – 5 AM", flagship: false, dayIndex: 4 },
  { day: "Friday", short: "Fri", hours: "10 PM – 5 AM", flagship: false, dayIndex: 5 },
  { day: "Saturday", short: "Sat", hours: "10 PM – 5 AM", flagship: true, dayIndex: 6 },
  { day: "Sunday", short: "Sun", hours: null, flagship: false, dayIndex: 0 },
] as const;

/**
 * Experience carousel placeholder cards.
 * Real content will be a mix of stream stills, bottle service moments, and crowd shots
 * sourced from @bacaraclub's IG archive and new shoots.
 *
 * `imageUrl` uses the same picsum grayscale+blur pattern as the streamers so the
 * placeholder aesthetic is unified across the site. Swap for real photography on launch.
 */
export type ExperienceSlide = {
  id: string;
  label: string;
  caption: string;
  gradient: string;
  imageUrl: string;
  imagePosition?: string;
};

// Separate seeds from the streamers so the gallery shows distinct picsum images.
const experienceImage = (seed: string) =>
  `https://picsum.photos/seed/bacara-exp-${seed}/900/1200?grayscale&blur=1`;

export const PLACEHOLDER_EXPERIENCE: readonly ExperienceSlide[] = [
  {
    id: "stream-booth",
    label: "STREAM BOOTH",
    caption: "Broadcast setup, night one",
    gradient: "from-accent/60 via-amber-700/30 to-zinc-900",
    imageUrl: experienceImage("booth"),
  },
  {
    id: "bottle-service",
    label: "BOTTLE SERVICE",
    caption: "Sparklers and spades",
    gradient: "from-pink-600/60 via-rose-700/30 to-zinc-900",
    imageUrl: experienceImage("bottle"),
  },
  {
    id: "dance-floor",
    label: "THE FLOOR",
    caption: "Saturday, mid-broadcast",
    gradient: "from-purple-600/60 via-indigo-700/30 to-zinc-900",
    imageUrl: experienceImage("floor"),
  },
  {
    id: "dj-booth",
    label: "DJ BOOTH",
    caption: "Residents on deck",
    gradient: "from-emerald-600/60 via-teal-700/30 to-zinc-900",
    imageUrl: experienceImage("dj"),
  },
  {
    id: "vip-room",
    label: "VIP ROOM",
    caption: "Private broadcast",
    gradient: "from-red-600/60 via-rose-700/30 to-zinc-900",
    imageUrl: experienceImage("vip"),
  },
  {
    id: "creator-table",
    label: "CREATOR TABLE",
    caption: "Streamer takeover",
    gradient: "from-sky-600/60 via-cyan-700/30 to-zinc-900",
    imageUrl: experienceImage("creator"),
  },
  {
    id: "room-wide",
    label: "THE ROOM",
    caption: "Full house, full stream",
    gradient: "from-fuchsia-600/60 via-purple-700/30 to-zinc-900",
    imageUrl: experienceImage("room"),
  },
] as const;
