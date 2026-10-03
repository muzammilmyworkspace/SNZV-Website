"use client";

import Link from "next/link";
import { useRef, Fragment } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Shell, Chapter, MaskedLines, Reveal } from "@/components/ui/Editorial";
import { approach } from "@/data/pathways";

/**
 * CHAPTER 04 — THE METHOD.
 *
 * A roadmap that draws itself as you descend: one continuous line runs through
 * six waypoints, each lighting as it is passed. Not six cards — a route.
 */
export function Method() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 65%"],
  });
  const line = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section
      id="method"
      ref={ref}
      className="relative overflow-hidden tone-light py-16 md:py-20"
    >
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] opacity-35"
      />

      <Shell className="relative">
        <Chapter index="04" label="The method" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,26rem)] lg:items-end lg:justify-start lg:gap-14">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[14ch] text-fg"
            lines={["One Goal.", <Fragment key="Clearer">
              One <span className="d-em">Clearer</span> Path.
            </Fragment>]}
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Six steps, deliberately unglamorous. Most of the value is in doing
              them in the right order — and in stopping early when the answer
              is no.
            </p>
          </Reveal>
        </div>

        {/* The route */}
        <div className="relative mt-16 md:mt-20">
          {/* rail */}
          {/*
            VERTICAL RAIL, PHONES ONLY.

            This used to flip to `md:h-px md:w-full` — one horizontal line across
            the whole block — which was correct only while the steps were a
            single row of six. Now that the grid wraps, a single line connects
            row one and abandons row two, so the horizontal run is drawn per
            step instead (see the connector inside each item below).
          */}
          <div
            aria-hidden
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-raised md:hidden"
          >
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-moss-400 to-moss-600 md:origin-left md:bg-gradient-to-r"
              style={
                reduced
                  ? { transform: "scale(1)" }
                  : { scaleY: line, scaleX: line }
              }
            />
          </div>

          {/*
            SIX ACROSS ONLY WHEN THERE IS ROOM FOR SIX.

            This jumped straight to six columns at md, which is about 180px a
            step on a 1024px screen and roughly 25 characters a line in the
            body copy. The route reads as a sequence at three across just as
            well as at six, and the text stops being a column of fragments.
          */}
          <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            {approach.map((s, i) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "320px 0px -5% 0px" }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pl-10 md:pl-0 md:pt-10"
              >
                {/*
                  Connector — one segment per step. Runs `+1.5rem` so it crosses
                  the column gap and meets the next waypoint; on the last column
                  it simply runs out to the edge, which is what the old
                  full-width rail did anyway.
                */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-[11px] hidden h-px w-[calc(100%+1.5rem)] overflow-hidden bg-raised md:block"
                >
                  <motion.span
                    className="block h-full w-full origin-left bg-gradient-to-r from-moss-400 to-moss-600"
                    style={reduced ? { transform: "scale(1)" } : { scaleX: line }}
                  />
                </span>

                {/* waypoint */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0.5 flex h-[23px] w-[23px] items-center justify-center md:left-0 md:top-0"
                >
                  <span className="absolute h-[7px] w-[7px] rounded-full bg-moss-400" />
                  <span className="absolute h-[23px] w-[23px] rounded-full border border-moss-400/30" />
                </span>

                <span className="label num block text-accent">{s.step}</span>
                <h3 className="mt-2 font-display text-[1.35rem] leading-none tracking-[-0.018em] text-fg">
                  {s.name}
                </h3>
                <p className="mt-3.5 text-[0.85rem] leading-relaxed text-faint">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/*
          CTA form #2 — the closing rule.
          The section is a route drawn through six waypoints, so its call to
          action is the last stretch of that line rather than a button parked
          under it: a full-width band, question on the left, the step you take
          next on the right.
        */}
        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:gap-8">
            <p className="text-[0.95rem] text-muted">
              Six steps, one coordinator. Step one is a conversation.
            </p>
            <Link
              href="/contact#journey"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[0.95rem] font-medium text-accent"
            >
              <span className="link-draw">Start at step one</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
