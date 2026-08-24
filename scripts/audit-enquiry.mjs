/**
 * THE CONTACT FORM — does an enquiry survive?
 *
 *   npm run audit:enquiry
 *
 * This exists because of the worst thing found in the go-live QA: the form
 * emailed the enquiry and stored nothing. With no mail transport configured it
 * answered 503 and wrote a line to the server console, so every enquiry
 * submitted was lost — on the one form the whole marketing site funnels
 * towards, and silently, because the visitor was told to email instead and
 * usually would not.
 *
 * So the checks are written from the business's side: a person filled the form
 * in, and afterwards somebody must be able to read what they said. Whether the
 * notification email went out is secondary and tracked separately.
 *
 * Every row it creates is removed in `finally`, including on failure.
 */
import "./lib/env.mjs";
import postgres from "postgres";
import { chromium } from "playwright";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/+$/, "");
const STAMP = String(process.hrtime.bigint()).slice(-9);
const EMAIL = `enquiry-${STAMP}@snz-enquirytest.invalid`;
const NAME = `Enquiry Test ${STAMP}`;

let fails = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => { fails++; console.log(`  FAIL  ${m}`); };

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require", prepare: false });
const browser = await chromium.launch();

try {
  /* 1 — a submission is accepted and recorded ---------------------------- */
  const res = await fetch(`${BASE}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pathway: "study",
      answers: {
        name: NAME,
        email: EMAIL,
        phone: "+92 300 0000000",
        preferredContact: "WhatsApp",
        notes: "Automated go-live QA check.",
        consent: "yes",
      },
    }),
  });
  const body = await res.json().catch(() => ({}));

  res.ok && body.ok
    ? ok(`the form accepts a valid enquiry (HTTP ${res.status})`)
    : bad(`a valid enquiry was rejected: HTTP ${res.status} ${JSON.stringify(body).slice(0, 120)}`);

  const [row] = await sql`
    SELECT id, pathway, name, email, phone, notes, delivered, handled_at
    FROM enquiries WHERE email = ${EMAIL}`;

  if (!row) {
    bad("THE ENQUIRY WAS NOT STORED — it would have been lost");
  } else {
    ok(`stored: ${row.name} / ${row.pathway}`);
    row.notes === "Automated go-live QA check."
      ? ok("what the person actually wrote is readable afterwards")
      : bad(`the notes were not stored correctly: ${row.notes}`);
    row.phone
      ? ok("the phone number came through")
      : bad("the phone number was dropped");
    row.handled_at === null
      ? ok("it lands unhandled, so it appears in the queue")
      : bad("a new enquiry arrived already marked handled");

    /*
      `delivered` is reported, not asserted. With no mail transport it is
      correctly false and the enquiry is still safe, which is the entire point
      of storing it first. Failing here would make the test demand a mail
      provider to pass, which is a different problem.
    */
    console.log(
      row.delivered
        ? "  ok    the notification email was sent as well"
        : "  note  the notification email was NOT sent (no mail transport) — the enquiry is safe regardless"
    );
  }

  /* 2 — the rubbish is still refused ------------------------------------- */
  for (const [label, answers] of [
    ["no name", { email: EMAIL, consent: "yes" }],
    ["bad email", { name: NAME, email: "not-an-email", consent: "yes" }],
    ["no consent", { name: NAME, email: EMAIL }],
  ]) {
    const r = await fetch(`${BASE}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathway: "study", answers }),
    });
    r.status === 400
      ? ok(`refused: ${label}`)
      : bad(`${label} returned ${r.status}, expected 400`);
  }

  /* 3 — an admin can actually read it ------------------------------------ */
  const admin = process.env.QA_ADMIN_EMAIL;
  const adminPw = process.env.QA_ADMIN_PASSWORD;

  if (!admin || !adminPw) {
    console.log("  note  set QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD to check the staff view too");
  } else {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/login`, { waitUntil: "load" });
    await page.fill("#email", admin);
    await page.fill("#password", adminPw);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/portal/, { timeout: 30000 });

    await page.goto(`${BASE}/portal/admin/enquiries`, { waitUntil: "load" });
    const text = (await page.textContent("body")) ?? "";
    text.includes(NAME)
      ? ok("an administrator can see the enquiry in the portal")
      : bad("the enquiry is stored but does not appear on the staff page");

    /* And nobody else can. */
    const client = process.env.QA_CLIENT_EMAIL;
    const clientPw = process.env.QA_CLIENT_PASSWORD;
    if (client && clientPw) {
      const c2 = await browser.newContext();
      const p2 = await c2.newPage();
      await p2.goto(`${BASE}/login`, { waitUntil: "load" });
      await p2.fill("#email", client);
      await p2.fill("#password", clientPw);
      await p2.click('button[type="submit"]');
      await p2.waitForURL(/\/portal/, { timeout: 30000 });
      await p2.goto(`${BASE}/portal/admin/enquiries`, { waitUntil: "load" });
      const seen = (await p2.textContent("body")) ?? "";
      !seen.includes(NAME) && !/\/portal\/admin\/enquiries$/.test(p2.url())
        ? ok("a client is blocked from the enquiries page")
        : bad("A CLIENT CAN READ THE ENQUIRIES PAGE");
      await c2.close();
    }
    await ctx.close();
  }
} catch (error) {
  bad(`flow error: ${error instanceof Error ? error.message : error}`);
} finally {
  await browser.close();
  const gone = await sql`
    DELETE FROM enquiries WHERE email LIKE ${"%@snz-enquirytest.invalid"} RETURNING id
  `;
  console.log(`\n  cleaned up ${gone.length} test enquiry/enquiries`);
  await sql.end({ timeout: 5 });
}

console.log(fails === 0 ? "\n  ALL ENQUIRY CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
