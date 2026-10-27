"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { EASE } from "@/lib/utils";
import { Stamp } from "@/components/fx/Stamp";
import { Globe, Cap, Person } from "./Icons";

/**
 * The hero collage, in motion: each arch opens upward in turn, cycles
 * through its own photographs with a slow zoom, the three drift at different
 * speeds as the page scrolls, the whole collage leans toward the pointer, the
 * chips float and the stamp turns. Reduced motion shows the finished collage,
 * still, on its first photographs.
 */
type Frame = { src: string; alt: string };
const ARCH_A: Frame[] = [
  { src: "/images/study-graduation.webp", alt: "Graduates throwing their caps in the air" },
  { src: "/images/study-vienna.webp", alt: "The arcaded courtyard of the University of Vienna" },
];
const ARCH_B: Frame[] = [
  { src: "/images/dest-vilnius-old.webp", alt: "The old town of Vilnius, Lithuania" },
  { src: "/images/dest-prague.webp", alt: "The rooftops of Prague, Czech Republic" },
];
const ARCH_C: Frame[] = [
  { src: "/images/careers-airport.webp", alt: "A traveller walking through an airport terminal" },
  { src: "/images/plate-departure.webp", alt: "An aircraft wing above the clouds" },
];

/** One arch's photographs: a crossfade every few seconds, each with a slow zoom. */
function Cycle({ frames, every, offset, priority, sizes }: { frames: Frame[]; every: number; offset: number; priority?: boolean; sizes: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setI((n) => (n + 1) % frames.length);
      t = setInterval(() => setI((n) => (n + 1) % frames.length), every);
    }, every + offset);
    return () => {
      clearTimeout(start);
      clearInterval(t);
    };
  }, [reduced, frames.length, every, offset]);
  const f = frames[i];
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={f.src}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1.02 }}
        exit={{ opacity: 0 }}
        transition={{ opacity: { duration: 1.2 }, scale: { duration: every / 1000 + 1.5, ease: "linear" } }}
      >
        <Image src={f.src} alt={f.alt} fill priority={priority && i === 0} sizes={sizes} />
      </motion.div>
    </AnimatePresence>
  );
}
export function HzCollage({ euStates, studyCountries }: { euStates: number | string; studyCountries: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = (a: number) => (reduced ? 0 : a);
  const yA = useTransform(scrollYProgress, [0, 1], [r(40), r(-40)]);
  const yB = useTransform(scrollYProgress, [0, 1], [r(70), r(-90)]);
  const yC = useTransform(scrollYProgress, [0, 1], [r(20), r(-120)]);

  const open = (delay: number) => ({
    initial: { clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" },
    animate: { clipPath: "inset(0% 0% 0% 0%)" },
    transition: { duration: reduced ? 0 : 1.2, ease: EASE, delay },
  });
  // Lean toward the pointer, a few degrees at most, springing back on leave.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [r(-7), r(7)]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [r(6), r(-6)]), { stiffness: 120, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const b = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - b.left) / b.width - 0.5);
    py.set((e.clientY - b.top) / b.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const pop = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <motion.div
      ref={ref}
      className="hz-collage"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}
    >
      <motion.div className="hz-arch hz-arch-a" style={{ y: yA }} {...open(0.1)}>
        <Cycle frames={ARCH_A} every={5200} offset={0} priority sizes="(min-width:1024px) 30vw, 52vw" />
      </motion.div>
      <motion.div className="hz-arch hz-arch-b" style={{ y: yB }} {...open(0.3)}>
        <Cycle frames={ARCH_B} every={5200} offset={1700} priority sizes="(min-width:1024px) 25vw, 44vw" />
      </motion.div>
      <motion.div className="hz-arch hz-arch-c" style={{ y: yC }} {...open(0.5)}>
        <Cycle frames={ARCH_C} every={5200} offset={3400} sizes="(min-width:1024px) 22vw, 38vw" />
      </motion.div>

      <motion.div className="hz-chip hz-chip-1" {...pop(0.9)}>
        <span className="sk-float flex items-center gap-3">
          <span className="hz-chip-icon"><Globe /></span>
          <span><b>{euStates} EU states</b>from one Lithuanian base</span>
        </span>
      </motion.div>
      <motion.div className="hz-chip hz-chip-2" {...pop(1.05)}>
        <span className="sk-float sk-float-2 flex items-center gap-3">
          <span className="hz-chip-icon"><Cap /></span>
          <span><b>{studyCountries} study countries</b>across the European Union</span>
        </span>
      </motion.div>
      <motion.div className="hz-chip hz-chip-3" {...pop(1.2)}>
        <span className="sk-float sk-float-3 flex items-center gap-3">
          <span className="hz-chip-icon"><Person /></span>
          <span><b>1 advisor</b>from first call to arrival</span>
        </span>
      </motion.div>

      <motion.div
        className="hz-stamp"
        initial={{ opacity: 0, rotate: reduced ? 0 : -120, scale: reduced ? 1 : 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 1.3 }}
      >
        <Stamp />
      </motion.div>
    </motion.div>
  );
}

/** A number that counts up once when it scrolls into view. */
export function CountUp({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const reduced = useReducedMotion();
  const target = typeof value === "number" ? value : Number(value);
  const ref = useRef<HTMLSpanElement>(null);

  if (!Number.isFinite(target) || reduced) {
    return (
      <span>
        {value}
        {suffix}
      </span>
    );
  }
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0.2 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        const el = ref.current;
        if (!el) return;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          el.textContent = `${Math.round(target * (1 - Math.pow(1 - t, 3)))}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      {target}
      {suffix}
    </motion.span>
  );
}
