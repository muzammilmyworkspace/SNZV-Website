import { destinations, corridors } from "./destinations";
import { studyDestinations, studyFields, scholarships } from "./study";
import { services } from "./services";
import { partners } from "./partners";

/**
 * COUNTER SETS
 * ---------------------------------------------------------------------------
 * Every figure here is DERIVED or objective. Nothing is a performance claim.
 *
 * That constraint is deliberate. The obvious counters for a consultancy are
 * "5,000+ students placed", "98% visa success", "300+ partner universities" —
 * and those exist on SnZ's own student site. They are held in
 * `data/company.ts → stats` and `data/study.ts → studyClaims`, both flagged
 * `verified: false`, and both withheld from render until confirmed in writing.
 * See CONTENT-HANDOFF § 3.
 *
 * So these count things the site can prove from its own content: how many
 * destinations are listed, how many schemes are named, how many services are
 * described. A visitor can check every one by scrolling. "27 EU member states"
 * is an objective fact about the European Union, not a claim about SnZ.
 *
 * Counting real inventory is not a weaker proposition than an unevidenced
 * number — it is the one a sceptical reader can actually verify.
 */

export type Stat = {
  /** Integer the counter animates to. */
  value: number;
  /** Rendered after the number — "+", "%", "h". */
  suffix?: string;
  label: string;
  /** One line under the label. Says what the number counts. */
  detail: string;
  /**
   * `false` WITHHOLDS THE COUNTER FROM RENDER. Omitted means true.
   *
   * The same rule data/company.ts states for its headline statistics, made
   * operational here: a figure nobody has confirmed stays in the file, where
   * it is visible to whoever is chasing it, and off the page, where it would
   * be a claim. StatsBand filters on this — see components/sections/StatsBand.
   *
   * To ship one, confirm the number in writing and delete the flag. There is
   * no code change.
   */
  verified?: boolean;
};

/** Objective: the EU has 27 member states. Not a claim about SnZ. */
const EU_MEMBER_STATES = 27;

export const homeStats: Stat[] = [
  {
    /*
      DERIVED FROM data/partners.ts, not typed as a number here.

      Each of these is evidenced by SnZ's own published announcement for that
      institution, which is what makes it the one performance-shaped figure on
      this page that can ship. Add a fourth partnership and this becomes 4 on
      its own; hardcoding it would leave a number on the homepage that the
      partnerships section below it contradicts.
    */
    value: partners.length,
    label: "University partnerships",
    detail: "Named institutions we work with directly on admissions.",
  },
  {
    value: studyDestinations.length,
    label: "Study destinations",
    detail: "European countries on the study pathway.",
  },
  {
    value: scholarships.length,
    label: "Funding schemes",
    detail: "Government and EU programmes we help students apply to.",
  },
  {
    value: EU_MEMBER_STATES,
    label: "EU member states",
    detail: "The single market a Lithuanian entity operates across.",
  },

  /*
    ------------------------------------------------------------------------
    WITHHELD. Everything below this line renders nowhere until it is confirmed.
    ------------------------------------------------------------------------

    "Students placed" is the counter the business most wants on this page and
    the one it cannot have yet. There is no audited figure: nothing on the live
    site, nothing in the portal that covers the years before it existed, and a
    placement number is precisely the kind of claim a regulator or a
    disappointed family asks to see evidence for.

    It is written here rather than left out so that the gap is visible to
    whoever is chasing it, and so that shipping it is deleting one line rather
    than designing a counter. The value is a PLACEHOLDER and must be replaced
    with the confirmed figure at the same time — see CONTENT-HANDOFF.md § 3.
  */
  {
    value: 0,
    suffix: "+",
    label: "Students placed",
    detail: "Students we have moved into a European institution.",
    verified: false,
  },
  {
    value: corridors.length,
    label: "Source markets",
    detail: "Where we recruit, across South Asia and the Middle East.",
    /*
      True, and cut for space rather than for doubt: the band is a four-column
      grid and a fifth figure wraps to a second row holding one number. It
      stays in the file because /about and the careers pages can use it.
    */
    verified: false,
  },
  {
    value: services.length,
    label: "Core services",
    detail: "Formation, licensing, relocation and recruitment.",
    verified: false,
  },
];

export const studyStats: Stat[] = [
  {
    value: studyDestinations.length,
    label: "Study destinations",
    detail: "European countries covered by the study pathway.",
  },
  {
    value: scholarships.length,
    label: "Funding schemes",
    detail: "Government and EU programmes we help students apply to.",
  },
  {
    value: studyFields.length,
    label: "Programme families",
    detail: "From business and IT through to medicine and design.",
  },
  {
    value: 1,
    label: "Advisor per student",
    detail: "The same named person from first call to arrival.",
  },
];

export const careerStats: Stat[] = [
  {
    value: destinations.length,
    label: "European markets",
    detail: "Where we place candidates into employers.",
  },
  {
    value: corridors.length,
    label: "Source markets",
    detail: "Where our candidates come from.",
  },
  {
    value: EU_MEMBER_STATES,
    label: "EU member states",
    detail: "Where an EU qualification is recognised in law.",
  },
  {
    value: 2,
    label: "Ends of the corridor",
    detail: "We work both, which is why neither side is guesswork.",
  },
];

export const businessStats: Stat[] = [
  {
    value: EU_MEMBER_STATES,
    label: "EU member states",
    detail: "Reachable from one Lithuanian entity, from day one.",
  },
  {
    value: services.length,
    label: "Core services",
    detail: "Formation, licensing, relocation and recruitment.",
  },
  {
    value: destinations.length,
    label: "European markets",
    detail: "Markets we operate across.",
  },
  {
    value: 1,
    label: "Point of contact",
    detail: "One coordinator, not four disconnected firms.",
  },
];
