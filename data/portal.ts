/**
 * THE CLIENT PORTAL, as the marketing site describes it.
 *
 * Everything here is a statement about software that exists and can be checked
 * by logging in, which is a different kind of claim from the ones the rest of
 * this site has to be careful with — there is no outcome promised, no number
 * asserted, and nothing a third party has to agree to. Each line below
 * describes a screen in portal.snzventures.com.
 *
 * THE SCREENSHOTS ARE OF THE REAL PORTAL, photographed against a throwaway
 * database of invented people. Not the live one with names blurred: a blur is
 * a filter over data that is still in the file. See scripts/portal-shots.mjs
 * for how they are produced and why it is done that way.
 *
 * Regenerate them whenever the portal's interface changes:
 *   npm run build:portal-shots
 */

export type PortalShot = {
  key: string;
  /** The tab label. Two or three words — it is a control, not a sentence. */
  tab: string;
  /** What this screen is for, in the student's terms. */
  caption: string;
  file: string;
  /** Describes the screenshot for somebody who cannot see it. */
  alt: string;
};

export const portalShots: PortalShot[] = [
  {
    key: "dashboard",
    tab: "Dashboard",
    caption:
      "What is outstanding, what we are waiting on, and the one thing to do next — named, not implied.",
    file: "/images/portal-dashboard.webp",
    alt: "The portal dashboard, showing the next step a student needs to take, counts of open documents and tasks, and how far the application has progressed.",
  },
  {
    key: "journey",
    tab: "Your journey",
    caption:
      "Every stage from the first consultation to departure, with the ones that are done marked done.",
    file: "/images/portal-journey.webp",
    alt: "The journey screen, listing each stage of a study application with its status and a short description of what happens at that stage.",
  },
  {
    key: "documents",
    tab: "Documents",
    caption:
      "What is approved, what is being read, and what came back — with the reason it came back.",
    file: "/images/portal-documents.webp",
    alt: "The documents screen, listing uploaded files with a status against each one and a note explaining what needs replacing.",
  },
  {
    key: "application",
    tab: "Application",
    caption:
      "The full application, saved as you fill it in. Nothing is lost between visits.",
    file: "/images/portal-application.webp",
    alt: "The application form, showing its sections and how much of the required information has been completed.",
  },
];

/**
 * What the portal is for, said once each.
 *
 * Written against what the software actually does — each of these is visible
 * in one of the screenshots above, which is the test a line has to pass to be
 * on this list.
 */
export const portalPoints = [
  {
    title: "You can see the file",
    body: "The same record your advisor works from: what we hold, what is missing, and where the application stands today.",
  },
  {
    title: "Nothing is chased by email",
    body: "A document that needs replacing says so, with the reason. A task that is yours is on your list with a date against it.",
  },
  {
    title: "The form saves as you go",
    body: "Ten sections, filled in over as many sittings as it takes. Nothing is lost between visits and nothing is submitted until you sign it.",
  },
  {
    title: "One advisor, named",
    body: "The same person from the first call to arrival, reachable from inside the portal rather than through a shared inbox.",
  },
];

/**
 * THE PORTAL VIDEO — the same contract as data/media.ts.
 *
 * `src: null` renders a clearly-marked placeholder rather than a broken
 * player. Nothing here is invented and no URL is guessed.
 *
 * TO GO LIVE: set `src` and `provider`.
 *   • "file"    → an .mp4/.webm in /public. Best performance, no third-party
 *                 requests, no cookies.
 *   • "youtube" → a video ID. Embedded via youtube-nocookie.com and only
 *                 loaded after the visitor clicks play, so nothing is tracked
 *                 on page load.
 *   • "vimeo"   → a video ID, embedded with dnt=1.
 *
 * A WebVTT caption track ships with the file. Captions are a requirement, not
 * a nice-to-have — see the same note in data/media.ts.
 */
export const portalVideo = {
  eyebrow: "A look inside",
  title: "Two minutes in the portal.",
  lead: "What a student sees after their first call with us — the file, the form, and where an application actually is.",
  src: null as string | null,
  provider: "file" as "file" | "youtube" | "vimeo",
  poster: "/images/portal-dashboard.webp",
  posterAlt: "The portal dashboard, as a student sees it.",
  requirement: "[PORTAL WALKTHROUGH VIDEO REQUIRED]",
  captionsNote:
    "Supply a WebVTT caption track with the video file. Captions are required, not optional.",
  durationLabel: "≈ 2 min",
};
