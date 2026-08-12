"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { analytics } from "@/lib/analytics";
import { ROLE_LABEL, type Role } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

/**
 * Portal chrome — a workspace, not a marketing page.
 *
 * Same palette, type and mark as the public site so it reads as one product.
 * The rail is deliberately quiet: hairline group rules, small-caps headings,
 * and an active state marked by a left accent bar rather than a filled block.
 */

type NavItem = { href: string; label: string; icon: string };

const ICONS: Record<string, string> = {
  dashboard: "M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z",
  profile: "M8 8.2a2.7 2.7 0 100-5.4 2.7 2.7 0 000 5.4zM2.8 14v-.8c0-1.9 2.3-3.4 5.2-3.4s5.2 1.5 5.2 3.4V14",
  journey: "M4 13.5V5m0 0L2 7m2-2l2 2M12 2.5V11m0 0l2-2m-2 2l-2-2",
  cases: "M2.5 5h11v8.5h-11zM5.5 5V3.6c0-.6.5-1.1 1.1-1.1h2.8c.6 0 1.1.5 1.1 1.1V5",
  documents: "M4 2h5l3.5 3.5V14H4zM9 2v3.5h3.5",
  opportunities: "M8 1.8l1.85 3.9 4.15.55-3.05 2.9.78 4.25L8 11.35 4.27 13.4l.78-4.25L2 6.25l4.15-.55z",
  messages: "M2.5 3.2h11v7.4h-6l-3.4 2.7v-2.7H2.5z",
  appointments: "M3 4.2h10v9.3H3zM3 6.9h10M5.6 2.4v2.2M10.4 2.4v2.2",
  tasks: "M2.4 4.6l1.4 1.4 2.6-2.6M2.4 10.2l1.4 1.4 2.6-2.6M8.6 5h5M8.6 10.6h5",
  notifications: "M8 2.2a3.4 3.4 0 00-3.4 3.4c0 2.9-1.4 3.9-1.4 3.9h9.6s-1.4-1-1.4-3.9A3.4 3.4 0 008 2.2zM6.7 11.9a1.4 1.4 0 002.6 0",
  support: "M8 13.8A5.8 5.8 0 108 2.2a5.8 5.8 0 000 11.6zM6.4 6.2a1.7 1.7 0 013.3.6c0 1.1-1.65 1.4-1.65 2.5M8 11.3h.01",
  settings: "M8 9.8a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM12.6 8c0-.3 0-.6-.08-.9l1.2-.92-1.2-2.05-1.38.55a4.6 4.6 0 00-1.56-.9L9.35 2.3h-2.7l-.23 1.48a4.6 4.6 0 00-1.56.9L3.48 4.13 2.28 6.18l1.2.92a4.6 4.6 0 000 1.8l-1.2.92 1.2 2.05 1.38-.55c.46.4.99.7 1.56.9l.23 1.48h2.7l.23-1.48a4.6 4.6 0 001.56-.9l1.38.55 1.2-2.05-1.2-.92c.06-.3.08-.6.08-.9z",
  admin: "M8 1.9l5 2v3.7c0 3-2.1 5.5-5 6.3-2.9-.8-5-3.3-5-6.3V3.9z",
};

function navFor(role: Role): { group: string; items: NavItem[] }[] {
  const journeyLabel =
    role === "student"
      ? "Study journey"
      : role === "professional"
        ? "Career journey"
        : "Setup journey";

  const casesLabel = role === "business" ? "Requests" : "Applications";

  const groups: { group: string; items: NavItem[] }[] = [
    {
      group: "Journey",
      items: [
        { href: "/portal", label: "Overview", icon: "dashboard" },
        { href: "/portal/journey", label: journeyLabel, icon: "journey" },
        { href: "/portal/cases", label: casesLabel, icon: "cases" },
        ...(role === "professional"
          ? [{ href: "/portal/opportunities", label: "Opportunities", icon: "opportunities" }]
          : []),
      ],
    },
    {
      group: "Your file",
      items: [
        { href: "/portal/profile", label: "Profile", icon: "profile" },
        { href: "/portal/documents", label: "Documents", icon: "documents" },
        { href: "/portal/tasks", label: "Tasks", icon: "tasks" },
      ],
    },
    {
      group: "Contact",
      items: [
        { href: "/portal/messages", label: "Messages", icon: "messages" },
        { href: "/portal/appointments", label: "Appointments", icon: "appointments" },
        { href: "/portal/notifications", label: "Notifications", icon: "notifications" },
      ],
    },
    {
      group: "Account",
      items: [
        { href: "/portal/settings", label: "Settings", icon: "settings" },
        { href: "/portal/support", label: "Support", icon: "support" },
      ],
    },
  ];

  if (role === "admin" || role === "advisor") {
    groups.unshift({
      group: "Staff",
      items: [
        { href: "/portal/admin", label: "Overview", icon: "admin" },
        { href: "/portal/admin/users", label: "Users & roles", icon: "profile" },
        { href: "/portal/admin/cases", label: "Cases", icon: "cases" },
        { href: "/portal/admin/documents", label: "Document review", icon: "documents" },
        { href: "/portal/admin/staff", label: "Advisors", icon: "opportunities" },
        { href: "/portal/admin/audit", label: "Audit log", icon: "tasks" },
      ],
    });
  }

  return groups;
}

