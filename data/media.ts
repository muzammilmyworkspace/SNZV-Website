import type { PathwayKey } from "./pathways";

/**
 * VIDEO STORYTELLING
 * ---------------------------------------------------------------------------
 * ⚠ No videos have been supplied. Each entry has `src: null`, which makes the
 * VideoFeature component render its clearly-marked placeholder state instead
 * of a broken player. Nothing here is invented.
 *
 * TO GO LIVE: set `src` and `poster`.
 *   • `provider: "file"`   → an .mp4/.webm in /public (best performance,
 *                            no third-party requests, no cookies)
 *   • `provider: "youtube"`→ a video ID. Embedded via youtube-nocookie.com and
 *                            only loaded after the visitor clicks play, so no
 *                            tracking occurs on page load.
 *   • `provider: "vimeo"`  → a video ID, embedded with dnt=1.
 */

export type VideoProvider = "file" | "youtube" | "vimeo";

export type VideoFeatureData = {
  pathway: PathwayKey;
  eyebrow: string;
  title: string;
  lead: string;
  /** null → placeholder state. Never fabricate a URL. */
  src: string | null;
  provider: VideoProvider;
  /** Falls back to a still from the existing image library. */
  poster: string;
  posterAlt: string;
  /** Shown in the placeholder so the client knows exactly what is needed. */
  requirement: string;
  /** Caption/transcript note — accessibility requirement, not decoration. */
  captionsNote: string;
  durationLabel?: string;
};

export const videoFeatures: Record<PathwayKey, VideoFeatureData> = {
  study: {
    pathway: "study",
    eyebrow: "A look at the journey",
    title: "What choosing a course actually involves.",
    lead: "Six minutes on how we work backwards from the labour market — and the questions we ask before anyone mentions a university.",
    src: null,
    provider: "file",
    poster: "/images/atmos-library.webp",
    posterAlt: "Library stacks receding into shadow",
    requirement: "[STUDY VIDEO REQUIRED]",
    captionsNote:
      "Supply a WebVTT caption track with the video file. Captions are required, not optional.",
  },
  careers: {
    pathway: "careers",
    eyebrow: "A look at the journey",
    title: "How a placement really happens.",
    lead: "From eligibility screening to the first day — including the point where we tell candidates their profile isn't competitive yet.",
    src: null,
    provider: "file",
    poster: "/images/path-careers.webp",
    posterAlt: "A quiet modern workspace beside a city-facing window",
    requirement: "[JOBS VIDEO REQUIRED]",
    captionsNote:
      "Supply a WebVTT caption track with the video file. Captions are required, not optional.",
  },
  business: {
    pathway: "business",
    eyebrow: "A look at the journey",
    title: "Inside an EU company formation.",
    lead: "What happens between the decision and a company that can actually transact — banking, registrations and the parts founders underestimate.",
    src: null,
    provider: "file",
    poster: "/images/path-business.webp",
    posterAlt: "Modern glass office towers viewed from below",
    requirement: "[BUSINESS VIDEO REQUIRED]",
    captionsNote:
      "Supply a WebVTT caption track with the video file. Captions are required, not optional.",
  },
};
