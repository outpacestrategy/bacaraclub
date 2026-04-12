/**
 * Stream status derivation — "is a Bacara broadcast live right now?"
 *
 * Single source of truth for the Live Broadcast indicator (LiveBadge) in the
 * header, and anywhere else the site needs to know whether we're on-air.
 *
 * Per docs/implementation-plan.md §2.2, this is the differentiator surface for
 * the "streaming nightclub" positioning. The badge makes the tagline visceral:
 * it actually changes state when a broadcast is happening.
 *
 * Data source:
 *   Today — `UPCOMING_EVENTS` is the canonical schedule. We consider a
 *   broadcast "live" if the current clock time falls inside any event's
 *   [startDate, endDate) window. This means the badge lights up automatically
 *   every Wed/Sat night from 10 PM – 5 AM ET without any manual toggle.
 *
 *   Milestone 6 — swap the data source to a Supabase `stream_status` row fed
 *   by a webhook from the streamer platform. The return type here is the
 *   contract the UI depends on — keep it stable across the swap so the
 *   LiveBadge and any future /live aggregator page don't need to change.
 *
 * Pure function, no side effects, no IO. Safe to call from server components,
 * client components, and during SSR/SSG.
 */

import { UPCOMING_EVENTS, type UpcomingEvent } from "@/lib/events";

export type StreamStatus =
  | { isLive: true; current: UpcomingEvent; next: UpcomingEvent | undefined }
  | { isLive: false; current: null; next: UpcomingEvent | undefined };

/**
 * Derives stream status from the schedule at a given moment.
 *
 * @param now Defaults to `new Date()` — override for deterministic tests.
 */
export function getStreamStatus(now: Date = new Date()): StreamStatus {
  const nowMs = now.getTime();

  // Defensive: sort by startDate. UPCOMING_EVENTS is authored earliest-first
  // today but consumers shouldn't depend on author order.
  const sorted = [...UPCOMING_EVENTS].sort(
    (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate),
  );

  const live = sorted.find((event) => {
    const start = Date.parse(event.startDate);
    const end = Date.parse(event.endDate);
    return nowMs >= start && nowMs < end;
  });

  const next = sorted.find((event) => Date.parse(event.startDate) > nowMs);

  if (live) {
    return { isLive: true, current: live, next };
  }
  return { isLive: false, current: null, next };
}

/**
 * Short display label for the dark-state badge: "Next SAT · 10 PM".
 *
 * Timezone is pinned to America/New_York so every visitor (EST viewer, PST
 * viewer, European viewer) sees the same label — the venue's local time, not
 * their own. This keeps "Next SAT · 10 PM" meaningful as a Miami Beach clock.
 */
export function formatNextStreamLabel(
  event: UpcomingEvent | undefined,
): string {
  if (!event) return "Next stream TBA";
  const start = new Date(event.startDate);
  const weekday = start
    .toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "America/New_York",
    })
    .toUpperCase();
  const hour = start
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      timeZone: "America/New_York",
    })
    // Collapse "10 PM" vs "10:00 PM" — toLocaleTimeString with hour:"numeric"
    // already returns "10 PM" on modern engines, but strip any accidental
    // whitespace variants for safety.
    .replace(/\s+/g, " ")
    .trim();
  return `Next ${weekday} · ${hour}`;
}
