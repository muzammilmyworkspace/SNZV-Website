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
  land = "dots",
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
  /**
   * "dots" is the stylised dot field. "solid" is the real coastline, drawn
   * from the same public-domain source and the same calibration, so pins land
   * identically on either.
   *
   * The solid map ships as a single alpha MASK rather than two coloured
   * images: CSS paints it with a theme token, so the landmass follows the
   * palette and there is no second asset to keep in step.
   */
  land?: "dots" | "solid";
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

  /**
   * Every colour resolves through the tone system, so the map follows the
   * theme wherever it is placed. `tone` is retained only so existing call
   * sites keep compiling.
   */
  const isDark = tone === "dark";
  const routeIn = "color-mix(in srgb, var(--fg) 32%, transparent)";
  const routeOut = "var(--accent)";
  const nodeEu = "var(--fg)";
  const label = "color-mix(in srgb, var(--fg) 78%, transparent)";

  return (
    <div className={cn("relative w-full", className)} aria-hidden>
      {land === "solid" ? (
        /*
          The real coastline. A masked block rather than an <img>, so the
          landmass takes its colour from the current tone — one asset, both
          themes, and it keeps following the palette if the tone changes.

          The spacer <img> below it establishes the box's height from the same
          aspect ratio; the mask itself is painted on the absolutely-positioned
          layer above.
        */
        <div className="relative w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden />
          <div aria-hidden className="world-land absolute inset-0" />
        </div>
      ) : (
        /* Static dot field — an <img> so ~9k dots never enter the DOM */
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
      )}

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
            stroke="var(--surface)"
            strokeWidth={1.4}
          />
          <text
            x={hub.x}
            y={hub.y - 14}
            fill="var(--fg)"
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
