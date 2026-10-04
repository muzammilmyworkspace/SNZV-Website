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

const homeStatsAuthored: Stat[] = [
  /*
    OWNER-CONFIRMED FIGURES — 2026-10-03, raised 2026-10-04 to students
    placed "100+" and university partnerships "10+".

    The owner supplied these in writing during the homepage review: students
    placed "50+", university partnerships "05+", study destinations "10+".
    That written confirmation is what this file's rule asks for before a
    company claim ships, so they now render.

    They are typed, not derived, and that is deliberate:
      • Students placed has no data source in this repo at all.
      • Partnerships: data/partners.ts names three institutions with a
        published announcement each; the owner states there are more than
        five, the rest not yet announced. The partnerships section shows the
        named three plus "more coming" — it never names an institution that
        has no announcement on file. When the others are announced, add them
        to partners.ts.
      • Destinations: studyDestinations lists ten; "10+" is the owner's
        framing that more are available on request.

    If any figure changes, change it here — this is the only place it lives.
  */
  {
    value: 100,
    suffix: "+",
    label: "Students placed",
    detail: "Students we have taken from first call to a European campus.",
  },
  {
    value: Math.max(10, partners.length),
    suffix: "+",
    label: "University partnerships",
    detail: "Institutions we work with directly on admissions.",
  },
  {
    value: Math.max(10, studyDestinations.length),
    suffix: "+",
    label: "Study destinations",
    detail: "Countries on the study pathway, with tuition we can quote upfront.",
  },
  {
    // Objective fact about the EU, not a company claim. On the board at the
    // owner's request (2026-10-04), replacing "Home countries".
    value: EU_MEMBER_STATES,
    label: "EU member states",
    detail: "Where an EU degree is recognised, and where your career can start.",
  },

  /*
    ------------------------------------------------------------------------
    WITHHELD. Everything below this line renders nowhere.
    ------------------------------------------------------------------------
    Funding schemes and home countries were on the board before the owner's
    reviews replaced them with the figures above. Both are true; they
    stay here for any page that wants them.
  */
  {
    value: scholarships.length,
    label: "Funding schemes",
    detail: "Government and EU programmes we help students apply to.",
    verified: false,
  },
  {
    value: corridors.length,
    label: "Home countries",
    detail: "Where our students come from, across South Asia and the Middle East.",
    verified: false,
  },
  {
    value: services.length,
    label: "Core services",
    detail: "Formation, licensing, relocation and recruitment.",
    verified: false,
  },
];

const studyStatsAuthored: Stat[] = [
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

const careerStatsAuthored: Stat[] = [
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

const businessStatsAuthored: Stat[] = [
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

/* ------------------------------------------------------ what actually ships */

/**
 * WITHHELD FIGURES NEVER LEAVE THE SERVER.
 *
 * StatsBand filters on `verified` too, and that was not enough. It is a client
 * component, so the array handed to it is serialised into the RSC payload
 * inside the HTML — which meant an unconfirmed "Students placed" counter,
 * value and all, shipped in the page source on every request. Invisible on
 * screen and one View Source away, which is the worst of both: the figure is
 * published without anybody having decided to publish it.
 *
 * Filtering here means an unconfirmed figure cannot be imported by a client
 * component at all. The authored lists above keep every entry, including the
 * withheld ones, because that record is what somebody chasing the number needs
 * — and flipping `verified` is still the only edit required to ship one.
 *
 * The check inside StatsBand stays as a second line of defence for any caller
 * that assembles its own list.
 */
const shipped = (set: Stat[]) => set.filter((s) => s.verified !== false);

export const homeStats = shipped(homeStatsAuthored);
export const studyStats = shipped(studyStatsAuthored);
export const careerStats = shipped(careerStatsAuthored);
export const businessStats = shipped(businessStatsAuthored);

/**
 * The full authored sets, withheld entries included.
 *
 * For tooling and for the handoff document — never for render. Anything that
 * imports this and puts it on a page has defeated the point of the flag.
 */
export const authoredStats = {
  home: homeStatsAuthored,
  study: studyStatsAuthored,
  career: careerStatsAuthored,
  business: businessStatsAuthored,
};
