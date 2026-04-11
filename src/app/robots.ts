import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";

/**
 * robots.txt generator.
 *
 * Rules:
 *  - Allow all public pages by default
 *  - Disallow /admin (when the CRM lands in Milestone 9)
 *  - Disallow /api (any future API routes, to avoid crawl noise)
 *  - Point crawlers at the sitemap for full discovery
 *
 * Next.js serves this from /robots.txt automatically when `src/app/robots.ts` exports
 * a default function.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
