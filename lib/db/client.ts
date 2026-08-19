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

  /*
    POOL SIZE DEPENDS ON HOW THIS IS BEING RUN.

    On Vercel each invocation is its own isolate, so one connection per process
    is correct and more would exhaust the provider's pooler. Anywhere else —
    `next start`, a container, a VM — ONE process serves every concurrent
    request, and a single connection makes them queue behind each other.

    That is not theoretical: under load every request stacked on one connection
    until a statement sat long enough to hit Postgres' two-minute cap and was
    cancelled, which surfaced as a hung page rather than an error. The queries
    themselves measured 170-340ms.

    VERCEL_REGION is injected by the Vercel runtime when a function actually
    executes there. It is not written by `vercel env pull`, so it distinguishes
    "running on Vercel" from "holding a copy of Vercel's variables" — which a
    developer's .env.local does.
  */
  const onVercel = Boolean(process.env.VERCEL_REGION);

  return postgres(url, {
    max: onVercel ? 1 : 8,
    idle_timeout: 20,
    /*
      Shorter than a serverless function's budget, on purpose. Vercel kills an
      invocation at 10s by default; a 15s connect timeout meant the function
      died before the driver ever reported a connection problem, so the only
      evidence was FUNCTION_INVOCATION_TIMEOUT with nothing in the logs.
      Failing at 8s produces an actual error that says what went wrong.
    */
    connect_timeout: 8,
    /*
      Fail fast instead of hanging. The server default here is two minutes; a
      page that waits that long has already failed as far as anyone using it is
      concerned, and every second of it holds a connection others need. Fifteen
      seconds is far above the slowest real query measured (340ms), so this can
      only fire when something has genuinely gone wrong.
    */
    connection: { statement_timeout: 15_000 },
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
