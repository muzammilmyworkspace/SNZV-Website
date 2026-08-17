import { destinations, corridors } from "./destinations";
import { studyDestinations, studyFields, scholarships } from "./study";
import { services } from "./services";

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
};

/** Objective: the EU has 27 member states. Not a claim about SnZ. */
const EU_MEMBER_STATES = 27;

export const homeStats: Stat[] = [
  {
    value: EU_MEMBER_STATES,
    label: "EU member states",
    detail: "The single market a Lithuanian entity operates across.",
  },
  {
    value: studyDestinations.length,
    label: "Study destinations",
    detail: "European countries on the study pathway.",
  },
  {
    value: corridors.length,
    label: "Source markets",
    detail: "Where we recruit, across South Asia and the Middle East.",
  },
  {
    value: services.length,
    label: "Core services",
    detail: "Formation, licensing, relocation and recruitment.",
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
