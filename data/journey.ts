import { studyJourney } from "./study";

/**
 * THE HOMEPAGE JOURNEY — seven scenes, scroll-driven.
 *
 * The owner described the student's path as: contacts us → our consultant
 * applies → approval → visa → fees → flies. That is seven beats; the published
 * five-stage journey (data/study.ts → studyJourney) covers the same ground in
 * fewer, larger steps. Where a scene and a published stage overlap, the scene
 * reuses that stage's wording rather than paraphrasing it, so the homepage and
 * /study-abroad cannot drift into describing two different services.
 *
 * Nothing here promises an outcome. Admission is the institution's decision
 * and a visa is the authority's — the visa scene says so in its own copy.
 */

export type JourneyScene = {
  key: "contact" | "consultant" | "apply" | "approval" | "visa" | "fees" | "fly";
  /** The rail label. Two or three words. */
  short: string;
  title: string;
  body: string;
  /** Three short things the student gets at this step. Shown under the copy. */
  points: [string, string, string];
};

const [discovery, shortlist, applications, offer] = studyJourney;

export const journeyScenes: JourneyScene[] = [
  {
    key: "contact",
    short: "You reach out",
    title: "You send one message.",
    body: discovery.body,
    points: ["Free, with no obligation", "WhatsApp, call or the form", "A reply from a real person"],
  },
  {
    key: "consultant",
    short: "Consultant on it",
    title: "A named consultant takes your case.",
    body: `${shortlist.body} Your file opens in the SnZ portal the same day, so you see everything we see.`,
    points: ["One named consultant", "A written shortlist", "Your own portal login"],
  },
  {
    key: "apply",
    short: "Application sent",
    title: "We build and submit your application.",
    body: applications.body,
    points: ["Statement of purpose", "Documents checked", "Submitted to the university"],
  },
  {
    key: "approval",
    short: "Offer lands",
    title: "The offer letter arrives.",
    body: offer.body,
    points: ["Offers compared with you", "Funding you qualify for", "Acceptance handled"],
  },
  {
    key: "visa",
    short: "Visa process",
    title: "Your visa file, done properly.",
    body: "Documentation and interview preparation, with the file checked line by line before it goes in. The decision is always the embassy's, the preparation is ours.",
    points: ["A document checklist", "Interview practice", "File checked line by line"],
  },
  {
    key: "fees",
    short: "Fees paid",
    title: "Fees paid, receipts in your portal.",
    body: "Tuition deposit, visa fee, insurance, accommodation: we tell you what is due, when and to whom, and every receipt lands in your portal next to the file it belongs to.",
    points: ["What is due, and when", "Who to pay", "Receipts in your portal"],
  },
  {
    key: "fly",
    short: "You fly",
    title: "Boarding pass in hand. You fly.",
    body: "Flights, housing and the first week on the ground: the practical end of the journey, planned with you before you leave home.",
    points: ["Flights and housing", "Arrival and registration", "Your first week planned"],
  },
];
