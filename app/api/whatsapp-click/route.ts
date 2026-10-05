import { NextResponse } from "next/server";
import { cleanAttribution } from "@/lib/attribution";
import { markWhatsApp, recordWhatsAppClick } from "@/lib/db/repos/enquiries";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";

/**
 * A press of a WhatsApp link, sent by components/layout/AttributionTracker
 * with navigator.sendBeacon. Always answers 204: the visitor is already on
 * their way to WhatsApp and nothing here may slow or stop that.
 */
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const done = new NextResponse(null, { status: 204 });
  const ip = clientIp(request);
  if (!rateLimit(`wa:${ip}`, { limit: 30, windowMs: 10 * 60_000 }).ok) return done;

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return done;
  }
  const at = cleanAttribution(body);
  if (!at) return done;

  const placement = typeof body.placement === "string" ? body.placement.slice(0, 40) : "page";
  const enquiryId = typeof body.enquiryId === "string" && UUID.test(body.enquiryId) ? body.enquiryId : null;

  await recordWhatsAppClick({ placement, page: at.page, landing: at.landing, source: at.source, referrer: at.referrer, utm: at.utm, enquiryId, ip });
  if (enquiryId) await markWhatsApp(enquiryId);
  return done;
}
