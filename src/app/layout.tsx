import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";

import "./globals.css";
import { AnalyticsRouteListener } from "@/components/analytics/AnalyticsRouteListener";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { SITE } from "@/lib/constants";

/*
 * Display face: Bodoni Moda — a free, open-source high-contrast condensed serif that
 * captures the fashion-editorial "Vogue" aesthetic the client asked for while staying
 * fully commercial-licensable (SIL Open Font License). See src/styles/fonts/README.md
 * for the path to swap in a purchased Vogue.ttf later via next/font/local.
 *
 * Bodoni Moda is a variable font — we load it across the full weight range so that
 * headings can use 500–700 while body accents can drop to 400 without shipping multiple
 * static files.
 *
 * Body face: Inter, unchanged.
 * Both loaded via next/font/google — zero external requests at runtime and zero FOIT.
 */
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * metadataBase is mandatory per CLAUDE.md so OG images, canonical URLs, and RSS links
 * resolve correctly in share previews. Fallback hostname is the planned production domain.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Miami Beach nightclub",
    "streaming nightclub",
    "Wednesday night Miami",
    "Saturday night Miami Beach",
    "reserve a table Miami",
    "creator-friendly club Miami",
    "Bacara Club",
  ],
  authors: [{ name: "Outpace Strategy Group", url: "https://outpacestrategygroup.com" }],
  creator: "Outpace Strategy Group",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE.url,
  },
  /*
   * Site verification — each host gets a tiny meta tag proving ownership of the
   * domain. Values come from environment variables set in the Netlify UI so
   * that the source tree never contains host-specific tokens, and so that
   * preview deploys don't leak verification into Google's index.
   *
   *  - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION → Google Search Console
   *    (Alternative: drop `google<hash>.html` into /public/. This meta-tag
   *    approach is cleaner for App Router and lives alongside the other tags.)
   *  - NEXT_PUBLIC_FB_DOMAIN_VERIFICATION → Meta Business domain verification
   *    (required so the pixel can fire on :hover/click without warnings and
   *     so iOS 14+ aggregated events attribute correctly).
   */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION
        ? {
            "facebook-domain-verification":
              process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION,
          }
        : {}),
    },
  },
  // No explicit `icons` block — Next.js App Router auto-detects `src/app/icon.png`
  // and `src/app/apple-icon.png` and wires the correct <link> tags into the document
  // head at build time. See scripts/generate-icons.mjs for how those files are built.
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {/*
         * Analytics — both components render nothing when their env vars are
         * missing, so preview deploys and local dev stay beacon-free until
         * the real IDs are set in the Netlify dashboard. The route listener
         * handles SPA-style pageviews on every <Link> navigation.
         */}
        <GoogleAnalytics />
        <MetaPixel />
        <AnalyticsRouteListener />

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/*
         * Mobile sticky Reserve/Guest List bar — sub-sm only, self-hides on
         * /reserve. P0 per docs/site-plan.md + implementation-plan §2.6.
         */}
        <MobileStickyCTA />
      </body>
    </html>
  );
}
