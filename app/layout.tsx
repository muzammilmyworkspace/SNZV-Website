import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./boarding.css";

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

/**
 * The Boarding Pass faces. Space Grotesk carries the display type — it has the
 * engineered, slightly mechanical character of airport signage without being a
 * novelty face. JetBrains Mono is for "ticket data" only: flight codes, step
 * numbers, the departure board. Body copy stays on Jakarta, which is the most
 * readable of the three at paragraph length.
 */
const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
 default: "SnZ Ventures | Your Ambition Has No Borders",
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
  // Matches the night sky, the default theme's page ground.
  themeColor: "#070B1A",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${space.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Theme, applied BEFORE first paint.

          This has to be a blocking inline script in <head>. Setting the theme
          from a React effect would paint the server's markup first and repaint
          on hydration — the flash-of-wrong-theme. With two palettes this far
          apart, that flash is a full inversion of the page, which is far worse
          than a moment of unstyled text.

          DARK (night) is the default: it is the Boarding Pass art direction
          the site is designed in. Day is one click away on the header toggle,
          and the choice is remembered.
          `suppressHydrationWarning` on <html> is required because this mutates
          the element before React sees it.
        */}
        {/*
          A raw <script>, deliberately, NOT next/script.

          next/script with `beforeInteractive` was tried: in the App Router an
          inline script with that strategy is queued (`self.__next_s`) and run
          by the Next runtime after its chunks load. That is after first paint,
          so the page flashed the wrong theme and `npm run audit:theme`
          ("choice persists across reload") failed.

          The raw script runs during HTML parsing, and React does not warn on a
          normal load: the warning ("Encountered a script tag while rendering
          React component") only fires when React CREATES the element in the
          browser rather than hydrating it. That happens in two cases:
            - a hydration failure elsewhere on the page, which makes React
              throw the server tree away and client-render everything,
              including this script. Browser extensions that inject nodes
              before hydration (LastPass, on the homepage form) were the
              cause; see the note in components/bp/FinalCall.tsx.
            - Fast Refresh after editing this file in dev.
          So if this warning reappears, look for a hydration error first.
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
