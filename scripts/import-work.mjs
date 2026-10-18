import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(".");
const outRoot = path.join(root, "public", "work", "archive");
const reelRoot = path.join(root, "public", "work", "reel");

const occasions =
  "C:\\Users\\mrere\\Downloads\\مناسبات -20261018T125415Z-1-001\\مناسبات\\2026";
const education =
  "C:\\Users\\mrere\\Downloads\\Education Fields-20261018T125424Z-1-001\\Education Fields";
const estate =
  "C:\\Users\\mrere\\Downloads\\Real Estate Fields-20261018T125426Z-1-001\\Real Estate Fields";
const different =
  "C:\\Users\\mrere\\Downloads\\Different Fields-20261018T125421Z-1-001\\Different Fields";
const automotive =
  "C:\\Users\\mrere\\Downloads\\Automotive Branding-20261018T125417Z-1-001\\Automotive Branding";
const assets =
  "C:\\Users\\mrere\\.cursor\\projects\\c-Users-mrere-Downloads-portfolio-b2b\\assets";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) found.push(full);
  }
  return found;
}

function keep(file) {
  const name = path.basename(file);
  if (/\(\d+\)/.test(name)) return false;
  if (/whatsapp/i.test(name)) return false;
  if (/chatgpt/i.test(name)) return false;
  return true;
}

function pick(files, count) {
  const list = files.filter(keep).sort((a, b) => {
    const size = fs.statSync(b).size - fs.statSync(a).size;
    if (Math.abs(size) > 400_000) return size;
    return path.basename(a).localeCompare(path.basename(b), "en");
  });
  const unique = [];
  const seen = new Set();
  for (const file of list) {
    const key = path.basename(file).replace(/\.[^.]+$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(file);
  }
  if (unique.length <= count) return unique;
  const chosen = [];
  const step = (unique.length - 1) / (count - 1);
  for (let index = 0; index < count; index += 1) {
    chosen.push(unique[Math.round(index * step)]);
  }
  return [...new Set(chosen)];
}

function named(files, pattern) {
  return files.filter((file) => pattern.test(path.basename(file)));
}

async function writeSet(slug, files) {
  const dir = path.join(outRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  const images = [];
  let index = 1;
  for (const file of files) {
    const dest = `${String(index).padStart(2, "0")}.webp`;
    await sharp(file)
      .rotate()
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(path.join(dir, dest));
    images.push(`/work/archive/${slug}/${dest}`);
    index += 1;
  }
  return images;
}

const occasionFiles = walk(occasions);
const october = walk(path.join(occasions, "(2026) 6 اكتوبر"));
const july = walk(path.join(occasions, "(2026) 23 يوليو"));
const june = walk(path.join(occasions, "30 يونيو"));
const eid = walk(path.join(occasions, "عيد الاضحي"));
const cup = walk(path.join(occasions, "كاس العالم 2026"));

const attached = walk(assets);
const reelSources = {
  shark: attached.find((file) => /shark/i.test(file)),
  tevo: attached.find((file) => /tevo/i.test(file)),
  onyx: attached.find((file) => /onyx/i.test(file)),
  protexa: attached.find((file) => /pro-/i.test(path.basename(file)) || /PRO-/i.test(file)),
};

const sets = {
  "shark-care": [
    reelSources.shark,
    ...pick(named(occasionFiles, /shark/i), 5),
  ].filter(Boolean),
  tevo: [reelSources.tevo, ...pick(named(occasionFiles, /tevo/i), 5)].filter(Boolean),
  onyx: [reelSources.onyx, ...pick(named(occasionFiles, /onyx/i), 5)].filter(Boolean),
  protexa: [
    reelSources.protexa,
    ...pick(named(occasionFiles, /protexa|^pro\b/i), 5),
  ].filter(Boolean),
  "el-khateeb": pick(walk(path.join(automotive, "el-khateeb", "social")), 8),
  teachsmart: pick(walk(path.join(education, "teachsmart")), 6),
  "applied-school": pick(walk(path.join(education, "Applied School")), 6),
  marhaba: pick(walk(path.join(education, "مرحبا")), 6),
  "new-era": pick(walk(path.join(estate, "NEW ERA")), 6),
  "aqar-expo": pick(walk(path.join(estate, "AQAR EXPO")), 6),
  "rise-tower": pick(walk(path.join(estate, "RISE TOWER")), 6),
  glory: pick(walk(path.join(estate, "جلوري")), 6),
  "lux-realty": pick(walk(path.join(estate, "LUX REALUTY")), 6),
  kivo: pick(walk(path.join(different, "KIVO")), 6),
  "ouzu-cafe": pick(walk(path.join(different, "ouzu cafe")), 6),
  horizon: pick(walk(path.join(different, "HORIZON")), 6),
  calia: pick(walk(path.join(different, "calia")), 6),
  drago: pick(
    [...walk(path.join(different, "DRAGO")), ...named(occasionFiles, /drago/i)],
    6,
  ),
  mas: pick(walk(path.join(different, "mas")), 6),
  "tiffany-mall": pick(walk(path.join(different, "TIFFANY MALL")), 6),
  "october-6": pick(october, 6),
  "july-23": pick(july, 6),
  "june-30": pick(june, 6),
  "eid-adha": pick(eid, 6),
  "world-cup": pick(cup, 4),
};

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(reelRoot, { recursive: true });

const manifest = {};
for (const [slug, files] of Object.entries(sets)) {
  const uniqueFiles = [...new Set(files)];
  manifest[slug] = await writeSet(slug, uniqueFiles);
  console.log(`${slug}: ${manifest[slug].length}`);
}

const reelOrder = ["shark", "tevo", "onyx", "protexa"];
for (const key of reelOrder) {
  const source = reelSources[key];
  if (!source) {
    console.log(`reel missing: ${key}`);
    continue;
  }
  await sharp(source)
    .rotate()
    .resize({ width: 1800, height: 2200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(reelRoot, `${key}.webp`));
  console.log(`reel ${key}`);
}

fs.writeFileSync(
  path.join(root, "scripts", "work-manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log("done");
