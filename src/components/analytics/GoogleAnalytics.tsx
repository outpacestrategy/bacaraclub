import Script from "next/script";

/**
 * Google Analytics 4 tag loader.
 *
 * Renders nothing unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (G-XXXXXXXXXX),
 * so previews, Vercel/Netlify preview deploys, and local dev stay clean of
 * analytics beacons until the production env var is configured in the host UI.
 *
 * Loading strategy:
 *  - `afterInteractive` keeps gtag out of the critical path. GA4 auto-measures
 *    the initial pageview from its own init call, so we don't need a manual
 *    page_view push here.
 *  - `anonymize_ip: true` is set for basic privacy hygiene. Full consent-mode
 *    integration can land later without touching this file — add a consent
 *    gate component that renders <GoogleAnalytics /> only after opt-in.
 *
 * Route change tracking: App Router transitions don't reload the page, so GA4
 * needs explicit page_view events on navigation. See src/lib/analytics.ts's
 * `trackPageview()` helper and wire it into a small client-side pathname
 * listener when the first conversion flow ships (Milestone 8).
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
