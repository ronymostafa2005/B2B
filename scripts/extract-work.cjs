const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..", "public", "work");
const outDir = path.join(root, "pieces");

function dist(r, g, b, R, G, B) {
  return Math.hypot(r - R, g - G, b - B);
}

function isPageBg(r, g, b) {
  if (dist(r, g, b, 132, 19, 127) < 78) return true;
  if (r > 90 && b > 90 && g < r - 35 && g < b - 20 && Math.abs(r - b) < 70 && g < 160) {
    return true;
  }
  return false;
}

function isMediaBg(r, g, b) {
  return (
    r >= g + 8 &&
    b >= g + 8 &&
    Math.abs(r - b) <= Math.max(14, 0.42 * Math.max(r, b)) &&
    g < 190
  );
}

function isPageSolid(r, g, b) {
  return dist(r, g, b, 132, 19, 127) < 42;
}

function isChrome(r, g, b) {
  return Math.hypot(r - 231, g - 228, b - 222) < 26;
}

function flood(data, w, h, pred) {
  const bg = new Uint8Array(w * h);
  const q = [];
  const push = (x, y) => {
    const p = y * w + x;
    if (bg[p]) return;
    const i = p * 4;
    if (!pred(data[i], data[i + 1], data[i + 2])) return;
    bg[p] = 1;
    q.push(p);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (q.length) {
    const p = q.pop();
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }
  return bg;
}

function components(bg, w, h, minCount) {
  const seen = new Uint8Array(w * h);
  const boxes = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (bg[p] || seen[p]) continue;
      let minx = x;
      let maxx = x;
      let miny = y;
      let maxy = y;
      let count = 0;
      const q = [p];
      seen[p] = 1;
      while (q.length) {
        const c = q.pop();
        const cx = c % w;
        const cy = (c / w) | 0;
        count++;
        if (cx < minx) minx = cx;
        if (cx > maxx) maxx = cx;
        if (cy < miny) miny = cy;
        if (cy > maxy) maxy = cy;
        const next = [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ];
        for (const [nx, ny] of next) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const np = ny * w + nx;
          if (bg[np] || seen[np]) continue;
          seen[np] = 1;
          q.push(np);
        }
      }
      if (count >= minCount) boxes.push({ minx, miny, maxx, maxy, count });
    }
  }
  boxes.sort((a, b) => a.minx - b.minx || a.miny - b.miny);
  return boxes;
}

function longestRun(flags) {
  let best = [0, 0];
  let start = null;
  for (let i = 0; i <= flags.length; i++) {
    if (i < flags.length && flags[i]) {
      if (start === null) start = i;
    } else if (start !== null) {
      if (i - start > best[1] - best[0]) best = [start, i];
      start = null;
    }
  }
  return best;
}

