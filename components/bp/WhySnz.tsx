"use client";

import { motion } from "motion/react";
import { portalPoints } from "@/data/portal";
import { trustPoints } from "@/data/company";
import { scholarshipNotes } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";

/**
 * WHY STUDENTS CHOOSE SnZ — four statements, one per beat, not a card grid.
 *
 * Every body line is taken from copy that already exists in data/ (titles
 * are restated in sentence case to sit with the rest of the page), chosen for the
 * student reading it: a named advisor (portal), a straight answer
 * (company trust points), and two things about money that families get wrong
 * (scholarship notes). Nothing new is asserted here.
 *
 * Each statement carries a small line drawing that draws itself on view — the
 * same "lines with meaning" language as the background.
 */

const ROWS = [
  { title: "One advisor. Named. Start to finish.", body: portalPoints[3].body, art: "route" },
  { title: "We tell you when the answer is no.", body: trustPoints[2].body, art: "fork" },
  { title: "Low tuition can beat a scholarship.", body: scholarshipNotes[3].body, art: "scale" },
  { title: "Funding deadlines close before the intake.", body: scholarshipNotes[1].body, art: "clock" },
] as const;

const ART: Record<(typeof ROWS)[number]["art"], string[]> = {
  route: ["M8 52 C 30 52, 30 12, 56 12", "M8 52 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0", "M56 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0"],
  fork: ["M8 32 H30", "M30 32 C 40 32, 42 14, 56 14", "M30 32 C 40 32, 42 50, 56 50", "M50 8 L58 14 L50 20"],
  scale: ["M32 8 V56", "M14 18 H50", "M14 18 L6 36 H22 Z", "M50 18 L42 36 H58 Z", "M22 56 H42"],
  clock: ["M32 32 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", "M32 18 V32 L42 38"],
};

export function WhySnz() {
  const reduce = useReduced();
  return (
    <section aria-labelledby="why-title" className="relative z-10 py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="bp-eyebrow">Why students choose SnZ</p>
        <Reveal mask>
<h2 id="why-title" className="bp-display bp-h2 mt-5 max-w-4xl">
          Honest advice is the <span className="bp-mark">fastest</span> route.
        </h2>
</Reveal>

        <ol className="mt-8">
          {ROWS.map((r, i) => (
            <motion.li
              key={r.title}
              className="group grid items-start gap-6 border-t border-[var(--bp-line)] py-6 md:grid-cols-[80px_minmax(0,1.1fr)_minmax(0,1fr)_72px] md:gap-10 md:py-8"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="bp-mono text-[var(--color-aurora)]">0{i + 1}</span>
              <h3 className="bp-display text-[1.7rem] leading-[1.08] transition-colors duration-500 group-hover:text-[var(--color-runway)] sm:text-[2.3rem]">
                {r.title}
              </h3>
              <p className="bp-body">{r.body}</p>
              <svg viewBox="0 0 64 64" className="hidden h-16 w-16 md:block" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {ART[r.art].map((d, k) => (
                  <motion.path
                    key={k}
                    d={d}
                    className={k === 0 ? "text-[var(--color-runway)]" : "text-[var(--color-aurora)]"}
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + k * 0.15, duration: 1, ease: [0.65, 0, 0.35, 1] }}
                  />
                ))}
              </svg>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
