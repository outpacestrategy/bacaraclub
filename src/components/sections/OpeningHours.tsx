"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionHeader } from "@/components/sections/SectionHeader";
import { CTA } from "@/lib/constants";
import { OPENING_HOURS } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

/**
 * Opening Hours — 7 day cards, today highlighted in accent gold.
 *
 * The "today" lookup runs in useEffect so the SSR output is identical regardless of
 * when the page is built. This avoids a hydration mismatch for statically-rendered
 * routes and keeps the initial HTML cache-safe.
 *
 * Layout mirrors mona club (row of 7 stacked cards) but:
 *  - Flagship nights (Wed + Sat) get a tiny "On Air" tag instead of the mona red box
 *  - Today glows with accent gold, not broadcast red
 *  - Closed days stay dim but legible
 */
export function OpeningHours() {
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // We deliberately defer reading the current day until after hydration. If we computed
    // this during render (server or client initialization), a statically-prerendered page
    // would ship with the build-time day baked into the HTML, which is always wrong.
    // The setState-in-effect linter rule flags this; it's the correct pattern here because
    // `new Date()` is an external (wall clock) system, not derivable React state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayIndex(new Date().getDay());
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      {/* Soft broadcast-red wash. Sparing use — one red per page, this is that one. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[800px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(239,68,68,0.08),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Schedule"
          title="Opening"
          highlight="Hours"
          description="Bacara is open two nights a week: Wednesday and Saturday. Both are flagship broadcast nights. Closed Sunday through Tuesday and Thursday through Friday."
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-7">
          {OPENING_HOURS.map((day, i) => {
            const isToday = todayIndex === day.dayIndex;
            const isClosed = !day.hours;

            return (
              <motion.div
                key={day.day}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: "blur(6px)" }
                }
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl border p-5 text-center transition-colors",
                  isToday
                    ? "border-accent bg-accent/[0.04] shadow-[0_0_60px_-20px_var(--accent-glow)]"
                    : isClosed
                      ? "border-border bg-bg-elevated/40"
                      : "border-border bg-bg-elevated/70"
                )}
              >
                {/* Flagship streaming badge — Wed + Sat */}
                {day.flagship && (
                  <span
                    className="absolute -top-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-live/50 bg-bg px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-live"
                    aria-label="Flagship streaming night"
                  >
                    <span className="relative flex h-1 w-1">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-70" />
                      <span className="relative inline-flex h-1 w-1 rounded-full bg-live" />
                    </span>
                    On Air
                  </span>
                )}

                <p
                  className={cn(
                    "font-[family-name:var(--font-display)] text-xl",
                    isToday ? "text-accent" : "text-fg"
                  )}
                >
                  {day.short}
                </p>
                <p
                  className={cn(
                    "mt-3 text-xs uppercase tracking-[0.12em]",
                    isClosed ? "text-fg-subtle" : "text-fg-muted"
                  )}
                >
                  {day.hours ?? "Closed"}
                </p>

                {isToday && (
                  <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-accent">
                    Today
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={CTA.reserve.href}
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
          >
            {CTA.reserve.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
