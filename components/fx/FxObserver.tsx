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
          for (const el of proxied.get(e.target) ?? [e.target]) {
            el.classList.add("is-in");
            // An auto-tagged element hands its own transitions (hover lifts)
            // back once it has settled.
            if (el instanceof HTMLElement && el.dataset.fxAuto) {
              setTimeout(() => {
                delete el.dataset.fx;
                el.dataset.fxAuto = "done";
              }, 1600);
            }
          }
          proxied.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    /*
      Every section animates, not only the ones written with <Reveal>: cards
      and list items that nothing else animates are tagged here to rise in,
      staggered along their row. Skipped: anything already driven by motion
      (an inline opacity), the heroes, the journey, navigation and long-form
      article text.
    */
    const SKIP = ".hz-hero, .sk-hero, .bp, nav, header, footer, .prose, [data-fx-skip], .hz-route-flags, .hz-rail";
    const tag = () => {
      // Entrances: articles, list items and every card in a grid.
      const sel = ["main section article", "main section li", "main section .grid > *"]
        .map((q) => `${q}:not([data-fx]):not([data-fx-auto])`)
        .join(", ");
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        if (el.closest(SKIP) || el.closest('[style*="opacity"]') || el.parentElement?.closest("[data-fx], [data-fx-auto]")) return;
        const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        const big = el.tagName === "ARTICLE" || el.offsetHeight > 160;
        el.dataset.fx = big ? "tilt" : "rise";
        el.dataset.fxAuto = "1";
        el.style.setProperty("--fx-delay", `${(i % 6) * 0.07}s`);
      });

      // Hover spotlight: any card-sized box with no background image of its own.
      const cards = ["main section article", "main section .grid > *", ".hz-tile", ".hz-route", ".hz-path", ".hz-post", ".snz-card"]
        .map((q) => `${q}:not([data-card])`)
        .join(", ");
      document.querySelectorAll<HTMLElement>(cards).forEach((el) => {
        if (el.closest(".hz-hero, .sk-hero, .bp, nav, header, footer, .prose") || el.offsetHeight < 90) return;
        // Only boxes that look like cards: a border, a shadow or a fill. A
        // column of plain text in a two-column grid is not a card.
        const cs = getComputedStyle(el);
        const boxed =
          parseFloat(cs.borderTopWidth) > 0 ||
          cs.boxShadow !== "none" ||
          (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent");
        if (!boxed) {
          el.dataset.card = "none";
          return;
        }
        el.dataset.card = cs.backgroundImage === "none" ? "1" : "0";
      });
    };

    const watch = () => {
      tag();
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
    };

    watch();

    // The spotlight follows the pointer inside whichever card it is over.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>('[data-card="1"]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Client navigation and lazily rendered sections add new nodes later.
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
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
