"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { CTA } from "@/lib/constants";

/**
 * Mobile sticky bottom CTA bar.
 *
 * Ships the P0 requirement called out in both `docs/site-plan.md` and
 * `docs/implementation-plan.md §2.6`: "a sticky floating Reserve a Table
 * bottom bar that appears after the hero scrolls out … visible on every
 * page after the hero scrolls out." Research validated this is universal
 * in every winning Miami nightclub mobile experience.
 *
 * Visibility rules:
 *   - Only renders on sub-sm viewports. sm+ already has the header Reserve
 *     pill permanently visible, so a duplicated bottom bar would be noise.
 *   - Hidden until the user scrolls past the hero fold (~480px). This keeps
 *     the fold clean and lets the hero CTAs be the primary call on first
 *     paint, then picks up as a persistent reminder once the user commits
 *     to scrolling.
 *   - Hidden on `/reserve` (user is already in the conversion flow — an
 *     extra sticky Reserve button would nag, not help).
 *   - Hidden on `/admin/*` if/when that surface ships.
 *
 * Respects prefers-reduced-motion: the slide-up entry collapses to a plain
 * opacity fade so the bar still announces itself without the translation.
 *
 * Safe-area inset: iPhones with home indicators need `env(safe-area-inset-
 * bottom)` padding so the primary CTA isn't overlapped by the grabber. The
 * parent wrapper applies that padding on the outside of the pill so the
 * visible chrome stays consistent across devices.
 */
const SCROLL_THRESHOLD_PX = 480;

const HIDDEN_PATHS: ReadonlyArray<string | RegExp> = [
  "/reserve",
  /^\/admin(\/|$)/,
];

export function MobileStickyCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHidden = HIDDEN_PATHS.some((p) =>
    typeof p === "string" ? pathname === p : p.test(pathname ?? ""),
  );
  if (isHidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          // Container pads for iPhone safe-area and positions the bar 12px
          // off the bottom. Hidden on sm+ where the header Reserve pill is
          // already permanently visible.
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:hidden"
          aria-label="Book a table"
        >
          <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-bg-elevated/95 p-1.5 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <Link
              href={CTA.reserve.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
            >
              {CTA.reserve.label}
            </Link>
            <Link
              href={CTA.guestlist.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-border bg-bg/60 px-5 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {CTA.guestlist.label}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
