"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * THE MERIDIAN — the site's signature device.
 *
 * A hairline rail fixed to the left edge that fills as you descend the page,
 * annotated with the current chapter. It is the through-line that makes the
 * homepage read as one continuous journey rather than stacked sections, and it
 * carries the atlas language into the chrome itself.
 *
 * Purely decorative: hidden from assistive tech, hidden on small screens where
 * the gutter doesn't exist, and static under reduced-motion.
 */
export function Meridian({
  chapters,
}: {
  chapters: { id: string; index: string; label: string }[];
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [active, setActive] = useState(0);

  useEffect(() => {
    const targets = chapters
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry nearest the top of the viewport that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const idx = targets.indexOf(visible[0].target as HTMLElement);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [chapters]);

  const current = chapters[active];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-12 select-none xl:block"
    >
      {/* rail */}
      <div className="absolute left-6 top-[18vh] h-[64vh] w-px bg-raised">
        <motion.div
          className="meridian-line absolute left-0 top-0 w-px origin-top"
          style={{
            height: "100%",
            scaleY: reduced ? 1 : progress,
          }}
        />
      </div>

      {/* chapter index, rotated into the gutter */}
      <div className="absolute left-6 top-[18vh] -translate-x-1/2 -translate-y-8">
        <span className="label num block text-accent">{current?.index}</span>
      </div>

      <div className="absolute bottom-[18vh] left-6 -translate-x-1/2">
        <motion.span
          key={current?.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="label block origin-bottom-left translate-y-full rotate-90 whitespace-nowrap text-faint"
        >
          {current?.label}
        </motion.span>
      </div>
    </div>
  );
}
