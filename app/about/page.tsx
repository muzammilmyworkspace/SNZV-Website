import type { Metadata } from "next";
import {
  Container,
  Section,
  SectionHeading,
  Caveat,
  JsonLd,
  Eyebrow,
} from "@/components/ui/Primitives";
import { PageHero, ProcessTimeline, TalkToUs } from "@/components/sections/PageParts";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { approach } from "@/data/pathways";
import {
  company,
  trustPoints,
  ecosystem,
  ecosystemDisclaimer,
  sourceMarkets,
} from "@/data/company";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About — More Than Guidance, a Gateway to Possibility",
  description:
    "SnZ Ventures is a woman-owned advisory firm in Vilnius, Lithuania, working across company formation, fintech licensing, international recruitment and investor relocation.",
  path: "/about",
});

/**
 * The corridor as three numbers, read left to right. Every figure is derived
 * from data already on this site — no new claim is introduced here.
 */
const CORRIDOR_FLOW = [
  {
    value: sourceMarkets.length.toString(),
    label: "Source markets",
    detail: "Across South Asia and the Middle East.",
  },
  {
    value: "1",
    label: "Coordination hub",
    detail: "Vilnius — entities, licences and filings.",
  },
  {
    value: "27",
    label: "EU member states",
    detail: "Where a Lithuanian entity can operate.",
  },
];

const beliefs = [
  {
    title: "Geography is a starting point, not a ceiling",
    body: "Where someone is born shapes their options far more than their ability does. Closing that gap — for a student, a welder, a founder — is the entire reason this firm exists.",
  },
  {
    title: "The honest answer is worth more than the hopeful one",
    body: "Telling someone their profile isn't competitive costs us a fee and saves them a year. We would rather lose the engagement than sell false hope.",
  },
  {
    title: "Coordination is the actual product",
    body: "Almost nobody fails because a single step was impossible. They fail because six steps ran through six firms in the wrong order.",
  },
  {
    title: "Regulated work belongs with regulated people",
    body: "We are not auditors, lawyers or compliance officers. We say so plainly, and we name the licensed partners who are before you commit.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow="About SnZ Ventures"
        title="More than Guidance. A Gateway to Possibility."
        lead={company.missionQuote}
        image="/images/dest-vilnius.webp"
        imageAlt="Vilnius skyline at dusk"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        primaryCta={{ label: "Start your journey", href: "/contact#journey" }}
      />

      {/* Who we are */}
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading
              eyebrow="Who we are"
              title="A Vilnius Firm Built Around One Corridor."
              lead="SnZ Ventures is a woman-owned advisory business operating between South Asia, the Middle East and the European Union. We work at both ends of that route — which is unusual, and is the reason we can be straight with people at either end."
            />
            <Reveal>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-fg">
                <p>
                  We do four things: form and run European companies, prepare
                  fintech licence applications, recruit into European employers,
                  and relocate the founders and families who come with all of
                  that.
                </p>
                <p>
                  They look like separate businesses. In practice they are the
                  same problem viewed from different sides — someone is trying
                  to cross a border, and the administrative reality is more
                  complicated than anyone told them.
                </p>
                <p>
                  Lithuania is where we are based and where most of the
                  structural work happens. It has the largest licensed fintech
                  population in the European Union, runs its processes in
                  English, and gives a company access to all 27 member states.
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {company.attributes.map((a) => (
                  <li
                    key={a}
                    className="rounded-[var(--radius-xs)] border border-line px-3 py-1 text-[0.78rem] text-muted"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

        </Container>
      </Section>

      {/* What we believe */}
      <Section tone="dark" className="grain overflow-hidden">
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="What we believe"
            title="Four Positions We're Willing to Be Held To."
          />
          <RevealGroup className="mt-9 grid gap-px overflow-hidden border border-line bg-raised md:grid-cols-2">
            {beliefs.map((b) => (
              <RevealItem key={b.title} className="bg-surface p-6">
                <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-fg">
                  {b.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  {b.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Global vision — corridor map */}
      <Section tone="mist">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
            <SectionHeading
              eyebrow="Our global vision"
              title="Both Ends of the Route, or Neither."
              lead="Most agencies sit at one end of a corridor and guess about the other. We recruit in the source markets and place into the destination markets, so what we tell each side is grounded in the other."
            />
            {/*
              An infographic, not a map.

              This section is about the SHAPE of the business — talent in one
              direction, companies the other, Lithuania in the middle. A second
              map said none of that; it repeated the homepage atlas and left a
              scatter of green dots with no legend to explain them. Numbers and
              a direction of travel carry the idea in a glance.
            */}
            <Reveal>
              <div className="rounded-[var(--radius-lg)] border border-line bg-raised p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-3 sm:gap-4">
                  {CORRIDOR_FLOW.map((step, i) => (
                    <div key={step.label} className="relative">
                      <span className="num block text-[2.3rem] leading-none tracking-[-0.03em] text-fg">
                        {step.value}
                      </span>
                      <span className="label mt-2 block text-accent">
                        {step.label}
                      </span>
                      <span className="mt-1.5 block text-[0.8rem] leading-snug text-muted">
                        {step.detail}
                      </span>

                      {/* Direction of travel, drawn between the columns. */}
                      {i < CORRIDOR_FLOW.length - 1 && (
                        <svg
                          viewBox="0 0 24 12"
                          aria-hidden
                          className="absolute -right-3 top-3 hidden h-3 w-6 text-accent sm:block"
                        >
                          <path
                            d="M1 6h20M17 2l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.65"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-7 border-t border-line pt-5 text-[0.84rem] leading-relaxed text-muted">
                  Both ends of the same route. We recruit where the talent is
                  and place where the demand is, so neither side is guesswork.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            <div>
              <Eyebrow className="mb-3">Talent source markets</Eyebrow>
              <p className="text-[0.9rem] leading-relaxed text-muted">
                {sourceMarkets.join(" · ")}
              </p>
            </div>
            <div>
              <Eyebrow className="mb-3">
                Operating within Lithuania&rsquo;s ecosystem
              </Eyebrow>
              <p className="text-[0.9rem] leading-relaxed text-muted">
                {ecosystem.join(" · ")}
              </p>
              <Caveat>{ecosystemDisclaimer}</Caveat>
            </div>
          </div>
        </Container>
      </Section>

      {/* How we work */}
      <ProcessTimeline
        steps={approach.slice(0, 5)}
        eyebrow="How we work"
        title="The Same Six Steps, Whoever You Are."
        lead="A student, a nurse and a payments founder get the same structure. Only the content changes."
      />

      {/* Why clients choose us */}
      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow="Why clients choose us"
            title="Checkable Commitments, Not Adjectives."
            lead="We have deliberately avoided claims we cannot evidence. These are the four you can test in the first conversation."
          />
          <RevealGroup className="mt-9 grid gap-5 md:grid-cols-2">
            {trustPoints.map((t) => (
              <RevealItem
                key={t.title}
                className="border border-line bg-white/[0.03] p-6"
              >
                <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-fg">
                  {t.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  {t.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Caveat>{company.regulatoryNotice}</Caveat>
        </Container>
      </Section>

      <TalkToUs />
    </>
  );
}
