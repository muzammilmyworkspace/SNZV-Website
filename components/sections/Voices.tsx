import {
  Container,
  Reveal,
  MaskedLines,
  Eyebrow,
  ContentRequired,
  Action,
} from "@/components/ui/Primitives";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews";
import { company } from "@/data/company";

/**
 * WHAT CLIENTS SAID.
 *
 * Replaces the Reviews / ReviewMarquee pair on the homepage. That was a
 * looping ticker of cards: a device that says "there are so many of these we
 * had to scroll them", which is a claim in itself and one this firm cannot
 * make yet — the manual list in data/google-reviews.ts is empty and no Places
 * key is set, so the marquee was looping a placeholder.
 *
 * TWO HONEST STATES, AND NOTHING BETWEEN THEM:
 *
 *   reviews exist  → they are shown verbatim, attributed, with the rating as
 *                    drawn marks and a link to the listing so any visitor can
 *                    compare in one click.
 *   none exist     → the section renders NOTHING in production, and a build
 *                    note in development saying what is needed.
 *
 * No sample quotes, no "representative" copy, no averaged paraphrase. An
 * invented review is a false statement attributed to a named person, and the
 * section links straight to Google — a mismatch is worse than an empty page.
 *
 * A server component, so the Places key never reaches the browser.
 */
export async function Voices() {
  const data = await getGoogleReviews();
  const reviews = data.configured ? data.reviews : [];

  if (reviews.length === 0) {
    return (
      <ContentRequired
        label="Client reviews — nothing is published yet"
        items={[
          "Paste real reviews from the Google Business Profile into data/google-reviews.ts — verbatim: same words, same name, same rating.",
          "Or set GOOGLE_PLACES_API_KEY and they are pulled live and stay current on their own.",
          "Never write, shorten or improve one. The section links to the listing, so anyone can compare in a click.",
        ]}
      />
    );
  }

  /*
    The longest review leads. It is the one carrying the most evidence, and a
    pull quote is only worth the space at this size if there is something in
    it to read.
  */
  const [lead, ...rest] = [...reviews].sort((a, b) => b.text.length - a.text.length);

  return (
    <section id="proof" className="tone-deep anchor-target relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -left-32 top-1/4 h-[26rem] w-[26rem] opacity-25"
      />

      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,22rem)] lg:items-end lg:justify-between lg:gap-14">
          <div>
            <Eyebrow className="mb-5">In their words</Eyebrow>
            <MaskedLines
              as="h2"
              className="d-2 max-w-[14ch] text-fg-strong"
              lines={["What clients", "actually said."]}
            />
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Published on our Google listing, copied here word for word.
              {data.rating != null && data.total != null && (
                <>
                  {" "}
                  <span className="num text-fg">{data.rating.toFixed(1)}</span> from{" "}
                  <span className="num text-fg">{data.total}</span> reviews.
                </>
              )}
            </p>
          </Reveal>
        </div>

        {/* The lead quote, at the size a quote deserves when it is real. */}
        <Reveal>
          <figure className="mt-14 border-t border-line pt-10">
            <Stars rating={lead.rating} />
            <blockquote className="d-3 mt-6 max-w-4xl text-fg-strong">
              &ldquo;{lead.text}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[0.95rem] font-semibold text-fg">{lead.author}</span>
              <span className="text-[0.82rem] text-faint">{lead.relativeTime}</span>
            </figcaption>
          </figure>
        </Reveal>

        {rest.length > 0 && (
          <ul className="mt-14 grid gap-px border-t border-line bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <li key={r.author + r.relativeTime} className="bg-surface p-7">
                <Stars rating={r.rating} />
                <blockquote className="mt-5 text-[0.95rem] leading-relaxed text-muted">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <p className="mt-5 text-[0.88rem] font-semibold text-fg">{r.author}</p>
                <p className="mt-0.5 text-[0.78rem] text-faint">{r.relativeTime}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <Action href={data.url || company.social.googleReviews} external variant="line">
            Read them on Google
          </Action>
        </div>
      </Container>
    </section>
  );
}

/**
 * The rating, as five marks rather than five glyphs.
 *
 * A row of filled and empty rules is the same hairline language the rest of
 * the page is drawn in, and it cannot be mistaken for Google's own star mark —
 * which is a trademark this site has no licence to reproduce.
 */
function Stars({ rating }: { rating: GoogleReview["rating"] }) {
  const n = Math.round(rating);
  return (
    <p className="flex items-center gap-1.5" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={
            i < n
              ? "block h-[3px] w-6 rounded-full bg-[var(--accent)]"
              : "block h-[3px] w-6 rounded-full bg-[var(--line-strong)]"
          }
        />
      ))}
    </p>
  );
}
