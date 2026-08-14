import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Section,
  SectionHeading,
  Chapter,
  Action,
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Caveat,
} from "@/components/ui/Primitives";
import { FaqAccordion } from "@/components/ui/Accordion";
import { HeroSlideshow, type HeroImage } from "./HeroSlideshow";
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
                    className="label text-faint transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden className="text-white/20">
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
 * Inner-page opener. Full-bleed duotone plate, chapter marker, display line
 * revealed from behind a mask — the hero language, at a smaller register.
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
  index = "—",
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
}) {
  const frames: HeroImage[] =
    images && images.length > 0
      ? images
      : image
        ? [{ src: image, alt: imageAlt ?? "" }]
        : [];

  return (
    <section className="plate plate-deep grain relative flex min-h-[62svh] items-end overflow-hidden tone-deep pb-14 pt-32 md:pb-16 md:pt-40">
      {frames.length > 0 && <HeroSlideshow images={frames} />}

      {/*
        Reading scrim. Hero photographs vary from near-black to pale stone,
        and once the plate cycles through four of them a single grade cannot
        serve all four. This pins the contrast under the copy regardless of
        which frame is showing.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(6,13,28,0.85)_0%,rgba(6,13,28,0.6)_42%,rgba(6,13,28,0.3)_72%,rgba(6,13,28,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(to_top,rgba(6,13,28,0.88)_0%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="graticule mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -right-40 top-0 -z-10 h-[40rem] w-[40rem] opacity-50"
      />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-48 left-[12%] -z-10 h-[30rem] w-[30rem] opacity-35"
      />

      <Container className="relative z-10">
        <Breadcrumbs items={breadcrumbs} />
        <Chapter index={index} label={eyebrow} className="mb-8" />

        <MaskedLines
          as="h1"
          animate="mount"
          delay={0.12}
          className="d-1 max-w-[18ch] text-fg"
          lines={[title]}
        />

        <Reveal delay={0.28}>
          <p className="lede mt-7 max-w-2xl">{lead}</p>
        </Reveal>

        {(primaryCta || secondaryCta) && (
          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap gap-3">
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
      </Container>
    </section>
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
              <span className="label num text-accent/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[1.4rem] leading-tight tracking-[-0.018em] text-fg transition-colors duration-500 group-hover:text-accent sm:text-[1.7rem]">
                {item.title}
              </h3>
              {item.body && (
                <p className="max-w-md text-[0.88rem] leading-relaxed text-faint">
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
                <span className="label num shrink-0 text-accent/60">
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
                <span className="label num text-accent/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.89rem] leading-relaxed text-faint">
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
              <span className="label num text-accent/70">{s.step}</span>
              <h3 className="mt-3 font-display text-[1.25rem] leading-none tracking-[-0.018em] text-fg">
                {s.name}
              </h3>
              <p className="mt-2.5 text-[0.83rem] leading-relaxed text-faint">
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
  plate = "/images/plate-departure.webp",
}: {
  title: string;
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string; external?: boolean };
  plate?: string;
}) {
  return (
    <section className="plate plate-deep grain relative flex min-h-[52svh] items-center overflow-hidden tone-deep py-16">
      <div className="absolute inset-0 -z-10">
        <Image src={plate} alt="" fill sizes="100vw" loading="lazy" className="object-cover" />
      </div>
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-[30rem] w-[30rem] opacity-40"
      />
      <div
        aria-hidden
        className="graticule mask-radial pointer-events-none absolute inset-0 -z-10 opacity-50"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <MaskedLines as="h2" className="d-1 text-fg" lines={[title]} />
          {lead && (
            <Reveal delay={0.15}>
              <p className="lede mt-6 max-w-xl">{lead}</p>
            </Reveal>
          )}
          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Action href={primary.href} size="lg" magnetic>
                {primary.label}
              </Action>
              {secondary && (
                <Action
                  href={secondary.href}
                  external={secondary.external}
                  variant="line"
                  size="lg"
                >
                  {secondary.label}
                </Action>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
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
