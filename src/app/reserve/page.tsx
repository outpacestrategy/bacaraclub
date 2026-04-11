"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { SITE, VENUE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * /reserve — primary conversion.
 *
 * Per docs/site-plan.md: "This is the most important page on the site. Built as a
 * multi-step quiz per the create-website skill's `ContactQuiz` pattern, not a single
 * big form."
 *
 * Steps:
 *   1. Which night?    — Wednesday / Saturday
 *   2. Party size       — 2 / 4 / 6 / 8 / 10+
 *   3. Section          — Main Room / VIP Booth / Streamer Table / Private Area
 *   4. Budget range     — $500-1000 / $1000-2500 / $2500-5000 / $5000+
 *   5. Contact details  — name, phone, email, IG handle
 *   6. Success state    — confirmation + calendar link
 *
 * LAUNCH 1 BEHAVIOR: submit handler uses `mailto:` with a pre-filled body. No backend
 * required. When Milestone 5 wires in Supabase, swap `handleSubmit` for a POST to
 * /api/reserve, and fire Meta Pixel events on each step (`ReserveQuizStart`,
 * `ReserveQuizStep2..5`, `ReserveQuizSubmit`, `Lead`).
 *
 * The `night` query param (`?night=wednesday` / `?night=saturday`) is read on mount
 * so event-card deep-links pre-select the first step.
 */

type Step = 0 | 1 | 2 | 3 | 4 | 5;

type QuizState = {
  night: "wednesday" | "saturday";
  size: string;
  section: string;
  budget: string;
  name: string;
  phone: string;
  email: string;
  instagram: string;
};

const initialState: QuizState = {
  night: "wednesday",
  size: "",
  section: "",
  budget: "",
  name: "",
  phone: "",
  email: "",
  instagram: "",
};

export default function ReservePage() {
  return (
    <PageShell
      eyebrow="Reserve"
      title="Reserve your"
      highlight="Table"
      description="Five quick questions and the Bacara door team will come back with availability for your night. Wednesdays and Saturdays book fastest — submit at least 48 hours ahead when possible."
      showClosingCta={false}
    >
      <Suspense fallback={<QuizSkeleton />}>
        <ReserveQuiz />
      </Suspense>
    </PageShell>
  );
}

function QuizSkeleton() {
  return (
    <div className="mx-auto h-[520px] max-w-2xl animate-pulse rounded-3xl border border-border bg-bg-elevated/50" />
  );
}

