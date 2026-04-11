"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { CTA, PRIMARY_NAV, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Sticky top nav.
 * - Transparent at the top of the page, fades to a solid translucent bar once the user scrolls
 *   past the hero (64px of scroll is enough to be clearly past the top).
 * - Mobile: hamburger opens a full-screen drawer with staggered links.
 * - Respects prefers-reduced-motion.
 * - Final item in the desktop row is the Reserve CTA (not a nav link) per site-plan.md.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "bg-bg-overlay border-b border-border backdrop-blur-xl"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Brand mark — landscape white wordmark on transparent.
            The wordmark is 1024×472 (roughly 2.17:1). At 40px tall that's ~87px wide,
            which gives the header row a clean, premium typographic mark that sits on
            the dark page background with no surrounding box. */}
        <Link
          href="/"
          onClick={closeMobile}
          className="group flex items-center gap-4"
          aria-label={`${SITE.name} — home`}
        >
          <Image
            src="/brand/bacara-wordmark.png"
            alt={SITE.name}
            width={87}
            height={40}
            priority
            className="h-10 w-auto transition-opacity group-hover:opacity-90"
          />
          <span
            className="hidden items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-fg-muted sm:inline-flex"
            aria-hidden="true"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            On Air Wed &amp; Sat
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={CTA.reserve.href}
            className="inline-flex items-center rounded-full border border-accent bg-accent px-5 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            {CTA.reserve.label}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-accent hover:text-accent md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden"
          >
            <div className="border-t border-border bg-bg/95 backdrop-blur-xl">
              <nav
                aria-label="Primary mobile"
                className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-6"
              >
                {PRIMARY_NAV.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={
                      prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className="block rounded-lg px-3 py-3 font-[family-name:var(--font-display)] text-2xl text-fg transition-colors hover:bg-bg-elevated hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.05 + PRIMARY_NAV.length * 0.04 }}
                  className="mt-4"
                >
                  <Link
                    href={CTA.reserve.href}
                    onClick={closeMobile}
                    className="flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-base font-medium text-bg transition-colors hover:bg-accent-hover"
                  >
                    {CTA.reserve.label}
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
