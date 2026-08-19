/**
 * END-TO-END AUTHENTICATION AND ROLE-ROUTING TEST.
 *
 *   BASE=http://localhost:3000 node scripts/audit-auth-flow.mjs
 *   ... --keep      leave the test accounts behind instead of removing them
 *
 * Exercises the real stack: the real registration API, the real password
 * hashing, the real session cookie, the real server-side guards. Nothing is
 * stubbed, so a pass here means the flow actually works rather than that a
 * mock agreed with itself.
 *
 * IT CREATES REAL ROWS, because there is no other way to prove registration
 * works. Every account is named `e2e+<role>-<stamp>@…` and is DELETED at the
 * end unless --keep is passed, so the database is left as it was found. The
 * existing super admin is never touched.
 */
import "./lib/env.mjs";
import postgres from "postgres";

const BASE = process.env.BASE ?? "http://localhost:3000";
const KEEP = process.argv.includes("--keep");
const stamp = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "run";

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

const ACCOUNTS = [
  { pathway: "study", role: "student", home: "/portal/student", label: "Student" },
  { pathway: "career", role: "professional", home: "/portal/job-seeker", label: "Job Seeker" },
  { pathway: "business", role: "business", home: "/portal/business", label: "Business" },
];

const emailFor = (r) => `e2e+${r}-${stamp}@snz-test.invalid`;
// Meets the server's own policy; never written anywhere but this process.
const PASSWORD = `E2e-Test-${stamp}-9x`;

/** Minimal cookie jar — enough to carry one session between requests. */
function jar() {
  const store = new Map();
  return {
    absorb(res) {
      for (const c of res.headers.getSetCookie?.() ?? []) {
        const [pair] = c.split(";");
        const i = pair.indexOf("=");
        store.set(pair.slice(0, i), pair.slice(i + 1));
      }
    },
    header() {
      return [...store.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    clear() {
      store.clear();
    },
  };
}

const post = (path, body, cookies) =>
  fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookies ? { cookie: cookies } : {}) },
    body: JSON.stringify(body),
    redirect: "manual",
  });

const get = (path, cookies) =>
  fetch(BASE + path, {
    headers: cookies ? { cookie: cookies } : {},
    redirect: "manual",
  });

console.log(`\nRegistration  (${BASE})\n`);

const sessions = {};

