"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { demoNav, roleLabel, type IconKey } from "@/lib/demo/nav";
import { DEMO_ROLES, type DemoRole } from "@/lib/demo/config";
import { demoIdentities } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

/**
 * The shell all four demo portals share.
 *
 * One chrome, four navigations. The role comes from the URL rather than a
 * cookie or client state, which means every screen is directly linkable —
 * you can send someone `/demo/business/requests` and they land on exactly what
 * you were looking at. Reviewing a UI is mostly sending people screens.
 */

const ICONS: Record<IconKey, string> = {
  dashboard: "M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z",
  journey: "M4 20L20 4M4 20h5M20 4v5",
  applications: "M6 3h9l4 4v14H6zM15 3v4h4",
  universities: "M12 3l9 5-9 5-9-5zM5 11v5c0 1.5 3 3 7 3s7-1.5 7-3v-5",
  documents: "M6 3h9l4 4v14H6zM9 12h7M9 16h5",
  scholarships: "M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z",
  messages: "M4 5h16v11H9l-5 4z",
  consultations: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4",
  jobs: "M3 8h18v12H3zM8 8V5h8v3",
  interviews: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6M18 3l3 3-3 3",
  requests: "M5 4h14v16H5zM9 9h6M9 13h6M9 17h3",
  services: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  users: "M9 12a4 4 0 100-8 4 4 0 000 8zM2 21c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5M17 11a3 3 0 100-6M18 20c0-2.5 1.5-4 4-4",
  activity: "M3 12h4l3-8 4 16 3-8h4",
};

function Icon({ name }: { name: IconKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[18px] w-[18px] shrink-0">
      <path
        d={ICONS[name]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------ role switch */

function RoleSwitcher({ role }: { role: DemoRole }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-line px-3.5 text-[0.83rem] text-fg transition-colors hover:border-moss-400/60"
      >
        <span className="text-faint">Preview as</span>
        <span className="font-medium">{roleLabel[role]}</span>
        <svg viewBox="0 0 12 12" aria-hidden className={cn("h-2.5 w-2.5 transition-transform", open && "rotate-180")}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* Click-away. A plain overlay rather than a document listener so it
              cannot leak past unmount. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-[71] mt-2 w-56 overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface shadow-[0_20px_50px_-16px_rgba(0,0,0,0.5)]"
          >
            {DEMO_ROLES.map((r) => (
              <Link
                key={r}
                role="menuitem"
                href={`/demo/${r}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3 px-4 text-[0.88rem] transition-colors",
                  r === role
                    ? "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] font-medium text-accent"
                    : "text-fg hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)]"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    r === role ? "bg-moss-400" : "bg-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  )}
                />
                {roleLabel[r]}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- shell */

export function DemoShell({ role, children }: { role: DemoRole; children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = demoNav[role];
  const who = demoIdentities[role];

  const base = `/demo/${role}`;
  const hrefFor = (item: string) => (item ? `${base}/${item}` : base);
  const isActive = (item: string) => {
    const href = hrefFor(item);
    return item === "" ? pathname === base : pathname.startsWith(href);
  };

  const sidebar = (
    <nav aria-label="Portal" className="flex flex-col gap-1">
      {nav.map((item) => {
        const on = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={hrefFor(item.href)}
            onClick={() => setMenuOpen(false)}
            aria-current={on ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-[0.89rem] transition-colors",
              on
                ? "bg-[color-mix(in_srgb,var(--accent)_13%,transparent)] font-medium text-accent"
                : "text-muted hover:bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] hover:text-fg"
            )}
          >
            <Icon name={item.icon} />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-moss-400 px-1.5 text-[0.68rem] font-semibold text-navy-950">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="tone-soft min-h-screen">
      {/*
        The banner is permanent and cannot be dismissed. Demo screens get
        screenshotted and pasted into chats; without a mark on every frame, a
        fabricated metric can be quoted back as a real one months later.
      */}
      <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-400 px-4 py-2 text-center text-[0.78rem] font-semibold text-[#3B2A02]">
        <span>DEMO PREVIEW — all names, numbers and records on these screens are invented.</span>
        <Link
          href="/demo"
          className="inline-flex min-h-11 items-center px-2 underline underline-offset-2"
        >
          Change role
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[100rem] gap-0">
        {/* Sidebar — desktop */}
        <aside className="sticky top-[38px] hidden h-[calc(100vh-38px)] w-64 shrink-0 flex-col border-r border-line px-4 py-6 lg:flex">
          <Link href="/demo" className="mb-8 flex items-center gap-2.5 px-2">
            <Image
              src="/brand/snz-mark.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-[1rem] font-bold tracking-[-0.02em] text-fg">SnZ Ventures</span>
          </Link>
          {sidebar}
          <div className="mt-auto border-t border-line pt-4">
            <p className="px-3 text-[0.8rem] font-medium text-fg">{who.name}</p>
            <p className="px-3 text-[0.74rem] text-faint">{roleLabel[role]}</p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-[38px] z-40 flex items-center justify-between gap-4 border-b border-line bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="demo-mobile-nav"
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line lg:hidden"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>

            <p className="min-w-0 flex-1 truncate text-[0.85rem] text-faint lg:flex-none">
              <span className="hidden sm:inline">Signed in as </span>
              <span className="font-medium text-fg">{who.name}</span>
            </p>

            <div className="flex items-center gap-2">
              <RoleSwitcher role={role} />
              <span
                aria-hidden
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-line text-[0.75rem] font-semibold text-muted sm:flex"
              >
                {who.initials}
              </span>
            </div>
          </header>

          {/* Sidebar — mobile drawer */}
          {menuOpen && (
            <div
              id="demo-mobile-nav"
              className="border-b border-line px-4 py-4 lg:hidden"
            >
              {sidebar}
            </div>
          )}

          <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
