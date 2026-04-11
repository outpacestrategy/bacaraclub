"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/ui/circular-gallery-2";
import { PLACEHOLDER_STREAMERS } from "@/lib/placeholder-data";

/**
 * Meet the Streamers — curved WebGL gallery.
 *
 * Replaces the earlier infinite marquee with a `CircularGallery` (OGL / WebGL) that
 * bends the card track into a subtle arc and accepts drag + wheel + touch scroll.
 *
 * The gallery reads its label font, weight, size, and color from the computed style
 * of its container. We set those with Tailwind (`text-fg`, the Bodoni Moda display
 * font var, and a 24px sizing) so the labels bake into the canvas textures using the
 * same Bodoni Moda face as every other heading on the page.
 *
 * The section chrome (eyebrow, title, description, Creator program CTA) is unchanged.
 */
export function Streamers() {
  const items: GalleryItem[] = useMemo(
    () =>
      PLACEHOLDER_STREAMERS.map((s) => ({
        image: s.portrait,
        text: s.name,
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-10 w-full max-w-7xl px-5 md:mb-14 md:px-8">
        <SectionHeader
          eyebrow="Streamers"
          title="Meet the"
          highlight="Creators"
          description="Every night at Bacara is a broadcast. These are some of the creators who stream from the best seat in Miami Beach."
        />
      </div>

      {/*
       * The gallery needs a fixed-height container. Height is tuned so the curved
       * arc is visible without pushing the next section off screen on short viewports.
       */}
      <div
        className="relative h-[520px] w-full md:h-[600px]"
        data-placeholder="true"
      >
        {/* Edge fades — softens the infinite loop seam against the page background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-32"
        />

        <CircularGallery
          items={items}
          bend={2.5}
          borderRadius={0.06}
          scrollEase={0.04}
          scrollSpeed={2}
          // Slow continuous drift by default. User drag / wheel / touch still override
          // the motion while active; auto-scroll resumes seamlessly on release.
          autoScrollSpeed={0.018}
          // Tailwind-v4 arbitrary-value classes drive getComputedStyle() inside the
          // component. The gallery bakes these into its WebGL text textures.
          className="font-[family-name:var(--font-display)] text-[24px] font-medium text-fg md:text-[28px]"
          aria-label="Creators who stream from Bacara"
        />
      </div>

      <div className="mt-12 text-center md:mt-16">
        <Link
          href="/streamers"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
        >
          Creator program
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
