"use client";

import { motion } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * Rise-and-fade on first view. Under reduced motion it renders the content
 * as-is — no fade either, so nothing is ever held at opacity 0 waiting.
 *
 * `mask` is the headline variant: the block is wiped up from behind a
 * horizontal edge instead of fading, so big type arrives like a board
 * turning over rather than like a slide appearing.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  mask = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  mask?: boolean;
}) {
  const reduce = useReduced();
  if (reduce) return <div className={className}>{children}</div>;
  if (mask)
    return (
      <motion.div
        className={className}
        initial={{ clipPath: "inset(0 0 100% 0)", y: 48 }}
        whileInView={{ clipPath: "inset(0 0 -10% 0)", y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    );
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
