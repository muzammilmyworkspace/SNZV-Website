/**
 * Signs in as each role and captures every portal screen.
 * Used to review the portal visually and to prove each route renders for the
 * roles that should reach it.
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "portal-shots";
const WIDTH = Number(process.env.W ?? 1440);
const HEIGHT = Number(process.env.H ?? 1000);

const ACCOUNTS = (process.env.ROLES ?? "student,professional,business,admin").split(",");

const ROUTES = [
  "/portal",
  "/portal/journey",
  "/portal/cases",
  "/portal/opportunities",
  "/portal/profile",
  "/portal/documents",
  "/portal/tasks",
  "/portal/messages",
  "/portal/appointments",
  "/portal/notifications",
  "/portal/settings",
  "/portal/support",
  "/portal/admin",
];

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const issues = [];

for (const role of ACCOUNTS) {
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => issues.push(`${role} PAGEERROR ${String(e).slice(0, 120)}`));
  page.on("console", (m) => {
    if (m.type() === "error") issues.push(`${role} console ${m.text().slice(0, 120)}`);
  });

  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForSelector("#email");
  await page.fill("#email", `${role}@test.local`);
  await page.fill("#password", "Str0ngPassword!");
  await page.click("button[type=submit]");
  await page.waitForURL("**/portal", { timeout: 25000 });

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);

    const landed = new URL(page.url()).pathname;
    const redirected = landed !== route;

    // Only /portal/admin and /portal/opportunities are role-scoped.
    const expectRedirect =
      (route === "/portal/admin" && role !== "admin" && role !== "advisor") ||
      false;

    if (redirected && !expectRedirect) {
      issues.push(`${role} ${route} → unexpectedly redirected to ${landed}`);
    }
    if (!redirected && expectRedirect) {
      issues.push(`${role} ${route} → SHOULD have been blocked but rendered`);
    }

    const overflow = await page.evaluate(() => {
      const d = document.documentElement;
      return d.scrollWidth > d.clientWidth + 2 ? `${d.scrollWidth}>${d.clientWidth}` : null;
    });
    if (overflow) issues.push(`${role} ${route} overflowX ${overflow}`);

    if (!redirected) {
      const slug = route.replace(/\//g, "_").slice(1);
      await page.screenshot({
        path: `${OUT}/${role}__${slug}.png`,
        fullPage: true,
      });
    }
  }

  await ctx.close();
}

await browser.close();
console.log(issues.length ? issues.join("\n") : "no issues");
