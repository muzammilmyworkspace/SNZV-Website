/**
 * Additional cinematic plates for the MERIDIAN art direction.
 * Each was visually vetted before inclusion; US-specific skylines and
 * landscape/travel tropes were rejected as off-brief for an EU advisory brand.
 */
import sharp from "sharp";
import fs from "node:fs/promises";

const OUT = "public/images";
const UA = { "User-Agent": "SNZVenturesSite/1.0" };

const plates = {
  "hero-aerial": {
    id: "photo-1480714378408-67cf0d13bc1b",
    note: "Anonymous city at night from above — global, not city-specific",
    w: 3400,
    h: 1912,
  },
  "plate-departure": {
    id: "photo-1436491865332-7a61a109cc05",
    note: "Above the clouds at golden hour — the crossing",
    w: 3000,
    h: 2000,
  },
  "plate-europe-dawn": {
    id: "photo-1531971589569-0d9370cbe1e5",
    note: "Vienna rooftops at dawn — European, editorial",
    w: 3000,
    h: 2000,
  },
  "plate-street": {
    id: "photo-1449824913935-59a10b8d2000",
    note: "Empty street, early light — quiet, cinematic",
    w: 3000,
    h: 2000,
  },
};

await fs.mkdir(OUT, { recursive: true });
const added = [];

for (const [name, p] of Object.entries(plates)) {
  const url = `https://images.unsplash.com/${p.id}?w=${Math.max(p.w, 3000)}&q=90&fm=jpg`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) {
    console.log(`MISS ${name} ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(p.w, p.h, { fit: "cover", position: "attention" })
    .webp({ quality: 84, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);
  added.push({
    key: name,
    file: `/images/${name}.webp`,
    source: "Unsplash",
    licence: "Unsplash Licence",
    page: `https://unsplash.com/photos/${p.id.replace("photo-", "")}`,
  });
  console.log(`OK   ${name}  (${p.note})`);
}

// Merge into the existing credits manifest rather than replacing it
const manifestPath = "data/image-manifest.json";
const existing = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const keys = new Set(existing.map((e) => e.key));
for (const a of added) if (!keys.has(a.key)) existing.push(a);
await fs.writeFile(manifestPath, JSON.stringify(existing, null, 2));
console.log(`manifest now ${existing.length} assets`);
