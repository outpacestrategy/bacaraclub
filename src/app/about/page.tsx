import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Bacara Club — Miami Beach's Streaming Nightclub",
  description:
    "Bacara is a boutique nightclub in Miami Beach, relaunched by Clavicular in 2026 as the city's first purpose-built streaming venue. Wednesdays and Saturdays, always on air.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built for"
      highlight="Broadcast"
      description="Bacara is a boutique nightclub at 235 23rd Street in Miami Beach. We were relaunched in 2026 by Clavicular as the first venue in the city built from the ground up for livestreaming — permanent camera rigs, creator lighting, no filming rules, and dedicated streamer tables every Wednesday and Saturday."
    >
      <div className="space-y-8 text-base leading-relaxed text-fg-muted md:text-lg">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg">
            The idea
          </h2>
          <p className="mt-4">
            Miami Beach has always been a nightlife capital, but the clubs were built
            for a pre-broadcast world. Phones out was a problem, not an opportunity.
            Bacara was relaunched to invert that: the room is the stage, every table
            is a camera angle, and the creators who show up get a rig, lighting, and
            the best seat in the house.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg">
            The nights
          </h2>
          <p className="mt-4">
            Bacara runs two nights a week: Wednesday and Saturday. Both are flagship
            broadcast nights with resident DJs, the full broadcast setup, and tables
            that book out the Monday before each show. The room is dark the rest of
            the week so every open night is the main event.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg">
            The owner
          </h2>
          <p className="mt-4">
            Bacara is owned and operated by Clavicular, a hospitality group that
            acquired the venue in 2026 and repositioned it around the streaming-first
            thesis. The creator program, the broadcast infrastructure, and the Wed/Sat
            programming all launched under Clavicular&apos;s direction.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
