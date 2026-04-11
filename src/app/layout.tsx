import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
