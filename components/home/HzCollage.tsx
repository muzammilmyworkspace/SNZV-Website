"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/utils";
import { Stamp } from "@/components/fx/Stamp";
import { Globe, Cap, Person } from "./Icons";

/**
 * The hero collage, in motion: each arch opens upward in turn, the three
 * photographs drift at different speeds as the page scrolls, the chips float
 * and the stamp turns. Reduced motion shows the finished collage, still.
 */
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
  const pop = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <div ref={ref} className="hz-collage">
      <motion.div className="hz-arch hz-arch-a" style={{ y: yA }} {...open(0.1)}>
        <Image src="/images/study-graduation.webp" alt="Graduates throwing their caps in the air" fill priority sizes="(min-width:1024px) 30vw, 52vw" />
      </motion.div>
      <motion.div className="hz-arch hz-arch-b" style={{ y: yB }} {...open(0.3)}>
        <Image src="/images/dest-vilnius-old.webp" alt="The old town of Vilnius, Lithuania" fill priority sizes="(min-width:1024px) 25vw, 44vw" />
      </motion.div>
      <motion.div className="hz-arch hz-arch-c" style={{ y: yC }} {...open(0.5)}>
        <Image src="/images/careers-airport.webp" alt="A traveller walking through an airport terminal" fill sizes="(min-width:1024px) 22vw, 38vw" />
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
    </div>
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
