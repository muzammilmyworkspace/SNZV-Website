/**
 * Applies every migration to an in-memory Postgres (PGlite) and exercises the
 * representative queries the app runs, so SQL errors surface here rather than
 * against the production database.
 *
 *   npm run db:verify
 */
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "lib", "db", "migrations");
const db = new PGlite();
let failures = 0;

const check = async (label, fn) => {
  try {
    await fn();
    console.log(`  ok    ${label}`);
  } catch (error) {
    failures++;
    console.log(`  FAIL  ${label}\n        ${error.message?.split("\n")[0]}`);
  }
};

console.log("\nApplying migrations\n");
const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  const body = await fs.readFile(path.join(DIR, f), "utf8");
  await check(f, () => db.exec(body));
}

console.log("\nSchema shape\n");

const EXPECTED = [
  "users", "user_tokens", "profiles", "student_profiles", "professional_profiles",
  "business_profiles", "staff_assignments", "cases", "opportunities",
  "applications", "documents", "tasks", "appointments", "conversations",
  "messages", "notifications", "audit_logs",
];

await check("all tables present", async () => {
  const res = await db.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
  );
  const have = new Set(res.rows.map((r) => r.table_name));
  const missing = EXPECTED.filter((t) => !have.has(t));
  if (missing.length) throw new Error(`missing: ${missing.join(", ")}`);
});

await check("foreign keys wired", async () => {
  const res = await db.query(
    `SELECT count(*)::int AS n FROM information_schema.table_constraints
     WHERE constraint_type='FOREIGN KEY' AND table_schema='public'`
  );
  if (res.rows[0].n < 15) throw new Error(`only ${res.rows[0].n} foreign keys`);
});

await check("indexes created", async () => {
  const res = await db.query(
    `SELECT count(*)::int AS n FROM pg_indexes WHERE schemaname='public'`
  );
  if (res.rows[0].n < 25) throw new Error(`only ${res.rows[0].n} indexes`);
});

await check("row level security enabled on every table", async () => {
  const res = await db.query(
    `SELECT c.relname FROM pg_class c
     JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity = false`
  );
  const open = res.rows
    .map((r) => r.relname)
    .filter((t) => EXPECTED.includes(t));
  if (open.length) throw new Error(`RLS off: ${open.join(", ")}`);
});

await check("no permissive policy re-opens a table", async () => {
  // RLS with zero policies denies everything. A policy added later could undo
  // that, so the schema is expected to carry none at all.
  const res = await db.query(`SELECT count(*)::int AS n FROM pg_policies WHERE schemaname='public'`);
  if (res.rows[0].n !== 0) throw new Error(`${res.rows[0].n} policy(ies) present`);
});

console.log("\nConstraints\n");

await check("email uniqueness is case-insensitive", async () => {
  await db.query(
    `INSERT INTO users (email,name,role,password_hash) VALUES ('Case@Test.io','A','student','x')`
  );
  try {
    await db.query(
      `INSERT INTO users (email,name,role,password_hash) VALUES ('case@test.io','B','student','y')`
    );
  } catch {
    return; // rejected as intended
  }
  throw new Error("duplicate email was accepted");
});

await check("role enum rejects invalid values", async () => {
  try {
    await db.query(
      `INSERT INTO users (email,name,role,password_hash) VALUES ('r@t.io','R','root','x')`
    );
  } catch {
    return;
  }
  throw new Error("invalid role accepted");
});

await check("cascade delete removes dependent rows", async () => {
  const u = await db.query(
    `INSERT INTO users (email,name,role,password_hash) VALUES ('c@t.io','C','student','x') RETURNING id`
  );
  const id = u.rows[0].id;
  await db.query(`INSERT INTO profiles (user_id) VALUES ($1)`, [id]);
  await db.query(
    `INSERT INTO cases (client_id,pathway,title) VALUES ($1,'study','T')`, [id]
  );
  await db.query(`DELETE FROM users WHERE id=$1`, [id]);
  const left = await db.query(`SELECT count(*)::int AS n FROM cases WHERE client_id=$1`, [id]);
  if (left.rows[0].n !== 0) throw new Error("cases survived user deletion");
});

