"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { company } from "@/data/company";
import { WhatsApp } from "./Icons";

/** A homepage call to action that records which button was pressed. */
export function CtaLink({
  href,
  label,
  location,
  className,
  children,
}: {
  href: string;
  label: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => analytics.ctaClick(label, location)}>
      {children}
    </Link>
  );
}

export function WhatsAppLink({ location, className, children }: { location: string; className?: string; children?: ReactNode }) {
  const text = encodeURIComponent("Hi SnZ Ventures, I'd like to talk about studying, working or setting up a business in Europe.");
  return (
    <a
      href={`https://wa.me/${company.contact.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => analytics.whatsapp(location)}
    >
      <WhatsApp />
      {children ?? "Chat on WhatsApp"}
    </a>
  );
}

export function PhoneLink({ location }: { location: string }) {
  return (
    <a href={`tel:${company.contact.phoneHref}`} onClick={() => analytics.phone(location)}>
      {company.contact.phone}
    </a>
  );
}

export function EmailLink({ location }: { location: string }) {
  return (
    <a href={`mailto:${company.contact.email}`} onClick={() => analytics.email(location)}>
      {company.contact.email}
    </a>
  );
}
