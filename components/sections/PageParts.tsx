import Link from "next/link";
import {
  Container,
  Section,
  SectionHeading,
  Eyebrow,
  accentLast,
  Action,
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Caveat,
} from "@/components/ui/Primitives";
import { FaqAccordion } from "@/components/ui/Accordion";
import { type HeroImage } from "./HeroSlideshow";
import { ArchHero } from "@/components/fx/ArchHero";
import { Stamp } from "@/components/fx/Stamp";
import { company } from "@/data/company";
import type { FAQ } from "@/data/services";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------- Breadcrumbs */

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="label text-faint">
                  {item.name.length > 40 ? `${item.name.slice(0, 40)}…` : item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="label inline-flex min-h-8 items-center text-faint transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden className="text-faint">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------- PageHero */

/**
 * Inner-page opener: the Horizon arch hero (components/fx/ArchHero). Copy on
 * the left, the page's photographs in an arch on the right.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  images,
  breadcrumbs,
  primaryCta,
  secondaryCta,
  chip = { title: "One named advisor", body: "from the first call to arrival" },
}: {
  eyebrow: string;
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  /** Two to four frames, cycled. Falls back to `image` when absent. */
  images?: HeroImage[];
  breadcrumbs: { name: string; path: string }[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  index?: string;
  chip?: { title: string; body: string };
}) {
  const frames: HeroImage[] =
    images && images.length > 0
      ? images
      : image
        ? [{ src: image, alt: imageAlt ?? "" }]
        : [];

  return (
    <ArchHero
      images={frames}
      chip={chip}
      top={
        <>
          <Breadcrumbs items={breadcrumbs} />
          <Eyebrow>{eyebrow}</Eyebrow>
        </>
      }
      title={
        <MaskedLines
          as="h1"
          animate="mount"
          delay={0.12}
          className="d-1 max-w-[16ch] text-fg-strong is-in"
          lines={[accentLast(title)]}
        />
      }
    >
      <Reveal delay={0.28}>
        <p className="lede mt-7 max-w-xl">{lead}</p>
      </Reveal>

      {(primaryCta || secondaryCta) && (
        <Reveal delay={0.36}>
          <div className="mt-9 flex flex-wrap gap-3">
            {primaryCta && (
              <Action href={primaryCta.href} size="lg" magnetic>
                {primaryCta.label}
              </Action>
            )}
            {secondaryCta && (
              <Action href={secondaryCta.href} variant="line" size="lg">
                {secondaryCta.label}
              </Action>
            )}
          </div>
        </Reveal>
      )}
    </ArchHero>
  );
}

/* --------------------------------------------------------- ChallengeGrid */

