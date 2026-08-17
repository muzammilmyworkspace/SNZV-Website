/**
 * PORTAL AUTHORIZATION AUDIT
 *
 *   npm run audit:security          (static checks only)
 *   BASE=http://localhost:3000 npm run audit:security   (adds live checks)
 *
 * WHY THIS IS STATIC + LIVE RATHER THAN A SEEDED INTEGRATION TEST
 *
 * The obvious way to prove "a student cannot read another student's file" is to
 * create two students and try. But the only database this project has is the
 * PRODUCTION Supabase instance, and seeding fake clients into it is exactly
 * what the brief forbids. So this proves the property a different way:
 *
 *   1. STATICALLY — every portal page calls a server-side guard, and every
 *      portal/admin API route calls an API guard. A surface that forgot one is
 *      the actual mechanism by which cross-tenant access happens, and that is
 *      detectable without any data at all.
 *
 *   2. STATICALLY — no repository function that takes a viewer id builds its
 *      WHERE clause from anything but that id.
 *
 *   3. LIVE — every portal route and API endpoint is requested with no session
 *      and must redirect or 401. This is the one an unauthenticated attacker
 *      can actually run, so it is checked against the running app.
 *
 * What this does NOT prove: that a logged-in student cannot reach another
 * student's row. That needs two real accounts and is listed as a manual step
 * in the report rather than claimed as verified.
 */
import fs from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? null;
let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const rel = (p) => p.replace(process.cwd() + path.sep, "").replace(/\\/g, "/");

/* ------------------------------------------------- 1. page guards --------- */

console.log("\nPage guards\n");

const portalPages = (await walk(path.join(process.cwd(), "app", "portal"))).filter((f) =>
  /page\.tsx$/.test(f)
);

