"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Shell, Chapter, MaskedLines, Reveal, Action } from "@/components/ui/Editorial";
import { analytics } from "@/lib/analytics";

/**
 * CHAPTER 03 — THE PAIN.
 *
 * The doubts people actually carry, set as overheard questions that drift
 * across the panel at different depths. Answering them with a single line
 * ("That's where SnZ Ventures comes in") is the turn in the narrative.
 */

const VOICES: { q: string; who: string; x: string; delay: number }[] = [
  { q: "Where do I even start?", who: "Student", x: "6%", delay: 0 },
  { q: "Which opportunity is actually right for me?", who: "Student", x: "38%", delay: 0.1 },
  { q: "Can I find funding?", who: "Student", x: "14%", delay: 0.2 },
  { q: "Where are the genuine opportunities?", who: "Professional", x: "44%", delay: 0.15 },
  { q: "Am I even eligible?", who: "Professional", x: "8%", delay: 0.25 },
  { q: "How do I position myself?", who: "Professional", x: "48%", delay: 0.3 },
  { q: "Which market?", who: "Founder", x: "18%", delay: 0.2 },
  { q: "How do I establish there?", who: "Founder", x: "40%", delay: 0.35 },
  { q: "Who can I actually trust to tell me?", who: "Founder", x: "10%", delay: 0.4 },
];

export function Pain() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section
      id="pain"
      ref={ref}
      className="grain relative overflow-hidden tone-deep py-16 md:py-20"
    >
      <div
        aria-hidden
        className="hatch mask-radial pointer-events-none absolute inset-0 opacity-[0.35]"
      />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute right-[-18%] top-1/3 h-[38rem] w-[38rem] opacity-40"
      />

      <Shell className="relative">
        <Chapter index="03" label="The reality" className="mb-10" />

        <MaskedLines
          as="h2"
          className="d-1 max-w-[16ch] text-fg"
          lines={[
            <>Going global is exciting.</>,
            <>
              The process <span className="d-em">isn&rsquo;t</span> always.
            </>,
          ]}
        />

        {/* Voices */}
        <motion.ul
          style={reduced ? undefined : { y: drift }}
          className="mt-14 space-y-1"
        >
          {VOICES.map((v, i) => (
            <motion.li
              key={v.q}
              initial={{ opacity: 0, x: reduced ? 0 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "320px 0px -5% 0px" }}
              transition={{
                duration: 0.85,
                delay: v.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex items-baseline gap-4 py-1.5"
              style={{ paddingLeft: `min(${v.x}, 42vw)` }}
            >
              <span className="label shrink-0 text-faint transition-colors group-hover:text-moss-400/80">
                {v.who}
              </span>
              <span className="font-display text-[1.35rem] leading-snug tracking-[-0.015em] text-muted transition-colors duration-500 group-hover:text-fg sm:text-[1.75rem]">
                &ldquo;{v.q}&rdquo;
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* The turn */}
        <Reveal delay={0.15} className="mt-16">
          <div className="rule flex flex-col gap-6 border-t pt-10 md:flex-row md:items-end md:justify-between">
            <p className="d-3 max-w-[20ch] text-fg">
              That&rsquo;s the part we do.
            </p>
            <div className="max-w-md">
              <p className="text-[0.95rem] leading-relaxed text-muted">
                Not the excitement — you already have that. The sequencing, the
                eligibility, the paperwork, and the honest answer about whether
                your plan holds up.
              </p>
              <div className="mt-6">
                <Action
                  href="#method"
                  variant="line"
                  onClick={() => analytics.ctaClick("See how we help", "pain")}
                >
                  See how we work
                </Action>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