function ReserveQuiz() {
  const searchParams = useSearchParams();
  const nightParam = searchParams.get("night");
  const initialNight: QuizState["night"] =
    nightParam === "saturday" || nightParam === "wednesday"
      ? nightParam
      : "wednesday";

  const [step, setStep] = useState<Step>(0);
  const [state, setState] = useState<QuizState>({
    ...initialState,
    night: initialNight,
  });
  const prefersReducedMotion = useReducedMotion();

  const totalSteps = 5;
  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  const next = () => setStep((s) => (s < totalSteps ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const setNight = (night: QuizState["night"]) => {
    setState((s) => ({ ...s, night }));
    // Auto-advance on selection
    setTimeout(next, 180);
  };
  const setSize = (size: string) => {
    setState((s) => ({ ...s, size }));
    setTimeout(next, 180);
  };
  const setSection = (section: string) => {
    setState((s) => ({ ...s, section }));
    setTimeout(next, 180);
  };
  const setBudget = (budget: string) => {
    setState((s) => ({ ...s, budget }));
    setTimeout(next, 180);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Reservation Request — Bacara Club");
    const lines = [
      `Night: ${state.night}`,
      `Party size: ${state.size}`,
      `Section: ${state.section}`,
      `Budget range: ${state.budget}`,
      `Name: ${state.name}`,
      `Phone: ${state.phone}`,
      `Email: ${state.email}`,
      `Instagram: ${state.instagram || "(not provided)"}`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${VENUE.email}?subject=${subject}&body=${body}`;
    // Advance to the success state immediately so users who return see confirmation
    setStep(5);
  };

  const stepVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex-1 rounded-full bg-bg-elevated">
          <motion.div
            className="h-1 rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </div>
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          {step < totalSteps ? `Step ${step + 1} of ${totalSteps}` : "Done"}
        </span>
      </div>

      <div className="min-h-[460px] rounded-3xl border border-border bg-bg-elevated/50 p-6 md:p-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading title="Which night?" subtitle="Bacara is open Wednesday and Saturday" />
              <div className="mt-8 grid gap-3">
                {(
                  [
                    { id: "wednesday", label: "Wednesday", subtitle: "Flagship broadcast · 10 PM – 5 AM" },
                    { id: "saturday", label: "Saturday", subtitle: "Flagship broadcast · 10 PM – 5 AM" },
                  ] as const
                ).map((opt) => (
                  <OptionCard
                    key={opt.id}
                    label={opt.label}
                    subtitle={opt.subtitle}
                    selected={state.night === opt.id}
                    onClick={() => setNight(opt.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading title="Party size?" subtitle="How many guests are in your party" />
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["2", "4", "6", "8", "10+", "Ask"].map((size) => (
                  <OptionCard
                    key={size}
                    label={size}
                    selected={state.size === size}
                    onClick={() => setSize(size)}
                    compact
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading title="Which section?" subtitle="Where would you like to sit" />
              <div className="mt-8 grid gap-3">
                {[
                  { id: "main", label: "Main Room", subtitle: "Center of the action" },
                  { id: "vip", label: "VIP Booth", subtitle: "Elevated, private, near the booth" },
                  { id: "streamer", label: "Streamer Table", subtitle: "With broadcast rig and creator lighting" },
                  { id: "private", label: "Private Area", subtitle: "Largest party sizes, dedicated host" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.id}
                    label={opt.label}
                    subtitle={opt.subtitle}
                    selected={state.section === opt.id}
                    onClick={() => setSection(opt.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading
                title="Budget range?"
                subtitle="Bottle-service minimum range for your party. Final pricing confirmed by the door team."
              />
              <div className="mt-8 grid gap-3">
                {["$500 – $1,000", "$1,000 – $2,500", "$2,500 – $5,000", "$5,000+"].map((range) => (
                  <OptionCard
                    key={range}
                    label={range}
                    selected={state.budget === range}
                    onClick={() => setBudget(range)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.form
              key="s4"
              onSubmit={handleSubmit}
              {...stepVariants}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <StepHeading title="Your details" subtitle="How the door team reaches you" />
              <div className="mt-6 space-y-5">
                <TextField
                  id="r-name"
                  label="Full name"
                  required
                  value={state.name}
                  autoComplete="name"
                  onChange={(v) => setState({ ...state, name: v })}
                />
                <TextField
                  id="r-phone"
                  label="Phone"
                  type="tel"
                  inputMode="tel"
                  required
                  value={state.phone}
                  autoComplete="tel"
                  placeholder="+1 305 555 0199"
                  onChange={(v) => setState({ ...state, phone: v })}
                />
                <TextField
                  id="r-email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  required
                  value={state.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                  onChange={(v) => setState({ ...state, email: v })}
                />
                <TextField
                  id="r-ig"
                  label="Instagram"
                  hint="Optional"
                  value={state.instagram}
                  placeholder="@handle"
                  onChange={(v) => setState({ ...state, instagram: v })}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
              >
                Submit reservation request
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.form>
          )}

          {step === 5 && (
            <motion.div
              key="s5"
              {...stepVariants}
              transition={{ duration: 0.3 }}
              className="py-10 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent bg-accent/10">
                <Check className="h-8 w-8 text-accent" />
              </div>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
                Request sent.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-fg-muted">
                The Bacara door team will come back within one business day with
                availability and pricing. Follow{" "}
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent hover:text-accent-hover"
                >
                  {SITE.instagramHandle}
                </a>{" "}
                for weekly programming and broadcast recaps while you wait.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button — visible on every step except the first and the success screen */}
        {step > 0 && step < 5 && (
          <div className="mt-8 flex items-center justify-start">
            <button
              type="button"
              onClick={prev}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function OptionCard({
  label,
  subtitle,
  selected,
  onClick,
  compact,
}: {
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group w-full rounded-xl border px-5 text-left transition-all",
        compact ? "py-4" : "py-5",
        selected
          ? "border-accent bg-accent/[0.05] shadow-[0_0_40px_-15px_var(--accent-glow)]"
          : "border-border bg-bg hover:border-accent/50",
      )}
    >
      <p
        className={cn(
          "font-[family-name:var(--font-display)] text-xl leading-tight md:text-2xl",
          selected ? "text-accent" : "text-fg",
        )}
      >
        {label}
      </p>
      {subtitle ? (
        <p className="mt-1 text-xs leading-snug text-fg-muted md:text-sm">
          {subtitle}
        </p>
      ) : null}
    </button>
  );
}

function TextField({
  id,
  label,
  required,
  type = "text",
  inputMode,
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  inputMode?: "tel" | "email" | "text" | "numeric";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] uppercase tracking-[0.14em] text-fg-muted"
      >
        {label}
        {hint ? <span className="ml-2 text-fg-subtle">({hint})</span> : null}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 block w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-fg placeholder:text-fg-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
