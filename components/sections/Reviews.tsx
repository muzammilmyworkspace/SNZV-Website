import Image from "next/image";
import {
  Container,
  Section,
  Chapter,
  MaskedLines,
  Reveal,
  RevealGroup,
  RevealItem,
  Action,
  TextLink,
} from "@/components/ui/Primitives";
import { Testimonials } from "./Testimonials";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews";
import { company } from "@/data/company";

/**
 * SOCIAL PROOF
 * ---------------------------------------------------------------------------
 * One section, two honest states:
 *
 *   • Google Places configured → the real reviews, verbatim, each attributed
 *     and linked back to the listing so any visitor can check them.
 *   • not configured           → the existing <Testimonials> placeholder,
 *     which says plainly that nothing is published yet.
 *
 * Nothing in between. No sample quotes, no "representative" copy, no averaged
 * paraphrase. If the API is down or the key is missing, the page says so by
 * showing less — never by inventing more.
 *
 * This is a server component so the Places key stays on the server.
 */
export async function Reviews() {
  const data = await getGoogleReviews();

  if (!data.configured || data.reviews.length === 0) {
    return <Testimonials />;
  }

  return (
    <Section id="proof" tone="deep" edge className="overflow-hidden">
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -left-32 top-1/3 h-[26rem] w-[26rem] opacity-25"
      />
      <Container className="relative">
        <Chapter index="—" label="Trust" className="mb-6" />

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-2 max-w-[16ch] text-fg-strong"
            lines={["What our students actually say."]}
          />

          <Reveal delay={0.12}>
            <div className="flex items-center gap-5">
              {data.rating !== null && (
                <div>
                  <span className="num block text-[2.6rem] leading-none tracking-[-0.03em] text-fg">
                    {data.rating.toFixed(1)}
                  </span>
                  <Stars value={data.rating} className="mt-2" />
                </div>
              )}
              <div className="border-l border-line pl-5">
                <GoogleMark />
                <p className="mt-2 text-[0.82rem] leading-snug text-faint">
                  {data.total !== null
                    ? `${data.total.toLocaleString("en-GB")} Google review${data.total === 1 ? "" : "s"}`
                    : "Google reviews"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {data.reviews.map((r, i) => (
            <RevealItem key={`${r.author}-${i}`}>
              <ReviewCard review={r} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Action href="/contact#journey" magnetic>
              Book a consultation
            </Action>
            <TextLink href={data.url} external>
              Read every review on Google
            </TextLink>
          </div>
        </Reveal>

        <p className="mt-8 max-w-2xl border-l border-line pl-5 text-[0.78rem] leading-relaxed text-faint">
          Reviews are published by their authors on Google and shown here
          unedited. SnZ Ventures cannot alter or remove them — follow the link
          above to read all of them, including any not shown here.
        </p>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------------- pieces */

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="flex h-full flex-col border-t border-line pt-6">
      <Stars value={review.rating} />

      <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-fg">
        {review.text}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        {review.photoUrl ? (
          <Image
            src={review.photoUrl}
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/15"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-raised text-[0.8rem] font-semibold text-muted"
          >
            {review.author.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-[0.88rem] font-semibold text-fg">
            {review.author}
          </span>
          <span className="mt-0.5 block text-[0.76rem] text-faint">
            {review.relativeTime}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Rounds to the nearest half star, which is how Google presents them. */
function Stars({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={className}>
      <span className="sr-only">{value.toFixed(1)} out of 5</span>
      <span aria-hidden className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = rounded >= i ? 1 : rounded >= i - 0.5 ? 0.5 : 0;
          // The gradient id must be deterministic. A random one differs
          // between the server and client render of the same markup.
          return <Star key={i} fill={fill} uid={`${rounded}-${i}`} />;
        })}
      </span>
    </span>
  );
}

function Star({ fill, uid }: { fill: number; uid: string }) {
  const id = `star-half-${uid}`;
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
      {fill === 0.5 && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.6l2.47 5.2 5.53.73-4.06 3.87 1.04 5.66L10 14.32 4.98 17.06l1.04-5.66L1.96 7.53l5.53-.73z"
        className="text-accent"
        fill={fill === 1 ? "currentColor" : fill === 0.5 ? `url(#${id})` : "none"}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 01-2.4 3.63v3h3.87c2.26-2.09 3.56-5.17 3.56-8.87z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0012 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.28a7.2 7.2 0 010-4.56V6.63H1.28a12 12 0 000 10.74z"
        />
        <path
          fill="#EA4335"
          d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 001.28 6.63l3.99 3.09C6.22 6.87 8.87 4.76 12 4.76z"
        />
      </svg>
      <span className="label text-muted">{company.name} on Google</span>
    </span>
  );
}
