"use client";

import { useMemo } from "react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/ui/circular-gallery";
import { PLACEHOLDER_EXPERIENCE } from "@/lib/placeholder-data";

/**
 * The Bacara Experience — pure CSS 3D circular ring gallery.
 *
 * Replaces the earlier cover-flow (absolute-positioned stack with per-card rotateY offsets)
 * with a full 360° ring where every slide sits at `translateZ(radius)` from the center and
 * the parent slowly rotates on its Y axis. Cards in front are fully opaque; cards on the
 * back of the ring fade to ~30% opacity so the arrangement reads as depth, not clutter.
 *
 * Behavior:
 *  - Auto-rotates continuously at a slow drift (matches the Meet the Creators vibe).
 *  - No scroll hijacking — `scrollLinked` is off. The rotation is purely self-contained,
 *    so the gallery won't fight the page scroll or jump between sections.
 *  - Not interactive by mouse/touch — the ring is a visual showcase, not a picker.
 *    If we want click-to-stop or drag-to-spin later, we can wire those into the component.
 *
 * Image assets are the picsum grayscale+blur placeholders from PLACEHOLDER_EXPERIENCE.
 * Replace with real Bacara photography once it's delivered.
 */
export function Experience3DCarousel() {
  const items: GalleryItem[] = useMemo(
    () =>
      PLACEHOLDER_EXPERIENCE.map((slide) => ({
        label: slide.label,
        caption: slide.caption,
        image: {
          url: slide.imageUrl,
          alt: `${slide.label}: ${slide.caption}`,
          position: slide.imagePosition,
        },
      })),
    [],
  );

  return (
    <section className="relative py-24 md:py-32" data-placeholder="true">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Experience"
          title="Dive into"
          highlight="Bacara"
          description="A broadcast deck and a nightclub in the same room. Every table has a view, every view is a story."
        />

        {/*
         * Stage height gives the rotating ring room to breathe. The cards are 300×400
         * and the ring radius is 500px, so the visible front-facing slide reads at full
         * size while side slides recede into depth. On mobile we shrink the stage a bit
         * and tell the gallery to use smaller cards + a tighter radius (passed below).
         */}
        <div className="relative mt-12 h-[560px] md:h-[640px]">
          {/* Edge masks so the far side of the ring dissolves into the page background
              instead of clipping hard against the section bounds. */}
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
            radius={480}
            autoRotateSpeed={0.04}
            cardWidth={280}
            cardHeight={380}
            aria-label="The Bacara Experience"
          />
        </div>
      </div>
    </section>
  );
}
