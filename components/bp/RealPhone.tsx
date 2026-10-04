"use client";

import { useEffect, useRef } from "react";

/**
 * A PHONE THAT READS AS REAL.
 *
 * The trick that makes a device mockup look like a photograph rather than a
 * drawing is density: on a real phone the type is tiny relative to the glass.
 * So the screen is authored at the actual iPhone logical size — 390 × 844
 * points, with iOS's own type sizes (17pt body, 34pt large title, 11pt
 * captions) — and the whole canvas is scaled down to whatever width the frame
 * has. The result is pixel-for-pixel what a scaled screenshot looks like.
 *
 * SCALING. A ResizeObserver writes the scale straight onto the canvas's
 * style, never into React state, so server and client render identical HTML
 * (the server's default scale is a reasonable guess for the hero size) and
 * resizing never re-renders the app inside.
 *
 * The frame is a titanium band with a lit edge, side buttons, a thin black
 * bezel, and a glass reflection on top of the screen.
 */

const W = 390;
const H = 844;

export function RealPhone({
  children,
  className,
}: {
  /** Authored at 390 × 844. Includes nothing of the frame — status bar and island are drawn here. */
  children: React.ReactNode;
  className?: string;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screen.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const fit = () => {
      cv.style.transform = `scale(${el.clientWidth / W})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={className}>
      <div className="relative" style={{ aspectRatio: "9 / 19.2" }}>
        {/* side buttons */}
        <span className="absolute -left-[1.4%] top-[16%] h-[3.6%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#6B6F78] to-[#2B2E34]" />
        <span className="absolute -left-[1.4%] top-[23%] h-[7%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#6B6F78] to-[#2B2E34]" />
        <span className="absolute -left-[1.4%] top-[31.5%] h-[7%] w-[1.6%] rounded-l-[2px] bg-gradient-to-r from-[#6B6F78] to-[#2B2E34]" />
        <span className="absolute -right-[1.4%] top-[25%] h-[10.5%] w-[1.6%] rounded-r-[2px] bg-gradient-to-l from-[#6B6F78] to-[#2B2E34]" />

        {/* titanium band */}
        <div
          className="absolute inset-0 rounded-[16.5%/7.8%] p-[1.3%] shadow-[0_60px_90px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)]"
          style={{
            background:
              "conic-gradient(from 200deg, #3A3D44, #8A8E97 10%, #34373D 22%, #1E2024 42%, #5E626A 56%, #2E3136 70%, #A3A7B0 85%, #3A3D44)",
          }}
        >
          {/* black bezel */}
          <div className="relative h-full rounded-[15.2%/7.2%] bg-black p-[2.2%]">
            {/* the glass */}
            <div ref={screen} className="relative h-full overflow-hidden rounded-[13.4%/6.2%] bg-black">
              <div
                ref={canvas}
                className="absolute left-0 top-0 origin-top-left"
                style={{ width: W, height: H, transform: "scale(0.4)" }}
              >
                {children}
              </div>
              {/* glass reflection */}
              <span className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(118deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_22%,transparent_38%)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** iOS status bar + dynamic island, at native size, for a 390-wide canvas. */
export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const c = tone === "dark" ? "#000" : "#fff";
  return (
    <div className="absolute inset-x-0 top-0 z-40 h-[54px]" style={{ color: c }}>
      <span
        className="absolute left-[48px] top-[18px] text-[17px] font-semibold"
        style={{ fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif", letterSpacing: "-0.02em" }}
      >
        9:41
      </span>
      {/* dynamic island */}
      <span className="absolute left-1/2 top-[11px] h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black">
        <span className="absolute right-[14px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-[#0B0D1A] ring-1 ring-[#1C2240]" />
      </span>
      <span className="absolute right-[34px] top-[22px] flex items-center gap-[6px]" aria-hidden>
        <svg viewBox="0 0 18 12" width="18" height="12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="12" fill="currentColor">
          <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.2 10.2 0 008 .5 10.2 10.2 0 00.8 3.4L2 4.7a8.5 8.5 0 016-2.4zm0 3.6c1.3 0 2.5.5 3.5 1.3l1.2-1.3A7 7 0 008 4.1a7 7 0 00-4.7 1.8l1.2 1.3A5.3 5.3 0 018 5.9zM8 9.5a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z" />
        </svg>
        <svg viewBox="0 0 27 13" width="27" height="13" fill="none" stroke="currentColor">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" opacity="0.4" />
          <rect x="2.5" y="2.5" width="19" height="8" rx="2" fill="currentColor" stroke="none" />
          <path d="M25.5 4.5v4" strokeLinecap="round" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** The home indicator bar, native size. */
export function HomeIndicator({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      className="absolute bottom-[8px] left-1/2 z-40 h-[5px] w-[134px] -translate-x-1/2 rounded-full"
      style={{ background: tone === "dark" ? "#000" : "#fff" }}
    />
  );
}
