"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { CTA, SITE } from "@/lib/constants";

/**
 * Home page Hero — full-bleed autoplaying video background with foreground
 * LIVE pill, tagline, description, and the two primary CTAs (Reserve + Guest
 * List). All foreground content sits above the fold from frame 1, which is
 * critical for ad traffic landing on `/`, `/wednesdays`, or `/saturdays`.
 *
 * Video pipeline:
 *  - Source: `brand/bacara-hero-source.mov` (1080×1920 portrait H.264, ~34 MB, 24 s)
 *  - Served: `public/brand/bacara-hero.mp4` — encoded via ffmpeg to 720×1280 H.264
 *    CRF 26 with `+faststart`, audio stripped (hero videos are muted anyway), ~6.9 MB
 *  - Poster: `public/brand/bacara-hero-poster.jpg` — first frame at t=1s, used while
 *    the video is decoding so there's no flash of background color on cold load.
 *
 * The video element uses `autoPlay muted loop playsInline` for cross-browser
 * autoplay (Safari and iOS require all four attributes for inline mute autoplay
 * to be allowed without user interaction). `preload="auto"` is set so the
 * decoder starts as early as possible — the file is small enough that
 * pre-fetching doesn't meaningfully hurt LCP, and the alternative (a poster
 * frame visible for 200-500ms before playback starts) feels broken.
 *
 * Foreground text uses Framer entry animations on mount. Reduced-motion drops
 * the transform/blur and does opacity-only, matching the rest of the site's
 * a11y treatment.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const textInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 16, filter: "blur(8px)" };
  const textAnimate = { opacity: 1, y: 0, filter: "blur(0px)" };
  const textTransition = (delay: number) => ({
    duration: 0.9,
    delay,
    ease: [0.25, 0.4, 0.25, 1] as const,
  });

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      <video
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/brand/bacara-hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/brand/bacara-hero.mp4" type="video/mp4" />
      </video>

      {/*
       * Radial scrim — darker in the center where the text sits, lighter at
       * the edges so the video can still breathe. This is the single most
       * important readability layer; without it the headline disappears into
       * the brighter frames of the video.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(10,10,10,0.55),rgba(10,10,10,0.92))]"
      />

      {/* Top + bottom fades so the hero dissolves into the surrounding bg. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-bg via-bg/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-bg via-bg/60 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.span
          initial={textInitial}
          animate={textAnimate}
          transition={textTransition(0.1)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-fg-muted backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
          </span>
          Now Broadcasting Live · Wed &amp; Sat
        </motion.span>

        <motion.h1
          initial={textInitial}
          animate={textAnimate}
          transition={textTransition(0.25)}
          className="mt-8 text-balance text-5xl leading-[1.02] text-fg drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] md:text-7xl"
        >
          {SITE.tagline}.
        </motion.h1>

        <motion.p
          initial={textInitial}
          animate={textAnimate}
          transition={textTransition(0.4)}
          className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-fg-muted md:text-lg"
        >
          Wednesdays and Saturdays in Miami Beach. Always on air. Built for creators,
          backed by Clavicular.
        </motion.p>

        <motion.div
          initial={textInitial}
          animate={textAnimate}
          transition={textTransition(0.55)}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href={CTA.reserve.href}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_60px_-12px_var(--accent-glow)] transition-colors hover:bg-accent-hover sm:w-auto"
          >
            {CTA.reserve.label}
          </Link>
          <Link
            href={CTA.guestlist.href}
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-bg/30 px-6 py-3 text-sm text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent sm:w-auto"
          >
            {CTA.guestlist.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
