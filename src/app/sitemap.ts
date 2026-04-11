import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";

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
 *
 * When Milestone 5 adds dynamic /events/[slug] pages, extend this function to query the
 * events data source and map each slug into an entry.
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

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
