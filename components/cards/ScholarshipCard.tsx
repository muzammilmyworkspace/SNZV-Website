import type { Scholarship } from "@/data/study";

/**
 * A funding scheme, as a card.
 *
 * Structure mirrors the reference layout: a medal mark and the awarding
 * country, the scheme name set as display type, then a two-row ledger of the
 * facts a shortlisting student compares — what it covers, and who it is open
 * to. The rows are a `<dl>` because that is what they are: term and
 * definition, not a table and not a list of sentences.
 *
 * Colours all resolve through the tone system, so the card is legible on the
 * light band it sits in today and would survive being moved to a dark one.
 */
export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-raised p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-moss-400/50">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)] text-accent transition-colors duration-500 group-hover:bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]"
        >
          {/* Medal — award, without resorting to a trophy cliché. */}
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="9" r="5.2" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M9.2 13.4L8 21l4-2.2 4 2.2-1.2-7.6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="min-w-0">
          <p className="label text-accent">{scholarship.country}</p>
          <h3 className="mt-1.5 font-display text-[1.15rem] leading-tight tracking-[-0.018em] text-fg">
            {scholarship.name}
          </h3>
        </div>
      </div>

      <dl className="mt-auto pt-6">
        {[
          ["Value", scholarship.value],
          ["Level", scholarship.level],
        ].map(([term, def], i) => (
          <div
            key={term}
            className={
              "flex items-baseline justify-between gap-4 py-2.5" +
              (i === 0 ? " border-t border-line" : " border-t border-line")
            }
          >
            <dt className="shrink-0 text-[0.82rem] text-faint">{term}</dt>
            <dd className="text-right text-[0.85rem] font-semibold text-fg">
              {def}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
