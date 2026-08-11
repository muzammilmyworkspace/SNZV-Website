import type { Metadata } from "next";
import { HeroMeridian } from "@/components/sections/HeroMeridian";
import { Dream } from "@/components/sections/Dream";
import { Journeys } from "@/components/sections/Journeys";
import { Pain } from "@/components/sections/Pain";
import { Method } from "@/components/sections/Method";
import { Atlas } from "@/components/sections/Atlas";
import { Why, Proof, Insights, Final } from "@/components/sections/Closing";
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
  { id: "why", index: "06", label: "Why SnZ" },
  { id: "proof", index: "07", label: "Proof" },
  { id: "insights", index: "08", label: "Insights" },
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
      <Atlas />
      <Why />
      <Proof />
      <Insights />
      <Final />
    </>
  );
}