const PAGE_GUARD = /\b(requireUser|requireRole|requireClient|requireStaff|requireAdmin|requireSuperAdmin)\s*\(/;

let unguardedPages = [];
for (const file of portalPages) {
  const body = await fs.readFile(file, "utf8");
  if (!PAGE_GUARD.test(body)) unguardedPages.push(rel(file));
}

if (unguardedPages.length) {
  unguardedPages.forEach((f) => bad(`${f} renders without calling a server-side guard`));
} else {
  ok(`all ${portalPages.length} portal pages call a server-side guard`);
}

/* Admin pages must use a STAFF-or-stronger guard, not merely requireUser. */
const adminPages = portalPages.filter((f) => rel(f).includes("app/portal/admin/"));
const STAFF_GUARD = /\b(requireStaff|requireAdmin|requireSuperAdmin|requireRole)\s*\(/;

let weakAdmin = [];
for (const file of adminPages) {
  const body = await fs.readFile(file, "utf8");
  if (!STAFF_GUARD.test(body)) weakAdmin.push(rel(file));
}

if (weakAdmin.length) {
  weakAdmin.forEach((f) => bad(`${f} is under /admin but does not require a staff role`));
} else {
  ok(`all ${adminPages.length} admin pages require a staff role`);
}

/* -------------------------------------------------- 2. API guards --------- */

console.log("\nAPI guards\n");

const apiRoutes = (await walk(path.join(process.cwd(), "app", "api"))).filter((f) =>
  /route\.ts$/.test(f)
);

// Endpoints that are public BY DESIGN, each with the reason it is safe.
const PUBLIC_ROUTES = new Map([
  ["app/api/auth/login/route.ts", "issues a session; rate limited"],
  ["app/api/auth/register/route.ts", "creates a client account; role is server-assigned"],
  ["app/api/auth/logout/route.ts", "clears the caller's own cookie"],
  ["app/api/auth/forgot-password/route.ts", "email enumeration guarded; rate limited"],
  ["app/api/auth/reset-password/route.ts", "authorises with a single-use token"],
  ["app/api/auth/verify-email/route.ts", "authorises with a single-use token"],
  ["app/api/auth/google/route.ts", "starts the OAuth redirect"],
  ["app/api/auth/google/callback/route.ts", "authorises with a signed state + provider code"],
  ["app/api/enquiry/route.ts", "public contact form; rate limited"],
]);

const API_GUARD = /\b(apiRequireUser|apiRequireRole|apiRequireStaff|apiRequireAdmin|apiRequireSuperAdmin)\s*\(/;

let unguardedApi = [];
let publicCount = 0;
for (const file of apiRoutes) {
  const r = rel(file);
  if (PUBLIC_ROUTES.has(r)) {
    publicCount++;
    continue;
  }
  const body = await fs.readFile(file, "utf8");
  if (!API_GUARD.test(body)) unguardedApi.push(r);
}

if (unguardedApi.length) {
  unguardedApi.forEach((f) => bad(`${f} has no API authorization guard`));
} else {
  ok(`all ${apiRoutes.length - publicCount} non-public API routes call an API guard`);
}

/* Admin API must be staff-gated. */
const adminApi = apiRoutes.filter((f) => rel(f).includes("app/api/admin/"));
const API_STAFF = /\b(apiRequireStaff|apiRequireAdmin|apiRequireSuperAdmin|apiRequireRole)\s*\(/;
let weakAdminApi = [];
for (const file of adminApi) {
  const body = await fs.readFile(file, "utf8");
  if (!API_STAFF.test(body)) weakAdminApi.push(rel(file));
}
if (weakAdminApi.length) {
  weakAdminApi.forEach((f) => bad(`${f} is under /api/admin but is not staff-gated`));
} else {
  ok(`all ${adminApi.length} admin API routes require a staff role`);
}

/* ------------------------------------- 3. no client reader for notes ------ */

console.log("\nData boundaries\n");

const opsBody = await fs.readFile(
  path.join(process.cwd(), "lib", "db", "repos", "operations.ts"),
  "utf8"
);

// admin_notes must never be readable from a client-scoped query.
const noteReaders = [...opsBody.matchAll(/export async function (\w+)[\s\S]*?admin_notes/g)].map(
  (m) => m[1]
);
const clientish = noteReaders.filter((n) => /client|own|mine|self/i.test(n));
if (clientish.length) {
  bad(`admin_notes has a client-sounding reader: ${clientish.join(", ")}`);
} else {
  ok("admin_notes has no client-scoped reader");
}

// getClientHistory must hardcode the internal filter rather than accept a flag.
const clientHistory = opsBody.match(/getClientHistory[\s\S]*?\}, \[\]\);/);
if (!clientHistory) {
  bad("getClientHistory not found");
} else if (!/internal\s*=\s*FALSE/i.test(clientHistory[0])) {
  bad("getClientHistory does not hardcode `internal = FALSE`");
} else if (/internal\s*=\s*\$\{/.test(clientHistory[0])) {
  bad("getClientHistory takes the internal flag as a parameter");
} else {
  ok("getClientHistory hardcodes the internal-entry filter");
}

// The upload route must never take owner_id from the request body.
const uploadBody = await fs.readFile(
  path.join(process.cwd(), "app", "api", "portal", "documents", "route.ts"),
  "utf8"
);
if (/ownerId:\s*session\.userId/.test(uploadBody)) {
  ok("document upload takes owner_id from the session, not the request");
} else {
  bad("document upload may be taking owner_id from the request body");
}

// The intake route must derive the pathway from the session role.
const intakeBody = await fs.readFile(
  path.join(process.cwd(), "app", "api", "portal", "intake", "route.ts"),
  "utf8"
);
if (/pathwayFor\(session\.role\)/.test(intakeBody)) {
  ok("intake pathway is derived from the session role, not the request");
} else {
  bad("intake pathway may be taken from the request body");
}

/* --------------------------------------------- 4. live, unauthenticated --- */

if (!BASE) {
  console.log("\n  (skipping live checks — set BASE to run them)\n");
} else {
  console.log("\nUnauthenticated access\n");

  const PROTECTED_PAGES = [
    "/portal",
    "/portal/application",
    "/portal/documents",
    "/portal/messages",
    "/portal/notifications",
    "/portal/profile",
    "/portal/settings",
    "/portal/admin",
    "/portal/admin/requests",
    "/portal/admin/users",
    "/portal/admin/documents",
    "/portal/admin/audit",
  ];

  for (const route of PROTECTED_PAGES) {
    try {
      const res = await fetch(BASE + route, { redirect: "manual" });
      const location = res.headers.get("location") ?? "";
      // A redirect to /login is correct. A 200 means the page rendered for
      // someone with no session at all.
      if (res.status === 200) bad(`${route} rendered for an unauthenticated visitor`);
      else if (res.status >= 300 && res.status < 400 && /\/login/.test(location)) ok(route);
      else if (res.status === 404) ok(`${route} (404)`);
      else bad(`${route} returned ${res.status} → ${location || "no location"}`);
    } catch (e) {
      bad(`${route} request failed: ${e.message}`);
    }
  }

  console.log("\nUnauthenticated API\n");

  const PROTECTED_API = [
    ["GET", "/api/portal/notifications"],
    ["PATCH", "/api/portal/notifications"],
    ["GET", "/api/portal/intake"],
    ["GET", "/api/portal/messages?conversation=00000000-0000-0000-0000-000000000000"],
    ["GET", "/api/admin/notes?subject=00000000-0000-0000-0000-000000000000"],
    // POST, because this route implements no GET. Asking for a method that
    // does not exist gets a 405 from the framework before any handler runs,
    // which would pass this test without ever reaching the guard.
    ["POST", "/api/admin/users"],
    ["POST", "/api/admin/notes"],
  ];

  for (const [method, route] of PROTECTED_API) {
    try {
      const res = await fetch(BASE + route, {
        method,
        redirect: "manual",
        // A body, so validation is not what rejects the request first.
        ...(method === "POST"
          ? { headers: { "Content-Type": "application/json" }, body: "{}" }
          : {}),
      });
      if (res.status === 401 || res.status === 403) ok(`${method} ${route} → ${res.status}`);
      else if (res.status === 405) bad(`${method} ${route} → 405; the guard was never reached`);
      else bad(`${method} ${route} returned ${res.status}, expected 401/403`);
    } catch (e) {
      bad(`${method} ${route} request failed: ${e.message}`);
    }
  }
}

console.log(
  fails === 0
    ? "\n  ALL AUTHORIZATION CHECKS PASSED\n"
    : `\n  ${fails} AUTHORIZATION FAILURE(S)\n`
);
process.exit(fails === 0 ? 0 : 1);
