import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Section,
  Chapter,
  Action,
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Caveat,
  TextLink,
} from "@/components/ui/Primitives";
import { StudyDestinationCard } from "@/components/cards/Cards";
import {
  studyDestinations,
  studyFields,
  studyJourney,
  scholarshipNotes,
  supportServices,
  studyFacts,
  studyCaveat,
} from "@/data/study";
import { company } from "@/data/company";
import { Fragment } from "react";

/**
 * STUDY ABROAD SECTIONS
 * ---------------------------------------------------------------------------
 * Every section is a server component. The page is long and largely static, so
 * pushing it to the client would cost hydration for no interactivity — the
 * only client boundaries on this page are the sub-nav, the cards' hover motion
 * and the FAQ accordion, each of which already owns its own "use client".
 *
 * Section ids match STUDY_SECTIONS in ./StudyNav. Keep the two in step: a
 * missing id silently drops that entry from the scroll spy.
 */

/* ═══════════════════════════════════════════════════════════ Hero ═══ */

export function StudyHero() {
  return (
    <section className="plate plate-deep grain relative flex min-h-[86svh] items-end overflow-hidden tone-deep pb-16 pt-32 md:pb-20 md:pt-40">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/atmos-library.webp"
          alt="Reading room lined with books at a European university library"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="graticule mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -right-40 top-0 -z-10 h-[42rem] w-[42rem] opacity-50"
      />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-52 left-[10%] -z-10 h-[32rem] w-[32rem] opacity-35"
      />

      <Container className="relative z-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="label text-faint transition-colors hover:text-accent"
              >
                Home
              </Link>
            </li>
            <li aria-hidden className="text-white/20">
              /
            </li>
            <li>
              <span aria-current="page" className="label text-faint">
                Study Abroad
              </span>
            </li>
          </ol>
        </nav>

        <Chapter index="—" label="For students" className="mb-8" />

        <MaskedLines
          as="h1"
          animate="mount"
          delay={0.12}
          className="d-hero max-w-[15ch] text-fg"
          lines={[
            "Study in Europe.",
            <Fragment key="plan">
              Graduate with a <span className="d-em">plan</span>.
            </Fragment>,
          ]}
        />

        <Reveal delay={0.3}>
          <p className="lede mt-8 max-w-2xl">
            From choosing a destination and a university through application,
            admission, visa and departure — one advisory team, one named
            advisor, and honest answers at every step of the journey.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Action href="/contact#journey" size="lg" magnetic>
              Book a consultation
            </Action>
            <Action href="#destinations" variant="line" size="lg">
              Explore destinations
            </Action>
          </div>
        </Reveal>

        {/* Facts, not claims. Every number here is checkable from this page. */}
        <Reveal delay={0.5}>
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
            {studyFacts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="num block text-[2.4rem] leading-none tracking-[-0.03em] text-fg">
                    {f.value}
                    {f.suffix}
                  </span>
                  <span className="label mt-2 block text-accent">{f.label}</span>
                  <span className="mt-1.5 block text-[0.76rem] leading-snug text-faint">
                    {f.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════ Overview ═══ */

const WHY_STUDY = [
  {
    title: "A qualification that travels",
    body: "A degree from an EU institution is recognised across all 27 member states as a matter of law — not as a favour, and not subject to a case-by-case decision.",
  },
  {
    title: "Tuition that is not the American number",
    body: "Public universities across our destinations publish annual fees from roughly €900. Germany charges little or nothing at public institutions. The cost gap with the English-speaking world is enormous.",
  },
  {
    title: "Taught in English, more than you think",
    body: "Every destination on our list runs full degree programmes in English. Learning the local language helps you live there; it is rarely what stands between you and admission.",
  },
  {
    title: "A labour market on the other side",
    body: "You are choosing where to start a career, not just where to study. That is why we work backwards from hiring demand rather than forwards from a prospectus.",
  },
];

export function StudyOverview() {
  return (
    <Section id="overview" tone="soft" className="anchor-target overflow-hidden">
      <div
        aria-hidden
        className="graticule pointer-events-none absolute inset-0 opacity-40"
      />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <Chapter index="01" label="Why study abroad" className="mb-8" />
            <MaskedLines
              as="h2"
              className="d-2 max-w-[14ch] text-fg-strong"
              lines={["Not a brochure", "decision."]}
            />
            <Reveal delay={0.12}>
              <p className="lede mt-6 max-w-md">
                Studying abroad is a career decision that happens to start with
                a course. We help you make it in that order.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <TextLink href="/contact#journey">Talk to an advisor</TextLink>
              </div>
            </Reveal>
          </div>

          <RevealGroup as="ol" className="border-t border-line">
            {WHY_STUDY.map((item, i) => (
              <RevealItem
                as="li"
                key={item.title}
                className="group border-b border-line py-7"
              >
                <span className="label num text-accent/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.4rem] leading-tight tracking-[-0.018em] text-fg transition-colors duration-500 group-hover:text-accent sm:text-[1.65rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-[0.88rem] leading-relaxed text-muted">
                  {item.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════ Destinations ═══ */

/**
 * Shared by /study-abroad and the homepage.
 *
 * `variant="home"` trims the grid to a preview row and swaps the copy for the
 * homepage's voice; the card, the data and the layout stay identical so the
 * two pages read as one ecosystem rather than two teams' work.
 */
export function StudyDestinations({
  variant = "page",
}: {
  variant?: "page" | "home";
}) {
  const home = variant === "home";
  const shown = home ? studyDestinations.slice(0, 5) : studyDestinations;

  return (
    <Section
      id={home ? "study-destinations" : "destinations"}
      tone="deep"
      className="anchor-target overflow-hidden"
    >
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 opacity-25"
      />
      <Container className="relative">
        <Chapter
          index={home ? "06" : "02"}
          label={home ? "Study destinations" : "Destinations"}
          className="mb-8"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[17ch] text-fg-strong"
            lines={
              home
                ? ["Ten European", "starting points."]
                : ["Ten countries.", "One European degree."]
            }
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              {home
                ? "Our study pathway covers ten EU destinations, with indicative annual tuition published for each so you can compare honestly before you commit."
                : "Indicative annual tuition, published so you can compare before you invest a year in an application. The right country is the one where your field is taught well and hired for — not the one with the best photographs."}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-5">
          {shown.map((d, i) => (
            <StudyDestinationCard
              key={d.slug}
              destination={d}
              index={i}
              href={home ? "/study-abroad#destinations" : "/contact#journey"}
            />
          ))}
        </div>

        {home && (
          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Action href="/study-abroad#destinations" size="md">
                See all ten destinations
              </Action>
              <TextLink href="/study-abroad">
                Explore the study pathway
              </TextLink>
            </div>
          </Reveal>
        )}

        <Caveat>
          Tuition figures are indicative annual amounts published for guidance,
          not quotations. Actual fees depend on the institution, the programme
          and your nationality, and living costs vary more by city than by
          country.
        </Caveat>
      </Container>
    </Section>
  );
}

/* ══════════════════════════════════════════════════ Universities ═══ */

const SHORTLIST_CRITERIA = [
  {
    title: "Is the programme accredited where it matters?",
    body: "For regulated fields — medicine, engineering, law — accreditation decides whether you can practise. It is checked before you apply, not after you graduate.",
  },
  {
    title: "Who hires from this course?",
    body: "Not the university's overall reputation. The specific programme, and where its graduates actually end up working.",
  },
  {
    title: "Is your profile genuinely competitive?",
    body: "An honest read on your transcript, your language position and your budget against the intake this institution actually admits.",
  },
  {
    title: "What does the whole year cost?",
    body: "Tuition, living, insurance, and the government charges nobody mentions until they are due. Compared across your whole shortlist, not per line.",
  },
];

export function StudyUniversities() {
  return (
    <Section id="universities" tone="paper" edge className="anchor-target">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Chapter index="03" label="Universities" tone="light" className="mb-8" />
            <MaskedLines
              as="h2"
              className="d-2 max-w-[15ch] text-fg-strong"
              lines={["Three to five you", "can defend."]}
            />
            <Reveal delay={0.12}>
              <p className="lede mt-6 max-w-md">
                A shortlist is not a long list. We build a small set of
                programmes matched to your goals and your finances, and we
                state the trade-off on each one.
              </p>
            </Reveal>
            <div className="mt-8">
              <Action href="/contact#journey" variant="ghost">
                Find your university
              </Action>
            </div>
            <Caveat>
              SnZ Ventures does not claim institutional partnerships on this
              site. Where an arrangement exists it is named to you directly,
              in writing, for your specific case.
            </Caveat>
          </div>

          <RevealGroup as="ul" className="border-t border-line">
            {SHORTLIST_CRITERIA.map((c, i) => (
              <RevealItem
                as="li"
                key={c.title}
                className="border-b border-line py-6"
              >
                <div className="flex items-baseline gap-5">
                  <span className="label num shrink-0 text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.2rem] leading-tight tracking-[-0.015em] text-fg">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[0.87rem] leading-relaxed text-muted">
                      {c.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════ Programmes ═══ */

export function StudyProgrammes() {
  return (
    <Section id="programmes" tone="soft" className="anchor-target overflow-hidden">
      <div
        aria-hidden
        className="graticule pointer-events-none absolute inset-0 opacity-40"
      />
      <Container className="relative">
        <Chapter index="04" label="Programmes" className="mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[16ch] text-fg-strong"
            lines={["What you study", "decides the rest."]}
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Seven programme families, each with a different relationship to
              the labour market on the other side. The difference is worth
              understanding before you choose.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-x-12 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
          {studyFields.map((f, i) => (
            <RevealItem
              key={f.name}
              className="group border-t border-line pt-6"
            >
              <span className="label num text-accent/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[1.45rem] leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent">
                {f.name}
              </h3>
              <p className="label mt-2 text-faint">{f.examples}</p>
              <p className="mt-3 text-[0.87rem] leading-relaxed text-muted">
                {f.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mt-12">
            <Action href="/contact#journey" variant="line">
              Explore programmes
            </Action>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════ Scholarships ═══ */

export function StudyScholarships() {
  return (
    <Section id="scholarships" tone="deep" className="anchor-target overflow-hidden">
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-40 right-[8%] h-[30rem] w-[30rem] opacity-30"
      />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <Chapter index="05" label="Scholarships" className="mb-8" />
            <MaskedLines
              as="h2"
              className="d-2 max-w-[13ch] text-fg-strong"
              lines={["Funding is", "a calendar."]}
            />
            <Reveal delay={0.12}>
              <p className="lede mt-6 max-w-md">
                Nobody can promise you a scholarship. What we can do is make
                sure you are in front of every scheme you actually qualify for,
                before its deadline rather than after.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {scholarshipNotes.map((n, i) => (
              <RevealItem key={n.title} className="border-t border-line pt-5">
                <span className="label num text-accent/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.25rem] leading-tight tracking-[-0.018em] text-fg">
                  {n.title}
                </h3>
                <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted">
                  {n.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════ Journey ═══ */

export function StudyJourney() {
  return (
    <Section id="journey" tone="paper" edge className="anchor-target">
      <Container>
        <Chapter index="06" label="How it works" tone="light" className="mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[17ch] text-fg-strong"
            lines={["Five stages, first", "call to first week."]}
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              No obligation at any stage, and we tell you early if we are not
              the right firm for you.
            </p>
          </Reveal>
        </div>

        <RevealGroup as="ol" className="mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {studyJourney.map((s) => (
            <RevealItem as="li" key={s.step} className="border-t border-line pt-5">
              <span className="label num text-accent/70">{s.step}</span>
              <h3 className="mt-3 font-display text-[1.25rem] leading-none tracking-[-0.018em] text-fg">
                {s.name}
              </h3>
              <p className="mt-2.5 text-[0.83rem] leading-relaxed text-muted">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Action href="/contact#journey">Start your application</Action>
            <TextLink href="/register">Create a student account</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════ Support ═══ */

export function StudySupport() {
  return (
    <Section id="support" tone="soft" className="anchor-target overflow-hidden">
      <div
        aria-hidden
        className="graticule pointer-events-none absolute inset-0 opacity-40"
      />
      <Container className="relative">
        <Chapter index="07" label="Student support" className="mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[16ch] text-fg-strong"
            lines={["The part that", "starts after yes."]}
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              An offer letter is a milestone, not an outcome. Most of the work
              that decides whether you actually arrive happens afterwards.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-x-12 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
          {supportServices.map((s, i) => (
            <RevealItem key={s.title} className="group border-t border-line pt-6">
              <span className="label num text-accent/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[1.35rem] leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.87rem] leading-relaxed text-muted">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Action href="/login" variant="line">
              Log in to the student portal
            </Action>
            <TextLink
              href={`https://wa.me/${company.contact.whatsapp}`}
              external
            >
              Message us on WhatsApp
            </TextLink>
          </div>
        </Reveal>

        <Caveat>{studyCaveat}</Caveat>
      </Container>
    </Section>
  );
}
