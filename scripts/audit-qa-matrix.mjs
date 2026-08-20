/**
 * QA MATRIX — the four demo accounts, driven through a real browser.
 *
 *   BASE=http://localhost:3000 node scripts/audit-qa-matrix.mjs
 *
 * Signs each account in through the actual form, walks its navigation, checks
 * it cannot reach another role's workspace, and signs out. Playwright rather
 * than fetch because the session cookie is `Secure` — a browser treats
 * localhost as trustworthy and sends it; curl does not, which is why a
 * command-line check of this flow reports false failures.
 *
 * Requires the accounts from `npm run qa:accounts -- --create`.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PASSWORD = "12345";

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

const ACCOUNTS = [
  {
    label: "Super Admin",
    email: "admin.demo@snzventures.com",
    home: "/portal/admin",
    pages: [
      "/portal/admin/users", "/portal/admin/requests", "/portal/admin/documents",
      "/portal/admin/cases", "/portal/admin/staff", "/portal/admin/audit",
      "/portal/admin/analytics",
      "/portal/messages", "/portal/notifications", "/portal/settings",
    ],
    forbidden: ["/portal/student", "/portal/job-seeker", "/portal/business"],
  },
  {
    label: "Student",
    email: "student.demo@snzventures.com",
    home: "/portal/student",
    pages: [
      "/portal/journey", "/portal/application", "/portal/cases",
      "/portal/universities", "/portal/scholarships", "/portal/documents",
      "/portal/tasks", "/portal/profile", "/portal/messages",
      "/portal/appointments", "/portal/notifications", "/portal/settings",
    ],
    forbidden: ["/portal/admin", "/portal/job-seeker", "/portal/business", "/portal/admin/users"],
  },
  {
    label: "Job Seeker",
    email: "jobseeker.demo@snzventures.com",
    home: "/portal/job-seeker",
    pages: [
      "/portal/journey", "/portal/application", "/portal/cases", "/portal/jobs",
      "/portal/appointments", "/portal/documents", "/portal/tasks",
      "/portal/profile", "/portal/messages", "/portal/notifications", "/portal/settings",
    ],
    forbidden: ["/portal/admin", "/portal/student", "/portal/business", "/portal/admin/users"],
  },
  {
    label: "Business",
    email: "business.demo@snzventures.com",
    home: "/portal/business",
    pages: [
      "/portal/cases", "/portal/application", "/portal/services",
      "/portal/documents", "/portal/tasks", "/portal/messages",
      "/portal/appointments", "/portal/notifications", "/portal/settings",
    ],
    forbidden: ["/portal/admin", "/portal/student", "/portal/job-seeker", "/portal/admin/users"],
  },
];

const browser = await chromium.launch();

for (const acct of ACCOUNTS) {
  console.log(`\n=== ${acct.label} (${acct.email}) ===`);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  // Sign in through the real form.
  await page.goto(`${BASE}/login`, { waitUntil: "load" });
  await page.fill("#email", acct.email);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL(new RegExp(acct.home.replace(/\//g, "\\/")), { timeout: 40000 });
    ok(`signs in and lands on ${acct.home}`);
  } catch {
    bad(`${acct.label} did not reach ${acct.home} — stuck at ${page.url()}`);
    await ctx.close();
    continue;
  }

  // /portal must route to this role's home.
  await page.goto(`${BASE}/portal`, { waitUntil: "load" });
  new URL(page.url()).pathname === acct.home
    ? ok(`/portal routes to ${acct.home}`)
    : bad(`/portal went to ${new URL(page.url()).pathname}`);

  // Every navigation destination renders.
  let broken = 0;
  for (const p of acct.pages) {
    const res = await page.goto(BASE + p, { waitUntil: "load", timeout: 45000 });
    if (!res || res.status() !== 200) {
      bad(`${p} returned ${res?.status() ?? "no response"}`);
      broken++;
    }
  }
  if (!broken) ok(`all ${acct.pages.length} navigation destinations render`);

  // Nothing belonging to another role does.
  let leaked = 0;
  for (const p of acct.forbidden) {
    await page.goto(BASE + p, { waitUntil: "load", timeout: 45000 });
    const landed = new URL(page.url()).pathname;
    if (landed === p) {
      bad(`REACHED ${p} — cross-role access`);
      leaked++;
    }
  }
  if (!leaked) ok(`blocked from all ${acct.forbidden.length} other-role routes`);

  // ADMIN ONLY: open a real client file and the advisor page.
  //
  // The matrix used to walk only the pages listed above, so the client-detail
  // page — the heaviest query in the product — was never once opened by a
  // test. It was issuing eight round trips and timing out in production while
  // every check here passed.
  if (acct.label === "Super Admin") {
    await page.goto(BASE + "/portal/admin/users", { waitUntil: "load" });
    const firstUser = page.locator('a[href^="/portal/admin/users/"]').first();
    if ((await firstUser.count()) > 0) {
      const href = await firstUser.getAttribute("href");
      const t = Date.now();
      const res = await page.goto(BASE + href, { waitUntil: "load", timeout: 60000 });
      res?.status() === 200
        ? ok(`client file ${href} renders (${Date.now() - t}ms)`)
        : bad(`client file ${href} returned ${res?.status()}`);
    } else {
      bad("no client link found on the users page");
    }
  }

  // Sign out, and confirm Back cannot return.
  await page.goto(acct.home === "/portal/admin" ? BASE + acct.home : BASE + acct.home, {
    waitUntil: "load",
  });
  await page.click('button:has-text("Sign out")');
  try {
    await page.waitForURL(/\/login/, { timeout: 20000 });
    await page.goBack();
    await page.waitForTimeout(1200);
    /\/login/.test(page.url())
      ? ok("signs out; Back cannot return to the dashboard")
      : bad(`after sign-out, Back reached ${new URL(page.url()).pathname}`);
  } catch {
    bad("sign-out did not return to /login");
  }

  if (pageErrors.length) bad(`console errors: ${pageErrors.slice(0, 2).join(" | ")}`);
  else ok("no page errors");

  await ctx.close();
}

await browser.close();
console.log(fails === 0 ? "\n  ALL QA MATRIX CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
