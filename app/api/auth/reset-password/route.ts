import { NextResponse } from "next/server";
import * as store from "@/lib/auth/store";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createToken, setSessionCookie, authConfigured } from "@/lib/auth/session";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { audit } from "@/lib/db/repos/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!authConfigured() || !store.isStoreReady()) {
    return NextResponse.json(
      { ok: false, error: "The portal is not fully configured yet." },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  if (!rateLimit(`reset:${ip}`, { limit: 8, windowMs: 30 * 60_000 }).ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { token, password } = (body ?? {}) as Record<string, unknown>;
  if (typeof token !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const pwError = validatePassword(password);
  if (pwError) return NextResponse.json({ ok: false, error: pwError }, { status: 400 });

  const userId = await store.consumeToken(token, "password_reset");
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "That reset link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const user = await store.findById(userId);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "That reset link is no longer valid." },
      { status: 400 }
    );
  }

  await store.setPasswordHash(user.id, await hashPassword(password));
  await audit({
    action: "auth.password_reset",
    actorId: user.id,
    actorEmail: user.email,
    ip,
  });

  await setSessionCookie(
    createToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
  );

  return NextResponse.json({ ok: true, role: user.role });
}
