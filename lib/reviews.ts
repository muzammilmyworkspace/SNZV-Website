import "server-only";
import { company } from "@/data/company";

/**
 * GOOGLE REVIEWS
 * ---------------------------------------------------------------------------
 * Real reviews, fetched server-side from the Google Places API, or nothing.
 *
 * There is no third state. This module will not synthesise, paraphrase or
 * "illustrate" a review, and the section that consumes it renders an honest
 * placeholder when the data is absent — the same rule the written testimonials
 * follow in data/company.ts.
 *
 * WHY SERVER-SIDE
 * A Places key is billable and unrestricted keys get scraped out of client
 * bundles within hours. This runs only on the server (`server-only` makes an
 * accidental client import a build error), the key never reaches the browser,
 * and the response is cached so a traffic spike cannot become a bill.
 *
 * CONFIGURATION
 *   GOOGLE_PLACES_API_KEY   Places API (New) key, restricted to that API
 *   GOOGLE_PLACE_ID         the listing's Place ID
 *
 * The Place ID is not the share link. To find it, open the listing in Google
 * Maps and read the `!1s0x…:0x…` segment from the URL, or use the Place ID
 * finder. `company.social.googleReviews` holds the public share link, which is
 * what visitors follow to read everything and to leave one — that works with
 * no credentials at all.
 */

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  /** Google's own phrasing, e.g. "2 months ago". */
  relativeTime: string;
  text: string;
};

export type GoogleReviewsResult = {
  /** False when credentials are absent or the API call failed. */
  configured: boolean;
  rating: number | null;
  total: number | null;
  /** Where visitors go to read every review, or to leave one. */
  url: string;
  reviews: GoogleReview[];
};

const EMPTY: GoogleReviewsResult = {
  configured: false,
  rating: null,
  total: null,
  url: company.social.googleReviews,
  reviews: [],
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return EMPTY;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          // Places bills per requested field group. Ask for exactly what is
          // rendered and nothing more.
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.originalText,reviews.relativePublishTimeDescription,reviews.authorAttribution",
        },
        // One upstream call per day. Reviews change slowly and the endpoint is
        // billable, so this is deliberately long.
        next: { revalidate: 86_400 },
      }
    );

    if (!res.ok) {
      console.error(`[reviews] Places API responded ${res.status}`);
      return EMPTY;
    }

    const data = (await res.json()) as PlacesResponse;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName?.trim() ?? "",
        authorUrl: r.authorAttribution?.uri,
        photoUrl: r.authorAttribution?.photoUri,
        rating: typeof r.rating === "number" ? r.rating : 0,
        relativeTime: r.relativePublishTimeDescription ?? "",
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      }))
      // A rating with no words is not a testimonial — it has nothing to show.
      .filter((r) => r.author && r.text);

    return {
      configured: true,
      rating: typeof data.rating === "number" ? data.rating : null,
      total: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      url: data.googleMapsUri ?? company.social.googleReviews,
      reviews,
    };
  } catch (error) {
    // Never let a third party take the page down.
    console.error("[reviews] fetch failed:", error);
    return EMPTY;
  }
}
