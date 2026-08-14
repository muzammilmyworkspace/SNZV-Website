/**
 * Image pipeline: resolve → verify licence → download → optimise → manifest.
 * Sources: Wikimedia Commons (cities) + Unsplash (atmosphere).
 * Every asset is stored locally as WebP so nothing depends on a remote host.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = "public/images";
const UA = "SNZVenturesSite/1.0 (contact: info@snzventures.com)";

/** Commons file titles chosen for editorial quality + free licence. */
const commons = {
  vilnius: "File:Vilnius Modern Skyline At Dusk, Lithuania - Diliff.jpg",
  "vilnius-old": "File:Panoramic view of Vilnius from Gediminas' Tower, 2011 -a.jpg",
  berlin: "File:Museumsinsel Berlin Juli 2021 1 (cropped) b.jpg",
  warsaw: "File:Aleja Niepdleglosci Warsaw 2022 aerial (cropped).jpg",
  amsterdam: "File:Amsterdam Canals - July 2006.jpg",
  madrid: "File:Madrid - Sky Bar 360º (Hotel Riu Plaza España), vistas 19.jpg",
  rome: "File:Trevi Fountain, Rome, Italy 2 - May 2007.jpg",
  prague: "File:Prague (6365119737).jpg",
  bucharest: "File:Bucharest University Square (cropped).jpg",
  // Study-abroad destinations. Resolved by searching each city's Wikipedia
  // article for free-licensed, landscape, >1800px originals.
  budapest: "File:20190503 Hungarian Parliament Building 1814 2263 DxO.jpg",
  riga: "File:Aerial view, sun and clouds in Riga.jpg",
  valletta: "File:City Gate, Valletta 002.jpg",
  paris: "File:Arc de Triomphe HDR 2007.jpg",
  tallinn:
    "File:Ayuntamiento, vistas panorámicas desde Toompea, Tallin, Estonia, 2012-08-05, DD 21.JPG",
};

/**
 * Wide editorial plates that are not a city. Saved without the `dest-` prefix
 * because they are not destination cards.
 */
const commonsPlates = {
  // Study Abroad hero. A university, in a destination country, that reads as a
  // campus at a glance — the previous hero was a generic library interior.
  "study-campus": "File:Kazimierz Palace.JPG",
};

async function commonsInfo(title) {
  // commons.wikimedia.org resets connections from this host; en.wikipedia.org
  // exposes the identical imageinfo for Commons-hosted files.
  const u = new URL("https://en.wikipedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "2000",
    format: "json",
  });
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  const j = await r.json();
  const pages = j.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page?.imageinfo) return null;
  const info = page.imageinfo[0];
  const m = info.extmetadata ?? {};
  const strip = (s) => (s ? String(s).replace(/<[^>]*>/g, "").trim() : null);
  return {
    url: info.thumburl || info.url,
    licence: strip(m.LicenseShortName?.value),
    artist: strip(m.Artist?.value),
    descUrl: info.descriptionurl,
  };
}

async function save(buf, name, w, h) {
  await sharp(buf)
    .resize(w, h, { fit: "cover", position: "attention" })
    .webp({ quality: 76, effort: 5 })
    .toFile(path.join(OUT, `${name}.webp`));
  // Tiny blur placeholder for LQIP
  const lqip = await sharp(buf).resize(20).webp({ quality: 20 }).toBuffer();
  return `data:image/webp;base64,${lqip.toString("base64")}`;
}

const manifest = [];

/**
 * Previously-verified entries, kept so a network failure part-way through
 * cannot silently drop licence attribution for an image that is still on disk
 * and still being rendered. New results upsert over these by key.
 */
const previous = JSON.parse(
  await fs.readFile("data/image-manifest.json", "utf8").catch(() => "[]")
);

await fs.mkdir(OUT, { recursive: true });

for (const [key, title] of Object.entries(commons)) {
  try {
    const info = await commonsInfo(title);
    if (!info) {
      console.log(`MISS  ${key} (${title})`);
      continue;
    }
    const buf = Buffer.from(
      await (await fetch(info.url, { headers: { "User-Agent": UA } })).arrayBuffer()
    );
    const blur = await save(buf, `dest-${key}`, 1200, 900);
    manifest.push({
      key: `dest-${key}`,
      file: `/images/dest-${key}.webp`,
      source: "Wikimedia Commons",
      licence: info.licence,
      artist: info.artist,
      page: info.descUrl,
      blur,
    });
    console.log(`OK    dest-${key}  [${info.licence}]  ${info.artist ?? ""}`);
  } catch (e) {
    console.log(`FAIL  ${key}: ${e.message}`);
  }
}

/* Wide plates. Cropped 2400x1350 (16:9) because they are used full-bleed. */
for (const [key, title] of Object.entries(commonsPlates)) {
  try {
    const info = await commonsInfo(title);
    if (!info) {
      console.log(`MISS  ${key} (${title})`);
      continue;
    }
    const buf = Buffer.from(
      await (await fetch(info.url, { headers: { "User-Agent": UA } })).arrayBuffer()
    );
    const blur = await save(buf, key, 2400, 1350);
    manifest.push({
      key,
      file: `/images/${key}.webp`,
      source: "Wikimedia Commons",
      licence: info.licence,
      artist: info.artist,
      page: info.descUrl,
      blur,
    });
    console.log(`OK    ${key}  [${info.licence}]  ${info.artist ?? ""}`);
  } catch (e) {
    console.log(`FAIL  ${key}: ${e.message}`);
  }
}

/** Unsplash atmosphere shots — vetted individually, Unsplash Licence. */
const unsplash = {
  "path-study": "photo-1523240795612-9a054b0db644",
  "path-careers": "photo-1497215728101-856f4ea42174",
  "path-business": "photo-1486406146926-c627a92ad1ab",
  "atmos-graduation": "photo-1523050854058-8df90110c9f1",
  "atmos-library": "photo-1521587760476-6c12a4b040da",
  "atmos-fintech": "photo-1451187580459-43490279c0fa",
};

for (const [name, id] of Object.entries(unsplash)) {
  try {
    const url = `https://images.unsplash.com/${id}?w=1600&q=80&fm=jpg`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`MISS  ${name} (${id}) ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const blur = await save(buf, name, 1400, 1000);
    manifest.push({
      key: name,
      file: `/images/${name}.webp`,
      source: "Unsplash",
      licence: "Unsplash Licence",
      page: `https://unsplash.com/photos/${id.replace("photo-", "")}`,
      blur,
    });
    console.log(`OK    ${name}`);
  } catch (e) {
    console.log(`FAIL  ${name}: ${e.message}`);
  }
}

const merged = [...previous];
for (const entry of manifest) {
  const at = merged.findIndex((e) => e.key === entry.key);
  if (at === -1) merged.push(entry);
  else merged[at] = entry;
}

await fs.writeFile("data/image-manifest.json", JSON.stringify(merged, null, 2));
console.log(
  `\nmanifest: ${merged.length} assets (${manifest.length} fetched this run)`
);
