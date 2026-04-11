import { NightClubSchema } from "@/components/seo/NightClubSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { Experience3DCarousel } from "@/components/sections/Experience3DCarousel";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { OpeningHours } from "@/components/sections/OpeningHours";
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
 *   3. Meet the Streamers      — WebGL curved gallery (OGL)
 *   4. Opening Hours           — 7-day grid, today highlighted
 *   5. Experience              — CSS 3D ring gallery
 *   6. FAQ                     — accordion + FAQPage JSON-LD (the GEO lever)
 *
 * The FAQ section lives on the home page specifically for the brand-level query
 * cluster ("Bacara Club", "streaming nightclub Miami"). When the dedicated /faq page
 * is built (Milestone 6), page-specific subsets will also live on /wednesdays,
 * /saturdays, and /streamers — see docs/seo-geo-strategy.md.
 */
export default function Home() {
  return (
    <>
      {/* JSON-LD schemas — NightClub for Local Pack, Organization for the
          Knowledge Panel, WebSite for sitelinks search */}
      <NightClubSchema />
      <OrganizationSchema />
      <WebSiteSchema />

      <Hero />
      <UpcomingEvents />
      <Streamers />
      <OpeningHours />
      <Experience3DCarousel />
      <FAQ />
    </>
  );
}
