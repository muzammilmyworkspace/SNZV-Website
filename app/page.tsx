import type { Metadata } from "next";
import { HeroMeridian } from "@/components/sections/HeroMeridian";
import { Dream } from "@/components/sections/Dream";
import { Journeys } from "@/components/sections/Journeys";
import { Pain } from "@/components/sections/Pain";
import { Method } from "@/components/sections/Method";
import { Atlas } from "@/components/sections/Atlas";
import { StatsBand } from "@/components/sections/StatsBand";
import { PortalPreview } from "@/components/sections/PortalPreview";
import { homeStats } from "@/data/stats";
import { StudyDestinations } from "@/components/sections/Study";
import { Why, Insights, Final } from "@/components/sections/Closing";
import { Reviews } from "@/components/sections/Reviews";
import { Meridian } from "@/components/visuals/Meridian";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SnZ Ventures — Your Ambition Has No Borders",
  description:
    "Vilnius-based advisory moving students, professionals and founders into Europe. Company formation, fintech licensing, international recruitment and investor relocation across all 27 EU member states.",
  path: "/",
});

/** The chapters the meridian rail tracks as you descend. */
const CHAPTERS = [
  { id: "dream", index: "01", label: "The dream" },
  { id: "journeys", index: "02", label: "Three journeys" },
  { id: "pain", index: "03", label: "The reality" },
  { id: "method", index: "04", label: "The method" },
  { id: "atlas", index: "05", label: "The atlas" },
  { id: "study-destinations", index: "06", label: "Study destinations" },
  { id: "portal", index: "07", label: "The portal" },
  { id: "why", index: "08", label: "Why SnZ" },
  { id: "proof", index: "09", label: "Proof" },
  { id: "insights", index: "10", label: "Insights" },
];

export default function HomePage() {
  return (
    <>
      <Meridian chapters={CHAPTERS} />
      <HeroMeridian />
      <Dream />
      <Journeys />
      <Pain />
      <Method />
      <StatsBand stats={homeStats} tone="soft" eyebrow="By the numbers" />
      <Atlas />
      {/*
        Study destinations follow the atlas deliberately: the atlas answers
        "where does SnZ operate", this answers "where could I actually study".
        Same card, same data and same section language as /study-abroad, so the
        two pages read as one product rather than two.
      */}
      <StudyDestinations variant="home" />
      <PortalPreview audience="general" tone="paper" index="07" id="portal" />
      <Why />
      <Reviews />
      <Insights />
      <Final />
    </>
  );
}
