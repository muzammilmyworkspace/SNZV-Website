import type { Metadata } from "next";
import { Container, Section, SectionHeading, JsonLd } from "@/components/ui/Primitives";
import { PageHero, TalkToUs } from "@/components/sections/PageParts";
import { InsightCard } from "@/components/cards/Cards";
import { articles } from "@/data/insights";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights — Know Before You Go",
  description:
    "Practical guides on studying, working and building a business in Europe. Written to be useful whether or not you ever contact us.",
  path: "/insights",
});

export default function InsightsPage() {
  const [featured, ...rest] = articles;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ])}
      />

      <PageHero
        eyebrow="Insights"
        title="Know Before You Go."
        lead="Orientation on the parts of international moves that people get wrong — written plainly, with no sales pitch attached. Several of these will save you money whether you work with us or not."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />

      <Section tone="light">
        <Container>
          {/* Keeps the heading order h1 → h2 → h3 before the card grid. */}
          <h2 className="sr-only">Latest guides</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <InsightCard article={featured} featured />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {rest.slice(0, 2).map((a, i) => (
                <InsightCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </div>

          {rest.length > 2 && (
            <>
              <SectionHeading
                className="mt-14"
                eyebrow="More guides"
                title="The Rest of the Library"
              />
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.slice(2).map((a, i) => (
                  <InsightCard key={a.slug} article={a} index={i} />
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>

      <TalkToUs />
    </>
  );
}
