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
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        {/*
          Theme, applied BEFORE first paint.

          This has to be a blocking inline script in <head>. Setting the theme
          from a React effect would paint the dark default first and repaint to
          light on hydration — the flash-of-wrong-theme, which is far uglier on
          a site this dark than a moment of unstyled text.

          Dark stays the default: it is the designed art direction, so an
          unknown visitor gets it and only a stored choice moves them off it.
          `suppressHydrationWarning` on <html> is required because this mutates
          the element before React sees it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('snz-theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        {/*
          Reveal animations render as inline opacity:0 in the SSR HTML and are
          cleared on hydration. If scripting is unavailable, restore them so no
          content is ever invisible.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      {/*
        `suppressHydrationWarning` because extensions mutate <body> before
        React hydrates. Grammarly is the usual culprit — it stamps
        `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` on the body
        element, React compares that against its own server HTML and reports a
        mismatch the app did not cause and cannot prevent.
        This suppresses attribute diffing on this element ONLY; children are
        still hydrated and checked normally, so a real mismatch inside the page
        still surfaces.
      */}
      <body
        className="tone-deep min-h-screen antialiased"
        suppressHydrationWarning
      >
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
