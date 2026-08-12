import { NextResponse } from "next/server";
import { users } from "@/lib/auth/store";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import {
  verifyToken,
  createToken,
  setSessionCookie,
  authConfigured,
} from "@/lib/auth/session";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Authentication is not configured on this server." },
      { status: 503 }
    );
  }

  const limit = rateLimit(`reset:${clientIp(request)}`, {
    limit: 8,
    windowMs: 30 * 60_000,
  });
  if (!limit.ok) {
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

  const claims = verifyToken(token);
  if (!claims) {
    return NextResponse.json(
      { ok: false, error: "That reset link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const user = await users.findById(claims.userId);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "That reset link is no longer valid." },
      { status: 400 }
    );
  }

  await users.update(user.id, { passwordHash: await hashPassword(password) });

  await setSessionCookie(
    createToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
  );

  return NextResponse.json({ ok: true, role: user.role });
}
