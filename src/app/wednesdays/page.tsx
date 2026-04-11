import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { SITE, VENUE } from "@/lib/constants";

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
 * Per docs/site-plan.md: "These are the SEO and ads workhorses. They exist year-round,
 * even if the specific night's lineup changes weekly. The URL, headings, and schema
 * target high-intent queries like 'Wednesday night Miami club'."
 *
 * Per CLAUDE.md hard rule: "Always deep-link ads to intent-matching pages. A Wednesday
 * ad goes to /wednesdays, not /. A creator ad goes to /streamers. Never break this rule."
 *
 * This page is the destination for Meta Ads targeting Wednesday-night Miami Beach
 * queries. Every section reinforces the Wednesday positioning and funnels to /reserve.
 */
export default function WednesdaysPage() {
  return (
    <PageShell
      eyebrow="Wednesdays"
      title="Wednesday nights at"
      highlight="Bacara Miami Beach"
      description="Every Wednesday at Bacara is a live broadcast. A resident DJ, a packed room, and the best creator tables in Miami Beach. 10 PM to 5 AM, always on air."
    >
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
          <p>
            Doors 10 PM. Last call 4:30 AM. Close 5 AM.
          </p>
        </div>
      </section>

      <section className="mb-16 rounded-2xl border border-border bg-bg-elevated/50 p-8 md:p-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
          Tables &amp; pricing
        </h2>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">
          Wednesday tables start at bottle-service minimums that vary by section,
          party size, and proximity to the DJ booth. Submit a reservation request
          with your night, party size, and section preference and the door team
          responds with current pricing for your exact table.
        </p>
        <Link
          href="/reserve?night=wednesday"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
        >
          Reserve a Wednesday table
        </Link>
      </section>

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
    </PageShell>
  );
}
