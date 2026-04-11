import { Mail, MessageSquare, ExternalLink } from "lucide-react";

import { RESERVATION_CHANNELS } from "@/lib/constants";

/**
 * ReservationChannels — the "Prefer another way to book?" block.
 *
 * Implements docs/implementation-plan.md §1.3 "Multi-channel reservation
 * paths." Rendered at the bottom of every reservation page (/reserve,
 * /wednesdays, /saturdays) so high-spend buyers who only email or only text
 * still find a path to the door team. The winning Miami clubs (LIV, E11EVEN)
 * all run parallel channels and the research showed non-trivial share of
 * high-ticket buyers never fill the on-site form.
 *
 * Channel states (per CLAUDE.md's no-fake-numbers hard rule):
 *   - Email — live alias `tables@bacaraclub.com` (forwards to admin@)
 *   - Text  — "coming soon" slot until phone number is provisioned (Open
 *             Question #4 in CLAUDE.md)
 *   - Tablelist — "coming soon" slot until the venue listing is created
 *                 (implementation-plan.md §1.6, P2)
 *
 * The component is a pure server component with no interactivity beyond the
 * native <a> links — keeps the parent tree static-renderable.
 */
export function ReservationChannels() {
  const { email, textNumberDisplay, textNumberTel, tablelistUrl } =
    RESERVATION_CHANNELS;

  return (
    <section
      aria-labelledby="reservation-channels-heading"
      className="mt-16 rounded-2xl border border-border bg-bg-elevated/30 p-8 md:p-10"
    >
      <h2
        id="reservation-channels-heading"
        className="font-[family-name:var(--font-display)] text-2xl text-fg md:text-3xl"
      >
        Prefer another way to book?
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
        The fastest route is the reservation form above. If you&apos;d rather
        reach the Bacara VIP host team directly, use one of the channels
        below — every channel connects to the same team.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Email — live */}
        <li>
          <a
            href={`mailto:${email}?subject=Reservation%20Request%20%E2%80%94%20Bacara%20Club`}
            className="group flex h-full flex-col justify-between rounded-xl border border-border bg-bg p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              <Mail className="h-3.5 w-3.5 text-accent" />
              Email
            </div>
            <p className="mt-4 text-base text-fg group-hover:text-accent">
              {email}
            </p>
            <p className="mt-1 text-xs text-fg-muted">
              For tables, groups, and private asks.
            </p>
          </a>
        </li>

        {/* Text — conditional, placeholder until phone is provisioned */}
        <li>
          {textNumberTel && textNumberDisplay ? (
            <a
              href={`sms:${textNumberTel}`}
              className="group flex h-full flex-col justify-between rounded-xl border border-border bg-bg p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                <MessageSquare className="h-3.5 w-3.5 text-accent" />
                Text
              </div>
              <p className="mt-4 text-base text-fg group-hover:text-accent">
                {textNumberDisplay}
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Fastest route for same-week bookings.
              </p>
            </a>
          ) : (
            <div
              data-placeholder="true"
              className="flex h-full flex-col justify-between rounded-xl border border-dashed border-border/70 bg-bg/60 p-5"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                <MessageSquare className="h-3.5 w-3.5 text-fg-muted" />
                Text
              </div>
              <p className="mt-4 text-base text-fg-muted">Coming soon</p>
              <p className="mt-1 text-xs text-fg-muted">
                SMS booking line launches with the VIP host team.
              </p>
            </div>
          )}
        </li>

        {/* Tablelist / aggregator — conditional, placeholder until listing is created */}
        <li>
          {tablelistUrl ? (
            <a
              href={tablelistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between rounded-xl border border-border bg-bg p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                <ExternalLink className="h-3.5 w-3.5 text-accent" />
                Tablelist
              </div>
              <p className="mt-4 text-base text-fg group-hover:text-accent">
                Book on Tablelist
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Prefer a third-party aggregator? Use the official Bacara listing.
              </p>
            </a>
          ) : (
            <div
              data-placeholder="true"
              className="flex h-full flex-col justify-between rounded-xl border border-dashed border-border/70 bg-bg/60 p-5"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                <ExternalLink className="h-3.5 w-3.5 text-fg-muted" />
                Tablelist
              </div>
              <p className="mt-4 text-base text-fg-muted">Coming soon</p>
              <p className="mt-1 text-xs text-fg-muted">
                Aggregator listing under setup.
              </p>
            </div>
          )}
        </li>
      </ul>
    </section>
  );
}
