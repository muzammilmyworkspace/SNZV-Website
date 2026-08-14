"use client";

import { useRef, Fragment } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
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
  const reduced = useReducedMotion();

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

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[14ch] text-fg"
            lines={["One goal.", <Fragment key="clearer">
              One <span className="d-em">clearer</span> path.
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
          <div
            aria-hidden
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-raised md:left-0 md:top-[11px] md:h-px md:w-full"
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

          <ol className="grid gap-8 md:grid-cols-6 md:gap-4">
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
                {/* waypoint */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0.5 flex h-[23px] w-[23px] items-center justify-center md:left-0 md:top-0"
                >
                  <span className="absolute h-[7px] w-[7px] rounded-full bg-moss-400" />
                  <span className="absolute h-[23px] w-[23px] rounded-full border border-moss-400/30" />
                </span>

                <span className="label num block text-accent/70">{s.step}</span>
                <h3 className="mt-2 font-display text-[1.35rem] leading-none tracking-[-0.018em] text-fg">
                  {s.name}
                </h3>
                <p className="mt-2.5 text-[0.85rem] leading-relaxed text-faint">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Shell>
    </section>
  );
}
