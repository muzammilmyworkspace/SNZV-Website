import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { articles, getArticle } from "@/data/insights";
import {
  Container,
  Section,
  SectionHeading,
  Caveat,
  JsonLd,
} from "@/components/ui/Primitives";
import { Breadcrumbs, TalkToUs } from "@/components/sections/PageParts";
import { InsightCard } from "@/components/cards/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    image: article.image,
    type: "article",
    publishedTime: article.updated,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Same-pathway guides first, then top up so the three-column grid fills.
  const others = articles.filter((a) => a.slug !== article.slug);
  const related = [
    ...others.filter((a) => a.pathway === article.pathway),
    ...others.filter((a) => a.pathway !== article.pathway),
  ].slice(0, 3);

  const readable = new Date(article.updated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
          articleSchema({
            title: article.title,
            description: article.excerpt,
            path: `/insights/${article.slug}`,
            published: article.updated,
            image: article.image,
          }),
        ]}
      />

      {/* Header */}
      <section className="grain relative overflow-hidden bg-void pb-12 pt-[104px] text-paper md:pt-[128px]">
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/92 to-navy-950/60"
        />
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-45" />

        <Container className="relative">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
              { name: article.title, path: `/insights/${article.slug}` },
            ]}
          />
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[0.75rem] text-navy-300">
              <span className="rounded-[var(--radius-xs)] bg-moss-400 px-2 py-0.5 font-semibold uppercase tracking-wider text-void">
                {article.category}
              </span>
              <span>{article.readMinutes} min read</span>
              <span aria-hidden>·</span>
              <time dateTime={article.updated}>Updated {readable}</time>
            </div>
            <h1 className="d-1 text-paper">{article.title}</h1>
            <p className="lede mt-5 text-navy-200">{article.excerpt}</p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Section tone="light">
        <Container size="narrow">
          <article className="max-w-none">
            {article.body.map((block, i) => (
              <Reveal key={block.heading} delay={i * 0.03} className="mb-9">
                <h2 className="d-3 mb-3 text-paper">{block.heading}</h2>
                {block.paras.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mb-3.5 text-[1rem] leading-[1.72] text-navy-100"
                  >
                    {p}
                  </p>
                ))}
                {block.list && (
                  <ul className="mt-4 space-y-2.5 border-l-2 border-moss-400/40 pl-5">
                    {block.list.map((item) => (
                      <li
                        key={item}
                        className="text-[0.95rem] leading-relaxed text-navy-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </article>

          <Caveat>
            This article is general orientation, not legal, tax, immigration or
            financial advice. Rules differ by country and change over time —
            confirm the current position for your own circumstances with a
            qualified advisor or the relevant official authority before acting.
          </Caveat>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="mist" size="tight">
          <Container>
            <SectionHeading eyebrow="Keep reading" title="Related guides" />
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {related.map((a, i) => (
                <InsightCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <TalkToUs />
    </>
  );
}
