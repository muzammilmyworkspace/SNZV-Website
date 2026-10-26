"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { journeyScenes } from "@/data/journey";
import { SCENES } from "./Scenes";
import { Arrow } from "../Glyphs";
import { cn } from "@/lib/utils";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "../Reveal";

/**
 * THE JOURNEY — the homepage's centrepiece.
 *
 * A pinned stage inside a tall section. The visitor's scroll position is the
 * timeline: nothing autoplays, nothing advances on a timer, and scrolling back
 * plays it backwards. Seven scenes (data/journey.ts), each a node on one line
 * that fills down the rail as you go.
 *
 * MECHANICS
 *   • `useScroll({ target })` gives 0→1 across the section.
 *   • Each scene gets its own 0→1 slice via `useTransform`, and cross-fades in
 *     and out at the slice edges. Scenes bind those motion values straight to
 *     transforms, so nothing re-renders per frame.
 *   • The only React state is WHICH scene is current — it changes seven times
 *     over the whole section, and drives the rail and the copy.
 *
 * REDUCED MOTION: no pinning and no scrubbing. The seven scenes render as a
 * plain vertical list, each in its finished state, with its copy beside it.
 * Everything is reachable; nothing waits on scroll.
 */

const N = journeyScenes.length;

export function Journey() {
  const reduce = useReduced();
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative z-10">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <p className="bp-eyebrow">The journey · {N} steps</p>
        <Reveal mask>
          <h2 id="journey-title" className="bp-display bp-h2 mt-5 max-w-4xl">
          From your first message <span className="bp-outline">to take-off.</span>
        </h2>
          </Reveal>
        <p className="bp-lede mt-6">
          Scroll, and watch exactly what happens after you contact us: every step, in order, the way it happens for
          every student we take on.
        </p>
      </div>
      {reduce ? <StillJourney /> : <PinnedJourney />}
    </section>
  );
}

function PinnedJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((cur) => (cur === i ? cur : i));
  });

  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + run * ((i + 0.55) / N), behavior: "smooth" });
  };

  const scene = journeyScenes[active];

  return (
    <div ref={ref} className="relative" style={{ height: `${N * 85}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-6 px-4 pt-16 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,360px)] lg:gap-8 lg:px-10">
          {/* Rail — desktop */}
          <div className="hidden lg:block">
            {/* The step number, large and faint, above the rail. SVG text:
                decoration, not copy. */}
            <AnimatePresence mode="wait">
              <motion.svg
                key={active}
                aria-hidden
                viewBox="0 0 200 120"
                className="pointer-events-none mb-6 block w-[150px] text-[var(--bp-line-strong)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <text x="0" y="110" fill="currentColor" style={{ font: "700 130px var(--font-grotesk)", letterSpacing: "-0.06em" }}>
                  {String(active + 1).padStart(2, "0")}
                </text>
              </motion.svg>
            </AnimatePresence>
          <nav aria-label="Journey steps" className="relative">
            <div className="absolute bottom-3 left-[7px] top-3 w-px bg-[var(--bp-line-strong)]" />
            <motion.div
              className="absolute left-[7px] top-3 w-px origin-top bg-gradient-to-b from-[var(--color-aurora)] to-[var(--color-runway)]"
              style={{ scaleY: rail, height: "calc(100% - 1.5rem)" }}
            />
            <ol className="relative space-y-5">
              {journeyScenes.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={i === active ? "step" : undefined}
                    className="group flex items-center gap-4 text-left"
                  >
                    <span
                      className={cn(
                        "relative grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border transition-all duration-500",
                        i < active && "border-[var(--color-runway)] bg-[var(--color-runway)]",
                        i === active && "scale-125 border-[var(--color-runway)] bg-[var(--bp-bg)]",
                        i > active && "border-[var(--bp-line-strong)] bg-[var(--bp-bg)]"
                      )}
                    >
                      {i === active && <span className="h-[7px] w-[7px] rounded-full bg-[var(--color-runway)]" />}
                    </span>
                    <span
                      className={cn(
                        "text-[0.95rem] transition-colors duration-300",
                        i === active ? "font-semibold text-[var(--bp-strong)]" : "text-[var(--bp-faint)] group-hover:text-[var(--bp-muted)]"
                      )}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          </div>

          {/* Mobile progress — segmented bar */}
          <div className="lg:hidden" aria-hidden>
            <div className="flex gap-1.5">
              {journeyScenes.map((s, i) => (
                <span
                  key={s.key}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-500",
                    i <= active ? "bg-[var(--color-runway)]" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>

          {/* The stage */}
          {/*
            Sized by HEIGHT on desktop: the stage is as big as the viewport
            allows (72svh tall at 5:4), so the scene fills the middle column
            instead of sitting small in the middle of it.
          */}
          <ScaledStage className="mx-auto w-full max-lg:max-w-[min(100%,calc(46svh*1.25))] lg:w-[min(100%,calc(72svh*1.25))]">
            {SCENES.map((Scene, i) => (
              <SceneSlot key={i} i={i} progress={scrollYProgress}>
                {(p) => <Scene p={p} />}
              </SceneSlot>
            ))}
          </ScaledStage>

          {/* The copy */}
          <div className="relative min-h-[220px] lg:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="bp-mono text-[var(--color-aurora)]">
                  Step {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </p>
                <h3 className="bp-display bp-h3 mt-3">{scene.title}</h3>
                <p className="bp-body mt-4 max-lg:text-[0.95rem]">{scene.body}</p>
                <ul className="mt-6 hidden space-y-2.5 border-t border-[var(--bp-line)] pt-5 sm:block">
                  {scene.points.map((pt, k) => (
                    <motion.li
                      key={pt}
                      className="flex items-center gap-3 text-[0.98rem] text-[var(--bp-fg)]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + k * 0.08, duration: 0.4 }}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-runway)] text-[var(--bp-on-accent)]">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M2.5 6.2l2.3 2.3 4.7-4.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {pt}
                    </motion.li>
                  ))}
                </ul>
                {active < N - 1 && (
                  <p className="bp-mono mt-6 hidden text-[var(--bp-faint)] sm:block">
                    Next · <span className="text-[var(--bp-muted)]">{journeyScenes[active + 1].short}</span>
                  </p>
                )}
                {active === N - 1 && (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <p className="bp-display text-[1.6rem] text-[var(--color-runway)]">Your turn.</p>
                    <Link href="/contact#journey" className="bp-btn bp-btn-primary bp-btn-sm">
                      Book a Consultation <Arrow />
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {/* Every step's copy, for screen readers, in order — the visual
                version shows one at a time. */}
            <ol className="sr-only">
              {journeyScenes.map((s, i) => (
                <li key={s.key}>
                  Step {i + 1}: {s.title} {s.body}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * THE STAGE IS DRAWN AT ONE SIZE AND SCALED.
 *
 * Every scene is laid out on a fixed 560 × 448 canvas (5:4) and the canvas is
 * scaled to whatever width the stage has. That way a phone shows exactly the
 * desktop composition, only smaller, instead of rem-sized text and cards
 * reflowing and colliding inside a narrow box. The scale is written straight
 * to the canvas's style from a ResizeObserver, so it never re-renders React.
 */
const STAGE_W = 560;
const STAGE_H = 448;

function ScaledStage({ className, children }: { className?: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const b = box.current;
    const c = canvas.current;
    if (!b || !c) return;
    const fit = () => {
      c.style.transform = `scale(${b.clientWidth / STAGE_W})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={cn("relative", className)} style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      <div ref={canvas} className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: "scale(1)" }}>
        {children}
      </div>
    </div>
  );
}

