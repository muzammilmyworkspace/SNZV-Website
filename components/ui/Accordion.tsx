"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/data/services";

/**
 * FAQ list. Numbered, hairline-ruled, display-serif questions — an index
 * rather than a stack of boxes.
 */
export function FaqAccordion({
  faqs,
  page,
}: {
  faqs: FAQ[];
  page: string;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-white/12">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-p-${i}`;
        const btnId = `${baseId}-b-${i}`;

        return (
          <div key={faq.q} className="border-b border-white/12">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  const next = isOpen ? null : i;
                  setOpen(next);
                  if (next !== null) analytics.faqOpen(faq.q, page);
                }}
                className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8"
              >
                <span className="label num shrink-0 pt-2 text-moss-400/60">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "flex-1 font-display text-[1.28rem] leading-snug tracking-[-0.015em] transition-colors duration-400 sm:text-[1.5rem]",
                    isOpen ? "text-moss-200" : "text-paper group-hover:text-moss-200"
                  )}
                >
                  {faq.q}
                </span>

                <span
                  aria-hidden
                  className={cn(
                    "relative mt-3 h-3 w-3 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    isOpen && "rotate-90"
                  )}
                >
                  <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-moss-400" />
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-moss-400 transition-opacity duration-300",
                      isOpen && "opacity-0"
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pl-[3.1rem] pr-8 text-[0.92rem] leading-[1.7] text-navy-200 sm:pl-[4.4rem]">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
