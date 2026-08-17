import Link from "next/link";
import Image from "next/image";
import { DEMO_ROLES } from "@/lib/demo/config";
import { demoIdentities } from "@/lib/demo/data";
import { roleLabel } from "@/lib/demo/nav";

/**
 * ROLE CHOOSER — the front door of the preview.
 *
 * Four cards, no login. Each names the person you become and what that role's
 * portal is for, because "Student" alone does not tell a reviewer what they
 * are about to evaluate.
 */

const BLURB = {
  admin: "See the whole operation: every user, request, document and conversation across the platform.",
  student: "Follow one student's study abroad journey — applications, documents, scholarships and progress.",
  "job-seeker": "Follow one job seeker's search — matches, applications, interviews and CV status.",
  business: "Follow one company's setup — service requests, documents and consultations.",
} as const;

const CTA = {
  admin: "Enter Super Admin",
  student: "Enter Student Portal",
  "job-seeker": "Enter Job Seeker Portal",
  business: "Enter Business Portal",
} as const;

export default function DemoChooser() {
  return (
    <div className="tone-soft flex min-h-screen flex-col">
      <div className="flex flex-wrap items-center justify-center gap-x-3 bg-amber-400 px-4 py-2 text-center text-[0.78rem] font-semibold text-[#3B2A02]">
        DEMO PREVIEW — every name, number and record inside is invented.
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-14 sm:px-8">
        <Link href="/" className="mb-10 inline-flex items-center gap-3 self-start">
          <Image
            src="/brand/snz-mark.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
          <span className="text-[1.15rem] font-bold tracking-[-0.02em] text-fg">SnZ Ventures</span>
        </Link>

        <p className="label mb-4 flex items-center gap-3 text-accent">
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-50" />
          Portal preview
        </p>
        <h1 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-fg-strong sm:text-[2.6rem]">
          Preview the portal as&hellip;
        </h1>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
          Four roles, one platform. Each has its own dashboard, navigation and
          purpose. Pick one to step into it — no sign-in needed, and you can
          switch at any point from inside.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DEMO_ROLES.map((role) => {
            const who = demoIdentities[role];
            return (
              <Link
                key={role}
                href={`/demo/${role}`}
                className="group flex flex-col rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-moss-400/60 motion-reduce:transform-none"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-[0.8rem] font-semibold text-accent"
                  >
                    {who.initials}
                  </span>
                  <span>
                    <span className="block text-[1.15rem] font-bold tracking-[-0.02em] text-fg-strong">
                      {roleLabel[role]}
                    </span>
                    <span className="block text-[0.78rem] text-faint">{who.name}</span>
                  </span>
                </span>

                <span className="mt-4 flex-1 text-[0.9rem] leading-relaxed text-muted">
                  {BLURB[role]}
                </span>

                <span className="label mt-6 inline-flex items-center gap-2 text-accent">
                  {CTA[role]}
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 max-w-2xl text-[0.8rem] leading-relaxed text-faint">
          This preview reads from a fixed set of sample records and never
          touches the database. Real sign-in at{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-muted">
            /login
          </Link>{" "}
          is unaffected.
        </p>
      </div>
    </div>
  );
}
