import type { Metadata } from "next";
import { BpPillar } from "@/components/bp/pillar/BpPillar";
import { pillars } from "@/data/pillars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Business Setup | EU Company Formation",
  description:
    "Form a Lithuanian company that actually operates: UAB/MB incorporation, VAT and EORI, accounting, fintech licensing and investor relocation.",
  path: "/business-setup",
});

export default function BusinessSetupPage() {
  return <BpPillar pillar={pillars.business} />;
}
