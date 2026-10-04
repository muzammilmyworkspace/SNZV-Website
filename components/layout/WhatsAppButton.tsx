"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";

/**
 * FLOATING WHATSAPP.
 *
 * The fast exit for somebody with one question — so it is there from the first
 * screen, not after a scroll. It replaces the old floating consultation pill:
 * the header now carries "Book a Consultation" on every page, and two floating
 * controls in one corner compete for the same thumb.
 *
 * It pulses three times on arrival and then stops. A button that pulses for
 * ever trains the eye to ignore it.
 *
 * It stays on screen everywhere, including over the footer: on short pages
 * (Contact) the footer arrives almost at once, and a button that vanished
 * there read as broken. The footer carries extra bottom padding instead, so
 * the bubble never sits on top of the legal links.
 */

const MESSAGE =
  "Hi SnZ Ventures, I'd like to study abroad and would like to talk to a counsellor.";

export function WhatsAppButton() {
  const [hover, setHover] = useState(false);

  const href = `https://wa.me/${company.contact.whatsapp}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <AnimatePresence>
      {(
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with a counsellor on WhatsApp"
          onClick={() => analytics.whatsapp("floating")}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="bp-wa fixed z-40 flex h-14 items-center rounded-full shadow-[0_18px_40px_-12px_rgba(37,211,102,0.55)]"
          style={{
            right: "max(1rem, env(safe-area-inset-right))",
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <span aria-hidden className="bp-pulse absolute inset-0 rounded-full bg-[#25D366]" />
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.23 8.23 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
          </span>
          <motion.span
            className="relative overflow-hidden whitespace-nowrap font-[family-name:var(--font-grotesk)] text-[0.92rem] font-semibold"
            initial={false}
            animate={{ width: hover ? "auto" : 0, paddingRight: hover ? 20 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Chat with a counsellor
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
