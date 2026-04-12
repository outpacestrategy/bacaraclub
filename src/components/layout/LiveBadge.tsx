"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import {
  formatNextStreamLabel,
  getStreamStatus,
  type StreamStatus,
} from "@/lib/stream-status";

/**
 * Live Broadcast indicator — the single most visible reinforcement of the
 * "streaming nightclub" positioning. Ships per docs/implementation-plan.md §2.2.
 *
 * States:
 *  - **On air** — a current event is happening right now. Red pulsing dot,
 *    red-tinted pill, links to that event's detail page. Announced as "Live
 *    now" to assistive tech.
 *  - **Next up** — no event is live. Muted dot, subtle border, links to the
 *    next scheduled event. Label is "Next SAT · 10 PM" format, pinned to the
 *    Miami Beach clock so out-of-town viewers don't see their own timezone.
 *  - **Hydration placeholder** — rendered during SSR and the first paint
 *    before the client-side effect runs. This is intentionally inert (no
 *    time-sensitive content) so the server-rendered HTML matches every
 *    client's first paint regardless of clock drift, preventing a React
 *    hydration mismatch. The effect takes over on the next tick.
 *
 * Polling: re-derives status every 60 s. The derivation is a pure local
 * computation against the bundled UPCOMING_EVENTS schedule — no network —
 * so 60 s is conservative; it's the same cadence the Milestone 6 Supabase
 * swap will use so we keep the rhythm predictable.
 *
 * The whole component respects prefers-reduced-motion: on machines that
 * request reduced motion, the ping ring is suppressed and only the solid
 * red dot remains.
 */
const POLL_MS = 60_000;

export function LiveBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<StreamStatus | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setStatus(getStreamStatus());
    const id = window.setInterval(() => {
      setStatus(getStreamStatus());
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  // Hydration-safe placeholder. Must be visually stable and not time-sensitive
  // — render the neutral "Wed & Sat" label so SSR output is deterministic.
  if (!status) {
    return (
      <span
        suppressHydrationWarning
        className={`inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-fg-subtle ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
        Wed &amp; Sat
      </span>
    );
  }

  if (status.isLive) {
    return (
      <Link
        href={`/events/${status.current.slug}`}
        aria-label={`Live now — ${status.current.title}`}
        className={`group inline-flex items-center gap-2 rounded-full border border-live/50 bg-live/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-fg transition-colors hover:border-live hover:bg-live/20 ${className}`}
      >
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          {!prefersReducedMotion && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
        </span>
        On Air
      </Link>
    );
  }

  const nextLabel = formatNextStreamLabel(status.next);
  const href = status.next ? `/events/${status.next.slug}` : "/events";
  return (
    <Link
      href={href}
      aria-label={`Next broadcast ${nextLabel}`}
      className={`inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-fg-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
      {nextLabel}
    </Link>
  );
}
