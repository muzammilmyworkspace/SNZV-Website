"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Container } from "@/components/ui/Primitives";
import type { Stat } from "@/data/stats";

/**
 * THE NUMBERS.
 *
 * Replaces StatsBand on the homepage. That component is four small figures in
 * a bordered row with an eyebrow and a chip — a dashboard widget, and it read
 * like one. This is the same data set as a statement: the numerals are the
 * largest type on the page after the hero, each sits in its own column
 * between hairlines, and a rule draws under each one as it arrives.
 *
 * TABULAR FIGURES, which matters more here than it looks. Proportional digits
 * change width as they count, so every label under them slides left and right
 * the whole way up. `.num` holds the box and the row stays still.
 *
 * COUNTS ONCE, ON ENTRY. A counter that replays every time it scrolls back
 * into view is a gimmick by the third pass.
 *
 * REDUCED MOTION GETS THE FIGURE IMMEDIATELY. The number is the content; the
 * count is decoration.
 *
 * It renders only `verified` figures, and data/stats.ts filters them again
 * before export — see the note there on why both exist.
 */

function useCountUp(target: number, play: boolean, reduced: boolean, ms = 1500) {
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
      const t = Math.min(1, (now - start) / ms);
      // Ease-out cubic — fast first, settling into the value rather than
      // stopping dead on it.
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, play, ms, reduced]);

  return value;
}

function Figure({
  stat,
  play,
  index,
  reduced,
}: {
  stat: Stat;
  play: boolean;
  index: number;
  reduced: boolean;
}) {
  const value = useCountUp(stat.value, play, reduced);

  return (
    <div className="relative px-0 py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
      {/*
        The live value is hidden from assistive tech and the final one exposed,
        so a screen reader announces "27" rather than counting aloud.
      */}
      <span
        aria-hidden
        className="num block text-[clamp(3.2rem,7vw,5.2rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-fg-strong"
      >
        {value}
        {stat.suffix}
      </span>
      <span className="sr-only">
        {stat.value}
        {stat.suffix} {stat.label}
      </span>

      {/* The rule that draws under each figure as it arrives. Same hairline
          gesture as the routes, at the scale of a number. */}
      <motion.span
        aria-hidden
        className="mt-5 block h-px origin-left bg-[var(--accent)]"
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={play ? { scaleX: 1 } : undefined}
        transition={{
          duration: reduced ? 0 : 0.9,
          delay: reduced ? 0 : 0.15 + index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <span className="mt-4 block text-[0.95rem] font-semibold leading-tight tracking-[-0.01em] text-fg">
        {stat.label}
      </span>
      <span className="mt-1.5 block text-[0.82rem] leading-snug text-muted">
        {stat.detail}
      </span>
    </div>
  );
}

export function Numbers({ stats }: { stats: Stat[] }) {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  /* Second line of defence; data/stats.ts already filters before export. */
  const shown = stats.filter((s) => s.verified !== false);
  if (shown.length === 0) return null;

  return (
    <section className="tone-soft relative py-20 md:py-24">
      <Container>
        <p className="label mb-12 flex items-center gap-3 text-accent">
          <span aria-hidden className="inline-block h-px w-8 bg-current opacity-50" />
          Counted, not claimed
        </p>

        {/*
          Hairlines BETWEEN the columns, not around them. A bordered box is a
          widget; a ruled column is a page. `divide-x` only from `sm`, because
          at phone width these stack and a vertical rule between stacked items
          is a line going nowhere.
        */}
        <div
          ref={ref}
          className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {shown.map((s, i) => (
            <Figure
              key={s.label}
              stat={s}
              play={inView}
              index={i}
              reduced={reduced}
            />
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-[0.82rem] leading-relaxed text-faint">
          Every figure above is derived from this site&rsquo;s own content or is an
          objective fact about the European Union. None is a performance claim,
          and each one can be checked by scrolling.
        </p>
      </Container>
    </section>
  );
}
