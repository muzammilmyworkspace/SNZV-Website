"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * THE LIVING LINE FIELD — one fixed SVG behind the whole homepage.
 *
 * A faint graticule (the grid of a navigation chart) and a handful of great-
 * circle arcs: the flight paths the page is about. As the visitor scrolls, the
 * arcs draw themselves and the grid drifts a little, so the background moves
 * WITH the story rather than on a timer.
 *
 * Cheap on purpose: one SVG for the page (not one per section), and only
 * `pathLength` and a transform are bound to scroll — both composited, neither
 * causes layout. Under reduced motion every arc is simply drawn.
 */

const ARCS = [
  "M-40 820 C 300 380, 760 300, 1480 520",
  "M-60 300 C 420 120, 900 160, 1500 60",
  "M120 980 C 520 560, 980 640, 1520 900",
  "M-80 600 C 260 520, 520 760, 820 980",
  "M600 -40 C 820 220, 1120 260, 1500 300",
];

export function LineField() {
  const reduce = useReduced();
  const { scrollYProgress } = useScroll();

  const drift = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const a = useTransform(scrollYProgress, [0, 0.35], [0.15, 1]);
  const b = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
  const c = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
  const d = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  const lengths = [a, b, c, d, a];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Two soft pools of the logo's hues, fixed — they never animate. */}
      <div className="absolute -left-[20%] -top-[20%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(61,113,201,0.22),transparent)]" />
      <div className="absolute -bottom-[25%] -right-[15%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(114,196,60,0.12),transparent)]" />

      <motion.svg
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ y: reduce ? 0 : drift }}
      >
        <defs>
          <pattern id="bp-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0H0V80" fill="none" style={{ stroke: "var(--bp-grid)" }} strokeWidth="1" />
          </pattern>
          <linearGradient id="bp-arc" x1="0" x2="1">
            <stop offset="0" stopColor="#6FA6F7" stopOpacity="0" />
            <stop offset="0.5" stopColor="#6FA6F7" stopOpacity="0.5" />
            <stop offset="1" stopColor="#72C43C" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="-100" y="-100" width="1640" height="1300" fill="url(#bp-grid)" />
        {ARCS.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" style={{ stroke: "var(--bp-line)" }} strokeWidth="1" strokeDasharray="2 6" />
            <motion.path
              d={d}
              fill="none"
              stroke="url(#bp-arc)"
              strokeWidth="1.2"
              style={{ pathLength: reduce ? 1 : lengths[i] }}
            />
          </g>
        ))}
      </motion.svg>

      {/* Travelling waves — four long sine lines drifting sideways at
          different speeds and directions. Each path spans two widths of
          the viewBox and slides by exactly one, so the loop is seamless. */}
      <svg viewBox="0 0 1440 960" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bp-wave" x1="0" x2="1">
            <stop offset="0" stopColor="#6FA6F7" stopOpacity="0" />
            <stop offset="0.3" stopColor="#6FA6F7" stopOpacity="1" />
            <stop offset="0.7" stopColor="#72C43C" stopOpacity="1" />
            <stop offset="1" stopColor="#72C43C" stopOpacity="0" />
          </linearGradient>
        </defs>
        {WAVES.map((w, i) => (
          <g key={i} style={{ opacity: w.o }}>
            <path
              d={wave(w.y, w.a, w.l)}
              fill="none"
              stroke="url(#bp-wave)"
              strokeWidth={w.sw}
              className={reduce ? undefined : "bp-wave"}
              style={{ animationDuration: `${w.s}s`, animationDirection: w.rev ? "reverse" : "normal" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Four waves: baseline y, amplitude, wavelength, stroke, opacity, seconds per loop. */
const WAVES = [
  { y: 260, a: 26, l: 480, sw: 1.4, o: 0.26, s: 38, rev: false },
  { y: 420, a: 40, l: 720, sw: 1.2, o: 0.2, s: 52, rev: true },
  { y: 640, a: 22, l: 360, sw: 1.6, o: 0.22, s: 30, rev: false },
  { y: 820, a: 48, l: 960, sw: 1.2, o: 0.16, s: 64, rev: true },
];

/**
 * A smooth sine from x=0 to x=2880 (two viewBox widths), built from
 * quadratic curves. The wavelength divides 1440 exactly, so shifting by
 * -1440px lands on an identical shape and the loop has no seam.
 */
function wave(y: number, a: number, l: number) {
  let d = `M0 ${y}`;
  for (let x = 0, up = true; x < 2880; x += l / 2, up = !up) {
    d += ` Q ${x + l / 4} ${up ? y - a : y + a} ${x + l / 2} ${y}`;
  }
  return d;
}
