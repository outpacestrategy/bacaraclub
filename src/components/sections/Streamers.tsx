"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/ui/circular-gallery-2";
import { OPENING_NIGHT } from "@/lib/media";

/**
 * Our Favorite Moments — curved WebGL gallery.
 *
 * Renders the 20 opening-night photographs in an OGL-driven curved gallery
 * with drag + wheel + touch scroll and a slow continuous drift.
 *
 * Tile labels are intentionally empty — these are vibe shots, not portraits
 * with names attached.
 */
export function Streamers() {
  const items: GalleryItem[] = useMemo(
    () =>
      OPENING_NIGHT.map((p) => ({
        image: p.src,
        text: "",
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-10 w-full max-w-7xl px-5 md:mb-14 md:px-8">
        <SectionHeader
          eyebrow="Moments"
          title="Our Favorite"
          highlight="Moments"
          description="Snapshots from inside the room — the crowd, the stage, the streaming rig. Opening night, top to bottom."
        />
      </div>

      {/*
       * The gallery needs a fixed-height container. Height is tuned so the curved
       * arc is visible without pushing the next section off screen on short viewports.
       */}
      <div className="relative h-[520px] w-full md:h-[600px]">
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
          autoScrollSpeed={0.018}
          className="font-[family-name:var(--font-display)] text-[24px] font-medium text-fg md:text-[28px]"
          aria-label="Photographs from Bacara Club opening night"
        />
      </div>

      <div className="mt-12 text-center md:mt-16">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
        >
          See the full gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
