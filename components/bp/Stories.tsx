import { getGoogleReviews } from "@/lib/reviews";
import { successStories, successIntro } from "@/data/success-stories";
import { company } from "@/data/company";
import { Reveal } from "./Reveal";

/**
 * STUDENT STORIES + REVIEWS.
 *
 * Both sources are claims about real, named people, so both are gated:
 *   • success stories render only with `verified: true` (written consent on
 *     file — see the header of data/success-stories.ts);
 *   • reviews are real Google reviews, live from the Places API when it is
 *     configured, otherwise the verbatim manual list.
 *
 * When neither has anything to show — which is the state today — the section
 * does NOT invent a quote. It shrinks to a single line pointing at the Google
 * listing, where anybody can read what students actually wrote.
 */
export async function Stories() {
  const data = await getGoogleReviews();
  const stories = successStories.filter((s) => s.verified);
  const reviews = data.reviews;

  if (!stories.length && !reviews.length) {
    return (
      <section aria-label="Reviews" className="relative z-10 py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <Reveal className="bp-pass-dark flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="bp-mono text-[var(--color-aurora)]">Reviews</p>
              <p className="bp-display mt-2 text-[1.5rem] leading-tight sm:text-[1.9rem]">
                Read what our students say on Google, in their own words.
              </p>
            </div>
            <a href={company.social.googleReviews} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost shrink-0">
              Open our Google reviews
            </a>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="stories-title" className="relative z-10 py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="bp-eyebrow">{successIntro.eyebrow}</p>
        <h2 id="stories-title" className="bp-display bp-h2 mt-5 max-w-4xl">
          {successIntro.title.join(" ")}
        </h2>

        {stories.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <figure className="bp-paper h-full p-6">
                  <blockquote className="text-[1.05rem] leading-relaxed">&ldquo;{s.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5">
                    <p className="font-semibold">{s.displayName}</p>
                    <p className="bp-mono mt-1 !text-[0.72rem]">
                      {s.from} → {s.institution} · {s.year}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <div className="bp-marquee mt-12 overflow-hidden">
            <div className="bp-marquee-track" style={{ ["--bp-speed" as string]: "70s" }}>
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 ? "true" : undefined}>
                  {reviews.map((r, i) => (
                    <li key={`${copy}-${i}`} className="bp-pass-dark w-[340px] shrink-0 p-6">
                      <p className="text-[var(--color-runway)]" aria-label={`${r.rating} out of 5 stars`}>
                        {"★".repeat(Math.round(r.rating))}
                      </p>
                      <p className="mt-3 line-clamp-5 text-[0.95rem] leading-relaxed text-[var(--bp-fg)]">{r.text}</p>
                      <p className="mt-4 text-[0.85rem] font-semibold">{r.author}</p>
                      <p className="bp-mono mt-1 !text-[0.72rem] text-[var(--bp-faint)]">{r.relativeTime} · Google</p>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}

        <a href={data.url} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost mt-10">
          Read every review on Google
        </a>
      </div>
    </section>
  );
}
