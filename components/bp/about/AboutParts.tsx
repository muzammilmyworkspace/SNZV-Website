"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";
import { cn } from "@/lib/utils";

/* ================================================================ MISSION */

/**
 * The mission, lit word by word as it scrolls through the viewport — the
 * reader's scroll is what "reads" it. Each word's opacity is a slice of the
 * section's progress, so nothing re-renders while scrolling. Under reduced
 * motion every word is simply lit.
 */
export function MissionScroll({ text, by }: { text: string; by: string }) {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });
  const words = text.split(" ");
  return (
    <div ref={ref} className="relative">
      <p className="bp-display text-[clamp(2rem,5vw,4.4rem)] leading-[1.06]">
        {words.map((w, i) => (
          <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} reduce={reduce} />
        ))}
      </p>
      <p className="bp-mono mt-8 text-[var(--color-aurora)]">{by}</p>
    </div>
  );
}

function Word({ w, i, n, p, reduce }: { w: string; i: number; n: number; p: MotionValue<number>; reduce: boolean }) {
  const start = i / n;
  const opacity = useTransform(p, [start, start + 1 / n], [0.14, 1], { clamp: true });
  const mark = /ambition|borders|barrier/i.test(w);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={cn("inline-block pr-[0.25em]", mark && "bp-mark")}>
      {w}
    </motion.span>
  );
}

/* ================================================================ APPROACH */

/**
 * Six steps on one drawn route. The line fills as the section is scrolled
 * through and each node lights as the line reaches it. Horizontal on desktop,
 * vertical on a phone.
 */
export function ApproachPath({ steps }: { steps: readonly { step: string; name: string; body: string }[] }) {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="relative mt-12">
      {/* desktop line */}
      <div className="absolute left-0 right-0 top-[19px] hidden h-px bg-[var(--bp-line-strong)] lg:block" />
      <motion.div
        className="absolute left-0 right-0 top-[19px] hidden h-[2px] origin-left bg-gradient-to-r from-[var(--color-aurora)] to-[var(--color-runway)] lg:block"
        style={{ scaleX: reduce ? 1 : fill }}
      />
      {/* mobile line */}
      <div className="absolute bottom-0 left-[19px] top-0 w-px bg-[var(--bp-line-strong)] lg:hidden" />
      <motion.div
        className="absolute bottom-0 left-[19px] top-0 w-[2px] origin-top bg-gradient-to-b from-[var(--color-aurora)] to-[var(--color-runway)] lg:hidden"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
        {steps.map((s, i) => (
          <Node key={s.step} s={s} i={i} n={steps.length} p={fill} reduce={reduce} />
        ))}
      </ol>
    </div>
  );
}

function Node({
  s,
  i,
  n,
  p,
  reduce,
}: {
  s: { step: string; name: string; body: string };
  i: number;
  n: number;
  p: MotionValue<number>;
  reduce: boolean;
}) {
  const at = i / (n - 1 || 1);
  const lit = useTransform(p, [Math.max(0, at - 0.05), at], [0, 1], { clamp: true });
  const bg = useTransform(lit, (v) => (v > 0.5 ? "var(--color-runway)" : "var(--bp-bg)"));
  const fg = useTransform(lit, (v) => (v > 0.5 ? "var(--bp-on-accent)" : "var(--color-runway)"));
  return (
    <li className="flex gap-5 lg:block">
      <motion.span
        className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-runway)] font-mono text-[0.8rem]"
        style={reduce ? { background: "var(--color-runway)", color: "var(--bp-on-accent)" } : { background: bg, color: fg }}
      >
        {s.step}
      </motion.span>
      <div className="lg:mt-5">
        <h3 className="font-[family-name:var(--font-grotesk)] text-[1.25rem] font-semibold text-[var(--bp-strong)]">{s.name}</h3>
        <p className="bp-body mt-1.5 text-[0.95rem]">{s.body}</p>
      </div>
    </li>
  );
}

/* ================================================================ CORRIDOR */

/**
 * Where students come from → Vilnius → the EU, as three stations joined by
 * a route with travellers moving along it. Decorative motion; every label is
 * real text.
 */
export function CorridorFlow({ from, hub, to }: { from: { value: string; label: string; detail: string }; hub: { value: string; label: string; detail: string }; to: { value: string; label: string; detail: string } }) {
  const reduce = useReduced();
  const stations = [from, hub, to];
  return (
    <div className="bp-pass-dark relative mt-10 overflow-hidden p-6 sm:p-10">
      <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        {/* the route between stations */}
        <div aria-hidden className="absolute left-[16%] right-[16%] top-[30px] hidden h-px bg-[var(--bp-line-strong)] md:block">
          {!reduce &&
            [0, 1, 2, 3].map((k) => (
              <motion.span
                key={k}
                className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-[var(--color-runway)] shadow-[0_0_12px_var(--color-runway)]"
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: k, ease: "linear" }}
              />
            ))}
        </div>
        {stations.map((s, i) => (
          <div key={s.label} className="relative text-center">
            <span
              className={cn(
                "relative z-10 mx-auto grid h-[60px] w-[60px] place-items-center rounded-full border-2 font-[family-name:var(--font-grotesk)] text-[1.4rem] font-bold",
                i === 1 ? "border-[var(--color-runway)] bg-[var(--color-runway)] text-[var(--bp-on-accent)]" : "border-[var(--bp-line-strong)] bg-[var(--bp-bg)] text-[var(--bp-strong)]"
              )}
            >
              {s.value}
            </span>
            <p className="bp-mono mt-4 text-[var(--color-aurora)]">{s.label}</p>
            <p className="mx-auto mt-2 max-w-[16rem] text-[0.95rem] text-[var(--bp-muted)]">{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
