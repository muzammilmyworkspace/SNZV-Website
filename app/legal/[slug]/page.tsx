import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, getLegalDoc } from "@/data/legal";
import {
  Container,
  Section,
  JsonLd,
  Eyebrow,
  Caveat,
} from "@/components/ui/Primitives";
import { Breadcrumbs } from "@/components/sections/PageParts";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.title,
    description: `${doc.title} for SnZ Ventures, Vilnius, Lithuania.`,
    path: `/legal/${doc.slug}`,
    // Draft legal text should not be indexed until a legal advisor signs it off.
    noIndex: true,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path: `/legal/${doc.slug}` },
        ])}
      />

      <section className="relative overflow-hidden bg-surface pb-12 pt-36 text-fg md:pt-44">
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-45" />
        <Container className="relative" size="narrow">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: doc.title, path: `/legal/${doc.slug}` },
            ]}
          />
          <Eyebrow tone="dark" className="mb-4">
            Legal
          </Eyebrow>
          <h1 className="d-1 text-fg">{doc.title}</h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
            {doc.intro}
          </p>
        </Container>
      </section>

      <Section tone="paper" edge>
        <Container size="narrow">
          {/* Unmissable draft warning — these documents are not launch-ready. */}
          <div className="mb-9 border border-amber-300 bg-amber-50 p-4">
            <p className="text-[0.82rem] font-semibold uppercase tracking-wide text-amber-900">
              Draft — legal review required
            </p>
            <p className="mt-1.5 text-[0.86rem] leading-relaxed text-amber-900">
              This document provides structure only. Sections marked{" "}
              <span className="font-mono text-[0.8rem]">[CONFIRM]</span> require
              company facts and legal determinations that must be supplied and
              reviewed by a qualified Lithuanian/EU legal advisor before launch.
              It is excluded from search indexing until then.
            </p>
          </div>

          {doc.sections.map((section) => (
            <section key={section.heading} className="mb-9">
              <h2 className="d-3 mb-3 text-fg">{section.heading}</h2>
              {section.paras.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mb-3 text-[0.95rem] leading-[1.7] text-fg"
                >
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 space-y-2 border-l-2 border-line pl-5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="text-[0.92rem] leading-relaxed text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="border-t border-line pt-7">
            <Eyebrow className="mb-3">Contact</Eyebrow>
            <ContactLinks location="legal_page" tone="light" />
            <Caveat>
              Last reviewed: not yet reviewed. This page must be dated on
              publication.
            </Caveat>
          </div>
        </Container>
      </Section>
    </>
  );
}
