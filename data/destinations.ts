/**
 * DESTINATIONS
 * ---------------------------------------------------------------------------
 * Service availability is encoded PER COUNTRY and is deliberately conservative.
 *
 *   "core"        → a flagship, verified SnZ service in that market.
 *   "available"   → verified as offered on the live site.
 *   "enquire"     → NOT confirmed. Renders as "Ask us" — never as a promise.
 *
 * Only Lithuania is a full-stack market (formation + fintech + relocation).
 * The other seven are named on the live site as RECRUITMENT destinations only;
 * their business/study columns are therefore "enquire", not "available".
 * Do not upgrade any of these without written client confirmation.
 */

export type Availability = "core" | "available" | "enquire";

export type Destination = {
  slug: string;
  country: string;
  city: string;
  image: string;
  /** Short editorial line — factual, no superlatives about SnZ. */
  blurb: string;
  /** Why this market, expressed as an objective market fact. */
  marketNote: string;
  study: Availability;
  careers: Availability;
  business: Availability;
  featured?: boolean;
  /** Real coordinates — projected by components/visuals/CorridorMap. */
  lonLat: [number, number];
};

export const destinations: Destination[] = [
  {
    slug: "lithuania",
    country: "Lithuania",
    city: "Vilnius",
    image: "/images/dest-vilnius.webp",
    blurb:
      "Our home market, and the reason the rest of this list is reachable. An EU company here passports across all 27 member states.",
    marketNote:
      "Home to the largest licensed fintech population in the European Union.",
    study: "enquire",
    careers: "core",
    business: "core",
    featured: true,
    lonLat: [25.28, 54.69],
  },
  {
    slug: "germany",
    country: "Germany",
    city: "Berlin",
    image: "/images/dest-berlin.webp",
    blurb:
      "Europe's largest economy and its deepest engineering and industrial labour market.",
    marketNote: "The EU's largest economy by GDP.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    featured: true,
    lonLat: [13.4, 52.52],
  },
  {
    slug: "poland",
    country: "Poland",
    city: "Warsaw",
    image: "/images/dest-warsaw.webp",
    blurb:
      "A fast-growing operational base with strong logistics, manufacturing and shared-services demand.",
    marketNote: "One of the EU's fastest-growing large economies.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    featured: true,
    lonLat: [21.01, 52.23],
  },
  {
    slug: "netherlands",
    country: "Netherlands",
    city: "Amsterdam",
    image: "/images/dest-amsterdam.webp",
    blurb:
      "English-operating business culture, dense logistics infrastructure and a concentrated tech sector.",
    marketNote: "Among the highest English proficiency in continental Europe.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    lonLat: [4.9, 52.37],
  },
  {
    slug: "spain",
    country: "Spain",
    city: "Madrid",
    image: "/images/dest-madrid.webp",
    blurb:
      "Southern Europe's service economy, with sustained demand in hospitality, care and agriculture.",
    marketNote: "A primary gateway between the EU and Latin American markets.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    lonLat: [-3.7, 40.42],
  },
  {
    slug: "italy",
    country: "Italy",
    city: "Rome",
    image: "/images/dest-rome.webp",
    blurb:
      "A large manufacturing and hospitality economy with recurring seasonal and skilled labour shortages.",
    marketNote: "The EU's third-largest economy.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    lonLat: [12.5, 41.9],
  },
  {
    slug: "czech-republic",
    country: "Czech Republic",
    city: "Prague",
    image: "/images/dest-prague.webp",
    blurb:
      "Central Europe's industrial core, with consistently low unemployment and steady technical demand.",
    marketNote: "Historically among the lowest unemployment rates in the EU.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    lonLat: [14.42, 50.08],
  },
  {
    slug: "romania",
    country: "Romania",
    city: "Bucharest",
    image: "/images/dest-bucharest.webp",
    blurb:
      "A rapidly expanding IT and outsourcing hub with competitive operating costs inside the EU.",
    marketNote: "One of Europe's largest concentrations of IT outsourcing.",
    study: "enquire",
    careers: "available",
    business: "enquire",
    lonLat: [26.1, 44.44],
  },
];

/** Verified — recruitment corridors named on the live site. */
export const corridors: { name: string; lonLat: [number, number] }[] = [
  { name: "India", lonLat: [77.21, 28.61] },
  { name: "Pakistan", lonLat: [73.05, 33.68] },
  { name: "Bangladesh", lonLat: [90.41, 23.81] },
  { name: "Nepal", lonLat: [85.32, 27.71] },
  { name: "UAE", lonLat: [55.27, 25.2] },
  { name: "Saudi Arabia", lonLat: [46.68, 24.71] },
  { name: "Egypt", lonLat: [31.24, 30.04] },
  { name: "Jordan", lonLat: [35.93, 31.95] },
];

export const availabilityLabel: Record<Availability, string> = {
  core: "Flagship service",
  available: "Available",
  enquire: "Ask us",
};
