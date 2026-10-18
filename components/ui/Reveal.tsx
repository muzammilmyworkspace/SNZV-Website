"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "@/lib/utils";

/**
 * Scroll reveal. Uses whileInView (IntersectionObserver under the hood) so
 * nothing animates off-screen, and collapses to a plain fade when the user
 * has asked for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;

  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "320px 0px -5% 0px" }}
      transition={{ duration: reduced ? 0.2 : 0.66, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "320px 0px -5% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.6, ease: EASE },
    },
  };
  return (
    <M className={className} variants={variants}>
      {children}
    </M>
  );
}

/**
 * Word-by-word headline stagger. Splits on spaces and preserves them, so
 * copy stays selectable and screen readers get one continuous string.
 */
export function StaggerText({
  text,
  className,
  delay = 0,
  as: As = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <As className={className}>{text}</As>;

  return (
    <As className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { delayChildren: delay, staggerChildren: 0.055 } },
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.78, ease: EASE },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </As>
  );
}
