import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import { JsonLd } from "@/components/ui/Editorial";
import {
  organizationSchema,
  websiteSchema,
  SITE_URL,
  DEFAULT_DESCRIPTION,
} from "@/lib/seo";
import { company } from "@/data/company";

/**
 * Type pairing: a high-contrast display serif carries the emotional register,
 * a neutral grotesk carries every structural and functional surface. The serif
 * never appears in navigation, forms or data — only where the brand speaks.
 */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SnZ Ventures — Your Ambition Has No Borders",
    template: "%s | SnZ Ventures",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: company.name,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  formatDetection: { telephone: true, address: false, email: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_GB",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#03060D",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${inter.variable}`}>
      <head>
        {/*
          Reveal animations render as inline opacity:0 in the SSR HTML and are
          cleared on hydration. If scripting is unavailable, restore them so no
          content is ever invisible.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-void antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingCTA />

        <AnalyticsScripts />
      </body>
    </html>
  );
}
