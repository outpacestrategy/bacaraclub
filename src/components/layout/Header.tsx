"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { CTA, PRIMARY_NAV, SITE } from "@/lib/constants";

/**
 * Sticky top nav — Mona-style centered layout.
 *
 * Three-column grid that holds its shape from 375 px through 4K:
 *   [hamburger]            [centered wordmark]            [reserve a table]
 *
 * - All routes live behind the hamburger, at every viewport size. There's no
 *   desktop inline nav — clicking the menu opens a full-screen overlay drawer
 *   with the nav links centered in big Bodoni Moda. This keeps the header
 *   visually quiet so the hero/video can dominate the fold.
 * - Logo is centered to the viewport, not to the available space between the
 *   left and right items. The 3-column grid (1fr 1fr 1fr) guarantees this even
 *   when the left and right column contents have different widths.
 * - Reserve a Table on the right is plain white text inside a subtle border —
 *   no champagne-gold pill background. Champagne-gold is reserved for the
 *   hero CTAs and section CTAs where conversion-pop matters most.
 * - Header is transparent at the very top of the page, fades to a solid
 *   translucent bar once the user scrolls past the first 16 px, AND becomes
 *   solid whenever the drawer is open (so the drawer's bg lines up with the
 *   header bar).
 * - Respects prefers-reduced-motion across the drawer entrance and link
 *   stagger.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll while the drawer is open so the page underneath doesn't move.
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Static positioning — header sits in normal document flow at the top of the
          page and scrolls away with everything else (no longer follows the user
          down). No background, no border, no backdrop-blur, no scroll-state fade —
          maximally transparent so the hero video underneath is uninterrupted. The
          logo / hamburger / Reserve link float over the page content. */}
      <header className="static z-50">
        <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-3 items-center px-5 md:px-8">
        {/* Left: hamburger / close button */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start rounded-full text-fg transition-colors hover:text-accent"
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Center: brand mark.
            The wordmark is 1024×472 (~2.17:1). At 40 px tall = ~87 px wide. */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group justify-self-center"
          aria-label={`${SITE.name} — home`}
        >
          <Image
            src="/brand/bacara-wordmark.png"
            alt={SITE.name}
            width={87}
            height={40}
            priority
            className="h-9 w-auto transition-opacity group-hover:opacity-90 sm:h-10"
          />
        </Link>

        {/* Right: Reserve a Table — plain white text inside a subtle border, no fill.
            Hidden on mobile (the Reserve CTA still lives in the drawer for those users,
            so we save the header chrome for the logo + hamburger only). The grid
            column itself stays (grid-cols-3 doesn't collapse on display:none children),
            which is what keeps the logo perfectly centered to the viewport even when
            the right cell has nothing visible in it. */}
        <Link
          href={CTA.reserve.href}
          onClick={closeMenu}
          className="hidden items-center justify-self-end rounded-full border border-border px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-fg sm:inline-flex"
        >
          {CTA.reserve.label}
        </Link>
      </div>
    </header>

    {/* Full-screen drawer — rendered as a SIBLING of <header>, NOT a child.
        The header has backdrop-blur, which creates a CSS containing block for
        position:fixed descendants. If the drawer were a child of <header>,
        `top-16 bottom-0` would be measured against the 64px-tall header instead
        of the viewport, collapsing the drawer to zero height. Hoisting it to
        the fragment level makes the body the containing block, so the fixed
        positioning resolves against the viewport as intended. */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="primary-menu"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg/95 backdrop-blur-xl"
        >
          {/* Subtle radial glow inside the drawer to match the rest of the site's lighting language. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(212,165,72,0.07),transparent_70%)]"
          />

          <nav
            aria-label="Primary"
            className="relative mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-3 px-5 py-16 sm:gap-4 sm:py-24"
          >
            {PRIMARY_NAV.map((link, i) => (
              <motion.div
                key={link.href}
                initial={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.06 + i * 0.05,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block font-[family-name:var(--font-display)] text-5xl leading-none text-fg transition-colors hover:text-accent sm:text-6xl md:text-7xl"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Reserve CTA at the bottom of the menu — gold pill here for emphasis,
                unlike the always-visible header version which is intentionally quiet. */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.06 + PRIMARY_NAV.length * 0.05,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="mt-8"
            >
              <Link
                href={CTA.reserve.href}
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-medium text-bg shadow-[0_0_60px_-12px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
              >
                {CTA.reserve.label}
              </Link>
            </motion.div>

            {/* Address footer inside the drawer — small premium touch. */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.06 + (PRIMARY_NAV.length + 1) * 0.05,
              }}
              className="mt-12 text-center text-xs uppercase tracking-[0.18em] text-fg-subtle"
            >
              235 23rd St · Miami Beach · Wed &amp; Sat
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
