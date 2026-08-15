"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { GoogleReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";

/**
 * REVIEW MARQUEE
 * ---------------------------------------------------------------------------
 * The Google reviews, looping continuously — no button, no arrows, nothing to
 * click. Reviews are proof, and proof should be read passively while the
 * visitor is deciding.
 *
 * WHY A DUPLICATED TRACK, NOT AN INDEX
 * A carousel that steps between slides has to jump when it reaches the end,
 * and that jump is visible. The track instead renders the review list TWICE
 * and translates by exactly -50%: at the moment the animation restarts, the
 * second copy sits precisely where the first began, so the seam is
 * mathematically invisible rather than merely fast.
 *
 * DURATION SCALES WITH COUNT
 * A fixed duration would crawl with three reviews and sprint with twenty.
 * Seconds-per-card keeps the reading pace constant however many there are.
 *
 * PAUSE ON INTERACTION
 * Hover and keyboard focus both stop the track. Motion that cannot be stopped
 * while you are trying to read it is hostile, and a focused link sliding out
 * from under the cursor is worse.
 *
 * REDUCED MOTION
 * No animation at all — the reviews become a plain scrollable row the visitor
 * moves themselves.
 */

const SECONDS_PER_CARD = 7;

export function ReviewMarquee({ reviews }: { reviews: GoogleReview[] }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Guard: one review cannot form a loop, so it simply sits there.
  const loopable = reviews.length > 1 && !reduced;
  const duration = reviews.length * SECONDS_PER_CARD;

  // Respect a reduced-motion preference that changes after mount.
  useEffect(() => {
    if (reduced) setPaused(false);
  }, [reduced]);

  const list = loopable ? [...reviews, ...reviews] : reviews;

  return (
    <div
      className="relative mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Edge fades, so cards enter and leave rather than being chopped off. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-10 bg-gradient-to-r from-[var(--surface)] to-transparent sm:w-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-10 bg-gradient-to-l from-[var(--surface)] to-transparent sm:w-20"
      />

      <div
        className={cn(
          "flex gap-5",
          // Without the loop this is a normal scroller the reader controls.
          loopable ? "w-max" : "snap-x snap-mandatory overflow-x-auto pb-2"
        )}
        ref={trackRef}
        style={
          loopable
            ? {
                animation: `review-marquee ${duration}s linear infinite`,
                animationPlayState: paused ? "paused" : "running",
              }
            : undefined
        }
      >
        {list.map((r, i) => (
          <ReviewCard
            key={`${r.author}-${i}`}
            review={r}
            // The second copy is decoration; a screen reader should hear each
            // review once.
            duplicate={loopable && i >= reviews.length}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  duplicate,
}: {
  review: GoogleReview;
  duplicate?: boolean;
}) {
  return (
    <figure
      aria-hidden={duplicate || undefined}
      className="flex w-[19rem] shrink-0 snap-start flex-col rounded-[var(--radius-md)] border border-line bg-raised p-6 sm:w-[22rem]"
    >
      <Stars value={review.rating} />

      <blockquote className="mt-4 line-clamp-6 text-[0.92rem] leading-relaxed text-fg">
        {review.text}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        {review.photoUrl ? (
          <Image
            src={review.photoUrl}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/15"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-[0.8rem] font-semibold text-muted"
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

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span>
      <span className="sr-only">{value.toFixed(1)} out of 5</span>
      <span aria-hidden className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 text-accent">
            <path
              d="M10 1.6l2.47 5.2 5.53.73-4.06 3.87 1.04 5.66L10 14.32 4.98 17.06l1.04-5.66L1.96 7.53l5.53-.73z"
              fill={rounded >= i ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </span>
    </span>
  );
}
