/**
 * DEMO DATA — every value in this file is INVENTED.
 * ---------------------------------------------------------------------------
 * ⚠ NOT REAL CLIENTS, NOT REAL METRICS, NOT REAL OUTCOMES.
 *
 * This exists so the four role interfaces can be reviewed without a database.
 * It is never written to Postgres, never seeded, and never rendered outside
 * `/demo` — which itself only exists when DEMO_MODE is on (see ./config.ts).
 *
 * The public marketing site holds itself to a rule that no statistic appears
 * unless the client can substantiate it. That rule is intact: nothing here
 * reaches a public page. These numbers describe a fictional platform state so
 * an empty dashboard does not have to be evaluated on empty states alone.
 *
 * NAMES ARE DELIBERATELY OBVIOUS PLACEHOLDERS and the demo shell shows a
 * permanent banner, so no screenshot of this can be mistaken for production.
 *
 * SHAPE MATCHES THE REAL SCHEMA. Field names follow lib/db/repos/*, so
 * swapping a demo array for a repository call later is a change of source,
 * not a rewrite of the component.
 */

export type DemoStatus =
  | "new"
  | "in_progress"
  | "action_required"
  | "under_review"
  | "completed"
  | "scheduled"
  | "cancelled"
  | "approved"
  | "rejected"
  | "pending";

/* ═══════════════════════════════════════════════════ the four demo people ═ */

