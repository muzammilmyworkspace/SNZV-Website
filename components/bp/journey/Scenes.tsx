"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { studyDestinations, studyFields } from "@/data/study";
import { Phone } from "../Devices";

/**
 * THE SEVEN JOURNEY SCENES.
 *
 * Each scene receives `p`, its own progress from 0 to 1, as a MotionValue
 * derived from page scroll. Everything inside is a transform of `p` — so the
 * visitor's scroll is the playhead, scrubbing forwards and backwards, and
 * nothing re-renders while it does. Under reduced motion the parent passes a
 * constant 1, and every scene renders in its finished state.
 *
 * All scenes draw into the same box (aspect 5:4) so they can be stacked and
 * cross-faded by the parent.
 */

type P = { p: MotionValue<number> };

/** [a, b] of the scene's progress mapped to [from, to], clamped. */
function useSeg(p: MotionValue<number>, a: number, b: number, from = 0, to = 1): MotionValue<number> {
  return useTransform(p, [a, b], [from, to], { clamp: true });
}

/* ================================================================ 1 CONTACT */

export function SceneContact({ p }: P) {
  const b1 = useSeg(p, -0.25, 0.1); // already arriving when the stage pins
  const typing = useTransform(p, [0.24, 0.3, 0.4, 0.44], [0, 1, 1, 0]);
  const b2 = useSeg(p, 0.42, 0.54);
  const b3 = useSeg(p, 0.58, 0.68);
  const b4 = useSeg(p, 0.7, 0.8);
  const note = useSeg(p, 0.82, 0.94);
  const noteX = useSeg(p, 0.82, 0.94, -30, 0);
  const rise = (v: MotionValue<number>) => useTransform(v, [0, 1], [14, 0]);

  return (
    <div className="relative flex h-full items-center justify-center">
      {/* Sized from the stage's width: on a 5:4 stage, 37% wide at 9:19 is
          just under the full height, so the phone always fits inside it. */}
      <Phone className="w-[37%]" statusTone="light" statusBg="#075E54">
        <div className="flex h-full flex-col">
          {/* WhatsApp header */}
          <div className="flex items-center gap-2 bg-[#075E54] px-3 pb-2.5 pt-[14%] text-white">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Image src="/brand/snz-mark.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 rounded-full bg-white" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[0.8rem] font-semibold">SnZ Ventures</p>
              <p className="text-[0.72rem] text-white/75">online</p>
            </div>
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
              <path d="M5 2.5l2.5 3-1.5 2a10 10 0 006.5 6.5l2-1.5 3 2.5-1.5 2.5C9 17 3 11 2.5 4z" />
            </svg>
          </div>

          {/* Chat, on the familiar wallpaper */}
          <div
            className="relative flex flex-1 flex-col justify-end gap-1.5 px-2.5 pb-2 text-[0.72rem] leading-snug text-[#111B21]"
            style={{
              backgroundColor: "#EFE7DD",
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
              backgroundSize: "14px 14px, 22px 22px",
              backgroundPosition: "0 0, 7px 11px",
            }}
          >
            <span className="mx-auto mb-1 rounded-md bg-[#E1F2FB] px-2 py-0.5 text-[0.72rem] text-[#54656F]">Today</span>
            <motion.p style={{ opacity: b1, y: rise(b1) }} className="ml-auto max-w-[86%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-2 py-1.5 shadow-sm">
              Hi! I want to study in Europe. Where do I start?
              <span className="ml-1.5 whitespace-nowrap text-[0.72rem] text-[#1F6FA3]">✓✓</span>
            </motion.p>
            <motion.div style={{ opacity: typing }} className="flex w-12 gap-1 rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8696A0] motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </motion.div>
            <motion.p style={{ opacity: b2, y: rise(b2) }} className="max-w-[88%] rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
              Welcome! Let&apos;s start with a free consultation. When suits you?
            </motion.p>
            <motion.p style={{ opacity: b3, y: rise(b3) }} className="ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-2 py-1.5 shadow-sm">
              Tomorrow at 5pm works.
              <span className="ml-1.5 whitespace-nowrap text-[0.72rem] text-[#1F6FA3]">✓✓</span>
            </motion.p>
            <motion.p style={{ opacity: b4, y: rise(b4) }} className="max-w-[88%] rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
              Booked. Your consultant will call you then.
            </motion.p>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-1.5 bg-[#EFE7DD] px-2 pb-[9%] pt-1">
            <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[0.72rem] text-[#54656F]">Message</span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#00A884] text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M8 1a2.5 2.5 0 00-2.5 2.5v4a2.5 2.5 0 005 0v-4A2.5 2.5 0 008 1zM3.5 7.5a.75.75 0 011.5 0 3 3 0 006 0 .75.75 0 011.5 0 4.5 4.5 0 01-3.75 4.43V14h-1.5v-2.07A4.5 4.5 0 013.5 7.5z" />
              </svg>
            </span>
          </div>
        </div>
      </Phone>

      <motion.div
        style={{ opacity: note, x: noteX }}
        className="bp-pass-dark absolute right-0 top-[10%] flex items-center gap-3 rounded-2xl px-4 py-3 max-sm:hidden"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-runway)] text-[var(--bp-on-accent)]">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M10 2a6 6 0 00-6 6v3l-1.5 3h15L16 11V8a6 6 0 00-6-6zm-2 14a2 2 0 004 0z" />
          </svg>
        </span>
        <span>
          <span className="block text-[0.85rem] font-semibold text-[var(--bp-strong)]">New student enquiry</span>
          <span className="bp-mono !text-[0.72rem] text-[var(--bp-muted)]">SnZ desk · now</span>
        </span>
      </motion.div>
    </div>
  );
}

