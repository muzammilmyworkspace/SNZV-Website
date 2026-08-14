/**
 * SNZ VENTURES — SINGLE SOURCE OF TRUTH FOR COMPANY FACTS
 * ---------------------------------------------------------------------------
 * Every factual claim rendered on this website reads from this file.
 *
 * SOURCING RULES (do not break these):
 *  - `verified: true`  → confirmed on the live snzventures.com site.
 *  - `verified: false` → appears on the live site but NOT independently
 *                        confirmed. Client must sign off before launch.
 *  - Anything unknown is typed as `null` and rendered as a visible
 *    [CONTENT REQUIRED] marker — never silently invented.
 *
 * Nothing in this file was authored speculatively. See CONTENT-HANDOFF.md.
 */

export const company = {
  name: "SnZ Ventures",
  nameUpper: "SNZ VENTURES",
  /** Verified — live site header positioning line. */
  positioning: "European Gateway for Business, Fintech & Talent",
  /** Verified — live site mission statement. */
  missionQuote:
    "Geography should not be a barrier to ambition. SnZ Ventures dismantles the borders between European opportunity.",

  /** Verified — published on the live site. */
  contact: {
    phone: "+370 603 05146",
    phoneHref: "+37060305146",
    email: "info@snzventures.com",
    /** Live site links a WhatsApp channel on the same published number. */
    whatsapp: "37060305146",
    city: "Vilnius",
    country: "Lithuania",
    countryCode: "LT",
    /** Client-supplied — office address. */
    streetAddress: "T. Ševčenkos g. 16",
    postalCode: "03223",
  },

  /** [CONTENT REQUIRED] — legal entity details not published. */
  legal: {
    registeredName: null as string | null,
    companyCode: null as string | null,
    vatNumber: null as string | null,
    incorporatedIn: "Lithuania",
  },

  /** [CONTENT REQUIRED] — no social profiles published except LinkedIn. */
  social: {
    linkedin: "https://lt.linkedin.com/company/snz-ventures",
    /**
     * Client-supplied Google Business share link. Used for "read all reviews"
     * and "leave a review", and as the fallback destination when the Places
     * API is not configured — so the link works with no credentials at all.
     * Review CONTENT is fetched separately; see lib/reviews.ts.
     */
    googleReviews: "https://share.google/MNo5ThKseoiGnDEnF",

    /**
     * Social profiles. The footer renders an icon for each entry that has a
     * URL and silently skips the rest, so filling one of these in is the only
     * step needed to make its icon appear.
     *
     * These stay `null` until the real profile URLs are supplied. A guessed
     * handle that 404s is worse than no icon at all — it reads as abandoned.
     */
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    x: null as string | null,
    youtube: null as string | null,
  },

  /** Verified — stated on the live site. */
  attributes: ["Woman-Owned Enterprise", "Vilnius, Lithuania", "EU / EEA Reach"],

  /**
   * Regulatory posture — stated plainly on the live site.
   * This is a TRUST asset, not a liability. Never imply direct regulation.
   */
  regulatoryNotice:
    "SnZ Ventures is an advisory firm. Regulated activities — audit, legal representation, licensing submissions and AML officer functions — are delivered through licensed partner firms. SnZ Ventures is not itself a regulated financial institution.",

  siteUrl: "https://www.snzventures.com",
  locale: "en",
} as const;

/**
 * HEADLINE STATISTICS
 * ---------------------------------------------------------------------------
 * ⚠ These four figures are published on the client's own live website but have
 * NOT been independently audited. They are the ONLY numbers on this site.
 * If the client cannot substantiate one, set `verified: false` → it is
 * automatically withheld from render (see components/sections/Proof.tsx).
 */
export const stats = [
  {
    value: 400,
    suffix: "+",
    label: "Entities formed",
    detail: "Companies incorporated and made operational through our process.",
    verified: false,
  },
  {
    value: 12,
    suffix: "",
    label: "Talent source hubs",
    detail: "Recruitment corridors across South Asia and the Middle East.",
    verified: false,
  },
  {
    value: 27,
    suffix: "",
    label: "EU member states",
    detail: "The single market your Lithuanian entity can operate across.",
    verified: true, // Objective fact about the EU, not a company claim.
  },
  {
    value: 48,
    suffix: "h",
    label: "Registration window",
    detail: "Typical Lithuanian company registration turnaround.",
    verified: false,
  },
] as const;

/**
 * QUALITATIVE TRUST POINTS
 * Used wherever statistics are unavailable or unverified. These make no
 * numeric claim and are safe to render unconditionally.
 */
export const trustPoints = [
  {
    title: "One coordinator, not six vendors",
    body: "Formation, accounting, licensing and hiring run through a single point of contact instead of four disconnected firms.",
  },
  {
    title: "Licensed partners, named upfront",
    body: "You know which regulated firm handles your audit, your legal filings and your compliance function before you commit.",
  },
  {
    title: "We tell you when the answer is no",
    body: "If a market, a licence or a route doesn't fit your case, you hear it in the first conversation — not after the invoice.",
  },
  {
    title: "Built on both sides of the corridor",
    body: "We work where the talent and founders come from, and where they're going. That's the whole point of the firm.",
  },
] as const;

/**
 * ECOSYSTEM CONTEXT — ⚠ HANDLE WITH CARE
 * ---------------------------------------------------------------------------
 * These institutions are listed on the client's live site. They are rendered
 * strictly as ECOSYSTEM CONTEXT ("we operate within"), never as partners,
 * endorsements or accreditations. Do not relabel this section without written
 * confirmation from each named body.
 */
export const ecosystem = [
  "Bank of Lithuania",
  "Invest Lithuania",
  "Vilnius Tech Park",
  "Startup Lithuania",
  "Enterprise Europe Network",
  "EU Blue Card Network",
] as const;

export const ecosystemDisclaimer =
  "Institutions shown describe the regulatory and business environment SnZ Ventures operates within. They do not constitute endorsement, accreditation or partnership.";

/** Verified — corridors named on the live site. */
export const sourceMarkets = [
  "India",
  "Pakistan",
  "Bangladesh",
  "Nepal",
  "UAE",
  "Saudi Arabia",
  "Egypt",
  "Jordan",
] as const;

/**
 * TESTIMONIALS — deliberately empty.
 * No client testimonials are published anywhere. Fabricating them is out of
 * the question, so the Stories section renders its honest "no proof yet"
 * state instead. Populate this array and the section switches automatically.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  pathway: "study" | "careers" | "business";
  image?: string;
};

export const testimonials: Testimonial[] = [];
