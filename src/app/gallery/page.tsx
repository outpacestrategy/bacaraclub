import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { SITE } from "@/lib/constants";
import { GALLERY_PICKS, photo } from "@/lib/media";

export const metadata: Metadata = {
  title: "Gallery — Bacara Club Miami Beach",
  description:
    "Photos from inside Bacara Club: opening night, live broadcasts, bottle service, creator takeovers, and the room in motion every Wednesday and Saturday.",
  alternates: { canonical: `${SITE.url}/gallery` },
};

export default function GalleryPage() {
  const items = GALLERY_PICKS.map((n) => photo(n));

  return (
    <PageShell
      eyebrow="Gallery"
      title="Inside"
      highlight="The Room"
      description="Every night at Bacara is broadcast live. The shots below are from opening night — real crowds, real moments. Follow @bacaraclub on Instagram for the daily feed."
    >
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <figure
            key={item.src}
            className="relative overflow-hidden rounded-2xl border border-border bg-bg-elevated break-inside-avoid"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={1600}
              height={2400}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full object-cover"
              priority={i < 3}
            />
          </figure>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-fg-muted">
        Want the full feed?{" "}
        <Link
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent hover:text-accent-hover"
        >
          {SITE.instagramHandle}
        </Link>
      </p>
    </PageShell>
  );
}
