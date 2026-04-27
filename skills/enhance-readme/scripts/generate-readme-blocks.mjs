#!/usr/bin/env node
// Generate hero <picture> + Tour grid markdown from docs/screenshots/
//
// Usage:
//   node generate-readme-blocks.mjs [--dir=docs/screenshots] [--demo-url=https://example.com] [--hero=<basename-without-ext>]
//
// Output:
//   - Prints two ready-to-paste blocks: HERO and TOUR
//   - Prints size/limit warnings to stderr (10 MB hard limit per file on GitHub)
//   - Lists unpaired dark/light screenshots so you can fix them

import { readdirSync, statSync } from "node:fs";
import { join, parse, relative, sep, posix } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.length ? rest.join("=") : true];
  }),
);

const SCREENSHOT_DIR = args.dir || "docs/screenshots";
const DEMO_URL = args["demo-url"] || "https://your-live-demo.example.com/";
const FORCED_HERO = args.hero || null;
const HARD_LIMIT_MB = 10;
const SOFT_LIMIT_MB = 5;

let files;
try {
  files = readdirSync(SCREENSHOT_DIR)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => {
      const full = join(SCREENSHOT_DIR, f);
      const { size } = statSync(full);
      return { name: f, full, size, base: parse(f).name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
} catch (err) {
  console.error(`error: cannot read ${SCREENSHOT_DIR} — ${err.message}`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`error: no images found in ${SCREENSHOT_DIR}`);
  process.exit(1);
}

const toPosix = (p) => p.split(sep).join(posix.sep);
const human = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;

const oversized = files.filter((f) => f.size > HARD_LIMIT_MB * 1024 * 1024);
const warnSized = files.filter(
  (f) =>
    f.size > SOFT_LIMIT_MB * 1024 * 1024 && f.size <= HARD_LIMIT_MB * 1024 * 1024,
);

if (oversized.length) {
  console.error(`\nERROR: ${oversized.length} file(s) exceed GitHub's 10 MB hard limit:`);
  for (const f of oversized) console.error(`  ${f.name} — ${human(f.size)}`);
}
if (warnSized.length) {
  console.error(`\nWARN: ${warnSized.length} file(s) exceed ${SOFT_LIMIT_MB} MB (consider compressing):`);
  for (const f of warnSized) console.error(`  ${f.name} — ${human(f.size)}`);
}

const pairs = new Map();
const orphans = [];
for (const f of files) {
  const m = f.base.match(/^(.+)-(dark|light)$/i);
  if (!m) {
    orphans.push(f);
    continue;
  }
  const [, key, mode] = m;
  if (!pairs.has(key)) pairs.set(key, {});
  pairs.get(key)[mode.toLowerCase()] = f;
}

const completePairs = [...pairs.entries()].filter(
  ([, v]) => v.dark && v.light,
);
const halfPairs = [...pairs.entries()].filter(([, v]) => !v.dark || !v.light);

if (halfPairs.length) {
  console.error(`\nWARN: ${halfPairs.length} screenshot(s) missing dark/light pair:`);
  for (const [k, v] of halfPairs) {
    const have = v.dark ? "dark" : "light";
    const need = v.dark ? "light" : "dark";
    console.error(`  ${k}: have ${have}.png, missing ${k}-${need}.png`);
  }
}

const heroPriority = ["hero", "dashboard", "home", "landing", "overview", "main"];
const pickHero = () => {
  if (FORCED_HERO) {
    const found = pairs.get(FORCED_HERO);
    if (!found?.dark) {
      console.error(`error: --hero=${FORCED_HERO} not found as a dark/light pair`);
      process.exit(1);
    }
    return [FORCED_HERO, found];
  }
  for (const keyword of heroPriority) {
    const match = completePairs.find(([k]) => k.toLowerCase().includes(keyword));
    if (match) return match;
  }
  return completePairs[0] || null;
};

const hero = pickHero();

// Tour cells: any *-dark.png (paired or orphan) except the hero's dark.
// Then append the hero's light variant as a "Light mode" showcase cell.
const tourCells = [];
for (const f of files) {
  const m = f.base.match(/^(.+)-dark$/i);
  if (!m) continue;
  const key = m[1];
  if (hero && key === hero[0]) continue;
  tourCells.push({ key, image: f, captionKey: key });
}
if (hero) {
  tourCells.push({
    key: `${hero[0]}-light`,
    image: hero[1].light,
    captionKey: "light-mode",
    isLightShowcase: true,
  });
}

const heroBlock = hero
  ? `<div align="center">

<a href="${DEMO_URL}" title="Open the live demo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${toPosix(hero[1].dark.full)}">
    <source media="(prefers-color-scheme: light)" srcset="${toPosix(hero[1].light.full)}">
    <img alt="${hero[0].replace(/-/g, " ")} — hero screenshot" src="${toPosix(hero[1].dark.full)}" width="100%">
  </picture>
</a>

<sub>↑ click to open the live demo · the image swaps with your system theme</sub>

</div>`
  : `(no dark/light hero pair found — add a *-dark.png + *-light.png to ${SCREENSHOT_DIR}/)`;

const titleCase = (s) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const captionFor = (cell) =>
  cell.isLightShowcase
    ? `<b>Light mode</b> · how the app looks in daytime`
    : `<b>${titleCase(cell.captionKey)}</b> · TODO short caption`;

const renderedCells = tourCells.map((cell) => {
  return `    <td width="50%" align="center">
      <a href="${DEMO_URL}">
        <img alt="${titleCase(cell.captionKey)} screenshot" src="${toPosix(cell.image.full)}" width="100%">
      </a>
      <br>
      <sub>${captionFor(cell)}</sub>
    </td>`;
});

let tourBlock = "";
if (renderedCells.length === 0) {
  tourBlock = `(no additional screenshots beyond the hero — add more *-dark.png to ${SCREENSHOT_DIR}/ to populate the tour grid)`;
} else {
  const rows = [];
  for (let i = 0; i < renderedCells.length; i += 2) {
    const row = renderedCells.slice(i, i + 2).join("\n");
    rows.push(`  <tr>\n${row}\n  </tr>`);
  }
  tourBlock = `## Tour\n\nA quick look at the rooms inside. Click any panel to land on it in the live demo.\n\n<table>\n${rows.join("\n")}\n</table>`;
}

console.log("=== HERO BLOCK (paste under the badges in README.md) ===\n");
console.log(heroBlock);
console.log("\n=== TOUR BLOCK (paste below the hero, above ## Demo) ===\n");
console.log(tourBlock);

console.log("\n=== SUMMARY ===");
console.log(`screenshots:    ${files.length}`);
console.log(`complete pairs: ${completePairs.length}`);
console.log(`hero:           ${hero ? hero[0] : "(none)"}`);
console.log(`tour cells:     ${tourCells.length}`);
console.log(
  `total size:     ${human(files.reduce((sum, f) => sum + f.size, 0))}`,
);
if (orphans.length) {
  console.log(
    `orphans (no -dark/-light suffix, ignored): ${orphans.map((o) => o.name).join(", ")}`,
  );
}

if (oversized.length) process.exit(2);
