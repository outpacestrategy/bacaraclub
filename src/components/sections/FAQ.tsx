"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import { FAQS, type FAQEntry } from "@/lib/faq-data";
import { cn } from "@/lib/utils";

/**
 * Frequently Asked Questions — the home-page SEO & GEO content block.
 *
 * Two jobs:
 *  1. Render a readable accordion of Q&A pairs for human visitors.
 *  2. Emit a `FAQPage` JSON-LD schema block inline in the page so Google, Perplexity,
 *     Claude, and other AI search models cite the answers with proper attribution.
 *
 * Per `docs/seo-geo-strategy.md`, FAQ schema is "the single biggest GEO lever" — AI
 * search engines pull clean factual Q&A pairs from FAQPage schema directly, so we want
 * this block on the home page (for the brand-level queries) and eventually on
 * `/wednesdays`, `/saturdays`, `/streamers`, and the dedicated `/faq` page with
 * page-specific subsets.
 *
 * CLAUDE.md compliance: entries flagged `needsConfirmation: true` carry a
 * `data-placeholder="true"` attribute so a pre-launch grep can find them. The schema
 * still includes them (Google won't penalize us for shipping answers that need tuning,
 * but we will), and a pre-launch review needs to sign off on each before release.
 */
export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="relative py-24 md:py-32">
      {/* JSON-LD FAQPage schema — the GEO lever */}
      <FAQJsonLd entries={FAQS} />

      {/* Subtle champagne wash behind the stack */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[760px] max-w-[95vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(212,165,72,0.08),transparent_70%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-5 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions,"
          highlight="Answered"
          description="The practical details about Bacara Club — hours, table reservations, the streamer program, and what to expect on a Wednesday or Saturday broadcast."
        />

        <ul className="mt-14 divide-y divide-border border-y border-border">
          {FAQS.map((entry) => {
            const isOpen = openId === entry.id;
            return (
              <FAQItem
                key={entry.id}
                entry={entry}
                isOpen={isOpen}
                onToggle={() => toggle(entry.id)}
                reducedMotion={!!prefersReducedMotion}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FAQItem({
  entry,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  entry: FAQEntry;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  const Icon = isOpen ? Minus : Plus;

  return (
    <li
      data-placeholder={entry.needsConfirmation ? "true" : undefined}
      className="relative"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${entry.id}`}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-accent md:py-7"
      >
        <span
          className={cn(
            "font-[family-name:var(--font-display)] text-lg leading-snug md:text-xl",
            isOpen ? "text-accent" : "text-fg",
          )}
        >
          {entry.question}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
            isOpen
              ? "border-accent text-accent"
              : "border-border text-fg-muted group-hover:border-accent group-hover:text-accent",
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${entry.id}`}
            role="region"
            aria-labelledby={`faq-question-${entry.id}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pr-14 text-base leading-relaxed text-fg-muted md:pb-8 md:text-[17px]">
              {entry.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * Injects the FAQPage JSON-LD schema into the document.
 * Schema spec: https://schema.org/FAQPage
 *
 * Google and AI search models parse this to pull Q&A content for featured snippets,
 * "People also ask" panels, and AI overview citations. Every question becomes a
 * `Question` node, each with a single `acceptedAnswer` of type `Answer`.
 */
function FAQJsonLd({ entries }: { entries: readonly FAQEntry[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe for this data (no user input); React won't escape JSON
      // inside a script tag on its own, so we pass it via dangerouslySetInnerHTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
