import type { Metadata } from "next";
import "./horizon.css";
import {
  HzHero,
  HzMarquee,
  HzPaths,
  HzPartners,
  HzJourney,
  HzDestinations,
  HzWhy,
  HzInsights,
  HzCta,
} from "@/components/home/Horizon";
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
      <HzPartners />
      <HzJourney />
      <HzDestinations />
      <HzWhy />
      <HzInsights />
      <HzCta />
    </div>
  );
}
