import type { Metadata } from "next";
import { PillarPage } from "@/components/sections/PillarPage";
import { pillars } from "@/data/pillars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Global Careers — International Jobs Across Europe",
  description:
    "Real roles with named European employers, honest eligibility screening and relocation support. SnZ Ventures recruits into EU SMEs and regulated firms from South Asia and the Middle East.",
  path: "/global-careers",
});

export default function GlobalCareersPage() {
  return <PillarPage pillar={pillars.careers} />;
}