function innerPoster(data, w, box) {
  const rows = [];
  for (let y = box.miny; y <= box.maxy; y++) {
    let chrome = 0;
    let n = 0;
    for (let x = box.minx; x <= box.maxx; x++) {
      const i = (y * w + x) * 4;
      n++;
      if (isChrome(data[i], data[i + 1], data[i + 2])) chrome++;
    }
    rows.push(n > 0 && chrome / n <= 0.72);
  }
  const [rs, re] = longestRun(rows);
  if (re - rs < 80) return null;
  const top = box.miny + rs;
  const bottom = box.miny + re - 1;
  let left = box.maxx;
  let right = box.minx;
  for (let x = box.minx; x <= box.maxx; x++) {
    let chrome = 0;
    let n = 0;
    for (let y = top; y <= bottom; y++) {
      const i = (y * w + x) * 4;
      n++;
      if (isChrome(data[i], data[i + 1], data[i + 2])) chrome++;
    }
    if (n > 0 && chrome / n <= 0.72) {
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  if (right - left < 40) return null;
  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function load(file) {
  return sharp(path.join(root, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function saveCrop(source, file, rect, name) {
  await sharp(source)
    .extract(rect)
    .png()
    .toFile(path.join(outDir, name));
  console.log(name, rect.width + "x" + rect.height);
}

async function extractCards(file, slug) {
  const { data, info } = await load(file);
  const bg = flood(data, info.width, info.height, isPageBg);
  const boxes = components(bg, info.width, info.height, 8000).filter(
    (box) => box.maxx - box.minx > 90 && box.maxy - box.miny > 140,
  );
  const source = path.join(root, file);
  let n = 0;
  for (const box of boxes) {
    const rect = innerPoster(data, info.width, box);
    if (!rect) {
      console.log("skip inner", slug, box);
      continue;
    }
    n++;
    await saveCrop(source, file, rect, `${slug}-${n}.png`);
  }
}

function dilate(mask, w, h, radius) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          out[ny * w + nx] = 1;
        }
      }
    }
  }
  return out;
}

async function extractLogos() {
  const files = ["logos-a.png", "logos-b.png", "logos-c.png"];
  let n = 0;
  for (const file of files) {
    const { data, info } = await load(file);
    const w = info.width;
    const h = info.height;
    const ink = new Uint8Array(w * h);
    for (let p = 0; p < w * h; p++) {
      const i = p * 4;
      if (!isPageSolid(data[i], data[i + 1], data[i + 2])) ink[p] = 1;
    }
    const grown = dilate(ink, w, h, 9);
    const bg = new Uint8Array(w * h);
    for (let p = 0; p < w * h; p++) bg[p] = grown[p] ? 0 : 1;
    const boxes = mergeCloseMarks(components(bg, w, h, 400).filter((box) => box.miny > 52));
    const source = await sharp(path.join(root, file)).ensureAlpha().png().toBuffer();
    for (const box of boxes) {
      const left = Math.max(0, box.minx - 2);
      const top = Math.max(0, box.miny - 2);
      const width = Math.min(w - left, box.maxx - box.minx + 5);
      const height = Math.min(h - top, box.maxy - box.miny + 5);
      const cropped = await sharp(source).extract({ left, top, width, height }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const pixels = cropped.data;
      for (let p = 0; p < cropped.info.width * cropped.info.height; p++) {
        const i = p * 4;
        if (isPageSolid(pixels[i], pixels[i + 1], pixels[i + 2])) pixels[i + 3] = 0;
      }
      n++;
      const name = `logos-${n}.png`;
      await sharp(pixels, {
        raw: { width: cropped.info.width, height: cropped.info.height, channels: 4 },
      })
        .trim()
        .png()
        .toFile(path.join(outDir, name));
      console.log(name, cropped.info.width + "x" + cropped.info.height);
    }
  }
}

function mergeCloseMarks(boxes) {
  const list = boxes.map((box) => ({ ...box }));
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const small =
          a.maxx - a.minx < 80 &&
          a.maxy - a.miny < 80 &&
          b.maxx - b.minx < 80 &&
          b.maxy - b.miny < 80;
        const gapX = Math.max(a.minx, b.minx) - Math.min(a.maxx, b.maxx);
        const overlapY = Math.min(a.maxy, b.maxy) - Math.max(a.miny, b.miny);
        if (small && gapX < 28 && gapX > -8 && overlapY > 8) {
          list[i] = {
            minx: Math.min(a.minx, b.minx),
            miny: Math.min(a.miny, b.miny),
            maxx: Math.max(a.maxx, b.maxx),
            maxy: Math.max(a.maxy, b.maxy),
            count: a.count + b.count,
          };
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a.miny - b.miny || a.minx - b.minx);
}

function mergeBoxes(boxes) {
  const list = boxes.map((box) => ({ ...box }));
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const overlapX = Math.min(a.maxx, b.maxx) - Math.max(a.minx, b.minx);
        const gapY = Math.max(a.miny, b.miny) - Math.min(a.maxy, b.maxy);
        const width = Math.min(a.maxx - a.minx, b.maxx - b.minx);
        if (overlapX > width * 0.7 && gapY < 6 && gapY > -8) {
          list[i] = {
            minx: Math.min(a.minx, b.minx),
            miny: Math.min(a.miny, b.miny),
            maxx: Math.max(a.maxx, b.maxx),
            maxy: Math.max(a.maxy, b.maxy),
            count: a.count + b.count,
          };
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a.minx - b.minx || a.miny - b.miny);
}

async function extractMedia() {
  const files = ["media-a.png", "media-b.png"];
  let n = 0;
  for (const file of files) {
    const { data, info } = await load(file);
    const bg = flood(data, info.width, info.height, isMediaBg);
    let boxes = components(bg, info.width, info.height, 1200).filter((box) => {
      const bw = box.maxx - box.minx;
      const bh = box.maxy - box.miny;
      return bw > 70 && bh > 28;
    });
    boxes = mergeBoxes(boxes).filter((box) => box.maxy - box.miny > 70);
    const source = path.join(root, file);
    for (const box of boxes) {
      n++;
      await saveCrop(
        source,
        file,
        {
          left: box.minx,
          top: box.miny,
          width: box.maxx - box.minx + 1,
          height: box.maxy - box.miny + 1,
        },
        `media-${n}.png`,
      );
    }
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(outDir)) fs.unlinkSync(path.join(outDir, file));
  const cards = [
    "education",
    "clinic",
    "realestate",
    "food",
    "market",
    "tv",
    "gym",
    "shutter",
    "maintenance",
    "animal",
    "booth",
  ];
  for (const slug of cards) await extractCards(`${slug}.png`, slug);
  await extractLogos();
  await extractMedia();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
