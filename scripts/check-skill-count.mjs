#!/usr/bin/env node
/**
 * Single source of truth for the skill count in README.md.
 *
 * The count is DERIVED from the filesystem: the number of `skills/<name>/SKILL.md`
 * files. README badges/headings/diagrams must match it. This script exists because
 * the count has drifted by hand-editing more than once (62 / 64 / 68 all coexisting).
 *
 *   node scripts/check-skill-count.mjs        # verify; exit 1 on mismatch
 *   node scripts/check-skill-count.mjs --fix  # rewrite README to the true count
 *
 * It ONLY touches the total-skills tokens, never the category counts
 * ("Cursor Skills (12)", "MCP Servers (16)", "Commands (13)", "Subagents (5)", ...).
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(repoRoot, "skills");
const readmePath = join(repoRoot, "README.md");
const fix = process.argv.includes("--fix");

const count = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md")))
  .length;

// Each rule rewrites the captured number to `count`. Regexes are anchored so they
// match ONLY the total-skills tokens, not category counts that contain "Skills".
const rules = [
  { name: "badge anchor", re: /#skills-\d+/g, to: `#skills-${count}` },
  { name: "badge label", re: /-\d+_Skills-/g, to: `-${count}_Skills-` },
  { name: "badge alt", re: /alt="\d+ Skills"/g, to: `alt="${count} Skills"` },
  { name: "pie slice", re: /"Skills \(\d+\)" : \d+/g, to: `"Skills (${count})" : ${count}` },
  { name: "graph node", re: /SK\["Skills \(\d+\)"\]/g, to: `SK["Skills (${count})"]` },
  { name: "install step", re: /Install \d+ skills/g, to: `Install ${count} skills` },
  { name: "section heading", re: /^## Skills \(\d+\)/gm, to: `## Skills (${count})` },
  { name: "mindmap root", re: /root\(\(\d+ Skills\)\)/g, to: `root((${count} Skills))` },
];

let src = readFileSync(readmePath, "utf8");
const mismatches = [];
for (const { name, re, to } of rules) {
  for (const hit of src.match(re) || []) {
    if (hit !== to) mismatches.push({ name, hit, to });
  }
  src = src.replace(re, to);
}

if (fix) {
  writeFileSync(readmePath, src);
  console.log(`✓ README normalized to ${count} skills.`);
  process.exit(0);
}

if (mismatches.length) {
  console.error(`✗ README skill count is out of sync. True count: ${count}.`);
  for (const m of mismatches) console.error(`  [${m.name}] "${m.hit}" -> "${m.to}"`);
  console.error(`\nRun: node scripts/check-skill-count.mjs --fix`);
  process.exit(1);
}
console.log(`✓ README skill count matches filesystem (${count}).`);
