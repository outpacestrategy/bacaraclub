/**
 * Global type declarations for third-party analytics SDKs.
 *
 * These are injected into `window` by the scripts loaded in
 * src/components/analytics/*. Declaring them here lets TypeScript call
 * `window.gtag(...)` and `window.fbq(...)` from helper modules without
 * `@ts-ignore` / `any` escapes.
 */

declare global {
  interface Window {
    /** Google Analytics 4 command queue (loaded by GoogleAnalytics.tsx). */
    gtag?: (
      command: "config" | "event" | "set" | "js" | "consent",
      targetOrEventName: string | Date,
      params?: Record<string, unknown>,
    ) => void;

    /** Google Tag Manager / GA4 data layer. */
    dataLayer?: unknown[];

    /** Meta (Facebook) Pixel command queue (loaded by MetaPixel.tsx). */
    fbq?: (
      command: "init" | "track" | "trackCustom" | "consent",
      eventNameOrPixelId: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export {};
