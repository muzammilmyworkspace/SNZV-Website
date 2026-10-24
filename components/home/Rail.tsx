"use client";

import { useRef, type ReactNode } from "react";
import { Arrow, ArrowLeft } from "./Icons";

/** A horizontal, snap-scrolling row with previous / next buttons. */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
      <div className="hz-rail-btns mt-2">
        <button type="button" className="hz-rail-btn" onClick={() => move(-1)} aria-label="Previous">
          <ArrowLeft />
        </button>
        <button type="button" className="hz-rail-btn" onClick={() => move(1)} aria-label="Next">
          <Arrow />
        </button>
      </div>
    </div>
  );
}