/* ============================================================= 2 CONSULTANT */

/*
  The shortlist rows pair real destinations with real programme families from
  data/study.ts. It is an illustration of what a shortlist looks like, not a
  claim about any named university, which is why no institution is named.
*/
const SHORTLIST = [0, 1, 2].map((i) => ({
  place: `${studyDestinations[i * 3].city}, ${studyDestinations[i * 3].country}`,
  field: studyFields[(i * 2) % studyFields.length].name,
}));

export function SceneConsultant({ p }: P) {
  const card = useSeg(p, 0.04, 0.2);
  const cardY = useSeg(p, 0.04, 0.2, 30, 0);
  const assigned = useSeg(p, 0.2, 0.3);
  const flap = useSeg(p, 0.28, 0.5, 0, -62);
  const papers = useSeg(p, 0.36, 0.56, 30, -18);
  const portal = useSeg(p, 0.58, 0.82);
  const portalX = useSeg(p, 0.58, 0.82, 80, 0);
  const chip = useSeg(p, 0.82, 0.94);

  return (
    <div className="relative h-full">
      {/* The consultant: a contact card, as the portal shows it */}
      <motion.div
        style={{ opacity: card, y: cardY }}
        className="absolute left-0 top-[2%] w-[48%] max-w-[300px] overflow-hidden rounded-[16px] bg-white text-[#111827] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
      >
        <div className="h-10 bg-gradient-to-r from-[#1D3F79] to-[#3D71C9]" />
        <div className="-mt-6 px-4 pb-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#72C43C] to-[#3D8A1E] font-[family-name:var(--font-grotesk)] text-[1rem] font-bold text-white ring-4 ring-white">
            SA
          </span>
          <p className="mt-2 font-[family-name:var(--font-grotesk)] text-[1.05rem] font-semibold leading-tight">Your SnZ consultant</p>
          <p className="text-[0.75rem] text-[#4B5563]">Study abroad advisor · Vilnius</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <motion.span
              style={{ opacity: assigned }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E1] px-2.5 py-1 text-[0.72rem] font-semibold text-[#2F6B12]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F6B12]" /> Assigned to you
            </motion.span>
            <span className="flex gap-1.5" aria-hidden>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#F3F4F6]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#1D3F79]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M4 5h16v11H8l-4 4z" />
                </svg>
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#F3F4F6]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#1D3F79]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M6.6 3.5l2.6 3.4-1.7 2.2a12 12 0 007.4 7.4l2.2-1.7 3.4 2.6-1.4 2.9C11.6 20.6 3.4 12.4 3.7 5z" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* The student file: a manila folder with the shortlist inside */}
      <div className="absolute bottom-[3%] left-[2%] w-[54%] max-w-[330px]" style={{ perspective: 800 }}>
        <div className="relative aspect-[4/3]">
          {/* back panel + tab */}
          <div className="absolute -top-[8%] left-[6%] h-[12%] w-[34%] rounded-t-[6px] bg-gradient-to-b from-[#D9B56B] to-[#CFA95C]" />
          <div className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#D7B266] to-[#C9A255] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.8)]" />
          {/* the shortlist sheet */}
          <motion.div style={{ y: papers }} className="bp-doc absolute inset-x-[7%] top-[5%] h-[86%] px-3.5 py-3">
            <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-1.5">
              <span className="flex items-center gap-1.5">
                <Image src="/brand/snz-mark.png" alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-full" />
                <span className="text-[0.72rem] font-bold tracking-wide">Programme shortlist</span>
              </span>
              <span className="text-[0.72rem] text-[#6B7280]">Draft 1</span>
            </div>
            <ol className="mt-2 space-y-1.5">
              {SHORTLIST.map((r, i) => (
                <li key={r.place} className="flex items-start gap-2">
                  <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#1D3F79] text-[0.72rem] font-bold leading-none text-white">{i + 1}</span>
                  <span className="leading-tight">
                    <span className="block text-[0.72rem] font-semibold">{r.field}</span>
                    <span className="block text-[0.72rem] text-[#4B5563]">{r.place}</span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
          {/* paper clip */}
          <svg viewBox="0 0 20 52" className="absolute -top-[10%] left-[44%] z-10 h-[28%] text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M6 14v26a6 6 0 0012 0V10a8 8 0 00-16 0v30" />
          </svg>
          {/* front panel */}
          <motion.div
            style={{ rotateX: flap, transformOrigin: "50% 100%" }}
            className="absolute inset-x-0 bottom-0 h-[74%] rounded-[6px] bg-gradient-to-b from-[#EBCB84] to-[#DDB96C] shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.55)]"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-white/50" />
            <span className="absolute bottom-3 left-3 rounded-[3px] bg-[#FFFDF7] px-2.5 py-1 text-[0.72rem] font-semibold tracking-wide text-[#3F3420] shadow-sm">
              STUDENT FILE
            </span>
          </motion.div>
        </div>
      </div>

      {/* Into the portal: the real screen, in a browser window */}
      <motion.div
        style={{ opacity: portal, x: portalX }}
        className="absolute right-0 top-[24%] w-[52%] overflow-hidden rounded-[10px] bg-[#E5E7EB] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-black/10"
      >
        <div className="flex items-center gap-1.5 bg-[#F3F4F6] px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          <span className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 text-[0.72rem] text-[#4B5563]">portal.snzventures.com</span>
        </div>
        <div className="relative aspect-[16/11]">
          <Image src="/images/portal-journey.webp" alt="" fill sizes="320px" className="object-cover object-left-top" />
        </div>
      </motion.div>
      <motion.p
        style={{ opacity: chip }}
        className="absolute bottom-[8%] right-[2%] flex items-center gap-2 rounded-full bg-[var(--color-runway)] px-4 py-2 text-[0.85rem] font-semibold text-[var(--bp-on-accent)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
      >
        ✓ Added to your portal
      </motion.p>
    </div>
  );
}

/* ================================================================== 3 APPLY */

const DOCS: { label: string; kind: "passport" | "paper" | "cv"; from: [number, number] }[] = [
  { label: "Passport", kind: "passport", from: [-150, -90] },
  { label: "Transcript", kind: "paper", from: [160, -120] },
  { label: "Statement of purpose", kind: "paper", from: [-170, 60] },
  { label: "CV", kind: "cv", from: [180, 40] },
];

/** The application, with values that "type" in as each section completes. */
const FIELDS = [
  { label: "Full name", value: "Your name" },
  { label: "Previous study", value: "High school diploma" },
  { label: "Programme", value: studyFields[1].examples.split(",")[0] },
  { label: "Statement of purpose", value: "Attached, 2 pages" },
  { label: "References", value: "2 attached" },
];

export function SceneApply({ p }: P) {
  const bars = [0, 1, 2, 3, 4].map((i) => useSeg(p, 0.05 + i * 0.08, 0.15 + i * 0.08));
  const clips = bars.map((b) => useTransform(b, (v) => `inset(0 ${100 - v * 100}% 0 0)`));
  const stamp = useSeg(p, 0.82, 0.9);
  const stampScale = useSeg(p, 0.82, 0.9, 2.4, 1);

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="bp-doc relative w-[min(66%,360px)] px-5 pb-5 pt-4">
        <div className="flex items-start justify-between border-b-2 border-[#1D3F79] pb-2">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#1D3F79]">Application for admission</p>
            <p className="font-[family-name:var(--font-grotesk)] text-[1.05rem] font-semibold leading-tight">Undergraduate programme</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#1D3F79] text-[#1D3F79]" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9l9-5 9 5-9 5z" />
              <path d="M7 11v5c3 2 7 2 10 0v-5" />
            </svg>
          </span>
        </div>
        <dl className="mt-3 space-y-2">
          {FIELDS.map((f, i) => (
            <div key={f.label} className="grid grid-cols-[42%_58%] items-end gap-2 border-b border-dotted border-[#C9C3B3] pb-1">
              <dt className="text-[0.72rem] text-[#4B5563]">{f.label}</dt>
              <motion.dd style={{ clipPath: clips[i] }} className="truncate font-[family-name:var(--font-grotesk)] text-[0.85rem] font-semibold text-[#1D3F79]">
                {f.value}
              </motion.dd>
            </div>
          ))}
        </dl>
        {/* signature row: the stamp lands here, clear of the answers */}
        <div className="mt-3 flex items-end justify-between">
          <span className="leading-tight">
            <svg viewBox="0 0 120 30" className="h-6 w-20 text-[#1D3F79]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M4 22c8-14 14-16 16-8s-6 10-2 2 12-12 16-4 4 8 10 0 10-10 14-2" />
            </svg>
            <span className="block text-[0.72rem] text-[#6B7280]">Applicant signature</span>
          </span>
          <motion.span
            style={{ opacity: stamp, scale: stampScale, rotate: -10 }}
            className="bp-stamp bp-stamp-ok !text-[0.95rem]"
          >
            Submitted
          </motion.span>
        </div>
      </div>

      {DOCS.map((d, i) => (
        <DocChip key={d.label} p={p} i={i} {...d} />
      ))}
    </div>
  );
}

function DocChip({ p, i, label, kind, from }: { p: MotionValue<number>; i: number; label: string; kind: "passport" | "paper" | "cv"; from: [number, number] }) {
  const a = 0.15 + i * 0.1;
  const x = useSeg(p, a, a + 0.25, from[0], 0);
  const y = useSeg(p, a, a + 0.25, from[1], 120);
  const o = useTransform(p, [a - 0.05, a, a + 0.22, a + 0.27], [0, 1, 1, 0]);
  const s = useSeg(p, a, a + 0.25, 1, 0.5);
  return (
    <motion.div style={{ x, y, opacity: o, scale: s, rotate: (i % 2 ? 1 : -1) * 6 }} className="absolute left-1/2 top-1/2 -ml-[38px] -mt-[48px] w-[76px]">
      {kind === "passport" ? (
        <div className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-[4px] bg-gradient-to-br from-[#1D3F79] to-[#0D1D3C] text-[#E8C872] shadow-[0_14px_24px_-10px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="20" cy="20" r="14" />
            <path d="M6 20h28M20 6c5 5 5 23 0 28M20 6c-5 5-5 23 0 28" />
          </svg>
          <span className="text-[0.72rem] font-bold tracking-[0.12em]">PASSPORT</span>
        </div>
      ) : (
        <div className="bp-doc aspect-[3/4] p-1.5">
          {kind === "cv" && <span className="mb-1 block h-4 w-3.5 rounded-[2px] bg-[#C9D1DE]" />}
          {[90, 70, 80, 60, 75].map((w, k) => (
            <span key={k} className="mt-1 block h-[2px] rounded bg-[#C9C3B3]" style={{ width: `${w}%` }} />
          ))}
          <span className="mt-1.5 block truncate text-[0.72rem] font-semibold leading-tight text-[#1C2030]">{label}</span>
        </div>
      )}
    </motion.div>
  );
}

/* =============================================================== 4 APPROVAL */

export function SceneApproval({ p }: P) {
  const flap = useSeg(p, 0.08, 0.28, 0, 180);
  const letterY = useTransform(p, [0.3, 0.62], ["0%", "-58%"], { clamp: true });
  /*
    LAYER ORDER FOLLOWS THE FLAP. Closed, the flap sits in front of
    everything; once it swings past vertical it is behind the letter, which is
    how a real envelope works, and the reason the letter's text used to vanish
    under a triangle as it rose.
  */
  const flapZ = useTransform(flap, (v) => (v > 90 ? 1 : 4));
  const flapShade = useTransform(flap, [0, 90, 180], ["#E7DFCB", "#DCD3BC", "#CEC4AA"]);
  const stamp = useSeg(p, 0.68, 0.76);
  const stampScale = useSeg(p, 0.68, 0.76, 2.4, 1);
  const glow = useSeg(p, 0.7, 1, 0.4, 1.3);
  const glowO = useTransform(p, [0.7, 0.85, 1], [0, 0.7, 0.35]);

  return (
    <div className="relative flex h-full items-end justify-center pb-[6%]">
      <motion.div
        style={{ scale: glow, opacity: glowO }}
        className="absolute left-1/2 top-[18%] h-[60%] w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(114,196,60,0.45),transparent)]"
      />
      <div className="relative aspect-[3/2] w-[min(80%,420px)]" style={{ perspective: 800 }}>
        {/* back of envelope */}
        <div className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#D9D0BA] to-[#CBC1A8] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.85)]" />
        {/* the letter */}
        <motion.div style={{ y: letterY, zIndex: 2 }} className="bp-doc absolute inset-x-[6%] top-[5%] h-[90%] px-4 py-3">
          <div className="flex items-center gap-2 border-b border-[#E5E0D3] pb-1.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#7A1F2B] text-[#F3D9A4]" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-5 9 5-9 5z" />
                <path d="M7 11v5c3 2 7 2 10 0v-5" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#7A1F2B]">Admissions Office</span>
              <span className="block text-[0.72rem] text-[#6B7280]">Offer of admission</span>
            </span>
          </div>
          <p className="mt-2 text-[0.75rem] leading-snug">Dear Student,</p>
          <p className="mt-1 text-[0.75rem] leading-snug text-[#374151]">
            We are pleased to offer you a place on the programme below, starting in the next intake.
          </p>
          <p className="mt-1.5 text-[0.75rem] font-semibold">BSc Computer Science</p>
          <svg viewBox="0 0 120 30" className="mt-1 h-6 w-24 text-[#1D3F79]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M4 22c8-14 14-16 16-8s-6 10-2 2 12-12 16-4 4 8 10 0 10-10 14-2 8 6 14-2 12-4 20 2" />
          </svg>
          <p className="text-[0.72rem] text-[#6B7280]">Director of Admissions</p>
          <motion.span style={{ opacity: stamp, scale: stampScale, rotate: -12 }} className="bp-stamp bp-stamp-ok absolute bottom-3 right-3 !text-[1rem]">
            Accepted
          </motion.span>
        </motion.div>
        {/* front pocket, with address and postage */}
        <div className="absolute inset-x-0 bottom-0 z-[3] h-[62%] overflow-hidden rounded-b-[6px]">
          <svg viewBox="0 0 300 124" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="env-front" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F1EADA" />
                <stop offset="1" stopColor="#E4DCC6" />
              </linearGradient>
            </defs>
            <path d="M0 0 L150 70 L300 0 V124 H0z" fill="url(#env-front)" />
            <path d="M0 124 L150 60 L300 124" fill="none" stroke="#D4CAB0" strokeWidth="1.2" />
          </svg>
          <div className="absolute bottom-[14%] left-[8%] space-y-1" aria-hidden>
            <span className="block h-[3px] w-24 rounded bg-[#B9AE92]" />
            <span className="block h-[3px] w-20 rounded bg-[#B9AE92]" />
            <span className="block h-[3px] w-16 rounded bg-[#B9AE92]" />
          </div>
          <span className="absolute bottom-[12%] right-[7%] grid h-[34%] w-[13%] place-items-center rounded-[2px] border-2 border-dashed border-[#B9AE92] bg-[#3D71C9] text-white" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor">
              <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
            </svg>
          </span>
        </div>
        {/* flap */}
        <motion.div style={{ rotateX: flap, transformOrigin: "50% 0%", zIndex: flapZ }} className="absolute inset-x-0 top-0 h-[55%]">
          <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <motion.path d="M0 0 H300 L150 110z" style={{ fill: flapShade }} />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* =================================================================== 5 VISA */

export function SceneVisa({ p }: P) {
  const cover = useSeg(p, 0.08, 0.38, 0, -168);
  const checks = [0, 1, 2].map((i) => useSeg(p, 0.4 + i * 0.07, 0.48 + i * 0.07));
  const checkX = checks.map((c) => useTransform(c, [0, 1], [20, 0]));
  const stamp = useSeg(p, 0.66, 0.72);
  const stampScale = useSeg(p, 0.66, 0.72, 2.6, 1);
  const shake = useTransform(p, [0.72, 0.735, 0.75, 0.765, 0.78], [0, -3, 3, -1, 0]);

  return (
    <div className="relative flex h-full items-center justify-center gap-5">
      {/* The booklet sits right of centre: when the cover swings open it
          needs its own width of room on the left, inside the stage. */}
      <div className="relative ml-[min(30%,200px)] aspect-[3/4.2] w-[min(30%,200px)]" style={{ perspective: 900 }}>
        {/* the visa page, with the sticker */}
        <motion.div style={{ x: shake }} className="bp-doc absolute inset-0 rounded-r-[8px] rounded-l-[2px] p-[7%]">
          <div className="bp-guilloche relative h-[62%] overflow-hidden rounded-[4px] border border-[#A7C4B5] p-[6%]">
            <p className="text-[0.72rem] font-bold tracking-[0.18em] text-[#1E5F4C]">VISA</p>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[0.72rem] leading-tight text-[#24443A]">
              <span>Type</span>
              <span className="font-semibold">D · Study</span>
              <span>Entries</span>
              <span className="font-semibold">Multiple</span>
            </div>
            <span className="absolute bottom-[8%] right-[6%] h-[34%] w-[26%] rounded-[2px] bg-[#C9D3CC]" aria-hidden />
          </div>
          {/* machine readable zone */}
          <p className="mt-[5%] whitespace-nowrap font-mono text-[0.72rem] leading-[1.3] tracking-[0.02em] text-[#3A3F4B]" aria-hidden>
            V&lt;EU&lt;STUDENT&lt;&lt;
            <br />
            D&lt;STUDY&lt;&lt;&lt;&lt;
          </p>
          <motion.div
            style={{ opacity: stamp, scale: stampScale, rotate: -10 }}
            className="absolute bottom-[4%] right-[4%] grid h-[68px] w-[68px] place-items-center rounded-full border-[3px] border-[#1D4ED8] text-center font-mono text-[0.72rem] font-bold leading-tight text-[#1D4ED8] mix-blend-multiply"
          >
            VISA
            <br />
            ISSUED
          </motion.div>
        </motion.div>
        {/* cover: two faces, so once it swings open the inside of the
            booklet is what you see on the left. */}
        <motion.div style={{ rotateY: cover, transformOrigin: "0% 50%", transformStyle: "preserve-3d" }} className="absolute inset-0">
          <div
            className="absolute inset-0 flex flex-col items-center justify-between rounded-r-[8px] rounded-l-[2px] bg-gradient-to-br from-[#1E3A70] via-[#16305D] to-[#0B1A38] py-[14%] text-[#E3C77A] shadow-[inset_5px_0_0_rgba(0,0,0,0.3),0_30px_50px_-20px_rgba(0,0,0,0.9)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-[0.72rem] font-semibold tracking-[0.3em]">TRAVEL DOCUMENT</span>
            <svg viewBox="0 0 48 48" className="h-[26%] w-[26%]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <circle cx="24" cy="24" r="17" />
              <path d="M7 24h34M24 7c6 6 6 28 0 34M24 7c-6 6-6 28 0 34" />
              <path d="M10 15h28M10 33h28" />
            </svg>
            <span className="font-[family-name:var(--font-grotesk)] text-[0.95rem] font-bold tracking-[0.32em]">PASSPORT</span>
            {/* biometric chip mark */}
            <svg viewBox="0 0 24 16" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <rect x="1" y="1" width="22" height="14" rx="3" />
              <circle cx="12" cy="8" r="3" />
            </svg>
          </div>
          <div className="bp-doc absolute inset-0 rounded-l-[8px] rounded-r-[2px] p-[8%]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="flex h-full flex-col gap-[5%]">
              <span className="aspect-[3/4] w-[34%] rounded-[2px] bg-[#D6DBE3]" />
              {[80, 60, 70, 50].map((w, i) => (
                <span key={i} className="block h-[3px] rounded bg-[#D4CAB0]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <ul className="space-y-2.5">
        {["Documents checked", "Interview prepared", "File submitted"].map((l, i) => (
          <motion.li
            key={l}
            style={{ opacity: checks[i], x: checkX[i] }}
            className="bp-pass-dark flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[0.85rem] font-semibold text-[var(--bp-strong)]"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-runway)] text-[0.72rem] text-[var(--bp-on-accent)]">✓</span>
            {l}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* =================================================================== 6 FEES */

const FEES = ["Tuition deposit", "Visa application fee", "Health insurance", "Accommodation deposit"];

export function SceneFees({ p }: P) {
  const reveal = useSeg(p, 0.04, 0.6, 100, 0);
  const clip = useTransform(reveal, (v) => `inset(0 0 ${v}% 0)`);
  const ticks = FEES.map((_, i) => useSeg(p, 0.2 + i * 0.1, 0.26 + i * 0.1));
  const stamp = useSeg(p, 0.7, 0.78);
  const stampScale = useSeg(p, 0.7, 0.78, 2.4, 1);

  return (
    <div className="relative flex h-full items-start justify-center pt-[3%]">
      {/* printer slot */}
      <div className="absolute left-1/2 top-[1%] h-3.5 w-[min(68%,340px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#05070D] to-[#1A2036] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.08)]" />
      <motion.div
        style={{ clipPath: clip }}
        className="bp-doc bp-doc-thermal relative mt-2 w-[min(60%,300px)] rounded-none px-5 pb-16 pt-5 font-mono text-[0.78rem] [mask:conic-gradient(from_-45deg_at_bottom,#0000,#000_1deg_89deg,#0000_90deg)_50%/14px_100%]"
      >
        <div className="flex flex-col items-center">
          <Image src="/brand/snz-mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full grayscale" />
          <p className="mt-1 text-center font-bold tracking-[0.2em]">SNZ VENTURES</p>
          <p className="text-center text-[0.72rem] text-[#4B5563]">Payment receipt · Vilnius</p>
        </div>
        <div className="my-3 border-t border-dashed border-[#9CA3AF]" />
        <ul className="space-y-2.5">
          {FEES.map((f, i) => (
            <li key={f} className="flex items-center justify-between gap-2">
              <span>{f}</span>
              <motion.span style={{ opacity: ticks[i] }} className="font-bold text-[#0E7A57]">PAID</motion.span>
            </li>
          ))}
        </ul>
        <div className="my-3 border-t border-dashed border-[#9CA3AF]" />
        <p className="flex justify-between font-bold">
          <span>Status</span>
          <span>All settled</span>
        </p>
        <p className="mt-1 text-[0.72rem] text-[#4B5563]">A copy is stored in your portal.</p>
        <div className="bp-barcode mt-3 h-7 text-[#1F2937]" aria-hidden />
        <motion.span style={{ opacity: stamp, scale: stampScale, rotate: -16 }} className="bp-stamp bp-stamp-go absolute bottom-6 right-5 !text-[1.1rem]">
          Paid
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ==================================================================== 7 FLY */

const FLY_ARC = "M40 300 C 160 290, 260 200, 330 120 S 460 10, 520 -10";

export function SceneFly({ p }: P) {
  const dest = studyDestinations[0];
  const stubX = useSeg(p, 0.1, 0.32, 0, 46);
  const stubR = useSeg(p, 0.1, 0.32, 0, 9);
  const pass = useSeg(p, 0.32, 0.6, 1, 0.88);
  const passY = useSeg(p, 0.32, 0.6, 0, 40);
  const passO = useSeg(p, 0.32, 0.6, 1, 1);
  const draw = useSeg(p, 0.36, 1);

  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useMotionValueEvent(draw, "change", (v) => place(v));
  // Place once on mount, so a scene that starts finished (reduced motion) has its plane.
  const placed = useRef(false);
  function place(v: number) {
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!path || !plane) return;
    const len = path.getTotalLength();
    const a = path.getPointAtLength(v * len);
    const b = path.getPointAtLength(Math.min(len, v * len + 1));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const s = 0.7 + v * 0.9;
    plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang}) scale(${s})`);
    plane.setAttribute("opacity", v > 0.001 ? "1" : "0");
  }

  return (
    <div className="relative h-full">
      <motion.div style={{ scale: pass, y: passY, opacity: passO }} className="absolute inset-x-[2%] top-[22%]">
        <div className="bp-ticket relative grid grid-cols-[70%_30%] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.85)]" style={{ ["--tear" as string]: "70%" }}>
          <div className="bp-ticket-tear" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="bp-mono !text-[0.72rem]">Boarding pass</p>
              <Image src="/brand/snz-mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full" />
            </div>
            <div className="mt-3 flex items-end gap-4">
              <div>
                <p className="bp-mono !text-[0.72rem]">From</p>
                <p className="font-[family-name:var(--font-grotesk)] text-[1.8rem] font-bold leading-none">HOME</p>
              </div>
              <svg viewBox="0 0 24 24" className="mb-1 h-5 w-5 text-[#3D71C9]" fill="currentColor" aria-hidden>
                <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
              </svg>
              <div>
                <p className="bp-mono !text-[0.72rem]">To</p>
                <p className="font-[family-name:var(--font-grotesk)] text-[1.8rem] font-bold leading-none">{dest.airport}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2">
              {[
                ["Passenger", "You"],
                ["Gate", "SNZ"],
                ["Boarding", "Now"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="bp-mono !text-[0.72rem]">{k}</dt>
                  <dd className="text-[0.9rem] font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <motion.div style={{ x: stubX, rotate: stubR }} className="flex flex-col justify-between p-4">
            <p className="bp-mono !text-[0.72rem]">Seat</p>
            <p className="font-[family-name:var(--font-grotesk)] text-[1.6rem] font-bold">1A</p>
            <span className="bp-barcode h-8 text-[var(--color-ticket-ink)]" aria-hidden />
          </motion.div>
        </div>
      </motion.div>

      <svg viewBox="0 0 520 400" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path d={FLY_ARC} fill="none" stroke="rgb(170 190 230 / 0.16)" strokeDasharray="3 7" strokeWidth="1.2" />
        <motion.path ref={pathRef} d={FLY_ARC} fill="none" stroke="#72C43C" strokeWidth="2.2" strokeLinecap="round" style={{ pathLength: draw }} />
        <g
          ref={(el) => {
            planeRef.current = el;
            if (el && !placed.current) {
              placed.current = true;
              requestAnimationFrame(() => place(draw.get()));
            }
          }}
          opacity="0"
          fill="#F6F3EC"
        >
          <g transform="translate(-12 -12)">
            <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export const SCENES = [SceneContact, SceneConsultant, SceneApply, SceneApproval, SceneVisa, SceneFees, SceneFly];
