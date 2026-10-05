import { NextResponse } from "next/server";
import { sendMail, mailConfigured, DEFAULT_TO } from "@/lib/mail";
import { createEnquiry, markDelivered } from "@/lib/db/repos/enquiries";
import { company } from "@/data/company";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { enquiryEmailSubject } from "@/lib/enquiry-message";
import { cleanAttribution } from "@/lib/attribution";

/**
 * Enquiry intake — every public form on the site posts here.
 *
 * Delivery goes to study@snzventures.com via lib/mail (Resend or a webhook,
 * chosen by environment variable). If no transport is configured the route
 * returns 503 and the form surfaces the direct email and WhatsApp details,
 * rather than showing a success screen for a message nobody received.
 */

export const runtime = "nodejs";

const PATHWAYS = new Set(["study", "careers", "business", "general"]);
const MAX_FIELD = 2000;
const MAX_FIELDS = 25;

type Payload = { pathway: string; answers: Record<string, string>; meta: ReturnType<typeof cleanAttribution> };

const LABELS: Record<string, string> = {
  study: "Study abroad",
  careers: "Global career",
  business: "Business setup",
  general: "General enquiry",
};

function validate(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;
  const { pathway, answers, meta } = body as Record<string, unknown>;

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

  return { pathway, answers: clean, meta: cleanAttribution(meta) };
}

function format({ pathway, answers, meta }: Payload): string {
  const { name, email, phone, preferredContact, notes, consent, ...rest } = answers;
  void consent;

  const lines = [
    `New enquiry: ${LABELS[pathway] ?? pathway}`,
    "",
    `Name:      ${name}`,
    `Email:     ${email}`,
    phone ? `Phone:     ${phone}` : null,
    preferredContact ? `Prefers:   ${preferredContact}` : null,
    "",
    "Details",
    ...Object.entries(rest).map(
      ([k, v]) => `${k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}: ${v}`
    ),
    notes ? `\nNotes:\n${notes}` : null,
    "",
    meta ? `Came from: ${meta.source}${meta.utm.utm_campaign ? ` (campaign: ${meta.utm.utm_campaign})` : ""}` : null,
    meta?.page ? `Form on:   ${meta.page}${meta.landing && meta.landing !== meta.page ? `, landed on ${meta.landing}` : ""}` : null,
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

  /*
    WRITTEN DOWN FIRST, EMAILED SECOND.

    This used to email the enquiry and store nothing. With no mail transport
    configured it answered 503 and logged a line to the server console, so every
    enquiry submitted was lost — on the primary conversion path of the entire
    marketing site. Even with mail working, a provider outage or a bounce would
    swallow a lead silently and nobody would know somebody had tried to reach us.

    Now delivery is a convenience on top of a record that already exists. The
    only case where the visitor is told to email instead is a failed WRITE,
    because that is the only case where we genuinely do not have their enquiry.
  */
  const ip = clientIp(request);
  const enquiryId = await createEnquiry({
    pathway: payload.pathway,
    name: String(payload.answers.name ?? ""),
    email: String(payload.answers.email ?? ""),
    phone: payload.answers.phone ?? null,
    preferredContact: payload.answers.preferredContact ?? null,
    notes: payload.answers.notes ?? null,
    answers: payload.answers,
    ip,
    attribution: payload.meta,
  });

  const fallbackAddress =
    process.env.MAIL_TO ?? company.contact.consultationEmail ?? DEFAULT_TO;

  /*
    NO DATABASE IS NOT THE SAME AS A LOST ENQUIRY.

    Writing first is right, but treating a failed write as the end of the road
    made the database a hard dependency of the public contact form. A
    deployment with a working mail transport and no DATABASE_URL — which is
    exactly the "marketing site now, portal later" setup README advertises as
    supported — answered 503 to every enquiry and threw it away, on the one
    form the whole site funnels towards.

    So the record and the delivery are now two independent chances to keep the
    lead, and the visitor is only turned away when BOTH have failed. Delivering
    without a stored row is worse than doing both (nothing to reconcile later,
    and it will not appear in the portal queue) but it is far better than
    losing the enquiry, so it is logged loudly rather than passed over.
  */
  if (!enquiryId) {
    if (mailConfigured()) {
      try {
        await sendMail({
          to: fallbackAddress,
          subject: enquiryEmailSubject(LABELS[payload.pathway] ?? payload.pathway, payload.answers.name),
          text: format(payload),
          replyTo: payload.answers.email,
        });
        // eslint-disable-next-line no-console
        console.error(
          "[enquiry] NOT STORED but emailed. The enquiry is safe in the inbox " +
            "and NOT in the portal queue. Set DATABASE_URL so enquiries are recorded."
        );
        return NextResponse.json({ ok: true, stored: false, delivered: true });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[enquiry] not stored AND delivery failed:", error);
      }
    }

    // eslint-disable-next-line no-console
    console.error("[enquiry] COULD NOT STORE OR SEND, the enquiry has been lost.");
    return NextResponse.json(
      {
        ok: false,
        error: "unavailable",
        // Name the address. "Email us directly" without it makes the visitor
        // go hunting at exactly the moment they were ready to convert.
        message: `We couldn't record that just now. Please email ${fallbackAddress} and we'll pick it up.`,
      },
      { status: 503 }
    );
  }

  if (!mailConfigured()) {
    /*
      The enquiry IS received — it is on the file and staff can see it in the
      portal — so telling the visitor it failed would be a lie that costs a
      lead. What is missing is the notification, which is an operator problem,
      not theirs. It is logged loudly so it does not go unnoticed.
    */
    // eslint-disable-next-line no-console
    console.warn(
      `[enquiry] stored ${enquiryId} but NOT EMAILED, no mail transport configured. ` +
        "Set RESEND_API_KEY or MAIL_WEBHOOK_URL. Enquiries are visible at /portal/admin/requests."
    );
    return NextResponse.json({ ok: true, id: enquiryId, stored: true, delivered: false });
  }

  try {
    await sendMail({
      // Consultation enquiries go to the client-specified consultation
      // address; MAIL_TO still overrides it from the environment.
      to: process.env.MAIL_TO ?? company.contact.consultationEmail ?? DEFAULT_TO,
      subject: enquiryEmailSubject(LABELS[payload.pathway] ?? payload.pathway, payload.answers.name),
      text: format(payload),
      replyTo: payload.answers.email,
    });
    await markDelivered(enquiryId);
  } catch (error) {
    /*
      Delivery failed but the enquiry is stored, so this is NOT the visitor's
      problem and telling them it failed would send a lead away from a message
      we already have. It stays `delivered = false`, which is what makes the
      undelivered queue in the portal worth looking at.
    */
    // eslint-disable-next-line no-console
    console.error(`[enquiry] stored ${enquiryId} but delivery failed:`, error);
    return NextResponse.json({ ok: true, id: enquiryId, stored: true, delivered: false });
  }

  return NextResponse.json({ ok: true, id: enquiryId });
}
