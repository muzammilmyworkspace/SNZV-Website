import type { Metadata } from "next";
import {
  Container,
  Section,
  SectionHeading,
  Caveat,
  JsonLd,
} from "@/components/ui/Primitives";
import { PageHero, TalkToUs } from "@/components/sections/PageParts";
import { DestinationCard } from "@/components/cards/Cards";
import { CorridorMap } from "@/components/visuals/CorridorMap";
import { Reveal } from "@/components/ui/Reveal";
import { destinations, corridors } from "@/data/destinations";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Destinations — Where SnZ Ventures Operates",
  description:
    "Eight European destination markets and eight talent source corridors. See exactly which services are available in each country, and where the honest answer is still 'ask us'.",
  path: "/destinations",
});

export default function DestinationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
        ])}
      />

      <PageHero
        eyebrow="Destinations"
        title="Eight Markets, and an Honest Map of What We Do in Each."
        lead="Plenty of firms list every country in Europe. We list the eight we actually work in — and mark clearly where a service is a flagship, where it's available, and where you should simply ask."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
        ]}
        primaryCta={{ label: "Ask about your country", href: "/contact#journey" }}
      />

      {/* The corridor map */}
      <Section tone="dark" className="grain overflow-hidden">
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="The corridor"
            title="Talent In. Businesses Out. Vilnius in the Middle."
            lead="We recruit from eight source markets across South Asia and the Middle East, and place into eight European destinations. Lithuania is where the entities, licences and coordination sit."
          />
          <div className="mt-9">
            <CorridorMap tone="dark" variant="pins" land="solid" />
          </div>
        </Container>
      </Section>

      {/* Destination grid */}
      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow="European destinations"
            title="Where We Place, Form and Relocate"
            lead="“Ask us” means exactly that — the service isn't confirmed for that market, and we'd rather say so than imply otherwise."
          />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d, i) => (
              <DestinationCard key={d.slug} destination={d} index={i} />
            ))}
          </div>
          <Caveat>
            Service availability varies by role, sector, permit category and
            time. Nothing on this page is an offer or a guarantee of
            eligibility.
          </Caveat>
        </Container>
      </Section>

      {/* Source corridors */}
      <Section tone="mist" size="tight">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <SectionHeading
              eyebrow="Talent corridors"
              title="Where Our Candidates Come From"
              lead="We work on both sides of the corridor. That is what lets us tell a candidate the truth about their chances, and an employer the truth about the market."
            />
            <Reveal>
              <ul className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-raised sm:grid-cols-4">
                {corridors.map((c) => (
                  <li
                    key={c.name}
                    className="bg-white/[0.03] px-4 py-5 text-center label text-fg"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <TalkToUs />
    </>
  );
}
