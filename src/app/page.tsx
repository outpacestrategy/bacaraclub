import { NightClubSchema } from "@/components/seo/NightClubSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { Experience3DCarousel } from "@/components/sections/Experience3DCarousel";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { OpeningHours } from "@/components/sections/OpeningHours";
import { Stats } from "@/components/sections/Stats";
import { Streamers } from "@/components/sections/Streamers";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";

/**
 * Home page section order.
 *
 * Roughly mirrors monaclub.miami's proven IA so a reviewer comparing the two sees the
 * same flow — but every visual and copy choice is Bacara's own.
 *
 *   1. Hero                    — autoplay video background + bonded CTAs
 *   2. Upcoming Events         — snap-scroll card carousel
 *   3. Stats                   — animated counters (Tables / Sq Ft / Capacity)
 *   4. Meet the Streamers      — WebGL curved gallery (OGL)
 *   5. Opening Hours           — 7-day grid, today highlighted
 *   6. Experience              — CSS 3D ring gallery
 *   7. FAQ                     — accordion + FAQPage JSON-LD (the GEO lever)
 *
 * The FAQ section lives on the home page specifically for the brand-level query
 * cluster ("Bacara Club", "streaming nightclub Miami"). When the dedicated /faq page
 * is built (Milestone 6), page-specific subsets will also live on /wednesdays,
 * /saturdays, and /streamers — see docs/seo-geo-strategy.md.
 */
export default function Home() {
  return (
    <>
      {/* JSON-LD schemas — NightClub for Google Local Pack, WebSite for sitelinks search */}
      <NightClubSchema />
      <WebSiteSchema />

      <Hero />
      <UpcomingEvents />
      <Stats />
      <Streamers />
      <OpeningHours />
      <Experience3DCarousel />
      <FAQ />
    </>
  );
}