await check("staff assignment is unique per pair", async () => {
  const a = await db.query(
    `INSERT INTO users (email,name,role,password_hash) VALUES ('adv@t.io','Adv','advisor','x') RETURNING id`
  );
  const c = await db.query(
    `INSERT INTO users (email,name,role,password_hash) VALUES ('cli@t.io','Cli','student','x') RETURNING id`
  );
  await db.query(`INSERT INTO staff_assignments (client_id,advisor_id) VALUES ($1,$2)`, [
    c.rows[0].id, a.rows[0].id,
  ]);
  await db.query(
    `INSERT INTO staff_assignments (client_id,advisor_id) VALUES ($1,$2)
     ON CONFLICT (client_id, advisor_id) DO NOTHING`,
    [c.rows[0].id, a.rows[0].id]
  );
  const n = await db.query(`SELECT count(*)::int AS n FROM staff_assignments`);
  if (n.rows[0].n !== 1) throw new Error("duplicate assignment created");
});

console.log("\nApplication queries\n");

await check("admin metrics aggregate", async () => {
  await db.query(`
    SELECT
      (SELECT count(*)::int FROM users) AS total_users,
      (SELECT count(*)::int FROM users WHERE role='student') AS students,
      (SELECT count(*)::int FROM cases WHERE status NOT IN ('completed','closed')) AS open_cases,
      (SELECT count(*)::int FROM documents WHERE status IN ('uploaded','pending_review')) AS pending_documents,
      (SELECT count(*)::int FROM messages WHERE read_at IS NULL) AS unread_messages
  `);
});

await check("advisor case scoping join", async () => {
  await db.query(`
    SELECT c.*, u.name AS client_name, a.name AS advisor_name
    FROM cases c
    JOIN users u ON u.id = c.client_id
    LEFT JOIN users a ON a.id = c.advisor_id
    WHERE c.advisor_id = gen_random_uuid()
       OR EXISTS (SELECT 1 FROM staff_assignments sa
                  WHERE sa.advisor_id = gen_random_uuid() AND sa.client_id = c.client_id)
  `);
});

await check("conversation unread subquery", async () => {
  await db.query(`
    SELECT c.id, c.subject, c.updated_at,
           (SELECT count(*)::int FROM messages m
            WHERE m.conversation_id = c.id AND m.read_at IS NULL) AS unread
    FROM conversations c ORDER BY c.updated_at DESC
  `);
});

await check("user filter with nullable params", async () => {
  await db.query(
    `SELECT id FROM users
     WHERE ($1::text IS NULL OR name ILIKE $1)
       AND ($2::user_role IS NULL OR role = $2::user_role)
       AND ($3::user_status IS NULL OR status = $3::user_status)
     ORDER BY created_at DESC LIMIT 10`,
    [null, null, null]
  );
});

await check("audit insert with jsonb meta", async () => {
  await db.query(
    `INSERT INTO audit_logs (actor_email, action, entity, meta)
     VALUES ($1,$2,$3,$4)`,
    ["a@b.io", "auth.login", "user", JSON.stringify({ role: "student" })]
  );
});

await check("document review update", async () => {
  const u = await db.query(
    `INSERT INTO users (email,name,role,password_hash) VALUES ('d@t.io','D','student','x') RETURNING id`
  );
  const d = await db.query(
    `INSERT INTO documents (owner_id,name,category,status) VALUES ($1,'Passport','Identity','uploaded') RETURNING id`,
    [u.rows[0].id]
  );
  await db.query(
    `UPDATE documents SET status=$2::document_status, reviewed_at=now(), updated_at=now() WHERE id=$1`,
    [d.rows[0].id, "approved"]
  );
});

await db.close();

console.log(
  failures === 0
    ? "\n  Schema verified — all checks passed.\n"
    : `\n  ${failures} check(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
