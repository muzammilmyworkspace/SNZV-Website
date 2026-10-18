"use client";

import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Social rail — the six networks SnZ actually runs, in a fixed 3x2 grid.
 *
 * The grid is deliberate rather than a wrapping flex row: inside the narrow
 * Contact column a flex rail broke 5+1, which reads as an accident. 3+3 reads
 * as a decision, and it holds at every width.
 *
 * WhatsApp needs no profile URL — it is derived from the published phone
 * number, and it is the channel the rest of the site pushes hardest.
 *
 * An entry whose URL is still null renders dimmed and non-interactive rather
 * than as a link: a guessed handle that 404s in front of a prospective client
 * is worse than an icon that is visibly not live yet.
 */

type Social = {
  key: string;
  label: string;
  href: string | null;
  path: string;
  /** Some glyphs are strokes rather than filled shapes. */
  stroke?: boolean;
};

/**
 * Networks without a URL yet still render, dimmed and non-interactive.
 *
 * The brand wants the full set visible, and an icon that silently disappears
 * looks like an oversight. But a link to a guessed handle is worse than no
 * link: it 404s in front of a prospective client and reads as an abandoned
 * account. So the icon is drawn, marked unavailable to assistive tech, and
 * simply is not a link until `data/company.ts` has its URL.
 */

const NETWORKS: Social[] = [
  {
    key: "instagram",
    label: "Instagram",
    href: company.social.instagram,
    stroke: true,
    path: "M7 2.8h10A4.2 4.2 0 0121.2 7v10a4.2 4.2 0 01-4.2 4.2H7A4.2 4.2 0 012.8 17V7A4.2 4.2 0 017 2.8zM12 8.4a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2zM17.4 6.3v.02",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: company.social.facebook,
    path: "M13.5 21v-8.2h2.8l.42-3.2H13.5V7.55c0-.93.26-1.56 1.59-1.56h1.7V3.13A22.7 22.7 0 0014.31 3c-2.46 0-4.14 1.5-4.14 4.26V9.6H7.35v3.2h2.82V21h3.33z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: company.social.linkedin,
    path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12.02H3V8.98zM9.5 8.98h3.83v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H18v-5.54c0-1.32-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93V21H9.5V8.98z",
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: company.social.tiktok,
    path: "M16.6 2h-3.1v13.2a2.5 2.5 0 11-1.9-2.43V9.6a5.6 5.6 0 105 5.57V9.05a7 7 0 003.9 1.19V7.13a4 4 0 01-3.9-4V2z",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: company.social.youtube,
    path: "M23.5 6.9a3 3 0 00-2.12-2.12C19.5 4.27 12 4.27 12 4.27s-7.5 0-9.38.51A3 3 0 00.5 6.9 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.1 3 3 0 002.12 2.12c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 002.12-2.12A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.1zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/${company.contact.whatsapp}`,
    path: "M12.04 2a9.9 9.9 0 00-8.5 14.93L2 22.5l5.7-1.49A9.9 9.9 0 1012.04 2zm0 1.9a8 8 0 016.78 12.23l-.24.38.79 2.88-2.96-.78-.37.22a8 8 0 11-4-14.93zm-3.6 4.3c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.18 1.9 3.02 4.66 4.11 2.3.9 2.77.72 3.27.68.5-.05 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.47-.83-2.01-.2-.48-.4-.42-.55-.42h-.5z",
  },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("grid w-fit grid-cols-3 gap-2", className)}>
      {NETWORKS.map((n) => {
        const glyph = (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-[1.05rem] w-[1.05rem]"
            fill={n.stroke ? "none" : "currentColor"}
            stroke={n.stroke ? "currentColor" : undefined}
            strokeWidth={n.stroke ? 1.6 : undefined}
            strokeLinecap={n.stroke ? "round" : undefined}
            strokeLinejoin={n.stroke ? "round" : undefined}
          >
            <path d={n.path} />
          </svg>
        );

        const box =
          "flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line";

        return (
          <li key={n.key}>
            {n.href ? (
              <a
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${company.name} on ${n.label}`}
                onClick={() => analytics.outbound(n.href!)}
                className={cn(
                  box,
                  "text-muted transition-all duration-400 hover:-translate-y-0.5 hover:border-moss-400/60 hover:text-accent"
                )}
              >
                {glyph}
              </a>
            ) : (
              <span
                role="img"
                aria-label={`${n.label} — profile not published yet`}
                title={`${n.label} — coming soon`}
                className={cn(box, "cursor-default text-faint opacity-40")}
              >
                {glyph}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
