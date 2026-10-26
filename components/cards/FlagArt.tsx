/**
 * Stand-in artwork for a destination that has no licensed photograph yet
 * (`image: ""` in data/study.ts): the brand navy with the country's flag
 * colours running across it as soft diagonal bands. Decorative, so it is
 * hidden from assistive tech; the card's own heading names the country.
 */
export function FlagArt({ colours, className }: { colours: string[]; className?: string }) {
  const stops = colours
    .map((c, i) => `${c} ${(i / colours.length) * 100}% ${((i + 1) / colours.length) * 100}%`)
    .join(", ");
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#22305F_0%,#111A3A_100%)] ${className ?? ""}`}>
      <div
        className="absolute -right-[30%] top-[18%] h-[70%] w-[130%] -rotate-[24deg] opacity-80 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        style={{ background: `linear-gradient(180deg, ${stops})`, borderRadius: "999px 0 0 999px" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_0%,rgb(108_191_59/0.22),transparent_70%)]" />
    </div>
  );
}
