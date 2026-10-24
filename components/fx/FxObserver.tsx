"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Site-wide scroll motion (app/skin.css, "scroll motion").
 *
 * Marks headings and `[data-fx]` elements `.is-in` the first time they come on
 * screen, which draws the underline under a `.d-em` word and settles the
 * reveal styles. `html.fx-ready` gates the hidden starting states, so a page
 * without script shows everything at once.
 */
export function FxObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("fx-ready");

    // Clipped or collapsed starting states have no visible area to intersect,
    // so those elements are watched through their parent.
    const proxied = new Map<Element, Element[]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const el of proxied.get(e.target) ?? [e.target]) el.classList.add("is-in");
          proxied.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const watch = () =>
      document
        .querySelectorAll<HTMLElement>("main h1:not(.is-in), main h2:not(.is-in), [data-fx]:not(.is-in)")
        .forEach((el) => {
          const fx = el.dataset.fx;
          const host = fx === "unveil" || fx === "grow" || fx === "sweep" ? el.parentElement : null;
          if (!host) return io.observe(el);
          const list = proxied.get(host) ?? [];
          if (!list.includes(el)) list.push(el);
          proxied.set(host, list);
          io.observe(host);
        });

    watch();
    // Client navigation and lazily rendered sections add new nodes later.
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/** A thin green bar at the top that fills as the page is read. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  if (reduced) return null;
  return <motion.div aria-hidden className="sk-progress" style={{ scaleX }} />;
}
