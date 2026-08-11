import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services, getService } from "@/data/services";
import {
  PageHero,
  ChallengeGrid,
  ProcessTimeline,
  FaqSection,
  TalkToUs,
} from "@/components/sections/PageParts";
import {
  Container,
  Section,
  SectionHeading,
  JsonLd,
  Arrow,
} from "@/components/ui/Primitives";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/Cards";
import { buildMetadata, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.tagline,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.related
    .map((r) => getService(r))
    .filter(Boolean) as typeof services;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/business-setup" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
          serviceSchema({
            name: service.name,
            description: service.tagline,
            path: `/services/${service.slug}`,
          }),
          faqSchema(service.faqs),
        ]}
      />

      <PageHero
        eyebrow={service.hero.eyebrow}
        title={service.hero.title}
        lead={service.hero.lead}
        image={service.image}
        imageAlt={service.imageAlt}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        primaryCta={{ label: "Talk to us about this", href: "/contact#journey" }}
      />

      <ChallengeGrid
        eyebrow="The problem"
        title={service.problem.title}
        lead={service.problem.body}
        items={service.problem.points.map((p) => ({ title: p, body: "" }))}
      />

      {/* Solution + deliverables */}
      <Section tone="light">
        <Container>
          <div className="grid gap-9 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <SectionHeading
              eyebrow="The approach"
              title={service.solution.title}
              lead={service.solution.body}
            />
            <RevealGroup className="grid gap-px overflow-hidden border border-white/12 bg-white/10 sm:grid-cols-2">
              {service.deliverables.map((d) => (
                <RevealItem key={d.title} className="bg-white/[0.03] p-5">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-paper">
                    {d.title}
                  </h3>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-navy-200">
                    {d.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      {/* Who it's for */}
      <Section tone="mist" size="tight">
        <Container>
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
            <SectionHeading eyebrow="Who it's for" title="Is this you?" />
            <RevealGroup as="ul" className="grid gap-2.5 sm:grid-cols-2">
              {service.whoFor.map((w) => (
                <RevealItem
                  as="li"
                  key={w}
                  className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-white/12 bg-white/[0.03] px-4 py-3 text-[0.88rem] leading-snug text-paper"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400"
                  />
                  {w}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      <ProcessTimeline
        steps={service.process}
        title="How we run it"
        lead="Each step has an owner and a deliverable, so you always know what is happening and who holds it."
      />

      <FaqSection
        faqs={service.faqs}
        page={`service/${service.slug}`}
        caveat={service.caveat}
      />

      {related.length > 0 && (
        <Section tone="mist" size="tight">
          <Container>
            <SectionHeading
              eyebrow="Related services"
              title="Often needed alongside this"
            />
            {/* Each service names exactly two related services — a two-column
                grid fills, where a three-column one would leave a gap. */}
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {related.map((r, i) => (
                <ServiceCard key={r.slug} service={r} index={i} />
              ))}
            </div>
            <Reveal className="mt-7">
              <Link
                href="/business-setup"
                className="group inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-moss-300"
              >
                <span className="link-draw">See all business services</span>
                <Arrow />
              </Link>
            </Reveal>
          </Container>
        </Section>
      )}

      <TalkToUs />
    </>
  );
}
