"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import { PLACEHOLDER_EVENTS } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

/**
 * Upcoming Events — horizontal snap carousel.
 *
 * Structural reference: monaclub.miami "Upcoming Events" strip. We keep the scroll carousel
 * pattern because it's proven to convert (low friction, finger-swipe on mobile, arrow keys
 * and chevron buttons on desktop), but we swap the red "BOOK NOW" buttons for champagne-gold
 * "Reserve" buttons per brand rules (red is reserved for live indicators only).
 *
 * Navigation strategy:
 *  - Native overflow-x-auto with scroll-snap-x mandatory
 *  - Chevron buttons scroll by one card width
 *  - Buttons auto-hide when scrolled fully left/right (no useless arrows)
 *  - Keyboard: left/right arrows scroll when the carousel is focus-within
 */
export function UpcomingEvents() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("article");
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 /* gap */ : 320;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  return (
    <section id="events" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Events"
          title="Upcoming"
          highlight="Broadcasts"
          description="Every Wednesday and Saturday, on air and in the room. Book your table before the stream goes live."
        />

        <div
          className="relative mt-14"
          role="region"
          aria-roledescription="carousel"
          aria-label="Upcoming events"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {/* Chevron buttons (desktop). On mobile users swipe. */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                key="left"
                type="button"
                onClick={() => scrollByCard(-1)}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent md:inline-flex"
                aria-label="Previous events"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            )}
            {canScrollRight && (
              <motion.button
                key="right"
                type="button"
                onClick={() => scrollByCard(1)}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent md:inline-flex"
                aria-label="Next events"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Edge fades on desktop only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-bg to-transparent md:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-bg to-transparent md:block"
          />

          <div
            ref={scrollRef}
            className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {PLACEHOLDER_EVENTS.map((event, i) => (
              <EventCard key={event.slug} event={event} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
}: {
  event: (typeof PLACEHOLDER_EVENTS)[number];
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      data-placeholder="true"
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 24, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative flex min-w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-colors hover:border-accent/40 sm:min-w-[300px] md:min-w-[320px]"
    >
      {/* Card cover — placeholder gradient until client supplies real imagery */}
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
          event.gradient
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_110%,rgba(0,0,0,0.8),transparent_70%)]" />
        <div className="absolute inset-x-6 top-6 flex items-start justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] backdrop-blur",
              event.night === "wednesday"
                ? "border-live/40 bg-live/10 text-live"
                : "border-accent/40 bg-accent/10 text-accent"
            )}
          >
            {event.night === "wednesday" ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                Wed
              </>
            ) : (
              "Sat"
            )}
          </span>
        </div>
        <div className="absolute inset-x-6 bottom-5">
          <p className="font-[family-name:var(--font-display)] text-3xl text-fg/95 drop-shadow">
            {event.title}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            {event.dateLine}
          </p>
          <p className="mt-2 text-sm text-fg-muted">{event.host}</p>
        </div>

        <Link
          href={`/reserve?night=${event.night}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/60 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          Reserve
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
