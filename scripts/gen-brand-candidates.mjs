#!/usr/bin/env node
/**
 * Generate logo candidates via fal.ai. Never prints FAL_KEY.
 * Writes assets/candidates/ (gitignored). Pick one, then compose OG in PIL.
 *
 *   node scripts/gen-brand-candidates.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets", "candidates");

function loadFalKey() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) throw new Error(".env missing (copy .env.example)");
  const hit = readFileSync(envPath, "utf8").match(/^FAL_KEY=(.+)$/m);
  const key = (process.env.FAL_KEY || hit?.[1] || "").trim();
  if (!key || key.includes("keyid:keysecret")) throw new Error("FAL_KEY unset");
  return key;
}

async function subscribe(model, payload, key) {
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${model} HTTP ${res.status}: ${text.slice(0, 280)}`);
  }
  const json = JSON.parse(text);
  const url = json.images?.[0]?.url || json.image?.url;
  if (!url) throw new Error(`${model}: no image url in response`);
  return url;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const COLORS = [
  { r: 17, g: 17, b: 17 },
  { r: 244, g: 244, b: 242 },
  { r: 59, g: 130, b: 246 },
];

const JOBS = [
  {
    file: "recraft-vector-spine.png",
    model: "fal-ai/recraft-v3",
    payload: {
      prompt:
        "Flat vector app mark, perfect square, edge-to-edge #111111 field. Thin bone-white square frame inset from the edge. Center: one thick vertical bone-white bar (book spine). Near the top of that bar, one short cobalt-blue horizontal tick crossing it to the right, like a first checklist line. Only those three shapes. No rounded app icon, no squircle, no badge, no checkmark, no number, no grid, no letters, no glow, no shadow, no texture. Swiss graphic design, hard edges, matte ink.",
      style: "vector_illustration/sharp_contrast",
      image_size: { width: 1024, height: 1024 },
      colors: COLORS,
      enable_safety_checker: true,
    },
  },
  {
    file: "recraft-editorial-spine.png",
    model: "fal-ai/recraft-v3",
    payload: {
      prompt:
        "Editorial vector emblem, square. Solid charcoal plate. White inner frame. One vertical white rectangle. One short blue bar crossing it high on the right. Bauhaus. No type. No mascot. No 3D. No UI chrome.",
      style: "vector_illustration/editorial",
      image_size: { width: 1024, height: 1024 },
      colors: COLORS,
      enable_safety_checker: true,
    },
  },
  {
    file: "recraft-cutout-spine.png",
    model: "fal-ai/recraft-v3",
    payload: {
      prompt:
        "Cutout print mark. Square charcoal card. Bone-white frame. Thick vertical bone bar. Short cobalt tick to the right near the top. Paper cut, hard silhouette, no letters.",
      style: "vector_illustration/cutout",
      image_size: { width: 1024, height: 1024 },
      colors: COLORS,
      enable_safety_checker: true,
    },
  },
];

const key = loadFalKey();
mkdirSync(outDir, { recursive: true });

for (const job of JOBS) {
  const dest = join(outDir, job.file);
  process.stdout.write(`${job.file}… `);
  try {
    const url = await subscribe(job.model, job.payload, key);
    await download(url, dest);
    console.log("ok");
  } catch (err) {
    console.log("fail");
    console.error(String(err.message || err));
  }
}
