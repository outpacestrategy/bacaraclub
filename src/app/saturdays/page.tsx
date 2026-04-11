import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { SITE, VENUE } from "@/lib/constants";

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
 * /saturdays — evergreen landing page, twin of /wednesdays. Same structural role: the
 * destination for Saturday-night Meta Ads and the SEO workhorse for "Saturday night
 * Miami Beach club" queries. See docs/site-plan.md and CLAUDE.md for the positioning
 * and the no-deep-link-to-home hard rule.
 */
export default function SaturdaysPage() {
  return (
    <PageShell
      eyebrow="Saturdays"
      title="Saturday nights at"
      highlight="Bacara Miami Beach"
      description="Saturday is the biggest night of the week at Bacara. Headlining DJ, bottle service at every section, and the same always-on broadcast setup that makes Bacara Miami Beach's first streaming nightclub."
    >
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
          Saturday is Bacara&apos;s busiest night, so tables book fastest and minimums
          run higher than Wednesday. Pricing varies by section, party size, and
          proximity to the DJ booth. Submit a request and the door team comes back
          with current pricing for your preferred Saturday.
        </p>
        <Link
          href="/reserve?night=saturday"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
        >
          Reserve a Saturday table
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
