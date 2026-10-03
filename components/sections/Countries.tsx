import Link from "next/link";
import {
  Container,
  Section,
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Eyebrow,
} from "@/components/ui/Primitives";
import { studyDestinations } from "@/data/study";

/**
 * WHERE OUR STUDENTS GO — the destinations, led by their flags.
 *
 * Sits immediately after the hero. Somebody who has just read "your ambition
 * has no borders" gets the borders named, in the one currency a student reads
 * instantly: their own flag next to the countries they have been weighing.
 *
 * NOT "TOP TEN COUNTRIES", and the difference is not pedantry. "Top" is a
 * claim about student numbers or quality and would need a cited source; an
 * invented ranking is exactly the kind of unevidenced number this site
 * withholds everywhere else (see the header of data/stats.ts). These ten are
 * the countries SnZ actually places students in, read from data/study.ts, and
 * a reader can check every one by scrolling. That is both true and the
 * stronger line.
 *
 * TEN, BECAUSE THE DATA SAYS TEN. The count is not hardcoded anywhere here —
 * add an eleventh destination to study.ts and it appears, with its flag, as
 * long as scripts/fetch-flags.mjs has an ISO code for it.
 *
 * THE FLAGS ARE SVG, so "HD" is not a thing that can be got wrong: one file is
 * sharp at 24px and at 2400px. See scripts/fetch-flags.mjs.
 */
export function Countries() {
  return (
    <Section id="countries" tone="soft" className="anchor-target">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,26rem)] lg:items-end lg:justify-between lg:gap-14">
          <div>
            <Eyebrow className="mb-5">Destinations</Eyebrow>
            <MaskedLines
              as="h2"
              className="d-2 max-w-[14ch] text-fg-strong"
              lines={["Where our", "students go."]}
            />
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Ten European countries we place students into, with what each one
              actually costs and the reason students shortlist it. Every figure
              is indicative and published — none of it is a quote.
            </p>
          </Reveal>
        </div>

        {/*
          Two across on a phone, not one. A flag is recognised at a glance and
          a single column makes ten of them a long scroll past content nobody
          needs to read in full — the point of this grid is scanning for your
          own country, and scanning wants density.
        */}
        <RevealGroup
          as="ul"
          stagger={0.055}
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6"
        >
          {studyDestinations.map((d, i) => (
            <RevealItem as="li" key={d.slug}>
              <Link
                href={`/study-abroad#destinations`}
                className="group block focus-visible:outline-none"
                aria-label={`${d.country} — study destinations`}
              >
                {/*
                  4:3, the ratio the file is drawn at. Flags are not all 3:2 —
                  several of these are 2:1 — and the source set normalises them
                  to one box with the design centred rather than stretched. A
                  squashed national flag is the detail a student from that
                  country notices before anything else on the page.
                */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-sm)] border border-line bg-raised">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/flags/${d.slug}.svg`}
                    alt={`Flag of ${d.country}`}
                    width={400}
                    height={300}
                    /*
                      The first five are the top row and are above the fold on
                      a laptop; the rest can wait. Explicit width and height on
                      every one, so the grid reserves its space and nothing
                      shifts as they arrive.
                    */
                    loading={i < 5 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                  />
                  {/*
                    A hairline inset over the artwork. Several of these flags
                    have a white band on at least one edge, which dissolves
                    into a light surface and leaves the card looking clipped.
                    The border alone does not fix it because the artwork sits
                    inside it.
                  */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[var(--radius-sm)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
                  />
                </div>

                {/*
                  The rule that draws on hover and on focus. Same hairline
                  language as the rest of the page, and the only hover
                  affordance here that a keyboard also gets — which is why it
                  is `group-focus-visible` as well.
                */}
                <span
                  aria-hidden
                  className="mt-3 block h-px w-0 bg-[var(--accent)] transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-full group-focus-visible:w-full motion-reduce:transition-none"
                />

                <p className="mt-3 text-[0.95rem] font-semibold leading-tight tracking-[-0.01em] text-fg-strong">
                  {d.country}
                </p>
                <p className="mt-1 text-[0.78rem] leading-snug text-faint">
                  {d.city}
                </p>
                <p className="num mt-2 text-[0.78rem] text-accent">
                  {d.tuitionFrom}
                </p>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
                  {d.draw}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-[0.82rem] leading-relaxed text-faint">
            Tuition figures are indicative annual course fees published by SnZ
            Ventures, not quotes. Admission decisions remain the institution&rsquo;s
            and visa decisions remain the relevant authority&rsquo;s.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
