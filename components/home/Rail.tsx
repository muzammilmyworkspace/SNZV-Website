"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow, ArrowLeft } from "./Icons";

/**
 * A horizontal, snap-scrolling row with previous / next buttons.
 *
 * The browser's own scrollbar is hidden (it read as a grey system control on
 * a branded page); in its place a slim green bar shows how far along the row
 * you are, with the buttons and a "3 / 15" count beside it. The buttons dim at
 * either end.
 */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ start: 0, size: 1, atStart: true, atEnd: false, first: 1, total: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const max = el.scrollWidth - el.clientWidth;
      const size = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
      const start = el.scrollWidth ? el.scrollLeft / el.scrollWidth : 0;
      const kids = Array.from(el.children) as HTMLElement[];
      const step = kids[1] ? kids[1].offsetLeft - kids[0].offsetLeft : 1;
      setView({
        start,
        size: Math.min(1, size),
        atStart: el.scrollLeft <= 2,
        atEnd: el.scrollLeft >= max - 2,
        first: Math.min(kids.length, Math.round(el.scrollLeft / step) + 1),
        total: kids.length,
      });
    };
    read();
    el.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      el.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div>
      <div ref={ref} className="hz-rail" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="hz-rail-foot">
        <div className="hz-rail-btns">
          <button type="button" className="hz-rail-btn" onClick={() => move(-1)} aria-label="Previous" disabled={view.atStart}>
            <ArrowLeft />
          </button>
          <button type="button" className="hz-rail-btn" onClick={() => move(1)} aria-label="Next" disabled={view.atEnd}>
            <Arrow />
          </button>
        </div>
        <div aria-hidden className="hz-rail-track">
          <span style={{ left: `${view.start * 100}%`, width: `${view.size * 100}%` }} />
        </div>
        {view.total > 0 && (
          <span aria-hidden className="hz-rail-count">
            {String(view.first).padStart(2, "0")} <i>/ {String(view.total).padStart(2, "0")}</i>
          </span>
        )}
      </div>
    </div>
  );
}
