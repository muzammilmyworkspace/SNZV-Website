import type { PathwayKey } from "./pathways";
import type { FAQ } from "./services";

/**
 * PILLAR PAGE CONTENT — the three audience landing pages.
 * Claims are limited to services verified on the live snzventures.com.
 * `contentRequired` lists gaps the client must fill; these render as visible
 * [CONTENT REQUIRED] blocks in development and are hidden in production.
 */

export type Pillar = {
  key: PathwayKey;
  slug: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    image: string;
    imageAlt: string;
    /**
     * Hero slideshow frames, in order. Up to four — the component caps it,
     * because every frame past the first is a full-size download for a hero
     * most visitors scroll past in seconds.
     *
     * `image` above stays as the single-frame fallback and as the source for
     * OG/social previews, which cannot animate.
     */
    images?: { src: string; alt: string }[];
    primaryCta: string;
    secondaryCta: string;
  };
  /** "The challenge" — what the reader is actually up against. */
  challenge: { title: string; lead: string; items: { title: string; body: string }[] };
  /** "What this actually requires" — reframes the problem as a checklist. */
  requires: { title: string; lead: string; items: string[] };
  /** "How we help" — mapped to verified services. */
  help: { title: string; lead: string; items: { title: string; body: string; href?: string }[] };
  process: { step: string; name: string; body: string }[];
  faqs: FAQ[];
  caveat: string;
  contentRequired: string[];
};

