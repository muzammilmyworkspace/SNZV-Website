import { db, safeQuery, isDatabaseConfigured, withConnectionRetry } from "../client";
import type { Role } from "@/lib/auth/types";

/**
 * USER REPOSITORY
 * ---------------------------------------------------------------------------
 * The only place that reads or writes the users table. `password_hash` never
 * leaves this module except through `findAuthByEmail`, which exists solely for
 * the login path.
 */

export type DbUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: "active" | "suspended" | "pending";
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const norm = (email: string) => email.trim().toLowerCase();

const mapUser = (r: Record<string, unknown>): DbUser => ({
  id: String(r.id),
  email: String(r.email),
  name: String(r.name),
  role: r.role as Role,
  status: r.status as DbUser["status"],
  emailVerified: Boolean(r.email_verified),
  lastLoginAt: r.last_login_at ? new Date(r.last_login_at as string).toISOString() : null,
  createdAt: new Date(r.created_at as string).toISOString(),
});

export async function findByEmail(email: string): Promise<DbUser | null> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT id, email, name, role, status, email_verified, last_login_at, created_at
      FROM users WHERE lower(email) = ${norm(email)} LIMIT 1
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }, null);
}

export async function findById(id: string): Promise<DbUser | null> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT id, email, name, role, status, email_verified, last_login_at, created_at
      FROM users WHERE id = ${id} LIMIT 1
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }, null);
}

/**
 * Login path only — returns the hash so it can be verified, then discarded.
 *
 * `passwordHash` is NULLABLE because migration 003 allows provider-only
 * accounts, which genuinely have none. Callers must handle null rather than
 * assume a string; the login route already verifies against a dummy hash so
 * response timing does not reveal which case it hit.
 */
export async function findAuthByEmail(
  email: string
): Promise<(DbUser & { passwordHash: string | null }) | null> {
  if (!isDatabaseConfigured()) return null;
  /*
    Wrapped, because this is the sign-in read and it does NOT use safeQuery —
    a failure here must surface, not be swallowed into "wrong password". On a
    cold instance the first connection can fail; retrying once turns the 500
    that the first person after a deploy was seeing into a normal sign-in.
  */
  const rows = await withConnectionRetry(() => db()`
    SELECT id, email, name, role, status, email_verified, last_login_at,
           created_at, password_hash
    FROM users WHERE lower(email) = ${norm(email)} LIMIT 1
  `);
  if (!rows[0]) return null;
  return {
    ...mapUser(rows[0]),
    // Null for accounts that sign in with a provider rather than a password.
    passwordHash: rows[0].password_hash ? String(rows[0].password_hash) : null,
  };
}

export async function createUser(input: {
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
}): Promise<DbUser> {
  const rows = await db()`
    INSERT INTO users (email, name, role, password_hash)
    VALUES (${norm(input.email)}, ${input.name.trim()}, ${input.role}, ${input.passwordHash})
    RETURNING id, email, name, role, status, email_verified, last_login_at, created_at
  `;
  // Every user gets a profile row so later updates are a plain UPDATE.
  await db()`INSERT INTO profiles (user_id) VALUES (${rows[0].id}) ON CONFLICT DO NOTHING`;
  return mapUser(rows[0]);
}

/* -------------------------------------------------- federated identities */

/** Look up an account by its provider identity. Never by email. */
export async function findByOauthSubject(
  provider: "google",
  subject: string
): Promise<DbUser | null> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT id, email, name, role, status, email_verified, last_login_at, created_at
      FROM users
      WHERE auth_provider = ${provider}::auth_provider AND oauth_subject = ${subject}
      LIMIT 1
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }, null);
}

/**
 * Create an account from a verified provider identity.
 *
 * NO PASSWORD IS GENERATED. Migration 003 made `password_hash` nullable for
 * exactly this: an account created through Google genuinely has no password,
 * and minting a random hash nobody holds would produce a row that looks
 * password-capable and silently fails password recovery.
 *
 * `email_verified` is TRUE because the provider confirmed it — the caller is
 * responsible for having checked that, and app/api/auth/google/callback
 * refuses to reach this function otherwise.
 *
 * The role is hardcoded to `student`, the lowest-privilege client role. It is
 * never taken from the provider response.
 */
export async function createOauthUser(input: {
  email: string;
  name: string;
  provider: "google";
  subject: string;
  avatarUrl?: string | null;
}): Promise<DbUser | null> {
  return safeQuery(async () => {
    const rows = await db()`
      INSERT INTO users (email, name, role, auth_provider, oauth_subject, avatar_url, email_verified)
      VALUES (${norm(input.email)}, ${input.name.trim()}, 'student',
              ${input.provider}::auth_provider, ${input.subject},
              ${input.avatarUrl ?? null}, TRUE)
      RETURNING id, email, name, role, status, email_verified, last_login_at, created_at
    `;
    if (!rows[0]) return null;
    await db()`INSERT INTO profiles (user_id) VALUES (${rows[0].id}) ON CONFLICT DO NOTHING`;
    return mapUser(rows[0]);
  }, null);
}

