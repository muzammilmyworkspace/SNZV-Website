"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Container, Section, Eyebrow, MaskedLines } from "@/components/ui/Primitives";
import { studyJourney } from "@/data/study";
import { company } from "@/data/company";

/**
 * THE STUDENT JOURNEY, DRAWN.
 *
 * A single flight arc is drawn across the section as you scroll, with the
 * stages as nodes on it and a plane riding the line. It is the site's hairline
 * language doing something that means something: the route IS the service.
 *
 * SCROLL IS THE TIMELINE. Nothing autoplays and nothing advances on a timer. A
 * stage that slides away mid-sentence is the most reliable way to make
 * somebody stop reading, and an animation that has finished before the reader
 * arrives has communicated nothing. The viewer's own scroll position drives
 * every value here.
 *
 * STICKY ART, SCROLLING TEXT. The arc stays in view while the stage cards move
 * past it. That is what lets one continuous drawing carry six stages — the
 * alternative, one small illustration per card, is six unrelated pictures and
 * no journey.
 *
 * THE STAGES ARE SnZ'S OWN. Five of the six are `studyJourney` in
 * data/study.ts, published on the student site, read from there rather than
 * retyped. The sixth is the portal, inserted after the first call because that
 * is when it actually happens and because it is the thing this page exists to
 * sell. It is marked `portal: true` rather than being quietly indistinguishable
 * from the published five.
 */

/* --------------------------------------------------------------- the route */

/**
 * The flight arc, in the art box's own 560×420 coordinate space.
 *
 * ONE STRING, TWO CONSUMERS: the <path> that is drawn, and the `offset-path`
 * the plane rides. They have to be the same curve or the plane flies beside
 * the line instead of along it, which is the kind of bug that looks like a
 * rendering glitch rather than a typo.
 */
const ROUTE =
  "M 54 352 C 148 352 186 304 248 240 C 310 176 384 96 506 88";

/**
 * The art's coordinate space. Not a pixel size — the SVG scales to its column
 * and everything inside it is expressed in these units.
 */
const ART = { w: 560, h: 420 };

/** Where the plane sits before the path has been measured. Matches ROUTE's M. */
const ROUTE_START = { x: 54, y: 352 };

type Stage = {
  step: string;
  name: string;
  body: string;
  /** The one stage that is ours rather than the published journey. */
  portal?: boolean;
};

/*
  The portal goes between Discovery Call and University Shortlist. Not at the
  front: an account before a conversation is a form, and this firm's whole
  pitch is that the conversation comes first.
*/
const STAGES: Stage[] = [
  studyJourney[0],
  {
    step: "02",
    name: "Your portal opens",
    body: "We create your account and you can see the whole file from then on — what we have, what is outstanding, and where the application stands. No chasing anybody for an update.",
    portal: true,
  },
  ...studyJourney.slice(1).map((s, i) => ({
    ...s,
    // Renumbered, because inserting a stage in the middle makes the published
    // 02–05 read as 03–06 here. The names are untouched.
    step: String(i + 3).padStart(2, "0"),
  })),
];

/* ------------------------------------------------------------------ the art */

