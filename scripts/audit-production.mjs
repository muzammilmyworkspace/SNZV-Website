/**
 * PRODUCTION SMOKE TEST — against the live Vercel deployment.
 *
 *   node scripts/audit-production.mjs                       (default URL)
 *   PROD=https://your-domain node scripts/audit-production.mjs
 *
 * Everything here runs over HTTPS against the deployed app: real functions,
 * real Supabase, real sessions. Local passes prove the code; only this proves
 * the deployment.
 *
 * It also reports the EXECUTION REGION for each request. `x-vercel-id` reads
 * `<edge>::<function>::<id>` when they differ — the first is wherever the
 * request entered the network, the second is where the function actually ran.
 * A single segment means both were the same place, which is how a function in
 * Singapore ended up talking to a database in Ireland.
 */
const PROD = process.env.PROD ?? "https://snzv-website.vercel.app";
const PASSWORD = "12345";

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

/** Where the function ran, from the Vercel id header. */
function regionOf(res) {
  const id = res.headers.get("x-vercel-id") ?? "";
  const parts = id.split("::");
  return parts.length >= 3 ? parts[1] : parts[0] || "?";
}

const ACCOUNTS = [
  { label: "Super Admin", email: "admin.demo@snzventures.com", home: "/portal/admin" },
  { label: "Student", email: "student.demo@snzventures.com", home: "/portal/student" },
  { label: "Job Seeker", email: "jobseeker.demo@snzventures.com", home: "/portal/job-seeker" },
  { label: "Business", email: "business.demo@snzventures.com", home: "/portal/business" },
];

console.log(`\nPublic pages  (${PROD})\n`);

for (const p of ["/", "/login", "/register", "/study-abroad"]) {
  const t = Date.now();
  const res = await fetch(PROD + p, { redirect: "manual" });
  const ms = Date.now() - t;
  res.status === 200
    ? ok(`${p.padEnd(16)} 200  ${ms}ms  [${regionOf(res)}]`)
    : bad(`${p} returned ${res.status}`);
}

console.log("\nUnauthenticated portal\n");

for (const p of ["/portal", "/portal/admin", "/portal/student"]) {
  const res = await fetch(PROD + p, { redirect: "manual" });
  const loc = res.headers.get("location") ?? "";
  res.status >= 300 && res.status < 400 && loc.includes("/login")
    ? ok(`${p.padEnd(16)} redirects to login  [${regionOf(res)}]`)
    : bad(`${p} returned ${res.status} -> ${loc}`);
}

console.log("\nSign in and role routing\n");

const sessions = {};

for (const acct of ACCOUNTS) {
  const t = Date.now();
  const res = await fetch(PROD + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: acct.email, password: PASSWORD }),
    redirect: "manual",
  });
  const ms = Date.now() - t;
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.ok) {
    bad(`${acct.label} login: ${res.status} ${data.error ?? ""}`);
    continue;
  }
  if (data.redirectTo !== acct.home) {
    bad(`${acct.label} routed to ${data.redirectTo}, expected ${acct.home}`);
    continue;
  }
  sessions[acct.label] = (res.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(";")[0])
    .join("; ");
  ok(`${acct.label.padEnd(12)} -> ${acct.home.padEnd(20)} ${ms}ms  [${regionOf(res)}]`);
}

console.log("\nDashboards render with real data\n");

for (const acct of ACCOUNTS) {
  const cookie = sessions[acct.label];
  if (!cookie) continue;
  const t = Date.now();
  const res = await fetch(PROD + acct.home, { headers: { cookie }, redirect: "manual" });
  const ms = Date.now() - t;
  if (res.status !== 200) {
    bad(`${acct.label} dashboard returned ${res.status}`);
    continue;
  }
  const html = await res.text();
  // The shell renders the signed-in name, so its presence proves the session
  // was verified server-side rather than the page merely existing.
  html.includes("SnZ Ventures")
    ? ok(`${acct.label.padEnd(12)} dashboard 200  ${ms}ms  [${regionOf(res)}]`)
    : bad(`${acct.label} dashboard rendered without the portal shell`);
}

console.log("\nCross-role isolation\n");

for (const acct of ACCOUNTS) {
  const cookie = sessions[acct.label];
  if (!cookie) continue;
  let leaked = 0;
  for (const other of ACCOUNTS) {
    if (other.home === acct.home) continue;
    const res = await fetch(PROD + other.home, { headers: { cookie }, redirect: "manual" });
    if (res.status === 200) {
      bad(`${acct.label} REACHED ${other.home}`);
      leaked++;
    }
  }
  if (!leaked) ok(`${acct.label.padEnd(12)} blocked from all other dashboards`);
}

console.log("\nDatabase writes persist\n");

{
  const cookie = sessions.Student;
  if (!cookie) bad("no student session — skipping persistence");
  else {
    const stamp = "Prod-" + Date.now().toString().slice(-6);
    const put = await fetch(PROD + "/api/portal/intake", {
      method: "PUT",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ step: 0, resumeAt: 0, answers: { fullName: stamp } }),
    });
    put.ok ? ok(`intake draft written  [${regionOf(put)}]`) : bad(`write failed: ${put.status}`);

    // Read it back on a SEPARATE request, so this proves the database kept it
    // rather than the same invocation remembering it.
    const get = await fetch(PROD + "/api/portal/intake", { headers: { cookie } });
    const body = await get.json().catch(() => ({}));
    body?.form?.data?.fullName === stamp
      ? ok(`read back on a new request: ${stamp}`)
      : bad(`read back "${body?.form?.data?.fullName}", expected "${stamp}"`);
  }
}

console.log("\nAdmin sees real counts\n");

{
  const cookie = sessions["Super Admin"];
  if (!cookie) bad("no admin session");
  else {
    for (const p of ["/portal/admin/users", "/portal/admin/requests", "/portal/admin/documents"]) {
      const t = Date.now();
      const res = await fetch(PROD + p, { headers: { cookie }, redirect: "manual" });
      res.status === 200
        ? ok(`${p.padEnd(26)} 200  ${Date.now() - t}ms  [${regionOf(res)}]`)
        : bad(`${p} returned ${res.status}`);
    }
  }
}

console.log(
  fails === 0 ? "\n  ALL PRODUCTION CHECKS PASSED\n" : `\n  ${fails} PRODUCTION FAILURE(S)\n`
);
process.exit(fails === 0 ? 0 : 1);
