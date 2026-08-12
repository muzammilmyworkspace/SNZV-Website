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
import { testimonials, type Testimonial } from "@/data/company";
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
 *   • empty     → a clearly-marked placeholder that explains the absence
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
      <Section tone="deep" edge className="overflow-hidden">
        <div
          aria-hidden
          className="bloom-moss pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-25"
        />
        <Container className="relative">
          <Chapter index="—" label="Trust" className="mb-6" />
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <MaskedLines
                as="h2"
                className="d-2 max-w-[16ch] text-fg-strong"
                lines={["Every journey starts with trust."]}
              />
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">
                  We don&rsquo;t publish testimonials we can&rsquo;t verify, and
                  we won&rsquo;t write them ourselves. When clients are ready to
                  put their names to their outcomes, their words will appear
                  here — and you&rsquo;ll be able to check every one.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Action
                    href="/contact#journey"
                    magnetic
                    onClick={() => analytics.ctaClick("Start a conversation", "testimonials")}
                  >
                    Start a conversation
                  </Action>
                  <Action href="/insights/questions-to-ask-any-advisor" variant="line">
                    Questions to ask us first
                  </Action>
                </div>
              </Reveal>
            </div>

            {/* Placeholder frame — final layout, no invented content. */}
            <Reveal delay={0.1}>
              <figure className="relative rounded-[var(--radius-lg)] border border-dashed border-line p-8">
                <span aria-hidden className="block text-[4rem] leading-none text-accent opacity-30">
                  &ldquo;
                </span>
                <div className="mt-2 space-y-2.5" aria-hidden>
                  <span className="block h-3 w-full rounded bg-raised" />
                  <span className="block h-3 w-[92%] rounded bg-raised" />
                  <span className="block h-3 w-[76%] rounded bg-raised" />
                </div>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden className="h-10 w-10 shrink-0 rounded-full bg-raised" />
                  <span>
                    <span className="label block text-accent">
                      [Real testimonial required]
                    </span>
                    <span className="mt-1 block text-[0.8rem] text-faint">
                      Name, role and written consent to publish.
                    </span>
                  </span>
                </figcaption>
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
    <Section tone="deep" edge className="overflow-hidden">
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
