import type { Metadata } from "next";

import { MotionRoot } from "@/components/bp/MotionRoot";
import { LineField } from "@/components/bp/LineField";
import { Hero } from "@/components/bp/Hero";
import { TrustTicker } from "@/components/bp/TrustTicker";
import { Spotlight } from "@/components/bp/Spotlight";
import { DepartureBoard } from "@/components/bp/DepartureBoard";
import { NowBoarding } from "@/components/bp/NowBoarding";
import { TravelTogether } from "@/components/bp/TravelTogether";
import { Journey } from "@/components/bp/journey/Journey";
import { PortalSection } from "@/components/bp/PortalSection";
import { WhySnz } from "@/components/bp/WhySnz";
import { Stories } from "@/components/bp/Stories";
import { FinalCall } from "@/components/bp/FinalCall";
import { homeStats } from "@/data/stats";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
 title: "SnZ Ventures | From one form to your first flight abroad",
  description:
 "SnZ Ventures takes students from the first conversation to the departure gate: shortlist, applications, offer, visa, fees and flight, tracked live in your own portal.",
  path: "/",
});

/**
 * THE HOMEPAGE — "Boarding Pass".
 *
 * The whole page is one journey and scrolling is the flight: the visitor
 * arrives as an applicant and leaves as a passenger. Nothing from the previous
 * homepage survives; the plumbing it stood on (data/, the enquiry route, the
 * analytics layer, the verified-figure rules) does.
 *
 * THE ORDER IS THE STORY:
 *   1  Hero          a form becomes a flight; the portal running behind it
 *      Ticker        who we are, in verified facts, at a glance
 *   2  Board         the numbers — derived, never asserted
 *   3  Now boarding  where students fly, and the universities we work with
 *   4  Journey       seven scroll-driven scenes, first message to take-off
 *   5  Portal        the thing a student is actually given
 *   6  Why SnZ       four honest statements
 *   7  Stories       real reviews only — or a pointer to them
 *   8  Final call    the consultation form, as a boarding pass
 *
 * The page sits on `.bp` — always night, in both themes. See app/boarding.css.
 */
export default function HomePage() {
  return (
    <MotionRoot>
    <div className="bp relative isolate">
      <LineField />
      <Spotlight />
      <Hero />
      <TrustTicker />
      <NowBoarding />
      <DepartureBoard stats={homeStats} />
      <TravelTogether />
      <Journey />
      <PortalSection />
      <WhySnz />
      <Stories />
      <FinalCall />
    </div>
    </MotionRoot>
  );
}
