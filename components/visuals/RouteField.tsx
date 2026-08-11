"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import geo from "@/data/map-geo.json";
import { destinations, corridors } from "@/data/destinations";
import { cn } from "@/lib/utils";

/**
 * ROUTE FIELD — the hero's corridor overlay.
 *
 * Unlike the dot-matrix atlas used on /destinations, this is a pure line
 * drawing: it has to sit over photography without competing with it. Real
 * coordinates, so the geometry is honest, but no landmass — just the
 * relationships. Every corridor terminates at Vilnius, which is the business.
 */

const { w: W, h: H, bounds: B } = geo;
const px = (lon: number) => ((lon - B.lonMin) / (B.lonMax - B.lonMin)) * W;
const py = (lat: number) => ((B.latMax - lat) / (B.latMax - B.latMin)) * H;

const HUB = destinations.find((d) => d.slug === "lithuania")!;

function arc(x1: number, y1: number, x2: number, y2: number, bow = 0.2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return `M ${x1} ${y1} Q ${mx + (-dy / len) * len * bow} ${
    my + (dx / len) * len * bow
  } ${x2} ${y2}`;
}

export function RouteField({
  className,
  showLabels = true,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  const reduced = useReducedMotion();
  const hub = useMemo(() => ({ x: px(HUB.lonLat[0]), y: py(HUB.lonLat[1]) }), []);

  const inbound = useMemo(
    () =>
      corridors.map((c) => {
        const x = px(c.lonLat[0]);
        const y = py(c.lonLat[1]);
        return { name: c.name, x, y, d: arc(x, y, hub.x, hub.y, 0.15) };
      }),
    [hub]
  );

  const outbound = useMemo(
    () =>
      destinations
        .filter((d) => d.slug !== "lithuania")
        .map((d) => {
          const x = px(d.lonLat[0]);
          const y = py(d.lonLat[1]);
          return { name: d.country, x, y, d: arc(hub.x, hub.y, x, y, 0.18) };
        }),
    [hub]
  );

  const draw = (delay: number, duration = 1.6) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("overflow-visible", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="rf-hub">
          <stop offset="0%" stopColor="#72C43C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#72C43C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rf-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#72C43C" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#72C43C" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rf-in" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A9C2EC" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#A9C2EC" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* inbound talent corridors */}
      {inbound.map((r, i) => (
        <g key={r.name}>
          <motion.path
            d={r.d}
            stroke="url(#rf-in)"
            strokeWidth={0.9}
            strokeDasharray="3 6"
            {...draw(0.5 + i * 0.07)}
          />
          <circle cx={r.x} cy={r.y} r={1.8} fill="#A9C2EC" fillOpacity={0.75} />
          {showLabels && (
            <motion.text
              x={r.x}
              y={r.y - 7}
              textAnchor="middle"
              className="label"
              fill="#A9C2EC"
              fillOpacity={0.55}
              style={{ fontSize: 8.5, letterSpacing: "0.14em" }}
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ delay: 1.3 + i * 0.05, duration: 0.6 }}
            >
              {r.name.toUpperCase()}
            </motion.text>
          )}
        </g>
      ))}

      {/* outbound placement routes */}
      {outbound.map((r, i) => (
        <g key={r.name}>
          <motion.path
            d={r.d}
            stroke="url(#rf-out)"
            strokeWidth={1.1}
            {...draw(1 + i * 0.08, 1.3)}
          />
          <circle cx={r.x} cy={r.y} r={2.4} fill="#FBFAF8" fillOpacity={0.9} />
          {!reduced && (
            <circle cx={r.x} cy={r.y} r={3} fill="#72C43C" className="beacon" style={{ animationDelay: `${i * 0.4}s` }} />
          )}
          {showLabels && (
            <motion.text
              x={r.x}
              y={r.y - 8}
              textAnchor="middle"
              className="label"
              fill="#FBFAF8"
              fillOpacity={0.72}
              style={{ fontSize: 9, letterSpacing: "0.14em" }}
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ delay: 1.6 + i * 0.06, duration: 0.6 }}
            >
              {r.name.toUpperCase()}
            </motion.text>
          )}
        </g>
      ))}

      {/* the hub */}
      <g>
        <circle cx={hub.x} cy={hub.y} r={54} fill="url(#rf-hub)" />
        {!reduced && <circle cx={hub.x} cy={hub.y} r={4} fill="#72C43C" className="beacon" />}
        <circle cx={hub.x} cy={hub.y} r={4.2} fill="#72C43C" />
        <circle cx={hub.x} cy={hub.y} r={4.2} stroke="#03060D" strokeWidth={1.2} />
        <motion.text
          x={hub.x}
          y={hub.y - 13}
          textAnchor="middle"
          fill="#FBFAF8"
          className="label"
          style={{ fontSize: 10.5, letterSpacing: "0.18em" }}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          VILNIUS
        </motion.text>
      </g>
    </svg>
  );
}
