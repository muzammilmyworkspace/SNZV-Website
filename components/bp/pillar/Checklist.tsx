"use client";

import { motion } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";

/**
 * "What it takes", as a checklist on paper that ticks itself off one line at
 * a time as it scrolls into view. Under reduced motion every box is ticked.
 */
export function Checklist({ items }: { items: string[] }) {
  const reduce = useReduced();
  return (
    <div className="bp-paper p-6 shadow-[0_40px_70px_-30px_rgba(0,0,0,0.8)] sm:p-8">
      <p className="bp-mono">Your checklist</p>
      <ul className="mt-5 space-y-4">
        {items.map((it, i) => (
          <motion.li
            key={it}
            className="flex items-start gap-3.5 border-b border-dashed border-[rgb(18_23_38/0.15)] pb-4 last:border-b-0 last:pb-0"
            initial={reduce ? false : "off"}
            whileInView="on"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ delay: i * 0.18 }}
          >
            <span className="relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-[#1D3F79]">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#1D3F79]" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <motion.path
                  d="M3 8.5l3.2 3L13 4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{ off: { pathLength: 0 }, on: { pathLength: 1 } }}
                  transition={{ delay: i * 0.18 + 0.1, duration: 0.4 }}
                />
              </svg>
            </span>
            <span className="text-[1rem] leading-relaxed text-[var(--color-ticket-ink)]">{it}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
