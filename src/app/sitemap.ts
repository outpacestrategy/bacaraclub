import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";
import { UPCOMING_EVENTS } from "@/lib/events";

/**
 * Dynamic sitemap.
 *
 * Covers every public route built in this pass. Priority + changeFrequency follow
 * the SEO strategy in docs/seo-geo-strategy.md:
 *
 *   - Home, Wednesdays, Saturdays, Reserve = highest priority (1.0 / 0.9), weekly refresh
 *     (Wednesdays and Saturdays are the ads workhorses, Reserve is the conversion)
 *   - Events, Streamers, Private, Contact, About = mid (0.8), monthly
 *   - FAQ, Gallery, Guestlist = lower (0.6-0.7)
 *   - /events/[slug] — one entry per upcoming event, daily refresh so Google
 *     picks up lineup changes. Per docs/implementation-plan.md §3.1 each
 *     canonical event page also emits Event JSON-LD for rich results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url.replace(/\/$/, "");

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/wednesdays", changeFrequency: "weekly", priority: 0.9 },
    { path: "/saturdays", changeFrequency: "weekly", priority: 0.9 },
    { path: "/reserve", changeFrequency: "weekly", priority: 0.9 },
    { path: "/events", changeFrequency: "weekly", priority: 0.8 },
    { path: "/streamers", changeFrequency: "monthly", priority: 0.8 },
    { path: "/private", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
    { path: "/guestlist", changeFrequency: "weekly", priority: 0.7 },
  ];

  const staticEntries = routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Per-event canonical pages. lastModified = now so Googlebot revisits daily
  // as the /events/[slug] pages are refreshed in lockstep with UPCOMING_EVENTS.
  const eventEntries: MetadataRoute.Sitemap = UPCOMING_EVENTS.map((event) => ({
    url: `${base}/events/${event.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...eventEntries];
}
