import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { SiteChrome } from "@/components/layout/SiteChrome";
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
 * One family. The previous display serif read decorative rather than
 * international; weight, tracking and scale carry the hierarchy instead.
 * A single variable family also halves the font payload.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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
  themeColor: "#0A1730",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
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
      <body className="tone-deep min-h-screen antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <SiteChrome>{children}</SiteChrome>

        <AnalyticsScripts />
      </body>
    </html>
  );
}
