import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { SITE, VENUE } from "@/lib/constants";
import { LANDER_HERO } from "@/lib/media";

export const metadata: Metadata = {
  title: "Private Events & Buyouts — Bacara Club Miami Beach",
  description:
    "Host your private event, corporate buyout, album release, or artist afterparty at Bacara Club in Miami Beach. Full broadcast infrastructure included for streaming-friendly events.",
  alternates: { canonical: `${SITE.url}/private` },
};

export default function PrivatePage() {
  const mailtoSubject = encodeURIComponent("Private Event Enquiry — Bacara Club");
  const mailtoBody = encodeURIComponent(
    `Hi Bacara team,\n\nI'm enquiring about a private event.\n\nEvent type: \nPreferred date: \nParty size: \nFormat (buyout / section / afterparty): \nContact name: \nPhone: \n\nThanks.`,
  );
  const mailto = `mailto:${VENUE.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <PageShell
      eyebrow="Private"
      title="Buyouts, corporate, and"
      highlight="Afterparties"
      description="Bacara is available for private buyouts, corporate nights, album releases, artist afterparties, and creator takeovers. Full broadcast infrastructure included — film, stream, and host at the same time."
    >
      <div className="relative mb-14 overflow-hidden rounded-3xl border border-border bg-bg-elevated">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={LANDER_HERO.private.src}
            alt={LANDER_HERO.private.alt}
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

      <div className="grid gap-8 md:grid-cols-2">
        <FormatCard
          title="Full Buyout"
          description="Take over the entire venue for a private broadcast, release party, or brand activation. Full bar, broadcast rigs, and creator lighting included."
        />
        <FormatCard
          title="Section Reservation"
          description="Book the main room, the VIP booths, or the streamer tables for a private group while the club runs regular programming."
        />
        <FormatCard
          title="Artist Afterparty"
          description="Venue activation built around a performing artist. Direct creator access, broadcast coverage, and red-carpet staging."
        />
        <FormatCard
          title="Corporate & Brand"
          description="Product launches, sponsor activations, and creator marketing nights with full broadcast distribution to the creator's audiences."
        />
      </div>

      <div className="mt-14 rounded-3xl border border-accent/40 bg-bg-elevated/50 p-8 text-center md:p-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
          Enquire
        </p>
        <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-tight text-fg md:text-3xl">
          Tell us about your event.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
          Every private enquiry is handled directly by the Bacara team. Send us the
          date, party size, and format and we&apos;ll come back within one business day
          with availability and pricing.
        </p>
        <Link
          href={mailto}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
        >
          Send an enquiry
        </Link>
      </div>
    </PageShell>
  );
}

function FormatCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-bg-elevated/50 p-6 md:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-fg-muted">{description}</p>
    </article>
  );
}
