import {
  Container,
  Section,
  Chapter,
  MaskedLines,
  Reveal,
  Action,
  TextLink,
} from "@/components/ui/Primitives";

/**
 * PORTAL PREVIEW
 * ---------------------------------------------------------------------------
 * One component, four pages. The audience changes what the rows say — a
 * student tracks applications and a visa, a founder tracks an incorporation
 * and a licence — but the promise is identical, so the layout is too.
 *
 * The mock is built from DOM, not a screenshot. A screenshot of a dashboard
 * goes stale the moment the dashboard changes, cannot be read by a screen
 * reader, and ships a large image for something that is a handful of rules.
 * This costs nothing, follows the theme, and is `aria-hidden` because it
 * illustrates the copy rather than adding to it.
 *
 * Both links point at the real portal (`/login`, `/register`) — the same
 * routes the header uses. Nothing here is a mock link.
 */

type Row = { label: string; value: string; state: "done" | "active" | "waiting" };

const AUDIENCE: Record<
  "student" | "career" | "business" | "general",
  { eyebrow: string; lines: string[]; lead: string; rows: Row[]; cta: string }
> = {
  student: {
    eyebrow: "Student portal",
    lines: ["Your Application,", "Not a Mystery."],
    lead: "Applications, documents, tasks and messages in one place — so you always know what is outstanding, who has it, and what happens next.",
    rows: [
      { label: "Profile & documents", value: "Complete", state: "done" },
      { label: "University applications", value: "2 submitted", state: "active" },
      { label: "Scholarship deadlines", value: "Tracked", state: "active" },
      { label: "Visa file", value: "Awaiting offer", state: "waiting" },
    ],
    cta: "Log in to the student portal",
  },
  career: {
    eyebrow: "Candidate portal",
    lines: ["Every Stage,", "Visible."],
    lead: "Your profile, the roles you have been put forward for, document requests and interview scheduling — tracked in one place instead of a mailbox.",
    rows: [
      { label: "Profile & documents", value: "Complete", state: "done" },
      { label: "Roles submitted", value: "In review", state: "active" },
      { label: "Interview scheduling", value: "Open", state: "active" },
      { label: "Relocation file", value: "Awaiting offer", state: "waiting" },
    ],
    cta: "Log in to the candidate portal",
  },
  business: {
    eyebrow: "Client portal",
    lines: ["Your Entity,", "Tracked End to End."],
    lead: "Incorporation, filings, licensing evidence and residence permits — every workstream in one place, with a named coordinator attached to each.",
    rows: [
      { label: "Company formation", value: "Filed", state: "done" },
      { label: "Banking & VAT", value: "In progress", state: "active" },
      { label: "Licensing evidence", value: "Under review", state: "active" },
      { label: "Residence permits", value: "Queued", state: "waiting" },
    ],
    cta: "Log in to the client portal",
  },
  general: {
    eyebrow: "Client portal",
    lines: ["One Dashboard.", "No Chasing."],
    lead: "Whichever route you take, the work is tracked in one place: documents, applications, tasks and messages, with a named advisor attached.",
    rows: [
      { label: "Profile & documents", value: "Complete", state: "done" },
      { label: "Applications", value: "In progress", state: "active" },
      { label: "Tasks for you", value: "2 open", state: "active" },
      { label: "Messages", value: "Advisor assigned", state: "waiting" },
    ],
    cta: "Log in to the portal",
  },
};

const DOT: Record<Row["state"], string> = {
  done: "bg-moss-400",
  active: "bg-navy-300",
  waiting: "bg-[color-mix(in_srgb,var(--fg)_28%,transparent)]",
};

export function PortalPreview({
  audience = "general",
  tone = "soft",
  index = "—",
  id,
}: {
  audience?: keyof typeof AUDIENCE;
  tone?: "deep" | "soft" | "paper" | "white";
  index?: string;
  /** Set on the homepage so the meridian rail can track this chapter. */
  id?: string;
}) {
  const a = AUDIENCE[audience];

  return (
    <Section id={id} tone={tone} className="overflow-hidden">
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] opacity-30"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Chapter index={index} label={a.eyebrow} className="mb-8" />
            <MaskedLines
              as="h2"
              className="d-2 max-w-[15ch] text-fg-strong"
              lines={a.lines}
            />
            <Reveal delay={0.12}>
              <p className="lede mt-6 max-w-md">{a.lead}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Action href="/login">{a.cta}</Action>
                <TextLink href="/register">Create an account</TextLink>
              </div>
            </Reveal>
          </div>

          {/* Illustrative only — the copy carries the meaning. */}
          <Reveal delay={0.1}>
            <div
              aria-hidden
              className="rounded-[var(--radius-lg)] border border-line bg-raised p-5 shadow-[0_30px_80px_-40px_rgba(2,6,16,0.6)] sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-accent">
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path
                        d="M2.5 2.5h4.2v4.2H2.5zM9.3 2.5h4.2v4.2H9.3zM2.5 9.3h4.2v4.2H2.5zM9.3 9.3h4.2v4.2H9.3z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="label text-fg">Your dashboard</span>
                </span>
                <span className="label text-faint">Live</span>
              </div>

              <ul className="mt-2">
                {a.rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`block h-1.5 w-1.5 rounded-full ${DOT[r.state]}`} />
                      <span className="text-[0.87rem] text-fg">{r.label}</span>
                    </span>
                    <span className="text-[0.8rem] text-muted">{r.value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-[var(--radius-sm)] border border-line px-4 py-3">
                <span className="text-[0.78rem] leading-snug text-faint">
                  Documents are stored privately and shared through short-lived
                  links — never a public URL.
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
