"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";
import { PathwayPopup } from "./PathwayPopup";

/**
 * Public-site chrome. The portal renders its own shell, so header, footer,
 * floating CTA and the pathway popup are all suppressed under /portal and on
 * the authentication screens — a signed-in workspace should not carry
 * marketing furniture.
 *
 * `/demo` belongs on this list for the same reason and was missed: the role
 * preview draws its own sidebar and header, so without it every preview screen
 * rendered the marketing header and footer wrapped around a portal shell, with
 * the consultation popup opening on top of the dashboard.
 */
const BARE_PREFIXES = [
  "/portal",
  "/demo",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) return <main id="main">{children}</main>;

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingCTA />
      <PathwayPopup pathname={pathname} />
    </>
  );
}
