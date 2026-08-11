import type { Metadata } from "next";
import { PillarPage } from "@/components/sections/PillarPage";
import { pillars } from "@/data/pillars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Study Abroad — Education That Leads to Work",
  description:
    "Choose a course against the labour market, not a brochure. SnZ Ventures advises students on education and career pathways into Europe, with honest guidance on funding and post-study rights.",
  path: "/study-abroad",
});

export default function StudyAbroadPage() {
  return <PillarPage pillar={pillars.study} />;
}
