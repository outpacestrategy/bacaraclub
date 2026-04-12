"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarPlus, Camera, Check } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { ReservationChannels } from "@/components/sections/ReservationChannels";
import { SITE } from "@/lib/constants";
import { trackConversion } from "@/lib/analytics";
import { buildIcsDataUrl } from "@/lib/calendar";
import {
  UPCOMING_EVENTS,
  getEventBySlug,
  type UpcomingEvent,
} from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * /reserve — primary conversion.
 *
 * Per docs/site-plan.md: the most important page on the site. Built as a
 * multi-step quiz per the create-website skill's `ContactQuiz` pattern.
 *
 * This version implements the P0 "event-first" upgrade from
 * docs/implementation-plan.md §1.1 + §1.2 + §1.3:
 *
 *   1. Step 1 is a list of the next upcoming Wednesday / Saturday events,
 *      each with date, theme, and a hero image. "Other date" remains as a
 *      fallback option for private or unusual asks. The selected event slug
 *      is wired all the way through the quiz state and into the submission
 *      payload so /api/reserve (and eventually Supabase) captures which
 *      specific night the lead is for.
 *   2. The success state promises a VIP host text within 30 minutes, offers
 *      an "Add to Calendar" download for the selected night, and surfaces
 *      the Instagram follow CTA.
 *   3. The multi-channel reservation block (email / text / Tablelist) is
 *      rendered below the quiz so high-spend buyers who only email or only
 *      text still find a path.
 *
 * Submission pipeline:
 *   - POST /api/reserve with the full payload
 *   - Stub handler logs to console (Milestone 5 adds Supabase)
 *   - Fires GA `reserve_submit` and Meta Pixel `Lead`
 *   - Advances the UI to the success state regardless (never leave the user
 *     staring at an error if the network fails — the door team can still
 *     reach them by email from the captured mailto fallback)
 */

type Step = 0 | 1 | 2 | 3 | 4 | 5;

type QuizState = {
  /** Slug of the selected upcoming event; null if "other date" was picked */
  eventSlug: string | null;
  /** Derived night ("wednesday" / "saturday" / "other") for deep links + Supabase */
  night: "wednesday" | "saturday" | "other";
  /** Free-form date captured when eventSlug is null */
  preferredDate: string;
  partySize: string;
  section: string;
  budget: string;
  name: string;
  phone: string;
  email: string;
  instagram: string;
};

const initialState: QuizState = {
  eventSlug: null,
  night: "wednesday",
  preferredDate: "",
  partySize: "",
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
      description="Pick the night, tell us a little about your party, and a Bacara VIP host will come back within 30 minutes with availability and pricing. Wednesdays and Saturdays book fastest — submit at least 48 hours ahead when possible."
      showClosingCta={false}
    >
      <Suspense fallback={<QuizSkeleton />}>
        <ReserveQuiz />
      </Suspense>
      <ReservationChannels />
    </PageShell>
  );
}

function QuizSkeleton() {
  return (
    <div className="mx-auto h-[560px] max-w-3xl animate-pulse rounded-3xl border border-border bg-bg-elevated/50" />
  );
}

