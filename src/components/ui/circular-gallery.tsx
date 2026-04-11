"use client";

/**
 * CircularGallery — pure CSS 3D ring gallery.
 *
 * Sourced from 21st.dev. Adapted for the Bacara Club codebase with the following changes:
 *
 *  1. **Section-local scroll linking.** The original component computed rotation from
 *     `window.scrollY / document.scrollHeight`, which only made sense when the component
 *     was the ENTIRE page (like its 500vh sticky demo). On a multi-section home page this
 *     would cause the gallery to already be 78% rotated before the user ever sees it, then
 *     snap around as they scroll through unrelated sections. We now compute rotation from
 *     the component's own `getBoundingClientRect().top` relative to the viewport, so the
 *     effect is bounded to the section the gallery lives in.
 *  2. **Scroll-linking is opt-in.** `scrollLinked` defaults to `false` so the default
 *     behavior is simple slow auto-rotation. Pass `scrollLinked={true}` to enable the
 *     demo-style "spin as you scroll" behavior on a page where the gallery occupies its
 *     own scroll height (pair with a sticky container).
 *  3. **Semantic field names.** The original used animal taxonomy (`common` / `binomial`
 *     / `photo.by`) because the demo was an animal gallery. For our use case those names
 *     are wrong. Renamed to `label` / `caption` / `image.{url, alt, position, credit}`.
 *  4. **TypeScript strict-mode compatible.** No `any`, proper ref types, no setState-in-
 *     effect lint trips.
 *  5. **Sibling component naming.** This file is `circular-gallery.tsx`. The WebGL curved
 *     scroller used by the Streamers section lives in `circular-gallery-2.tsx` — they are
 *     visually different (CSS 3D ring vs bent WebGL track) and serve different sections.
 */

import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface GalleryItem {
  label: string;
  caption: string;
  image: {
    url: string;
    alt: string;
    /** CSS `object-position` value (e.g. "50% 30%"). Defaults to center. */
    position?: string;
    /** Optional photo credit shown under the caption. */
    credit?: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Translation on Z per card in px. Larger = wider ring. Default 500. */
  radius?: number;
  /** Continuous drift speed in degrees per frame. 0 disables. Default 0.02. */
  autoRotateSpeed?: number;
  /**
   * When true, rotation is linked to the user's scroll progress through this section
   * (section-local, not document-global). Defaults to false. Use true when the gallery
   * lives inside a tall sticky-scroll container where scrolling should spin it.
   */
  scrollLinked?: boolean;
  /** Card width in px. Default 300. */
  cardWidth?: number;
  /** Card height in px. Default 400. */
  cardHeight?: number;
}

const CircularGallery = forwardRef<HTMLDivElement, CircularGalleryProps>(
  function CircularGallery(
    {
      items,
      className,
      radius = 500,
      autoRotateSpeed = 0.02,
      scrollLinked = false,
      cardWidth = 300,
      cardHeight = 400,
      ...props
    },
    ref,
  ) {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    // Latest rotation as a ref so the RAF loop doesn't need `rotation` in its deps
    // (which would restart the loop on every frame and never fire).
    const rotationRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Merge the forwarded ref with our local ref.
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Scroll-linked rotation — section-local.
    useEffect(() => {
      if (!scrollLinked) return;

      const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress maps to [0, 1] across the full travel the section makes through the
        // viewport: from the moment its top edge enters from below to the moment its
        // bottom edge leaves from above. Clamp defensively.
        const travel = vh + rect.height;
        const entered = vh - rect.top;
        const progress = Math.max(0, Math.min(1, entered / travel));
        const target = progress * 360;
        rotationRef.current = target;
        setRotation(target);

        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };

      // Initial position
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, [scrollLinked]);

    // Auto-rotate loop — runs whenever the user isn't actively driving rotation via scroll.
    useEffect(() => {
      if (autoRotateSpeed === 0) return;

      const tick = () => {
        if (!isScrolling) {
          rotationRef.current += autoRotateSpeed;
          setRotation(rotationRef.current);
        }
        rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);

      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;

    return (
      <div
        ref={setRefs}
        role="region"
        aria-label="Circular gallery"
        className={cn(
          "relative flex h-full w-full items-center justify-center",
          className,
        )}
        style={{ perspective: "2000px" }}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            // Each card's angle relative to the camera after the parent rotation.
            const relativeAngle =
              ((itemAngle + (rotation % 360) + 360) % 360);
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
            );
            // Front-facing card (angle 0) = opacity 1. Back card (angle 180) = opacity 0.3.
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

            return (
              <div
                key={`${item.image.url}-${i}`}
                role="group"
                aria-label={item.label}
                className="absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-2xl">
                  {/* Using raw <img> (not next/image) because the transform-heavy parent
                      prevents the server-rendered layout next/image expects. The rotating
                      ring is purely client-side. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.url}
                    alt={item.image.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.image.position ?? "center" }}
                    draggable={false}
                  />
                  {/* Bottom scrim + label */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 text-fg">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
                      {item.label}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight text-fg md:text-2xl">
                      {item.caption}
                    </p>
                    {item.image.credit ? (
                      <p className="mt-1 text-[10px] text-fg-subtle">
                        Photo · {item.image.credit}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export { CircularGallery };
