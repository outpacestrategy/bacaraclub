import type { Metadata } from "next";

import { SITE } from "@/lib/constants";

/**
 * Metadata for /reserve lives in this route-level layout because
 * `src/app/reserve/page.tsx` is a client component (`"use client"`) and
 * Next.js disallows `export const metadata` from client components.
 *
 * The copy below is tuned for Meta Ads deep links — /reserve is a landing
 * page for "book a table" campaigns and needs a conversion-focused title and
 * description independent of the generic home-page metadata.
 */
export const metadata: Metadata = {
  title: "Reserve a Table — Bacara Miami Beach",
  description:
    "Reserve a table at Bacara Club in Miami Beach. Bottle service, creator-friendly sections, and live broadcasts every Wednesday and Saturday. Submit your night, party size, and budget — the door team responds with availability.",
  alternates: { canonical: `${SITE.url}/reserve` },
  openGraph: {
    title: "Reserve a Table — Bacara Miami Beach",
    description:
      "Bottle service, creator-friendly sections, and live broadcasts every Wednesday and Saturday at 235 23rd St, Miami Beach. Reserve your night.",
    url: `${SITE.url}/reserve`,
    images: ["/og-image.jpg"],
  },
};

export default function ReserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
