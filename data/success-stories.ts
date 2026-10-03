/**
 * SUCCESS STORIES
 * ---------------------------------------------------------------------------
 * EMPTY, DELIBERATELY. Nothing here is a placeholder waiting to be switched
 * on, because there is nothing to switch on yet.
 *
 * A success story is the strongest claim this site can make and the only one
 * that is about a REAL, NAMED PERSON. "Ayesha, from Lahore, now at Vilnius
 * Tech" asserts three things at once: that she exists, that we placed her, and
 * that she is happy to be used to sell the service. Getting any of the three
 * wrong is not a marketing error — the first two are misrepresentation and the
 * third is using somebody's name without their permission, which under GDPR is
 * processing their personal data for a purpose they never agreed to.
 *
 * So this file ships empty and the section renders nothing in production until
 * real entries arrive. That is the same rule the rest of the site follows: see
 * the header of data/company.ts, and `verified` in data/stats.ts.
 *
 * WHAT EACH ENTRY NEEDS BEFORE IT CAN BE ADDED
 *
 *   1. WRITTEN CONSENT from the student, naming this website specifically, and
 *      saying whether their photograph may be used. Keep it on file. A verbal
 *      "sure, go ahead" on a call is not a record anybody can produce later.
 *   2. The facts checked against the file in the portal — the institution, the
 *      programme, the year. Not from memory.
 *   3. The quote as they actually wrote it. Tidying grammar is fine. Writing
 *      a better version of what they meant is not, because the result is a
 *      sentence a real person is credited with and did not say.
 *
 * WHAT CANNOT GO IN ONE
 *
 *   • A visa approval rate, a scholarship amount or a salary, unless that
 *     specific figure is in that specific student's file.
 *   • "Rejected elsewhere, accepted with us" — a claim about another firm.
 *   • A composite of several students presented as one person. That is a
 *     fabricated individual, however true each part of it is separately.
 *
 * IF A STUDENT AGREES TO THE STORY BUT NOT TO THEIR NAME, use `displayName`
 * for an initial or a first name only and set `anonymised: true`, so the card
 * can say so rather than implying a full attribution it does not have.
 */

export type SuccessStory = {
  slug: string;
  /** As they have agreed to be shown. May be a first name only. */
  displayName: string;
  /** True when the name is shortened or changed at their request. */
  anonymised?: boolean;
  /** Where they were when they came to SnZ. */
  from: string;
  /** The institution, exactly as it writes its own name. */
  institution: string;
  /** The programme, as it appears on the offer. */
  programme: string;
  /** The year of entry. A number, so nothing has to be parsed out of prose. */
  year: number;
  /** Their words. Tidied for grammar at most — never rewritten. */
  quote: string;
  /** Optional, and only with explicit consent for a photograph. */
  portrait?: string;
  portraitAlt?: string;
  /**
   * `false` WITHHOLDS THE STORY FROM RENDER, exactly as in data/stats.ts.
   * An entry drafted before its consent is on file goes in with this set to
   * false — never without it.
   */
  verified: boolean;
};

export const successStories: SuccessStory[] = [];

/** What the section says above the stories, once there are any. */
export const successIntro = {
  eyebrow: "Where they ended up",
  title: ["Students who", "are already there."],
  lead: "Named students, named institutions, published with their permission. There is nothing here yet because we do not write these ourselves.",
};