export const pillars: Record<PathwayKey, Pillar> = {
  /* ------------------------------------------------------------------ */
  study: {
    key: "study",
    slug: "study-abroad",
    hero: {
      eyebrow: "For students",
      title: "Your Postcode Shouldn't Decide Your Ceiling.",
      lead: "Studying abroad is not really an education decision. It is a career decision that happens to start with a course. We help you make it in that order.",
      image: "/images/atmos-library.webp",
      images: [
        {
          src: "/images/study-campus.webp",
          alt: "Kazimierz Palace, the historic main building of the University of Warsaw",
        },
        {
          src: "/images/study-vienna.webp",
          alt: "The arcaded courtyard of the University of Vienna",
        },
        {
          src: "/images/atmos-library.webp",
          alt: "Reading room lined with books at a European university library",
        },
        {
          src: "/images/study-graduation.webp",
          alt: "Graduation caps held up at a degree ceremony",
        },
      ],
      imageAlt: "Rows of books lining library shelves",
      primaryCta: "Explore your study path",
      secondaryCta: "Read the guide",
    },
    challenge: {
      title: "Going Global Sounds Simple. Until You Try.",
      lead: "The information is free and endless. What is scarce is knowing which of it applies to you.",
      items: [
        {
          title: "Rankings Answer a Question You Didn't Ask",
          body: "League tables largely measure research output. They do not tell you whether graduates of a specific programme get hired in the city you want to work in.",
        },
        {
          title: "Scholarships Are Specific, Not General",
          body: "Most funding is tied to a nationality, a subject or an institution — and the deadlines close months before the intake they fund.",
        },
        {
          title: "The Rights Attached to the Degree Get Checked Last",
          body: "Post-study work rules differ sharply by country and change with policy. It is the most expensive detail to discover late.",
        },
        {
          title: "Advice Usually Comes from Someone Selling Something",
          body: "Commission-driven placement pushes the institutions that pay, not the ones that fit. You are rarely told which is which.",
        },
      ],
    },
    requires: {
      title: "What Students Are Actually Looking For",
      lead: "Beneath the questions people ask us, it is usually one of these five.",
      items: [
        "A course with a defensible route into employment, not just an offer letter",
        "An honest read on whether their profile is competitive",
        "Funding options that genuinely match their nationality and subject",
        "Clarity on what happens legally after graduation",
        "Someone who says no when the plan does not hold up",
      ],
    },
    help: {
      title: "How SnZ Ventures Helps",
      lead: "We work backwards from the labour market, and we are candid about the limits of what we do.",
      items: [
        {
          title: "Education and Career Mapping",
          body: "We start from where demand is heading in your field, then work back to the subjects and qualifications that put you there. Our recruitment side sees which profiles European employers actually hire — that evidence feeds this conversation.",
        },
        {
          title: "Country and Market Orientation",
          body: "Where your intended profession is in demand, how qualifications are recognised, and what the post-study position looks like in each market we cover.",
        },
        {
          title: "Profile and Documentation Preparation",
          body: "The same standard we apply to professional placements: documents, evidence and presentation built for how the receiving side reads them.",
          href: "/services/international-recruitment",
        },
        {
          title: "The Bridge into Work",
          body: "Because we recruit into European SMEs and regulated firms, the conversation does not end at graduation. That is the connection most study advisors cannot make.",
          href: "/global-careers",
        },
      ],
    },
    process: [
      { step: "01", name: "Discover", body: "What you want to be doing in five years — before we discuss any course." },
      { step: "02", name: "Assess", body: "Your academic record, budget and language position, read honestly." },
      { step: "03", name: "Map", body: "Fields and markets where that ambition is realistic, with the trade-offs stated." },
      { step: "04", name: "Prepare", body: "Documents, evidence and applications built to the expected standard." },
      { step: "05", name: "Decide", body: "You choose, with the downsides on the table alongside the upsides." },
    ],
    faqs: [
      {
        q: "Does SnZ Ventures place students into universities?",
        a: "Our verified strength is education and career pathway advisory — helping you choose subjects and qualifications against real labour-market demand, and preparing your profile. The specific scope of institutional application support is confirmed with you directly, so ask us about your case rather than assuming from this page.",
      },
      {
        q: "Can you get me a scholarship?",
        a: "No advisor awards funding — institutions and governments do. What we can do is help you identify which programmes realistically match your nationality, subject and level, and make sure the calendar is built around their deadlines rather than the intake date.",
      },
      {
        q: "Which countries should I be looking at?",
        a: "That depends on your field, budget and language position more than on any general ranking. Our published destinations are the markets we work in — availability of specific support varies by country, and we tell you which is which.",
      },
      {
        q: "Can I work in Europe after I graduate?",
        a: "Post-study work rights vary by country and change with policy, so we will not state a rule here that might not hold when you graduate. We help you check the current official position for your target country before you commit to it.",
      },
      {
        q: "What does it cost?",
        a: "Fees depend on scope and are confirmed in writing before you commit to anything. Third-party costs — institutions, translation, credential evaluation, government charges — are always identified separately so you can see what goes where.",
      },
    ],
    caveat:
      "SnZ Ventures does not guarantee admission, scholarship awards, visas or employment. Admission decisions rest with institutions and immigration decisions with national authorities.",
    contentRequired: [
      "Confirm exact scope of university application support (does SnZ submit applications, or advise only?)",
      "Confirm whether any institutional partnerships exist — none are currently claimed on this site",
      "Supply student testimonials with written consent, if any exist",
      "Confirm which destination countries the study pathway actively covers",
    ],
  },

  /* ------------------------------------------------------------------ */
  careers: {
    key: "careers",
    slug: "global-careers",
    hero: {
      eyebrow: "For professionals",
      title: "Your Career Shouldn't Be Limited by a Border.",
      lead: "We are the outsourced hiring function for European SMEs and regulated firms — and we recruit across South Asia and the Middle East. Both ends of that corridor are our client, which is why we tell you the truth about your chances.",
      image: "/images/path-careers.webp",
      images: [
        {
          src: "/images/path-careers.webp",
          alt: "Professionals at work in a European office",
        },
        {
          src: "/images/dest-berlin.webp",
          alt: "Museum Island on the Spree, Berlin — Europe's largest labour market",
        },
        {
          src: "/images/plate-europe-dawn.webp",
          alt: "European rooftops at first light",
        },
        {
          src: "/images/careers-airport.webp",
          alt: "Check-in hall at Frankfurt Airport Terminal 3",
        },
      ],
      imageAlt: "A modern workspace beside a window overlooking the city",
      primaryCta: "Explore global careers",
      secondaryCta: "How to spot a fake offer",
    },
    challenge: {
      title: "The Hardest Part Isn't the Job. It's Telling Real from Fake.",
      lead: "Almost everyone who comes to us has already been burned, or knows someone who has.",
      items: [
        {
          title: "Fees Charged Against Roles that Never Existed",
          body: "Upfront payment for a 'reserved slot' is the oldest pattern in this industry, and it still works because people are motivated.",
        },
        {
          title: "Eligibility Decided Before You Ever Apply",
          body: "Qualification recognition, language level and permit category rule most applicants in or out early — usually without anyone explaining that.",
        },
        {
          title: "A CV that Doesn't Travel",
          body: "European employers read structure, evidence and gaps differently. Strong candidates get filtered out for entirely fixable reasons.",
        },
        {
          title: "Nobody Will Say the Word No",
          body: "It is easier to keep someone hopeful than to tell them their profile is not competitive. Hope is the product being sold.",
        },
      ],
    },
    requires: {
      title: "What an International Move Actually Requires",
      lead: "Four things have to line up. A gap in any one of them stops the process.",
      items: [
        "A real vacancy at a named, verifiable employer",
        "Qualifications recognised in the destination country for your profession",
        "The language level the role genuinely requires — not the one you hope it does",
        "A permit category you actually fall inside",
        "Documentation prepared to the standard the employer and authority expect",
      ],
    },
    help: {
      title: "How We Support Professionals",
      lead: "Our mandates come from employers. That shapes everything about how we work with candidates.",
      items: [
        {
          title: "Access to Real, Mandated Roles",
          body: "We place white-collar and blue-collar candidates into European SMEs and regulated firms. You are told which employer and which role — not a category.",
          href: "/services/international-recruitment",
        },
        {
          title: "Eligibility Screening, Done First",
          body: "Qualification recognition, language and permit category checked before you invest time or money in an application.",
        },
        {
          title: "Profile Preparation",
          body: "CV and documentation rebuilt to how European employers actually read them, including how to state your work authorisation position.",
        },
        {
          title: "Relocation Coordination",
          body: "Where a placement proceeds, the permit process and arrival logistics are handled alongside it rather than left to you.",
          href: "/services/investor-relocation",
        },
      ],
    },
    process: [
      { step: "01", name: "Profile", body: "Your qualifications, experience, language level and current status." },
      { step: "02", name: "Screen", body: "An honest read on which markets and roles you are genuinely competitive for." },
      { step: "03", name: "Prepare", body: "CV, evidence and documentation brought to the expected standard." },
      { step: "04", name: "Match", body: "Introduction to mandated roles where your profile fits the requirement." },
      { step: "05", name: "Move", body: "Permit process, arrival and first-day logistics coordinated." },
    ],
    faqs: [
      {
        q: "Can you guarantee me a job in Europe?",
        a: "No. Nobody can, and it is the clearest warning sign in this industry. Hiring decisions belong to employers and immigration decisions to national authorities. What we can give you is a straight assessment of whether your profile is competitive for the roles we are mandated on.",
      },
      {
        q: "Do I have to pay to be considered?",
        a: "Our recruitment mandates come from employers. Any candidate-side cost is stated in writing before you commit, and third-party charges — government fees, translation, credential evaluation, medical checks — are always identified separately. If any fee structure is unclear, ask us to put it in writing.",
      },
      {
        q: "Will my qualifications be recognised?",
        a: "It depends on your profession and the destination country. Regulated professions such as healthcare, engineering and law have formal recognition procedures that take time and evidence. We check this at screening, before you invest in an application.",
      },
      {
        q: "Do I need to speak the local language?",
        a: "Entirely role-dependent. Some employers and sectors operate in English; many operational roles require working proficiency in the local language. We tell you the requirement for a specific vacancy rather than a general rule.",
      },
      {
        q: "Which countries do you place into?",
        a: "The markets listed on our Destinations page. Availability varies by role, sector and permit category at any given time, so ask about your specific profession rather than inferring from the list.",
      },
      {
        q: "What if I'm not eligible right now?",
        a: "We will tell you, and where possible we will tell you what would change that — a language level, a credential evaluation, a period of experience. That is more useful than being kept on a list indefinitely.",
      },
    ],
    caveat:
      "SnZ Ventures does not guarantee employment, work permits or visa outcomes. Hiring decisions rest with employers; immigration decisions rest with the relevant national authority.",
    contentRequired: [
      "Confirm candidate-side fee policy in exact terms for the FAQ",
      "Supply current live vacancy categories, if these should be listed publicly",
      "Confirm which professions/sectors are actively recruited for per country",
      "Supply placed-candidate testimonials with written consent, if any exist",
    ],
  },

  /* ------------------------------------------------------------------ */
  business: {
    key: "business",
    slug: "business-setup",
    hero: {
      eyebrow: "For founders & investors",
      title: "Take Your Business Beyond Borders.",
      lead: "A Lithuanian company reaches 27 member states from day one. We handle the entity, the licensing and the residence permits that let you actually move — coordinated through one point of contact.",
      image: "/images/path-business.webp",
      images: [
        {
          src: "/images/path-business.webp",
          alt: "Glass office towers seen from below",
        },
        {
          src: "/images/business-vilnius.webp",
          alt: "Winter sunrise over Vilnius, Lithuania",
        },
        {
          src: "/images/atmos-fintech.webp",
          alt: "Financial data displayed across trading screens",
        },
        {
          src: "/images/business-boardroom.webp",
          alt: "Conference room at Finlandia Hall, Helsinki",
        },
      ],
      imageAlt: "Glass office towers viewed from street level",
      primaryCta: "Plan your expansion",
      secondaryCta: "Why Lithuania",
    },
    challenge: {
      title: "Registering a Company Is Easy. Operating One Is the Actual Work.",
      lead: "The certificate arrives quickly. Then the real sequence begins, and it is where most expansions stall.",
      items: [
        {
          title: "The Entity Exists but Cannot Transact",
          body: "No bank account, no VAT number, no payroll operator. Legally alive, practically inert.",
        },
        {
          title: "Banking Is a Compliance Decision, Not a Formality",
          body: "Institutions assess ownership, model, source of funds and substance. Non-resident structures take longer, and no one can guarantee the outcome.",
        },
        {
          title: "Licensing Turns on Evidence, Not the Pitch",
          body: "EMI and PI applications are decided on capital, governance and named officers. A strong product with a thin framework is a weak application.",
        },
        {
          title: "The Company and the Visa Are Separate Problems",
          body: "Owning an EU entity does not give you the right to live there. Two processes, two timelines, two sets of criteria.",
        },
      ],
    },
    requires: {
      title: "What Expanding into the EU Actually Requires",
      lead: "Six things, in roughly this order. Skipping one does not save time — it moves the delay later.",
      items: [
        "An entity type matched to your capital, ownership and liability position",
        "Tax and trade registrations that match what you actually do",
        "A banking relationship that survives compliance review",
        "Accounting, payroll and statutory reporting running from period one",
        "Where regulated: capital, governance and appointable officers in place",
        "A residence route, if the founders intend to move",
      ],
    },
    help: {
      title: "How SnZ Ventures Helps",
      lead: "Four services, one coordinator. You are not managing four firms who do not speak to each other.",
      items: [
        {
          title: "Company Formation & Accounting",
          body: "UAB or MB incorporation, legal address, VAT and EORI, then payroll, bookkeeping and corporate secretarial on an ongoing basis.",
          href: "/services/company-formation",
        },
        {
          title: "Fintech Establishment",
          body: "EMI, PI, specialised bank and crypto licensing — scoped, structured and prepared with licensed partner firms and qualified officers.",
          href: "/services/fintech-licensing",
        },
        {
          title: "Investor Relocation",
          body: "Residence permits, family migration, property introductions, tax planning and settlement in the first months.",
          href: "/services/investor-relocation",
        },
        {
          title: "Hiring Your First Team",
          body: "Recruitment into the new entity across white-collar and compliance-critical roles, using the same corridors we run for other employers.",
          href: "/services/international-recruitment",
        },
      ],
    },
    process: [
      { step: "01", name: "Scope", body: "What you intend to do, where, and which structure that genuinely requires." },
      { step: "02", name: "Structure", body: "Entity, ownership, capital and — where regulated — governance." },
      { step: "03", name: "Establish", body: "Incorporation, registrations and banking introduction." },
      { step: "04", name: "Authorise", body: "Where applicable, licensing prepared and submitted via licensed partners." },
      { step: "05", name: "Operate", body: "Accounting, payroll, reporting and hiring from the first period." },
    ],
    faqs: [
      {
        q: "Why Lithuania rather than a larger market?",
        a: "Because of passporting. An entity authorised in one member state can, subject to notification procedures, operate across the others — so you are entering the single market, not a country of under three million people. Lithuania also runs its processes in English and has the EU's largest licensed fintech population.",
      },
      {
        q: "How fast can the company be registered?",
        a: "Lithuanian registration typically completes within a 48-hour window once documents are correctly prepared and signed. Preparation beforehand and banking afterwards both take longer, so plan against the full sequence rather than the filing alone.",
      },
      {
        q: "Can you guarantee a bank account or a licence?",
        a: "No — and be cautious with anyone who does. Banking is the institution's compliance decision and authorisation is the regulator's. We control the quality and completeness of what is submitted, which is where most applications are actually won or lost.",
      },
      {
        q: "Is SnZ Ventures regulated?",
        a: "No. We are an advisory and coordination firm. Notarial, audit, legal and compliance-officer functions are delivered by licensed partner firms and qualified individuals, who are named to you before you commit.",
      },
      {
        q: "Do I have to move to Lithuania?",
        a: "Not to own a company. But licensed institutions face substance expectations — genuine local presence and decision-making — and if the founders intend to relocate, that is a separate process with its own criteria. We scope both together.",
      },
      {
        q: "What does it cost?",
        a: "It depends on entity type, licensing scope and ongoing accounting volume, and it is confirmed in writing before you commit. Third-party costs such as notary, state fees and audit are itemised separately from our own.",
      },
    ],
    caveat:
      "SnZ Ventures is not a regulated financial institution and does not provide legal, tax or audit advice. These are delivered by licensed partner firms. Banking decisions rest with financial institutions, authorisation with the competent regulator, and immigration outcomes with the Migration Department.",
    contentRequired: [
      "Confirm indicative pricing tiers, if these should be published",
      "Confirm named licensed partner firms that may be disclosed publicly",
      "Confirm whether business setup is offered outside Lithuania — currently claimed for Lithuania only",
      "Supply client case studies with written consent, if any exist",
    ],
  },
};

export const pillarList = Object.values(pillars);
