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
  },
  {
    label: "Global Careers",
    href: "/global-careers",
    description: "Work across Europe, legitimately",
  },
  {
    label: "Business Setup",
    href: "/business-setup",
    description: "Build where the market is",
  },
  { label: "Contact", href: "/contact", description: "Talk to an advisor" },
];

/**
 * Destinations and Insights were removed from the global header deliberately.
 *
 * Both remain live routes, stay in the sitemap and are still linked from the
 * footer and from in-page content — the destination story now opens on the
 * homepage and continues on /study-abroad, which is where visitors actually
 * look for it. Removing the top-level entries shortened the header to six
 * items and let `Contact` come out of hiding, so the primary conversion path
 * is a nav item rather than a floating button competing with it.
 *
 * Do not re-add them here without also removing them from the homepage and
 * Study Abroad sections, or the same destination is offered three ways.
 */

export const footerNav = [
  {
    heading: "Pathways",
    links: [
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Global Careers", href: "/global-careers" },
      { label: "Business Setup", href: "/business-setup" },
      { label: "Destinations", href: "/destinations" },
      /**
       * Insights sits here because the Company column was removed and it is
       * not in the header either — this is now the only navigation path to
       * /insights. Dropping it would orphan the whole articles section from
       * internal linking.
       */
      { label: "Insights", href: "/insights" },
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
];

/**
 * Legal sits as a fourth column so the footer can end on nothing but the
 * copyright line.
 *
 * These cannot simply be deleted: a privacy policy link has to be reachable
 * for EU visitors, and the disclaimer is what keeps the outcome claims on the
 * rest of the site honest. As a column they take no extra vertical space —
 * they sit beside the existing three rather than below them.
 *
 * "Book a Consultation" was dropped from the Company column: it pointed at
 * /contact#journey while the line above it already pointed at /contact, so the
 * same destination was offered twice.
 */
export const footerLegal = [
  { label: "Privacy", href: "/legal/privacy-policy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookie-policy" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Image credits", href: "/legal/image-credits" },
];