function Route({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  /*
    Node positions are measured off the real path once, on mount, rather than
    guessed — eyeballed coordinates drift off the curve the moment the curve is
    adjusted, and the drift is small enough that nobody notices until it looks
    subtly wrong. Measured once and held in state: this is not per-frame work.
  */
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    setNodes(
      STAGES.map((_, i) => {
        const p = el.getPointAtLength((i / (STAGES.length - 1)) * len);
        return { x: p.x, y: p.y };
      })
    );
  }, []);

  /*
    `pathLength={1}` normalises the path's own length to 1, so the dash offset
    is the scroll progress with no measurement and no resize listener. Without
    it this needs getTotalLength() and a recalculation every time the box
    changes size.
  */
  const draw = useTransform(progress, (v) => 1 - v);

  /*
    THE PLANE'S POSITION, IN THE SVG'S OWN COORDINATES.

    Written straight onto the <g>'s `transform` ATTRIBUTE from a scroll
    listener, which is the one approach here that is unambiguous. Two others
    were tried and both failed silently, which is worth recording because they
    are the obvious ones:

      • `offset-path` on an HTML element. Its path is in CSS pixels, so it only
        lines up when the art renders at exactly its intrinsic size — and
        forcing that with `transform: scale()` does not reduce layout width, so
        a 560px box kept occupying 560px inside a 375px viewport and put 205px
        of horizontal scroll on the entire page.
      • A MotionValue bound to `transform` as a React prop, then as a CSS
        transform with `transform-box: view-box`. The first does nothing at all
        and the second lands the plane in the wrong coordinate space — in both
        cases the aeroplane sits somewhere near the origin looking like a
        rendering glitch rather than a bug.

    The SVG attribute has none of that ambiguity: its units ARE the viewBox's,
    at every rendered size.

    It is a listener rather than React state because this runs on every scroll
    frame. `setState` here would re-render the section sixty times a second.

    The heading comes from a point one unit behind, which is the tangent in
    every way that matters at this scale and needs no bezier differentiation.
  */
  const planeRef = useRef<SVGGElement>(null);

  const place = useCallback((v: number) => {
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!path || !plane) return;
    const len = path.getTotalLength();
    const at = Math.min(len, Math.max(0, v * len));
    const p = path.getPointAtLength(at);
    const back = path.getPointAtLength(Math.max(0, at - 1));
    const angle = (Math.atan2(p.y - back.y, p.x - back.x) * 180) / Math.PI;
    plane.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
  }, []);

  /* Put it on the line before the first scroll event, not at the origin. */
  useEffect(() => {
    place(reduced ? 1 : progress.get());
  }, [place, progress, reduced]);

  useMotionValueEvent(progress, "change", (v) => {
    if (!reduced) place(v);
  });

  return (
    <div className="relative w-full" aria-hidden>
      <svg
        viewBox={`0 0 ${ART.w} ${ART.h}`}
        fill="none"
        /*
          No width/height attribute. The viewBox plus `w-full h-auto` is what
          makes this scale with its column instead of with a transform, which
          is the difference between a responsive drawing and 205px of
          horizontal page scroll.
        */
        className="h-auto w-full"
      >
        {/* The route not yet flown — present from the start, so the reader can
            see where this is going rather than watching a line crawl into a
            void. */}
        <path
          d={ROUTE}
          stroke="var(--line-strong)"
          strokeWidth={1}
          strokeDasharray="3 6"
          strokeLinecap="round"
        />

        {/* The route flown. Drawn by scroll. */}
        <motion.path
          ref={pathRef}
          d={ROUTE}
          pathLength={1}
          stroke="var(--accent)"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeDasharray={1}
          style={{ strokeDashoffset: reduced ? 0 : draw }}
        />

        {/* The stage nodes. Each fills as the line reaches it. */}
        {nodes.map((n, i) => {
          const at = i / (STAGES.length - 1);
          return <Node key={i} x={n.x} y={n.y} at={at} progress={progress} reduced={reduced} />;
        })}

        {/*
          THE PLANE. Drawn last so it sits over the route rather than under it,
          and nested in a <g> whose transform does the moving — the inner path
          only has to be drawn once, pointing along +x, and centred on nothing
          but its own origin.
        */}
        <g ref={planeRef}>
          {/* Drawn once, nose along +x, centred on its own origin — the outer
              <g> does all the moving. */}
          <g transform="translate(-9 -9) rotate(90 9 9)">
            <path
              d="M18 13.5v-1.5l-6-3.75V4.125a1.125 1.125 0 0 0-2.25 0V8.25L3.75 12v1.5l6-1.875V15l-1.5 1.125v1.125L10.875 16.5l2.625.75v-1.125L12 15v-3.375L18 13.5Z"
              fill="var(--accent)"
            />
          </g>
        </g>
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
  /*
    Each node fills over a short window around the moment the line reaches it,
    so the ring and the drawing agree. A plain step would pop; a long ramp
    would have every node half-lit at once and say nothing about where you are.
  */
  const fill = useTransform(progress, [at - 0.04, at + 0.02], [0, 1], {
    clamp: true,
  });

  return (
    <g>
      <circle cx={x} cy={y} r={4.5} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={1} />
      <motion.circle
        cx={x}
        cy={y}
        r={3}
        fill="var(--accent)"
        style={{
          opacity: reduced ? 1 : fill,
          scale: reduced ? 1 : fill,
          /*
            Scale from the node's own centre, not the SVG's origin — without
            this every dot grows out of the top-left corner of the drawing.
            `fill-box` makes `center` mean the circle's own box, which avoids
            restating cx/cy here and getting them out of step with the <circle>
            above when the curve moves.
          */
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
    </g>
  );
}

/* ----------------------------------------------------------------- section */

export function StudentJourney() {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /*
    Starts when the section's top reaches 75% down the viewport and finishes
    when its bottom passes 85% — so the drawing is underway while the first
    card is being read, and complete at the last one rather than at the very
    bottom edge where nobody is looking.
  */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.85"],
  });

  /*
    Spring-smoothed. A trackpad emits scroll in coarse jumps and the plane
    teleports between them; the spring turns that into flight. `restDelta`
    stops it settling forever at the end of the curve.
  */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <Section id="student-journey" tone="deep" className="anchor-target no-linefield">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow className="mb-5">For students</Eyebrow>
          <MaskedLines
            as="h2"
            className="d-2 max-w-[18ch] text-fg-strong"
            lines={["From the first call", "to the first week."]}
          />
          <p className="lede mt-5">
            Six stages. You can see every one of them from inside your portal,
            which is the difference between being guided and being told to wait.
          </p>
        </div>

        <div
          ref={ref}
          className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16"
        >
          {/*
            STICKY ON DESKTOP, where there is a second column for the text to
            scroll past. Below `lg` the art pins under the header instead and
            the cards run beneath it full width — a 560px drawing beside a
            375px column is not a layout.
          */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/*
              `max-w` rather than a fixed width: the drawing fills the column up
              to the size it was composed at and stops growing after that, so a
              2560px screen gets whitespace rather than a 1200px aeroplane.
            */}
            <div className="mx-auto w-full max-w-[560px] lg:mx-0">
              <Route progress={progress} reduced={Boolean(reduced)} />
            </div>
          </div>

          {/* `min-w-0` for the reason spelled out in BusinessJourney: a grid
              column is sized by its content's min-content width, and one
              nowrap label in here would widen the whole page. */}
          <ol className="min-w-0 space-y-10 lg:space-y-16">
            {STAGES.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative border-t border-line pt-5"
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

                {s.portal && (
                  <Link
                    href={company.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label mt-4 inline-flex min-h-11 items-center gap-2 text-accent transition-colors hover:text-fg"
                  >
                    Open the portal
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5">
                      <path
                        d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}

                {/* Index {i} is unused in render; kept out of the markup on
                    purpose so the list order comes from the DOM, not a label. */}
                <span className="sr-only">{`Stage ${i + 1} of ${STAGES.length}`}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
