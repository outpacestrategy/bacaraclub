import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { SITE } from "@/lib/constants";
import { PLACEHOLDER_EVENTS } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Upcoming Events — Bacara Club Miami Beach",
  description:
    "All upcoming Wednesday and Saturday nights at Bacara Club. Reserve a table at Miami Beach's first streaming nightclub.",
  alternates: { canonical: `${SITE.url}/events` },
};

/**
 * /events — lists every scheduled night at Bacara.
 *
 * For launch 1 this page reads from `PLACEHOLDER_EVENTS`. When Milestone 5 wires in
 * Supabase (or any other data source), swap the import for a server-side query of
 * upcoming events. The page structure stays the same.
 *
 * Per CLAUDE.md "never ship fake numbers" rule, the event grid is marked with
 * `data-placeholder="true"` on each card so pre-launch review can find and replace
 * every entry before the site goes live.
 */
export default function EventsPage() {
  return (
    <PageShell
      eyebrow="Events"
      title="Upcoming"
      highlight="Broadcasts"
      description="Every Wednesday and Saturday at Bacara is a live broadcast. Here's what's on the calendar. Reserve your table before the stream goes live."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_EVENTS.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </PageShell>
  );
}

function EventCard({
  event,
}: {
  event: (typeof PLACEHOLDER_EVENTS)[number];
}) {
  return (
    <article
      data-placeholder="true"
      className="group relative overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-colors hover:border-accent/40"
    >
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
    </article>
  );
}