export const demoIdentities = {
  admin: {
    name: "SNZ Ventures Admin",
    email: "admin@demo.snzventures.com",
    role: "Super Admin",
    initials: "SA",
    subtitle: "Manage the entire SNZ Ventures platform.",
  },
  student: {
    name: "Sarah Ahmed",
    email: "sarah.ahmed@demo.example",
    role: "Student",
    initials: "SA",
    subtitle: "Manage your study abroad journey, applications and documents.",
  },
  "job-seeker": {
    name: "Ali Khan",
    email: "ali.khan@demo.example",
    role: "Job Seeker",
    initials: "AK",
    subtitle: "Manage your job search, applications and documents.",
  },
  business: {
    name: "Example Technologies Ltd.",
    email: "ops@exampletech.demo",
    role: "Business",
    initials: "ET",
    subtitle: "Manage your business requests, documents and services.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════ SUPER ADMIN ═ */

export const adminMetrics = [
  { label: "Total students", value: 172, href: "/demo/admin/users?tab=students" },
  { label: "Total job seekers", value: 48, href: "/demo/admin/users?tab=job-seekers" },
  { label: "Total businesses", value: 25, href: "/demo/admin/users?tab=businesses" },
  { label: "Active applications", value: 63, href: "/demo/admin/requests" },
  { label: "Pending requests", value: 17, href: "/demo/admin/requests?status=new", urgent: true },
  { label: "Pending documents", value: 9, href: "/demo/admin/documents", urgent: true },
  { label: "Unread messages", value: 6, href: "/demo/admin/messages", urgent: true },
  { label: "Upcoming consultations", value: 4, href: "/demo/admin/consultations" },
];

export const adminActivity = [
  { who: "Sarah Ahmed", role: "Student", what: "uploaded Passport", when: "12 minutes ago", kind: "document" },
  { who: "Example Technologies Ltd.", role: "Business", what: "submitted a new request — European Company Setup", when: "1 hour ago", kind: "request" },
  { who: "Ali Khan", role: "Job Seeker", what: "updated their CV", when: "3 hours ago", kind: "document" },
  { who: "Fatima Noor", role: "Student", what: "application moved to Offer Received", when: "5 hours ago", kind: "status" },
  { who: "Hassan Raza", role: "Job Seeker", what: "interview scheduled with Siemens Energy", when: "Yesterday", kind: "status" },
  { who: "Nordwind Logistics GmbH", role: "Business", what: "document verification returned for changes", when: "Yesterday", kind: "document" },
  { who: "Ayesha Malik", role: "Student", what: "started a conversation with the desk", when: "2 days ago", kind: "message" },
];

export const adminUsers = [
  { name: "Sarah Ahmed", email: "sarah.ahmed@demo.example", role: "Student", status: "active", registered: "2026-06-14", lastActive: "Today" },
  { name: "Ali Khan", email: "ali.khan@demo.example", role: "Job Seeker", status: "active", registered: "2026-05-02", lastActive: "3 hours ago" },
  { name: "Example Technologies Ltd.", email: "ops@exampletech.demo", role: "Business", status: "active", registered: "2026-04-21", lastActive: "1 hour ago" },
  { name: "Fatima Noor", email: "fatima.noor@demo.example", role: "Student", status: "active", registered: "2026-06-30", lastActive: "5 hours ago" },
  { name: "Hassan Raza", email: "hassan.raza@demo.example", role: "Job Seeker", status: "active", registered: "2026-03-11", lastActive: "Yesterday" },
  { name: "Nordwind Logistics GmbH", email: "eu@nordwind.demo", role: "Business", status: "active", registered: "2026-02-08", lastActive: "Yesterday" },
  { name: "Ayesha Malik", email: "ayesha.malik@demo.example", role: "Student", status: "pending", registered: "2026-08-02", lastActive: "2 days ago" },
  { name: "Bilal Sheikh", email: "bilal.sheikh@demo.example", role: "Job Seeker", status: "suspended", registered: "2026-01-19", lastActive: "3 weeks ago" },
];

export const adminRequests = [
  { ref: "SNZ-2026-0041", who: "Sarah Ahmed", type: "Student", subject: "MSc Computer Science — Vilnius University", status: "under_review" as DemoStatus, submitted: "2026-08-09", waiting: "8 days", priority: "normal" },
  { ref: "SNZ-2026-0040", who: "Example Technologies Ltd.", type: "Business", subject: "European company setup — Lithuania", status: "in_progress" as DemoStatus, submitted: "2026-08-07", waiting: "10 days", priority: "high" },
  { ref: "SNZ-2026-0039", who: "Ali Khan", type: "Job Seeker", subject: "Software Engineer placement — Germany", status: "action_required" as DemoStatus, submitted: "2026-08-05", waiting: "12 days", priority: "high" },
  { ref: "SNZ-2026-0038", who: "Fatima Noor", type: "Student", subject: "BSc Business Administration — Riga", status: "completed" as DemoStatus, submitted: "2026-07-28", waiting: "—", priority: "normal" },
  { ref: "SNZ-2026-0037", who: "Nordwind Logistics GmbH", type: "Business", subject: "Document verification — shareholder records", status: "action_required" as DemoStatus, submitted: "2026-07-25", waiting: "23 days", priority: "urgent" },
  { ref: "SNZ-2026-0036", who: "Hassan Raza", type: "Job Seeker", subject: "Mechanical Engineer — Netherlands", status: "new" as DemoStatus, submitted: "2026-08-14", waiting: "3 days", priority: "normal" },
];

export const adminDocuments = [
  { owner: "Sarah Ahmed", role: "Student", document: "Passport", uploaded: "Today", status: "pending" as DemoStatus },
  { owner: "Ali Khan", role: "Job Seeker", document: "CV — updated", uploaded: "3 hours ago", status: "pending" as DemoStatus },
  { owner: "Example Technologies Ltd.", role: "Business", document: "Certificate of incorporation", uploaded: "Yesterday", status: "pending" as DemoStatus },
  { owner: "Fatima Noor", role: "Student", document: "Academic transcript", uploaded: "Yesterday", status: "approved" as DemoStatus },
  { owner: "Nordwind Logistics GmbH", role: "Business", document: "Shareholder register", uploaded: "2 days ago", status: "rejected" as DemoStatus, note: "Page 2 is unreadable — please re-scan at higher resolution." },
  { owner: "Hassan Raza", role: "Job Seeker", document: "Degree certificate", uploaded: "3 days ago", status: "pending" as DemoStatus },
];

export const adminConversations = [
  { who: "Sarah Ahmed", group: "Students", preview: "Thank you — I've uploaded the passport scan now.", when: "12 min", unread: 2 },
  { who: "Ali Khan", group: "Job Seekers", preview: "Could we move the interview prep call to Thursday?", when: "3 hr", unread: 1 },
  { who: "Example Technologies Ltd.", group: "Businesses", preview: "Confirming the registered address for the filing.", when: "1 hr", unread: 3 },
  { who: "Fatima Noor", group: "Students", preview: "That's brilliant news, thank you for the update.", when: "Yesterday", unread: 0 },
  { who: "Nordwind Logistics GmbH", group: "Businesses", preview: "Re-scanning the register today.", when: "Yesterday", unread: 0 },
];

export const adminConsultations = [
  { who: "Sarah Ahmed", type: "Application review", when: "19 Aug 2026, 10:00", status: "scheduled" as DemoStatus },
  { who: "Example Technologies Ltd.", type: "Business setup consultation", when: "19 Aug 2026, 14:30", status: "scheduled" as DemoStatus },
  { who: "Hassan Raza", type: "Initial career assessment", when: "21 Aug 2026, 09:00", status: "new" as DemoStatus },
  { who: "Ali Khan", type: "Interview preparation", when: "22 Aug 2026, 16:00", status: "scheduled" as DemoStatus },
  { who: "Fatima Noor", type: "Visa guidance", when: "11 Aug 2026, 11:00", status: "completed" as DemoStatus },
  { who: "Bilal Sheikh", type: "Career assessment", when: "05 Aug 2026, 15:00", status: "cancelled" as DemoStatus },
];

/* ═══════════════════════════════════════════════════════════════ STUDENT ═ */

export const studentJourney = [
  { name: "Profile", state: "done" as const, date: "14 Jun 2026" },
  { name: "University shortlist", state: "done" as const, date: "02 Jul 2026" },
  { name: "Application", state: "current" as const, date: "09 Aug 2026" },
  { name: "Offer", state: "upcoming" as const },
  { name: "Visa", state: "upcoming" as const },
  { name: "Departure", state: "upcoming" as const },
];

export const studentNextAction = {
  title: "Passport required",
  body: "Upload your passport to continue your application. Vilnius University needs it before they can issue a conditional offer.",
  cta: "Upload document",
  href: "/demo/student/documents",
};

export const studentApplications = [
  { university: "Vilnius University", programme: "MSc Computer Science", country: "Lithuania", intake: "September 2026", status: "under_review" as DemoStatus },
  { university: "Riga Technical University", programme: "MSc Software Engineering", country: "Latvia", intake: "September 2026", status: "in_progress" as DemoStatus },
  { university: "University of Warsaw", programme: "MSc Data Science", country: "Poland", intake: "February 2027", status: "new" as DemoStatus },
];

export const studentDocuments = [
  { name: "Passport", category: "Identity", status: "action_required" as DemoStatus, note: "Not yet uploaded — required before an offer can be issued." },
  { name: "Academic transcript", category: "Education", status: "approved" as DemoStatus, uploaded: "02 Jul 2026" },
  { name: "Degree certificate", category: "Education", status: "approved" as DemoStatus, uploaded: "02 Jul 2026" },
  { name: "IELTS result", category: "Education", status: "under_review" as DemoStatus, uploaded: "09 Aug 2026" },
  { name: "Statement of purpose", category: "Profile", status: "rejected" as DemoStatus, note: "Please expand the section on why this programme specifically." },
  { name: "Proof of funds", category: "Financial", status: "pending" as DemoStatus },
];

export const studentScholarships = [
  { name: "Lithuanian State Scholarship", provider: "Education Exchanges Support Foundation", value: "Tuition + monthly stipend", level: "Master's", deadline: "01 Apr 2026", eligible: true },
  { name: "Erasmus Mundus Joint Masters", provider: "European Commission", value: "Full tuition + travel + living", level: "Master's", deadline: "Varies by programme", eligible: true },
  { name: "Vilnius University Merit Award", provider: "Vilnius University", value: "Partial tuition reduction", level: "Master's", deadline: "30 Jun 2026", eligible: false },
];

export const studentUniversities = [
  { name: "Vilnius University", country: "Lithuania", city: "Vilnius", founded: "1579", note: "Shortlisted — application submitted" },
  { name: "Riga Technical University", country: "Latvia", city: "Riga", founded: "1862", note: "Shortlisted — preparing application" },
  { name: "University of Warsaw", country: "Poland", city: "Warsaw", founded: "1816", note: "Considering for February intake" },
  { name: "Tallinn University of Technology", country: "Estonia", city: "Tallinn", founded: "1918", note: "Suggested by your advisor" },
];

/* ════════════════════════════════════════════════════════════ JOB SEEKER ═ */

export const jobSeekerJourney = [
  { name: "Profile", state: "done" as const, date: "02 May 2026" },
  { name: "CV", state: "done" as const, date: "18 May 2026" },
  { name: "Job matching", state: "done" as const, date: "21 Jun 2026" },
  { name: "Applications", state: "current" as const, date: "05 Aug 2026" },
  { name: "Interview", state: "upcoming" as const },
  { name: "Placement", state: "upcoming" as const },
];

export const jobSeekerNextAction = {
  title: "Your CV needs updating",
  body: "Two employers asked for your most recent role to be included. Updating it now keeps both applications moving.",
  cta: "Update CV",
  href: "/demo/job-seeker/documents",
};

export const jobSeekerHighlights = [
  { value: 3, label: "Applications under review" },
  { value: 1, label: "Interview scheduled" },
  { value: 2, label: "New matches this week" },
  { value: 1, label: "Action required" },
];

export const jobSeekerApplications = [
  { role: "Software Engineer", employer: "Deutsche Telekom", country: "Germany", city: "Berlin", status: "scheduled" as DemoStatus, note: "Interview 22 Aug, 16:00" },
  { role: "Backend Developer", employer: "Wise", country: "Estonia", city: "Tallinn", status: "under_review" as DemoStatus },
  { role: "Platform Engineer", employer: "Vinted", country: "Lithuania", city: "Vilnius", status: "under_review" as DemoStatus },
  { role: "DevOps Engineer", employer: "Adyen", country: "Netherlands", city: "Amsterdam", status: "under_review" as DemoStatus },
  { role: "Systems Engineer", employer: "Siemens Energy", country: "Germany", city: "Munich", status: "rejected" as DemoStatus, note: "Role filled internally." },
];

export const jobSeekerMatches = [
  { role: "Senior Backend Engineer", employer: "Bolt", country: "Estonia", salary: "€60,000 – €78,000", match: "Strong match" },
  { role: "Cloud Engineer", employer: "Nord Security", country: "Lithuania", salary: "€48,000 – €62,000", match: "Strong match" },
  { role: "Software Engineer (Java)", employer: "ING Tech", country: "Poland", salary: "€42,000 – €55,000", match: "Worth a look" },
];

export const jobSeekerInterviews = [
  { employer: "Deutsche Telekom", role: "Software Engineer", when: "22 Aug 2026, 16:00", format: "Video — 45 minutes", status: "scheduled" as DemoStatus },
  { employer: "Wise", role: "Backend Developer", when: "Awaiting confirmation", format: "Technical screen", status: "pending" as DemoStatus },
];

export const jobSeekerDocuments = [
  { name: "CV", category: "Profile", status: "action_required" as DemoStatus, note: "Two employers asked for your most recent role to be added." },
  { name: "Passport", category: "Identity", status: "approved" as DemoStatus, uploaded: "02 May 2026" },
  { name: "Degree certificate", category: "Credentials", status: "under_review" as DemoStatus, uploaded: "14 Aug 2026" },
  { name: "Reference letters", category: "Credentials", status: "approved" as DemoStatus, uploaded: "18 May 2026" },
  { name: "English certificate", category: "Credentials", status: "pending" as DemoStatus },
];

/* ══════════════════════════════════════════════════════════════ BUSINESS ═ */

export const businessRequests = [
  { name: "Company registration", detail: "UAB formation in Vilnius, single shareholder", status: "in_progress" as DemoStatus, ref: "SNZ-2026-0040", updated: "1 hour ago" },
  { name: "Business setup consultation", detail: "Structure and licensing scope review", status: "scheduled" as DemoStatus, ref: "SNZ-2026-0044", updated: "19 Aug, 14:30" },
  { name: "Document verification", detail: "Shareholder identity records", status: "action_required" as DemoStatus, ref: "SNZ-2026-0037", updated: "Yesterday" },
  { name: "Corporate bank introduction", detail: "Awaiting entity registration to complete", status: "new" as DemoStatus, ref: "SNZ-2026-0046", updated: "3 days ago" },
];

export const businessNextAction = {
  title: "Shareholder records need re-uploading",
  body: "Page 2 of the shareholder register was unreadable. A clearer scan lets the registration filing continue this week.",
  cta: "Upload document",
  href: "/demo/business/documents",
};

export const businessServices = [
  { name: "Company formation", blurb: "Incorporation, registered address and initial filings in Lithuania.", status: "in_progress" as DemoStatus, action: "View progress" },
  { name: "Accounting & tax compliance", blurb: "Monthly bookkeeping, VAT registration and annual reporting.", status: "new" as DemoStatus, action: "Request service" },
  { name: "Fintech & payments licensing", blurb: "Scope assessment and submission through licensed partner firms.", status: "new" as DemoStatus, action: "Request service" },
  { name: "International recruitment", blurb: "Sourcing and relocation support for roles you cannot fill locally.", status: "new" as DemoStatus, action: "Request service" },
  { name: "Investor & founder relocation", blurb: "Residence routes for founders and their families.", status: "new" as DemoStatus, action: "Request service" },
  { name: "Market entry strategy", blurb: "Jurisdiction comparison and go-to-market planning.", status: "completed" as DemoStatus, action: "View summary" },
];

export const businessDocuments = [
  { name: "Certificate of incorporation", category: "Company", status: "under_review" as DemoStatus, uploaded: "Yesterday" },
  { name: "Shareholder register", category: "Company", status: "rejected" as DemoStatus, note: "Page 2 is unreadable — please re-scan at higher resolution." },
  { name: "Passport — director", category: "Identity", status: "approved" as DemoStatus, uploaded: "21 Apr 2026" },
  { name: "Proof of registered address", category: "Company", status: "approved" as DemoStatus, uploaded: "21 Apr 2026" },
  { name: "Source of funds evidence", category: "Compliance", status: "pending" as DemoStatus },
];

export const businessProfile = {
  company: "Example Technologies Ltd.",
  incorporation: "Incorporated outside the EU",
  industry: "Technology & software",
  headcount: "11–50",
  currentMarkets: "United Arab Emirates, Pakistan",
  targetMarkets: "Lithuania, Germany, EU-wide",
  contact: "Operations Director",
};

/* ═════════════════════════════════════════════════════ shared collections ═ */

/** A conversation thread, reused by all three client roles. */
export const demoThread = [
  { from: "advisor", name: "Marta Kazlauskienė", body: "Welcome to SnZ Ventures. I'll be handling your case from here — anything you're unsure about, ask me directly rather than guessing.", when: "14 Jun, 09:12" },
  { from: "client", name: "You", body: "Thank you. I've uploaded my transcripts — is there anything else you need right away?", when: "14 Jun, 10:40" },
  { from: "advisor", name: "Marta Kazlauskienė", body: "Transcripts look good. The next thing is your passport scan — the university can't issue a conditional offer without it.", when: "14 Jun, 11:05" },
  { from: "client", name: "You", body: "Understood, I'll get that over this week.", when: "15 Jun, 08:20" },
  { from: "advisor", name: "Marta Kazlauskienė", body: "No rush, but the September intake closes for document submission on 1 September, so earlier is safer than later.", when: "15 Jun, 09:00" },
];

export const demoConsultations = [
  { type: "Application review", when: "19 Aug 2026, 10:00", advisor: "Marta Kazlauskienė", status: "scheduled" as DemoStatus },
  { type: "Initial assessment", when: "28 Jun 2026, 15:00", advisor: "Marta Kazlauskienė", status: "completed" as DemoStatus },
  { type: "Document walkthrough", when: "12 Jul 2026, 11:30", advisor: "Tomas Petrauskas", status: "completed" as DemoStatus },
];

export const demoNotifications = [
  { title: "Passport still required", body: "Your application cannot progress until this is uploaded.", when: "Today", unread: true },
  { title: "IELTS result received", body: "We've got it and it's with the review team.", when: "Yesterday", unread: true },
  { title: "Statement of purpose returned", body: "Your advisor has asked for one section to be expanded.", when: "2 days ago", unread: false },
  { title: "Academic transcript approved", body: "No further action needed on this document.", when: "5 days ago", unread: false },
];
