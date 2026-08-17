import type { FAQ } from "./services";

/**
 * STUDY ABROAD CONTENT
 * ---------------------------------------------------------------------------
 * PROVENANCE MATTERS HERE. Two rules govern every figure on this page:
 *
 *   1. Nothing is invented. Country list, indicative tuition and programme
 *      families are transcribed from SnZ Ventures' own live student site
 *      (student.snzventures.com), which is the company's published position.
 *      They are not estimates and they are not sourced from a competitor.
 *
 *   2. Anything that reads as a performance claim about SnZ — placements,
 *      visa success rate, partner counts, ratings — is NOT rendered here.
 *      Those numbers exist on the student site, but this site's standing rule
 *      is that a company claim ships only once it is confirmed in writing.
 *      See `studyClaims` at the foot of this file: it holds them, flagged
 *      `verified: false`, so confirming them later is a one-word change
 *      rather than a rewrite.
 *
 * Tuition figures are indicative annual course fees published by SnZ, not
 * quotes, and every card says so.
 */

export type StudyDestination = {
  slug: string;
  country: string;
  city: string;
  image: string;
  /** Alt text — describes the photograph, not the country. */
  imageAlt: string;
  /** Indicative annual tuition, as published on student.snzventures.com. */
  tuitionFrom: string;
  /** One line, adapted from SnZ's published destination copy. */
  blurb: string;
  /** The concrete reason a student shortlists this country. */
  draw: string;
};

export const studyDestinations: StudyDestination[] = [
  {
    slug: "lithuania",
    country: "Lithuania",
    city: "Vilnius",
    image: "/images/dest-vilnius.webp",
    imageAlt: "Vilnius skyline at dusk, Lithuania",
    tuitionFrom: "From €1,500 / year",
    blurb:
      "An EU degree with living costs that leave room to breathe, in the city SnZ Ventures calls home.",
    draw: "Our home market — advisors on the ground.",
  },
  {
    slug: "poland",
    country: "Poland",
    city: "Warsaw",
    image: "/images/dest-warsaw.webp",
    imageAlt: "Aerial view of central Warsaw, Poland",
    tuitionFrom: "From €2,000 / year",
    blurb:
      "One of the EU's fastest-growing economies, with a deep bench of English-taught degrees.",
    draw: "A labour market still expanding.",
  },
  {
    slug: "hungary",
    country: "Hungary",
    city: "Budapest",
    image: "/images/dest-budapest.webp",
    imageAlt: "The Hungarian Parliament Building on the Danube, Budapest",
    tuitionFrom: "From €3,000 / year",
    blurb:
      "Historic universities, strong medical and engineering faculties, and riverside student life.",
    draw: "Home of the Stipendium Hungaricum scheme.",
  },
  {
    slug: "latvia",
    country: "Latvia",
    city: "Riga",
    image: "/images/dest-riga.webp",
    imageAlt: "Aerial view over Riga, Latvia",
    tuitionFrom: "From €2,000 / year",
    blurb:
      "Small, safe and digital-first — an underrated route to an EU qualification.",
    draw: "Low living costs, full EU degree.",
  },
  {
    slug: "germany",
    country: "Germany",
    city: "Berlin",
    image: "/images/dest-berlin.webp",
    imageAlt: "Museum Island on the Spree, Berlin, Germany",
    tuitionFrom: "From €0 – €1,500 / semester",
    blurb:
      "World-class engineering, minimal tuition at public universities, and Europe's largest economy on graduation day.",
    draw: "The EU's strongest engineering market.",
  },
  {
    slug: "malta",
    country: "Malta",
    city: "Valletta",
    image: "/images/dest-valletta.webp",
    imageAlt: "City Gate and fortifications, Valletta, Malta",
    tuitionFrom: "From €4,000 / year",
    blurb:
      "An English-speaking EU island — study, work and build a network in the Mediterranean.",
    draw: "English is an official language.",
  },
  {
    slug: "spain",
    country: "Spain",
    city: "Madrid",
    image: "/images/dest-madrid.webp",
    imageAlt: "Cibeles Palace on Plaza de Cibeles, Madrid, Spain",
    tuitionFrom: "From €2,500 / year",
    blurb:
      "Historic universities and a service economy that keeps drawing international graduates.",
    draw: "Gateway between the EU and Latin America.",
  },
  {
    slug: "italy",
    country: "Italy",
    city: "Rome",
    image: "/images/dest-rome.webp",
    imageAlt: "The Trevi Fountain, Rome, Italy",
    tuitionFrom: "From €900 / year",
    blurb:
      "Elite design and engineering schools at the lowest published tuition on this list.",
    draw: "Income-assessed fees cut the cost.",
  },
  {
    slug: "france",
    country: "France",
    city: "Paris",
    image: "/images/dest-paris.webp",
    imageAlt: "The Arc de Triomphe, Paris, France",
    tuitionFrom: "From €2,770 / year",
    blurb:
      "Grandes écoles, globally ranked business schools and serious research funding.",
    draw: "Brand-name institutions recruiters know.",
  },
  {
    slug: "estonia",
    country: "Estonia",
    city: "Tallinn",
    image: "/images/dest-tallinn.webp",
    imageAlt: "Panoramic view over Tallinn old town from Toompea, Estonia",
    tuitionFrom: "From €1,500 / year",
    blurb:
      "Europe's most digital state, with startup culture running through the curriculum.",
    draw: "Dense startup scene, English-taught tech.",
  },
];

