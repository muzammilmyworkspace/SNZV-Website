/**
 * LEGAL PAGES — STRUCTURE ONLY.
 * ---------------------------------------------------------------------------
 * ⚠ These are NOT legal advice and are NOT launch-ready.
 *
 * The architecture, headings and GDPR-relevant sections are in place so the
 * pages exist, are linked and are indexable. Every place requiring a company
 * fact or a legal determination is marked [CONFIRM] and MUST be reviewed by a
 * qualified Lithuanian/EU legal advisor before launch. Nothing here invents a
 * registered entity name, company code, DPO, retention period or lawful basis.
 */

export type LegalSection = { heading: string; paras: string[]; list?: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

const REVIEW_NOTE =
  "[CONFIRM] This document is a structural draft. It must be reviewed and completed by a qualified legal advisor before launch.";

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro:
      "How SnZ Ventures collects, uses and protects personal data submitted through this website. " +
      REVIEW_NOTE,
    sections: [
      {
        heading: "Who we are",
        paras: [
          "SnZ Ventures is an advisory firm based in Vilnius, Lithuania. For the purposes of the EU General Data Protection Regulation (GDPR), the data controller is [CONFIRM: registered legal entity name, company code and registered address].",
          "Questions about this policy or your data can be sent to info@snzventures.com.",
        ],
      },
      {
        heading: "What we collect",
        paras: [
          "We collect only what you choose to provide through the enquiry form, plus limited technical data if analytics are enabled.",
        ],
        list: [
          "Contact details you submit: name, email address, and optionally phone or WhatsApp number",
          "Enquiry context: your selected pathway and the answers you give (for example field of study, profession, or business objective)",
          "Any free-text notes you add to your enquiry",
          "Technical and usage data collected by analytics tools, where these are enabled and you have consented",
        ],
      },
      {
        heading: "Why we use it, and our lawful basis",
        paras: [
          "[CONFIRM with legal advisor: the lawful basis relied on for each processing purpose — typically consent for marketing analytics, and legitimate interests or steps prior to entering a contract for responding to enquiries.]",
        ],
        list: [
          "To respond to your enquiry and assess whether we can assist",
          "To provide the advisory services you engage us for",
          "To meet legal, regulatory and accounting obligations",
          "To improve this website, where analytics are enabled",
        ],
      },
      {
        heading: "Who we share it with",
        paras: [
          "We do not sell personal data. Where a matter requires regulated work, we share only what is necessary with the licensed partner firms involved — for example auditors, law firms, notaries or compliance officers — and we identify them to you beforehand.",
          "[CONFIRM: list of processors — hosting provider, email/CRM provider, analytics providers — and whether any transfer data outside the EEA, plus the safeguards used.]",
        ],
      },
      {
        heading: "How long we keep it",
        paras: [
          "[CONFIRM: retention periods for enquiry data, client records and accounting records under Lithuanian law.]",
        ],
      },
      {
        heading: "Your rights",
        paras: [
          "Under the GDPR you have the right to access your data, correct it, request erasure, restrict or object to processing, and request portability. Where processing is based on consent, you may withdraw that consent at any time.",
          "To exercise any of these rights, contact info@snzventures.com. You also have the right to lodge a complaint with the Lithuanian State Data Protection Inspectorate (Valstybinė duomenų apsaugos inspekcija).",
        ],
      },
      {
        heading: "Cookies",
        paras: [
          "This website sets no advertising or analytics cookies unless the corresponding tools are configured and you have consented. See our Cookie Policy for detail.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    intro:
      "The terms on which this website is provided. " + REVIEW_NOTE,
    sections: [
      {
        heading: "About these terms",
        paras: [
          "These terms govern your use of snzventures.com. They do not govern any advisory engagement, which is subject to a separate written agreement.",
          "[CONFIRM: registered legal entity name, company code, registered address and governing law clause.]",
        ],
      },
      {
        heading: "Nature of information on this site",
        paras: [
          "Content on this website is general information and orientation. It is not legal, tax, immigration, financial or investment advice, and must not be relied upon as such.",
          "Rules governing immigration, company law, taxation and financial licensing change over time and vary by jurisdiction and individual circumstances. Always confirm the current position with a qualified advisor or the relevant official authority.",
        ],
      },
      {
        heading: "No guarantees",
        paras: [
          "SnZ Ventures does not guarantee admission to any institution, the award of any scholarship, any offer of employment, the opening of any bank account, the grant of any licence, or any immigration outcome.",
          "These decisions rest solely with the relevant institutions, employers, financial institutions, regulators and national authorities.",
        ],
      },
      {
        heading: "Regulated activities",
        paras: [
          "SnZ Ventures is an advisory and coordination firm and is not a regulated financial institution. Audit, legal representation, notarial acts, licence submissions and AML officer functions are performed by licensed partner firms and qualified individuals.",
        ],
      },
      {
        heading: "Intellectual property",
        paras: [
          "The content, design and brand assets on this site are owned by SnZ Ventures unless otherwise stated. Third-party photography is used under the licences recorded on our Image Credits page.",
        ],
      },
      {
        heading: "Limitation of liability",
        paras: [
          "[CONFIRM with legal advisor: limitation of liability wording appropriate to Lithuanian and EU consumer law.]",
        ],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    intro:
      "What cookies and similar technologies this website uses. " + REVIEW_NOTE,
    sections: [
      {
        heading: "Current position",
        paras: [
          "This website is built so that no analytics or advertising tags load unless they are explicitly configured. If no measurement tools are configured, only strictly necessary technologies required to serve the site are used.",
        ],
      },
      {
        heading: "Categories we may use",
        paras: [
          "Where configured, cookies and similar technologies fall into the following categories.",
        ],
        list: [
          "Strictly necessary — required to deliver the site and its security. These cannot be switched off.",
          "Analytics — measure how the site is used so it can be improved (for example Google Analytics 4, Microsoft Clarity).",
          "Advertising — measure and target campaigns (for example Google Ads, Meta Pixel).",
        ],
      },
      {
        heading: "Consent",
        paras: [
          "[CONFIRM: a consent management solution must be implemented before any analytics or advertising tag is enabled for EU visitors, and this section updated to describe it. Non-essential cookies must not be set before consent is given.]",
        ],
      },
      {
        heading: "Managing cookies",
        paras: [
          "You can block or delete cookies through your browser settings. Doing so may affect how parts of this website function.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    intro:
      "The limits of what this website and SnZ Ventures represent. " +
      REVIEW_NOTE,
    sections: [
      {
        heading: "General information only",
        paras: [
          "Everything published on this website is general orientation. It is not advice on your specific circumstances and creates no advisory relationship.",
        ],
      },
      {
        heading: "No guaranteed outcomes",
        paras: [
          "No admission, scholarship, job offer, bank account, licence, permit or visa can be guaranteed by SnZ Ventures or by any advisor. Any party promising a guaranteed immigration or employment outcome should be treated with caution.",
        ],
      },
      {
        heading: "Third parties and ecosystem references",
        paras: [
          "Institutions named on this site as part of Lithuania's business and fintech ecosystem are referenced to describe the environment SnZ Ventures operates within. Such references do not constitute endorsement, accreditation, partnership or approval by those institutions.",
        ],
      },
      {
        heading: "External links",
        paras: [
          "We are not responsible for the content, accuracy or practices of external websites linked from this site.",
        ],
      },
      {
        heading: "Statistics and figures",
        paras: [
          "[CONFIRM] Any operational figures published on this site must be substantiated by SnZ Ventures before launch. Figures that cannot be evidenced are withheld from display by the site's own data layer.",
        ],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) =>
  legalDocs.find((d) => d.slug === slug);
