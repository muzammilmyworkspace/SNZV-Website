/**
 * SESSIONS — can they be taken back?
 *
 *   npm run audit:session
 *   BASE=https://snzv-website.vercel.app npm run audit:session
 *
 * This exists because of a specific report: "I copied the URL from a signed-in
 * session into another browser and I was still signed in." That turned out not
 * to reproduce — a URL carries no credential — but chasing it found something
 * worse underneath. Sessions were stateless signed tokens, so signing out only
 * deleted the cookie from the browser doing it. The token stayed valid for its
 * full seven days on any machine that had a copy, and changing the password
 * did not remove those either.
 *
 * So the checks below are written from the attacker's side: take a copy of the
 * cookie the way somebody on a shared machine could, then try to still be
 * signed in after the owner has done the things that are supposed to stop you.
 */
import "./lib/env.mjs";
import { chromium } from "playwright";
import postgres from "postgres";

const BASE = process.env.BASE ?? "http://localhost:3000";
const EMAIL = "student.demo@snzventures.com";
const PASSWORD = "12345";
const HOME = "/portal/student";

let fails = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => { fails++; console.log(`  FAIL  ${m}`); };

/** Writes the QA password back with the same parameters as lib/auth/password.ts. */
async function restoreQaPassword() {
  const { randomBytes, scrypt: _scrypt } = await import("node:crypto");
  const { promisify } = await import("node:util");
  const scrypt = promisify(_scrypt);
  const salt = randomBytes(16);
  const derived = await scrypt(PASSWORD.normalize("NFKC"), salt, 64, {
    N: 65536, r: 8, p: 1, maxmem: 160 * 1024 * 1024,
  });
  const hash = ["scrypt", 65536, 8, 1, salt.toString("base64"), derived.toString("base64")].join("$");
  const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require", prepare: false });
  try {
    await sql`UPDATE users SET password_hash = ${hash} WHERE email = ${EMAIL}`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const browser = await chromium.launch();

async function signIn() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "load" });
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/portal/, { timeout: 30000 });
  return { ctx, page };
}

/** Replays a captured cookie in a context that never signed in. */
async function stillSignedIn(cookie) {
  const ctx = await browser.newContext();
  await ctx.addCookies([cookie]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}${HOME}`, { waitUntil: "load" });
  const inside = !/\/login/.test(page.url());
  await ctx.close();
  return inside;
}

const sessionCookie = async (ctx) =>
  (await ctx.cookies()).find((c) => c.name === "snz_session");

try {
  /* 1 — the original report: does a URL carry a session? ------------------ */
  {
    const { ctx, page } = await signIn();
    const url = page.url();

    const fresh = await browser.newContext();
    const fp = await fresh.newPage();
    await fp.goto(url, { waitUntil: "load" });
    /\/login/.test(fp.url())
      ? ok("a copied URL does not sign anyone in — a fresh browser is sent to sign-in")
      : bad("a copied URL signed a fresh browser in without credentials");

    const cookie = await sessionCookie(ctx);
    cookie?.httpOnly && cookie?.sameSite === "Lax"
      ? ok(`session cookie is httpOnly and SameSite=${cookie.sameSite}`)
      : bad(`session cookie attributes are wrong: httpOnly=${cookie?.httpOnly} sameSite=${cookie?.sameSite}`);

    await fresh.close();
    await ctx.close();
  }

  /* 2 — signing out must end the session, not just forget it -------------- */
  {
    const { ctx, page } = await signIn();
    const stolen = await sessionCookie(ctx);

    await page.request.post(`${BASE}/api/auth/logout`);
    (await stillSignedIn(stolen))
      ? bad("a copy of the cookie still works after signing out")
      : ok("signing out ends the session everywhere, not just in that browser");

    await ctx.close();
  }

  /* 3 — changing the password must evict everyone else -------------------- */
  {
    const { ctx, page } = await signIn();
    const stolen = await sessionCookie(ctx);

    const csrf = (await ctx.cookies()).find((c) => c.name === "snz_csrf")?.value;
    const NEW = "Session-Evict-Test-2026";

    const change = await page.request.post(`${BASE}/api/portal/password`, {
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf ?? "" },
      data: { currentPassword: PASSWORD, newPassword: NEW },
    });

    if (!change.ok()) {
      bad(`could not change the password to test eviction (HTTP ${change.status()})`);
    } else {
      (await stillSignedIn(stolen))
        ? bad("a copy of the cookie still works after the password was changed")
        : ok("changing the password signs every other device out");

      // The caller who made the change must NOT be signed out by their own act.
      await page.goto(`${BASE}${HOME}`, { waitUntil: "load" });
      /\/login/.test(page.url())
        ? bad("changing the password signed out the person who changed it")
        : ok("the person who changed it stays signed in");

      /*
        Restored by writing the hash directly, NOT through the API.

        The API route would accept it now that the policy allows four
        characters, but going through it would make this cleanup depend on a
        CSRF token, a session that the test has just deliberately invalidated,
        and the policy staying where it is. Writing the hash is unconditional,
        so the QA password comes back even when the checks above failed.
      */
      await restoreQaPassword();
      ok("QA password restored");
    }

    await ctx.close();
  }
} catch (error) {
  bad(`flow error: ${error instanceof Error ? error.message : error}`);
} finally {
  await browser.close();
}

console.log(fails === 0 ? "\n  ALL SESSION CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
