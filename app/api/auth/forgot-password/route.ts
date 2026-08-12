import { NextResponse } from "next/server";
import { users } from "@/lib/auth/store";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { sendMail, mailConfigured } from "@/lib/mail";
import { createToken, authConfigured } from "@/lib/auth/session";
import { company } from "@/data/company";

export const runtime = "nodejs";

/**
 * Password reset request.
 *
 * Always returns the same response whether or not the address is registered —
 * an account-existence oracle here is a real privacy leak.
 *
 * The reset link carries a short-lived signed token (30 min). If no mail
 * provider is configured the token is logged server-side instead of emailed,
 * so the flow is testable in development without pretending mail was sent.
 */
export async function POST(request: Request) {
  const generic = NextResponse.json({
    ok: true,
    message:
      "If that address has an account, we've sent reset instructions to it.",
  });

  if (!authConfigured()) return generic;

  const limit = rateLimit(`forgot:${clientIp(request)}`, {
    limit: 5,
    windowMs: 30 * 60_000,
  });
  if (!limit.ok) return generic;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return generic;
  }

  const { email } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string") return generic;

  const user = await users.findByEmail(email);
  if (!user) return generic;

  // 30-minute single-purpose token. Reuses the session signer with a short TTL.
  const token = createToken(
    { userId: user.id, email: user.email, role: user.role, name: user.name },
    30 * 60
  );

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? company.siteUrl;
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;

  if (mailConfigured()) {
    await sendMail({
      to: user.email,
      subject: "Reset your SnZ Ventures password",
      text: [
        `Hello ${user.name},`,
        "",
        "Use the link below to set a new password. It expires in 30 minutes.",
        link,
        "",
        "If you didn't ask for this, you can ignore this email — nothing has changed.",
        "",
        "SnZ Ventures",
      ].join("\n"),
    }).catch(() => undefined);
  } else {
    // eslint-disable-next-line no-console
    console.info(
      `[auth] No mail provider configured. Reset link for ${user.email}: ${link}`
    );
  }

  return generic;
}
