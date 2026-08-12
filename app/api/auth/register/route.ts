import { NextResponse } from "next/server";
import { users } from "@/lib/auth/store";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createToken, setSessionCookie, authConfigured } from "@/lib/auth/session";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { PATHWAY_TO_ROLE, type Role } from "@/lib/auth/types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Authentication is not configured on this server." },
      { status: 503 }
    );
  }

  const limit = rateLimit(`register:${clientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, password, pathway } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
  }
  if (typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Please choose a password." }, { status: 400 });
  }
  const pwError = validatePassword(password);
  if (pwError) {
    return NextResponse.json({ ok: false, error: pwError }, { status: 400 });
  }
  if (typeof pathway !== "string" || !(pathway in PATHWAY_TO_ROLE)) {
    return NextResponse.json({ ok: false, error: "Please choose what brings you here." }, { status: 400 });
  }

  const role: Role = PATHWAY_TO_ROLE[pathway as keyof typeof PATHWAY_TO_ROLE];

  const existing = await users.findByEmail(email);
  if (existing) {
    // Do not reveal which addresses are registered.
    return NextResponse.json(
      { ok: false, error: "We couldn't create that account. Try signing in instead." },
      { status: 409 }
    );
  }

  const user = await users.create({
    email,
    name,
    role,
    passwordHash: await hashPassword(password),
  });

  await setSessionCookie(
    createToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
  );

  return NextResponse.json({ ok: true, role: user.role });
}
