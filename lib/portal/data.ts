import type { Role } from "@/lib/auth/types";
import * as repo from "@/lib/db/repos/portal";
import { isDatabaseConfigured } from "@/lib/db/client";

/**
 * PORTAL DATA ACCESS
 * ---------------------------------------------------------------------------
 * Thin facade over the SQL repositories. Kept so components import one stable
 * module; all scoping and authorization lives in lib/db/repos/portal.ts, where
 * it is expressed in the query itself.
 *
 * Every function returns an empty collection when DATABASE_URL is unset, so an
 * unconfigured deployment renders honest empty states instead of crashing.
 */

export const isPortalBackendReady = isDatabaseConfigured;

export const getCases = repo.getCasesForClient;
export const getCasesForAdvisor = repo.getCasesForAdvisor;
export const getAllCases = repo.getAllCases;
export const getDocuments = repo.getDocumentsForOwner;
export const getDocumentsForReview = repo.getDocumentsForReview;
export const getTasks = repo.getTasksForUser;
export const getAppointments = repo.getAppointmentsForClient;
export const getAppointmentsForAdvisor = repo.getAppointmentsForAdvisor;
export const getConversations = repo.getConversationsForClient;
export const getConversationsForStaff = repo.getConversationsForStaff;
export const getNotifications = repo.getNotifications;
export const getOpportunities = repo.getPublishedOpportunities;
export const getAssignedClients = repo.getAssignedClients;
export const getAdminMetrics = repo.getAdminMetrics;

/* --------------------------------------------------- service definitions */

/**
 * Required document checklist per pathway. This is SERVICE DEFINITION, not
 * client data, so it is real and safe to render — it tells a new user exactly
 * what they will eventually be asked for.
 */
export const REQUIRED_DOCUMENTS: Record<string, { name: string; category: string }[]> = {
  student: [
    { name: "Passport", category: "Identity" },
    { name: "Academic certificates", category: "Education" },
    { name: "Transcripts", category: "Education" },
    { name: "Language certificate", category: "Education" },
    { name: "CV", category: "Profile" },
    { name: "Statement of purpose", category: "Profile" },
  ],
  professional: [
    { name: "Passport", category: "Identity" },
    { name: "CV", category: "Profile" },
    { name: "Qualification certificates", category: "Credentials" },
    { name: "Reference letters", category: "Credentials" },
    { name: "Language certificate", category: "Credentials" },
  ],
  business: [
    { name: "Passport (each shareholder)", category: "Identity" },
    { name: "Proof of address", category: "Identity" },
    { name: "Business plan or model summary", category: "Business" },
    { name: "Source of funds evidence", category: "Compliance" },
    { name: "Existing company documents", category: "Business" },
  ],
};

/**
 * Profile fields, used for progressive completion. Keys match the database
 * columns in lib/db/repos/profiles.ts, which whitelists writes per role.
 */
export const PROFILE_FIELDS: Record<
  string,
  { key: string; label: string; type: "text" | "select"; options?: string[] }[]
> = {
  student: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "nationality", label: "Nationality", type: "text" },
    { key: "level", label: "Level of study", type: "select", options: ["Bachelor's", "Master's", "PhD / research", "Professional qualification"] },
    { key: "field_of_study", label: "Field of study", type: "text" },
    { key: "destination", label: "Preferred destination", type: "text" },
    { key: "intake", label: "Preferred intake", type: "select", options: ["Next 6 months", "6–12 months", "Over a year away", "Undecided"] },
    { key: "scholarship", label: "Scholarship interest", type: "select", options: ["Essential", "Helpful", "Self-funded"] },
    { key: "budget", label: "Annual budget range", type: "text" },
    { key: "language_level", label: "Language level", type: "text" },
  ],
  professional: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "nationality", label: "Nationality", type: "text" },
    { key: "title", label: "Professional title", type: "text" },
    { key: "experience_years", label: "Years of experience", type: "select", options: ["Under 2", "2–5", "5–10", "10+"] },
    { key: "industry", label: "Industry", type: "text" },
    { key: "skills", label: "Key skills", type: "text" },
    { key: "destination", label: "Preferred countries", type: "text" },
    { key: "relocation", label: "Relocation readiness", type: "select", options: ["Immediately", "1–3 months", "3–6 months", "Exploring"] },
    { key: "language_level", label: "Language level", type: "text" },
  ],
  business: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "business_name", label: "Business name", type: "text" },
    { key: "industry", label: "Industry", type: "text" },
    { key: "current_location", label: "Current location", type: "text" },
    { key: "target_country", label: "Target country", type: "text" },
    { key: "objective", label: "Business objective", type: "select", options: ["Company formation", "Fintech licensing", "Market entry", "Relocation", "Hiring", "Not sure yet"] },
    { key: "company_type", label: "Preferred company type", type: "text" },
    { key: "stage", label: "Current stage", type: "select", options: ["Idea stage", "Trading outside the EU", "Have an EU entity", "Investor"] },
  ],
};

export function profileCompletion(
  role: Role,
  profile: Record<string, string>
): { percent: number; total: number; filled: number; missing: string[] } {
  const fields = PROFILE_FIELDS[role] ?? [];
  if (!fields.length) return { percent: 0, total: 0, filled: 0, missing: [] };

  const filled = fields.filter((f) => profile[f.key]?.trim()).length;
  const missing = fields.filter((f) => !profile[f.key]?.trim()).map((f) => f.label);

  return {
    percent: Math.round((filled / fields.length) * 100),
    total: fields.length,
    filled,
    missing,
  };
}
