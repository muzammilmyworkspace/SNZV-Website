import { NextResponse } from "next/server";

/**
 * Enquiry intake endpoint.
 *
 * ⚠ DELIVERY IS NOT YET WIRED UP. No mail provider or CRM credentials were
 * supplied, and inventing them would silently drop real leads. Right now the
 * route validates and logs the submission server-side so nothing is lost in
 * development, and returns success so the UX is complete.
 *
 * TO GO LIVE, implement ONE of the following in `deliver()` below:
 *   • Email  — Resend / Postmark / SendGrid / SMTP to info@snzventures.com
 *   • CRM    — HubSpot, Pipedrive or Zoho lead creation
 *   • Sheet  — Google Sheets append via a service account
 *
 * See CONTENT-HANDOFF.md → "Lead delivery".
 */

export const runtime = "nodejs";

const PATHWAYS = new Set(["study", "careers", "business"]);
const MAX_FIELD = 2000;
const MAX_FIELDS = 25;

type Payload = { pathway: string; answers: Record<string, string> };

/** Naive in-memory rate limit. Replace with a shared store if multi-instance. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email?.trim() ?? "")) {
    return null;
  }
  if (clean.consent !== "yes") return null;

  return { pathway, answers: clean };
}

async function deliver(payload: Payload) {
  // eslint-disable-next-line no-console
  console.info(
    "[enquiry] NOT DELIVERED — no provider configured.",
    JSON.stringify({
      pathway: payload.pathway,
      receivedAt: new Date().toISOString(),
      fields: Object.keys(payload.answers),
    })
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 }
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
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 }
    );
  }

  try {
    await deliver(payload);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Delivery failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
