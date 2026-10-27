/**
 * FLIGHT ROUTES behind a section (app/skin.css, "sky").
 *
 * Curved routes across the sky: dashed ones that flow slowly, and a main
 * route that draws itself in and carries a small plane along it on a loop
 * (SVG <animateMotion>, so it scales with the drawing). City dots pulse on
 * the route. Several layouts (`variant`) so that consecutive sections do not
 * repeat the same flight; 0 is the hero's. Decorative and hidden from
 * assistive tech; reduced motion keeps the lines and drops the movement.
 *
 * The section it sits in must be `isolate` (a stacking context): the sky is
 * drawn at z-index -1, under the content and over the section's background.
 */
type Layout = { main: string; routes: string[]; cities: [number, number][]; dur: number };

const LAYOUTS: Layout[] = [
  {
    main: "M 660 800 C 760 640, 770 440, 940 390 S 1260 170, 1500 80",
    routes: [
      "M -60 420 C 300 360, 520 520, 860 470 S 1300 300, 1500 330",
      "M 120 760 C 360 600, 640 640, 900 560 S 1300 520, 1520 460",
      "M -40 180 C 320 120, 640 220, 980 150 S 1320 60, 1500 90",
    ],
    cities: [[940, 390], [1330, 140]],
    dur: 16,
  },
  {
    main: "M -60 140 C 260 60, 520 260, 820 200 S 1260 40, 1500 120",
    routes: [
      "M -40 560 C 300 640, 640 480, 960 560 S 1320 640, 1500 580",
      "M 200 -20 C 420 160, 760 120, 1100 260 S 1400 320, 1520 300",
    ],
    cities: [[820, 200], [1180, 100]],
    dur: 18,
  },
  {
    main: "M 1500 640 C 1200 700, 1020 480, 760 520 S 260 660, -60 560",
    routes: [
      "M -60 120 C 360 220, 700 40, 1040 140 S 1360 220, 1500 160",
      "M 300 760 C 520 560, 900 700, 1200 600 S 1440 560, 1520 520",
    ],
    cities: [[760, 520], [330, 630]],
    dur: 20,
  },
  {
    main: "M -60 700 C 240 640, 380 420, 640 400 S 1040 520, 1500 260",
    routes: [
      "M -60 260 C 260 200, 600 320, 900 240 S 1300 120, 1500 160",
      "M 700 -20 C 820 160, 1100 140, 1240 300 S 1420 460, 1520 440",
    ],
    cities: [[640, 400], [1180, 380]],
    dur: 17,
  },
];

const PLANE =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

export function SkyLines({
  className,
  plane = true,
  variant = 0,
}: {
  className?: string;
  plane?: boolean;
  variant?: number;
}) {
  const L = LAYOUTS[Math.abs(variant) % LAYOUTS.length];
  return (
    <div aria-hidden className={`sky ${className ?? ""}`}>
      <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky-main" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6CBF3B" stopOpacity="0" />
            <stop offset="0.35" stopColor="#6CBF3B" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8FD65F" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {L.routes.map((d, i) => (
          <path key={d} className={`sky-route sky-route-${"abc"[i]}`} d={d} />
        ))}

        <path className="sky-main" d={L.main} stroke="url(#sky-main)" />

        {L.cities.map(([cx, cy], i) => (
          <g key={`${cx}-${cy}`} className={`sky-city ${i ? "sky-city-2" : ""}`}>
            <circle cx={cx} cy={cy} r={i ? 4 : 5} />
            <circle className="sky-ping" cx={cx} cy={cy} r={i ? 4 : 5} />
          </g>
        ))}

        {plane && (
          <g className="sky-plane">
            {/* Material "flight" glyph, turned to face along the route. */}
            <path d={PLANE} transform="scale(1.4) rotate(90) translate(-12 -12)" />
            <animateMotion dur={`${L.dur}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear" path={L.main} />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * WAVES along the foot (or the top) of a section: three layered swells that
 * drift at different speeds. Each layer is two wave periods wide and slides
 * by one, so the loop has no seam.
 */
export function Waves({ className, top = false }: { className?: string; top?: boolean }) {
  const d = "M0 40 C 120 10, 240 10, 360 40 S 600 70, 720 40 S 960 10, 1080 40 S 1320 70, 1440 40 V 90 H 0 Z";
  return (
    <div aria-hidden className={`waves ${top ? "waves-top" : ""} ${className ?? ""}`}>
      {[1, 2, 3].map((n) => (
        <svg key={n} className={`wave wave-${n}`} viewBox="0 0 2880 90" preserveAspectRatio="none">
          <path d={d} />
          <path d={d} transform="translate(1440 0)" />
        </svg>
      ))}
    </div>
  );
}

/** Flight routes and waves together: the standard dressing for a section. */
export function SectionSky({ variant = 1, waves = true, plane = true }: { variant?: number; waves?: boolean; plane?: boolean }) {
  return (
    <>
      <SkyLines variant={variant} plane={plane} className="sky-section" />
      {waves && <Waves className="waves-section" />}
    </>
  );
}
