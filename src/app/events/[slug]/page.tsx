import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { EventSchema } from "@/components/seo/EventSchema";
import { SITE, VENUE } from "@/lib/constants";
import {
  UPCOMING_EVENTS,
  getEventBySlug,
  getEventUrl,
} from "@/lib/events";

/**
 * /events/[slug] — individual event landing page.
 *
 * Per docs/site-plan.md sitemap: "Individual event landing page (dynamic, built
 * from CMS or constants)". For Milestone 1 the data comes from the static
 * `UPCOMING_EVENTS` module — swap to Supabase when events move to a live data
 * source. The page structure stays the same.
 *
 * This route is the primary surface for the Event JSON-LD rendered by
 * `<EventSchema/>` (implementation-plan.md §3.1). Every slug page is a rich-
 * result candidate so Google can surface the specific Wednesday or Saturday
 * on the Events knowledge panel and on AI search answers.
 */

export function generateStaticParams() {
  return UPCOMING_EVENTS.map((event) => ({ slug: event.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    return { title: "Event not found" };
  }
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: getEventUrl(event.slug) },
    openGraph: {
      title: event.title,
      description: event.description,
      url: getEventUrl(event.slug),
      type: "article",
      images: [event.heroImage],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [event.heroImage],
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  // Human-friendly date/time strings formatted in the venue's local timezone.
  const start = new Date(event.startDate);
  const dateDisplay = start.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeDisplay = "10:00 PM – 5:00 AM";

  return (
    <>
      {/* Event JSON-LD — the single biggest SEO lever for this page */}
      <EventSchema event={event} />

      <PageShell
        eyebrow={event.night === "wednesday" ? "Wednesday" : event.night === "saturday" ? "Saturday" : "Special"}
        title={event.title}
        description={event.description}
      >
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-border bg-bg-elevated">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={event.heroImage}
              alt={event.heroAlt}
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

        <section className="mb-14 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<CalendarDays className="h-4 w-4 text-accent" />}
            label="Date"
            value={dateDisplay}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4 text-accent" />}
            label="Time"
            value={timeDisplay}
          />
          <InfoCard
            icon={<MapPin className="h-4 w-4 text-accent" />}
            label="Location"
            value={`${VENUE.street}, ${VENUE.city}`}
          />
        </section>

        <section className="mb-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
            About this night
          </h2>
          <div className="mt-5 space-y-5 text-base leading-relaxed text-fg-muted md:text-lg">
            <p>{event.description}</p>
            <p>
              Presented by {event.host}. Doors 10 PM. Last call 4:30 AM. Close 5
              AM. Bacara operates Wednesday and Saturday only — every broadcast
              is a live, on-air night.
            </p>
          </div>
        </section>

        <section className="mb-4 rounded-2xl border border-border bg-bg-elevated/50 p-8 md:p-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
            Reserve this night
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">
            Tables book fastest for headline nights. Submit a reservation
            request and the Bacara VIP host team will come back within 30
            minutes with availability and pricing for your exact table.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/reserve?event=${event.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
            >
              Reserve this {event.night === "wednesday" ? "Wednesday" : "Saturday"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guestlist"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Guest list
            </Link>
          </div>
        </section>
      </PageShell>

      {/* Bottom breadcrumb-ish back link (canonical URL reinforcement) */}
      <div className="mx-auto mb-16 max-w-5xl px-5 md:px-8">
        <Link
          href="/events"
          className="text-xs uppercase tracking-[0.18em] text-fg-muted transition-colors hover:text-accent"
        >
          ← All upcoming events at {SITE.name}
        </Link>
      </div>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated/50 p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-base text-fg">{value}</p>
    </div>
  );
}
