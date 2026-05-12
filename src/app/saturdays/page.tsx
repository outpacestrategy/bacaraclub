import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { PricingRanges } from "@/components/sections/PricingRanges";
import { ReservationChannels } from "@/components/sections/ReservationChannels";
import { EventSchema } from "@/components/seo/EventSchema";
import { SITE, VENUE } from "@/lib/constants";
import { getUpcomingEventsByNight } from "@/lib/events";
import { LANDER_HERO } from "@/lib/media";

export const metadata: Metadata = {
  title: "Saturday Nights at Bacara — Miami Beach",
  description:
    "Bacara Club is Miami Beach's flagship Saturday night at 235 23rd Street. Headlining DJ, bottle service, full broadcast infrastructure. Book a table for this Saturday.",
  alternates: { canonical: `${SITE.url}/saturdays` },
  openGraph: {
    title: "Saturday Nights at Bacara — Miami Beach",
    description:
      "Miami Beach's flagship Saturday night at Bacara Club. Headlining DJs, always on air.",
    url: `${SITE.url}/saturdays`,
    images: ["/og-image.jpg"],
  },
};

/**
 * /saturdays — evergreen landing page, twin of /wednesdays.
 *
 * Per docs/site-plan.md: these landers are the SEO and ads workhorses and
 * must exist year-round. Per docs/implementation-plan.md §1.3 + §1.4 + §3.1
 * this page gets the same P0 additions as /wednesdays:
 *   - Table pricing guidance (placeholder ranges with a visible pre-launch
 *     warning)
 *   - Multi-channel reservation block (email / text / Tablelist)
 *   - Event JSON-LD for every upcoming Saturday surfaced on this page
 *
 * CLAUDE.md hard rule: "A Saturday ad goes to /saturdays, not /." Every
 * Meta Ads Saturday creative lands here. Every section reinforces the
 * Saturday positioning and funnels to /reserve.
 */
export default function SaturdaysPage() {
  const saturdayEvents = getUpcomingEventsByNight("saturday");

  return (
    <PageShell
      eyebrow="Saturdays"
      title="Saturday nights at"
      highlight="Bacara Miami Beach"
      description="Saturday is the biggest night of the week at Bacara. Headlining DJ, bottle service at every section, and the same always-on broadcast setup that makes Bacara Miami Beach's first streaming nightclub."
    >
      {/* Event JSON-LD — one per upcoming Saturday surfaced below */}
      {saturdayEvents.map((event) => (
        <EventSchema key={event.slug} event={event} />
      ))}

      <div className="relative mb-14 overflow-hidden rounded-3xl border border-border bg-bg-elevated">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={LANDER_HERO.saturdays.src}
            alt={LANDER_HERO.saturdays.alt}
            fill
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent"
          />
        </div>
      </div>

      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
          The night
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted md:text-lg">
          <p>
            Saturday is Bacara&apos;s headline night. The room opens at 10 PM, a
            rotating headlining DJ takes the booth, and the crowd runs the full range —
            regulars, out-of-towners, and the creator community that books the floor
            weeks in advance.
          </p>
          <p>
            The broadcast setup is identical to Wednesday: permanent camera rigs at the
            booth, creator lighting on the streamer tables, and a live feed going out
            from multiple angles all night. If you&apos;re a creator, Saturday books out
            first — apply to the streamer program well ahead of your target date.
          </p>
          <p>Doors 10 PM. Last call 4:30 AM. Close 5 AM.</p>
        </div>
      </section>

      {/* Upcoming Saturdays — the "this week's lineup" block from site-plan.md */}
      {saturdayEvents.length > 0 && (
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
            Upcoming Saturdays
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {saturdayEvents.map((event) => (
              <li
                key={event.slug}
                data-placeholder="true"
                className="rounded-2xl border border-border bg-bg-elevated/50 p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                  {event.dateLine}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-fg md:text-2xl">
                  {event.title}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{event.host}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/reserve?event=${event.slug}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-accent/60 px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-bg"
                  >
                    Reserve
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PricingRanges night="saturday" />

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
          Find us
        </h2>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">
          Bacara Club is at <span className="text-fg">{VENUE.street}</span>,{" "}
          {VENUE.city}, {VENUE.region} {VENUE.postalCode} — one block off Collins
          Avenue. See the full address and hours on the{" "}
          <Link href="/contact" className="text-accent hover:text-accent-hover">
            contact page
          </Link>
          .
        </p>
      </section>

      <ReservationChannels />
    </PageShell>
  );
}
