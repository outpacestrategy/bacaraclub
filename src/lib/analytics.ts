/**
 * Client-side analytics helpers for Bacara Club.
 *
 * Thin wrappers around `window.gtag` (GA4) and `window.fbq` (Meta Pixel) that
 * safely no-op when the underlying script hasn't loaded — whether because the
 * env var is unset, the user is on a preview deploy, or the script is still
 * bootstrapping on first paint. Every helper is idempotent and SSR-safe.
 *
 * Event naming follows docs/meta-ads-strategy.md:
 *
 *   MICRO-CONVERSIONS              → GA4 event name          | Pixel event
 *   -----------------------------------------------------------------------
 *   Reserve page viewed             → view_reserve             | ViewContent
 *   Reserve quiz step 1 submitted   → reserve_step_1           | InitiateCheckout
 *   Reserve quiz step 2 submitted   → reserve_step_2           | AddToCart
 *   Reserve quiz submitted          → reserve_submit           | Lead
 *   Guest list form submitted       → guestlist_submit         | Lead
 *   Streamer application submitted  → streamer_apply           | CompleteRegistration
 *   Private event inquiry submitted → private_inquiry          | Lead
 *   Phone tap                       → tap_phone                | Contact
 *   Email tap                       → tap_email                | Contact
 *   Instagram tap                   → tap_instagram            | Lead
 *
 * Usage from a client component:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("reserve_submit", { night: "wednesday", party_size: 6 });
 */

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * Fire a single event to both GA4 and Meta Pixel in one call.
 *
 * `gaName` is the GA4 event name (snake_case per GA4 conventions).
 * `pixelName` is the Meta standard event name (PascalCase). Pass `null` to
 * skip the pixel side (e.g. for GA-only debug events).
 */
export function trackConversion(
  gaName: string,
  pixelName: string | null,
  params: EventParams = {},
) {
  trackGAEvent(gaName, params);
  if (pixelName) trackPixelEvent(pixelName, params);
}

/** GA4-only event. Safely no-ops if gtag isn't loaded. */
export function trackGAEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Meta Pixel-only event. Safely no-ops if fbq isn't loaded. */
export function trackPixelEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", name, params);
}

/**
 * Client-side pageview — fire this from a pathname listener on App Router
 * transitions. Both GA4 and Meta Pixel need explicit pageview calls when the
 * server doesn't reload the document (i.e., all next/link navigations).
 *
 * Typical usage (pseudocode inside a top-level client component):
 *
 *   const pathname = usePathname();
 *   useEffect(() => { trackPageview(pathname); }, [pathname]);
 */
export function trackPageview(path: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", { page_path: path });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}
