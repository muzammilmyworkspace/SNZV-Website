"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { scholarships, scholarshipCaveat, scholarshipNotes, studyDestinations } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { Band, SectionHead } from "../page/SectionHead";
import { InlineCta } from "../InlineCta";

/**
 * FUNDING — the scholarships, on a board.
 *
 * Twelve schemes from data/study.ts as rows on a dark arrivals board, each
 * flipping in as it scrolls into view. They are real, named programmes; their
 * CURRENT values are set annually by each awarding body, which is why the
 * caveat sits directly under the board rather than in a footnote — and why
 * nothing here is phrased as something a student "will get".
 *
 * Beside the board, the four funding notes: the advice that actually decides
 * whether a student ends up funded.
 */

const flagFor = (country: string) => studyDestinations.find((d) => d.country === country)?.slug;

export function FundingBoard() {
  const reduce = useReduced();
  return (
    <Band id="scholarships" labelledBy="funding-title">
      <SectionHead
        id="funding-title"
        eyebrow="Scholarships & funding"
        title={
          <>
            Twelve ways to pay less. <span className="bp-outline">We find the ones you qualify for.</span>
          </>
        }
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="bp-night overflow-hidden rounded-[22px] border border-[var(--bp-line-strong)] bg-[#090E20] bg-[linear-gradient(180deg,#0B1124,#070B1A)]">
          <div className="flex items-center justify-between border-b border-[var(--bp-line)] bg-white/[0.03] px-5 py-3">
            <span className="bp-mono text-[var(--bp-strong)]">Funding · Arrivals</span>
            <span className="bp-mono text-[var(--color-runway)]">{scholarships.length} schemes</span>
          </div>
          <div className="hidden grid-cols-[150px_1fr_1fr_130px] gap-4 border-b border-[var(--bp-line)] px-5 py-2.5 md:grid">
            {["From", "Scheme", "Covers", "Level"].map((h) => (
              <span key={h} className="bp-mono text-[var(--bp-faint)]">
                {h}
              </span>
            ))}
          </div>
          <ul>
            {scholarships.map((s, i) => {
              const slug = flagFor(s.country);
              return (
                <motion.li
                  key={s.name}
                  className="grid grid-cols-1 gap-1 border-b border-[var(--bp-line)] px-5 py-3.5 last:border-b-0 md:grid-cols-[150px_1fr_1fr_130px] md:items-center md:gap-4"
                  initial={reduce ? false : { opacity: 0, rotateX: -70 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                  transition={{ delay: (i % 6) * 0.06, duration: 0.5 }}
                  style={{ transformOrigin: "50% 0%", transformPerspective: 600 }}
                >
                  <span className="flex items-center gap-2 text-[0.9rem] text-[var(--bp-muted)]">
                    {slug ? (
                      <span className="relative h-3.5 w-5 overflow-hidden rounded-[2px]">
                        <Image src={`/flags/${slug}.svg`} alt="" fill sizes="20px" className="object-cover" />
                      </span>
                    ) : (
                      <span className="grid h-3.5 w-5 place-items-center rounded-[2px] bg-[#1D3F79] text-[0.72rem] leading-none text-[#E8C872]">★</span>
                    )}
                    {s.country}
                  </span>
                  <span className="font-semibold text-[var(--bp-strong)]">{s.name}</span>
                  <span className="text-[0.92rem] text-[var(--color-runway)]">{s.value}</span>
                  <span className="bp-mono text-[var(--bp-muted)]">{s.level}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div>
          <ol className="space-y-5">
            {scholarshipNotes.map((n, i) => (
              <li key={n.title} className="border-l-2 border-[var(--color-runway)] pl-5">
                <p className="bp-mono text-[var(--color-aurora)]">Note {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold text-[var(--bp-strong)]">{n.title}</h3>
                <p className="bp-body mt-1.5 text-[0.95rem]">{n.body}</p>
              </li>
            ))}
          </ol>
          <InlineCta className="mt-8" lead="Want your funding list?" label="Get it in your consultation" href="/contact#journey" />
        </div>
      </div>
      <p className="mt-6 max-w-4xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{scholarshipCaveat}</p>
    </Band>
  );
}
