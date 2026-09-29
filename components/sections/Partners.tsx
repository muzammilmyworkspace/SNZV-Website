import {
  Container,
  Section,
  Chapter,
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Caveat,
} from "@/components/ui/Primitives";
import { partners, partnerHorizon, partnerCaveat } from "@/data/partners";

/**
 * NAMED INSTITUTIONAL PARTNERSHIPS.
 *
 * The one section on this site that says a third party has agreed to
 * something, which is why every word in it comes from data/partners and
 * nothing is written here. See that file's header.
 *
 * NO LOGOS. A partner's mark is theirs, and reproducing one is a use of their
 * brand that belongs in a signed agreement rather than in a layout decision.
 * The institution's own name, set properly, says the same thing and cannot be
 * wrong.
 *
 * THE CAVEAT IS PART OF THE SECTION, not a footnote under it. A student
 * reading "we have partnered with" will assume a place is being held for them
 * unless the page says otherwise, and the sentence that corrects that should
 * not be somewhere they have to scroll to find.
 */
export function Partners({ variant = "page" }: { variant?: "page" | "home" }) {
  const home = variant === "home";

  return (
    <Section
      id="partners"
      tone="paper"
      className="anchor-target"
    >
      <Container>
        <Chapter
          index="04"
          label="Partnerships"
          tone="light"
          className="mb-8"
        />

        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,26rem)] lg:items-end lg:justify-between lg:gap-14">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[16ch] text-fg-strong"
            lines={home ? ["Institutions we", "work with."] : ["The universities", "we work with."]}
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Agreements with named institutions, so an application goes through
              a relationship rather than a form. Each one is listed here only
              after it exists.
            </p>
          </Reveal>
        </div>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {partners.map((p) => (
            <RevealItem
              as="li"
              key={p.slug}
              className="flex flex-col rounded-[var(--radius-md)] border border-line bg-raised p-6"
            >
              <span className="label text-accent">
                {p.city} · {p.country}
              </span>

              <h3 className="mt-2 text-[1.15rem] font-semibold leading-tight tracking-[-0.015em] text-fg-strong">
                {p.name}
              </h3>

              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                {p.blurb}
              </p>

              {/* Pushed to the bottom so cards with three highlights and cards
                  with four still line their lists up with each other. */}
              <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-4">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2.5 text-[0.85rem] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-moss-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        {/*
          COUNTRIES, NOT INSTITUTIONS. Naming a university before an agreement
          exists is the one thing this section must never do, and where the
          next ones are coming is both true and useful to somebody deciding
          where to apply.
        */}
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-[var(--radius-md)] border border-dashed border-line p-6">
            <span className="label text-faint">More in progress</span>
            <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-muted">
              Further institutional partnerships are being formed in{" "}
              {partnerHorizon.map((c, i) => (
                <span key={c}>
                  <span className="text-fg">{c}</span>
                  {i < partnerHorizon.length - 2
                    ? ", "
                    : i === partnerHorizon.length - 2
                      ? " and "
                      : ""}
                </span>
              ))}
              . Each is named here once it is signed, and not before.
            </p>
          </div>
        </Reveal>

        <Caveat>{partnerCaveat}</Caveat>
      </Container>
    </Section>
  );
}
