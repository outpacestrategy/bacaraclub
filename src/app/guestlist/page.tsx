"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { VENUE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * /guestlist — secondary conversion per docs/site-plan.md.
 *
 * Shorter than /reserve: one step, low barrier, higher volume. Feeds retargeting
 * audiences on Meta when the pixel is wired.
 *
 * For launch 1 the submit handler is `mailto:` with a pre-filled body. When
 * Milestone 5 adds Supabase, swap `handleSubmit` for a POST to /api/guestlist and
 * wire the Meta Pixel `Lead` event.
 */
export default function GuestlistPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    ig: "",
    night: "wednesday",
    size: "2",
  });
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Guest List Request — Bacara Club");
    const lines = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Instagram: ${form.ig || "(not provided)"}`,
      `Night: ${form.night}`,
      `Party size: ${form.size}`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${VENUE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <PageShell
      eyebrow="Guest List"
      title="Skip the line,"
      highlight="Waive the cover"
      description="Guest list gets you early entry and waived cover on Wednesdays and Saturdays. One field per question — takes less than a minute."
      showClosingCta={false}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border bg-bg-elevated/50 p-6 md:p-10"
      >
        <Field label="Full name" htmlFor="gl-name">
          <input
            id="gl-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClasses}
            autoComplete="name"
          />
        </Field>

        <Field label="Phone number" htmlFor="gl-phone">
          <input
            id="gl-phone"
            type="tel"
            inputMode="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClasses}
            autoComplete="tel"
            placeholder="+1 305 555 0199"
          />
        </Field>

        <Field label="Instagram handle" htmlFor="gl-ig" hint="Optional — helps us find you at the door">
          <input
            id="gl-ig"
            type="text"
            value={form.ig}
            onChange={(e) => setForm({ ...form, ig: e.target.value })}
            className={inputClasses}
            placeholder="@"
          />
        </Field>

        <Field label="Which night?" htmlFor="gl-night">
          <select
            id="gl-night"
            value={form.night}
            onChange={(e) => setForm({ ...form, night: e.target.value })}
            className={inputClasses}
          >
            <option value="wednesday">Wednesday</option>
            <option value="saturday">Saturday</option>
          </select>
        </Field>

        <Field label="Party size" htmlFor="gl-size">
          <select
            id="gl-size"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className={inputClasses}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6 or more</option>
          </select>
        </Field>

        <motion.button
          type="submit"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
        >
          <Check className="h-4 w-4" />
          Request guest list
        </motion.button>

        <p className="pt-2 text-center text-xs text-fg-subtle">
          Submissions go to the door team directly. Guest list is subject to
          capacity and final door discretion.
        </p>
      </form>
    </PageShell>
  );
}

const inputClasses = cn(
  "block w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-fg",
  "placeholder:text-fg-subtle",
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
  "transition-colors",
);

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-[0.14em] text-fg-muted"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
