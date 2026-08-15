"use client";

import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Contact rail with tracking. Split out so Footer stays a server component. */
export function ContactLinks({
  location,
  tone = "dark",
  className,
  variant = "full",
}: {
  location: string;
  tone?: "dark" | "light";
  className?: string;
  /**
   * "compact" shows only the two channels people actually start a
   * conversation on — email and WhatsApp — stacked rather than in a rail.
   * Used in the footer, where the phone number and city already appear in the
   * address block directly above it and repeating them reads as filler.
   */
  variant?: "full" | "compact";
}) {
  // Tone-aware by token, so the  prop no longer selects a colour.
  const link = "label text-muted transition-colors duration-300 hover:text-accent";

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col items-start gap-2.5", className)}>
        <a
          href={`mailto:${company.contact.email}`}
          onClick={() => analytics.email(location)}
          className={link}
        >
          {company.contact.email}
        </a>
        <a
          href={`https://wa.me/${company.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.whatsapp(location)}
          className={link}
        >
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}>
      <a
        href={`tel:${company.contact.phoneHref}`}
        onClick={() => analytics.phone(location)}
        className={link}
      >
        {company.contact.phone}
      </a>
      <a
        href={`mailto:${company.contact.email}`}
        onClick={() => analytics.email(location)}
        className={link}
      >
        {company.contact.email}
      </a>
      <a
        href={`https://wa.me/${company.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analytics.whatsapp(location)}
        className={link}
      >
        WhatsApp
      </a>
      <span className="label text-faint">
        {company.contact.city}, {company.contact.country}
      </span>
    </div>
  );
}
