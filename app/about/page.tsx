import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/Primitives";
import { BpPage } from "@/components/bp/page/BpPage";
import { PageHero } from "@/components/bp/page/PageHero";
import { PhotoStack } from "@/components/bp/page/PhotoStack";
import { Band, SectionHead } from "@/components/bp/page/SectionHead";
import { Reveal } from "@/components/bp/Reveal";
import { InlineCta } from "@/components/bp/InlineCta";
import { FinalCall } from "@/components/bp/FinalCall";
import { TrustTicker } from "@/components/bp/TrustTicker";
import { MissionScroll, ApproachPath, CorridorFlow } from "@/components/bp/about/AboutParts";
import { approach } from "@/data/pathways";
import { company, trustPoints, ecosystem, ecosystemDisclaimer, sourceMarkets } from "@/data/company";
import { studyDestinations } from "@/data/study";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About SnZ Ventures | Students First, From Vilnius",
  description:
    "A woman-owned advisory firm in Vilnius, Lithuania, helping students from South Asia and the Middle East study in Europe, with one named consultant from first call to first week.",
  path: "/about",
});

/**
 * /about — who SnZ is, told for a student and their family.
 *
 * Copy is built from what data/company.ts and data/pathways.ts already state
 * (mission, attributes, trust points, approach, ecosystem), reframed for the
 * student audience the site now leads with. Nothing here is a new claim: no
 * founding year, no team size, no placement figure beyond the owner-confirmed
 * one on the homepage board. The ecosystem list keeps its disclaimer — those
 * bodies are context, never partners.
 */

const beliefs = [
  {
    title: "Geography is a starting point, not a ceiling.",
    body: "Where someone is born shapes their options far more than their ability does. Closing that gap, for a student first of all, is the reason this firm exists.",
  },
  {
    title: "The honest answer beats the hopeful one.",
    body: "Telling a student their profile isn't competitive yet costs us a fee and saves them a year. We would rather lose the engagement than sell false hope.",
  },
  {
    title: "Coordination is the real product.",
    body: "Almost nobody fails because one step was impossible. They fail because six steps ran through six people in the wrong order. We run them in one order, with one person.",
  },
  {
    title: "Regulated work belongs with regulated people.",
    body: "We are advisors, not a university, not an embassy, not a law firm. We say so plainly, and we name the licensed partners who handle regulated steps before you commit.",
  },
];

