import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

import { CTA, FOOTER_NAV, SITE, VENUE } from "@/lib/constants";

/**
 * Inline Instagram glyph.
 * lucide-react 1.x removed brand icons, so we ship a local SVG that matches the stroke
 * style of the surrounding lucide icons (2px stroke, rounded joins, currentColor).
 */
function InstagramIcon({ className }: { className?: string }) {
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

/**
 * Site footer.
 * - Brand block (wordmark, tagline, IG link)
 * - Three nav columns: Visit, Book, Company
 * - Address + hours block
 * - Legal line with Outpace credit
 *
 * Server component — no interactivity lives here, just presentation.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border bg-bg">
      {/* Top accent glow — a single champagne hairline above the footer to separate it from page content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand column — landscape wordmark at 72px tall, auto-width */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="inline-block"
              aria-label={`${SITE.name} — home`}
            >
              <Image
                src="/brand/bacara-wordmark.png"
                alt={SITE.name}
                width={174}
                height={80}
                className="h-20 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-fg-muted">
              {SITE.tagline}. Wednesdays and Saturdays, always on air.
            </p>
            <Link
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent"
            >
              <InstagramIcon className="h-4 w-4" />
              {SITE.instagramHandle}
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-3">
            <FooterColumn title="Visit" links={FOOTER_NAV.visit} />
            <FooterColumn title="Book" links={FOOTER_NAV.book} />
            <FooterColumn title="Company" links={FOOTER_NAV.company} />
          </div>

          {/* Visit block */}
          <div className="md:col-span-3">
            <h3 className="font-[family-name:var(--font-display)] text-lg text-fg">Find us</h3>
            <address className="mt-4 space-y-3 text-sm not-italic text-fg-muted">
              <p className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>
                  {VENUE.street}
                  <br />
                  {VENUE.city}, {VENUE.region} {VENUE.postalCode}
                </span>
              </p>
              <p className="text-fg-subtle">{VENUE.hoursHuman}</p>
              <Link
                href={`mailto:${VENUE.email}`}
                className="inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {VENUE.email}
              </Link>
            </address>

            <Link
              href={CTA.reserve.href}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent-hover md:w-auto"
            >
              {CTA.reserve.label}
            </Link>
          </div>
        </div>

        {/* Legal line */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-fg-subtle md:flex-row md:items-center">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p>
            Built by{" "}
            <Link
              href="https://outpacestrategygroup.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted transition-colors hover:text-accent"
            >
              Outpace Strategy Group
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-lg text-fg">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-fg-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
