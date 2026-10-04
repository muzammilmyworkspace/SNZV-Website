"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { studyDestinations, studyFields } from "@/data/study";
import { PortalReel } from "./PortalReel";
import { Laptop } from "./Devices";
import { RealPhone } from "./RealPhone";
import { PhonePortal } from "./PhonePortal";
import { LiveCall } from "./LiveCall";
import { cn } from "@/lib/utils";
import { useReduced } from "@/components/bp/useReduced";

/**
 * THE HERO SCENE — "the form that becomes a flight".
 *
 * A student's application fills itself in, gets stamped SUBMITTED, folds into
 * a paper plane, and the paper plane launches along a drawn arc — turning into
 * a real aircraft on the way — to land on a destination. Then the next
 * application starts, for the next destination. The loop IS the pitch: one
 * form in, one flight out, over and over.
 *
 * Behind it: a porthole onto real students (licensed photograph, in the image
 * manifest) and a laptop running the portal reel — the same application, as
 * the student will actually see it.
 *
 * GEOMETRY. The stage has a fixed aspect ratio and the flight SVG shares its
 * coordinate system (600 × 560), so a percentage on a positioned element and a
 * coordinate on the path mean the same point at every screen size.
 *
 * PERFORMANCE. The flight is driven by one `animate()` whose onUpdate writes
 * straight to SVG attributes — no React state per frame. Typing is the only
 * part that re-renders, and only this card.
 *
 * REDUCED MOTION: the card renders filled and stamped, the arc drawn, the plane
 * parked at its destination.
 */

const W = 600;
const H = 560;
// From the centre of the card, up and over the laptop, to the pin.
const ARC = "M200 370 C 60 250, 300 -40, 572 14";
const PIN = { x: 572, y: 14 };

type Phase = "typing" | "stamp" | "fold" | "fly" | "landed";

const NAME = "Your Name";
const INTAKE = "Next intake";

