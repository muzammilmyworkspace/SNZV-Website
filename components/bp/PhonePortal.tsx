"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { studyJourney } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { StatusBar, HomeIndicator } from "./RealPhone";
import { cn } from "@/lib/utils";

/**
 * THE PORTAL, ON A PHONE: what a student sees in their pocket.
 *
 * Authored at native iPhone size (390 × 844 points) with iOS type sizes, and
 * scaled into the frame by <RealPhone>. That density is what makes it read as
 * a real screenshot. Layout follows iOS conventions: large title, inset
 * grouped list, tab bar, and a system notification banner.
 *
 * The five published stages (data/study.ts → studyJourney) tick off one by
 * one and the progress ring fills; when the last one completes a "Ready to
 * fly" banner drops in. Then it resets. No person's data appears.
 * Under reduced motion it holds on the finished state.
 */

const STEP_MS = 1100;
const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif";

export function PhonePortal({ active = true }: { active?: boolean }) {
  const reduce = useReduced();
  const total = studyJourney.length;
  const [done, setDone] = useState(reduce ? total : 1);

  useEffect(() => {
    if (reduce) {
      setDone(total);
      return;
    }
    if (!active) return;
    const t = window.setTimeout(
      () => setDone((d) => (d >= total + 2 ? 1 : d + 1)),
      done >= total ? STEP_MS * 2.4 : STEP_MS
    );
    return () => window.clearTimeout(t);
  }, [done, active, reduce, total]);

  const shown = Math.min(done, total);
  const pct = Math.round((shown / total) * 100);
  const R = 26;
  const C = 2 * Math.PI * R;
  const next = studyJourney[shown];

  return (
    <div className="relative h-full w-full bg-[#F2F2F7] text-black" style={{ fontFamily: SF }}>
      <StatusBar />

      {/* Navigation bar */}
      <div className="flex items-center justify-between px-5 pt-[62px]">
        <span className="flex items-center gap-2">
          <Image src="/brand/snz-mark.png" alt="" width={28} height={28} className="h-7 w-7 rounded-full bg-white ring-1 ring-black/5" />
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#3C3C43]">SnZ Portal</span>
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1D3F79] text-[15px] font-semibold text-white">A</span>
      </div>
      <h3 className="px-5 pt-3 text-[34px] font-bold leading-[41px] tracking-[-0.03em]">Your journey</h3>

      {/* Progress card */}
      <div className="mx-4 mt-4 flex items-center gap-4 rounded-[16px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <svg viewBox="0 0 64 64" width="64" height="64" className="shrink-0 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={R} fill="none" stroke="#E5E5EA" strokeWidth="7" />
          <motion.circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="#34C759"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - shown / total) }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="min-w-0">
          <p className="text-[28px] font-bold leading-none tracking-[-0.02em]">{pct}%</p>
          <p className="mt-1 text-[15px] text-[#3C3C43]">
            Stage {shown} of {total} complete
          </p>
        </div>
      </div>

      {/* Stages: inset grouped list */}
      <p className="px-8 pb-2 pt-6 text-[13px] font-medium uppercase tracking-[0.02em] text-[#6C6C70]">Stages</p>
      <ol className="mx-4 overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {studyJourney.map((s, i) => {
          const isDone = i < shown;
          const isNext = i === shown;
          return (
            <li key={s.step} className="group flex items-center gap-3 pl-4">
              <motion.span
                className={cn(
                  "grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border-2",
                  isDone ? "border-[#34C759] bg-[#34C759]" : isNext ? "border-[#007AFF]" : "border-[#C7C7CC]"
                )}
                animate={isDone ? { scale: [1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {isDone && (
                  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden>
                    <path d="M3 7.3l2.7 2.7L11 4.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </motion.span>
              <span className="min-w-0 flex-1 border-b border-[#E5E5EA] py-[10px] pr-4 group-last:border-b-0">
                <span className="block truncate text-[17px] tracking-[-0.02em]">{s.name}</span>
                <span className={cn("block text-[13px]", isDone ? "text-[#1A7431]" : isNext ? "text-[#0062CC]" : "text-[#6C6C70]")}>
                  {isDone ? "Done" : isNext ? "In progress" : "Up next"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {/* Next step */}
      {next && (
        <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-[16px] bg-[#0B1020] p-4 text-white">
          <span className="min-w-0">
            <span className="block text-[13px] text-white/70">Next step</span>
            <span className="block truncate text-[17px] font-semibold">{next.name}</span>
          </span>
          <span className="shrink-0 rounded-full bg-[#34C759] px-4 py-2 text-[15px] font-semibold text-black">Open</span>
        </div>
      )}

      {/* Tab bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-[#F9F9F9]/95 pb-[30px] pt-2 backdrop-blur" aria-hidden>
        <div className="flex justify-around">
          {[
            ["Home", "M3 10.5L12 4l9 6.5V20h-6v-5H9v5H3z"],
            ["Journey", "M4 6h16M4 12h16M4 18h10"],
            ["Documents", "M6 3h8l4 4v14H6zM14 3v4h4"],
            ["Messages", "M4 5h16v11H8l-4 4z"],
          ].map(([label, d], i) => (
            <span key={label} className={cn("flex w-20 flex-col items-center gap-[2px]", i === 1 ? "text-[#0062CC]" : "text-[#6C6C70]")}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                <path d={d} />
              </svg>
              <span className="text-[12px] font-medium">{label}</span>
            </span>
          ))}
        </div>
      </div>
      <HomeIndicator />

      {/* System notification banner */}
      <AnimatePresence>
        {done > total && (
          <motion.div
            className="absolute inset-x-[10px] top-[56px] z-30 flex items-center gap-3 rounded-[22px] bg-[#F5F5F7]/95 p-3 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Image src="/brand/snz-mark.png" alt="" width={38} height={38} className="h-[38px] w-[38px] shrink-0 rounded-[9px] bg-white" />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">SnZ Portal</span>
                <span className="text-[13px] text-[#6C6C70]">now</span>
              </span>
              <span className="block truncate text-[15px] text-[#1C1C1E]">Ready to fly ✈ Every stage is complete.</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
