import {
  PageHero,
  ChallengeGrid,
  ChecklistBlock,
  HelpGrid,
  ProcessTimeline,
  FaqSection,
  TalkToUs,
} from "./PageParts";
import {
  Container,
  Section,
  SectionHeading,
  ContentRequired,
  JsonLd,
} from "@/components/ui/Primitives";
import { InsightCard } from "@/components/cards/Cards";
import { articles } from "@/data/insights";
import type { Pillar } from "@/data/pillars";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

/**
 * Shared renderer for the three audience pillar pages.
 * Keeps Study / Careers / Business structurally identical so the experience
 * is predictable, while all copy comes from data/pillars.ts.
 */
export function PillarPage({ pillar }: { pillar: Pillar }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: pillar.hero.eyebrow.replace("For ", ""), path: `/${pillar.slug}` },
  ];

  /**
   * Prefer articles for this pathway, then top up with the rest so the grid
   * always fills three columns. Only one guide is tagged `study`, and a lone
   * card in a three-column row reads as a layout mistake.
   */
  const related = [
    ...articles.filter((a) => a.pathway === pillar.key),
    ...articles.filter((a) => a.pathway !== pillar.key),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: pillar.hero.title, path: `/${pillar.slug}` },
          ]),
          faqSchema(pillar.faqs),
        ]}
      />

      <PageHero
        eyebrow={pillar.hero.eyebrow}
        title={pillar.hero.title}
        lead={pillar.hero.lead}
        image={pillar.hero.image}
        imageAlt={pillar.hero.imageAlt}
        breadcrumbs={crumbs}
        primaryCta={{ label: pillar.hero.primaryCta, href: "/contact#journey" }}
        secondaryCta={{ label: pillar.hero.secondaryCta, href: "/insights" }}
      />

      <ChallengeGrid
        title={pillar.challenge.title}
        lead={pillar.challenge.lead}
        items={pillar.challenge.items}
      />

      <ChecklistBlock
        eyebrow="What it takes"
        title={pillar.requires.title}
        lead={pillar.requires.lead}
        items={pillar.requires.items}
      />

      <HelpGrid
        eyebrow="How we help"
        title={pillar.help.title}
        lead={pillar.help.lead}
        items={pillar.help.items}
      />

      <ProcessTimeline
        steps={pillar.process}
        title="How the conversation goes"
        lead="No obligation at any step, and we tell you early if we're not the right firm for you."
        tone="mist"
      />

      {related.length > 0 && (
        <Section tone="light">
          <Container>
            <SectionHeading
              eyebrow="Related reading"
              title="Worth knowing before you commit"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((a, i) => (
                <InsightCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <FaqSection
        faqs={pillar.faqs}
        page={pillar.slug}
        caveat={pillar.caveat}
      />

      <Container>
        <ContentRequired
          label={`${pillar.hero.eyebrow} pathway`}
          items={pillar.contentRequired}
        />
      </Container>

      <TalkToUs />
    </>
  );
}
