/**
 * PRODUCT SHOTS OF THE PORTAL, WITH NOBODY REAL IN THEM.
 *
 *   npm run build:portal-shots
 *
 * Photographs the client portal for the homepage's portal section, against a
 * throwaway database seeded with invented people. Writes WebP into
 * public/images/ and records every file in data/image-manifest.json.
 *
 * WHY NOT PHOTOGRAPH THE LIVE PORTAL AND BLUR THE NAMES. Because a blur is a
 * filter over data that is still in the file, and a crop is an edge somebody
 * can argue about. A student's name, email, passport number and documents are
 * all on those screens. The only version of this that is defensible a year
 * later is one where the data was never real.
 *
 * WHY NOT MOCK THE UI UP IN THIS REPO. There is a demo shell under /demo that
 * would photograph nicely, but it is a preview built here — it is not the
 * product, and the two can drift. These are the actual portal, rendering
 * actual rows, so what the marketing site shows is what a student gets.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SETUP, once, in ../SNZ Portal:
 *
 *   npm run devdb:start                        # local Postgres on :5433
 *   psql … -c 'CREATE DATABASE snz_shots'      # or the node one-liner
 *   DATABASE_URL="postgresql://snzv:snzv_dev_only@127.0.0.1:5433/snz_shots?sslmode=disable" \
 *     npm run db:migrate && npm run seed:demo
 *   DATABASE_URL="…/snz_shots?sslmode=disable" npx next dev --port 3030
 *
 * `seed:demo` refuses to run against anything that is not local and not named
 * for the job, so the sequence above cannot be pointed at production by
 * leaving a variable exported.
 * ──────────────────────────────────────────────────────────────────────────
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const PORTAL = process.env.PORTAL_URL ?? "http://localhost:3030";
const EMAIL = process.env.SHOT_EMAIL ?? "rohan.mehta@example.test";
const PASSWORD = process.env.SHOT_PASSWORD ?? "DemoPortal!2026";

const OUT = path.join(process.cwd(), "public", "images");
const MANIFEST = path.join(process.cwd(), "data", "image-manifest.json");

/**
 * The four screens, and why each one is here.
 *
 * Together they answer the question the portal section is really being asked:
 * what do I get for signing up. One dashboard screenshot answers none of it.
 */
const SHOTS = [
  {
    key: "portal-dashboard",
    route: "/portal/student",
    label: "Dashboard — what is outstanding and what happens next",
  },
  {
    key: "portal-journey",
    route: "/portal/journey",
    label: "Journey — the stage the application has reached",
  },
  {
    key: "portal-documents",
    route: "/portal/documents",
    label: "Documents — what is approved and what needs replacing",
  },
  {
    key: "portal-application",
    route: "/portal/application",
    label: "Application — the form, saved as it is filled in",
  },
];

/*
  A desktop frame, captured at 2× and written out at 1×-and-a-half. The
  section renders these around 640px wide, so ~1280 of real pixels is enough
  to stay crisp on a retina screen without shipping a 4K asset for a card.
*/
const VIEWPORT = { width: 1280, height: 900 };
const SCALE = 2;
const OUT_WIDTH = 1600;

await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: SCALE,
});
const page = await context.newPage();

/*
  The Next dev-tools badge sits in the bottom-left corner of every page and is
  not part of the product. Hidden rather than cropped, so the frame stays the
  shape the layout was designed at.
*/
await page.addInitScript(() => {
  const hide = () => {
    const el = document.createElement("style");
    el.textContent =
      "nextjs-portal, #__next-build-watcher, [data-nextjs-toast] { display: none !important }";
    document.head?.appendChild(el);
  };
  if (document.head) hide();
  else document.addEventListener("DOMContentLoaded", hide);
});

let failures = 0;

try {
  /* ----------------------------------------------------------- sign in -- */

  await page.goto(`${PORTAL}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 20_000 }),
    page.click('button[type="submit"]'),
  ]);

  console.log(`  signed in as ${EMAIL}\n`);

  /* ------------------------------------------------------------ shots --- */

  const entries = [];

  for (const shot of SHOTS) {
    try {
      await page.goto(`${PORTAL}${shot.route}`, { waitUntil: "networkidle" });

      /*
        The portal animates panels in on mount, and a screenshot taken mid
        transition catches them at half opacity. Fonts settle in the same
        window.
      */
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400);

      /*
        Dialogs are dismissed, not photographed. The fee gate and the
        onboarding prompts are correct product behaviour and wrong product
        shots — they are a door, and this is meant to show the room.
      */
      await page.evaluate(() => {
        document.querySelectorAll("dialog[open]").forEach((d) => d.close?.());
      });
      await page.waitForTimeout(250);

      const png = await page.screenshot({ type: "png" });

      await sharp(png)
        .resize({ width: OUT_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(OUT, `${shot.key}.webp`));

      entries.push({
        key: shot.key,
        file: `/images/${shot.key}.webp`,
        source: "SnZ Ventures client portal",
        licence: "© SnZ Ventures — own product",
        artist: "SnZ Ventures",
        page: "https://portal.snzventures.com",
        note: "Captured against a throwaway database of invented people. No client data.",
      });

      console.log(`  ok    ${shot.key}  ${shot.route}`);
    } catch (error) {
      failures++;
      console.log(`  FAIL  ${shot.key} — ${error.message?.split("\n")[0]}`);
    }
  }

  /* --------------------------------------------------------- manifest --- */

  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  const kept = manifest.filter((m) => !String(m.key).startsWith("portal-"));
  await fs.writeFile(
    MANIFEST,
    JSON.stringify([...kept, ...entries], null, 2) + "\n",
    "utf8"
  );

  console.log(`\n  ${entries.length} shots${failures ? `, ${failures} FAILED` : ""}\n`);
} catch (error) {
  console.error(`\n  ${error.message?.split("\n")[0]}\n`);
  failures++;
} finally {
  await browser.close();
}

process.exit(failures ? 1 : 0);
