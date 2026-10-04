"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * A soft pool of blue light that follows the pointer across the night sky.
 *
 * Desktop, mouse only — touch has no hover, and on a phone it would just sit
 * wherever the last tap was. One fixed element whose gradient position is a
 * motion value, so moving the mouse never re-renders anything. Off under
 * reduced motion.
 */
export function Spotlight() {
  const reduce = useReduced();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });
  const bg = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(111,166,247,0.09), transparent 70%)`;

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (reduce) return null;
  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[1]" style={{ background: bg }} />;
}
