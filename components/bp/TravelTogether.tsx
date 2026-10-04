"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";
import { Arrow } from "./Glyphs";

/**
 * TRAVEL TOGETHER — studying abroad with your spouse.
 *
 * Added at the owner's request (2026-10-04), placed high on the homepage so
 * married students see early that they do not have to go alone.
 *
 * Two boarding passes, one for the student and one for the spouse, slide in
 * from opposite sides and lock together on the same flight. Copy is careful:
 * dependant and spouse rules differ by country and by level of study, so the
 * section promises guidance and planning, never a visa outcome, and says so.
 */

const POINTS = [
  { t: "Spouse and dependant visas", b: "We tell you upfront which destinations allow your spouse to join you, and on what conditions, for your level of study." },
  { t: "One file, two applications", b: "Your spouse's documents are prepared alongside yours, so both applications move together." },
  { t: "Work rights explained", b: "Where your spouse is allowed to work, we explain the rules before you choose the country, not after you arrive." },
  { t: "Housing for two", b: "Accommodation, registration and the first weeks planned for both of you." },
];

export function TravelTogether() {
  const reduce = useReduced();
  const pass = (from: number, delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: from, rotate: from > 0 ? 8 : -8 },
          whileInView: { opacity: 1, x: 0, rotate: from > 0 ? 3 : -3 },
          viewport: { once: true, margin: "0px 0px -20% 0px" },
          transition: { delay, type: "spring" as const, stiffness: 70, damping: 15 },
        };

  return (
    <section id="together" aria-labelledby="together-title" className="relative z-10 py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="bp-pass-dark relative overflow-hidden p-5 sm:p-7 lg:p-8">
          {/* soft glow behind the passes */}
          <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(114,196,60,0.16),transparent)]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            <div>
              <p className="bp-eyebrow">Married? Travel together</p>
              <Reveal mask>
                <h2 id="together-title" className="bp-display mt-4 text-[clamp(1.8rem,3.2vw,2.8rem)]">
                  Bring your <span className="bp-mark">spouse</span> with you.
                </h2>
              </Reveal>
              <p className="bp-body mt-3 max-w-xl">
                Studying abroad does not have to mean leaving your partner behind. We plan both journeys as one, so you
                land in Europe together.
              </p>

              <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {POINTS.map((pt, i) => (
                  <motion.li
                    key={pt.t}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                    className="flex gap-3"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-runway)] text-[var(--bp-on-accent)]">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M2.5 6.2l2.3 2.3 4.7-4.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-semibold text-[var(--bp-strong)]">{pt.t}</span>
                      <span className="mt-0.5 block text-[0.85rem] leading-snug text-[var(--bp-muted)]">{pt.b}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/contact#journey" className="bp-btn bp-btn-primary">
                  Plan our move together <Arrow />
                </Link>
              </div>
              <p className="mt-3 max-w-xl text-[0.78rem] leading-relaxed text-[var(--bp-faint)]">
                Spouse and dependant rules differ by country and by level of study, and decisions rest with the
                immigration authorities. We confirm the current rules for your destination before you apply.
              </p>
            </div>

            {/* Two passes, one flight */}
            <div className="relative order-first mx-auto w-full max-w-[420px] py-2 lg:order-none">
              <motion.div {...pass(-120, 0.1)} className="relative z-[2]">
                <TogetherPass n="01" name="You" role="Student" seat="12A" />
              </motion.div>
              <motion.div {...pass(120, 0.3)} className="relative z-[1] mt-4 ml-[10%]">
                <TogetherPass n="02" name="Your spouse" role="Accompanying spouse" seat="12B" />
              </motion.div>
              <motion.span
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.75, type: "spring", stiffness: 260, damping: 14 }}
                className="absolute right-[2%] top-1/2 z-[3] -translate-y-1/2 flex items-center gap-2 rounded-full bg-[var(--color-runway)] px-4 py-2 text-[0.85rem] font-bold text-[var(--bp-on-accent)] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.7)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#E5484D] drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" fill="currentColor" aria-hidden>
                  <path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.4 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.4 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z" />
                </svg>
                Same flight
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TogetherPass({ n, name, role, seat }: { n: string; name: string; role: string; seat: string }) {
  return (
    <div className="bp-ticket relative grid grid-cols-[72%_28%] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]" style={{ ["--tear" as string]: "72%" }}>
      <div className="bp-ticket-tear" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="bp-mono !text-[0.72rem]">Passenger {n}</p>
          <Image src="/brand/snz-mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full" />
        </div>
        <p className="mt-2 font-[family-name:var(--font-grotesk)] text-[1.25rem] font-bold leading-none">{name}</p>
        <p className="mt-1 text-[0.85rem] text-[rgb(18_23_38/0.7)]">{role}</p>
        <div className="mt-3 flex items-end gap-3">
          <span>
            <span className="bp-mono block !text-[0.72rem]">From</span>
            <span className="font-[family-name:var(--font-grotesk)] text-[1.2rem] font-bold">HOME</span>
          </span>
          <svg viewBox="0 0 24 24" className="mb-1.5 h-4 w-4 text-[#3D71C9]" fill="currentColor" aria-hidden>
            <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
          </svg>
          <span>
            <span className="bp-mono block !text-[0.72rem]">To</span>
            <span className="font-[family-name:var(--font-grotesk)] text-[1.2rem] font-bold">EUROPE</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between p-4">
        <span className="bp-mono !text-[0.72rem]">Seat</span>
        <span className="font-[family-name:var(--font-grotesk)] text-[1.6rem] font-bold">{seat}</span>
        <span className="bp-barcode h-8 text-[var(--color-ticket-ink)]" aria-hidden />
      </div>
    </div>
  );
}
