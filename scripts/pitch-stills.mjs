import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = "C:\\Users\\mrere\\.cursor\\projects\\c-Users-mrere-Downloads-portfolio-b2b\\assets";
const names = fs.readdirSync(dir);
const jobs = [
  ["clinic-ai", "4.10.09_PM__1_"],
  ["clinic-pharmacy", "4.10.10_PM__1_"],
  ["clinic-nurse", "4.10.10_PM__2_"],
  ["clinic-doctor", "4.10.10_PM-84a66e64"],
  ["clinic-home", "4.10.09_PM-83a51878"],
  ["sanvix", "4.08.24_PM-"],
  ["joury", "image-eeacff7b"],
];

const out = path.resolve("public/work/pitch");
fs.mkdirSync(out, { recursive: true });

for (const [dest, part] of jobs) {
  const name = names.find((file) => file.includes(part));
  if (!name) {
    console.log("missing", part);
    continue;
  }
  const absolute = path.join(dir, name);
  const prefixed = absolute.startsWith("\\\\?\\") ? absolute : `\\\\?\\${absolute}`;
  const buffer = fs.readFileSync(prefixed);
  await sharp(buffer)
    .rotate()
    .resize({ width: 1400, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(out, `${dest}.webp`));
  console.log(dest, buffer.length);
}
