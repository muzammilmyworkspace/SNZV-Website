"use client";

import { motion } from "motion/react";
import { studyFields, type StudyField } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { Band, SectionHead } from "../page/SectionHead";
import { InlineCta } from "../InlineCta";

/**
 * PROGRAMME FAMILIES — seven subject "tickets".
 *
 * Each family from data/study.ts as a ticket with a line-drawn icon that
 * sketches itself on view, the example courses, and SnZ's one-line advice for
 * that subject. The advice is the point: it is the honest thing a consultant
 * says in the first call ("accreditation decides whether you can practise"),
 * and it is what makes a list of subjects worth reading.
 */

const ICONS: Record<StudyField["icon"], string[]> = {
  business: ["M4 20h16", "M6 20V9h4v11", "M14 20V5h4v15", "M3 9l6-5 4 3 7-5"],
  code: ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 4l-4 16"],
  engineering: ["M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1", "M12 8a4 4 0 100 8 4 4 0 000-8z"],
  health: ["M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z", "M9 11h6M12 8v6"],
  design: ["M4 20l4-1L19 8l-3-3L5 16z", "M14 6l3 3", "M15 20h5"],
  law: ["M12 3v18", "M5 21h14", "M4 7h16", "M4 7l-2 6h6zM20 7l-2 6h6z"],
  hospitality: ["M3 18h18", "M5 18a7 7 0 0114 0", "M12 9V7", "M10 7h4"],
};

export function Programmes() {
  const reduce = useReduced();
  return (
    <Band id="programmes" labelledBy="programmes-title">
      <SectionHead
        id="programmes-title"
        eyebrow="What you can study"
        title={
          <>
            Seven subject families. <span className="bp-outline">Honest advice on each.</span>
          </>
        }
        aside="English-taught bachelor's and master's programmes across all ten destinations. Under each subject: the one thing we tell every student before they pick it."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {studyFields.map((f, i) => (
          <motion.li
            key={f.name}
            className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="bp-pass-dark group relative flex h-full flex-col overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1.5">
              <div className="flex items-start justify-between">
                <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[f.icon].map((d, k) => (
                    <motion.path
                      key={k}
                      d={d}
                      className={k === 0 ? "text-[var(--color-runway)]" : "text-[var(--color-aurora)]"}
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.12, duration: 0.9 }}
                    />
                  ))}
                </svg>
                <span className="bp-mono text-[var(--bp-faint)]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-grotesk)] text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--bp-strong)]">
                {f.name}
              </h3>
              <p className="mt-1.5 text-[0.9rem] text-[var(--bp-muted)]">{f.examples}</p>
              <p className="mt-auto border-t border-dashed border-[var(--bp-line-strong)] pt-4 text-[0.95rem] leading-relaxed text-[var(--bp-fg)]">
                <span className="bp-mono mb-1 block text-[var(--color-runway)]">Our advice</span>
                {f.body}
              </p>
            </article>
          </motion.li>
        ))}
        <li className="flex items-center rounded-[18px] border border-dashed border-[var(--bp-line-strong)] p-6">
          <InlineCta lead="Don't see your subject?" label="Ask what's possible" href="/contact#journey" />
        </li>
      </ul>
    </Band>
  );
}
