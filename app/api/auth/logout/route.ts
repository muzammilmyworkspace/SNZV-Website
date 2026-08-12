import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { audit } from "@/lib/db/repos/audit";
import { clientIp } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (session) {
    await audit({
      action: "auth.logout",
      actorId: session.userId,
      actorEmail: session.email,
      ip: clientIp(request),
    });
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
