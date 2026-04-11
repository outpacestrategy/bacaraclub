"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
 * Mobile fallback (per docs/implementation-plan.md §2.1): the 6.9 MB MP4 is
 * heavy for cellular ad traffic, so the `<video>` element is NOT rendered at
 * all on mobile — it's conditionally mounted only after a matchMedia check
 * confirms the viewport is >=768 px. CSS `display: none` is not enough
 * because Chrome still downloads the `<source>` regardless of CSS
 * visibility; conditional rendering is the only way to fully suppress the
 * MP4 fetch on cellular ad traffic. Phones render the poster via `next/image`.
 *
 * The video element uses `autoPlay muted loop playsInline` for cross-browser
 * autoplay (Safari and iOS require all four attributes for inline mute autoplay
 * to be allowed without user interaction).
 *
 * Foreground text uses Framer entry animations on mount — except for the h1,
 * which paints statically. The h1 is the LCP candidate for this page: wrapping
 * it in the blurred/translated Framer initial state pushed Lighthouse's LCP
 * timing past 5 s on simulated mobile because the "paint" moment is tied to
 * the animation completing, not to hydration. Rendering the h1 plain-DOM
 * (no motion wrapper) drops LCP by ~3 s while the surrounding pill /
 * description / CTAs keep their entry animations for polish.
 *
 * Reduced-motion drops the transform/blur and does opacity-only, matching
 * the rest of the site's a11y treatment.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const showVideo = useDesktopOnlyVideo();

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
      {/* Poster — always rendered, visible on mobile and while the video is
          decoding on desktop. Priority-loaded so it's the LCP candidate. */}
      <Image
        src="/brand/bacara-hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        aria-hidden="true"
      />

      {/* Desktop-only video — conditionally mounted AFTER hydration once
          matchMedia confirms viewport >=768px. Prevents the 6.9 MB MP4 from
          being downloaded on mobile ad traffic. */}
      {showVideo && (
        <video
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/brand/bacara-hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/brand/bacara-hero.mp4" type="video/mp4" />
        </video>
      )}

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

        {/* h1 is rendered statically (no motion wrapper) so it's the LCP
            element the instant hydration finishes. See the block comment at
            the top of this file for the rationale. */}
        <h1 className="mt-8 text-balance text-5xl leading-[1.02] text-fg drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] md:text-7xl">
          {SITE.tagline}.
        </h1>

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

/**
 * Returns true only after the client has hydrated AND the viewport is
 * >=768 px. SSR + mobile first-render always returns false so the server
 * HTML contains no `<video>` element and Chrome never kicks off the 6.9 MB
 * MP4 download on cellular. On desktop the video appears one tick after
 * hydration, which is visually covered by the poster image behind it.
 */
function useDesktopOnlyVideo(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return enabled;
}
