import Script from "next/script";

/**
 * Meta (Facebook) Pixel loader.
 *
 * Per docs/meta-ads-strategy.md, the pixel is mandatory for the ad campaigns
 * pointed at /wednesdays, /saturdays, and /reserve — without it, Meta cannot
 * optimize delivery, run retargeting, or fire conversion events on the Reserve
 * quiz completion. Per CLAUDE.md hard rule: "Never run Meta ads at a page
 * that isn't pixel-verified."
 *
 * Renders nothing unless `NEXT_PUBLIC_META_PIXEL_ID` is set, so previews and
 * local dev stay clean.
 *
 * Initial `PageView` fires once on load. Subsequent client-side route changes
 * are NOT auto-captured by the standard snippet — fire them explicitly from a
 * small client-side pathname listener when the conversion funnel lands in
 * Milestone 5/8. See src/lib/analytics.ts's `trackPixelPageview()` helper.
 *
 * Conversion events (Lead, CompleteRegistration, ViewContent, Schedule) are
 * fired from their respective UI components via the helpers in
 * src/lib/analytics.ts.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/*
       * Noscript fallback — fires a 1x1 tracking pixel for clients with JS
       * disabled. Meta recommends shipping this alongside the main snippet so
       * attribution works for the tiny slice of traffic that never runs the
       * fbq bootstrap.
       */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
