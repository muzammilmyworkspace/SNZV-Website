/**
 * INSTITUTIONAL PARTNERSHIPS
 * ---------------------------------------------------------------------------
 * Named partners, transcribed from the announcement creatives SnZ Ventures
 * published for each one. Every line below appears on the company's own
 * announcement for that institution — the descriptions, the highlights, the
 * wording.
 *
 * WHY THAT MATTERS HERE MORE THAN ELSEWHERE
 *
 * This site's standing rule is that a company claim ships only once it is
 * confirmed in writing (see the header of data/study.ts). A named institutional
 * partnership is the strongest kind of claim this firm makes: it says a third
 * party has agreed to something. So nothing here is summarised, improved or
 * inferred. No ranking, no student numbers, no fee, no admission advantage, and
 * no promise about outcomes — none of those are in the source material and none
 * are invented to fill a card.
 *
 * `announced` is the date the partnership was published, so a card can say when
 * rather than implying it has always been there.
 *
 * ADDING ONE: copy its announcement wording. If a detail is not on the
 * announcement, it does not go on the card.
 */

export type Partner = {
  slug: string;
  /** As the institution writes it. */
  name: string;
  city: string;
  country: string;
  /** The line SnZ used to announce this partnership. */
  blurb: string;
  /** The highlights from that announcement, verbatim. */
  highlights: string[];
};

export const partners: Partner[] = [
  {
    slug: "okan-university",
    name: "Okan University",
    city: "Istanbul",
    country: "Türkiye",
    blurb:
      "Your pathway to a world-class education in one of Türkiye's most dynamic cities.",
    highlights: [
      "Internationally recognised degrees",
      "Modern campus and facilities",
      "Diverse global community",
      "Strong industry connections and career support",
    ],
  },
  {
    slug: "istinye-university",
    name: "Istinye University",
    city: "Istanbul",
    country: "Türkiye",
    blurb:
      "Together for greater opportunities, global learning and a brighter future.",
    highlights: [
      "World-class education",
      "Global exposure",
      "Innovative learning",
      "Bright careers",
    ],
  },
  {
    slug: "c3s-business-school",
    name: "C3S Business School",
    city: "Barcelona",
    country: "Spain",
    blurb:
      "Expanding opportunities for students seeking international education in Barcelona.",
    highlights: ["International education", "Career-focused learning"],
  },
];

/**
 * Countries where further partnerships are being formed.
 *
 * Deliberately a list of PLACES and not of institutions. Naming a university
 * before an agreement exists is the one thing a partnerships page must never
 * do, and "more coming in these countries" is both true and the same thing the
 * announcement creative says.
 */
export const partnerHorizon = [
  "Australia",
  "Germany",
  "Austria",
  "Azerbaijan",
  "Türkiye",
  "Cyprus",
  "Finland",
];

/**
 * Shown under the partner list.
 *
 * A partnership means SnZ can guide a student through that institution's
 * admission. It does not mean a place is held, a decision is influenced, or an
 * outcome is owed — and a student reading a page like this will assume all
 * three unless it says otherwise.
 */
export const partnerCaveat =
  "A partnership means SnZ Ventures works directly with the institution on admissions and student support. Admission decisions remain entirely the institution's, and visa decisions remain entirely the relevant authority's.";
