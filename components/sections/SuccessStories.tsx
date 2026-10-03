import Image from "next/image";
import {
  Container,
  Section,
  Eyebrow,
  MaskedLines,
  Reveal,
  RevealGroup,
  RevealItem,
  ContentRequired,
} from "@/components/ui/Primitives";
import { successStories, successIntro } from "@/data/success-stories";

/**
 * SUCCESS STORIES.
 *
 * RENDERS NOTHING IN PRODUCTION UNTIL THERE ARE VERIFIED STORIES, and that is
 * the feature rather than a limitation. A success story names a real person,
 * a real institution and a real outcome; inventing one, or shipping a
 * plausible-looking empty state that implies there are some, is a claim this
 * site has no business making. See the header of data/success-stories.ts for
 * what an entry needs before it can exist.
 *
 * In development it shows what is missing instead, through the same
 * `ContentRequired` marker the rest of the site uses for gaps — loud for
 * whoever is building, invisible to a visitor.
 *
 * WHY NOT AN "ANONYMOUS SUCCESS STORY" PLACEHOLDER. Because an unattributed
 * story is indistinguishable from a written one, which is precisely why
 * unattributed stories are the ones nobody believes. A card with a real name
 * on it is worth more than six without.
 */
export function SuccessStories() {
  const shown = successStories.filter((s) => s.verified);

  if (shown.length === 0) {
    return (
      <ContentRequired
        label="Success stories — nothing is published yet"
        items={[
          "Written consent from each student, naming this website, and saying whether a photograph may be used.",
          "Institution, programme and year of entry, checked against their file in the portal.",
          "The quote as they wrote it.",
          "Add them to data/success-stories.ts with verified: true. The section then renders itself.",
        ]}
      />
    );
  }

  return (
    <Section id="success" tone="light" className="anchor-target">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,26rem)] lg:items-end lg:justify-between lg:gap-14">
          <div>
            <Eyebrow className="mb-5">{successIntro.eyebrow}</Eyebrow>
            <MaskedLines
              as="h2"
              className="d-2 max-w-[16ch] text-fg-strong"
              lines={successIntro.title}
            />
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              {successIntro.lead}
            </p>
          </Reveal>
        </div>

        <RevealGroup
          as="ul"
          stagger={0.08}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((s) => (
            <RevealItem
              as="li"
              key={s.slug}
              className="flex flex-col rounded-[var(--radius-md)] border border-line bg-raised p-6"
            >
              <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-fg">
                &ldquo;{s.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-4 border-t border-line pt-5">
                {s.portrait && (
                  <Image
                    src={s.portrait}
                    alt={s.portraitAlt ?? ""}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-semibold text-fg-strong">
                    {s.displayName}
                    {/*
                      Said out loud rather than hidden. A reader who notices a
                      first name with no surname assumes the worst about why;
                      saying it was the student's choice costs four words and
                      removes the doubt.
                    */}
                    {s.anonymised && (
                      <span className="ml-2 text-[0.75rem] font-normal text-faint">
                        name shortened at their request
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] leading-snug text-muted">
                    {s.programme}, {s.institution}
                  </p>
                  <p className="num mt-0.5 text-[0.75rem] text-faint">
                    From {s.from} · {s.year}
                  </p>
                </div>
              </figcaption>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-[0.82rem] leading-relaxed text-faint">
            Every student above agreed in writing to appear here. Their outcome
            is theirs and is not a prediction of anybody else&rsquo;s — admission
            decisions remain the institution&rsquo;s and visa decisions remain the
            relevant authority&rsquo;s.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
