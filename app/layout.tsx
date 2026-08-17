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
  // Matches the light theme's page ground, since that is now the default.
  themeColor: "#FAFBFD",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
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
          from a React effect would paint the server's markup first and repaint
          on hydration — the flash-of-wrong-theme. With two palettes this far
          apart, that flash is a full inversion of the page, which is far worse
          than a moment of unstyled text.

          LIGHT is the default. The dark art direction still exists in full
          and is one click away, but an unknown visitor now lands on the light
          theme — which is the brand's own student-site palette and the safer
          first impression for a consultancy.
          `suppressHydrationWarning` on <html> is required because this mutates
          the element before React sees it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('snz-theme');if(t!=='light'&&t!=='dark')t='light';document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
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
