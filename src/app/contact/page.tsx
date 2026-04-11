import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { NightClubSchema } from "@/components/seo/NightClubSchema";
import { SITE, VENUE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Bacara Club — Miami Beach",
  description: `Bacara Club is at ${VENUE.street}, ${VENUE.city}, ${VENUE.region} ${VENUE.postalCode}. Open Wednesday through Saturday, 10 PM to 5 AM. Email ${VENUE.email} for general inquiries.`,
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function ContactPage() {
  return (
    <>
      {/* NightClub schema repeats here per CLAUDE.md hard rule: "Always include NightClub
          schema on / and /contact. Google Local Pack depends on it." */}
      <NightClubSchema />

      <PageShell
        eyebrow="Contact"
        title="Find"
        highlight="Bacara"
        description="235 23rd Street, Miami Beach, Florida. One block off Collins Avenue. Wednesday through Saturday, 10 PM to 5 AM."
      >
        <div className="grid gap-10 md:grid-cols-2">
          <InfoBlock icon={<MapPin className="h-5 w-5" />} label="Address">
            <address className="not-italic leading-relaxed text-fg-muted">
              {VENUE.street}
              <br />
              {VENUE.city}, {VENUE.region} {VENUE.postalCode}
              <br />
              {VENUE.country === "US" ? "United States" : VENUE.country}
            </address>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.fullAddress)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Open in Google Maps →
            </Link>
          </InfoBlock>

          <InfoBlock icon={<Clock className="h-5 w-5" />} label="Hours">
            <ul className="space-y-1 text-fg-muted">
              <li>Monday — Closed</li>
              <li>Tuesday — Closed</li>
              <li>
                <span className="text-fg">Wednesday — 10 PM – 5 AM</span>
                <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-accent">
                  · On Air
                </span>
              </li>
              <li>Thursday — 10 PM – 5 AM</li>
              <li>Friday — 10 PM – 5 AM</li>
              <li>
                <span className="text-fg">Saturday — 10 PM – 5 AM</span>
                <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-accent">
                  · On Air
                </span>
              </li>
              <li>Sunday — Closed</li>
            </ul>
          </InfoBlock>

          <InfoBlock icon={<Mail className="h-5 w-5" />} label="Email">
            <p className="text-fg-muted">
              For general inquiries, press, and partnerships:
            </p>
            <Link
              href={`mailto:${VENUE.email}`}
              className="mt-2 inline-flex text-base text-accent transition-colors hover:text-accent-hover"
            >
              {VENUE.email}
            </Link>
            <p className="mt-4 text-sm text-fg-subtle">
              For table reservations use{" "}
              <Link href="/reserve" className="text-fg-muted underline hover:text-accent">
                /reserve
              </Link>
              . For the streamer program see{" "}
              <Link href="/streamers" className="text-fg-muted underline hover:text-accent">
                /streamers
              </Link>
              .
            </p>
          </InfoBlock>

          <InfoBlock icon={<InstagramGlyph className="h-5 w-5" />} label="Instagram">
            <Link
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="text-base text-accent transition-colors hover:text-accent-hover"
            >
              {SITE.instagramHandle}
            </Link>
            <p className="mt-2 text-sm text-fg-muted">
              Follow for weekly programming, broadcast recaps, and creator takeovers.
            </p>
          </InfoBlock>
        </div>
      </PageShell>
    </>
  );
}

function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-bg-elevated/50 p-6 md:p-8">
      <div className="flex items-center gap-3 text-accent">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