/** One scene's slice of the section, with a cross-fade at each edge. */
function SceneSlot({
  i,
  progress,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  children: (p: MotionValue<number>) => React.ReactNode;
}) {
  const a = i / N;
  const b = (i + 1) / N;
  /*
    HAND-OVER, NOT OVERLAP. The outgoing scene fades out over the last sliver
    of its slice and the incoming one fades in over the first sliver of its
    own, so two scenes are never half-visible on top of each other.
  */
  const fade = 0.07 / N;
  // The scene plays across the first 85% of its slice and holds for the rest,
  // so the finished state is on screen long enough to be read.
  const p = useTransform(progress, [a + fade, a + (b - a) * 0.85], [0, 1], { clamp: true });
  const opacity = useTransform(
    progress,
    i === 0 ? [0, b - fade, b] : i === N - 1 ? [a, a + fade, 1] : [a, a + fade, b - fade, b],
    i === 0 ? [1, 1, 0] : i === N - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    i === 0 ? [b - fade, b] : [a, a + fade],
    i === 0 ? [0, -24] : [24, 0]
  );
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));
  return (
    <motion.div data-stack className="absolute inset-0" style={{ opacity, y, visibility }} aria-hidden>
      {children(p)}
    </motion.div>
  );
}

const DONE = motionValue(1);

function StillJourney() {
  return (
    <ol className="mx-auto mt-14 max-w-[1100px] space-y-16 px-4 pb-24 sm:px-6">
      {journeyScenes.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <li key={s.key} className="grid items-center gap-8 md:grid-cols-2">
            <ScaledStage className="mx-auto w-full max-w-[480px]">
              <div aria-hidden className="absolute inset-0">
                <Scene p={DONE} />
              </div>
            </ScaledStage>
            <div>
              <p className="bp-mono text-[var(--color-aurora)]">
                Step {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </p>
              <h3 className="bp-display bp-h3 mt-3">{s.title}</h3>
              <p className="bp-body mt-4">{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
