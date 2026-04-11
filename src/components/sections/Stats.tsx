"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { PLACEHOLDER_STATS } from "@/lib/placeholder-data";

/**
 * Stats strip — three animated counters (Tables · Square Feet · Guest Capacity).
 *
 * Visual reference: mona club stats row. Bacara takes the same layout (big numbers,
 * small labels, vertical dividers) but:
 *  - Uses Bodoni Moda for the number, so it carries the brand display voice.
 *  - Drops the red center stripe; dividers are border-color (subtle white @ 8%).
 *  - Counters animate only when the section enters the viewport.
 *
 * IMPORTANT: Per CLAUDE.md "never ship a fake number" rule, every counter carries
 * data-placeholder="true" so a pre-launch QA pass can grep and ensure real numbers
 * have replaced the defaults.
 */
export function Stats() {
  return (
    <section className="relative py-24 md:py-32">
      {/* Warm champagne wash behind the numbers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[720px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,165,72,0.08),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-3 sm:gap-0">
          {PLACEHOLDER_STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-placeholder="true"
              className={
                i > 0
                  ? "flex flex-col items-center text-center sm:border-l sm:border-border"
                  : "flex flex-col items-center text-center"
              }
            >
              <Counter to={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-fg-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Count-up number. Animates from 0 to `to` when scrolled into view, then stops.
 * Respects prefers-reduced-motion — just snaps to the final value.
 */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => Math.round(v).toLocaleString());
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, {
      duration: 2.2,
      ease: [0.25, 0.4, 0.25, 1],
    });
    return () => controls.stop();
  }, [inView, to, value, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className="inline-flex items-baseline font-[family-name:var(--font-display)] text-6xl leading-none text-fg md:text-7xl"
    >
      <motion.span>{display}</motion.span>
      <span className="text-accent">{suffix}</span>
    </span>
  );
}
