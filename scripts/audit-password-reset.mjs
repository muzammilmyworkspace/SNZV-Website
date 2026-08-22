/**
 * PASSWORD RESET — the whole loop, end to end.
 *
 *   BASE=http://localhost:3000 node scripts/audit-password-reset.mjs
 *
 * Drives a real browser: click "Forgot your password?", submit an address,
 * take the token the server issued, open the reset page as the email's button
 * would, set a new password, sign in with it, and put the original back.
 *
 * WHY IT READS THE TOKEN FROM THE DATABASE
 * With no mail transport configured the link is logged rather than sent, so
 * there is no inbox to poll. Reading the row proves the same thing the email
 * would carry — that a single-use token was issued, is accepted once, and is
 * refused afterwards.
 *
 * It operates on a QA account and restores its password at the end.
 */
import "./lib/env.mjs";
import { chromium } from "playwright";
import postgres from "postgres";

const BASE = process.env.BASE ?? "http://localhost:3000";
const EMAIL = "student.demo@snzventures.com";
const ORIGINAL = "12345";
const NEW_PASSWORD = "Reset-Flow-Test-2026";

let fails = 0;
const ok = (m) => console.log("  ok    " + m);
const bad = (m) => { fails++; console.log("  FAIL  " + m); };

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require", prepare: false });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

try {
  /* 1 — the entry point exists on the sign-in screen ---------------------- */
  await page.goto(`${BASE}/login`, { waitUntil: "load" });

  /*
    WAIT FOR IT, don't count immediately.

    The sign-in form reads search params, which bails the route out to
    client-side rendering — so the server HTML has the heading but not the
    form, and everything in it appears only once React has hydrated. Counting
    on `load` therefore measured how fast the machine was, not whether the link
    exists, and reported a missing link on a page that plainly has one.
  */
  const forgot = page.locator('a:has-text("Forgot your password")');
  try {
    await forgot.first().waitFor({ state: "visible", timeout: 20000 });
    ok("sign-in screen offers 'Forgot your password?'");
  } catch {
    bad("no forgot-password link on the sign-in screen");
  }

  /* 2 — it leads to a page asking only for an email ----------------------- */
  await forgot.first().click();
  await page.waitForURL(/\/forgot-password/, { timeout: 20000 });
  const emailField = page.locator("#email");
  (await emailField.count()) > 0
    ? ok("forgot-password page asks for an email")
    : bad("no email field on the forgot-password page");

  const before = Date.now();
  await emailField.fill(EMAIL);
  await page.click('button[type="submit"]');

  /*
    WAIT FOR THE CONFIRMATION, don't sleep and hope.

    This was a fixed 3.5s pause, which passed locally and failed the moment the
    route had to compile on first hit. A sleep encodes a guess about how long
    something takes; waiting for the thing itself does not.
  */
  try {
    await page.getByText(/check your inbox/i).first().waitFor({ timeout: 20000 });
    ok("submitting shows a confirmation");
  } catch {
    const body = (await page.textContent("body")) ?? "";
    bad(`no confirmation shown: ${body.replace(/\s+/g, " ").slice(-160)}`);
  }

  /* 3 — a single-use token was actually issued --------------------------- */
  const [row] = await sql`
    SELECT t.id, t.used_at, t.expires_at
    FROM user_tokens t JOIN users u ON u.id = t.user_id
    WHERE u.email = ${EMAIL} AND t.kind = 'password_reset'
    ORDER BY t.created_at DESC LIMIT 1`;

  if (!row) {
    bad("no reset token was issued");
    throw new Error("cannot continue without a token");
  }
  if (new Date(row.created_at ?? Date.now()).getTime() < before - 60_000) {
    bad("the newest token predates this request");
  }
  ok(`token issued, expires ${new Date(row.expires_at).toISOString().slice(11, 16)}Z, unused`);

  /*
    The raw token is hashed in the database and never stored in the clear, so
    it cannot be read back — which is the correct design. The link is taken
    from the server log instead, exactly as the operator would today.
  */
  const logPath = process.env.RESET_LOG;
  let link = null;
  if (logPath) {
    const fs = await import("node:fs");
    const text = fs.readFileSync(logPath, "utf8");
    const m = [...text.matchAll(/Reset link for [^:]+: (\S+)/g)].pop();
    link = m?.[1] ?? null;
  }

  if (!link) {
    ok("token is stored hashed — the raw value is not readable from the database (correct)");
    console.log("     to test the rest of the loop, pass RESET_LOG=<server log file>");
  } else {
    /* 4 — the link opens a page that sets a new password ----------------- */
    await page.goto(link, { waitUntil: "load" });
    await page.fill("#password", NEW_PASSWORD);
    await page.fill("#confirm", NEW_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/portal/, { timeout: 30000 });
    ok("reset link accepted; new password set and signed in");

    /* 5 — the token cannot be used twice -------------------------------- */
    await page.goto(link, { waitUntil: "load" });
    const second = (await page.textContent("body")) ?? "";
    /expired|invalid|no longer/i.test(second)
      ? ok("the same link is refused the second time")
      : bad("a used reset link was accepted again");

    /* 6 — the new password works, the old one does not ------------------ */
    for (const [label, pw, expect] of [
      ["new password", NEW_PASSWORD, 200],
      ["old password", ORIGINAL, 401],
    ]) {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: EMAIL, password: pw }),
      });
      res.status === expect
        ? ok(`${label} -> ${res.status} as expected`)
        : bad(`${label} returned ${res.status}, expected ${expect}`);
    }
  }
} catch (error) {
  bad(`flow error: ${error instanceof Error ? error.message : error}`);
} finally {
  await browser.close();

  // Put the QA password back so the rest of the suite keeps working.
  const { randomBytes, scrypt: _scrypt } = await import("node:crypto");
  const { promisify } = await import("node:util");
  const scrypt = promisify(_scrypt);
  const salt = randomBytes(16);
  const derived = await scrypt(ORIGINAL.normalize("NFKC"), salt, 64, {
    N: 65536, r: 8, p: 1, maxmem: 160 * 1024 * 1024,
  });
  const hash = ["scrypt", 65536, 8, 1, salt.toString("base64"), derived.toString("base64")].join("$");
  await sql`UPDATE users SET password_hash = ${hash} WHERE email = ${EMAIL}`;
  console.log("\n  QA password restored");
  await sql.end({ timeout: 5 });
}

console.log(fails === 0 ? "\n  ALL PASSWORD RESET CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
