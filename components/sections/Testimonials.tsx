"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Container,
  Section,
  Chapter,
  MaskedLines,
  Reveal,
  Action,
} from "@/components/ui/Primitives";
import { company, testimonials, type Testimonial } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * TESTIMONIALS
 * ---------------------------------------------------------------------------
 * `data/company.ts → testimonials` is empty and stays that way until real,
 * consented quotes exist. Fabricating them is out of the question, so this
 * component has two honest states:
 *
 *   • populated → an editorial slider (keyboard, swipe, autoplay-free)
 *   • empty     → a finished panel that points at the Google listing, where
 *                 the real reviews live and where SnZ cannot edit them
 *
 * Adding entries to the array switches states with no code change.
 */

const PATHWAY_LABEL: Record<Testimonial["pathway"], string> = {
  study: "Student",
  careers: "Professional",
  business: "Business",
};

export function Testimonials() {
  const items = testimonials;
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (!items.length) return;
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    const el = regionRef.current;
    if (!el || items.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go, index, items.length]);

  /* ------------------------------------------------------- empty state -- */

  if (!items.length) {
    return (
      <Section id="proof" tone="deep" edge className="overflow-hidden">
        <div
          aria-hidden
          className="bloom-moss pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-25"
        />
        <Container className="relative">
          <Chapter index="—" label="Trust" className="mb-6" />
          {/* Stretch so the panel's top and bottom edges line up with the
              copy beside it rather than floating centred against it. */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-16">
            <div className="flex flex-col justify-center">
              <MaskedLines
                as="h2"
                className="d-2 max-w-[16ch] text-fg-strong"
                lines={["Every journey starts with trust."]}
              />
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">
                  We don&rsquo;t publish testimonials we can&rsquo;t verify, and
                  we won&rsquo;t write them ourselves. Our clients&rsquo; own
                  words are on our Google listing, where we cannot edit or
                  remove them — read them there.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action
                    href={company.social.googleReviews}
                    external
                    magnetic
                    onClick={() => analytics.outbound(company.social.googleReviews)}
                  >
                    Read our Google reviews
                  </Action>
                  <Action href="/contact#journey" variant="line">
                    Start a conversation
                  </Action>
                </div>
              </Reveal>
            </div>

            {/*
              A finished panel, not a placeholder.

              This used to be a dashed frame with grey bars and the words
              "[Real testimonial required]" — engineering scaffolding sitting
              on a live marketing page. The honest position has not changed:
              nothing is invented here. But the way to say "our reviews are
              somewhere you can verify them" is to point at that place
              confidently, not to draw an empty quote card.
            */}
            <Reveal delay={0.1} className="h-full">
              <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-raised p-8">
                <span className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                    <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 01-2.4 3.63v3h3.87c2.26-2.09 3.56-5.17 3.56-8.87z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0012 24z" />
                    <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 010-4.56V6.63H1.28a12 12 0 000 10.74z" />
                    <path fill="#EA4335" d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 001.28 6.63l3.99 3.09C6.22 6.87 8.87 4.76 12 4.76z" />
                  </svg>
                  <span className="label text-muted">Reviewed on Google</span>
                </span>

                <blockquote className="mt-6 font-display text-[1.35rem] leading-[1.3] tracking-[-0.015em] text-fg">
                  Read what our students and clients actually wrote — on a
                  platform where we can&rsquo;t edit a word of it.
                </blockquote>

                <ul className="mt-7 space-y-3 border-t border-line pt-6">
                  {[
                    "Published by the reviewer, not by us",
                    "Every review shown in full, unedited",
                    "Open to anyone we have worked with",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[0.86rem] leading-snug text-muted">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-[0.15em] h-3.5 w-3.5 shrink-0 text-accent">
                        <path d="M2.5 8.4l3.2 3.2 7.8-7.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {line}
                    </li>
                  ))}
                </ul>

                <a
                  href={company.social.googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.outbound(company.social.googleReviews)}
                  className="label group mt-auto inline-flex items-center gap-2 pt-7 text-accent"
                >
                  <span className="draw">Open our Google listing</span>
                  <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>
    );
  }

  /* --------------------------------------------------- populated state -- */

  const current = items[index];

  return (
    <Section id="proof" tone="deep" edge className="overflow-hidden">
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -left-32 top-1/3 h-[26rem] w-[26rem] opacity-25"
      />
      <Container className="relative">
        <Chapter index="—" label="Trust" className="mb-6" />
        <MaskedLines
          as="h2"
          className="d-2 max-w-[16ch] text-fg-strong"
          lines={["Every journey starts with trust."]}
        />

        <div
          ref={regionRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
            touchStart.current = null;
          }}
          className="mt-10 rounded-[var(--radius-lg)] border border-line p-6 outline-none md:p-10"
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden className="block text-[3.5rem] leading-none text-accent opacity-40">
                &ldquo;
              </span>
              <blockquote className="mt-1 max-w-3xl text-[1.15rem] font-medium leading-relaxed tracking-[-0.015em] text-fg md:text-[1.5rem]">
                {current.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                {current.image ? (
                  <Image
                    src={current.image}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-[0.9rem] font-semibold text-accent"
                  >
                    {current.name.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold text-fg">
                    {current.name}
                  </span>
                  <span className="mt-0.5 block text-[0.82rem] text-muted">
                    {current.role}
                  </span>
                </span>
                <span className="label ml-auto shrink-0 rounded-full border border-line px-3 py-1 text-accent">
                  {PATHWAY_LABEL[current.pathway]}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
              <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
                {items.map((t, i) => (
                  <button
                    key={t.name}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial ${i + 1} of ${items.length}`}
                    onClick={() => go(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-400",
                      i === index ? "w-8 bg-moss-400" : "w-1.5 bg-current opacity-30 hover:opacity-60"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { dir: -1, label: "Previous testimonial", d: "M8 2L4 6l4 4" },
                  { dir: 1, label: "Next testimonial", d: "M4 2l4 4-4 4" },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => go(index + b.dir)}
                    aria-label={b.label}
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line transition-colors hover:border-moss-400 hover:text-accent"
                  >
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3">
                      <path d={b.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
