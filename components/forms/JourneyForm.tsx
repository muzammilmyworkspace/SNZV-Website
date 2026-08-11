"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { analytics } from "@/lib/analytics";
import { company } from "@/data/company";
import { Action } from "@/components/ui/Editorial";
import { cn } from "@/lib/utils";
import type { PathwayKey } from "@/data/pathways";

/**
 * THE SMART JOURNEY FORM
 * ---------------------------------------------------------------------------
 * Three steps with progressive disclosure. Step 2 is generated from the
 * pathway chosen in step 1, so nobody is asked a question that doesn't apply
 * to them — which is the whole point of asking the intent question first.
 *
 * Analytics record the PATHWAY and STEP only. No answer text, name, email or
 * phone number is ever passed to `track()` (see lib/analytics.ts).
 */

type FieldDef = {
  name: string;
  label: string;
  type: "select" | "text";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

const PATHWAY_OPTIONS: {
  key: PathwayKey;
  icon: string;
  title: string;
  blurb: string;
}[] = [
  {
    key: "study",
    icon: "🎓",
    title: "Study abroad",
    blurb: "Education that leads to work",
  },
  {
    key: "careers",
    icon: "💼",
    title: "An international career",
    blurb: "Roles with European employers",
  },
  {
    key: "business",
    icon: "🏢",
    title: "Set up or expand a business",
    blurb: "EU entity, licensing, relocation",
  },
];

const STEP_TWO: Record<PathwayKey, FieldDef[]> = {
  study: [
    {
      name: "level",
      label: "What level are you aiming for?",
      type: "select",
      required: true,
      options: [
        "Bachelor's",
        "Master's",
        "PhD / research",
        "Professional qualification",
        "Not sure yet",
      ],
    },
    {
      name: "field",
      label: "Field of study",
      type: "text",
      placeholder: "e.g. computer science, nursing, finance",
    },
    {
      name: "destination",
      label: "Where are you thinking of?",
      type: "select",
      options: [
        "Lithuania",
        "Germany",
        "Netherlands",
        "Poland",
        "Elsewhere in the EU",
        "Open to advice",
      ],
    },
    {
      name: "intake",
      label: "Preferred intake",
      type: "select",
      options: ["Next 6 months", "6–12 months", "Over a year away", "Undecided"],
    },
    {
      name: "funding",
      label: "Are you looking for funding or scholarships?",
      type: "select",
      options: ["Yes, essential", "Yes, helpful", "No, self-funded"],
    },
  ],
  careers: [
    {
      name: "profession",
      label: "What is your profession?",
      type: "text",
      required: true,
      placeholder: "e.g. registered nurse, welder, backend developer",
    },
    {
      name: "experience",
      label: "Years of experience",
      type: "select",
      required: true,
      options: ["Under 2", "2–5", "5–10", "10+"],
    },
    {
      name: "destination",
      label: "Preferred destination",
      type: "select",
      options: [
        "Lithuania",
        "Germany",
        "Poland",
        "Netherlands",
        "Spain",
        "Italy",
        "Czech Republic",
        "Romania",
        "Open to advice",
      ],
    },
    {
      name: "goal",
      label: "What matters most right now?",
      type: "select",
      options: [
        "Finding a legitimate role",
        "Understanding my eligibility",
        "Improving my profile / CV",
        "Relocating with family",
      ],
    },
  ],
  business: [
    {
      name: "stage",
      label: "Where are you today?",
      type: "select",
      required: true,
      options: [
        "Idea stage",
        "Trading outside the EU",
        "Already have an EU entity",
        "Investor seeking relocation",
      ],
    },
    {
      name: "objective",
      label: "What do you need?",
      type: "select",
      required: true,
      options: [
        "Company formation & accounting",
        "Fintech / EMI / PI licensing",
        "Crypto authorisation",
        "Residence permit & relocation",
        "Hiring a team",
        "Not sure — need guidance",
      ],
    },
    {
      name: "sector",
      label: "Sector",
      type: "text",
      placeholder: "e.g. payments, logistics, SaaS",
    },
    {
      name: "timeline",
      label: "Timeline",
      type: "select",
      options: ["Immediately", "1–3 months", "3–6 months", "Exploring"],
    },
  ],
};

const TOTAL_STEPS = 3;
const FORM_ID = "journey";

export function JourneyForm({
  compact = false,
  onDone,
}: {
  compact?: boolean;
  onDone?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [pathway, setPathway] = useState<PathwayKey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const started = useRef(false);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const fields = pathway ? STEP_TWO[pathway] : [];

  const set = (name: string, value: string) => {
    setAnswers((a) => ({ ...a, [name]: value }));
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  };

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    analytics.formStart(FORM_ID);
  };

  const choosePathway = (key: PathwayKey) => {
    markStarted();
    setPathway(key);
    setAnswers({});
    analytics.formStep(FORM_ID, 1, TOTAL_STEPS, key);
    setStep(2);
  };

  const validateStep2 = () => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !answers[f.name]?.trim()) {
        next[f.name] = "This helps us give you a useful answer.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep3 = () => {
    const next: Record<string, string> = {};
    if (!answers.name?.trim()) next.name = "Please tell us your name.";
    if (!answers.email?.trim()) {
      next.email = "We need an email to reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(answers.email.trim())) {
      next.email = "That email address doesn't look right.";
    }
    if (!answers.consent) {
      next.consent = "Please confirm before submitting.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStep3 = () => {
    if (!validateStep2()) return;
    analytics.formStep(FORM_ID, 2, TOTAL_STEPS, pathway ?? undefined);
    setStep(3);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3() || !pathway) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway, answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      analytics.formStep(FORM_ID, 3, TOTAL_STEPS, pathway);
      analytics.formSubmit(FORM_ID, pathway);
      setStatus("done");
      onDone?.();
    } catch {
      setStatus("error");
    }
  };

  const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

  /* ----------------------------------------------------------- success ---- */

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 text-center"
        role="status"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss-400/15">
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-moss-400" fill="none">
            <path
              d="M4 10.5l4 4 8-9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="d-3 mt-6 text-paper">Thank you — that's enough to work with.</h3>
        <p className="mx-auto mt-4 max-w-md text-[0.93rem] leading-relaxed text-navy-200">
          We'll review what you've told us and come back with an honest read on
          your options — including if we think the route isn't right for you.
        </p>
        <p className="mt-6 text-[0.85rem] text-navy-300">
          Prefer to talk now?{" "}
          <a
            href={`https://wa.me/${company.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.whatsapp("form_success")}
            className="text-moss-300 underline underline-offset-4"
          >
            Message us on WhatsApp
          </a>
        </p>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------- form ---- */

  return (
    <form onSubmit={submit} noValidate className={cn(compact && "text-[0.95rem]")}>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p
            ref={headingRef}
            className="label text-navy-300"
            aria-live="polite"
          >
            Step {step} of {TOTAL_STEPS}
          </p>
          <p className="label text-navy-400">
            {step === 1
              ? "About 60 seconds"
              : step === 2
                ? "Almost there"
                : "Last step"}
          </p>
        </div>
        <div
          className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/12"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Form progress"
        >
          <motion.div
            className="h-full rounded-full bg-moss-400"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ------------------------------------------------------ step 1 -- */}
        {step === 1 && (
          <motion.fieldset
            key="s1"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className="d-3 mb-2 text-paper">
              What are you looking to achieve?
            </legend>
            <p className="mb-7 text-[0.88rem] text-navy-300">
              This decides what we ask next — so you only answer what's
              relevant.
            </p>

            <div className="grid gap-2.5">
              {PATHWAY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => choosePathway(opt.key)}
                  className="group flex items-center gap-4 border border-white/12 bg-white/[0.03] p-5 text-left transition-all duration-300 ease-[var(--ease-out-expo)] hover:border-moss-400/50 hover:bg-white/[0.06]"
                >
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-lg transition-colors group-hover:border-moss-400/40"
                  >
                    {opt.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[1.25rem] tracking-[-0.015em] text-paper">
                      {opt.title}
                    </span>
                    <span className="mt-1 block text-[0.82rem] text-navy-300">
                      {opt.blurb}
                    </span>
                  </span>
                  <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3 shrink-0 text-moss-400 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.fieldset>
        )}

        {/* ------------------------------------------------------ step 2 -- */}
        {step === 2 && pathway && (
          <motion.fieldset
            key="s2"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className="d-3 mb-2 text-paper">
              {pathway === "study"
                ? "Tell us about your studies"
                : pathway === "careers"
                  ? "Tell us about your work"
                  : "Tell us about the business"}
            </legend>
            <p className="mb-7 text-[0.88rem] text-navy-300">
              Rough answers are fine. Nothing here is binding.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <Field
                  key={f.name}
                  field={f}
                  value={answers[f.name] ?? ""}
                  error={errors[f.name]}
                  onChange={(v) => set(f.name, v)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Action variant="line" onClick={() => setStep(1)}>
                Back
              </Action>
              <Action onClick={goToStep3}>Continue</Action>
            </div>
          </motion.fieldset>
        )}

        {/* ------------------------------------------------------ step 3 -- */}
        {step === 3 && (
          <motion.fieldset
            key="s3"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className="d-3 mb-2 text-paper">Where should we reply?</legend>
            <p className="mb-7 text-[0.88rem] text-navy-300">
              A real person reads this. You'll get a considered answer, not a
              brochure.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                field={{
                  name: "name",
                  label: "Full name",
                  type: "text",
                  required: true,
                }}
                value={answers.name ?? ""}
                error={errors.name}
                onChange={(v) => set("name", v)}
              />
              <Field
                field={{
                  name: "email",
                  label: "Email",
                  type: "text",
                  required: true,
                  placeholder: "you@example.com",
                }}
                value={answers.email ?? ""}
                error={errors.email}
                onChange={(v) => set("email", v)}
              />
              <Field
                field={{
                  name: "phone",
                  label: "Phone / WhatsApp",
                  type: "text",
                  placeholder: "+370 …",
                }}
                value={answers.phone ?? ""}
                error={errors.phone}
                onChange={(v) => set("phone", v)}
              />
              <Field
                field={{
                  name: "preferredContact",
                  label: "Preferred contact method",
                  type: "select",
                  options: ["Email", "WhatsApp", "Phone call"],
                }}
                value={answers.preferredContact ?? ""}
                error={errors.preferredContact}
                onChange={(v) => set("preferredContact", v)}
              />
              <div className="sm:col-span-2">
                <label
                  htmlFor="jf-notes"
                  className="mb-1.5 block label text-navy-200"
                >
                  Anything else we should know?{" "}
                  <span className="text-navy-400">(optional)</span>
                </label>
                <textarea
                  id="jf-notes"
                  rows={3}
                  value={answers.notes ?? ""}
                  onChange={(e) => set("notes", e.target.value)}
                  className="w-full resize-y border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.92rem] text-paper outline-none transition-colors placeholder:text-navy-400 focus:border-moss-400"
                  placeholder="Constraints, deadlines, questions…"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex cursor-pointer items-start gap-2.5 text-[0.82rem] leading-relaxed text-navy-200">
                <input
                  type="checkbox"
                  checked={answers.consent === "yes"}
                  onChange={(e) => set("consent", e.target.checked ? "yes" : "")}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#72C43C]"
                  aria-invalid={Boolean(errors.consent)}
                />
                <span>
                  I agree that SnZ Ventures may contact me about my enquiry, in
                  line with the{" "}
                  <a
                    href="/legal/privacy-policy"
                    className="text-moss-300 underline underline-offset-4"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1 text-[0.78rem] text-red-300">
                  {errors.consent}
                </p>
              )}
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="mt-4 border border-red-400/40 bg-red-500/10 px-4 py-3 text-[0.83rem] text-red-200"
              >
                Something went wrong sending that. Please email{" "}
                <a
                  href={`mailto:${company.contact.email}`}
                  className="font-medium underline"
                >
                  {company.contact.email}
                </a>{" "}
                or message us on WhatsApp and we'll pick it up.
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <Action variant="line" onClick={() => setStep(2)}>
                Back
              </Action>
              <Action type="submit" size="lg">
                {status === "sending" ? "Sending…" : "Let's explore your options"}
              </Action>
            </div>
          </motion.fieldset>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ------------------------------------------------------------------ Field */

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const id = `jf-${field.name}`;
  const errorId = `${id}-error`;
  const base =
    "w-full border bg-white/[0.04] px-4 py-3 text-[0.92rem] text-paper outline-none transition-colors placeholder:text-navy-400";
  const border = error
    ? "border-red-400/70 focus:border-red-400"
    : "border-white/15 focus:border-moss-400";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block label text-navy-200"
      >
        {field.label}
        {!field.required && (
          <span className="text-navy-400"> (optional)</span>
        )}
      </label>

      {field.type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(base, border, !value && "text-navy-400")}
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.name === "email" ? "email" : "text"}
          inputMode={field.name === "phone" ? "tel" : undefined}
          autoComplete={
            field.name === "name"
              ? "name"
              : field.name === "email"
                ? "email"
                : field.name === "phone"
                  ? "tel"
                  : "off"
          }
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(base, border)}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1 text-[0.78rem] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
