import type { Metadata } from "next";
import "./horizon.css";
import "./journey.css";
import {
  HzHero,
  HzMarquee,
  HzPaths,
  HzRoutes,
  HzDestinations,
  HzWhy,
  HzInsights,
  HzCta,
} from "@/components/home/Horizon";
import { Journey } from "@/components/bp/journey/Journey";
import { MotionRoot } from "@/components/bp/MotionRoot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SnZ Ventures — Your Ambition Has No Borders",
  description:
    "Vilnius-based advisory moving students, professionals and founders into Europe: study abroad, careers with named employers, company formation and relocation.",
  path: "/",
});

/**
 * HORIZON (October 2026). The MERIDIAN homepage it replaces is in git history
 * (commit fcae024); its section components are still in components/sections
 * because the inner pages use them.
 */
export default function HomePage() {
  return (
    <div className="hz">
      <HzHero />
      <HzMarquee />
      <HzPaths />
      <HzRoutes />
      {/* The seven-step scroll story from the Boarding Pass site (10288af), on its night sky. */}
      <MotionRoot>
        <div className="bp hz-journey">
          <Journey />
        </div>
      </MotionRoot>
      <HzDestinations />
      <HzWhy />
      <HzInsights />
      <HzCta />
    </div>
  );
}
