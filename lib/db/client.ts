import postgres from "postgres";

/**
 * DATABASE CONNECTION
 * ---------------------------------------------------------------------------
 * postgres.js chosen over an ORM deliberately:
 *   • no code generation or extra build step on Vercel
 *   • no native bindings
 *   • works against any Postgres — Neon, Supabase, Vercel Postgres, RDS
 *
 * SERVERLESS: `max: 1` and a short idle timeout. Each lambda gets one
 * connection; use the provider's POOLED connection string (Neon `-pooler`,
 * Supabase port 6543) so concurrent invocations don't exhaust the server.
 *
 * BUILD SAFETY: the connection is created lazily on first query. Nothing here
 * runs at import time, so `next build` succeeds with no DATABASE_URL set —
 * which is exactly what happens on the very first deploy, before the variable
 * has been added. `isDatabaseConfigured()` lets the UI degrade honestly
 * instead of crashing.
 */

declare global {
  // eslint-disable-next-line no-var
  var __snzSql: ReturnType<typeof postgres> | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set.");
    this.name = "DatabaseNotConfiguredError";
  }
}

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfiguredError();

  return postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    // Managed Postgres providers terminate TLS at the pooler with certs that
    // don't chain to a public root; `require` keeps encryption without
    // demanding a verifiable chain. Never downgrade this to `false`.
    ssl: url.includes("sslmode=disable") ? false : "require",
    prepare: false, // transaction-pooling modes don't support prepared statements
    transform: { undefined: null },
  });
}

/** Lazily-created singleton. Reused across hot reloads and warm lambdas. */
export function db() {
  if (!globalThis.__snzSql) {
    globalThis.__snzSql = create();
  }
  return globalThis.__snzSql;
}

/**
 * Runs a query, returning `fallback` when no database is configured.
 * Used by read paths so a partially-configured deployment renders empty
 * states rather than a 500.
 */
export async function safeQuery<T>(
  run: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;
  try {
    return await run();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[db] query failed:", error);
    return fallback;
  }
}
