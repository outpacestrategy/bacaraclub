import { NextResponse } from "next/server";

/**
 * POST /api/reserve — reservation quiz submission endpoint.
 *
 * LAUNCH-1 STUB. This endpoint accepts the full reservation payload shape from
 * the /reserve quiz, validates the required fields, and logs the lead to the
 * server console so the behavior is verifiable end-to-end without a backend.
 *
 * It intentionally does NOT persist to Supabase yet — per
 * docs/implementation-plan.md §1.1 we wanted the event-first quiz shipped P0
 * even though the Supabase client hasn't been wired up. When Milestone 5 adds
 * Supabase (Open Question #5 in CLAUDE.md), this handler becomes a drop-in:
 *
 *   1. Replace the console.log with a `supabase.from("reservations").insert(...)`
 *   2. Add a second mutation to the `leads` table keyed to the event slug
 *   3. Optionally forward to a webhook / email for the VIP host team
 *
 * The payload shape is stable — the `event` field (slug from /lib/events) is
 * the primary identifier for each lead, with `night` retained as a secondary
 * filter so the Wednesday/Saturday split continues to work when events are
 * unavailable or when the user picks "other date".
 *
 * The endpoint returns `{ ok: true }` on success so the client can advance
 * to the VIP host SLA success state and fire the Meta Pixel `Lead` event.
 * It never leaks server errors to the browser — a 500 response is a generic
 * "Something went wrong" so the client can show a retry prompt without
 * exposing internals.
 */

/** Payload shape submitted by the /reserve quiz. */
type ReservePayload = {
  /** Slug of the selected upcoming event, or null for "other date" */
  eventSlug: string | null;
  /** The flagship night this reservation targets */
  night: "wednesday" | "saturday" | "other";
  /** Free-form date string captured when the user picks "other date" */
  preferredDate: string | null;
  /** Party size label ("2", "4", "6", "8", "10+", "Ask") */
  partySize: string;
  /** Section label ("main" | "vip" | "streamer" | "private") */
  section: string;
  /** Budget range label */
  budget: string;
  /** Contact details */
  name: string;
  phone: string;
  email: string;
  instagram: string | null;
};

export async function POST(request: Request) {
  let payload: ReservePayload;
  try {
    payload = (await request.json()) as ReservePayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // Required-field validation at the system boundary. Keep this minimal — the
  // client already enforces required inputs; this is the server-side safety
  // net against direct API calls or client-side bypass.
  const requiredMissing: string[] = [];
  if (!payload.name) requiredMissing.push("name");
  if (!payload.phone) requiredMissing.push("phone");
  if (!payload.email) requiredMissing.push("email");
  if (!payload.partySize) requiredMissing.push("partySize");
  if (!payload.section) requiredMissing.push("section");
  if (!payload.budget) requiredMissing.push("budget");
  if (!payload.night) requiredMissing.push("night");

  if (requiredMissing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${requiredMissing.join(", ")}` },
      { status: 400 },
    );
  }

  // TODO(milestone-5): replace this log with a Supabase insert:
  //
  //   const { error } = await supabaseAdmin
  //     .from("reservations")
  //     .insert({
  //       event_slug: payload.eventSlug,
  //       night: payload.night,
  //       preferred_date: payload.preferredDate,
  //       party_size: payload.partySize,
  //       section: payload.section,
  //       budget: payload.budget,
  //       name: payload.name,
  //       phone: payload.phone,
  //       email: payload.email,
  //       instagram: payload.instagram,
  //       source: "web_quiz",
  //     });
  //   if (error) throw error;
  //
  // Also optionally forward to a VIP host webhook so Slack or the door team
  // gets notified within the 30-minute SLA window surfaced on the success state.
  // eslint-disable-next-line no-console
  console.log("[reserve] new lead", {
    ts: new Date().toISOString(),
    ...payload,
  });

  return NextResponse.json({ ok: true });
}
