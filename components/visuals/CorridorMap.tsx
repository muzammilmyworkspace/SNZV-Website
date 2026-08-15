"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import geo from "@/data/map-geo.json";
import { destinations, corridors } from "@/data/destinations";
import { cn } from "@/lib/utils";

/**
 * The corridor map — SnZ's actual geography, drawn to scale.
 *
 * The land is a static SVG dot field served as an <img> (≈9,000 dots that
 * would otherwise be 9,000 DOM nodes). Only the routes and city nodes are
 * inline SVG, so the animated layer stays around 30 elements.
 *
 * Coordinates are projected with the same linear transform used to sample the
 * dot field in scripts/build-map.mjs, so nodes land exactly on their country.
 */

const { w: W, h: H, bounds: B } = geo;

const projX = (lon: number) =>
  ((lon - B.lonMin) / (B.lonMax - B.lonMin)) * W;
const projY = (lat: number) =>
  ((B.latMax - lat) / (B.latMax - B.latMin)) * H;

/** Vilnius — every corridor terminates here, which is the actual business. */
const HUB = destinations.find((d) => d.slug === "lithuania")!;

/**
 * Quadratic arc between two points, bowed perpendicular to the line so routes
 * read as flight paths rather than straight rules.
 */
function arc(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bow = 0.18
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // Perpendicular offset, always bowing "upward" for visual consistency.
  const nx = -dy / len;
  const ny = dx / len;
  const k = len * bow;
  return `M ${x1} ${y1} Q ${mx + nx * k} ${my + ny * k} ${x2} ${y2}`;
}

export function CorridorMap({
  className,
  tone = "dark",
  showLabels = true,
  animate = true,
  variant = "corridors",
  activeSlug,
}: {
  className?: string;
  tone?: "dark" | "light";
  showLabels?: boolean;
  animate?: boolean;
  /**
   * "corridors" draws the arced flight paths between markets. "pins" drops
   * them and shows located, pulsing markers instead.
   *
   * The arc animation is the site's signature move, and a signature repeated
   * in every geography section stops being one. It now belongs to the home
   * hero; everywhere else takes `pins`, which reads as located rather than as
   * another copy of the same drawing.
   */
  variant?: "corridors" | "pins";
  /** In `pins`, the market to emphasise — lets a selection drive the map. */
  activeSlug?: string;
}) {
  const reduced = useReducedMotion();
  const play = animate && !reduced;

  const hub = useMemo(
    () => ({ x: projX(HUB.lonLat[0]), y: projY(HUB.lonLat[1]) }),
    []
  );

  // Inbound talent corridors → Vilnius
  const inbound = useMemo(
    () =>
      corridors.map((c) => ({
        name: c.name,
        x: projX(c.lonLat[0]),
        y: projY(c.lonLat[1]),
        d: arc(projX(c.lonLat[0]), projY(c.lonLat[1]), hub.x, hub.y, 0.14),
      })),
    [hub]
  );

  // Vilnius → European destination markets
  const outbound = useMemo(
    () =>
      destinations
        .filter((d) => d.slug !== "lithuania")
        .map((d) => ({
          name: d.country,
          slug: d.slug,
          x: projX(d.lonLat[0]),
          y: projY(d.lonLat[1]),
          d: arc(hub.x, hub.y, projX(d.lonLat[0]), projY(d.lonLat[1]), 0.16),
        })),
    [hub]
  );

  const isDark = tone === "dark";
  const routeIn = isDark ? "rgba(255,255,255,0.30)" : "rgba(30,45,86,0.28)";
  const routeOut = isDark ? "#7ABF40" : "#5FA32D";
  const nodeEu = isDark ? "#FFFFFF" : "#1E2D56";
  const label = isDark ? "rgba(255,255,255,0.62)" : "rgba(30,45,86,0.62)";

  return (
    <div className={cn("relative w-full", className)} aria-hidden>
      {/* Static land — an <img> so ~9k dots never enter the DOM */}
      <img
        src={
          isDark
            ? "/brand/corridor-map-dark.svg"
            : "/brand/corridor-map-light.svg"
        }
        alt=""
        width={W}
        height={H}
        loading="lazy"
        decoding="async"
        className="w-full select-none"
        draggable={false}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <radialGradient id="hubGlow">
            <stop offset="0%" stopColor="#7ABF40" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7ABF40" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Inbound talent corridors */}
        <g>
          {inbound.map((r, i) => (
            <g key={r.name}>
              {variant === "corridors" && (
                <motion.path
                  d={r.d}
                  stroke={routeIn}
                  strokeWidth={1}
                  strokeDasharray="3 5"
                  initial={play ? { pathLength: 0, opacity: 0 } : false}
                  whileInView={play ? { pathLength: 1, opacity: 1 } : undefined}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.5,
                    delay: 0.25 + i * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )}
              <circle cx={r.x} cy={r.y} r={2.6} fill={routeIn} />
              {showLabels && (
                <text
                  x={r.x}
                  y={r.y - 8}
                  fill={label}
                  fontSize={10.5}
                  textAnchor="middle"
                  className="font-sans"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {r.name}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Outbound EU placement routes */}
        <g>
          {outbound.map((r, i) => (
            <g key={r.slug}>
              {variant === "corridors" && (
                <motion.path
                  d={r.d}
                  stroke={routeOut}
                  strokeOpacity={0.55}
                  strokeWidth={1.3}
                  initial={play ? { pathLength: 0, opacity: 0 } : false}
                  whileInView={play ? { pathLength: 1, opacity: 1 } : undefined}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.9 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              )}
              {variant === "pins" && play && (
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={activeSlug === r.slug ? 9 : 6}
                  fill={routeOut}
                  fillOpacity={activeSlug === r.slug ? 0.42 : 0.2}
                  className="node-pulse"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animationDelay: `${(i % 5) * 0.45}s`,
                  }}
                />
              )}
              <circle
                cx={r.x}
                cy={r.y}
                r={variant === "pins" && activeSlug === r.slug ? 5 : 3.2}
                fill={variant === "pins" && activeSlug === r.slug ? routeOut : nodeEu}
              />
              {showLabels && (
                <text
                  x={r.x}
                  y={r.y - 9}
                  fill={label}
                  fontSize={11}
                  textAnchor="middle"
                  className="font-sans"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {r.name}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* The hub — Vilnius */}
        <g>
          <circle cx={hub.x} cy={hub.y} r={46} fill="url(#hubGlow)" />
          {play && (
            <circle
              cx={hub.x}
              cy={hub.y}
              r={6}
              fill="#7ABF40"
              fillOpacity={0.5}
              className="node-pulse"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
          <circle cx={hub.x} cy={hub.y} r={5.5} fill="#7ABF40" />
          <circle
            cx={hub.x}
            cy={hub.y}
            r={5.5}
            stroke={isDark ? "#0A1226" : "#FFFFFF"}
            strokeWidth={1.4}
          />
          <text
            x={hub.x}
            y={hub.y - 14}
            fill={isDark ? "#FFFFFF" : "#1E2D56"}
            fontSize={12.5}
            fontWeight={600}
            textAnchor="middle"
            className="font-display"
            style={{ letterSpacing: "-0.01em" }}
          >
            Vilnius
          </text>
        </g>
      </svg>
    </div>
  );
}