export function ApplicationScene() {
  const reduce = useReduced();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-10% 0px" });

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);

  const dest = studyDestinations[round % studyDestinations.length];
  const field = studyFields[(round * 3) % studyFields.length];
  const values = [NAME, field.name, `${dest.city}, ${dest.country}`, INTAKE];
  const total = values.reduce((n, v) => n + v.length, 0);

  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const paperRef = useRef<SVGGElement>(null);
  const jetRef = useRef<SVGGElement>(null);

  /* ---- the timeline ---------------------------------------------------- */
  useEffect(() => {
    if (reduce) return;
    if (!inView && phase === "typing") return; // pause between rounds off-screen
    let t: number | undefined;
    if (phase === "typing") {
      if (typed < total) t = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 700 : 42);
      else t = window.setTimeout(() => setPhase("stamp"), 350);
    } else if (phase === "stamp") t = window.setTimeout(() => setPhase("fold"), 1100);
    else if (phase === "fold") t = window.setTimeout(() => setPhase("fly"), 650);
    else if (phase === "landed")
      t = window.setTimeout(() => {
        setRound((r) => r + 1);
        setTyped(0);
        setPhase("typing");
      }, 1500);
    return () => window.clearTimeout(t);
  }, [phase, typed, total, reduce, inView]);

  /* ---- the flight ------------------------------------------------------ */
  useEffect(() => {
    const path = pathRef.current;
    const trail = trailRef.current;
    const plane = planeRef.current;
    if (!path || !trail || !plane) return;
    const len = path.getTotalLength();
    trail.style.strokeDasharray = `${len}`;

    const place = (p: number) => {
      const a = path.getPointAtLength(p * len);
      const b = path.getPointAtLength(Math.min(len, p * len + 2));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      // Grows as it "climbs" toward the viewer, then settles on approach.
      const s = 0.8 + Math.sin(p * Math.PI) * 0.5;
      plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle}) scale(${s})`);
      trail.style.strokeDashoffset = `${len * (1 - p)}`;
      const morph = Math.min(1, Math.max(0, (p - 0.35) / 0.25));
      paperRef.current?.setAttribute("opacity", `${1 - morph}`);
      jetRef.current?.setAttribute("opacity", `${morph}`);
    };

    if (reduce) {
      place(1);
      plane.setAttribute("opacity", "1");
      return;
    }
    if (phase !== "fly") {
      plane.setAttribute("opacity", phase === "landed" ? "1" : "0");
      if (phase === "typing") trail.style.strokeDashoffset = `${len}`;
      return;
    }
    plane.setAttribute("opacity", "1");
    const controls = animate(0, 1, {
      duration: 2.3,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: place,
      onComplete: () => setPhase("landed"),
    });
    return () => controls.stop();
  }, [phase, reduce]);

  /* ---- what the card shows -------------------------------------------- */
  const shown = reduce ? total : typed;
  let budget = shown;
  const rows = values.map((v) => {
    const n = Math.max(0, Math.min(v.length, budget));
    budget -= v.length;
    return v.slice(0, n);
  });
  const activeRow = reduce ? -1 : rows.findIndex((r, k) => r.length < values[k].length);
  const stamped = reduce || phase !== "typing";
  const cardGone = !reduce && (phase === "fold" || phase === "fly" || phase === "landed");

  const labels = ["Student", "Programme", "Destination", "Intake"];

  return (
    <div ref={root} data-stack className="relative mx-auto mb-[30%] w-full max-w-[640px] sm:mb-0" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* The first step, live: the photograph of real students framed as
          the free consultation call. Tilted, floating over the laptop's
          corner, so the call and the portal read as one scene. */}
      <motion.div
        className="absolute left-[0%] top-[1%] z-10 hidden w-[27%] sm:block"
        initial={{ opacity: 0, y: 30, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <LiveCall active={inView} />
        </motion.div>
      </motion.div>

      {/* The laptop — the portal reel, front-on, on a proper machine. */}
      <motion.div
        className="absolute left-[19%] top-[7%] w-[74%]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Laptop>
            <PortalReel active={inView} chrome="bare" />
          </Laptop>
        </motion.div>
      </motion.div>

      {/* The phone: the same portal, in the student's pocket. A real
          iPhone at native density, turned slightly toward the laptop. */}
      <motion.div
        className="absolute right-[-3%] top-[24%] z-10 hidden w-[25%] sm:block"
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateY: -22, rotateX: 6, rotateZ: 3 }}
          animate={reduce ? { rotateY: -14, rotateX: 4, rotateZ: 2 } : { rotateY: [-14, -8, -14], rotateX: [4, 2, 4], rotateZ: [2, 1, 2], y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <RealPhone>
            <PhonePortal active={inView} />
          </RealPhone>
        </motion.div>
        {/* contact shadow on the "desk" */}
        <div aria-hidden className="mx-auto mt-3 h-3 w-[70%] rounded-[50%] bg-black/60 blur-[10px]" />
      </motion.div>

      {/* Live notifications floating off the machine. */}
      <FloatingChips active={inView && !reduce} />

      {/* The application form. */}
      <div className="absolute left-[2%] top-[42%] z-20 w-[50%] min-w-[220px]" style={{ perspective: 900 }}>
        <AnimatePresence mode="wait">
          {!cardGone && (
            <motion.div
              key={round}
              className="bp-paper relative origin-top p-[5%] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, y: 40, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotate: -2 }}
              exit={{
                rotateX: 75,
                scaleY: 0.15,
                scaleX: 0.4,
                y: -10,
                opacity: 0,
                transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="bp-mono !text-[0.72rem]">Application form</p>
                  <p className="font-[family-name:var(--font-grotesk)] text-[1.05rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.2rem]">
                    Study in Europe
                  </p>
                </div>
                <StudentAvatar />
              </div>

              <dl className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {labels.map((label, k) => (
                  <div key={label} className="relative border-b border-[rgb(18_23_38/0.12)] pb-1.5">
                    <dt className="bp-mono !text-[0.72rem] !tracking-[0.16em]">{label}</dt>
                    <dd className="min-h-[1.3em] text-[0.82rem] font-semibold text-[var(--color-ticket-ink)] sm:text-[0.95rem]">
                      {rows[k]}
                      {k === activeRow && <span className="bp-caret ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#1D4ED8]" />}
                    </dd>
                    {k === activeRow && <Pen />}
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="bp-barcode w-[45%] text-[var(--color-ticket-ink)]" style={{ height: 22 }} />
                <span className="bp-mono !text-[0.72rem]">Home → {dest.airport}</span>
              </div>

              <AnimatePresence>
                {stamped && (
                  <motion.span
                    className="bp-stamp bp-stamp-ok absolute right-[6%] top-[42%] !text-[0.8rem] sm:!text-[1rem]"
                    initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -24 }}
                    animate={{ scale: 1, opacity: 0.9, rotate: -14 }}
                    transition={{ type: "spring", stiffness: 520, damping: 22 }}
                  >
                    Submitted
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The flight. Same coordinate system as the stage. */}
      <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible" aria-hidden>
        <path ref={pathRef} d={ARC} fill="none" style={{ stroke: "var(--bp-line-strong)" }} strokeWidth="1.2" strokeDasharray="3 7" />
        <path
          ref={trailRef}
          d={ARC}
          fill="none"
          stroke="url(#hero-trail)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ strokeDashoffset: reduce ? 0 : 9999 }}
        />
        <defs>
          <linearGradient id="hero-trail" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6FA6F7" stopOpacity="0.2" />
            <stop offset="1" stopColor="#72C43C" />
          </linearGradient>
        </defs>

        {/* Destination pin */}
        <g transform={`translate(${PIN.x} ${PIN.y})`}>
          <circle r="16" fill="#72C43C" opacity="0.12">
            {!reduce && <animate attributeName="r" values="8;22;8" dur="2.4s" repeatCount="indefinite" />}
          </circle>
          <circle r="5" fill="#72C43C" />
          <circle r="5" fill="none" stroke="#070B1A" strokeWidth="2" />
        </g>

        <g ref={planeRef} opacity={reduce ? 1 : 0}>
          <g ref={paperRef}>
            <path d="M-16 -10 L18 0 L-16 10 L-9 0 Z" fill="#F6F3EC" />
            <path d="M-9 0 L18 0 L-16 10 Z" fill="#CFC8B8" />
          </g>
          <g ref={jetRef} opacity="0" transform="translate(-15 -15) scale(1.25)" fill="#72C43C">
            <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
          </g>
        </g>
      </svg>

      {/* Landing label, pinned to the destination. */}
      <div
        className="pointer-events-none absolute -translate-x-full -translate-y-1/2 pr-6"
        style={{ left: `${(PIN.x / W) * 100}%`, top: `${(PIN.y / H) * 100}%` }}
      >
        <AnimatePresence mode="wait">
          {(reduce || phase === "landed") && (
            <motion.div
              key={dest.slug}
              className="bp-pass-dark flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Image src={`/flags/${dest.slug}.svg`} alt="" width={18} height={12} className="h-3 w-[18px] rounded-[2px] object-cover" />
              <span className="bp-mono !text-[0.72rem] text-[var(--bp-strong)]">Landed · {dest.airport}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live caption for screen readers — what the loop is showing. */}
      <p className="sr-only" aria-live="off">
        An animated application form for {dest.city}, {dest.country} is filled in, stamped submitted, and folded into a
        paper plane that flies to its destination.
      </p>
    </div>
  );
}

/**
 * Two notifications that drift in and out beside the machine — the kind a
 * student actually gets from the portal. Illustrative wording; no person, no
 * figures.
 */
const CHIPS = [
  { text: "Document approved", sub: "Transcript.pdf", pos: "left-[16%] top-[-2%]" },
  { text: "Your consultant replied", sub: "Messages · just now", pos: "right-[27%] top-[40%]" },
  { text: "Offer received", sub: "Added to your journey", pos: "left-[22%] top-[-2%]" },
  { text: "Visa file checked", sub: "Ready to submit", pos: "right-[27%] top-[40%]" },
];

function FloatingChips({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % CHIPS.length), 2600);
    return () => window.clearInterval(t);
  }, [active]);
  const chip = CHIPS[i];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block" aria-hidden>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={i}
            className={`bp-pass-dark absolute flex items-center gap-2.5 rounded-2xl px-3 py-2 ${chip.pos}`}
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-runway)] text-[0.8rem] font-bold text-[var(--bp-on-accent)]">
              ✓
            </span>
            <span className="leading-tight">
              <span className="block text-[0.8rem] font-semibold text-[var(--bp-strong)]">{chip.text}</span>
              <span className="bp-mono block !text-[0.72rem] text-[var(--bp-muted)]">{chip.sub}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A line-drawn student, sketched on as the card arrives. */
function StudentAvatar() {
  const reduce = useReduced();
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { delay, duration: 0.9, ease: [0.65, 0, 0.35, 1] as const },
        };
  return (
    <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-md border border-[rgb(18_23_38/0.15)] bg-[#E9EEF7] sm:h-14 sm:w-12">
      <svg viewBox="0 0 48 56" className="h-full w-full" fill="none" stroke="#1D3F79" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <motion.circle cx="24" cy="22" r="9" {...draw(0.3)} />
        <motion.path d="M15 19c2-7 16-9 19 0" {...draw(0.6)} />
        <motion.path d="M8 56c1-11 8-17 16-17s15 6 16 17" {...draw(0.8)} />
        <motion.path d="M20 39l4 6 4-6" {...draw(1)} />
      </svg>
    </div>
  );
}

/** The pen, writing on the active line. */
function Pen() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("absolute -right-1 top-0 h-5 w-5 text-[#1D3F79] sm:h-6 sm:w-6")}
      animate={{ x: [0, -3, 1, -2, 0], y: [0, 1, -1, 1, 0], rotate: [0, -4, 2, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity }}
    >
      <path d="M4 20l1.5-5L16 4.5a2 2 0 012.8 0l.7.7a2 2 0 010 2.8L9 18.5z" fill="#F6F3EC" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 20l1.5-5 3.5 3.5z" fill="currentColor" />
    </motion.svg>
  );
}
