/**
 * INTAKE FORM DEFINITIONS
 * ---------------------------------------------------------------------------
 * The student admission form (§8), the career profile (§12) and the business
 * intake (§14), defined once as data.
 *
 * WHY DATA RATHER THAN THREE HAND-BUILT FORMS
 *
 * The server validates against these definitions and the client renders from
 * the same ones. A field that is not in this file cannot be rendered, cannot be
 * saved, and cannot be required — so the form the user sees and the rules the
 * API enforces are physically incapable of drifting apart. Adding a question is
 * one entry here, not a component edit plus a validator edit that someone
 * forgets to keep in step.
 *
 * NOTHING HERE ASSERTS A FACT. These are questions the business asks a new
 * client. Where a question touches on outcomes — visa likelihood, employment,
 * funding — the wording stays neutral and promises nothing.
 */

export type FieldType = "text" | "email" | "tel" | "date" | "number" | "select" | "multiselect" | "textarea";

export type IntakeField = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Shown under the field. Use it to explain WHY something is asked. */
  hint?: string;
  /** Characters. Applied on the server as a hard slice, not just a UI maxlength. */
  max?: number;
};

export type IntakeStep = {
  key: string;
  title: string;
  /** One sentence on what this step is for. Reduces the sense of a wall of fields. */
  blurb: string;
  fields: IntakeField[];
};

export type IntakeDefinition = {
  pathway: "study" | "career" | "business";
  title: string;
  steps: IntakeStep[];
};

/** Session role → the intake that role fills in. Derived server-side, never posted. */
export const PATHWAY_FOR_ROLE = {
  student: "study",
  professional: "career",
  business: "business",
} as const;

/* ------------------------------------------------------ shared fragments */

const CONTACT_FIELDS: IntakeField[] = [
  { key: "fullName", label: "Full name (as in your passport)", type: "text", required: true, max: 120 },
  { key: "dateOfBirth", label: "Date of birth", type: "date", required: true },
  { key: "nationality", label: "Nationality", type: "text", required: true, max: 60 },
  { key: "countryOfResidence", label: "Country of residence", type: "text", required: true, max: 60 },
  { key: "city", label: "City", type: "text", max: 60 },
  { key: "phone", label: "Phone / WhatsApp", type: "tel", required: true, max: 40 },
  {
    key: "altEmail",
    label: "Alternative email",
    type: "email",
    max: 120,
    hint: "Optional. Useful if your main address stops working mid-process.",
  },
];

const ENGLISH_TESTS = [
  "IELTS Academic",
  "IELTS General",
  "TOEFL iBT",
  "PTE Academic",
  "Duolingo English Test",
  "Cambridge C1/C2",
  "Medium of instruction was English",
  "Not taken yet",
];

/* ------------------------------------------------------------- STUDY (§8) */