export default function AboutPage() {
  return (
    <BpPage>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        eyebrow="About SnZ Ventures"
        lines={[{ text: "Based in Vilnius." }, { text: "Built for students" }, { text: "going further.", mark: true }]}
        lede="SnZ Ventures is a woman-owned advisory firm inside the European Union. We help students from South Asia and the Middle East reach European universities, and we stay with them until they've landed."
        primary={{ label: "Meet a consultant", href: "/contact#journey" }}
        secondary={{ label: "How we work", href: "#approach" }}
        visual={
          <PhotoStack
            photos={[
              { src: "/images/dest-vilnius-old.webp", alt: "Rooftops of Vilnius old town with the cathedral and palace", caption: "Vilnius, our home" },
              { src: "/images/dest-vilnius.webp", alt: "Vilnius skyline at dusk across the river", caption: "Where we work" },
              { src: "/images/plate-departure.webp", alt: "Aircraft wing above the clouds at sunrise", caption: "Where students go" },
            ]}
          />
        }
      />

      <TrustTicker />

      <Band labelledBy="mission-title">
        <h2 id="mission-title" className="sr-only">
          Our mission
        </h2>
        <p className="bp-eyebrow mb-8">Why we exist</p>
        <MissionScroll text={company.missionQuote} by={company.name} />
      </Band>

      <Band id="who" labelledBy="who-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SectionHead
            id="who-title"
            eyebrow="Who we are"
            title={
              <>
                A Vilnius firm built <span className="bp-outline">around one route.</span>
              </>
            }
          />
          <Reveal className="space-y-5 text-[1.05rem] leading-relaxed text-[var(--bp-fg)]">
            <p>
              We work between South Asia, the Middle East and the European Union, at both ends of the route. That is
              unusual, and is exactly why we can be straight with students and families on either side of it.
            </p>
            <p>
              Most of our work is students: choosing the right country and course, building an application an
              admissions office takes seriously, finding the funding you actually qualify for, preparing the visa
              file, and handling arrival. Alongside that we place professionals with European employers and set up
              companies for founders, so the route doesn&apos;t end at graduation.
            </p>
            <p>
              We&apos;re based at {company.contact.streetAddress}, {company.contact.city}. Lithuania runs its processes
              in English and sits inside the EU: a good place to stand when your job is opening doors across{" "}
              {studyDestinations.length} countries.
            </p>
            <ul className="flex flex-wrap gap-2 pt-2">
              {company.attributes.map((a) => (
                <li key={a} className="rounded-full border border-[var(--color-runway)] px-3.5 py-1.5 text-[0.85rem] font-semibold text-[var(--color-runway)]">
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <CorridorFlow
          from={{ value: String(sourceMarkets.length), label: "Home countries", detail: sourceMarkets.join(" · ") }}
          hub={{ value: "1", label: "Vilnius office", detail: "One team coordinating every application, file and filing." }}
          to={{ value: String(studyDestinations.length), label: "Study destinations", detail: "Across the EU's single market of 27 member states." }}
        />
      </Band>

      <Band id="beliefs" labelledBy="beliefs-title">
        <SectionHead
          id="beliefs-title"
          eyebrow="What we believe"
          title={
            <>
              Four positions <span className="bp-outline">we&apos;ll be held to.</span>
            </>
          }
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {beliefs.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={(i % 2) * 0.1} className="h-full">
                <article className="bp-pass-dark group relative h-full overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-1">
                  {/* Watermark numeral — SVG text, because it is decoration, not copy. */}
                  <svg aria-hidden viewBox="0 0 140 110" className="pointer-events-none absolute -right-3 -top-5 h-28 w-36 text-[var(--bp-chip)] transition-colors duration-500 group-hover:text-[var(--color-runway)]/15">
                    <text x="140" y="96" textAnchor="end" fill="currentColor" style={{ font: "600 112px var(--font-grotesk)", letterSpacing: "-0.04em" }}>
                      0{i + 1}
                    </text>
                  </svg>
                  <h3 className="relative font-[family-name:var(--font-grotesk)] text-[1.5rem] font-semibold leading-tight text-[var(--bp-strong)]">{b.title}</h3>
                  <p className="bp-body relative mt-3">{b.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>

      <Band id="approach" labelledBy="approach-title">
        <SectionHead
          id="approach-title"
          eyebrow="How we work"
          title={
            <>
              The same six steps, <span className="bp-outline">for every student.</span>
            </>
          }
          aside="Only the content changes. The structure, the honesty and the person you speak to don't."
        />
        <ApproachPath steps={approach} />
        <InlineCta className="mt-12" lead="Step one is a conversation." label="Book yours, it's free" href="/contact#journey" />
      </Band>

      <Band id="commitments" labelledBy="commit-title">
        <SectionHead
          id="commit-title"
          eyebrow="Checkable commitments"
          title={
            <>
              Promises you can test <span className="bp-outline">in the first call.</span>
            </>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((t, i) => (
            <li key={t.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="h-full border-t-2 border-[var(--color-runway)] pt-5">
                  <h3 className="font-[family-name:var(--font-grotesk)] text-[1.2rem] font-semibold text-[var(--bp-strong)]">{t.title}</h3>
                  <p className="bp-body mt-2 text-[0.95rem]">{t.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-6 rounded-[22px] border border-[var(--bp-line)] p-6 md:grid-cols-[1fr_2fr] md:p-8">
          <p className="bp-mono text-[var(--color-aurora)]">The ecosystem we operate within</p>
          <div>
            <p className="text-[1rem] text-[var(--bp-fg)]">{ecosystem.join(" · ")}</p>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{ecosystemDisclaimer}</p>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{company.regulatoryNotice}</p>
          </div>
        </div>
      </Band>

      <FinalCall />
    </BpPage>
  );
}
