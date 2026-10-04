"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { PlaneGlyph } from "@/components/bp/Glyphs";
import { useReduced } from "@/components/bp/useReduced";

/**
 * The last hairline on the site, and one small plane crossing it — once, when
 * it comes into view. It is the full stop on the journey the page has been
 * drawing since the hero.
 */
export function FooterPlane() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReduced();

  return (
    <div ref={ref} aria-hidden className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--bp-line)]" />
      <motion.div
        className="absolute inset-y-0 left-0 top-1/2 h-px origin-left bg-[var(--color-aurora)]"
        style={{ width: "100%" }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={{ scaleX: inView || reduce ? 1 : 0 }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 text-[var(--color-runway)]"
        initial={{ left: reduce ? "calc(100% - 24px)" : "0%" }}
        animate={{ left: inView || reduce ? "calc(100% - 24px)" : "0%" }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
      >
        <PlaneGlyph className="h-5 w-5" />
      </motion.div>
    </div>
  );
}
