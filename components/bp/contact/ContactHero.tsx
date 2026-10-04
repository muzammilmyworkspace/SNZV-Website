"use client";

import { motion } from "motion/react";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { useReduced } from "@/components/bp/useReduced";
import { PageHero } from "../page/PageHero";

/**
 * Contact hero: the promise on the left, four ways to reach a person on the
 * right — each a "channel" card that lifts and lights on hover. WhatsApp
 * first, because it is how most students actually reach out; the email is
 * company.contact.email.
 */
export function ContactHero() {
  const reduce = useReduced();
  const wa = `https://wa.me/${company.contact.whatsapp}?text=${encodeURIComponent(
    "Hi SnZ Ventures, I'd like to study abroad and would like to talk to a counsellor."
  )}`;

  const channels = [
    {
      k: "WhatsApp",
      v: company.contact.whatsappDisplay,
      note: "Message or call. The fastest way to reach a counsellor.",
      href: wa,
      ext: true,
      onClick: () => analytics.whatsapp("contact_hero"),
      icon: (
        <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.2c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-2.9-.7-2.4-1-4-3.5-4.1-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.8c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.7 1.1 1.5 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.5.3 0 .2 0 .6-.2 1z" />
      ),
    },
    {
      k: "Email",
      v: company.contact.email,
      note: "For student queries",
      href: `mailto:${company.contact.email}`,
      onClick: () => analytics.ctaClick("Email", "contact_hero"),
      icon: <path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
    },
    {
      k: "Student portal",
      v: "portal.snzventures.com",
      note: "Already a student? Log in",
      href: company.portalUrl,
      ext: true,
      onClick: () => analytics.ctaClick("Portal login", "contact_hero"),
      icon: (
        <>
          <circle cx="12" cy="8.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ),
    },
  ];

  return (
    <PageHero
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Contact", href: "/contact" },
      ]}
      eyebrow="Talk to a consultant"
      lines={[{ text: "Tell us where" }, { text: "you want to go." }, { text: "We'll map the route.", mark: true }]}
      lede="You don't need a plan yet. You need to know whether the one you're considering is realistic, and what it would actually involve. The first conversation is free."
      visual={
        <ul className="grid gap-3 sm:grid-cols-2">
          {channels.map((c, i) => (
            <motion.li
              key={c.k}
              className={i === 0 ? "sm:col-span-2" : undefined}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={c.href}
                target={c.ext ? "_blank" : undefined}
                rel={c.ext ? "noopener noreferrer" : undefined}
                onClick={c.onClick}
                className="bp-pass-dark group flex h-full flex-col p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-runway)]"
              >
                <span className="flex items-center justify-between">
                  <span
                    className={
                      i === 0
                        ? "grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-[#062E16]"
                        : "grid h-11 w-11 place-items-center rounded-full bg-[var(--bp-chip)] text-[var(--color-runway)] transition-colors group-hover:bg-[var(--color-runway)] group-hover:text-[var(--bp-on-accent)]"
                    }
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      {c.icon}
                    </svg>
                  </span>
                  <span className="bp-mono text-[var(--bp-faint)]">{c.k}</span>
                </span>
                <span className="mt-6 break-all font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold text-[var(--bp-strong)]">{c.v}</span>
                <span className="mt-1 text-[0.9rem] text-[var(--bp-muted)]">{c.note}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      }
    />
  );
}
