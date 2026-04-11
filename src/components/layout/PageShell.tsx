import Link from "next/link";
import type { ReactNode } from "react";

import { CTA } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * PageShell — shared layout for every non-home page.
 *
 * Provides:
 *   - Top spacing so content clears the sticky header
 *   - A semantic `<article>` wrapper with the right max-width and prose rhythm
 *   - Optional eyebrow → H1 → description header block in the same visual style as
 *     the home-page `SectionHeader`, but larger (since it's the page's H1)
 *   - A closing Reserve-a-Table CTA strip that lives at the bottom of every page
 *     (per site-plan.md: "Every page has a reservation CTA above the fold and in
 *     the footer. Always.")
 *
 * Use as:
 *
 *   export default function MyPage() {
 *     return (
 *       <PageShell eyebrow="About" title="The Bacara Story" highlight="2026">
 *         <p>...body content...</p>
 *       </PageShell>
 *     );
 *   }
 */
export function PageShell({
  eyebrow,
  title,
  highlight,
  description,
  children,
  className,
  showClosingCta = true,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showClosingCta?: boolean;
}) {
  return (
    <>
      <article
        className={cn(
          "relative mx-auto w-full max-w-5xl px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36",
          className,
        )}
      >
        <header className="mb-14 max-w-3xl md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-balance text-5xl leading-[1.05] text-fg md:text-6xl">
            {title}
            {highlight ? (
              <>
                {" "}
                <span className="text-accent">{highlight}</span>
              </>
            ) : null}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              {description}
            </p>
          ) : null}
        </header>

        {children}
      </article>

      {showClosingCta ? <ClosingCta /> : null}
    </>
  );
}

function ClosingCta() {
  return (
    <section className="relative border-t border-border bg-bg-elevated/30 py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[720px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,165,72,0.1),transparent_70%)]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
          Reserve
        </p>
        <h2 className="mt-3 text-balance text-3xl text-fg md:text-4xl">
          Your table is waiting.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-fg-muted">
          Wednesdays and Saturdays at 235 23rd Street, Miami Beach.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={CTA.reserve.href}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover sm:w-auto"
          >
            {CTA.reserve.label}
          </Link>
          <Link
            href={CTA.guestlist.href}
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm text-fg transition-colors hover:border-accent hover:text-accent sm:w-auto"
          >
            {CTA.guestlist.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
