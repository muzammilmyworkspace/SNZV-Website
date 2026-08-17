import { NextResponse } from "next/server";
import { sendMail, mailConfigured, DEFAULT_TO } from "@/lib/mail";
import { company } from "@/data/company";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";

/**
 * Enquiry intake — every public form on the site posts here.
 *
 * Delivery goes to info@snzventures.com via lib/mail (Resend or a webhook,
 * chosen by environment variable). If no transport is configured the route
 * returns 503 and the form surfaces the direct email and WhatsApp details,
 * rather than showing a success screen for a message nobody received.
 */

export const runtime = "nodejs";

const PATHWAYS = new Set(["study", "careers", "business", "general"]);
const MAX_FIELD = 2000;
const MAX_FIELDS = 25;

type Payload = { pathway: string; answers: Record<string, string> };

const LABELS: Record<string, string> = {
  study: "Study abroad",
  careers: "Global career",
  business: "Business setup",
  general: "General enquiry",
};

function validate(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;
  const { pathway, answers } = body as Record<string, unknown>;

  if (typeof pathway !== "string" || !PATHWAYS.has(pathway)) return null;
  if (typeof answers !== "object" || answers === null) return null;

  const entries = Object.entries(answers as Record<string, unknown>);
  if (entries.length > MAX_FIELDS) return null;

  const clean: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (typeof v !== "string") continue;
    clean[k.slice(0, 60)] = v.slice(0, MAX_FIELD);
  }

  if (!clean.name?.trim()) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email?.trim() ?? "")) return null;
  if (clean.consent !== "yes") return null;

  return { pathway, answers: clean };
}

function format({ pathway, answers }: Payload): string {
  const { name, email, phone, preferredContact, notes, consent, ...rest } = answers;
  void consent;

  const lines = [
    `New enquiry — ${LABELS[pathway] ?? pathway}`,
    "",
    `Name:      ${name}`,
    `Email:     ${email}`,
    phone ? `Phone:     ${phone}` : null,
    preferredContact ? `Prefers:   ${preferredContact}` : null,
    "",
    "— Details —",
    ...Object.entries(rest).map(
      ([k, v]) => `${k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}: ${v}`
    ),
    notes ? `\nNotes:\n${notes}` : null,
    "",
    `Received: ${new Date().toISOString()}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

export async function POST(request: Request) {
  const limit = rateLimit(`enquiry:${clientIp(request)}`, {
    limit: 6,
    windowMs: 10 * 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = validate(body);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  if (!mailConfigured()) {
    // eslint-disable-next-line no-console
    console.warn(
      "[enquiry] NOT DELIVERED — no mail transport configured. Set RESEND_API_KEY or MAIL_WEBHOOK_URL.",
      JSON.stringify({ pathway: payload.pathway, fields: Object.keys(payload.answers) })
    );
    return NextResponse.json(
      {
        ok: false,
        error: "unconfigured",
        // Name the address. "Email us directly" without it makes the visitor
        // go hunting at exactly the moment they were ready to convert.
        message: `Our enquiry system isn't accepting messages right now. Please email ${
          process.env.MAIL_TO ?? company.contact.consultationEmail ?? DEFAULT_TO
        } and we'll pick it up.`,
      },
      { status: 503 }
    );
  }

  try {
    await sendMail({
      // Consultation enquiries go to the client-specified consultation
      // address; MAIL_TO still overrides it from the environment.
      to: process.env.MAIL_TO ?? company.contact.consultationEmail ?? DEFAULT_TO,
      subject: `SnZ enquiry — ${LABELS[payload.pathway] ?? payload.pathway} — ${payload.answers.name}`,
      text: format(payload),
      replyTo: payload.answers.email,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[enquiry] delivery failed:", error);
    return NextResponse.json(
      { ok: false, error: "Delivery failed. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
