/**
 * Stand-in artwork for a destination that has no licensed photograph yet
 * (`image: ""` in data/study.ts): the brand navy with a line drawing of a
 * university hall and the name of the country's best-known university.
 * The owner asked for universities rather than flags (2026-10-27); a real
 * photograph of that university replaces this once one is added.
 */
export function FlagArt({ university, className }: { colours?: string[]; university?: string; className?: string }) {
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#22305F_0%,#111A3A_100%)] ${className ?? ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,rgb(108_191_59/0.25),transparent_70%)]" />
      <svg
        viewBox="0 0 200 140"
        className="absolute left-1/2 top-[30%] w-[72%] -translate-x-1/2 -translate-y-1/2 text-[#8FD65F] opacity-80 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* pediment, columns, steps: a generic university hall */}
        <path d="M20 52 L100 14 L180 52 Z" />
        <path d="M28 52 H172" />
        <path d="M40 60 V112 M64 60 V112 M88 60 V112 M112 60 V112 M136 60 V112 M160 60 V112" />
        <path d="M30 116 H170 M22 124 H178 M14 132 H186" />
        <circle cx="100" cy="38" r="6" />
      </svg>
      {university && (
        <span className="absolute inset-x-5 top-[54%] text-center font-display text-[1.05rem] font-bold leading-tight text-white/90">
          {university}
        </span>
      )}
    </div>
  );
}