export function ChallengeGrid({
  title,
  lead,
  items,
  eyebrow = "The challenge",
}: {
  title: string;
  lead: string;
  eyebrow?: string;
  items: { title: string; body: string }[];
}) {
  return (
    <Section tone="mist" className="overflow-hidden">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />

        <RevealGroup as="ol" className="mt-14 border-t border-line">
          {items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.title}
              className="group grid gap-3 border-b border-line py-7 md:grid-cols-[3.5rem_1fr_1fr] md:items-baseline md:gap-10"
            >
              <span className="label num text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[1.4rem] leading-tight tracking-[-0.018em] text-fg transition-colors duration-500 group-hover:text-accent sm:text-[1.75rem]">
                {item.title}
              </h3>
              {item.body && (
                <p className="max-w-md text-[0.9rem] leading-relaxed text-faint">
                  {item.body}
                </p>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------- ChecklistBlock */

export function ChecklistBlock({
  eyebrow,
  title,
  lead,
  items,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  items: string[];
}) {
  return (
    <Section tone="soft">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
          <RevealGroup as="ul" className="border-t border-line">
            {items.map((item, i) => (
              <RevealItem
                as="li"
                key={item}
                className="flex items-baseline gap-5 border-b border-line py-4"
              >
                <span className="label num shrink-0 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.95rem] leading-relaxed text-fg">
                  {item}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- HelpGrid */

export function HelpGrid({
  eyebrow,
  title,
  lead,
  items,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  items: { title: string; body: string; href?: string }[];
}) {
  return (
    <Section tone="mist" className="overflow-hidden">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <RevealGroup className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {items.map((item, i) => {
            const inner = (
              <>
                <span className="label num text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-faint">
                  {item.body}
                </p>
                {item.href && (
                  <span className="label mt-4 inline-flex items-center gap-2 text-accent">
                    <span className="draw">Learn more</span>
                  </span>
                )}
              </>
            );
            return (
              <RevealItem key={item.title} className="group border-t border-line pt-6">
                {item.href ? <Link href={item.href}>{inner}</Link> : inner}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------- ProcessTimeline */

export function ProcessTimeline({
  steps,
  title = "How it works",
  eyebrow = "Process",
  lead,
  tone = "light",
}: {
  steps: readonly { step: string; name: string; body: string }[];
  title?: string;
  eyebrow?: string;
  lead?: string;
  tone?: "light" | "mist";
}) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <RevealGroup
          as="ol"
          className={cn(
            "mt-14 grid gap-8 md:gap-6",
            steps.length >= 6 ? "md:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-3 lg:grid-cols-5"
          )}
        >
          {steps.map((s) => (
            <RevealItem as="li" key={s.step} className="border-t border-line pt-5">
              <span className="label num text-accent">{s.step}</span>
              <h3 className="mt-3 font-display text-[1.25rem] leading-none tracking-[-0.018em] text-fg">
                {s.name}
              </h3>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed text-faint">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ FaqSection */

export function FaqSection({
  faqs,
  page,
  title = "Questions people actually ask",
  eyebrow = "FAQs",
  caveat,
}: {
  faqs: FAQ[];
  page: string;
  title?: string;
  eyebrow?: string;
  caveat?: string;
}) {
  return (
    <Section tone="paper" edge>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow={eyebrow} title={title} />
            {caveat && <Caveat>{caveat}</Caveat>}
          </div>
          <FaqAccordion faqs={faqs} page={page} />
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ CTASection */

export function CTASection({
  title,
  lead,
  primary = { label: "Start your journey", href: "/contact#journey" },
  secondary,
}: {
  title: string;
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string; external?: boolean };
  /** Kept for old call sites; the closing panel no longer uses a photograph. */
  plate?: string;
}) {
  return (
    <section className="sk-cta-wrap tone-deep">
      <div className="sk-cta" data-fx="tilt">
        <span aria-hidden className="sk-ring sk-ring-a" />
        <span aria-hidden className="sk-ring sk-ring-b" />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <MaskedLines as="h2" className="d-1" lines={[accentLast(title)]} />
            {lead && (
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed">{lead}</p>
              </Reveal>
            )}
            <Reveal delay={0.22}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={primary.href} className="sk-btn sk-btn-navy">
                  {primary.label} <span aria-hidden className="sk-arrow">→</span>
                </Link>
                {secondary &&
                  (secondary.external ? (
                    <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="sk-btn sk-btn-ghost-dark">
                      {secondary.label}
                    </a>
                  ) : (
                    <Link href={secondary.href} className="sk-btn sk-btn-ghost-dark">
                      {secondary.label}
                    </Link>
                  ))}
              </div>
            </Reveal>
          </div>
          <div className="hidden lg:block">
            <Stamp className="sk-float scale-[1.35]" text="Your ambition · has no borders · " />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TalkToUs() {
  return (
    <CTASection
      title="Not Sure Which Pathway Is Yours?"
      lead="Tell us roughly where you want to end up. We'll tell you what the route looks like — and whether it's realistic."
      primary={{ label: "Start your journey", href: "/contact#journey" }}
      secondary={{
        label: "Message on WhatsApp",
        href: `https://wa.me/${company.contact.whatsapp}`,
        external: true,
      }}
    />
  );
}
