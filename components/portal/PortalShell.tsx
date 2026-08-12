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
 * Same palette, type and mark as the public site so it reads as one product,
 * but the layout is functional: a persistent rail, a compact top bar and a
 * content column. On mobile the rail becomes a slide-over.
 */

type NavItem = { href: string; label: string; icon: string; badge?: number };

const ICONS: Record<string, string> = {
  dashboard: "M2 3h5v5H2zM9 3h5v5H9zM2 10h5v3H2zM9 10h5v3H9z",
  profile: "M8 8a2.6 2.6 0 100-5.2A2.6 2.6 0 008 8zm0 1.4c-2.5 0-4.6 1.4-4.6 3.1V14h9.2v-1.5c0-1.7-2.1-3.1-4.6-3.1z",
  journey: "M3 13V7m0 0l2.5 2M3 7L.8 9M13 3v6m0 0l2.2-2M13 9l-2.2-2M6 13h4",
  cases: "M2.5 4.5h11v9h-11zM5.5 4.5V3a1 1 0 011-1h3a1 1 0 011 1v1.5",
  documents: "M4 2h5l3 3v9H4zM9 2v3h3",
  opportunities: "M8 1.5l1.9 4 4.4.6-3.2 3 .8 4.4L8 11.4 4.1 13.5l.8-4.4-3.2-3 4.4-.6z",
  messages: "M2.5 3h11v7.5h-6L4 13.5V10.5H2.5z",
  appointments: "M3 4h10v9H3zM3 6.5h10M5.5 2.5v2M10.5 2.5v2",
  tasks: "M2.5 4.5l1.5 1.5 3-3M2.5 9.5L4 11l3-3M9 5h5M9 10h5",
  notifications: "M8 2a3.5 3.5 0 00-3.5 3.5c0 3-1.5 4-1.5 4h10s-1.5-1-1.5-4A3.5 3.5 0 008 2zM6.6 12a1.5 1.5 0 002.8 0",
  support: "M8 14A6 6 0 108 2a6 6 0 000 12zM6.3 6.2a1.8 1.8 0 013.4.6c0 1.2-1.7 1.5-1.7 2.6M8 11.6h.01",
  settings: "M8 10a2 2 0 100-4 2 2 0 000 4zM13 8a5 5 0 00-.1-1l1.3-1-1.3-2.2-1.5.6a5 5 0 00-1.7-1L9.4 1.7H6.6L6.3 3.3a5 5 0 00-1.7 1l-1.5-.6L1.8 6l1.3 1a5 5 0 000 2l-1.3 1L3.1 12l1.5-.6a5 5 0 001.7 1l.3 1.6h2.8l.3-1.6a5 5 0 001.7-1l1.5.6 1.3-2.2-1.3-1c.06-.33.1-.66.1-1z",
  admin: "M8 1.5l5.5 2.2v4c0 3.2-2.3 6-5.5 6.8-3.2-.8-5.5-3.6-5.5-6.8v-4z",
};

function navFor(role: Role): { group: string; items: NavItem[] }[] {
  const journeyLabel =
    role === "student"
      ? "My study journey"
      : role === "professional"
        ? "My career journey"
        : "Setup journey";

  const casesLabel =
    role === "student"
      ? "Applications"
      : role === "professional"
        ? "Applications"
        : "Requests";

  const base: { group: string; items: NavItem[] }[] = [
    {
      group: "Journey",
      items: [
        { href: "/portal", label: "Dashboard", icon: "dashboard" },
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
    base.unshift({
      group: "Staff",
      items: [{ href: "/portal/admin", label: "Admin overview", icon: "admin" }],
    });
  }

  return base;
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
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <Image src="/brand/snz-mark.png" alt="" width={34} height={34} className="h-8 w-8 rounded-full" />
        <span className="text-[1rem] font-bold tracking-[-0.02em] text-fg">SnZ Ventures</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 rail">
        {groups.map((g) => (
          <div key={g.group} className="mb-6">
            <p className="label px-3 pb-2 text-faint">{g.group}</p>
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
                        "group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[0.88rem] transition-colors",
                        active
                          ? "bg-raised font-semibold text-fg"
                          : "text-muted hover:bg-raised hover:text-fg"
                      )}
                    >
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4 shrink-0">
                        <path
                          d={ICONS[item.icon]}
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <motion.span
                          layoutId="portal-active"
                          className="h-4 w-0.5 rounded-full bg-moss-400"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-400 text-[0.78rem] font-bold text-navy-950">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.85rem] font-semibold text-fg">{name}</span>
            <span className="block text-[0.72rem] text-faint">{ROLE_LABEL[role]}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[0.85rem] text-muted transition-colors hover:bg-raised hover:text-fg"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
            <path d="M10 2H4a2 2 0 00-2 2v8a2 2 0 002 2h6M7 8h7m0 0l-2.5-2.5M14 8l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="tone-deep min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        {/* Desktop rail */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-line lg:block">
          {Rail}
        </aside>

        {/* Mobile slide-over */}
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
                className="absolute inset-0 h-full w-full cursor-default bg-navy-950/70 backdrop-blur-sm"
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Portal menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="tone-deep absolute inset-y-0 left-0 w-[min(84vw,300px)] border-r border-line"
              >
                {Rail}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line lg:hidden"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-2.5 bg-current" />
              </span>
            </button>

            <Link href="/" className="label text-faint transition-colors hover:text-fg">
              ← Back to site
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/portal/messages"
                aria-label="Messages"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:text-fg"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
                  <path d={ICONS.messages} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/portal/notifications"
                aria-label="Notifications"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:text-fg"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
                  <path d={ICONS.notifications} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </header>

          <main id="main" className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