/* ------------------------------------------------------------------ Fields */

export type StudyField = {
  name: string;
  examples: string;
  body: string;
  /**
   * Icon key, resolved to a path in components/sections/Study.tsx.
   *
   * A key rather than an SVG string so this file stays content, not markup —
   * and so a family can be re-illustrated without touching the data.
   */
  icon: "business" | "code" | "engineering" | "health" | "design" | "law" | "hospitality";
};

/** Programme families SnZ advises on, per the live student site. */
export const studyFields: StudyField[] = [
  {
    name: "Business & MBA",
    icon: "business",
    examples: "Management, Finance, Marketing, MBA",
    body: "Widest intake, widest spread of outcomes — so the school matters most here.",
  },
  {
    name: "IT & Data",
    icon: "code",
    examples: "Computer Science, Data, AI, Cybersecurity",
    body: "Shortest route from graduation to hire, and the most forgiving on language.",
  },
  {
    name: "Engineering",
    icon: "engineering",
    examples: "Mechanical, Electrical, Civil",
    body: "Accreditation decides whether you can practise. We check it before you apply.",
  },
  {
    name: "Medical & Health",
    icon: "health",
    examples: "MBBS, Dentistry, Pharmacy",
    body: "Let the licensing rules where you intend to practise drive this, not the offer.",
  },
  {
    name: "Arts & Design",
    icon: "design",
    examples: "Design, Film, Music",
    body: "Portfolio-led: your work outweighs your transcript. We prepare the submission.",
  },
  {
    name: "Law & International Relations",
    icon: "law",
    examples: "European Law, IR, Public Policy",
    body: "Jurisdiction-bound. We are explicit about what a European degree does not transfer to.",
  },
  {
    name: "Hospitality & Tourism",
    icon: "hospitality",
    examples: "Hotel Management, Tourism, Culinary",
    body: "The course's industry placements matter more than the institution's ranking.",
  },
];

/* ----------------------------------------------------------------- Journey */

export type JourneyStep = {
  step: string;
  name: string;
  body: string;
};

/** The five-stage student journey published on the SnZ student site. */
export const studyJourney: JourneyStep[] = [
  {
    step: "01",
    name: "Discovery Call",
    body: "A free consultation that maps your profile, your budget and the destinations you are actually weighing — before any course is discussed.",
  },
  {
    step: "02",
    name: "University Shortlist",
    body: "A small, defensible list of programmes matched to your goals and your finances, with the trade-off on each one stated plainly.",
  },
  {
    step: "03",
    name: "Applications & SOP",
    body: "Your statement of purpose, essays and full application package, built to the standard the admissions office expects to read.",
  },
  {
    step: "04",
    name: "Offer & Scholarships",
    body: "We work through the offers as they land and identify every funding scheme your nationality, subject and level qualify you for.",
  },
  {
    step: "05",
    name: "Visa & Departure",
    body: "Documentation, interview preparation, and the practical end — housing, flights and the first week on the ground.",
  },
];

/* ------------------------------------------------------------- Scholarships */

export const scholarshipNotes = [
  {
    title: "Funding Is Specific, Never General",
    body: "Almost every scheme is tied to a nationality, a subject, a level or a single institution. A scholarship you are not eligible for is not an opportunity, and we will say so early.",
  },
  {
    title: "Deadlines Close Before the Intake",
    body: "Funding calendars typically run months ahead of the admission calendar. Applying to the course first and looking for money afterwards is the most common way students lose a year.",
  },
  {
    title: "Government Schemes Are Worth the Paperwork",
    body: "National programmes — Hungary's Stipendium Hungaricum among them — are competitive and document-heavy, but they are real, published and open to international applicants.",
  },
  {
    title: "Low Tuition Can Beat a Scholarship",
    body: "A funded place at an expensive school and an unfunded place at a €900-a-year public university can leave you in the same position. We compare the total cost, not the discount.",
  },
];

