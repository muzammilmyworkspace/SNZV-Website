import {
  Container,
  Section,
  Chapter,
  Reveal,
  MaskedLines,
  Caveat,
} from "@/components/ui/Primitives";
import { PartnerScroller } from "@/components/sections/PartnerScroller";
import { partnerCaveat } from "@/data/partners";

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
        {/*
          NUMBERED ON THE STUDY PAGE, NOT ON THE HOME PAGE.

          Home runs a meridian rail — dream, journeys, reality, method — and
          those numbers are the order of an argument. Partnerships is a
          credential rather than a step in it, so taking 01 and pushing the
          story down would make the rail say something untrue. StatsBand
          already sits in that flow without being a chapter; this follows it.
        */}
        {home ? (
          <span className="label mb-8 block text-accent">Partnerships</span>
        ) : (
          <Chapter index="04" label="Partnerships" tone="light" className="mb-8" />
        )}

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

        <PartnerScroller />

        <Caveat>{partnerCaveat}</Caveat>
      </Container>
    </Section>
  );
}
