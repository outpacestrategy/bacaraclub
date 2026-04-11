import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery — Bacara Club Miami Beach",
  description:
    "Photos and stream stills from inside Bacara Club. Live broadcasts, bottle service, creator takeovers, and the room in motion every Wednesday and Saturday.",
  alternates: { canonical: `${SITE.url}/gallery` },
};

export default function GalleryPage() {
  return (
    <PageShell
      eyebrow="Gallery"
      title="Inside"
      highlight="The Room"
      description="Every night at Bacara is broadcast live. The best stills come straight off the stream — real crowds, real nights, real moments. Follow @bacaraclub on Instagram for the daily feed."
    >
      {/* Deliberate placeholder while client-supplied photography is being collected.
          Open Question #3 in CLAUDE.md tracks the photography source. */}
      <div
        data-placeholder="true"
        className="rounded-3xl border border-border bg-bg-elevated/50 p-10 text-center md:p-16"
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
          Coming soon
        </p>
        <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-tight text-fg md:text-3xl">
          The photo wall is being built from our opening weeks.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
          Until then, the fastest way to see what Wednesday and Saturday look like at
          Bacara is on Instagram.
        </p>
        <Link
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-accent bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
        >
          Follow {SITE.instagramHandle}
        </Link>
      </div>
    </PageShell>
  );
}
