/**
 * DEVICE FRAMES — a laptop and a phone, drawn in CSS.
 *
 * Built rather than photographed so they are sharp at every size, weigh
 * nothing, and can hold live content (the portal reel, a WhatsApp chat). Both
 * are sized entirely in percentages of their own width, so a parent sets one
 * width and the whole device scales with it — bezel, notch and base included.
 *
 * The look is deliberately "premium hardware on a night desk": a near-black
 * bezel inside a thin aluminium edge, a silver base with the finger notch, a
 * soft glass reflection across the screen, and a contact shadow underneath.
 */

export function Laptop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {/* Lid: aluminium edge → black bezel → screen */}
      <div className="relative rounded-t-[4.5%_6.5%] bg-gradient-to-b from-[#B9BFCB] to-[#7E8594] p-[0.45%] shadow-[0_50px_80px_-30px_rgba(0,0,0,0.95)]">
        <div className="relative rounded-t-[4.2%_6.2%] bg-[#0A0C11] px-[2.2%] pb-[3.2%] pt-[2.6%]">
          {/* camera */}
          <span className="absolute left-1/2 top-[0.9%] h-[1.1%] min-h-[4px] w-[1.1%] min-w-[4px] -translate-x-1/2 rounded-full bg-[#1E2533] ring-1 ring-[#2B3446]" />
          <div className="relative overflow-hidden rounded-[0.6%] bg-[#EEF2F8]">
            {children}
            {/* glass reflection */}
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_28%,transparent_42%)]" />
          </div>
        </div>
      </div>
      {/* Base */}
      <div className="relative -mx-[7%] h-0 pb-[3.4%]">
        <div className="absolute inset-0 rounded-b-[40%_100%] bg-gradient-to-b from-[#D5DAE3] via-[#A3AAB7] to-[#5E6573]" />
        <div className="absolute left-1/2 top-0 h-[42%] w-[14%] -translate-x-1/2 rounded-b-[40%] bg-gradient-to-b from-[#7C8392] to-[#9AA1AE]" />
        <div className="absolute inset-x-[2%] top-0 h-px bg-white/60" />
      </div>
      {/* Contact shadow */}
      <div className="mx-auto mt-[1%] h-[10px] w-[90%] rounded-[50%] bg-black/60 blur-[10px]" />
    </div>
  );
}

export function Phone({
  children,
  className,
  statusTone = "dark",
  statusBg,
}: {
  children: React.ReactNode;
  className?: string;
  /** Colour of the status-bar glyphs: dark on a light app, light on a dark one. */
  statusTone?: "dark" | "light";
  /** The app's top colour, so the status bar sits on it rather than on the
   *  screen's white — which is also what keeps "9:41" legible to a contrast
   *  check that cannot see the app header painted underneath it. */
  statusBg?: string;
}) {
  const ink = statusTone === "dark" ? "#0B1020" : "#FFFFFF";
  return (
    <div className={className}>
      {/*
        A current-generation handset: a titanium band with a lit edge, side
        buttons, a thin black bezel and the dynamic island. The band is a
        conic gradient so the highlight runs round the corners the way it does
        on brushed metal, rather than sitting flat on one side.
      */}
      <div className="relative aspect-[9/19.2]">
        {/* side buttons */}
        <span className="absolute -left-[1.6%] top-[17%] h-[4%] w-[1.8%] rounded-l-sm bg-gradient-to-r from-[#5A5E66] to-[#2B2E34]" />
        <span className="absolute -left-[1.6%] top-[24%] h-[7.5%] w-[1.8%] rounded-l-sm bg-gradient-to-r from-[#5A5E66] to-[#2B2E34]" />
        <span className="absolute -left-[1.6%] top-[33%] h-[7.5%] w-[1.8%] rounded-l-sm bg-gradient-to-r from-[#5A5E66] to-[#2B2E34]" />
        <span className="absolute -right-[1.6%] top-[26%] h-[11%] w-[1.8%] rounded-r-sm bg-gradient-to-l from-[#5A5E66] to-[#2B2E34]" />

        <div
          className="relative h-full rounded-[17%/8%] p-[1.4%] shadow-[0_50px_80px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{
            background:
              "conic-gradient(from 210deg, #2A2D33, #6B6F78 12%, #2A2D33 25%, #1C1E22 45%, #575B63 58%, #2A2D33 72%, #8A8E97 86%, #2A2D33)",
          }}
        >
          <div className="relative h-full rounded-[15.6%/7.3%] bg-black p-[2.4%]">
            <div className="relative h-full overflow-hidden rounded-[13.5%/6.3%] bg-white">
              {/* Status bar */}
              <div className="absolute inset-x-0 top-0 z-20 flex h-[6.2%] items-center justify-between px-[9%] pt-[1.2%]" style={{ color: ink, background: statusBg }}>
                <span className="font-[family-name:var(--font-grotesk)] text-[0.72rem] font-semibold tracking-tight">9:41</span>
                <span className="flex items-center gap-[3px]" aria-hidden>
                  <svg viewBox="0 0 18 12" className="h-[7px] w-[11px]" fill="currentColor">
                    <rect x="0" y="8" width="3" height="4" rx="1" />
                    <rect x="5" y="5" width="3" height="7" rx="1" />
                    <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
                    <rect x="15" y="0" width="3" height="12" rx="1" />
                  </svg>
                  <svg viewBox="0 0 16 12" className="h-[7px] w-[10px]" fill="currentColor">
                    <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.2 10.2 0 008 .4 10.2 10.2 0 00.8 3.3L2 4.6a8.5 8.5 0 016-2.4zm0 3.6c1.3 0 2.5.5 3.5 1.3l1.2-1.3A7 7 0 008 4a7 7 0 00-4.7 1.8l1.2 1.3A5.3 5.3 0 018 5.8zM8 9.4a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z" />
                  </svg>
                  <svg viewBox="0 0 26 12" className="h-[7px] w-[15px]" fill="none" stroke="currentColor">
                    <rect x="0.5" y="0.5" width="22" height="11" rx="3" opacity="0.5" />
                    <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill="currentColor" stroke="none" />
                    <path d="M24.5 4v4" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </span>
              </div>
              {/* Dynamic island */}
              <span className="absolute left-1/2 top-[1.5%] z-30 h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
              {children}
              {/* Home indicator */}
              <span className="absolute bottom-[1%] left-1/2 z-20 h-[0.55%] min-h-[3px] w-[36%] -translate-x-1/2 rounded-full bg-black/80" />
              {/* Glass */}
              <span className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(120deg,rgba(255,255,255,0.14)_0%,transparent_30%)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
