/**
 * QA ACCOUNTS — create or remove the four demo logins.
 *
 *   npm run qa:accounts -- --create
 *   npm run qa:accounts -- --remove
 *   npm run qa:accounts -- --list
 *
 * ⚠ THESE USE A DELIBERATELY WEAK PASSWORD ("12345"), which is far below the
 * ten-character policy the registration API enforces. That policy is not
 * bypassed for real users — this script writes the scrypt hash directly,
 * exactly as bootstrap-admin does, so no HTTP path accepts a short password.
 *
 * The accounts are therefore a REAL risk while they exist, on a real database.
 * They are named `*.demo@snzventures.com` so they are obvious in any listing,
 * and `--remove` deletes all four in one command. Remove them before the portal
 * carries a real client.
 *
 * The existing super admin is never touched: this script refuses to write to
 * any address that is not in its own fixed list.
 */
import "./lib/env.mjs";
import postgres from "postgres";
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);

/** The only addresses this script will ever touch. */
const ACCOUNTS = [
  { email: "admin.demo@snzventures.com", name: "QA Super Admin", role: "super_admin" },
  { email: "student.demo@snzventures.com", name: "QA Student", role: "student" },
  { email: "jobseeker.demo@snzventures.com", name: "QA Job Seeker", role: "professional" },
  { email: "business.demo@snzventures.com", name: "QA Business", role: "business" },
];

const PASSWORD = "12345";

const mode = process.argv.includes("--remove")
  ? "remove"
  : process.argv.includes("--list")
    ? "list"
    : process.argv.includes("--create")
      ? "create"
      : null;

if (!mode) {
  console.error(
    "\n  Usage:\n" +
      "    npm run qa:accounts -- --create\n" +
      "    npm run qa:accounts -- --remove\n" +
      "    npm run qa:accounts -- --list\n"
  );
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("\n  DATABASE_URL is not set.\n");
  process.exit(1);
}

// Same parameters as lib/auth/password.ts — keep these in sync.
async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, 64, {
    N: 65536, r: 8, p: 1, maxmem: 160 * 1024 * 1024,
  });
  return ["scrypt", 65536, 8, 1, salt.toString("base64"), derived.toString("base64")].join("$");
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.DATABASE_URL.includes("sslmode=disable") ? false : "require",
  prepare: false,
});

const EMAILS = ACCOUNTS.map((a) => a.email);

try {
  if (mode === "list") {
    const rows = await sql`
      SELECT email, name, role, status, created_at, last_login_at
      FROM users WHERE email = ANY(${EMAILS}) ORDER BY email
    `;
    console.log(
      rows.length
        ? "\n" + rows.map((r) => `  ${r.email.padEnd(34)} ${r.role.padEnd(14)} ${r.status}`).join("\n") + "\n"
        : "\n  No QA accounts present.\n"
    );
  }

  if (mode === "remove") {
    // Scoped to the fixed list, so this can never reach a real client or the
    // original super admin however it is invoked.
    const gone = await sql`DELETE FROM users WHERE email = ANY(${EMAILS}) RETURNING email`;
    console.log(`\n  Removed ${gone.length} QA account(s).\n`);
  }

  if (mode === "create") {
    const hash = await hashPassword(PASSWORD);
    for (const a of ACCOUNTS) {
      const existing = await sql`SELECT id FROM users WHERE lower(email) = ${a.email} LIMIT 1`;

      if (existing[0]) {
        await sql`
          UPDATE users
             SET name = ${a.name}, role = ${a.role}::user_role, status = 'active',
                 email_verified = TRUE, password_hash = ${hash}, updated_at = now()
           WHERE id = ${existing[0].id}
        `;
      } else {
        const [row] = await sql`
          INSERT INTO users (email, name, role, status, password_hash, email_verified)
          VALUES (${a.email}, ${a.name}, ${a.role}::user_role, 'active', ${hash}, TRUE)
          RETURNING id
        `;
        await sql`INSERT INTO profiles (user_id) VALUES (${row.id}) ON CONFLICT DO NOTHING`;
      }
      console.log(`  ready  ${a.email.padEnd(34)} ${a.role}`);
    }

    await sql`
      INSERT INTO audit_logs (actor_email, action, entity, meta)
      VALUES ('qa-script', 'admin.action', 'user',
              ${sql.json({ created: "qa_accounts", count: ACCOUNTS.length })})
    `;

    console.log(
      "\n  Password for all four: " + PASSWORD +
      "\n\n  ⚠ Weak by design, for QA only. Remove before real clients use this:" +
      "\n    npm run qa:accounts -- --remove\n"
    );
  }
} catch (error) {
  console.error("\n  Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
