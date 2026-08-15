/**
 * GOOGLE REVIEWS — MANUAL SLOT
 * ---------------------------------------------------------------------------
 * Paste your real Google reviews here and they appear on the site immediately,
 * looping in the Trust section, with no API key and no waiting.
 *
 * WHY THIS EXISTS
 * The automatic path (lib/reviews.ts → Places API) is better: it stays current
 * on its own and cannot drift from what is actually on Google. But it needs a
 * billable API key, and the public share link cannot substitute for one —
 * verified five ways across three attempts: a plain fetch returns a JavaScript
 * shell, a real headless browser is served Google's /sorry/ CAPTCHA, and the
 * Maps URL returns the app shell with the place data loaded client-side. There
 * is no keyless route to the review text.
 *
 * So this is the manual equivalent. It exists so the site is not blocked on a
 * credential.
 *
 * THE ONE RULE
 * Every entry must be a VERBATIM copy of a review that is actually published
 * on the SnZ Ventures Google listing — same words, same name, same rating.
 * Copy them from your Google Business Profile.
 *
 * Do not write, improve, shorten or invent a review here. The section links
 * straight to the Google listing, so anyone can compare in one click; a
 * mismatch is worse than an empty section, and an invented one is a false
 * claim about a named person.
 *
 * HOW TO FILL IT
 *   1. Open the listing: company.social.googleReviews
 *   2. For each review, copy the reviewer's name, star rating, the date phrase
 *      Google shows ("2 months ago"), and the full text.
 *   3. Add an entry below. Order does not matter — the marquee loops.
 *
 * When GOOGLE_PLACES_API_KEY is set, the live API takes precedence and this
 * list is ignored, so there is no need to remove it later.
 */
import type { GoogleReview } from "@/lib/reviews";

export const manualGoogleReviews: GoogleReview[] = [
  // Example of the shape — delete this comment block and add real entries:
  //
  // {
  //   author: "Full Name",
  //   rating: 5,
  //   relativeTime: "2 months ago",
  //   text: "The review, copied word for word from Google.",
  // },
];

/**
 * The headline figures shown beside the reviews.
 *
 * Left null, the section simply omits them. Set them ONLY to what the Google
 * listing actually shows — they sit next to a link to that listing.
 */
export const manualGoogleSummary: {
  rating: number | null;
  total: number | null;
} = {
  rating: null,
  total: null,
};