function ReserveQuiz() {
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  // Pre-select an event or a night from ?event=slug or ?night=wednesday.
  // `event=` wins if both are present, because it's the more specific signal.
  const initial: QuizState = useMemo(() => {
    const eventParam = searchParams.get("event");
    const nightParam = searchParams.get("night");
    if (eventParam) {
      const ev = getEventBySlug(eventParam);
      if (ev) {
        return {
          ...initialState,
          eventSlug: ev.slug,
          night: ev.night === "saturday" ? "saturday" : "wednesday",
        };
      }
    }
    if (nightParam === "saturday" || nightParam === "wednesday") {
      return { ...initialState, night: nightParam };
    }
    return initialState;
  }, [searchParams]);

  const [step, setStep] = useState<Step>(0);
  const [state, setState] = useState<QuizState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalSteps = 5;
  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  // Fire ReserveQuizStart on first render (matches docs/meta-ads-strategy.md).
  useEffect(() => {
    trackConversion("reserve_quiz_start", "InitiateCheckout", {
      event_slug: initial.eventSlug ?? "none",
      night: initial.night,
    });
    // Only fire once on mount — the dependency list intentionally excludes
    // state that changes over time.

  }, []);

  const next = () => setStep((s) => (s < totalSteps ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  /**
   * Step 1 — choose an event (or "other date").
   *
   * Selecting an event locks `eventSlug` + `night`. Selecting "other date"
   * clears `eventSlug` and sets night = "other", which keeps the quiz shape
   * uniform while letting the door team know to follow up on a non-flagship
   * request.
   */
  const pickEvent = (event: UpcomingEvent) => {
    setState((s) => ({
      ...s,
      eventSlug: event.slug,
      night: event.night === "saturday" ? "saturday" : "wednesday",
      preferredDate: "",
    }));
    trackConversion("reserve_step_1", "AddToCart", {
      event_slug: event.slug,
      night: event.night,
    });
    setTimeout(next, 180);
  };

  const pickOtherDate = () => {
    setState((s) => ({
      ...s,
      eventSlug: null,
      night: "other",
      preferredDate: "",
    }));
    trackConversion("reserve_step_1", "AddToCart", {
      event_slug: "other",
      night: "other",
    });
    setTimeout(next, 180);
  };

  const setPartySize = (size: string) => {
    setState((s) => ({ ...s, partySize: size }));
    trackConversion("reserve_step_2", null, { party_size: size });
    setTimeout(next, 180);
  };
  const setSection = (section: string) => {
    setState((s) => ({ ...s, section }));
    trackConversion("reserve_step_3", null, { section });
    setTimeout(next, 180);
  };
  const setBudget = (budget: string) => {
    setState((s) => ({ ...s, budget }));
    trackConversion("reserve_step_4", null, { budget });
    setTimeout(next, 180);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: state.eventSlug,
          night: state.night,
          preferredDate: state.preferredDate || null,
          partySize: state.partySize,
          section: state.section,
          budget: state.budget,
          name: state.name,
          phone: state.phone,
          email: state.email,
          instagram: state.instagram || null,
        }),
      });
      // Fire the Lead conversion regardless of the server-side persistence
      // success: once the user has submitted the form, the intent signal is
      // real to Meta's optimizer and GA, and the email/text fallback in the
      // error path means the door team still gets the lead.
      trackConversion("reserve_submit", "Lead", {
        event_slug: state.eventSlug ?? "none",
        night: state.night,
        party_size: state.partySize,
        section: state.section,
        budget: state.budget,
      });
      if (!res.ok) {
        throw new Error(`Submission failed (${res.status})`);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong — please try again or email tables@bacaraclub.com.",
      );
    } finally {
      setSubmitting(false);
      setStep(5);
    }
  };

  const stepVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const selectedEvent = state.eventSlug
    ? getEventBySlug(state.eventSlug) ?? null
    : null;

  return (
    <div className="mx-auto max-w-3xl">
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

      <div className="min-h-[520px] rounded-3xl border border-border bg-bg-elevated/50 p-6 md:p-10">
        <AnimatePresence mode="wait">
          {/* STEP 1 — event-first picker */}
          {step === 0 && (
            <motion.div key="s0" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading
                title="Which night?"
                subtitle="Pick an upcoming broadcast. Or request a different date."
              />
              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {UPCOMING_EVENTS.map((event) => (
                  <EventOptionCard
                    key={event.slug}
                    event={event}
                    selected={state.eventSlug === event.slug}
                    onClick={() => pickEvent(event)}
                  />
                ))}
                <button
                  type="button"
                  onClick={pickOtherDate}
                  className={cn(
                    "flex flex-col items-start justify-center rounded-xl border border-dashed px-5 py-5 text-left transition-all md:col-span-2",
                    state.eventSlug === null && state.night === "other"
                      ? "border-accent bg-accent/[0.05]"
                      : "border-border/70 bg-bg hover:border-accent/50",
                  )}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                    Other
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-fg md:text-2xl">
                    Request a different date
                  </p>
                  <p className="mt-1 text-xs text-fg-muted md:text-sm">
                    Private events, buyouts, or a specific upcoming night not
                    listed above.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — party size */}
          {step === 1 && (
            <motion.div key="s1" {...stepVariants} transition={{ duration: 0.3 }}>
              <StepHeading title="Party size?" subtitle="How many guests in your party" />
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["2", "4", "6", "8", "10+", "Ask"].map((size) => (
                  <OptionCard
                    key={size}
                    label={size}
                    selected={state.partySize === size}
                    onClick={() => setPartySize(size)}
                    compact
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — section */}
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

          {/* STEP 4 — budget */}
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

          {/* STEP 5 — contact details */}
          {step === 4 && (
            <motion.form
              key="s4"
              onSubmit={handleSubmit}
              {...stepVariants}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <StepHeading title="Your details" subtitle="How the VIP host team reaches you" />

              {/* Optional free-form date when user picked "other" */}
              {state.night === "other" && (
                <TextField
                  id="r-date"
                  label="Preferred date"
                  hint="Optional — the day you're hoping to book"
                  value={state.preferredDate}
                  placeholder="e.g., June 14, any Wednesday in July"
                  onChange={(v) => setState({ ...state, preferredDate: v })}
                />
              )}

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

              {submitError && (
                <p className="text-sm text-live" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-medium text-bg shadow-[0_0_40px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit reservation request"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </motion.form>
          )}

          {/* STEP 6 — VIP SLA success state */}
          {step === 5 && (
            <motion.div
              key="s5"
              {...stepVariants}
              transition={{ duration: 0.3 }}
              className="py-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent bg-accent/10">
                <Check className="h-8 w-8 text-accent" />
              </div>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-fg md:text-4xl">
                You&apos;re in.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-fg-muted">
                A Bacara VIP host will text you within 30 minutes to lock in
                your table. Keep an eye on your phone.
              </p>

              {selectedEvent && (
                <p className="mx-auto mt-4 max-w-md text-sm text-fg-muted">
                  Night:{" "}
                  <span className="text-accent">{selectedEvent.title}</span> ·{" "}
                  {selectedEvent.dateLine}
                </p>
              )}

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {selectedEvent && (
                  <a
                    href={buildIcsDataUrl({
                      title: selectedEvent.title,
                      description: selectedEvent.description,
                      start: selectedEvent.startDate,
                      end: selectedEvent.endDate,
                      uid: selectedEvent.slug,
                      url: `${SITE.url}/events/${selectedEvent.slug}`,
                    })}
                    download={`${selectedEvent.slug}.ics`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </a>
                )}
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
                  onClick={() =>
                    trackConversion("tap_instagram", "Lead", {
                      source: "reserve_success",
                    })
                  }
                >
                  <Camera className="h-4 w-4" />
                  Follow {SITE.instagramHandle}
                </a>
              </div>

              <p className="mx-auto mt-8 max-w-md text-xs text-fg-muted">
                Didn&apos;t hear back within 30 minutes?{" "}
                <Link
                  href="#reservation-channels-heading"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Use one of the channels below.
                </Link>
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
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

/**
 * Step-1 specific card for an upcoming event — larger than OptionCard, shows
 * a hero image, the date line, and the DJ/theme below.
 */
function EventOptionCard({
  event,
  selected,
  onClick,
}: {
  event: UpcomingEvent;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-placeholder="true"
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-xl border text-left transition-all",
        selected
          ? "border-accent bg-accent/[0.05] shadow-[0_0_40px_-15px_var(--accent-glow)]"
          : "border-border bg-bg hover:border-accent/50",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={event.heroImage}
          alt={event.heroAlt}
          fill
          sizes="(min-width: 768px) 360px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"
        />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] backdrop-blur",
            event.night === "wednesday"
              ? "border-live/40 bg-live/10 text-live"
              : "border-accent/40 bg-accent/10 text-accent",
          )}
        >
          {event.night === "wednesday" ? "Wed" : "Sat"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          {event.dateLine}
        </p>
        <p
          className={cn(
            "font-[family-name:var(--font-display)] text-lg leading-tight md:text-xl",
            selected ? "text-accent" : "text-fg",
          )}
        >
          {event.title}
        </p>
        <p className="text-xs text-fg-muted">{event.host}</p>
      </div>
    </button>
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
