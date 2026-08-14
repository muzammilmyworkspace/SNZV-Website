"use client";

import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Contact rail with tracking. Split out so Footer stays a server component. */
export function ContactLinks({
  location,
  tone = "dark",
  className,
}: {
  location: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const link = cn(
    "label transition-colors duration-300",
    tone === "dark"
      ? "text-muted hover:text-accent"
      : "text-mist-600 hover:text-accent"
  );

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
      <span
        className={cn(
          "label",
          tone === "dark" ? "text-faint" : "text-mist-400"
        )}
      >
        {company.contact.city}, {company.contact.country}
      </span>
    </div>
  );
}
