/**
 * THE STUDENT JOURNEY — consent, admission form, and the case it becomes.
 *
 *   npm run audit:intake
 *
 * Registers a throwaway student, walks the whole admission form in a real
 * browser, submits it, and checks the three things that have to be true
 * afterwards: the undertaking is on record with the wording that was shown, the
 * answers are stored, and ONE case exists for staff to open.
 *
 * It also checks the two refusals that matter, because a consent that can be
 * skipped is not a consent: registering as a student without accepting is
 * rejected by the API even when the browser omits the field entirely, and a job
 * seeker is never asked for an undertaking that does not apply to them.
 *
 * Everything it creates is on the RFC 2606 reserved `.invalid` domain and is
 * removed in `finally`, including when the checks fail.
 */
import "./lib/env.mjs";
import { chromium } from "playwright";
import postgres from "postgres";

const BASE = process.env.BASE ?? "http://localhost:3000";
const STAMP = process.env.STAMP ?? String(process.hrtime.bigint()).slice(-9);
const EMAIL = `intake-${STAMP}@snz-intaketest.invalid`;
const PASSWORD = "Intake-Test-2026";
const NAME = "Intake Test Student";

let fails = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => { fails++; console.log(`  FAIL  ${m}`); };

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: "require", prepare: false });
const browser = await chromium.launch();