/* ----------------------------------------------------------------- Support */

export const supportServices = [
  {
    title: "One Named Advisor",
    body: "The same person from first call to first week. No handing between departments.",
  },
  {
    title: "Application & Document Preparation",
    body: "Transcripts, translations, credential evaluation and your statement of purpose.",
  },
  {
    title: "Visa Documentation & Interview Practice",
    body: "The evidence pack assembled properly, and rehearsal before you sit it.",
  },
  {
    title: "Arrival and Settling In",
    body: "Housing, residence registration, and the first-month problems nobody warns you about.",
  },
  {
    title: "Tracked in the Student Portal",
    body: "Applications, documents and messages in one place — you always know what is outstanding.",
  },
  {
    title: "The Bridge into Work",
    body: "We recruit into European employers too, so it does not stop at graduation.",
  },
];

/* --------------------------------------------------------------------- FAQ */

/** Questions transcribed from the SnZ student site; answers written to this site's honesty standard. */
export const studyFaqs: FAQ[] = [
  {
    q: "How much does studying in Europe actually cost?",
    a: "Indicative tuition runs from about €900 a year in Italy to roughly €4,000 in Malta, and German public universities charge little or nothing. Living costs vary more by city than by country. We build a full-year budget — tuition, living, insurance and government charges — so you compare total cost, not headline fees.",
  },
  {
    q: "Do I need IELTS?",
    a: "It depends on the university and the programme, not on the country. Many institutions accept alternative evidence of English — a previous degree taught in English, another recognised test, or their own assessment. We confirm the current requirement for each programme on your shortlist before you book a test you may not need.",
  },
  {
    q: "Can I work while studying?",
    a: "Most EU countries permit international students to work a limited number of hours during term, but the limit, the permit conditions and the tax treatment differ by country and change with policy. We will not quote a figure here that might not hold when you arrive — we check the current official position for your destination before you commit to it.",
  },
  {
    q: "Will I get a scholarship?",
    a: "No advisor awards funding; institutions and governments do, and anyone promising you a scholarship is not being straight with you. What we can do is identify every scheme your nationality, subject and level genuinely qualify you for, and build your calendar around those deadlines rather than the intake date.",
  },
  {
    q: "How long does the process take?",
    a: "Plan on the better part of an academic year from first call to departure. Admission decisions, funding rounds and visa appointments each run on their own calendar and none of them can be rushed, so the students who start early are the ones with real choices at the end.",
  },
  {
    q: "What happens if my visa is rejected?",
    a: "Refusals happen, and they are usually about the evidence rather than the applicant. You are entitled to written reasons; we go through them with you and determine whether the correct response is an appeal, a re-application with better documentation, or a deferral to the next intake. We cannot promise an outcome — immigration decisions rest with national authorities — but you will not be left to work it out alone.",
  },
];

export const studyCaveat =
  "SnZ Ventures does not guarantee admission, scholarship awards, visas or employment. Admission decisions rest with institutions and immigration decisions with national authorities. Tuition figures are indicative annual amounts published for guidance and are not quotations.";

/* ------------------------------------------------------------------ Claims */

/**
 * Performance claims carried on student.snzventures.com. Held here rather than
 * rendered, on the same `verified` gate the rest of the site uses (see
 * data/company.ts → stats). Flip a flag to true only on written confirmation,
 * and the figure appears wherever this list is consumed.
 */
export const studyClaims = [
  { value: "1,200+", label: "Students placed", verified: false },
  { value: "98%", label: "Visa success rate", verified: false },
  { value: "300+", label: "Partner universities", verified: false },
  { value: "4.9/5", label: "Average student rating", verified: false },
] as const;

/** Objective, checkable facts — safe to render unconditionally. */
export const studyFacts = [
  {
    value: studyDestinations.length.toString(),
    suffix: "",
    label: "Study destinations",
    detail: "European countries covered by our study pathway.",
  },
  {
    value: "27",
    suffix: "",
    label: "EU member states",
    detail: "Where an EU qualification is recognised as a matter of law.",
  },
  {
    value: studyFields.length.toString(),
    suffix: "",
    label: "Programme families",
    detail: "From business and IT through to medicine and design.",
  },
  {
    value: "1",
    suffix: "",
    label: "Advisor per student",
    detail: "The same named person from first call to arrival.",
  },
] as const;
