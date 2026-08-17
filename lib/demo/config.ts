/**
 * DEMO MODE — the switch, and the reasons it is built this way.
 * ---------------------------------------------------------------------------
 * Everything demo-related lives under `lib/demo/` and `app/demo/`. Deleting
 * those two directories and the DEMO_MODE line from .env removes the feature
 * entirely, with no edit to a single production file. That is the point.
 *
 * WHAT THIS IS NOT
 *
 * This is NOT an authentication bypass. It does not mint a session, does not
 * touch `lib/auth/session.ts`, and cannot reach the real database — the demo
 * pages read from `lib/demo/data.ts` and nothing else. Signing in through
 * /login is completely unaffected, and so is every guard.
 *
 * A demo visitor therefore cannot see one real client record, because there is
 * no code path from these routes to the database at all. That is a stronger
 * guarantee than "the bypass only grants a read-only role", which is the usual
 * shape of this feature and the usual way it leaks.
 *
 * THREE CONDITIONS, ALL REQUIRED
 *
 *   1. DEMO_MODE must be explicitly set. No default, no inference. It is not
 *      in .env.example's active values and `npm run dev:demo` sets it per
 *      process, so enabling it in production takes a deliberate dashboard edit.
 *   2. The process must not actually be executing on Vercel production.
 *   3. It is read on the server only. Nothing here is NEXT_PUBLIC_, so the
 *      client cannot claim demo mode by editing anything it holds.
 *
 * ON CHECKING (2) PROPERLY
 *
 * The obvious test — `VERCEL_ENV !== "production"` — is wrong, and quietly so.
 * `vercel env pull` writes the production values into .env.local, including
 * VERCEL_ENV="production", so a developer's own laptop then claims to be
 * production and the demo refuses to run locally for no good reason. That is
 * a false NEGATIVE, which is the harmless direction, but it also means the
 * variable is not evidence of anything.
 *
 * VERCEL_REGION is injected by the Vercel runtime when a function actually
 * executes there. It is not part of a pulled env file, so its presence is real
 * evidence of running ON Vercel rather than a value someone copied down.
 * Requiring both is what makes the check mean what it claims to.
 *
 * When disabled, `app/demo/layout.tsx` calls notFound(). Not a redirect, not a
 * 403 — the routes simply do not exist, so a production deployment gives no
 * indication that a demo mode was ever compiled in.
 */

/** True only when this process is really executing on Vercel's production. */
function onVercelProduction(): boolean {
  // VERCEL_REGION is injected by the runtime, not by `vercel env pull`, so it
  // distinguishes "running there" from "holding a copy of their variables".
  return Boolean(process.env.VERCEL_REGION) && process.env.VERCEL_ENV === "production";
}

export function isDemoEnabled(): boolean {
  if (onVercelProduction()) return false;

  const flag = process.env.DEMO_MODE;
  return flag === "1" || flag === "true";
}

/** The four audiences, in the order the chooser presents them. */
export const DEMO_ROLES = ["admin", "student", "job-seeker", "business"] as const;
export type DemoRole = (typeof DEMO_ROLES)[number];

export function isDemoRole(value: string): value is DemoRole {
  return (DEMO_ROLES as readonly string[]).includes(value);
}
