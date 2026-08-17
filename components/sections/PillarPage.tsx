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
  JsonLd,
} from "@/components/ui/Primitives";
import { InsightCard } from "@/components/cards/Cards";
import { articles } from "@/data/insights";
import { videoFeatures } from "@/data/media";
import { VideoFeature } from "./VideoFeature";
import { Reviews } from "./Reviews";
import { StatsBand } from "./StatsBand";
import { PortalPreview } from "./PortalPreview";
import { careerStats, businessStats } from "@/data/stats";
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
        images={pillar.hero.images}
        breadcrumbs={crumbs}
        primaryCta={{ label: pillar.hero.primaryCta, href: "/contact#journey" }}
        secondaryCta={{ label: pillar.hero.secondaryCta, href: "/insights" }}
      />

      <StatsBand
        stats={pillar.key === "careers" ? careerStats : businessStats}
        tone="soft"
        eyebrow="By the numbers"
        cta={
          pillar.key === "careers"
            ? { href: "/destinations", label: "Where the roles are" }
            : { href: "/services/company-formation", label: "See how formation works" }
        }
      />

      <ChallengeGrid
        title={pillar.challenge.title}
        lead={pillar.challenge.lead}
        items={pillar.challenge.items}
      />

      <VideoFeature data={videoFeatures[pillar.key]} />

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
        title="How the Conversation Goes"
        lead="No obligation at any step, and we tell you early if we're not the right firm for you."
        tone="mist"
      />

      {related.length > 0 && (
        <Section tone="light">
          <Container>
            <SectionHeading
              eyebrow="Related reading"
              title="Worth Knowing Before You Commit"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((a, i) => (
                <InsightCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <PortalPreview
        audience={pillar.key === "careers" ? "career" : "business"}
        tone="paper"
      />

      <Reviews />

      <FaqSection
        faqs={pillar.faqs}
        page={pillar.slug}
        caveat={pillar.caveat}
      />

      <TalkToUs />
    </>
  );
}
