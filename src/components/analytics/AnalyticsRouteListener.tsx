"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { trackPageview } from "@/lib/analytics";

/**
 * Client-side route change listener.
 *
 * App Router navigations don't reload the document, so neither GA4 nor the
 * Meta Pixel will fire a pageview on <Link> clicks without a manual trigger.
 * This component subscribes to `usePathname` + `useSearchParams` and fires
 * `trackPageview` whenever the URL changes.
 *
 * Wrapped in <Suspense> because `useSearchParams` forces the component into
 * the dynamic read boundary in Next.js 15+/16 and will break SSG otherwise.
 */
export function AnalyticsRouteListener() {
  return (
    <Suspense fallback={null}>
      <AnalyticsRouteListenerInner />
    </Suspense>
  );
}

function AnalyticsRouteListenerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    trackPageview(fullPath);
  }, [pathname, searchParams]);

  return null;
}
