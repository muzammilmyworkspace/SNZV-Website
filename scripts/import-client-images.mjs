/**
 * Imports the client-supplied photographs from ./Images into the site.
 *
 *   node scripts/import-client-images.mjs
 *
 * WHY ONLY SOME OF THEM
 * The folder holds ten files. Five are used. The rest are not, and the reason
 * is editorial rather than technical:
 *
 *   • Ho Chi Minh City, Tokyo and Shanghai (x2) are not European destinations
 *     and are not among the source markets this firm actually recruits from.
 *     Putting them on a site whose entire proposition is the EU single market
 *     would misrepresent where SnZ operates.
 *   • Chernivtsi National University is a genuinely striking campus, but it is
 *     in Ukraine — neither an EU member nor one of the ten study destinations.
 *     A recognisable university standing in for "Europe" is the kind of detail
 *     a prospective student notices.
 *
 * They stay in ./Images, unused, so nothing is lost if the client wants them
 * placed somewhere honest.
 *
 * LICENCE
 * These arrived without provenance and the filenames read like stock-library
 * slugs. Every other image on this site carries a verified licence and is
 * credited on /legal/image-credits, so these are recorded as client-supplied
 * with the licence explicitly UNCONFIRMED rather than guessed. See
 * CONTENT-HANDOFF § 9.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "Images";
const OUT = "public/images";

/** key → [source file, width, height, why it belongs there] */
const PLACEMENTS = {
  "dest-madrid": [
    "cibeles-palace-is-most-prominent-buildings-plaza-de-cibeles-madrid-spain.jpg",
    1800,
    1350,
    "Spain destination card — Cibeles Palace is the landmark Madrid shot",
  ],
  "study-graduation": [
    "close-up-hands-holding-diplomas-caps.jpg",
    3400,
    1912,
    "Study Abroad hero — graduation, and a human one rather than an object",
  ],
  "business-boardroom": [
    "empty-conference-room-within-corporation-designed-productivity.jpg",
    3400,
    1912,
    "Business Setup hero — the room where an expansion decision gets made",
  ],
  "careers-office": [
    "empty-office-workplace-with-table-chair-computer.jpg",
    3400,
    1912,
    "Global Careers hero — the workplace the pathway leads to",
  ],
  "eu-parliament": [
    "european-parliament-building-strasbourg-france-with-clear-blue-sky-background.jpg",
    3400,
    1912,
    "Business Setup hero — the single market, stated literally",
  ],
};

const manifestPath = "data/image-manifest.json";
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

await fs.mkdir(OUT, { recursive: true });

for (const [key, [file, w, h, why]] of Object.entries(PLACEMENTS)) {
  const src = path.join(SRC, file);
  try {
    await fs.access(src);
  } catch {
    console.log(`MISS  ${key} — ${file} not found`);
    continue;
  }

  const buf = await fs.readFile(src);

  await sharp(buf)
    // `attention` picks the crop around the busiest region, which keeps the
    // subject rather than the geometric centre — it matters most for the
    // portrait graduation shot being cropped to 16:9.
    .resize(w, h, { fit: "cover", position: "attention" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(OUT, `${key}.webp`));

  const blur = `data:image/webp;base64,${(
    await sharp(buf).resize(20).webp({ quality: 20 }).toBuffer()
  ).toString("base64")}`;

  const entry = {
    key,
    file: `/images/${key}.webp`,
    source: "Client-supplied",
    licence: "Licence to confirm — see CONTENT-HANDOFF §9",
    artist: null,
    page: null,
    blur,
  };

  const at = manifest.findIndex((e) => e.key === key);
  if (at === -1) manifest.push(entry);
  else manifest[at] = entry;

  const kb = Math.round((await fs.stat(path.join(OUT, `${key}.webp`))).size / 1024);
  console.log(`OK    ${key.padEnd(18)} ${String(kb).padStart(4)}KB  ${why}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nmanifest: ${manifest.length} assets`);
