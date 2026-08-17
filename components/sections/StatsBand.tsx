"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { Stat } from "@/data/stats";
import { Container, Section } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

/**
 * STAT COUNTERS
 * ---------------------------------------------------------------------------
 * Numerals set large and plain — tabular figures, tight tracking, no
 * decoration. The number is the design; anything applied to it competes with
 * the thing it is supposed to make memorable.
 *
 * `font-variant-numeric: tabular-nums` (the `.num` class) matters more here
 * than it looks. Proportional digits change width as they count, so the label
 * beneath shifts left and right the whole way up. Tabular figures hold their
 * box and the row stays still.
 *
 * COUNTS ONCE, ON ENTRY. `useInView({ once: true })` — a counter that replays
 * every time it scrolls back into view reads as a gimmick by the third pass.
 *
 * REDUCED MOTION SHOWS THE FINAL VALUE IMMEDIATELY. The number is the content;
 * the animation is decoration. Someone who has asked for less movement still
 * gets the figure, in full, with no delay.
 */

function useCountUp(target: number, play: boolean, durationMs = 1400) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!play) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Ease-out cubic: fast at first, settling into the final value rather
      // than stopping dead on it.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, play, durationMs, reduced]);

  return value;
}

function StatItem({ stat, play }: { stat: Stat; play: boolean }) {
  const value = useCountUp(stat.value, play);

  return (
    <div>
      {/*
        The live value is aria-hidden and the final one is exposed to assistive
        tech, so a screen reader announces "27" rather than counting aloud.
      */}
      <span
        aria-hidden
        className="num block text-[2.6rem] leading-none tracking-[-0.03em] text-fg sm:text-[3rem]"
      >
        {value}
        {stat.suffix}
      </span>
      <span className="sr-only">
        {stat.value}
        {stat.suffix} {stat.label}
      </span>

      <span className="label mt-3 block text-accent">{stat.label}</span>
      <span className="mt-2 block text-[0.8rem] leading-snug text-muted">
        {stat.detail}
      </span>
    </div>
  );
}

export function StatsBand({
  stats,
  tone = "soft",
  eyebrow,
  cta,
  className,
}: {
  stats: Stat[];
  tone?: "deep" | "soft" | "paper" | "white";
  eyebrow?: string;
  /** Optional chip beside the eyebrow. Each page points it somewhere useful. */
  cta?: { href: string; label: string };
  className?: string;
}) {
  const ref = useRef<HTMLDListElement>(null);
  // Start the count slightly before the row is fully on screen, so it is
  // already moving by the time the reader's eye arrives.
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <Section tone={tone} size="tight" className={cn("overflow-hidden", className)}>
      <Container>
        {(eyebrow || cta) && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            {eyebrow && (
              <p className="label flex items-center gap-3 text-accent">
                <span aria-hidden className="inline-block h-px w-8 bg-current opacity-50" />
                {eyebrow}
              </p>
            )}
            {/*
              CTA form #4 — a bordered chip on the eyebrow line.
              Numbers invite a "compared to what?", so this sits beside the
              band's own label rather than below the figures, where it would
              read as a conclusion drawn from them. Deliberately not a filled
              button: nothing here should look like the section is selling.
            */}
            {cta && (
              <Link
                href={cta.href}
                className="group inline-flex min-h-11 items-center gap-2 border border-line px-4 text-[0.85rem] font-medium text-fg transition-colors hover:border-moss-400/70 hover:text-accent"
              >
                {cta.label}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>
        )}
        <dl
          ref={ref}
          className="grid grid-cols-2 gap-x-6 gap-y-9 border-t border-line pt-9 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <StatItem stat={s} play={inView} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
