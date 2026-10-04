"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * FAQ — numbered like a checklist, one answer open at a time.
 *
 * Real <button>s with aria-expanded/aria-controls; the answer is in the DOM
 * only while open, and the height animates via motion so nothing jumps.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ol className="mt-10 border-t border-[var(--bp-line)]">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <li key={f.q} className="border-b border-[var(--bp-line)]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center gap-5 py-5 text-left"
            >
              <span className="bp-mono w-8 shrink-0 text-[var(--color-aurora)]">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={cn(
                  "flex-1 font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold tracking-[-0.015em] transition-colors sm:text-[1.3rem]",
                  isOpen ? "text-[var(--bp-strong)]" : "text-[var(--bp-fg)] group-hover:text-[var(--bp-strong)]"
                )}
              >
                {f.q}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500",
                  isOpen
                    ? "rotate-45 border-[var(--color-runway)] bg-[var(--color-runway)] text-[var(--bp-on-accent)]"
                    : "border-[var(--bp-line-strong)]"
                )}
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="bp-body max-w-3xl pb-6 pl-[3.25rem]">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
