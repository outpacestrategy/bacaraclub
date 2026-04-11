import { cn } from "@/lib/utils";

/**
 * Consistent section header used by every home-page section.
 * - Eyebrow is small, uppercase, gold — the script "Events / Artists / Mona" look from
 *   mona club, but typeset rather than handwritten. Bodoni Moda handles the display
 *   voice everywhere else.
 * - Title inherits Bodoni Moda from the global h2 rule, with a gold emphasized span
 *   for the second phrase.
 *
 * This is a server component — no interactivity lives here.
 */
export function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <header
      className={cn(
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-4xl leading-[1.05] text-fg md:text-5xl">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="text-accent">{highlight}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-fg-muted md:text-lg",
            isCenter ? "mx-auto" : ""
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
