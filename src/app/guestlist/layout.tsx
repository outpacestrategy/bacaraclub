import type { Metadata } from "next";

import { SITE } from "@/lib/constants";

/**
 * Metadata for /guestlist lives in this route-level layout because
 * `src/app/guestlist/page.tsx` is a client component and cannot export
 * `metadata` directly.
 */
export const metadata: Metadata = {
  title: "Guest List — Bacara Miami Beach",
  description:
    "Join the Bacara Club guest list for Wednesdays and Saturdays in Miami Beach. Low-barrier entry to the creator-friendly nightclub at 235 23rd St.",
  alternates: { canonical: `${SITE.url}/guestlist` },
  openGraph: {
    title: "Guest List — Bacara Miami Beach",
    description:
      "Get on the guest list for Wednesdays and Saturdays at Bacara Club — Miami Beach's first streaming nightclub.",
    url: `${SITE.url}/guestlist`,
    images: ["/og-image.jpg"],
  },
};

export default function GuestlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
