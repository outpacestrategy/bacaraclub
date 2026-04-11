import type { Metadata } from "next";

import { FAQ } from "@/components/sections/FAQ";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ — Bacara Club Miami Beach",
  description:
    "Hours, reservations, dress code, age policy, and everything else you need to know about Bacara Club at 235 23rd Street, Miami Beach. Wednesdays and Saturdays, always on air.",
  alternates: { canonical: `${SITE.url}/faq` },
};

/**
 * Dedicated /faq page. Reuses the home-page `<FAQ />` component verbatim — same
 * accordion UI, same JSON-LD schema, same data source. When Milestone 6 builds
 * page-specific FAQ subsets for /wednesdays, /saturdays, and /streamers, this page
 * can switch to a larger "all FAQs" set via `FAQS` import.
 *
 * The page renders only the FAQ component (which has its own SectionHeader and
 * internal padding), plus a spacer block to clear the sticky header. We don't use
 * `PageShell` here because it would double-stack the title and eyebrow.
 */
export default function FAQPage() {
  return (
    <div className="pt-10 md:pt-16">
      <FAQ />
    </div>
  );
}
