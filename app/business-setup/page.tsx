import type { Metadata } from "next";
import { PillarPage } from "@/components/sections/PillarPage";
import { pillars } from "@/data/pillars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Business Setup — Company Formation & Expansion in the EU",
  description:
    "Form a Lithuanian company that actually operates: UAB/MB incorporation, VAT and EORI, accounting, fintech licensing and investor relocation — coordinated through one point of contact.",
  path: "/business-setup",
});

export default function BusinessSetupPage() {
  return <PillarPage pillar={pillars.business} />;
}
