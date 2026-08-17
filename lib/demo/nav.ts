import type { DemoRole } from "./config";

/**
 * Navigation per role.
 *
 * The four portals share one design system and one shell; what changes is the
 * information architecture. A student navigates by their journey, a job seeker
 * by their search, a business by its requests, and an admin by the operation.
 * Keeping these as data means the shell has no role logic in it at all.
 */

export type DemoNavItem = { href: string; label: string; icon: IconKey; badge?: number };
export type IconKey =
  | "dashboard" | "journey" | "applications" | "universities" | "documents"
  | "scholarships" | "messages" | "consultations" | "profile" | "settings"
  | "jobs" | "interviews" | "requests" | "services" | "users" | "activity";

export const demoNav: Record<DemoRole, DemoNavItem[]> = {
  admin: [
    { href: "", label: "Dashboard", icon: "dashboard" },
    { href: "users", label: "Users", icon: "users" },
    { href: "requests", label: "Requests", icon: "requests", badge: 17 },
    { href: "documents", label: "Documents", icon: "documents", badge: 9 },
    { href: "messages", label: "Messages", icon: "messages", badge: 6 },
    { href: "consultations", label: "Consultations", icon: "consultations" },
    { href: "settings", label: "Settings", icon: "settings" },
  ],
  student: [
    { href: "", label: "Dashboard", icon: "dashboard" },
    { href: "journey", label: "My Journey", icon: "journey" },
    { href: "applications", label: "Applications", icon: "applications" },
    { href: "universities", label: "Universities", icon: "universities" },
    { href: "documents", label: "Documents", icon: "documents", badge: 2 },
    { href: "scholarships", label: "Scholarships", icon: "scholarships" },
    { href: "messages", label: "Messages", icon: "messages", badge: 1 },
    { href: "consultations", label: "Consultations", icon: "consultations" },
    { href: "profile", label: "Profile", icon: "profile" },
    { href: "settings", label: "Settings", icon: "settings" },
  ],
  "job-seeker": [
    { href: "", label: "Dashboard", icon: "dashboard" },
    { href: "profile", label: "My Profile", icon: "profile" },
    { href: "jobs", label: "Jobs", icon: "jobs", badge: 2 },
    { href: "applications", label: "Applications", icon: "applications" },
    { href: "documents", label: "CV & Documents", icon: "documents", badge: 1 },
    { href: "interviews", label: "Interviews", icon: "interviews", badge: 1 },
    { href: "messages", label: "Messages", icon: "messages" },
    { href: "consultations", label: "Consultations", icon: "consultations" },
    { href: "settings", label: "Settings", icon: "settings" },
  ],
  business: [
    { href: "", label: "Dashboard", icon: "dashboard" },
    { href: "requests", label: "My Requests", icon: "requests", badge: 1 },
    { href: "services", label: "Services", icon: "services" },
    { href: "documents", label: "Documents", icon: "documents", badge: 1 },
    { href: "messages", label: "Messages", icon: "messages" },
    { href: "consultations", label: "Consultations", icon: "consultations" },
    { href: "profile", label: "Company Profile", icon: "profile" },
    { href: "settings", label: "Settings", icon: "settings" },
  ],
};

export const roleLabel: Record<DemoRole, string> = {
  admin: "Super Admin",
  student: "Student",
  "job-seeker": "Job Seeker",
  business: "Business",
};

/** Where each role's shell says you are, in its own language. */
export const roleContext: Record<DemoRole, { eyebrow: string; greeting: string }> = {
  admin: { eyebrow: "Operations", greeting: "Here's what the platform needs from you today." },
  student: { eyebrow: "Study journey", greeting: "Here's what's happening with your study abroad journey." },
  "job-seeker": { eyebrow: "Career journey", greeting: "Here's where your international job search stands." },
  business: { eyebrow: "Business services", greeting: "Manage your SnZ Ventures business services and requests." },
};
