import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { users } from "@/lib/auth/store";
import { PROFILE_FIELDS } from "@/lib/portal/data";

export const runtime = "nodejs";

/**
 * Progressive profile save.
 *
 * Only keys declared in PROFILE_FIELDS for the caller's own role are accepted,
 * so a client cannot write arbitrary fields or another role's schema. The user
 * id always comes from the verified session, never from the request body.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const incoming = (body as { profile?: Record<string, unknown> })?.profile;
  if (typeof incoming !== "object" || incoming === null) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const allowed = new Set((PROFILE_FIELDS[session.role] ?? []).map((f) => f.key));

  const user = await users.findById(session.userId);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
  }

  const profile = { ...user.profile };
  for (const [key, value] of Object.entries(incoming)) {
    if (!allowed.has(key)) continue;
    if (typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, 400);
    if (trimmed) profile[key] = trimmed;
    else delete profile[key];
  }

  await users.update(user.id, { profile });

  return NextResponse.json({ ok: true });
}