for (const acct of ACCOUNTS) {
  const c = jar();
  const res = await post("/api/auth/register", {
    name: `E2E ${acct.label}`,
    email: emailFor(acct.role),
    password: PASSWORD,
    pathway: acct.pathway,
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.ok) {
    bad(`register ${acct.label}: ${res.status} ${data.error ?? ""}`);
    continue;
  }
  c.absorb(res);

  if (data.role !== acct.role) bad(`${acct.label} got role "${data.role}", expected "${acct.role}"`);
  else if (data.redirectTo !== acct.home)
    bad(`${acct.label} redirectTo "${data.redirectTo}", expected "${acct.home}"`);
  else ok(`${acct.label} registered, role ${acct.role}, sent to ${acct.home}`);

  sessions[acct.role] = c;
}

console.log("\nPrivilege escalation\n");

{
  // The registration body has no role field; make sure adding one is ignored.
  const res = await post("/api/auth/register", {
    name: "E2E Escalation",
    email: `e2e+esc-${stamp}@snz-test.invalid`,
    password: PASSWORD,
    pathway: "study",
    role: "super_admin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) ok("crafted role in body rejected outright");
  else if (data.role === "super_admin") bad("REGISTERED AS SUPER ADMIN — escalation possible");
  else ok(`crafted role ignored; assigned "${data.role}"`);
}

console.log("\nSign in\n");

for (const acct of ACCOUNTS) {
  const c = jar();
  const res = await post("/api/auth/login", { email: emailFor(acct.role), password: PASSWORD });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    bad(`login ${acct.label}: ${res.status} ${data.error ?? ""}`);
    continue;
  }
  c.absorb(res);
  data.redirectTo === acct.home
    ? ok(`${acct.label} signs in and is routed to ${acct.home}`)
    : bad(`${acct.label} routed to "${data.redirectTo}", expected "${acct.home}"`);
  sessions[acct.role] = c;
}

{
  const res = await post("/api/auth/login", { email: emailFor("student"), password: "wrong-password" });
  const data = await res.json().catch(() => ({}));
  res.status === 401 && !data.ok
    ? ok("wrong password rejected with 401")
    : bad(`wrong password returned ${res.status}`);
}

console.log("\nRole routing and isolation\n");

for (const acct of ACCOUNTS) {
  const c = sessions[acct.role];
  if (!c) continue;
  const cookie = c.header();

  // /portal must land them on their own home.
  const idx = await get("/portal", cookie);
  const loc = idx.headers.get("location") ?? "";
  loc.endsWith(acct.home)
    ? ok(`${acct.label}: /portal redirects to ${acct.home}`)
    : bad(`${acct.label}: /portal went to "${loc}"`);

  // Their own dashboard renders.
  const own = await get(acct.home, cookie);
  own.status === 200
    ? ok(`${acct.label}: own dashboard renders`)
    : bad(`${acct.label}: own dashboard returned ${own.status}`);

  // Every OTHER role's dashboard must not.
  for (const other of ACCOUNTS) {
    if (other.role === acct.role) continue;
    const res = await get(other.home, cookie);
    const l = res.headers.get("location") ?? "";
    if (res.status === 200) bad(`${acct.label} RENDERED ${other.home} — cross-role access`);
    else ok(`${acct.label} blocked from ${other.home} (${res.status})`);
  }

  // And the admin area must not.
  const admin = await get("/portal/admin", cookie);
  admin.status === 200
    ? bad(`${acct.label} RENDERED /portal/admin — privilege escalation`)
    : ok(`${acct.label} blocked from /portal/admin (${admin.status})`);
}

console.log("\nNavigation destinations\n");

/*
  Every link in every role's sidebar, fetched with that role's real session.

  A menu item that 404s is as much a defect as a broken form, and it is the
  kind that only surfaces when someone clicks it. Listed explicitly so adding a
  nav entry without a route it can reach fails here rather than in front of a
  client.
*/
{
  const DESTINATIONS = {
    student: [
      "/portal/journey", "/portal/application", "/portal/cases",
      "/portal/universities", "/portal/scholarships",
      "/portal/documents", "/portal/tasks", "/portal/profile",
      "/portal/messages", "/portal/appointments", "/portal/notifications",
      "/portal/settings",
    ],
    professional: [
      "/portal/journey", "/portal/application", "/portal/cases",
      "/portal/jobs", "/portal/appointments",
      "/portal/documents", "/portal/tasks", "/portal/profile",
      "/portal/messages", "/portal/notifications", "/portal/settings",
    ],
    business: [
      "/portal/cases", "/portal/application", "/portal/services",
      "/portal/documents", "/portal/tasks",
      "/portal/messages", "/portal/appointments", "/portal/notifications",
      "/portal/settings",
    ],
  };

  for (const acct of ACCOUNTS) {
    const c = sessions[acct.role];
    if (!c) continue;
    const cookie = c.header();
    let broken = 0;
    for (const dest of DESTINATIONS[acct.role] ?? []) {
      const res = await get(dest, cookie);
      if (res.status !== 200) {
        bad(`${acct.label}: ${dest} returned ${res.status}`);
        broken++;
      }
    }
    if (!broken) ok(`${acct.label}: all ${DESTINATIONS[acct.role].length} nav destinations render`);
  }
}

console.log("\nSign out\n");

{
  const c = sessions.student;
  if (c) {
    const before = await get("/portal/student", c.header());
    const res = await post("/api/auth/logout", {}, c.header());
    c.clear();
    c.absorb(res);
    const after = await get("/portal/student", c.header());
    before.status === 200 && after.status !== 200
      ? ok(`session invalidated — dashboard was 200, now ${after.status}`)
      : bad(`logout left the dashboard reachable (${after.status})`);
  }
}

console.log("\nUnauthenticated\n");

for (const p of ["/portal", "/portal/student", "/portal/job-seeker", "/portal/business", "/portal/admin"]) {
  const res = await get(p);
  const l = res.headers.get("location") ?? "";
  res.status >= 300 && res.status < 400 && l.includes("/login")
    ? ok(`${p} redirects to login`)
    : bad(`${p} returned ${res.status} -> ${l}`);
}

/* ------------------------------------------------------------- clean-up -- */

if (!KEEP && process.env.DATABASE_URL) {
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false, max: 1 });
  try {
    // Scoped to this run's throwaway domain. `snz-test.invalid` is reserved by
    // RFC 2606 and can never be a real address, so this cannot match a client.
    const removed = await sql`
      DELETE FROM users
      WHERE email LIKE ${"e2e+%-" + stamp + "@snz-test.invalid"}
      RETURNING email
    `;
    console.log(`\n  cleaned up ${removed.length} test account(s)`);
  } catch (e) {
    console.log(`\n  clean-up failed: ${e.message}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
} else if (KEEP) {
  console.log("\n  --keep: test accounts left in place");
}

console.log(
  fails === 0 ? "\n  ALL AUTH FLOW CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`
);
process.exit(fails === 0 ? 0 : 1);
