import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/ui/Primitives";
import type { Pillar } from "@/data/pillars";
import { articles } from "@/data/insights";
import { careerStats, businessStats } from "@/data/stats";
import { BpPage } from "../page/BpPage";
import { PageHero } from "../page/PageHero";
import { PhotoStack } from "../page/PhotoStack";
import { Band, SectionHead } from "../page/SectionHead";
import { Faq } from "../page/Faq";
import { Reveal } from "../Reveal";
import { InlineCta } from "../InlineCta";
import { DepartureBoard } from "../DepartureBoard";
import { FinalCall } from "../FinalCall";
import { ApproachPath } from "../about/AboutParts";
import { Checklist } from "./Checklist";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

/**
 * THE PILLAR TEMPLATE — /global-careers and /business-setup, on Boarding Pass.
 *
 * Renders entirely from data/pillars.ts, so the copy (challenge, what it
 * takes, how we help, process, FAQs, caveat) stays exactly as written and
 * vetted there. Titles in that file are Title Case for the old design; they
 * are shown in sentence case here to sit with the rest of the new site.
 *
 * Section order: the problem → what it actually takes → how we help → how
 * the conversation goes → reading → questions → act. Every section ends on
 * a quiet CTA.
 */

const sentence = (t: string) => {
  const s = t.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase());
  return s.replace(/\beu\b/gi, "EU").replace(/\bsnz\b/gi, "SnZ").replace(/\bsme(s)?\b/gi, (m) => m.toUpperCase());
};

/** Split a headline in two for the solid/quiet rhythm. */
const split = (t: string) => {
  const s = sentence(t);
  const words = s.split(" ");
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
};

export function BpPillar({ pillar }: { pillar: Pillar }) {
  const crumbName = pillar.hero.eyebrow.replace(/^For /, "");
  const [h1a, h1b] = split(pillar.hero.title);
  const related = [
    ...articles.filter((a) => a.pathway === pillar.key),
    ...articles.filter((a) => a.pathway !== pillar.key),
  ].slice(0, 3);
  const photos = (pillar.hero.images ?? []).slice(0, 3).map((im, i) => ({
    src: im.src,
    alt: im.alt,
    caption: ["Where you'll work", "Where it happens", "Where you'll land"][i] ?? "",
  }));
  const pageName = pillar.key === "careers" ? "Global Careers" : "Business Setup";

  return (
    <BpPage>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: pageName, path: `/${pillar.slug}` },
          ]),
          faqSchema(pillar.faqs),
        ]}
      />

      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: pageName, href: `/${pillar.slug}` },
        ]}
        eyebrow={pillar.hero.eyebrow}
        lines={[{ text: h1a }, { text: h1b, mark: true }]}
        lede={pillar.hero.lead}
        primary={{ label: pillar.hero.primaryCta, href: "/contact#journey" }}
        secondary={{ label: "How it works", href: "#process" }}
        visual={photos.length >= 3 ? <PhotoStack photos={photos} /> : undefined}
      />

      <DepartureBoard stats={pillar.key === "careers" ? careerStats : businessStats} />

      <Band id="challenge" labelledBy="challenge-title">
        <SectionHead
          id="challenge-title"
          eyebrow={`The reality for ${crumbName.toLowerCase()}`}
          title={sentence(pillar.challenge.title)}
          aside={pillar.challenge.lead}
        />
        <ol className={`mt-10 grid gap-4 md:grid-cols-2 ${pillar.challenge.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {pillar.challenge.items.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <article className="bp-pass-dark group relative h-full overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1">
                  <span className="bp-mono text-[var(--color-aurora)]">Problem {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-grotesk)] text-[1.25rem] font-semibold leading-tight text-[var(--bp-strong)]">
                    {c.title}
                  </h3>
                  <p className="bp-body mt-2 text-[0.95rem]">{c.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>

      <Band id="requires" labelledBy="requires-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHead id="requires-title" eyebrow="What it takes" title={sentence(pillar.requires.title)} />
            <p className="bp-lede mt-6">{pillar.requires.lead}</p>
            <InlineCta className="mt-8" lead="Not sure you tick the boxes?" label="Get an honest assessment" href="/contact#journey" />
          </div>
          <Checklist items={pillar.requires.items} />
        </div>
      </Band>

      <Band id="help" labelledBy="help-title">
        <SectionHead id="help-title" eyebrow="How we help" title={sentence(pillar.help.title)} aside={pillar.help.lead} />
        <ul className={`mt-10 grid gap-4 sm:grid-cols-2 ${pillar.help.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {pillar.help.items.map((h, i) => {
            const body = (
              <article className="bp-pass-dark group flex h-full flex-col p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-runway)]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--bp-chip)] font-mono text-[0.8rem] text-[var(--color-runway)] transition-colors group-hover:bg-[var(--color-runway)] group-hover:text-[var(--bp-on-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-grotesk)] text-[1.25rem] font-semibold text-[var(--bp-strong)]">{h.title}</h3>
                <p className="bp-body mt-2 text-[0.95rem]">{h.body}</p>
                {h.href && (
                  <span className="mt-auto pt-5 text-[0.9rem] font-semibold text-[var(--bp-strong)] underline decoration-[var(--color-runway)] underline-offset-4">
                    Learn more
                  </span>
                )}
              </article>
            );
            return (
              <li key={h.title}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  {h.href ? (
                    <Link href={h.href} className="block h-full">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band id="process" labelledBy="process-title">
        <SectionHead
          id="process-title"
          eyebrow="How the conversation goes"
          title={
            <>
              No obligation <span className="bp-outline">at any step.</span>
            </>
          }
          aside="And we tell you early if we're not the right firm for you."
        />
        <ApproachPath steps={pillar.process} />
        <InlineCta className="mt-12" lead="Step one costs nothing." label="Book the first conversation" href="/contact#journey" />
      </Band>

      {related.length > 0 && (
        <Band id="reading" labelledBy="reading-title">
          <SectionHead
            id="reading-title"
            eyebrow="Worth reading first"
            title={
              <>
                Know this <span className="bp-outline">before you commit.</span>
              </>
            }
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((a, i) => (
              <li key={a.slug}>
                <Reveal delay={i * 0.08} className="h-full">
                  <Link href={`/insights/${a.slug}`} className="bp-pass-dark group block h-full overflow-hidden">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={a.image} alt="" fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="bp-mono text-[var(--color-aurora)]">{a.category}</p>
                      <h3 className="mt-2 font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold leading-snug text-[var(--bp-strong)]">{a.title}</h3>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Band>
      )}

      <Band id="faqs" labelledBy="pfaq-title">
        <SectionHead
          id="pfaq-title"
          eyebrow="Questions"
          title={
            <>
              Straight answers, <span className="bp-outline">up front.</span>
            </>
          }
        />
        <Faq items={pillar.faqs} />
        <p className="mt-8 max-w-4xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{pillar.caveat}</p>
      </Band>

      <FinalCall />
    </BpPage>
  );
}
