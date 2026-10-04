import Link from "next/link";
import { Arrow } from "./Glyphs";

/**
 * The quiet call to action every section ends on.
 *
 * Not another big button — a line of copy that follows from what the section
 * just showed ("can't see your country?"), with one underlined action. The
 * header's Book a Consultation is always on screen; this is the nudge that
 * meets the visitor at the moment the section has made its case.
 */
export function InlineCta({
  lead,
  label,
  href,
  external,
  className = "",
}: {
  lead: string;
  label: string;
  href: string;
  external?: boolean;
  className?: string;
}) {
  const cls =
    "group inline-flex min-h-11 items-center gap-1.5 font-semibold text-[var(--bp-strong)] underline decoration-[var(--color-runway)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--color-runway)]";
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[1rem] text-[var(--bp-muted)] ${className}`}>
      <span>{lead}</span>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {label} <Arrow className="h-3.5 w-3.5" />
        </a>
      ) : (
        <Link href={href} className={cls}>
          {label} <Arrow className="h-3.5 w-3.5" />
        </Link>
      )}
    </p>
  );
}