export function PortalShell({
  children,
  name,
  role,
}: {
  children: React.ReactNode;
  name: string;
  role: Role;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const groups = navFor(role);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    setSigningOut(true);
    analytics.portalLogout();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const Rail = (
    <nav aria-label="Portal" className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-line px-5 py-5">
        <Link href="/portal" className="group flex items-center gap-3">
          <Image
            src="/brand/snz-mark.png"
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 rounded-full ring-1 ring-white/15 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[8deg]"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[0.98rem] font-bold tracking-[-0.02em] text-fg">
              SnZ Ventures
            </span>
            <span className="label mt-1 text-[0.6rem] text-faint">
              Client portal
            </span>
          </span>
        </Link>
      </div>

      {/* Groups */}
      <div className="rail flex-1 overflow-y-auto px-3 py-5">
        {groups.map((g, gi) => (
          <div key={g.group} className={cn(gi > 0 && "mt-6 border-t border-line pt-5")}>
            <p className="label px-3 pb-2.5 text-[0.6rem] text-faint">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active =
                  item.href === "/portal"
                    ? pathname === "/portal"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-[var(--radius-sm)] py-2.5 pl-4 pr-3 text-[0.87rem] transition-colors duration-300",
                        active
                          ? "bg-[color-mix(in_srgb,var(--fg)_6%,transparent)] font-semibold text-fg"
                          : "text-muted hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] hover:text-fg"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="portal-active-bar"
                          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-moss-400"
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className={cn(
                          "h-[15px] w-[15px] shrink-0 transition-colors",
                          active ? "text-accent" : "text-faint group-hover:text-muted"
                        )}
                      >
                        <path
                          d={ICONS[item.icon]}
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Account */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-moss-400 to-moss-600 text-[0.75rem] font-bold text-navy-950 ring-1 ring-white/20">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.85rem] font-semibold text-fg">
              {name}
            </span>
            <span className="label block text-[0.6rem] text-faint">
              {ROLE_LABEL[role]}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={signingOut}
          className="mt-1 flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2.5 text-[0.85rem] text-muted transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] hover:text-fg disabled:opacity-50"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-[15px] w-[15px]">
            <path
              d="M10 2.5H4.5A1.5 1.5 0 003 4v8a1.5 1.5 0 001.5 1.5H10M7 8h6.5m0 0l-2-2m2 2l-2 2"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="tone-deep relative min-h-screen">
      {/* Ground texture — depth without noise */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(1200px 600px at 78% -10%, color-mix(in srgb, #2755A2 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 border-r border-line bg-[color-mix(in_srgb,var(--fg)_2%,transparent)] backdrop-blur-sm lg:block">
          {Rail}
        </aside>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="absolute inset-0 h-full w-full cursor-default bg-navy-950/75 backdrop-blur-sm"
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Portal menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="tone-deep absolute inset-y-0 left-0 w-[min(86vw,300px)] border-r border-line"
              >
                {Rail}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-9">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:text-fg lg:hidden"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-2.5 bg-current" />
              </span>
            </button>

            <Link
              href="/"
              className="label flex items-center gap-2 text-faint transition-colors hover:text-fg"
            >
              <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5">
                <path d="M11 6H2m0 0l3.5-3.5M2 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to site
            </Link>

            <div className="ml-auto flex items-center gap-2">
              {[
                { href: "/portal/messages", label: "Messages", icon: "messages" },
                { href: "/portal/notifications", label: "Notifications", icon: "notifications" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  aria-label={a.label}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-faint transition-colors hover:border-line-strong hover:text-fg"
                >
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-[15px] w-[15px]">
                    <path d={ICONS[a.icon]} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </header>

          <main id="main" className="flex-1 px-4 py-9 sm:px-7 lg:px-9">
            <div className="mx-auto max-w-[1180px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
