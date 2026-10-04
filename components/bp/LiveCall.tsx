"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * THE LIVE CONSULTATION — the hero's photograph, presented as a video call.
 *
 * The first step of the journey is a free consultation call, so the real
 * photograph of students (licensed, in the image manifest) is framed as the
 * call itself: a LIVE badge with a running timer, a voice waveform, the
 * consultant's picture-in-picture tile, and call controls. The photo drifts
 * slowly (Ken Burns) so it feels like video rather than a still.
 *
 * Illustrative framing only — no name, no claim that this is a recorded
 * session. The timer starts at 00:00 on both server and client and counts
 * after mount, so there is no hydration mismatch.
 */
export function LiveCall({ active = true }: { active?: boolean }) {
  const reduce = useReduced();
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (reduce || !active) return;
    const t = window.setInterval(() => setSecs((s) => (s + 1) % 3600), 1000);
    return () => window.clearInterval(t);
  }, [reduce, active]);

  const time = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="relative overflow-hidden rounded-[18px] bg-[#04070F] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
      <div className="relative aspect-[4/5.2]">
        {/* the "video" */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1.12, 1.22, 1.12], x: ["0%", "-3%", "0%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/path-study.webp"
            alt="Students on a video consultation, laughing together around a laptop"
            fill
            sizes="200px"
            className="object-cover object-[62%_50%]"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-1 p-2">
          <span className="flex items-center gap-1 rounded-full bg-[#C9262C] px-1.5 py-0.5 text-[0.72rem] font-bold leading-none text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
            LIVE
          </span>
          <span className="rounded-full bg-black/45 px-1.5 py-0.5 font-mono text-[0.72rem] leading-none text-white backdrop-blur" suppressHydrationWarning>
            {time}
          </span>
        </div>

        {/* consultant picture-in-picture */}
        <div className="absolute right-2 top-9 w-[30%] overflow-hidden rounded-[8px] bg-[#1F2B52] ring-1 ring-white/25">
          <svg viewBox="0 0 48 60" className="block w-full" fill="none" stroke="#A9C9FA" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <rect width="48" height="60" fill="#1F2B52" stroke="none" />
            <circle cx="24" cy="23" r="8" />
            <path d="M16 20c3-6 13-7 16 0" />
            <path d="M8 60c1.5-11 8-17 16-17s14.5 6 16 17" />
          </svg>
        </div>

        {/* caption + waveform + controls */}
        <div className="absolute inset-x-0 bottom-0 p-2">
          <div className="flex items-end justify-between gap-2">
            <span className="min-w-0 leading-tight text-white">
              <span className="block truncate text-[0.72rem] font-bold">Free consultation</span>
              <span className="block truncate text-[0.72rem] text-white/80">with SnZ</span>
            </span>
            <span className="flex h-4 items-end gap-[2px]" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-[#72C43C]"
                  animate={reduce ? { height: "50%" } : { height: ["25%", "100%", "40%", "80%", "25%"] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                  style={{ height: "50%" }}
                />
              ))}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-2.5 border-t border-white/15 pt-2" aria-hidden>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 backdrop-blur">
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-white" fill="currentColor">
                <path d="M8 1a2.5 2.5 0 00-2.5 2.5v4a2.5 2.5 0 005 0v-4A2.5 2.5 0 008 1zM3.5 7.5a.75.75 0 011.5 0 3 3 0 006 0 .75.75 0 011.5 0 4.5 4.5 0 01-3.75 4.43V14h-1.5v-2.07A4.5 4.5 0 013.5 7.5z" />
              </svg>
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="currentColor">
                <path d="M3 7a2 2 0 012-2h9a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zm14 3l4-2.5v9L17 14z" />
              </svg>
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E5484D]">
              <svg viewBox="0 0 24 24" className="h-3 w-3 rotate-[135deg] text-white" fill="currentColor">
                <path d="M6.6 3.5l2.6 3.4-1.7 2.2a12 12 0 007.4 7.4l2.2-1.7 3.4 2.6-1.4 2.9C11.6 20.6 3.4 12.4 3.7 5z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
