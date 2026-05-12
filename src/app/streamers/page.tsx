import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Wifi, Radio, Users } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { SITE, VENUE } from "@/lib/constants";
import { LANDER_HERO } from "@/lib/media";

export const metadata: Metadata = {
  title: "Streamer Program — Bacara Club Miami Beach",
  description:
    "Apply to stream from Miami Beach's first broadcasting nightclub. Bacara provides dedicated creator tables, permanent camera rigs, creator lighting, fast wifi, and no filming restrictions. Twitch, Kick, TikTok, YouTube, and IG Live all welcome.",
  alternates: { canonical: `${SITE.url}/streamers` },
};

export default function StreamersPage() {
  const mailtoSubject = encodeURIComponent("Streamer Program Application — Bacara Club");
  const mailtoBody = encodeURIComponent(
    `Hi Bacara team,\n\nI'd like to apply to the streamer program.\n\nName: \nPlatform (Twitch / Kick / TikTok / YouTube / IG Live): \nHandle: \nFollower count: \nWhich night you'd like (Wed / Sat): \nWhat you want to broadcast: \n\nThanks.`,
  );
  const mailto = `mailto:${VENUE.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <PageShell
      eyebrow="Streamers"
      title="Stream from the best seat in"
      highlight="Miami"
      description="Bacara Club is the only Miami Beach nightclub built for creator broadcasting. Permanent rigs, creator lighting, fast wifi, and no filming rules — every table is a camera angle, every night is a broadcast."
    >
      <div className="relative mb-14 overflow-hidden rounded-3xl border border-border bg-bg-elevated">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={LANDER_HERO.streamers.src}
            alt={LANDER_HERO.streamers.alt}
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
        <p className="absolute bottom-4 left-5 right-5 text-balance text-xs uppercase tracking-[0.18em] text-fg-muted md:bottom-6 md:left-8 md:text-[11px]">
          Live from the floor &middot; opening night
        </p>
      </div>

      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
          What we provide
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Feature
            icon={<Camera className="h-5 w-5" />}
            title="Permanent camera rigs"
            description="Dedicated broadcast camera positions at the DJ booth and on the floor, wired for direct stream capture."
          />
          <Feature
            icon={<Radio className="h-5 w-5" />}
            title="Creator lighting"
            description="Soft key lighting on every creator table so on-camera subjects read clearly against the dark room."
          />
          <Feature
            icon={<Wifi className="h-5 w-5" />}
            title="Fast wifi for uplink"
            description="Dedicated creator wifi with symmetric upload for Twitch, Kick, YouTube Live, IG Live, and TikTok Live. No 4G fallback needed."
          />
          <Feature
            icon={<Users className="h-5 w-5" />}
            title="No filming restrictions"
            description="Film anywhere, including the DJ booth and VIP sections. Bacara is built around broadcast — we don't have a phones-down policy."
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
          Who it&apos;s for
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted md:text-lg">
          The Bacara streamer program is open to creators on Twitch, Kick, YouTube
          Live, IG Live, and TikTok Live who want to broadcast from a real nightlife
          venue. We host new creators every week — apply with your handle and
          audience size and the team will come back within one business day.
        </p>
      </section>

      <div
        data-placeholder="true"
        className="rounded-3xl border border-accent/40 bg-bg-elevated/50 p-8 text-center md:p-12"
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
          Apply
        </p>
        <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-tight text-fg md:text-3xl">
          Broadcast your next night from Bacara.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
          Send your handle, platform, and follower count — the team responds within
          one business day.
        </p>
        <Link
          href={mailto}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
        >
          Apply to the program
        </Link>
      </div>
    </PageShell>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-bg-elevated/50 p-6 md:p-8">
      <div className="flex items-center gap-3 text-accent">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.16em]">{title}</span>
      </div>
      <p className="mt-4 text-base leading-relaxed text-fg-muted">{description}</p>
    </article>
  );
}
