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

await fs.writeFile(
  "data/image-manifest.json",
  JSON.stringify(manifest, null, 2)
);
console.log(`\nmanifest: ${manifest.length} assets`);
