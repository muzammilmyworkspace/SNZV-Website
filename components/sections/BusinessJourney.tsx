"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Container, Section, Eyebrow, MaskedLines, Action } from "@/components/ui/Primitives";
import { businessJourney } from "@/data/pathways";

/**
 * THE BUSINESS JOURNEY, DRAWN.
 *
 * The companion to StudentJourney, and deliberately the opposite gesture.
 *
 * The student line is a flight arc: one continuous curve that LEAVES. This one
 * is orthogonal — right angles, a riser and a run per stage — and it BUILDS,
 * ending on an entity that reaches outward across the single market. Same
 * hairline language, opposite movement. Two long scroll-drawn sections that
 * moved the same way would read as one slide shown twice; the contrast is what
 * makes them feel composed.
 *
 * MIRRORED, for the same reason. The art sits on the right here and the text
 * on the left, so the page alternates rather than repeating a column layout.
 *
 * The stages are `businessJourney` in data/pathways.ts — read from there, and
 * assembled from capabilities the rest of this site already describes. See
 * that file's header on why there are no timings in them.
 */

/**
 * The staircase, in the art box's own 560×420 space.
 *
 * ONE STRING, ONE CONSUMER here — unlike the student route there is nothing
 * riding this line, because nothing travels in this story. The founder does
 * not go anywhere; the company gets built around them.
 */
const BUILD =
  "M 44 384 H 136 V 318 H 220 V 256 H 304 V 194 H 388 V 132 H 470 V 74";

const ART = { w: 560, h: 420 };

/** Where the structure ends and the reach begins. Matches BUILD's last point. */
const SUMMIT = { x: 470, y: 74 };

/*
  The single market, as eight rays rather than a map.

  A real map of the EU at this size is an unreadable smudge, and an inaccurate
  one is worse than none — this site does not ship approximations of factual
  things. Eight rays say "outward in every direction from here", which is the
  actual proposition, and cannot be wrong about a border.
*/
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const angle = (-150 + i * 22) * (Math.PI / 180);
  return {
    x: SUMMIT.x + Math.cos(angle) * 62,
    y: SUMMIT.y + Math.sin(angle) * 62,
  };
});

function Build({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  /* Measured off the real path once, for the reason given in StudentJourney. */
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    setNodes(
      businessJourney.map((_, i) => {
        const p = el.getPointAtLength((i / (businessJourney.length - 1)) * len);
        return { x: p.x, y: p.y };
      })
    );
  }, []);

  const draw = useTransform(progress, (v) => 1 - v);
  /* The rays only exist once the structure is finished. */
  const reach = useTransform(progress, [0.88, 1], [0, 1], { clamp: true });

  return (
    <div className="relative w-full" aria-hidden>
      <svg
        viewBox={`0 0 ${ART.w} ${ART.h}`}
        fill="none"
        /*
          viewBox plus `w-full h-auto`, never a transform. `scale()` leaves the
          element occupying its intrinsic width, which on a phone is 560px
          inside a 375px viewport — horizontal scroll across the whole page.
        */
        className="h-auto w-full"
      >
        {/* What is still to be built. Visible from the start, so the shape of
            the whole job is legible before any of it is done. */}
        <path
          d={BUILD}
          stroke="var(--line-strong)"
          strokeWidth={1}
          strokeDasharray="3 6"
          strokeLinecap="square"
        />

        <motion.path
          ref={pathRef}
          d={BUILD}
          pathLength={1}
          stroke="var(--accent)"
          strokeWidth={1.75}
          /* Square caps and mitre joins: this is construction, not flight. */
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeDasharray={1}
          style={{ strokeDashoffset: reduced ? 0 : draw }}
        />

        {/* The single market, opening out of the finished entity. */}
        <motion.g style={{ opacity: reduced ? 1 : reach }}>
          {RAYS.map((r, i) => (
            <line
              key={i}
              x1={SUMMIT.x}
              y1={SUMMIT.y}
              x2={r.x}
              y2={r.y}
              stroke="var(--accent)"
              strokeOpacity={0.35}
              strokeWidth={1}
              strokeLinecap="round"
            />
          ))}
          <circle
            cx={SUMMIT.x}
            cy={SUMMIT.y}
            r={9}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
        </motion.g>

        {nodes.map((n, i) => (
          <Node
            key={i}
            x={n.x}
            y={n.y}
            at={i / (businessJourney.length - 1)}
            progress={progress}
            reduced={reduced}
          />
        ))}
      </svg>
    </div>
  );
}

function Node({
  x,
  y,
  at,
  progress,
  reduced,
}: {
  x: number;
  y: number;
  at: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const fill = useTransform(progress, [at - 0.04, at + 0.02], [0, 1], { clamp: true });

  /* Squares, not circles. The student journey's nodes are round; these are the
     same idea in the same place and must not be mistaken for the same thing. */
  return (
    <g>
      <rect
        x={x - 4.5}
        y={y - 4.5}
        width={9}
        height={9}
        fill="var(--surface)"
        stroke="var(--line-strong)"
        strokeWidth={1}
      />
      <motion.rect
        x={x - 3}
        y={y - 3}
        width={6}
        height={6}
        fill="var(--accent)"
        style={{
          opacity: reduced ? 1 : fill,
          scale: reduced ? 1 : fill,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
    </g>
  );
}

export function BusinessJourney() {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.85"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <Section id="business-journey" tone="soft" className="anchor-target no-linefield">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow className="mb-5">For founders &amp; investors</Eyebrow>
          <MaskedLines
            as="h2"
            className="d-2 max-w-[18ch] text-fg-strong"
            lines={["From a decision", "to a company that trades."]}
          />
          <p className="lede mt-5">
            A Lithuanian entity reaches 27 member states. Getting to one that can
            actually transact is six stages, and most packages stop after the
            second.
          </p>
        </div>

        <div
          ref={ref}
          className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
        >
          {/*
            Text first in the DOM, which is also reading order for a screen
            reader and the stacking order on a phone. On desktop the art is
            ordered to the right — mirroring StudentJourney so the page
            alternates instead of repeating itself.
          */}
          {/*
            `min-w-0` because a grid column is sized by its content's
            min-content width, and `Action` sets `white-space: nowrap` on its
            label. A four-word uppercase CTA with 0.12em tracking therefore
            made this column 303px wide inside a 280px container on a 320px
            screen — three pixels of horizontal scroll across the entire page,
            traced back from the header, which was merely stretching to match.
          */}
          <ol className="order-2 min-w-0 space-y-10 lg:order-1 lg:space-y-16">
            {businessJourney.map((s) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-line pt-5"
              >
                <div className="flex items-baseline gap-4">
                  <span className="label num text-accent">{s.step}</span>
                  <h3 className="text-[1.15rem] font-semibold leading-tight tracking-[-0.015em] text-fg-strong">
                    {s.name}
                  </h3>
                </div>
                <p className="mt-3 max-w-prose text-[0.92rem] leading-relaxed text-muted">
                  {s.body}
                </p>
              </motion.li>
            ))}

            <li className="border-t border-line pt-6">
              {/* Short enough to fit a 320px screen even set in caps — see
                  the note on min-w-0 above. */}
              <Action href="/business-setup" variant="line">
                See business setup
              </Action>
            </li>
          </ol>

          <div className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            {/* Fills the column up to the size it was composed at, then stops. */}
            <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0">
              <Build progress={progress} reduced={Boolean(reduced)} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