export async function setPasswordHash(userId: string, passwordHash: string) {
  await db()`
    UPDATE users SET password_hash = ${passwordHash}, updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function markLogin(userId: string) {
  await safeQuery(
    async () => {
      await db()`UPDATE users SET last_login_at = now() WHERE id = ${userId}`;
      return true;
    },
    false
  );
}

export async function setEmailVerified(userId: string) {
  await db()`
    UPDATE users SET email_verified = TRUE, updated_at = now() WHERE id = ${userId}
  `;
}

/**
 * Role and status changes. Guarded at the call site by requireAdmin(); the
 * signature takes the actor so every change is auditable.
 */
export async function setRole(userId: string, role: Role) {
  await db()`UPDATE users SET role = ${role}, updated_at = now() WHERE id = ${userId}`;
}

export async function setStatus(userId: string, status: DbUser["status"]) {
  await db()`UPDATE users SET status = ${status}, updated_at = now() WHERE id = ${userId}`;
}

/* --------------------------------------------------------------- listing */

export type UserFilter = {
  q?: string;
  role?: Role | "all";
  status?: DbUser["status"] | "all";
  limit?: number;
  offset?: number;
};

/**
 * A PAGE of users, plus the total, in ONE round trip.
 *
 * `listUsers` returns rows only, so any caller wanting "page 3 of 42" had to
 * issue a second COUNT — two round trips per page view, on a connection pool
 * of one. A window function computes the total over the same filtered set
 * Postgres has already scanned, which costs nothing extra and cannot disagree
 * with the rows it returns.
 *
 * `limit` is clamped. A caller that asks for 10,000 rows gets 100: the point of
 * paginating is that no single request can be made large enough to time out,
 * and a cap the client cannot raise is the only version of that which holds.
 *
 * SORTING IS FROM A FIXED SET, never interpolated. An ORDER BY built from a
 * query parameter is SQL injection with extra steps.
 */
export type UserSort = "recent" | "oldest" | "name" | "last_active";

export async function listUsersPage(filter: UserFilter & { sort?: UserSort } = {}): Promise<{
  rows: (DbUser & { profileFields: number })[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}> {
  const limit = Math.min(Math.max(filter.limit ?? 25, 1), 100);
  const offset = Math.max(filter.offset ?? 0, 0);
  const q = filter.q?.trim() || null;
  const role = filter.role && filter.role !== "all" ? filter.role : null;
  const status = filter.status && filter.status !== "all" ? filter.status : null;
  const sort: UserSort = filter.sort ?? "recent";

  return safeQuery(async () => {
    const sql = db();
    const rows = await sql`
      SELECT u.id, u.email, u.name, u.role, u.status, u.email_verified,
             u.last_login_at, u.created_at,
             count(*) OVER () AS total_count,
             (
               -- How much of their profile is filled in, counted in SQL so the
               -- list does not need a second query per row to show it.
               SELECT count(*)::int FROM (
                 SELECT p.phone UNION ALL SELECT p.nationality
                 UNION ALL SELECT p.country UNION ALL SELECT p.city
               ) f(v) WHERE v IS NOT NULL AND btrim(v) <> ''
             ) AS profile_fields
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE (${q}::text IS NULL
             OR u.name ILIKE ${"%" + (q ?? "") + "%"}
             OR u.email ILIKE ${"%" + (q ?? "") + "%"})
        AND (${role}::user_role IS NULL OR u.role = ${role}::user_role)
        AND (${status}::user_status IS NULL OR u.status = ${status}::user_status)
      ORDER BY
        CASE WHEN ${sort} = 'name'        THEN u.name        END ASC,
        CASE WHEN ${sort} = 'oldest'      THEN u.created_at  END ASC,
        CASE WHEN ${sort} = 'last_active' THEN u.last_login_at END DESC NULLS LAST,
        u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = rows.length ? Number(rows[0].total_count) : 0;
    return {
      rows: rows.map((r) => ({
        ...mapUser(r),
        profileFields: Number(r.profile_fields ?? 0),
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    };
  }, { rows: [], total: 0, page: 1, pages: 1, limit });
}

export async function listUsers(filter: UserFilter = {}): Promise<DbUser[]> {
  const { q, role, status, limit = 50, offset = 0 } = filter;
  return safeQuery(async () => {
    const sql = db();
    const rows = await sql`
      SELECT id, email, name, role, status, email_verified, last_login_at, created_at
      FROM users
      WHERE (${q ?? null}::text IS NULL
             OR name ILIKE ${"%" + (q ?? "") + "%"}
             OR email ILIKE ${"%" + (q ?? "") + "%"})
        AND (${role && role !== "all" ? role : null}::user_role IS NULL OR role = ${
          role && role !== "all" ? role : null
        }::user_role)
        AND (${status && status !== "all" ? status : null}::user_status IS NULL OR status = ${
          status && status !== "all" ? status : null
        }::user_status)
      ORDER BY created_at DESC
      LIMIT ${Math.min(limit, 200)} OFFSET ${offset}
    `;
    return rows.map(mapUser);
  }, []);
}

export async function countUsersByRole(): Promise<Record<string, number>> {
  return safeQuery(async () => {
    const rows = await db()`SELECT role, count(*)::int AS n FROM users GROUP BY role`;
    return Object.fromEntries(rows.map((r) => [String(r.role), Number(r.n)]));
  }, {});
}

export async function listAdvisors(): Promise<DbUser[]> {
  return safeQuery(async () => {
    const rows = await db()`
      SELECT id, email, name, role, status, email_verified, last_login_at, created_at
      FROM users WHERE role IN ('advisor','admin','super_admin') AND status = 'active'
      ORDER BY name
    `;
    return rows.map(mapUser);
  }, []);
}
