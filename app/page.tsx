import type { Metadata } from "next";

import { Meridian } from "@/components/visuals/Meridian";
import { Hero } from "@/components/sections/Hero";
import { Countries } from "@/components/sections/Countries";
import { Alliances } from "@/components/sections/Alliances";
import { StudentJourney } from "@/components/sections/StudentJourney";
import { PortalShowcase } from "@/components/sections/PortalShowcase";
import { BusinessJourney } from "@/components/sections/BusinessJourney";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { Voices } from "@/components/sections/Voices";
import { Invitation } from "@/components/sections/Invitation";
import { Numbers } from "@/components/sections/Numbers";
import { homeStats } from "@/data/stats";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SnZ Ventures — Your Ambition Has No Borders",
  description:
    "Vilnius-based advisory moving students, professionals and founders into Europe: company formation, fintech licensing, recruitment and relocation.",
  path: "/",
});

/**
 * THE HOMEPAGE.
 *
 * REBUILT, not extended. The previous version was ten editorial sections
 * — dream, three journeys, the reality, the method, the atlas, destinations,
 * why us, proof, insights, a closing plate — nineteen thousand pixels of
 * argument, four photographic plates, and no moment where a visitor saw the
 * thing they would actually be given. It was a brochure.
 *
 * This is a demonstration. One line is struck across the hero and then
 * threaded through the page: it becomes the student's flight, it becomes the
 * structure a company is built from, and it lands on the closing. Between
 * those, the page shows the product rather than describing it.
 *
 * WHAT WAS CUT, and why it is not a loss:
 *
 *   Dream, Journeys, Pain, Method   Four sections making the same argument in
 *                                   four registers. The three pathway pages
 *                                   make it properly, and the two drawn
 *                                   journeys here make it concretely.
 *   Atlas, StudyDestinations        Both answered "where". Countries answers
 *                                   it in the first screen after the fold,
 *                                   with the flags a student scans for.
 *   Why, Insights                   A list of virtues and a blog roll. Both
 *                                   live on /about and /insights, both are
 *                                   reachable from the footer, and neither
 *                                   was what somebody on the homepage came
 *                                   for.
 *   Final                           A fourth photographic plate. Invitation
 *                                   closes the line instead.
 *
 * Dream, Journeys, Pain, Method, Atlas, HeroMeridian and Closing had no other
 * caller once this page stopped importing them, so they are deleted rather
 * than left as seven files that compile, ship in no bundle and mislead the
 * next person who reads the directory. Git has them if a decision is ever
 * reversed. Partners, StatsBand and Reviews stay — /study-abroad and the
 * pillar pages still use them.
 *
 * THE ORDER IS AN ARGUMENT:
 *   1  who we are, in one line struck across the screen
 *   2  where you can actually go            — flags, checkable by scrolling
 *   3  who vouches for us                   — named institutions
 *   4  the numbers behind both              — derived, never asserted
 *   5  what happens to you                  — the student journey, drawn
 *   6  what you are actually given          — the portal, photographed
 *   7  the same for a founder                — built rather than flown
 *   8  who else has done it                  — stories, then reviews
 *   9  your move
 */

/**
 * The chapters the meridian rail tracks.
 *
 * Only the sections that are a step in the argument. Countries and Partners
 * are credentials rather than steps — numbering them would make the rail
 * claim an order the page does not have.
 */
const CHAPTERS = [
  { id: "student-journey", index: "01", label: "The student journey" },
  { id: "portal", index: "02", label: "Your portal" },
  { id: "business-journey", index: "03", label: "The business journey" },
  { id: "proof", index: "04", label: "Proof" },
];

export default function HomePage() {
  return (
    <>
      <Meridian chapters={CHAPTERS} />

      <Hero />

      {/*
        The flags, in the first screen after the fold. The hero promises that
        borders are not the obstacle; this names the ten on the other side of
        them, and a student scanning for their own country finds it here
        rather than six sections down.
      */}
      <Countries />

      {/* The names it can all be checked against, before the argument starts. */}
      <Alliances />

      {/*
        The numbers, with the things they count still on screen — partnerships
        from the section above, destinations from the one above that. That
        adjacency is the whole point of data/stats.ts: a reader can check each
        figure against the list they have just scrolled past.
      */}
      <Numbers stats={homeStats} />

      <StudentJourney />

      {/* Stage 02 of the journey above, as the thing itself. */}
      <PortalShowcase />

      <BusinessJourney />

      {/* Named students before anonymous praise. Renders nothing until there
          are verified stories — see the component. */}
      <SuccessStories />
      <Voices />

      <Invitation />
    </>
  );
}
