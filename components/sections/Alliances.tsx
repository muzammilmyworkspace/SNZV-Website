import Image from "next/image";
import {
  Container,
  Reveal,
  MaskedLines,
  Eyebrow,
  Caveat,
} from "@/components/ui/Primitives";
import {
  partners,
  partnerHorizon,
  horizonPoster,
  horizonPosterAlt,
  partnerCaveat,
} from "@/data/partners";

/**
 * NAMED INSTITUTIONAL PARTNERSHIPS.
 *
 * Replaces the poster scroller on the homepage. That was four equal cards in
 * a horizontal rail — a carousel, with the institution's name set at list
 * size under a thumbnail. It treated the strongest claim on the site as a
 * gallery item.
 *
 * Each partnership now takes a full row: the name at display size on one
 * side, the announcement itself on the other, alternating down the page so
 * the eye crosses the hairline between them. No scrolling sideways, nothing
 * hidden off-screen, and the thing a reader is being asked to believe —
 * "we work directly with THIS university" — is the largest type in the row.
 *
 * THE ARTWORK IS SnZ'S OWN. Each poster is the creative published for that
 * partnership, which is where the institution's logo and its campus
 * photography come from — the firm's own announcement rather than a mark
 * reassembled here.
 *
 * THE TEXT IS STILL TEXT. Everything baked into a poster is invisible to a
 * search engine and to a screen reader, so the name, city and highlights sit
 * beside the image as content. The poster is the picture; it is not the copy.
 *
 * Every word comes from data/partners.ts — see that file's header on why
 * nothing here is summarised, improved or inferred.
 *
 * NO LAZY LOADING ON THE FIRST POSTER. It is the first image below the fold
 * on a page whose hero carries no photograph at all, so it is a realistic
 * Largest Contentful Paint candidate.
 */
export function Alliances() {
  return (
    <section id="partners" className="tone-light anchor-target relative py-20 md:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,24rem)] lg:items-end lg:justify-between lg:gap-14">
          <div>
            <Eyebrow className="mb-5">Partnerships</Eyebrow>
            <MaskedLines
              as="h2"
              className="d-2 max-w-[15ch] text-fg-strong"
              lines={["The institutions", "we work with."]}
            />
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Agreements with named institutions, so an application goes through
              a relationship rather than a form. Each one is listed here only
              after it exists.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 space-y-16 md:space-y-24">
          {partners.map((p, i) => (
            <li key={p.slug}>
              <Reveal>
                <article
                  className={
                    "grid items-center gap-8 border-t border-line pt-10 md:gap-14 lg:grid-cols-2 " +
                    /* Alternating sides. The poster leads on the odd rows, so
                       the page does not read as three identical slides. */
                    (i % 2 === 1 ? "lg:[&>figure]:order-first" : "")
                  }
                >
                  <div className="min-w-0">
                    <p className="label flex items-center gap-3" style={{ color: p.tint }}>
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      <span aria-hidden className="inline-block h-px w-6 bg-current opacity-50" />
                      {p.city} · {p.country}
                    </p>

                    <h3 className="d-2 mt-5 text-fg-strong">{p.name}</h3>

                    <p className="lede mt-5 max-w-lg">{p.blurb}</p>

                    {/*
                      The highlights as ruled rows rather than pills. Pills read
                      as tags on a card; a ruled list reads as terms of an
                      agreement, which is what these are.
                    */}
                    <ul className="mt-8 max-w-lg divide-y divide-line border-y border-line">
                      {p.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-baseline gap-3 py-3 text-[0.9rem] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: p.tint }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/*
                    Capped at 26rem. A 4:5 poster filling a 42rem column is
                    840px tall, which left the text block floating in the
                    middle of an enormous row with air above and below it.
                    Pushed to the outer edge of its column so the alternating
                    layout still reads as alternating.
                  */}
                  <figure
                    className={
                      "mx-auto w-full min-w-0 max-w-[26rem] lg:mx-0 " +
                      /* Hugs the OUTER edge of its column, which flips with
                         the row. Pinned to one side it drifts toward the
                         middle on every other row and the alternation stops
                         reading as deliberate. */
                      (i % 2 === 1 ? "lg:mr-auto" : "lg:ml-auto")
                    }
                  >
                    {/*
                      4:5, the proportion the artwork was made at. Anything else
                      either crops the institution's logo out of the top or
                      letterboxes it.
                    */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-line">
                      <Image
                        src={p.poster}
                        alt={p.posterAlt}
                        fill
                        sizes="(max-width: 1024px) 92vw, 26rem"
                        priority={i === 0}
                        className="object-cover"
                      />
                      {/* The institution's own colour, as a hairline the
                          poster sits inside rather than a wash over it. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)]"
                        style={{ boxShadow: `inset 0 0 0 1px ${p.tint}55` }}
                      />
                    </div>
                  </figure>
                </article>
              </Reveal>
            </li>
          ))}

          {/* The fourth. Countries, never institutions — naming a university
              before an agreement exists is the one thing this must not do. */}
          <li>
            <Reveal>
              <article className="grid items-center gap-8 border-t border-dashed border-line pt-10 md:gap-14 lg:grid-cols-2">
                <div className="min-w-0">
                  <p className="label flex items-center gap-3 text-accent">
                    <span className="num">{String(partners.length + 1).padStart(2, "0")}</span>
                    <span aria-hidden className="inline-block h-px w-6 bg-current opacity-50" />
                    In progress
                  </p>

                  <h3 className="d-2 mt-5 text-fg-strong">More partnerships</h3>

                  <p className="lede mt-5 max-w-lg">
                    Each one is named here once it is signed, and not before.
                    These are the countries they are being formed in.
                  </p>

                  <ul className="mt-8 flex max-w-lg flex-wrap gap-2">
                    {partnerHorizon.map((c) => (
                      <li
                        key={c}
                        className="rounded-full border border-line px-3 py-1.5 text-[0.8rem] text-muted"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <figure className="mx-auto w-full min-w-0 max-w-[26rem] lg:mx-0 lg:ml-auto">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-line">
                    <Image
                      src={horizonPoster}
                      alt={horizonPosterAlt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 26rem"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </article>
            </Reveal>
          </li>
        </ul>

        <Caveat>{partnerCaveat}</Caveat>
      </Container>
    </section>
  );
}
