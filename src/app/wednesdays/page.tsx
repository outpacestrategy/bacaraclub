import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { PricingRanges } from "@/components/sections/PricingRanges";
import { ReservationChannels } from "@/components/sections/ReservationChannels";
import { EventSchema } from "@/components/seo/EventSchema";
import { SITE, VENUE } from "@/lib/constants";
import { getUpcomingEventsByNight } from "@/lib/events";

export const metadata: Metadata = {
  title: "Wednesday Nights at Bacara — Miami Beach",
  description:
    "Bacara Club runs Miami Beach's flagship Wednesday night at 235 23rd Street. Resident DJ, bottle service, and a live broadcast from the room. Reserve a table for this Wednesday.",
  alternates: { canonical: `${SITE.url}/wednesdays` },
  openGraph: {
    title: "Wednesday Nights at Bacara — Miami Beach",
    description:
      "Miami Beach's flagship Wednesday night at Bacara Club. Resident DJ, bottle service, and a live broadcast every week.",
    url: `${SITE.url}/wednesdays`,
    images: ["/og-image.jpg"],
  },
};

/**
 * /wednesdays — evergreen landing page.
 *
 * Per docs/site-plan.md: "These are the SEO and ads workhorses. They exist
 * year-round, even if the specific night's lineup changes weekly."
 *
 * Per docs/implementation-plan.md §1.3 + §1.4 + §3.1 the P0 additions are:
 *   - Table pricing guidance (placeholder ranges with a visible pre-launch
 *     warning)
 *   - Multi-channel reservation block (email / text / Tablelist)
 *   - Event JSON-LD for every upcoming Wednesday surfaced on this page
 *
 * CLAUDE.md hard rule: "A Wednesday ad goes to /wednesdays, not /." This page
 * is the destination for every Meta Ads Wednesday creative. Every section
 * reinforces the Wednesday positioning and funnels to /reserve.
 */
export default function WednesdaysPage() {
  const wednesdayEvents = getUpcomingEventsByNight("wednesday");

  return (
    <PageShell
      eyebrow="Wednesdays"
      title="Wednesday nights at"
      highlight="Bacara Miami Beach"
      description="Every Wednesday at Bacara is a live broadcast. A resident DJ, a packed room, and the best creator tables in Miami Beach. 10 PM to 5 AM, always on air."
    >
      {/* Event JSON-LD — one per upcoming Wednesday surfaced below */}
      {wednesdayEvents.map((event) => (
        <EventSchema key={event.slug} event={event} />
      ))}

      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
          The night
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted md:text-lg">
          <p>
            Wednesday is Bacara&apos;s flagship broadcast night. The room opens at 10 PM,
            the resident DJ takes over from first drink onward, and the full creator
            infrastructure goes live — permanent camera rigs at the booth, creator
            lighting on every streamer table, and an always-on broadcast from the floor.
          </p>
          <p>
            Tables sit in three zones: main room, VIP booth, and creator tables. Bottle
            service is available at every section. The crowd is a mix of regular club
            guests, creators broadcasting their night, and the creator community showing
            up to support.
          </p>
          <p>Doors 10 PM. Last call 4:30 AM. Close 5 AM.</p>
        </div>
      </section>

      {/* Upcoming Wednesdays — the "this week's lineup" block from site-plan.md */}
      {wednesdayEvents.length > 0 && (
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
            Upcoming Wednesdays
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {wednesdayEvents.map((event) => (
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

      <PricingRanges night="wednesday" />

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
