import { Reveal } from "../Reveal";

/**
 * The heading block every section opens with: eyebrow, a headline that wipes
 * up into place, and an optional aside on the right. One component so the
 * rhythm is identical on every page.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  aside,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="bp-eyebrow">{eyebrow}</p>
        <Reveal mask>
          <h2 id={id} className="bp-display bp-h2 mt-5 max-w-3xl">
            {title}
          </h2>
        </Reveal>
      </div>
      {aside && <div className="bp-body max-w-md">{aside}</div>}
    </div>
  );
}

/** A section's outer box — consistent width, gutters and (tight) spacing. */
export function Band({
  id,
  labelledBy,
  children,
  className = "",
}: {
  id?: string;
  labelledBy?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative z-10 py-10 sm:py-14 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">{children}</div>
    </section>
  );
}
