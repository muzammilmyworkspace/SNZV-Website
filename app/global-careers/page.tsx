import type { Metadata } from "next";
import { BpPillar } from "@/components/bp/pillar/BpPillar";
import { pillars } from "@/data/pillars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Global Careers | International Jobs Across Europe",
  description:
    "Real roles with named European employers, honest eligibility screening and relocation support, recruiting from South Asia and the Middle East.",
  path: "/global-careers",
});

export default function GlobalCareersPage() {
  return <BpPillar pillar={pillars.careers} />;
}
