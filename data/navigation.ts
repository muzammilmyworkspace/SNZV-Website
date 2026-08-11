export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: { label: string; href: string; description: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", description: "Who we are and how we work" },
  {
    label: "Study Abroad",
    href: "/study-abroad",
    description: "Education that leads somewhere",
    children: [
      {
        label: "Education & Career Pathways",
        href: "/study-abroad",
        description: "Choose a course against the job market, not a brochure.",
      },
      {
        label: "International Recruitment",
        href: "/services/international-recruitment",
        description: "Where graduates and professionals get placed.",
      },
    ],
  },
  {
    label: "Global Careers",
    href: "/global-careers",
    description: "Work across Europe, legitimately",
    children: [
      {
        label: "For Professionals",
        href: "/global-careers",
        description: "Placement, eligibility and relocation into the EU.",
      },
      {
        label: "For Employers",
        href: "/services/international-recruitment",
        description: "Outsourced hiring for SMEs and regulated firms.",
      },
    ],
  },
  {
    label: "Business Setup",
    href: "/business-setup",
    description: "Build where the market is",
    children: [
      {
        label: "Company Formation & Accounting",
        href: "/services/company-formation",
        description: "UAB / MB incorporation, VAT, EORI, payroll, filings.",
      },
      {
        label: "Fintech Licensing",
        href: "/services/fintech-licensing",
        description: "EMI, PI, specialised bank and crypto authorisation.",
      },
      {
        label: "Investor Relocation",
        href: "/services/investor-relocation",
        description: "Residence permits, family migration, settlement.",
      },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    description: "Where we operate",
  },
  { label: "Insights", href: "/insights", description: "Know before you go" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = [
  {
    heading: "Pathways",
    links: [
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Global Careers", href: "/global-careers" },
      { label: "Business Setup", href: "/business-setup" },
      { label: "Destinations", href: "/destinations" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Company Formation", href: "/services/company-formation" },
      { label: "Fintech Licensing", href: "/services/fintech-licensing" },
      { label: "Investor Relocation", href: "/services/investor-relocation" },
      {
        label: "International Recruitment",
        href: "/services/international-recruitment",
      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
      { label: "Book a Consultation", href: "/contact#journey" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
    ],
  },
];
