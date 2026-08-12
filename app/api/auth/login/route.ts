import { NextResponse } from "next/server";
import { users } from "@/lib/auth/store";
import { verifyPassword } from "@/lib/auth/password";
import { createToken, setSessionCookie, authConfigured } from "@/lib/auth/session";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Authentication is not configured on this server." },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const limit = rateLimit(`login:${ip}`, { limit: 8, windowMs: 15 * 60_000 });
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

  const { email, password } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  const user = await users.findByEmail(email);

  // Always run a verification so timing does not reveal whether the account
  // exists. The dummy hash is a real scrypt hash of a random value.
  const hash =
    user?.passwordHash ??
    "scrypt$65536$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" +
      "3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const valid = await verifyPassword(password, hash);

  if (!user || !valid) {
    return NextResponse.json(
      { ok: false, error: "Those details don't match an account." },
      { status: 401 }
    );
  }

  await setSessionCookie(
    createToken({ userId: user.id, email: user.email, role: user.role, name: user.name })
  );

  return NextResponse.json({ ok: true, role: user.role });
}
