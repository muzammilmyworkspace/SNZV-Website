import type { Metadata } from "next";
import { HeroMeridian } from "@/components/sections/HeroMeridian";
import { Countries } from "@/components/sections/Countries";
import { PortalShowcase } from "@/components/sections/PortalShowcase";
import { StudentJourney } from "@/components/sections/StudentJourney";
import { BusinessJourney } from "@/components/sections/BusinessJourney";
import { Dream } from "@/components/sections/Dream";
import { Partners } from "@/components/sections/Partners";
import { Journeys } from "@/components/sections/Journeys";
import { Pain } from "@/components/sections/Pain";
import { Method } from "@/components/sections/Method";
import { Atlas } from "@/components/sections/Atlas";
import { StatsBand } from "@/components/sections/StatsBand";
import { homeStats } from "@/data/stats";
import { StudyDestinations } from "@/components/sections/Study";
import { Why, Insights, Final } from "@/components/sections/Closing";
import { Reviews } from "@/components/sections/Reviews";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { Meridian } from "@/components/visuals/Meridian";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SnZ Ventures — Your Ambition Has No Borders",
  description:
    "Vilnius-based advisory moving students, professionals and founders into Europe: company formation, fintech licensing, recruitment and relocation.",
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
  { id: "why", index: "07", label: "Why SnZ" },
  { id: "proof", index: "08", label: "Proof" },
  { id: "insights", index: "09", label: "Insights" },
];

export default function HomePage() {
  return (
    <>
      <Meridian chapters={CHAPTERS} />
      <HeroMeridian />

      {/*
        THE FLAGS, IMMEDIATELY AFTER THE HERO.

        The hero makes a promise about borders. This names them — and a student
        scanning for their own destination finds it in the first screen after
        the fold rather than six sections down. Deliberately not a meridian
        chapter, for the same reason as Partners below.
      */}
      <Countries />

      {/*
        Straight after the hero, and deliberately NOT a meridian chapter — see
        the note in Partners. Somebody who has just read what this firm claims
        to do gets the names it can be checked against, before the argument
        starts.
      */}
      <Partners variant="home" />

      {/*
        THE NUMBERS, WITH THE THINGS THEY COUNT STILL ON SCREEN.

        This sat after Method, two thirds down. Moved up because every figure
        in it is derived from the two sections directly above — partnerships
        from Partners, destinations from Countries — so a reader can check the
        count against the list they have just scrolled past rather than taking
        it on trust six sections later. That is the whole argument of
        data/stats.ts, and it only works if the two are adjacent.

        `tone="light"` rather than "soft": Partners above is paper and
        StudentJourney below is deep, so this has to break the run without
        matching either neighbour.
      */}
      <StatsBand
        stats={homeStats}
        tone="paper"
        eyebrow="By the numbers"
        cta={{ href: "/about", label: "How we work" }}
      />

      <StudentJourney />

      {/*
        Straight after the journey that keeps referring to it. The portal is
        stage 02 of that story, so the thing itself follows the story rather
        than being introduced cold further down the page.
      */}
      <PortalShowcase />

      <Dream />
      <Journeys />
      <Pain />
      <Method />
      <BusinessJourney />

      <Atlas />
      {/*
        Study destinations follow the atlas deliberately: the atlas answers
        "where does SnZ operate", this answers "where could I actually study".
        Same card, same data and same section language as /study-abroad, so the
        two pages read as one product rather than two.
      */}
      <StudyDestinations variant="home" />
      <Why />
      {/*
        Named students before anonymous praise. Renders nothing until there are
        verified stories — see the component. Reviews below it are real Google
        reviews and stand on their own in the meantime.
      */}
      <SuccessStories />
      <Reviews />
      <Insights />
      <Final />
    </>
  );
}
