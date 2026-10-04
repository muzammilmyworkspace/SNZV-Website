"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { studyDestinations } from "@/data/study";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Arrow } from "./Glyphs";
import { enquiryWhatsAppText } from "@/lib/enquiry-message";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";

/**
 * FINAL CALL FOR BOARDING — the closing section and the consultation form.
 *
 * Runway lights converge in perspective toward a boarding pass, and the pass
 * IS the form: ticket boxes for fields, the focused box lit by the blue line.
 * On success the stub "prints" a confirmation.
 *
 * It posts to the same /api/enquiry route as every other form on the site
 * (pathway "study"), so the enquiry is stored first and emailed second — see
 * that route. If the server cannot take it, the visitor is shown WhatsApp and
 * email instead of a success screen for a message nobody received.
 *
 * Analytics get the form id and the pathway. Never a name, email or phone.
 */

const FORM_ID = "final-call";
type Status = "idle" | "sending" | "done" | "error";

export function FinalCall({ compact = false, anchorId = "book" }: { compact?: boolean; anchorId?: string } = {}) {
  const reduce = useReduced();
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /*
    The answers, kept after submit so the success screen can hand the same
    enquiry to WhatsApp. The email goes from the server; the WhatsApp copy is
    sent by the student (one tap), so it reaches the team's phone at once.
    See lib/enquiry-message.ts.
  */
  const [sent, setSent] = useState<Record<string, string> | null>(null);

  const waHref = (a: Record<string, string> | null) =>
    `https://wa.me/${company.contact.whatsapp}?text=${encodeURIComponent(a ? enquiryWhatsAppText(a) : "")}`;

  const onFocus = () => {
    if (started) return;
    setStarted(true);
    analytics.formStart(FORM_ID);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    fd.forEach((v, k) => (answers[k] = String(v)));
    answers.consent = fd.get("consent") ? "yes" : "";

    const next: Record<string, string> = {};
    if (!answers.name?.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(answers.email?.trim() ?? "")) next.email = "Please enter a valid email.";
    if (!answers.consent) next.consent = "Please confirm so we can contact you.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSent(answers);
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway: "study", answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      analytics.formSubmit(FORM_ID, "study");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      aria-labelledby={compact ? undefined : "final-title"}
      aria-label={compact ? "Consultation request" : undefined}
      className={compact ? "relative z-10" : "relative z-10 overflow-hidden pb-12 pt-10 sm:pb-14 sm:pt-14"}
    >
      {/* Runway lights, converging on the pass. */}
      {!compact && (
      <svg aria-hidden viewBox="0 0 1440 700" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] w-full">
        <defs>
          <linearGradient id="rw-fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#72C43C" stopOpacity="0.9" />
            <stop offset="1" stopColor="#72C43C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rw-fade-b" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#6FA6F7" stopOpacity="0.7" />
            <stop offset="1" stopColor="#6FA6F7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M120 700 L700 120" stroke="url(#rw-fade)" strokeWidth="3" strokeDasharray="6 14" className={reduce ? "" : "bp-runway-dash"} />
        <path d="M1320 700 L740 120" stroke="url(#rw-fade)" strokeWidth="3" strokeDasharray="6 14" className={reduce ? "" : "bp-runway-dash"} />
        <path d="M520 700 L712 120" stroke="url(#rw-fade-b)" strokeWidth="1.5" strokeDasharray="20 20" className={reduce ? "" : "bp-runway-dash"} />
        <path d="M920 700 L728 120" stroke="url(#rw-fade-b)" strokeWidth="1.5" strokeDasharray="20 20" className={reduce ? "" : "bp-runway-dash"} />
        <path d="M720 700 L720 120" stroke="url(#rw-fade-b)" strokeWidth="2" strokeDasharray="30 26" className={reduce ? "" : "bp-runway-dash"} />
      </svg>
      )}

      <div className={compact ? "relative" : "relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"}>
        {!compact && (
        <div className="mx-auto max-w-3xl text-center">
          <p className="bp-eyebrow justify-center">Final call for boarding</p>
          <Reveal mask>
            <h2 id="final-title" className="bp-display bp-h2 mt-5">
            Your seat is <span className="bp-mark">waiting.</span>
          </h2>
            </Reveal>
          <p className="bp-lede mx-auto mt-6">
            Tell us where you want to go. A consultant replies personally, and the first conversation is free.
          </p>
        </div>
        )}

        <div id={anchorId} className={compact ? "scroll-mt-28" : "mx-auto mt-14 max-w-4xl scroll-mt-28"}>
          <div className="bp-ticket relative shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]" style={{ ["--tear" as string]: "74%" }}>
            <div className="bp-ticket-tear hidden md:block" />
            <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[74%_26%]">
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {status === "done" ? (
                    <motion.div
                      key="done"
                      role="status"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-6"
                    >
                      <span className="bp-stamp bp-stamp-ok -rotate-6">Checked in</span>
                      <h3 className="mt-6 font-[family-name:var(--font-grotesk)] text-[1.8rem] font-semibold leading-tight tracking-[-0.02em]">
                        You&apos;re on the list.
                      </h3>
                      <p className="mt-3 max-w-md leading-relaxed text-[rgb(18_23_38/0.75)]">
                        Your request has been sent to our team. One last step: send it on WhatsApp too, and a
                        consultant can reply to you there straight away.
                      </p>
                      <a
                        href={waHref(sent)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => analytics.whatsapp("form_success")}
                        className="bp-btn mt-6 bg-[#25D366] text-[#062E16] hover:bg-[#3BE07A]"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                          <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.2c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-2.9-.7-2.4-1-4-3.5-4.1-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.8c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.7 1.1 1.5 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.5.3 0 .2 0 .6-.2 1z" />
                        </svg>
                        Send on WhatsApp
                      </a>
                      <p className="mt-3 text-[0.85rem] text-[rgb(18_23_38/0.6)]">
                        Your details are already written in the message. Just press send.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={submit} onFocus={onFocus} noValidate exit={{ opacity: 0 }}>
                      <p className="bp-mono !text-[0.72rem]">Consultation request · Boarding pass</p>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Box label="Passenger name" name="name" autoComplete="name" required error={errors.name} />
                        <Box label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
                        <Box label="WhatsApp / phone" name="phone" type="tel" autoComplete="tel" />
                        <label className="group block">
                          <span className="bp-mono !text-[0.72rem]">Destination</span>
                          <select
                            name="destination"
                            defaultValue=""
                            className="mt-1.5 block h-12 w-full rounded-lg border-2 border-[rgb(18_23_38/0.14)] bg-white/70 px-3 text-[1rem] font-semibold text-[var(--color-ticket-ink)] outline-none transition-colors focus:border-[#3D71C9]"
                          >
                            <option value="">Not sure yet</option>
                            {studyDestinations.map((d) => (
                              <option key={d.slug} value={d.country}>
                                {d.country} ({d.airport})
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="bp-mono !text-[0.72rem]">Level</span>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {["Bachelor's", "Master's", "PhD", "Not sure yet"].map((l, i) => (
                              <label key={l} className="relative cursor-pointer">
                                {/* The input covers the whole pill, so the real
                                    control is the full-size tap target. */}
                                <input type="radio" name="level" value={l} defaultChecked={i === 0} data-stack className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                                <span className="inline-flex min-h-10 items-center rounded-full border-2 border-[rgb(18_23_38/0.14)] px-4 text-[0.9rem] font-semibold text-[rgb(18_23_38/0.8)] transition-colors peer-checked:border-[#1D3F79] peer-checked:bg-[#1D3F79] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#3D71C9]">
                                  {l}
                                </span>
                              </label>
                            ))}
                          </div>
                        </label>
                      </div>

                      <label className="relative mt-5 flex min-h-11 items-start gap-3 text-[0.88rem] leading-snug text-[rgb(18_23_38/0.78)]">
                        <input
                          type="checkbox"
                          name="consent"
                          data-stack className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-invalid={Boolean(errors.consent)}
                        />
                        <span
                          aria-hidden
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-[rgb(18_23_38/0.35)] text-transparent transition-colors peer-checked:border-[#1D3F79] peer-checked:bg-[#1D3F79] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#3D71C9]"
                        >
                          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6.5l2.5 2.5L10 3.5" />
                          </svg>
                        </span>
                        <span className="relative">
                          SnZ Ventures may contact me about my enquiry. See the{" "}
                          <a href="/legal/privacy-policy" className="underline underline-offset-2">
                            privacy policy
                          </a>
                          .
                        </span>
                      </label>
                      {errors.consent && <p className="mt-2 text-[0.85rem] font-semibold text-[#B42318]">{errors.consent}</p>}

                      {status === "error" && (
                        <p role="alert" className="mt-4 rounded-lg bg-[#FEE4E2] p-3 text-[0.9rem] text-[#7A271A]">
                          We couldn&apos;t send that just now. Send it on{" "}
                          <a className="font-semibold underline" href={waHref(sent)} target="_blank" rel="noopener noreferrer">
                            WhatsApp
                          </a>{" "}
                          or email{" "}
                          <a className="font-semibold underline" href={`mailto:${company.contact.email}`}>
                            {company.contact.email}
                          </a>
                          .
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="bp-btn mt-6 w-full bg-[var(--color-night-900)] text-white hover:bg-[#1D3F79] disabled:opacity-60 sm:w-auto"
                      >
                        {status === "sending" ? "Checking you in…" : "Book my free consultation"} <Arrow />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* The stub */}
              <div className="flex flex-row items-center justify-between gap-4 border-t-2 border-dashed border-[rgb(18_23_38/0.18)] p-6 md:flex-col md:items-stretch md:border-t-0 md:p-7">
                <div>
                  <p className="bp-mono !text-[0.72rem]">Gate</p>
                  <p className="font-[family-name:var(--font-grotesk)] text-[2rem] font-bold leading-none">SNZ</p>
                </div>
                <div>
                  <p className="bp-mono !text-[0.72rem]">Status</p>
                  <p className={cn("font-[family-name:var(--font-grotesk)] text-[1.15rem] font-bold", status === "done" ? "text-[#0E8A63]" : "text-[#1D3F79]")}>
                    {status === "done" ? "Checked in" : "Boarding"}
                  </p>
                </div>
                <span className="bp-barcode hidden h-12 text-[var(--color-ticket-ink)] md:block" aria-hidden />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[0.95rem] text-[var(--bp-muted)]">
            Prefer to talk now?{" "}
            <a
              href={`https://wa.me/${company.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.whatsapp("final-call")}
              className="font-semibold text-[var(--bp-strong)] underline decoration-[var(--color-runway)] underline-offset-4"
            >
              WhatsApp {company.contact.whatsappDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/** False on the server and during hydration, true once mounted in the browser. */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function Box({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `fc-${name}`;
  const mounted = useMounted();
  const fieldClass =
    "mt-1.5 block h-12 w-full rounded-lg border-2 border-[rgb(18_23_38/0.14)] bg-white/70 px-3 text-[1rem] font-semibold text-[var(--color-ticket-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[rgb(18_23_38/0.4)] focus:border-[#3D71C9] focus:shadow-[0_0_0_4px_rgba(61,113,201,0.15)] aria-[invalid=true]:border-[#B42318]";
  return (
    <div>
      <label htmlFor={id} className="bp-mono !text-[0.72rem]">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {/*
        THE TEXT FIELD EXISTS ONLY AFTER HYDRATION.

        Password-manager extensions (LastPass in particular) inject their own
        icon node next to every text field as soon as the HTML arrives, which
        is before React hydrates. React then finds a node it never rendered,
        reports a hydration mismatch, and throws away the server tree to
        re-render the whole page on the client. That client re-render is also
        what produces the "Encountered a script tag" warning from the theme
        script in app/layout.tsx.

        `data-lpignore` was tried and is not honoured by every LastPass
        version. So the server sends an identical-looking empty box instead of
        an input: there is nothing for an extension to attach to before
        hydration, and the real input appears in the same place a moment
        later. The form cannot be submitted before hydration anyway.
      */}
      {mounted ? (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          data-lpignore="true"
          data-1p-ignore=""
          className={fieldClass}
        />
      ) : (
        <div aria-hidden className={fieldClass} />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.82rem] font-semibold text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}
