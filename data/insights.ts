import type { PathwayKey } from "./pathways";

/**
 * INSIGHTS — orientation articles.
 *
 * EDITORIAL RULE: these explain how processes generally work and what questions
 * to ask. They contain no SnZ performance claims, no fee figures, no statutory
 * thresholds and no jurisdiction-specific legal assertions that could date or
 * mislead. Every article carries an advisory disclaimer on render.
 */

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  pathway: PathwayKey;
  readMinutes: number;
  updated: string; // ISO
  image: string;
  imageAlt: string;
  /** Structured body — rendered as semantic sections. */
  body: { heading: string; paras: string[]; list?: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "choosing-a-course-that-leads-to-work",
    title: "Choosing a course that actually leads to work",
    excerpt:
      "League tables measure research output. They do not measure whether you will be employable. Here is the order to think in.",
    category: "Study abroad",
    pathway: "study",
    readMinutes: 6,
    updated: "2026-08-01",
    image: "/images/atmos-library.webp",
    imageAlt: "Rows of books on library shelves",
    body: [
      {
        heading: "Start at the end, not the beginning",
        paras: [
          "Most people choose in this order: country, then university, then course, then — years later — career. Reversing that order is the single highest-value decision available to you, and it costs nothing.",
          "Ask instead: what work do I want to be doing in five years, in which country, and what does the person doing that job today actually hold? That question narrows a list of thousands of programmes to a handful very quickly.",
        ],
      },
      {
        heading: "Rankings answer a question you did not ask",
        paras: [
          "Global league tables are weighted heavily toward research output, citations and academic reputation. Those are real measures — of a research institution's standing among other research institutions.",
          "They are not measures of teaching quality, graduate employment, industry connection or how a specific employer in a specific city reads that name on a CV. A mid-ranked university with a strong regional placement pipeline can serve your career better than a famous one without it.",
        ],
      },
      {
        heading: "Check the rights attached to the degree",
        paras: [
          "Post-study work rights vary substantially between countries and change with government policy. So do the rules on switching from a student status to a work status, and on whether time studying counts toward longer-term residence.",
          "This is the most expensive detail to discover late. Before you commit, verify the current position directly with the destination country's official immigration source — not from a forum post, an agent's brochure, or an article written three years ago.",
        ],
      },
      {
        heading: "Questions worth asking before you apply",
        paras: [],
        list: [
          "What proportion of this programme's graduates are working in the field within a year, and where is that figure published?",
          "Is the qualification recognised by the professional body that governs my target profession?",
          "What are the current post-study work rights, and what is the official source for that?",
          "Does the institution have placement or internship relationships with employers in the region?",
          "What is the total cost including living, and what does the visa route require me to show?",
        ],
      },
      {
        heading: "On scholarships",
        paras: [
          "Funding tends to be specific rather than general — tied to a nationality, a subject, a level of study, or a particular institution's own endowment. Broad searches return noise; narrow ones return candidates.",
          "Deadlines are the recurring trap. Many close months before the intake they fund, and several require admission or a language certificate already in hand. Build the funding calendar before the application calendar, not after it.",
        ],
      },
    ],
  },
  {
    slug: "spotting-a-fake-job-offer",
    title: "How to tell a real international job offer from a fake one",
    excerpt:
      "The patterns are consistent and learnable. Five signals that should stop you before any money changes hands.",
    category: "Global careers",
    pathway: "careers",
    readMinutes: 5,
    updated: "2026-08-01",
    image: "/images/path-careers.webp",
    imageAlt: "A quiet workspace beside a window overlooking a city",
    body: [
      {
        heading: "Why this is the first thing to learn",
        paras: [
          "International recruitment attracts fraud because the candidate is far away, unfamiliar with local norms, and highly motivated. The good news is that fraudulent offers follow a small number of repeated patterns.",
        ],
      },
      {
        heading: "1. Payment before process",
        paras: [
          "A demand for a significant upfront fee — especially for a 'reservation', 'slot' or 'guarantee' — before any interview or documented offer is the most common pattern. Legitimate third-party costs do exist: government fees, translation, credential evaluation, medical checks. The difference is that these are payable to the named institution charging them, are itemised, and can be verified independently.",
        ],
      },
      {
        heading: "2. A guarantee nobody can give",
        paras: [
          "No recruiter controls a visa decision, and no recruiter can guarantee a job. Both outcomes rest with parties who are not in the room — the employer and a national authority. A guarantee is either a misunderstanding of the process or a deliberate misrepresentation of it.",
        ],
      },
      {
        heading: "3. An employer you cannot independently find",
        paras: [
          "Verify the company exists in the destination country's public business register. Check that the role appears on the employer's own careers page. Confirm the recruiter's email domain matches a real organisation. An offer that survives none of these checks is not an offer.",
        ],
      },
      {
        heading: "4. Pressure on the clock",
        paras: [
          "Urgency is the standard tool for preventing verification. Real hiring processes tolerate you taking a day to check something; a process that collapses under 24 hours of scrutiny was designed to.",
        ],
      },
      {
        heading: "5. Eligibility nobody mentioned",
        paras: [
          "If no one has asked about your qualifications, your language level or your permit category, no one has assessed whether you can legally take the role. A serious recruiter raises eligibility early, because it determines whether the rest is worth doing.",
        ],
        list: [
          "Ask for the employer's full registered name and address",
          "Ask which permit category the role falls under",
          "Ask what happens to any money paid if the application is refused",
          "Ask for the fee structure in writing, before you commit",
        ],
      },
    ],
  },
  {
    slug: "why-lithuania-for-fintech",
    title: "Why Lithuania became Europe's fintech entry point",
    excerpt:
      "A deliberate policy position, an English-operating regulator and single-market access. What that means, and what it does not.",
    category: "Business setup",
    pathway: "business",
    readMinutes: 7,
    updated: "2026-08-01",
    image: "/images/atmos-fintech.webp",
    imageAlt: "Earth at night from orbit, city lights forming a network",
    body: [
      {
        heading: "The short version",
        paras: [
          "Lithuania set out, as a matter of national policy, to become the most accessible place in the European Union to authorise a payments or e-money business. It built regulatory capacity, ran processes in English, and engaged directly with applicants. The result is the largest licensed fintech population in the EU.",
        ],
      },
      {
        heading: "What an EU licence actually gives you",
        paras: [
          "The commercial logic is passporting. An institution authorised in one member state can, subject to notification procedures, provide its services across the others. You are not authorising into a country of under three million people — you are authorising into the single market.",
          "This is why the jurisdiction's own size is largely beside the point, and why comparing Lithuania to a domestic market misreads the decision entirely.",
        ],
      },
      {
        heading: "What accessible does not mean",
        paras: [
          "Accessible is not the same as easy, and it is emphatically not the same as lax. A regulator that processes a high volume of applications develops a fast, well-calibrated instinct for underprepared ones.",
          "Applications are assessed on capital, governance, controls and people. A strong commercial concept with a thin compliance framework and no appointable officers is a weak application, regardless of how good the product is.",
        ],
        list: [
          "Initial capital evidenced to the standard for your licence category",
          "Governance with genuine local substance and decision-making",
          "An AML/CFT framework written for your model, not adapted from a template",
          "Named, qualified compliance and MLRO appointments who withstand assessment",
        ],
      },
      {
        heading: "Choosing the right licence",
        paras: [
          "Payment institution, electronic money institution, specialised bank and crypto-asset service provider authorisations carry different permissions, different capital requirements and different obligations. Founders frequently target a broader licence than their model needs.",
          "Scoping this properly at the start is cheap. Discovering it midway through an application is not.",
        ],
      },
      {
        heading: "Before you commit",
        paras: [
          "Requirements and thresholds are set by EU and Lithuanian law and are revised over time. Confirm the current position for your specific licence category with a licensed advisor before making capital or hiring commitments on the basis of any article — including this one.",
        ],
      },
    ],
  },
  {
    slug: "eu-company-first-90-days",
    title: "Your EU company is registered. Now what?",
    excerpt:
      "The certificate is day one. Banking, VAT, payroll and reporting are what decide whether the entity works.",
    category: "Business setup",
    pathway: "business",
    readMinutes: 6,
    updated: "2026-08-01",
    image: "/images/path-business.webp",
    imageAlt: "Modern glass office towers seen from below",
    body: [
      {
        heading: "Registration is not operation",
        paras: [
          "A registered company can legally exist and practically do nothing. It cannot receive payment without a bank account. It cannot invoice properly across the single market without the right tax registrations. It cannot employ anyone without payroll infrastructure.",
          "Most of the pain founders report in the first year traces back to treating incorporation as the finish line rather than the starting one.",
        ],
      },
      {
        heading: "Banking is the real bottleneck",
        paras: [
          "Account opening is a compliance decision made by the bank, not an administrative formality. Institutions assess the ownership structure, the business model, the origin of funds and the substance of the operation.",
          "Non-resident ownership, complex holding chains and higher-risk sectors all extend the process. Prepare the application as the compliance document it is — and be sceptical of anyone who guarantees the outcome, because it is not theirs to guarantee.",
        ],
      },
      {
        heading: "Registrations that unlock actual trading",
        paras: [
          "Which of these you need depends on what your company does. Getting the assessment right early avoids retrospective corrections that are far more expensive than the original filing.",
        ],
        list: [
          "VAT registration, where your activity and turnover require it",
          "EORI, if you move goods across the customs border",
          "Employer registration, before your first hire rather than after",
          "Beneficial ownership disclosure to the relevant register",
        ],
      },
      {
        heading: "Build the reporting calendar on day one",
        paras: [
          "Monthly and annual obligations begin from the first period, not from the first sale. Penalties for late filing accrue automatically and are entirely avoidable.",
          "Assign the responsibility explicitly. The most common failure is not a missed rule — it is an obligation that everyone assumed someone else was handling.",
        ],
      },
    ],
  },
  {
    slug: "getting-your-cv-read-in-europe",
    title: "Getting your CV read by a European employer",
    excerpt:
      "Structure, evidence and gaps are read differently here. What to change, and what to leave alone.",
    category: "Global careers",
    pathway: "careers",
    readMinutes: 5,
    updated: "2026-08-01",
    image: "/images/path-study.webp",
    imageAlt: "Colleagues reviewing work together on a laptop",
    body: [
      {
        heading: "Different conventions, not higher standards",
        paras: [
          "A CV that performs well in one market can underperform in another for reasons that have nothing to do with your ability. The conventions differ, and the reader is scanning against expectations you may not share.",
        ],
      },
      {
        heading: "What European recruiters generally expect",
        paras: [
          "Norms vary by country and sector, so verify against the specific market. As a general orientation:",
        ],
        list: [
          "Two pages at most for the majority of roles",
          "Reverse-chronological order, with clear start and end dates",
          "Outcomes with figures attached, rather than duties listed",
          "Explicit language levels, ideally against the CEFR scale",
          "A plain statement of your work authorisation position",
        ],
      },
      {
        heading: "The personal-details question",
        paras: [
          "Several European markets have moved away from photographs, dates of birth, marital status and nationality on CVs, partly for anti-discrimination reasons. Others still expect some of it. Where the norm is to omit these, including them can read as unfamiliarity with the market.",
        ],
      },
      {
        heading: "Address authorisation directly",
        paras: [
          "Recruiters screening international applications are assessing, early and often silently, whether hiring you is legally straightforward. Leaving that unstated invites the least favourable assumption.",
          "One clear line about your current status and what would be required is more effective than omitting the subject and hoping it comes up later.",
        ],
      },
      {
        heading: "Explain gaps rather than hiding them",
        paras: [
          "Unexplained gaps generate questions; explained ones rarely do. A short factual note — study, caregiving, relocation, health, a failed venture — closes the loop and costs you nothing.",
        ],
      },
    ],
  },
  {
    slug: "questions-to-ask-any-advisor",
    title: "Twelve questions to ask any international advisor",
    excerpt:
      "Including us. If a firm cannot answer these plainly and in writing, that is your answer.",
    category: "Choosing an advisor",
    pathway: "careers",
    readMinutes: 4,
    updated: "2026-08-01",
    image: "/images/dest-vilnius-old.webp",
    imageAlt: "Panoramic rooftop view across Vilnius old town",
    body: [
      {
        heading: "Why we published this",
        paras: [
          "The international mobility industry has a trust problem, and vague answers are how most bad engagements begin. These are the questions we would want a member of our own family to ask — and they apply to us as much as to anyone else.",
        ],
      },
      {
        heading: "On money",
        paras: [],
        list: [
          "What is the total cost, and what specifically is excluded from it?",
          "Which payments go to you, and which go to a third party such as a government or a translator?",
          "What happens to my money if the application is refused?",
          "Is the fee structure available in writing before I commit?",
        ],
      },
      {
        heading: "On the process",
        paras: [],
        list: [
          "Who actually performs the regulated steps — you, or a licensed partner firm?",
          "What is your honest assessment of my chances, including the weak points?",
          "What is the realistic timeline, and what most often causes it to slip?",
          "What is required from me, and by when?",
        ],
      },
      {
        heading: "On accountability",
        paras: [],
        list: [
          "Are you regulated, and if so by whom? If not, say so plainly.",
          "Can I speak to a client with a case similar to mine?",
          "What is outside your control, and what do you take responsibility for?",
          "How do I raise a complaint, and to whom does it go?",
        ],
      },
      {
        heading: "The pattern to watch for",
        paras: [
          "You are not testing for perfect answers. You are testing whether a firm will say 'that is outside our control', 'that depends on the authority', or 'I do not know, let me confirm'.",
          "An advisor who is never uncertain about a process governed by other people's decisions is telling you something important.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const articleCategories = Array.from(
  new Set(articles.map((a) => a.category))
);
