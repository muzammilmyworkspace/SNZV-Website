"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import type { Stat } from "@/data/stats";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";

/**
 * THE DEPARTURE BOARD — the counters, as split-flap tiles.
 *
 * Every row is a figure from data/stats.ts that has already been filtered to
 * what can ship — see that file for where each number comes from (the student
 * and partnership figures are owner-confirmed, in writing, 2026-10-03).
 *
 * The flip runs once, when the board scrolls into view. Each tile cycles
 * through digits and lands on its own with a stagger — the mechanical
 * rattle of a real board. Under reduced motion the final values render
 * immediately.
 */

const STATUS = ["Landed", "Boarding", "On time", "On time", "Final call", "Boarding"];

export function DepartureBoard({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReduced();
  const go = inView || !!reduce;

  return (
    <section aria-labelledby="board-title" className="relative z-10 py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="bp-eyebrow">Departures</p>
            <Reveal mask>
              <h2 id="board-title" className="bp-display bp-h2 mt-5 max-w-3xl">
              The numbers, <span className="bp-outline">on the board.</span>
            </h2>
              </Reveal>
          </div>
          <p className="bp-body max-w-md">
            Real students, real offers, real departures, and a board that keeps filling up every intake.
          </p>
        </div>

        <div
          ref={ref}
          className="bp-night mt-8 overflow-hidden rounded-[22px] border border-[var(--bp-line-strong)] bg-[#090E20] bg-[linear-gradient(180deg,#0B1124,#070B1A)] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]"
        >
          {/* The board's title bar — the bit that makes it read as a real board. */}
          <div className="flex items-center justify-between gap-4 border-b border-[var(--bp-line)] bg-white/[0.03] px-5 py-3 md:px-8">
            <span className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-4 w-4 -rotate-45 text-[var(--color-runway)]" fill="currentColor" aria-hidden>
                <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
              </svg>
              <span className="bp-mono text-white">SnZ · Departures</span>
            </span>
            <BoardClock />
          </div>

          {/* Board header row */}
          <div className="hidden grid-cols-[110px_1fr_auto_150px] items-center gap-6 border-b border-[var(--bp-line)] px-8 py-2.5 md:grid">
            <span className="bp-mono text-[var(--bp-faint)]">Flight</span>
            <span className="bp-mono text-[var(--bp-faint)]">Counting</span>
            <span className="bp-mono text-right text-[var(--bp-faint)]">Figure</span>
            <span className="bp-mono text-right text-[var(--bp-faint)]">Status</span>
          </div>

          <ul>
            {stats.map((s, row) => (
              <li
                key={s.label}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-b border-[var(--bp-line)] px-5 py-4 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[110px_1fr_auto_150px] md:gap-6 md:px-8"
              >
                <span className="bp-mono col-span-2 text-[var(--color-aurora)] md:col-span-1">
                  SNZ {String(row + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-[family-name:var(--font-grotesk)] text-[1.2rem] font-semibold tracking-[-0.02em] sm:text-[1.45rem]">
                    {s.label}
                  </p>
                  <p className="mt-1 text-[0.95rem] text-[var(--bp-muted)]">{s.detail}</p>
                </div>
                <div className="flex justify-end text-[2.3rem] sm:text-[3rem]" aria-label={`${s.value}${s.suffix ?? ""}`} role="img">
                  <FlapNumber value={s.value} suffix={s.suffix} go={go} delay={row * 0.18} />
                </div>
                <span className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-runway)]" />
                  <span className="bp-mono text-[var(--color-runway)]">{STATUS[row % STATUS.length]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * The board's clock. Rendered only after mount — a time string differs
 * between the server's render and the visitor's browser, and would otherwise
 * be a hydration mismatch on every request.
 */
function BoardClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const t = window.setInterval(tick, 15_000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className="flex items-center gap-3">
      <span className="hidden items-center gap-2 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-runway)] motion-reduce:animate-none" />
        <span className="bp-mono text-[var(--color-runway)]">Now boarding</span>
      </span>
      <span className="bp-mono min-w-[3.2rem] text-right text-white" suppressHydrationWarning>
        {now ?? "--:--"}
      </span>
    </span>
  );
}

function FlapNumber({ value, suffix, go, delay }: { value: number; suffix?: string; go: boolean; delay: number }) {
  // At least two tiles, so "3" reads as a board figure ("03"), not a lone digit.
  const digits = String(value).padStart(2, "0").split("").map(Number);
  return (
    <span aria-hidden className="flex gap-[0.08em]">
      {digits.map((d, i) => (
        <FlapDigit key={i} target={d} go={go} delay={delay + i * 0.12} spins={8 + i * 4} />
      ))}
      {suffix && <span className="bp-flap bp-flap-accent">{suffix}</span>}
    </span>
  );
}

function FlapDigit({ target, go, delay, spins }: { target: number; go: boolean; delay: number; spins: number }) {
  const reduce = useReduced();
  const [n, setN] = useState(reduce ? target : 0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!go) return;
    if (reduce) {
      setN(target);
      return;
    }
    let count = 0;
    const total = spins + target;
    let iv: number | undefined;
    const start = window.setTimeout(() => {
      iv = window.setInterval(() => {
        count++;
        setN(count % 10);
        setStep((s) => s + 1);
        if (count >= total) {
          window.clearInterval(iv);
          setN(target);
        }
      }, 55);
    }, delay * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(iv);
    };
  }, [go, target, delay, spins, reduce]);

  return (
    <span className="bp-flap">
      <AnimatePresence initial={false}>
        <motion.span
          key={step}
          className="absolute inset-0 grid place-items-center"
          initial={{ rotateX: -80, opacity: 0.4 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          style={{ transformOrigin: "50% 50%" }}
        >
          {n}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