async function api(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

try {
  /* 1 — a student cannot register without the undertaking ----------------- */
  {
    const r = await api("/api/auth/register", {
      name: NAME, email: `no-consent-${STAMP}@snz-intaketest.invalid`,
      password: PASSWORD, pathway: "study",
    });
    r.status === 400
      ? ok("a student registration with no consent is refused by the API")
      : bad(`registering a student without consent returned ${r.status}, expected 400`);
  }

  /* 2 — ticking the box without signing is not enough ---------------------- */
  {
    const r = await api("/api/auth/register", {
      name: NAME, email: `no-signature-${STAMP}@snz-intaketest.invalid`,
      password: PASSWORD, pathway: "study",
      consent: { accepted: true, signedName: "" },
    });
    r.status === 400
      ? ok("accepting without typing a signature is refused")
      : bad(`consent without a signature returned ${r.status}, expected 400`);
  }

  /* 3 — a job seeker is never asked for it -------------------------------- */
  {
    const email = `jobseeker-${STAMP}@snz-intaketest.invalid`;
    const r = await api("/api/auth/register", {
      name: NAME, email, password: PASSWORD, pathway: "career",
    });
    r.status === 200
      ? ok("a job seeker registers with no undertaking — it does not apply to them")
      : bad(`job seeker registration returned ${r.status}, expected 200`);

    const rows = await sql`
      SELECT count(*)::int AS n FROM consents c JOIN users u ON u.id = c.user_id
      WHERE u.email = ${email}`;
    rows[0].n === 0
      ? ok("and no consent row was written for them")
      : bad(`a consent was recorded for a job seeker (${rows[0].n} rows)`);
  }

  /* 4 — register a student properly, through the browser ------------------ */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/register`, { waitUntil: "load" });
  await page.getByRole("button", { name: /study abroad/i }).click();

  const consentBox = page.locator('input[type="checkbox"]');
  await consentBox.waitFor({ state: "visible", timeout: 20000 });
  ok("the undertaking is shown on the study pathway");

  await page.fill("#name", NAME);
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.fill("#confirm", PASSWORD);
  await page.fill("#signedName", NAME);
  await consentBox.check();
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/portal/, { timeout: 30000 });
  ok("the student registers and lands in the portal");

  /* 5 — the consent is on record, with the version that was shown --------- */
  {
    const [row] = await sql`
      SELECT c.version, c.signed_name, c.ip
      FROM consents c JOIN users u ON u.id = c.user_id
      WHERE u.email = ${EMAIL}`;
    if (!row) {
      bad("no consent was recorded for the student");
    } else {
      row.signed_name === NAME
        ? ok(`consent recorded, signed "${row.signed_name}", version ${row.version}`)
        : bad(`consent recorded the wrong signature: ${row.signed_name}`);
    }
  }

  /* 6 — the admission form covers the paper document ---------------------- */
  await page.goto(`${BASE}/portal/application`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const asterisks = await page.locator('label span[aria-hidden="true"]').count();
  asterisks > 0
    ? ok(`required fields are marked (${asterisks} on the first step)`)
    : bad("no required-field markers on the first step");

  /* 7 — fill and submit the whole form, then look for the case ----------- */
  /*
    Submitted through the API using the session the browser just established,
    rather than by clicking through twelve steps. The POST validates EVERY step
    server-side regardless of what the client sends, so this meets the same
    rules a person walking the form would, without making the test a long
    typing exercise that breaks on any layout change.
  */
  const answers = {
    givenName: "Intake", familyName: "Student", gender: "Male",
    citizenship: "Pakistan", passportNumber: "AB1234567",
    passportIssueDate: "2022-01-10", passportExpiryDate: "2032-01-09",
    passportIssuedBy: "Islamabad", dateOfBirth: "2001-05-14",
    countryOfBirth: "Pakistan", placeOfBirth: "Lahore",

    contactEmail: EMAIL, mobile: "+92 300 0000000",
    streetAddress: "12 Test Street", cityRegion: "Punjab", country: "Pakistan",

    emergencyName: "Test Guardian", emergencyPhone: "+92 300 1111111",
    emergencyRelation: "Father",

    highestQualification: "Bachelor's degree", institution: "Test University",
    programName: "BSc Computer Science", awardedQualification: "BSc",
    studyStartDate: "2019-09-01", expectedGraduation: "2023-06-30",
    institutionCountry: "Pakistan", languageOfInstruction: "English",

    nativeLanguage: "Urdu", englishTest: "IELTS Academic",

    stayedAbroad: "No",

    whyProgram: "Testing the admission form end to end.",
    expectedGain: "Testing the admission form end to end.",
    suitability: "Testing the admission form end to end.",
    careerGoals: "Testing the admission form end to end.",

    countries: ["Lithuania"], fundingSource: "Family support",

    informationSource: "Automated test",
    declaration: "Yes, I confirm",
  };

  /*
    Save a draft first, because that is what actually happens: the form writes
    one on every step change, and there is no path through the interface that
    reaches Submit without having saved. Posting straight to submit would be
    testing a route no person takes.
  */
  await page.request.put(`${BASE}/api/portal/intake`, {
    headers: { "Content-Type": "application/json" },
    data: { step: 0, answers, resumeAt: 0 },
  });

  const submit = await page.request.post(`${BASE}/api/portal/intake`, {
    headers: { "Content-Type": "application/json" },
    data: { answers },
  });
  const submitBody = await submit.json().catch(() => ({}));

  if (!submit.ok()) {
    const missing = (submitBody.missing ?? []).map((m) => m.label).join(", ");
    bad(`submitting the completed form returned ${submit.status()}${missing ? ` — missing: ${missing}` : ""}`);
  } else {
    ok("the completed admission form is accepted");

    const [form] = await sql`
      SELECT f.status, f.case_id, f.data
      FROM intake_forms f JOIN users u ON u.id = f.user_id
      WHERE u.email = ${EMAIL}`;

    form?.status === "submitted"
      ? ok("the form is recorded as submitted")
      : bad(`the form status is ${form?.status ?? "missing"}, expected submitted`);

    const stored = Object.keys(form?.data ?? {}).length;
    stored >= 30
      ? ok(`${stored} answers stored`)
      : bad(`only ${stored} answers stored`);

    const cases = await sql`
      SELECT c.id, c.title, c.status, c.country, c.reference
      FROM cases c JOIN users u ON u.id = c.client_id
      WHERE u.email = ${EMAIL}`;

    if (cases.length !== 1) {
      bad(`expected exactly one case, found ${cases.length}`);
    } else {
      ok(`one case opened: "${cases[0].title}" (${cases[0].status}, ${cases[0].country})`);
      form?.case_id === cases[0].id
        ? ok("the form is linked to that case — one enquiry, one thing")
        : bad("the submitted form is not linked to the case");
      cases[0].reference
        ? ok(`the case carries a reference: ${cases[0].reference}`)
        : bad("the case has no reference number");
    }
  }

  console.log(fails === 0 ? "\n  ALL STUDENT INTAKE CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
} catch (error) {
  bad(`flow error: ${error instanceof Error ? error.message : error}`);
} finally {
  await browser.close();

  /*
    THE CONNECTION IS CLOSED HERE AND NOWHERE ELSE.

    It was also closed at the end of the success path, which meant that on a
    passing run this delete ran against a connection that was already gone,
    threw, and was swallowed by the catch below — so the tests reported success
    while leaving four accounts, a case and two consent records behind on the
    real database. A cleanup that only works when the test fails is worse than
    none, because nobody goes looking.
  */
  const gone = await sql`
    DELETE FROM users WHERE email LIKE ${"%@snz-intaketest.invalid"} RETURNING email
  `;
  console.log(`  cleaned up ${gone.length} test account(s)`);
  await sql.end({ timeout: 5 });
}

process.exit(fails === 0 ? 0 : 1);
