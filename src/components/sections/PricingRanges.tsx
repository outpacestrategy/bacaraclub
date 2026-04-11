import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/**
 * PricingRanges — the "Table pricing guidance" block for /wednesdays and
 * /saturdays.
 *
 * Implements docs/implementation-plan.md §1.4. Every winning Miami nightclub
 * publishes pricing ranges (not fixed prices) so budget qualifies upfront and
 * the door team doesn't waste time on mismatched asks. Mona Club and LIV both
 * follow this pattern. Research confirmed it as P0.
 *
 * CRITICAL: every range shown here is a placeholder. CLAUDE.md has a hard
 * rule against fabricated numbers, so each card is tagged
 * `data-placeholder="true"` and the block renders a visible warning banner
 * reminding the pre-launch QA team that Clavicular needs to confirm the real
 * floors before launch. The range *shape* matches what competitor research
 * found typical for boutique Miami Beach venues, but the exact numbers are
 * intentionally generic ("from $X,XXX") until Drew comes back.
 *
 * Open Question #6 in CLAUDE.md: "Dress code, age policy, table pricing
 * floor — need real data to populate the FAQ and /reserve quiz."
 *
 * The block is parameterized by `night` so the Wednesday and Saturday landers
 * can share the component but each one deep-links the CTA to the correct
 * pre-selected night on the reserve quiz.
 */
export function PricingRanges({
  night,
}: {
  night: "wednesday" | "saturday";
}) {
  const tiers: ReadonlyArray<{
    label: string;
    range: string;
    description: string;
  }> = [
    {
      label: "Main Floor table",
      range: "From $X,XXX",
      description: "Center of the room, closest to the action.",
    },
    {
      label: "VIP Booth",
      range: "From $X,XXX",
      description: "Elevated, private, near the DJ booth.",
    },
    {
      label: "Streamer Table",
      range: "From $X,XXX",
      description:
        "With broadcast rig, creator lighting, and fast wifi for live streams.",
    },
    {
      label: "Private Area",
      range: "Contact for quote",
      description: "Full private rooms and buyouts for larger parties.",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl">
        Table pricing guidance
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
        Bacara prices tables dynamically by night, party size, and section.
        The ranges below are directional — the door team comes back with
        current pricing for your exact table when you submit a request.
      </p>

      {/* Pre-launch QA banner — must be removed or replaced with a real
          "confirmed with Bacara team" banner before the site goes live. */}
      <div
        data-placeholder="true"
        className="mt-6 flex items-start gap-3 rounded-xl border border-live/30 bg-live/5 p-4 text-sm text-live"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>
          <strong>Placeholder ranges.</strong> Pricing confirmed with the
          Bacara team — update before launch.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {tiers.map((tier) => (
          <li
            key={tier.label}
            data-placeholder="true"
            className="rounded-2xl border border-border bg-bg-elevated/50 p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              {tier.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-accent md:text-3xl">
              {tier.range}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {tier.description}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href={`/reserve?night=${night}`}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
      >
        Reserve a {night === "wednesday" ? "Wednesday" : "Saturday"} table
      </Link>
    </section>
  );
}
