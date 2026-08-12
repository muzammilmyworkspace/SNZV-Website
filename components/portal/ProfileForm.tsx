"use client";

import { useState, type FormEvent } from "react";
import { Action } from "@/components/ui/Editorial";
import { ProgressBar } from "./Pieces";

type Field = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: string[];
};

/**
 * Progressive profile. Nothing here is mandatory — the completion figure is a
 * real count of filled fields, so it always reflects the actual record rather
 * than a decorative number.
 */
export function ProfileForm({
  fields,
  initial,
  name,
  email,
}: {
  fields: Field[];
  initial: Record<string, string>;
  name: string;
  email: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const filled = fields.filter((f) => values[f.key]?.trim()).length;
  const percent = fields.length ? Math.round((filled / fields.length) * 100) : 0;

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setStatus("idle");
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: values }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-8 rounded-[var(--radius-lg)] border border-line bg-raised p-5">
        <ProgressBar value={percent} label="Profile completion" />
        <p className="mt-3 text-[0.83rem] text-muted">
          {percent === 100
            ? "Complete. You can update any of this at any time."
            : "Add what you know. Nothing here is binding, and you can come back to it."}
        </p>
      </div>

      {/* Account identity is read-only here — changing it goes through Settings. */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="pf-name">
            Name
          </label>
          <input id="pf-name" className="field" value={name} readOnly aria-readonly />
        </div>
        <div>
          <label className="field-label" htmlFor="pf-email">
            Email
          </label>
          <input id="pf-email" className="field" value={email} readOnly aria-readonly />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `pf-${f.key}`;
          return (
            <div key={f.key}>
              <label className="field-label" htmlFor={id}>
                {f.label}
              </label>
              {f.type === "select" ? (
                <select
                  id={id}
                  className="field"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  className="field"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Action type="submit" size="lg">
          {status === "saving" ? "Saving…" : "Save profile"}
        </Action>
        {status === "saved" && (
          <p role="status" className="text-[0.87rem] text-accent">
            Saved.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-[0.87rem] text-red-300">
            We couldn&rsquo;t save that. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
