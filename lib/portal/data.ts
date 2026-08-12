import type {
  Role,
  CaseRecord,
  DocumentRecord,
  TaskRecord,
  ConversationRecord,
  AppointmentRecord,
  NotificationRecord,
  OpportunityRecord,
} from "@/lib/auth/types";

/**
 * PORTAL DATA ACCESS
 * ---------------------------------------------------------------------------
 * ⚠ There is no database yet, so every read below returns an EMPTY collection.
 *
 * This is deliberate. The alternative — seeding plausible-looking applications,
 * documents and messages — would show a client their own fabricated case file,
 * which is far worse than an honest empty state. Every screen therefore renders
 * its "nothing here yet" state and tells the user what will populate it.
 *
 * The functions are the seam: implement them against Postgres/Prisma and the
 * whole portal fills in with no component changes.
 *
 * REQUIRED TABLES (see CONTENT-HANDOFF.md → Portal backend):
 *   users, profiles, cases, documents, tasks, conversations, messages,
 *   appointments, notifications, opportunities, audit_log
 */

export const PORTAL_BACKEND_READY = false;

export async function getCases(_userId: string): Promise<CaseRecord[]> {
  void _userId;
  return [];
}

export async function getDocuments(_userId: string): Promise<DocumentRecord[]> {
  void _userId;
  return [];
}

export async function getTasks(_userId: string): Promise<TaskRecord[]> {
  void _userId;
  return [];
}

export async function getConversations(
  _userId: string
): Promise<ConversationRecord[]> {
  void _userId;
  return [];
}

export async function getAppointments(
  _userId: string
): Promise<AppointmentRecord[]> {
  void _userId;
  return [];
}

export async function getNotifications(
  _userId: string
): Promise<NotificationRecord[]> {
  void _userId;
  return [];
}

export async function getOpportunities(): Promise<OpportunityRecord[]> {
  return [];
}

/* ------------------------------------------------------------- derived */

/**
 * Required document checklist per role. This is service definition, not client
 * data, so it is real and safe to render — it tells a new user exactly what
 * they will eventually be asked for.
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
 * Profile field definitions, used for progressive completion. The percentage
 * shown to users is calculated from these against real stored values — it is
 * never a decorative number.
 */
export const PROFILE_FIELDS: Record<
  string,
  { key: string; label: string; type: "text" | "select"; options?: string[] }[]
> = {
  student: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "nationality", label: "Nationality", type: "text" },
    { key: "level", label: "Level of study", type: "select", options: ["Bachelor's", "Master's", "PhD / research", "Professional qualification"] },
    { key: "field", label: "Field of study", type: "text" },
    { key: "destination", label: "Preferred destination", type: "text" },
    { key: "intake", label: "Preferred intake", type: "select", options: ["Next 6 months", "6–12 months", "Over a year away", "Undecided"] },
    { key: "scholarship", label: "Scholarship interest", type: "select", options: ["Essential", "Helpful", "Self-funded"] },
    { key: "budget", label: "Annual budget range", type: "text" },
    { key: "language", label: "Language level", type: "text" },
  ],
  professional: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "nationality", label: "Nationality", type: "text" },
    { key: "title", label: "Professional title", type: "text" },
    { key: "experience", label: "Years of experience", type: "select", options: ["Under 2", "2–5", "5–10", "10+"] },
    { key: "industry", label: "Industry", type: "text" },
    { key: "skills", label: "Key skills", type: "text" },
    { key: "destination", label: "Preferred countries", type: "text" },
    { key: "relocation", label: "Relocation readiness", type: "select", options: ["Immediately", "1–3 months", "3–6 months", "Exploring"] },
    { key: "language", label: "Language level", type: "text" },
  ],
  business: [
    { key: "phone", label: "Phone / WhatsApp", type: "text" },
    { key: "businessName", label: "Business name", type: "text" },
    { key: "industry", label: "Industry", type: "text" },
    { key: "currentLocation", label: "Current location", type: "text" },
    { key: "targetCountry", label: "Target country", type: "text" },
    { key: "objective", label: "Business objective", type: "select", options: ["Company formation", "Fintech licensing", "Market entry", "Relocation", "Hiring", "Not sure yet"] },
    { key: "companyType", label: "Preferred company type", type: "text" },
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