const STUDY: IntakeDefinition = {
  pathway: "study",
  title: "Study abroad application",
  steps: [
    {
      key: "personal",
      title: "Personal information",
      blurb: "The basics, exactly as they appear on your passport.",
      fields: CONTACT_FIELDS,
    },
    {
      key: "academic",
      title: "Academic background",
      blurb: "What you have studied so far. Approximate grades are fine at this stage.",
      fields: [
        {
          key: "highestQualification",
          label: "Highest completed qualification",
          type: "select",
          required: true,
          options: [
            "Secondary school / high school",
            "Diploma / associate degree",
            "Bachelor's degree",
            "Master's degree",
            "Doctorate",
          ],
        },
        { key: "institution", label: "Institution name", type: "text", required: true, max: 140 },
        { key: "fieldOfStudy", label: "Field of study", type: "text", required: true, max: 100 },
        { key: "graduationYear", label: "Year completed (or expected)", type: "number", required: true },
        {
          key: "grade",
          label: "Final grade / GPA",
          type: "text",
          max: 40,
          hint: "In whatever scale your institution uses — we convert it.",
        },
        {
          key: "gaps",
          label: "Any gaps in your education?",
          type: "textarea",
          max: 600,
          hint: "A gap is not a problem. Explaining it up front saves questions later.",
        },
      ],
    },
    {
      key: "preferences",
      title: "Study preferences",
      blurb: "What you want to study, and when.",
      fields: [
        {
          key: "intendedLevel",
          label: "Level you want to study",
          type: "select",
          required: true,
          options: ["Bachelor's", "Master's", "PhD / research", "Foundation / pathway", "Professional qualification"],
        },
        { key: "intendedField", label: "Subject or field", type: "text", required: true, max: 100 },
        {
          key: "intake",
          label: "Preferred intake",
          type: "select",
          required: true,
          options: ["Next 6 months", "6–12 months", "More than a year away", "Undecided"],
        },
        {
          key: "studyMode",
          label: "Study mode",
          type: "select",
          options: ["Full time on campus", "Part time", "Open to either"],
        },
      ],
    },
    {
      key: "destinations",
      title: "Preferred countries",
      blurb: "Where you would like to study. Choose as many as genuinely interest you.",
      fields: [
        {
          key: "countries",
          label: "Countries of interest",
          type: "multiselect",
          required: true,
          options: [
            "Lithuania", "Poland", "Germany", "Netherlands", "Ireland",
            "Latvia", "Estonia", "Czechia", "Hungary", "Finland",
            "Sweden", "Denmark", "Spain", "Italy", "France", "Open to advice",
          ],
        },
        {
          key: "countryReason",
          label: "What is drawing you to those countries?",
          type: "textarea",
          max: 600,
          hint: "Cost, language, family, work rights after study — whatever is actually driving it.",
        },
      ],
    },
    {
      key: "programmes",
      title: "University & programme preferences",
      blurb: "Skip anything you have not decided yet — this is a starting point, not a commitment.",
      fields: [
        { key: "targetUniversities", label: "Universities you have in mind", type: "textarea", max: 600 },
        { key: "targetProgrammes", label: "Specific programmes", type: "textarea", max: 600 },
        {
          key: "priority",
          label: "What matters most to you?",
          type: "select",
          options: [
            "Lowest total cost",
            "Ranking and reputation",
            "Work opportunities after study",
            "Speed of admission",
            "Specific subject specialism",
          ],
        },
      ],
    },
    {
      key: "language",
      title: "English language",
      blurb: "Most institutions ask for evidence of English. If you have not tested yet, say so.",
      fields: [
        { key: "englishTest", label: "Test taken", type: "select", required: true, options: ENGLISH_TESTS },
        { key: "englishScore", label: "Overall score", type: "text", max: 40 },
        { key: "englishDate", label: "Date taken", type: "date" },
        {
          key: "otherLanguages",
          label: "Other languages you speak",
          type: "text",
          max: 200,
        },
      ],
    },
    {
      key: "finance",
      title: "Financial information",
      blurb:
        "Institutions and immigration authorities both ask how studies will be funded. Answering honestly here means we only propose options that are actually open to you.",
      fields: [
        {
          key: "fundingSource",
          label: "How do you expect to fund your studies?",
          type: "select",
          required: true,
          options: [
            "Self funded",
            "Family sponsored",
            "Bank loan",
            "Employer sponsored",
            "Scholarship required",
            "Combination",
            "Not yet decided",
          ],
        },
        {
          key: "annualBudget",
          label: "Approximate annual budget",
          type: "text",
          required: true,
          max: 60,
          hint: "Tuition plus living costs, in any currency. A range is fine.",
        },
        {
          key: "scholarshipInterest",
          label: "Scholarship interest",
          type: "select",
          required: true,
          options: ["Essential — I cannot proceed without one", "Helpful but not essential", "Not needed"],
        },
      ],
    },
    {
      key: "documents",
      title: "Documents",
      blurb:
        "Nothing to upload here — the Documents area handles that, so you can come back to it whenever a file is ready.",
      fields: [
        {
          key: "documentsReady",
          label: "Which documents do you already have?",
          type: "multiselect",
          options: [
            "Passport",
            "Academic transcripts",
            "Degree certificate",
            "English test result",
            "CV",
            "Statement of purpose",
            "Reference letters",
            "Proof of funds",
          ],
        },
        { key: "documentNotes", label: "Anything we should know about your documents?", type: "textarea", max: 600 },
      ],
    },
    {
      key: "review",
      title: "Review & submit",
      blurb: "Last chance to add anything. You can still talk to us about changes after submitting.",
      fields: [
        {
          key: "additionalInfo",
          label: "Anything else we should know?",
          type: "textarea",
          max: 1500,
          hint: "Previous visa refusals, health matters, dependants travelling with you — anything that affects the route.",
        },
        {
          key: "declaration",
          label: "I confirm the information above is accurate to the best of my knowledge",
          type: "select",
          required: true,
          options: ["Yes, I confirm"],
          hint: "Institutions and immigration authorities act on what you tell us.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------ CAREER (§12) */

const CAREER: IntakeDefinition = {
  pathway: "career",
  title: "Career profile",
  steps: [
    {
      key: "personal",
      title: "Personal information",
      blurb: "The basics, exactly as they appear on your passport.",
      fields: CONTACT_FIELDS,
    },
    {
      key: "summary",
      title: "Professional summary",
      blurb: "In your own words — this is what an employer reads first.",
      fields: [
        { key: "currentTitle", label: "Current job title", type: "text", required: true, max: 120 },
        {
          key: "summaryText",
          label: "Professional summary",
          type: "textarea",
          required: true,
          max: 1200,
          hint: "Three or four sentences. What you do, who for, and what you are known for.",
        },
        {
          key: "totalExperience",
          label: "Total years of experience",
          type: "select",
          required: true,
          options: ["Under 2", "2–5", "5–10", "10–15", "15+"],
        },
      ],
    },
    {
      key: "education",
      title: "Education",
      blurb: "Your highest qualification, plus anything directly relevant to the roles you want.",
      fields: [
        {
          key: "highestQualification",
          label: "Highest qualification",
          type: "select",
          required: true,
          options: [
            "Secondary school",
            "Vocational / trade certification",
            "Diploma",
            "Bachelor's degree",
            "Master's degree",
            "Doctorate",
          ],
        },
        { key: "qualificationField", label: "Field", type: "text", required: true, max: 100 },
        { key: "qualificationInstitution", label: "Institution", type: "text", max: 140 },
        { key: "qualificationYear", label: "Year completed", type: "number" },
        {
          key: "certifications",
          label: "Professional certifications or licences",
          type: "textarea",
          max: 600,
          hint: "Several European roles are regulated. Licences matter more here than they might at home.",
        },
      ],
    },
    {
      key: "experience",
      title: "Work experience",
      blurb: "Your last two or three roles is plenty. Your CV carries the rest.",
      fields: [
        { key: "employmentHistory", label: "Recent roles", type: "textarea", required: true, max: 2000, hint: "Employer, title, dates, and what you were responsible for." },
        { key: "currentEmployer", label: "Current employer", type: "text", max: 140 },
        { key: "noticePeriod", label: "Notice period", type: "select", options: ["Immediately available", "2 weeks", "1 month", "2 months", "3 months or more"] },
      ],
    },
    {
      key: "skills",
      title: "Skills & industry",
      blurb: "What you want to be hired for.",
      fields: [
        { key: "keySkills", label: "Key skills", type: "textarea", required: true, max: 800 },
        {
          key: "industry",
          label: "Industry",
          type: "select",
          required: true,
          options: [
            "Technology & software", "Engineering", "Healthcare & nursing", "Finance & fintech",
            "Logistics & transport", "Construction", "Hospitality", "Manufacturing",
            "Education", "Skilled trades", "Other",
          ],
        },
        { key: "targetRoles", label: "Roles you are targeting", type: "text", required: true, max: 200 },
      ],
    },
    {
      key: "preferences",
      title: "Location & expectations",
      blurb: "Where you want to work, and what the move needs to be worth.",
      fields: [
        {
          key: "preferredCountries",
          label: "Preferred countries",
          type: "multiselect",
          required: true,
          options: [
            "Lithuania", "Poland", "Germany", "Netherlands", "Ireland",
            "Latvia", "Estonia", "Czechia", "Sweden", "Denmark",
            "Belgium", "Austria", "Open to advice",
          ],
        },
        { key: "preferredCities", label: "Preferred cities", type: "text", max: 200 },
        {
          key: "salaryExpectation",
          label: "Salary expectation",
          type: "text",
          max: 80,
          hint: "Annual gross, any currency. A range is fine — it helps us rule out roles that would waste your time.",
        },
        {
          key: "relocationReadiness",
          label: "How soon could you relocate?",
          type: "select",
          required: true,
          options: ["Immediately", "1–3 months", "3–6 months", "6–12 months", "Exploring only"],
        },
      ],
    },
    {
      key: "authorisation",
      title: "Work authorisation & languages",
      blurb:
        "This determines which routes are actually open to you, so an accurate answer here saves the most time.",
      fields: [
        {
          key: "workAuthorisation",
          label: "Current EU work authorisation",
          type: "select",
          required: true,
          options: [
            "None — would need sponsorship",
            "EU/EEA citizen",
            "EU permanent residence",
            "Current EU work permit",
            "EU Blue Card holder",
            "Spouse/family permit",
            "Not sure",
          ],
        },
        {
          key: "priorRefusals",
          label: "Any previous visa refusals?",
          type: "select",
          options: ["No", "Yes — happy to discuss"],
          hint: "A past refusal does not end the conversation, but hiding one can.",
        },
        { key: "languages", label: "Languages and level", type: "text", required: true, max: 240 },
      ],
    },
    {
      key: "review",
      title: "Review & submit",
      blurb: "Add anything that does not fit the boxes above.",
      fields: [
        { key: "portfolioUrl", label: "LinkedIn or portfolio URL", type: "text", max: 300 },
        { key: "additionalInfo", label: "Anything else we should know?", type: "textarea", max: 1500 },
        {
          key: "declaration",
          label: "I confirm the information above is accurate to the best of my knowledge",
          type: "select",
          required: true,
          options: ["Yes, I confirm"],
          hint: "Employers act on what we send them, which is what you tell us here.",
        },
      ],
    },
  ],
};

/* ---------------------------------------------------------- BUSINESS (§14) */

const BUSINESS: IntakeDefinition = {
  pathway: "business",
  title: "Business intake",
  steps: [
    {
      key: "company",
      title: "Company information",
      blurb: "Your existing entity, if you have one. If you do not yet, say so — that is a normal starting point.",
      fields: [
        { key: "companyName", label: "Company name", type: "text", required: true, max: 160, hint: "Or the working name if it is not yet incorporated." },
        {
          key: "incorporationStatus",
          label: "Incorporation status",
          type: "select",
          required: true,
          options: [
            "Not yet incorporated anywhere",
            "Incorporated outside the EU",
            "Incorporated inside the EU",
            "Both EU and non-EU entities",
          ],
        },
        { key: "registrationNumber", label: "Registration number", type: "text", max: 80 },
        { key: "yearFounded", label: "Year founded", type: "number" },
        { key: "website", label: "Website", type: "text", max: 240 },
      ],
    },
    {
      key: "contact",
      title: "Contact person",
      blurb: "Who we deal with day to day.",
      fields: [
        { key: "contactName", label: "Full name", type: "text", required: true, max: 120 },
        { key: "contactRole", label: "Role in the company", type: "text", required: true, max: 100 },
        { key: "contactPhone", label: "Phone / WhatsApp", type: "tel", required: true, max: 40 },
        { key: "contactEmail", label: "Email", type: "email", max: 120 },
        {
          key: "isAuthorised",
          label: "Are you authorised to sign on behalf of the company?",
          type: "select",
          required: true,
          options: ["Yes", "No — someone else signs", "Not yet decided"],
        },
      ],
    },
    {
      key: "profile",
      title: "Business type & industry",
      blurb: "What the business actually does.",
      fields: [
        {
          key: "businessType",
          label: "Business type",
          type: "select",
          required: true,
          options: ["Private limited company", "Sole trader", "Partnership", "Branch of a foreign company", "Not decided yet"],
        },
        {
          key: "industry",
          label: "Industry",
          type: "select",
          required: true,
          options: [
            "Technology & software", "Fintech & payments", "E-commerce & retail",
            "Logistics & transport", "Manufacturing", "Professional services",
            "Construction & real estate", "Healthcare", "Hospitality", "Other",
          ],
        },
        { key: "activityDescription", label: "Describe your activity", type: "textarea", required: true, max: 1200 },
        {
          key: "headcount",
          label: "Current headcount",
          type: "select",
          options: ["Just me", "2–10", "11–50", "51–200", "200+"],
        },
      ],
    },
    {
      key: "markets",
      title: "Current & target markets",
      blurb: "Where you operate now, and where you want to be.",
      fields: [
        { key: "currentMarkets", label: "Countries you operate in today", type: "text", required: true, max: 240 },
        {
          key: "targetMarkets",
          label: "Target markets",
          type: "multiselect",
          required: true,
          options: [
            "Lithuania", "Poland", "Germany", "Netherlands", "Ireland",
            "Latvia", "Estonia", "Czechia", "Spain", "France",
            "EU-wide", "Open to advice",
          ],
        },
        {
          key: "marketRationale",
          label: "Why those markets?",
          type: "textarea",
          max: 800,
          hint: "Customers, suppliers, talent, regulation — the real reason is the useful one.",
        },
      ],
    },
    {
      key: "services",
      title: "Services required",
      blurb: "What you want from us. Choose everything that applies.",
      fields: [
        {
          key: "servicesRequired",
          label: "Services required",
          type: "multiselect",
          required: true,
          options: [
            "Company formation",
            "Market entry strategy",
            "International expansion",
            "Fintech / payments licensing",
            "Accounting & tax compliance",
            "Recruitment & hiring",
            "Investor or founder relocation",
            "Partnership introductions",
            "General consultation",
          ],
        },
        {
          key: "timeline",
          label: "Timeline",
          type: "select",
          required: true,
          options: ["Immediately", "Within 3 months", "3–6 months", "6–12 months", "Exploring only"],
        },
        {
          key: "budgetRange",
          label: "Indicative budget",
          type: "text",
          max: 80,
          hint: "Optional, but it lets us tell you early if the scope and the budget do not meet.",
        },
      ],
    },
    {
      key: "goals",
      title: "Expansion goals",
      blurb: "What success looks like, in your terms.",
      fields: [
        { key: "objectives", label: "What are you trying to achieve?", type: "textarea", required: true, max: 1500 },
        {
          key: "concerns",
          label: "What worries you most about this move?",
          type: "textarea",
          max: 1000,
          hint: "Naming the risk early is how it gets addressed rather than discovered.",
        },
      ],
    },
    {
      key: "documents",
      title: "Company documents",
      blurb: "Nothing to upload here — the Documents area handles files whenever you are ready.",
      fields: [
        {
          key: "documentsReady",
          label: "Which documents do you already have?",
          type: "multiselect",
          options: [
            "Certificate of incorporation",
            "Articles of association",
            "Shareholder register",
            "Passports of shareholders",
            "Proof of address",
            "Financial statements",
            "Business plan",
            "Source of funds evidence",
          ],
        },
        { key: "documentNotes", label: "Anything we should know about your documents?", type: "textarea", max: 800 },
      ],
    },
    {
      key: "review",
      title: "Review & submit",
      blurb: "Anything else before this reaches an advisor.",
      fields: [
        { key: "additionalInfo", label: "Additional information", type: "textarea", max: 1500 },
        {
          key: "declaration",
          label: "I confirm the information above is accurate to the best of my knowledge",
          type: "select",
          required: true,
          options: ["Yes, I confirm"],
          hint: "Regulated filings depend on it. Nothing here is legal, tax or financial advice.",
        },
      ],
    },
  ],
};

const DEFINITIONS = { study: STUDY, career: CAREER, business: BUSINESS } as const;

export function intakeFor(pathway: keyof typeof DEFINITIONS): IntakeDefinition {
  return DEFINITIONS[pathway];
}

/* ------------------------------------------------------------- validation */

/**
 * Whitelist, coerce and (optionally) require.
 *
 * Runs on the SERVER for every save and every submit. Keys the step does not
 * define are dropped rather than rejected — a stale browser tab posting an old
 * field should not fail the whole save, but it must not write that field either.
 */
export function validateStep(
  step: IntakeStep,
  answers: Record<string, unknown>,
  opts: { requireAll: boolean }
): { clean: Record<string, unknown>; missing: string[] } {
  const clean: Record<string, unknown> = {};
  const missing: string[] = [];

  for (const field of step.fields) {
    const raw = answers[field.key];
    let value: unknown;

    if (field.type === "multiselect") {
      const list = Array.isArray(raw) ? raw : [];
      value = list
        .filter((v): v is string => typeof v === "string")
        // Only values the question actually offered.
        .filter((v) => !field.options || field.options.includes(v))
        .slice(0, 30);
      if (opts.requireAll && field.required && (value as string[]).length === 0) {
        missing.push(field.label);
      }
      // An empty array is a meaningful "answered, chose nothing" only once the
      // key exists; don't write it on a save that never touched this field.
      if (raw !== undefined) clean[field.key] = value;
      continue;
    }

    if (raw === undefined || raw === null) {
      if (opts.requireAll && field.required) missing.push(field.label);
      continue;
    }

    const text = String(raw).trim().slice(0, field.max ?? 500);

    if (field.type === "select" && field.options && text && !field.options.includes(text)) {
      // A value outside the offered set is dropped, not stored.
      if (opts.requireAll && field.required) missing.push(field.label);
      continue;
    }

    if (!text) {
      if (opts.requireAll && field.required) missing.push(field.label);
      clean[field.key] = "";
      continue;
    }

    value = field.type === "number" ? Number(text) : text;
    if (field.type === "number" && !Number.isFinite(value as number)) {
      if (opts.requireAll && field.required) missing.push(field.label);
      continue;
    }

    clean[field.key] = value;
  }

  return { clean, missing };
}

/** Percentage of required fields answered, across the whole definition. */
export function intakeCompletion(
  definition: IntakeDefinition,
  data: Record<string, unknown>
): { percent: number; answered: number; total: number } {
  const required = definition.steps.flatMap((s) => s.fields.filter((f) => f.required));
  if (!required.length) return { percent: 100, answered: 0, total: 0 };

  const answered = required.filter((f) => {
    const v = data[f.key];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== "";
  }).length;

  return {
    percent: Math.round((answered / required.length) * 100),
    answered,
    total: required.length,
  };
}
