"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Carousel } from "@ark-ui/react/carousel";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import { EventSchema } from "@/components/seo/EventSchema";
import { UPCOMING_EVENTS, type UpcomingEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * Upcoming Events — Ark UI headless carousel.
 *
 * Structural reference: monaclub.miami "Upcoming Events" strip. We keep the
 * same multi-card-per-page behavior (1 on phones, 2 on tablets, 3 on desktop)
 * with chevron prev/next + click-and-drag, but the underlying mechanics are
 * now Ark UI's `Carousel.Root` instead of a hand-rolled scroll-snap container.
 *
 * Why Ark UI here:
 *  - Built-in keyboard navigation (←/→), focus management, ARIA roles
 *  - Built-in prev/next disabled state at page boundaries (no manual scroll
 *    edge-detection like the old version had)
 *  - Page-based navigation (jumps a full row of cards per click) instead of
 *    pixel-based scrollBy() math, which means the carousel always lands on a
 *    snapped column regardless of card width
 *  - Drag support out of the box (`allowMouseDrag`)
 *
 * Visual contract preserved 1:1 from the previous version:
 *  - Champagne-gold "Reserve" buttons (NOT red) per the brand rule that red is
 *    reserved for live indicators only
 *  - Gradient placeholder covers, Wed/Sat day pill (Wed pulses red, Sat is
 *    gold), Bodoni Moda title, dateLine + host metadata
 *  - Framer entry animations on each card (whileInView with stagger)
 *  - Edge fades on the left/right of the carousel viewport (desktop only)
 *  - Champagne-gold pill indicator dots below the carousel
 *
 * The brand rule check: a hard rule in CLAUDE.md says "Never ship a fake
 * number". Every card here is marked `data-placeholder="true"` so a pre-launch
 * QA pass can grep the built HTML and verify nothing made it to production.
 */
export function UpcomingEvents() {
  const slidesPerPage = useSlidesPerPage();
  const pageCount = Math.ceil(UPCOMING_EVENTS.length / slidesPerPage);

  return (
    <section id="events" className="relative py-24 md:py-32">
      {/*
       * Event JSON-LD — one per upcoming event surfaced on the home carousel.
       * Per docs/implementation-plan.md §3.1, every upcoming-event card
       * rendered on /, /wednesdays, /saturdays is a rich-result candidate so
       * Google and AI search can index the specific Wed/Sat dates directly.
       */}
      {UPCOMING_EVENTS.map((event) => (
        <EventSchema key={event.slug} event={event} />
      ))}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Events"
          title="Upcoming"
          highlight="Broadcasts"
          description="Every Wednesday and Saturday, on air and in the room. Book your table before the stream goes live."
        />

        <Carousel.Root
          defaultPage={0}
          slideCount={UPCOMING_EVENTS.length}
          slidesPerPage={slidesPerPage}
          slidesPerMove="auto"
          spacing="1.5rem"
          allowMouseDrag
          className="mt-14"
          aria-label="Upcoming events"
        >
          <div className="relative">
            {/* Edge fades on desktop only — keeps the carousel visually
                continuous with the dark page background. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-bg to-transparent md:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-bg to-transparent md:block"
            />

            {/* Chevron buttons. Ark UI sets the HTML `disabled` attribute on
                the trigger when the carousel is at the first/last page, so
                Tailwind's `disabled:` variants drive the dimmed state. */}
            <Carousel.Control className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between md:flex">
              <Carousel.PrevTrigger
                aria-label="Previous events"
                className="pointer-events-auto -ml-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-border disabled:hover:text-fg"
              >
                <ChevronLeft className="h-5 w-5" />
              </Carousel.PrevTrigger>
              <Carousel.NextTrigger
                aria-label="Next events"
                className="pointer-events-auto -mr-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-border disabled:hover:text-fg"
              >
                <ChevronRight className="h-5 w-5" />
              </Carousel.NextTrigger>
            </Carousel.Control>

            <Carousel.ItemGroup className="overflow-hidden">
              {UPCOMING_EVENTS.map((event, i) => (
                <Carousel.Item key={event.slug} index={i} className="h-auto">
                  <EventCard event={event} index={i} />
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>
          </div>

          {/* Indicator dots — one per PAGE, not per slide. Math.ceil so a
              non-divisible number of slides still gets a final partial page.
              Each indicator wraps an invisible 44px tap target around the
              1px visual bar via `py-5 -my-3.5` so thumbs can actually hit
              them on mobile without changing the 8px gap between visible
              dots. The IndicatorGroup compensates with `-mt-3.5` so the
              section spacing stays 32px. */}
          <Carousel.IndicatorGroup className="mt-4 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <Carousel.Indicator
                key={i}
                index={i}
                aria-label={`Go to page ${i + 1}`}
                className="group relative flex min-h-11 w-11 cursor-pointer items-center justify-center"
              >
                <span className="h-1 w-8 rounded-full bg-border transition-colors group-hover:bg-fg-muted group-data-[current]:bg-accent" />
              </Carousel.Indicator>
            ))}
          </Carousel.IndicatorGroup>
        </Carousel.Root>

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

/**
 * Returns the active `slidesPerPage` value driven by `matchMedia`. Mobile-first
 * default of 1 minimizes the worst-case hydration mismatch: a brief
 * "1 → 3 cards" flash on desktop is visually fine (just shows fewer-but-larger
 * cards before settling), whereas starting at 3 would give mobile users a
 * "3 squished cards → 1 card" flash that looks broken.
 */
function useSlidesPerPage(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const md = window.matchMedia("(min-width: 768px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    lg.addEventListener("change", update);
    md.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      md.removeEventListener("change", update);
    };
  }, []);

  return count;
}

function EventCard({
  event,
  index,
}: {
  event: UpcomingEvent;
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-colors hover:border-accent/40"
    >
      {/* Card cover — placeholder gradient until client supplies real imagery */}
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
          event.gradient,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_110%,rgba(0,0,0,0.8),transparent_70%)]" />
        <div className="absolute inset-x-6 top-6 flex items-start justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] backdrop-blur",
              event.night === "wednesday"
                ? "border-live/40 bg-live/10 text-live"
                : "border-accent/40 bg-accent/10 text-accent",
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
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            {event.dateLine}
          </p>
          <p className="mt-2 text-sm text-fg-muted">{event.host}</p>
        </div>

        <Link
          href={`/reserve?event=${event.slug}`}
          // min-h-11 enforces a 44px tap target even when the caller's
          // line-height + padding otherwise sum to 42px (previous value).
          className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-accent/60 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          Reserve
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
