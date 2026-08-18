#!/usr/bin/env node
/**
 * FILE: check-skill-refs.mjs
 * PURPOSE: Fail CI on doubled-prefix skill typos (`mobile-mobile-*`) and the
 * stale `audit-responsive-layout` alias. Does not attempt a full unknown-name
 * scan (session names like `audit-ux-home` collide with that heuristic).
 *
 * USAGE:
 *   node scripts/check-skill-refs.mjs
 *   node scripts/check-skill-refs.mjs --self-test
 */
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const selfTest = process.argv.includes("--self-test");

const GROUPS = ["skills", "skills-cursor"];
const SCAN_DIRS = ["skills", "skills-cursor", "commands", "agents", "rules", ".cursor/rules"];

/** Documented old names — allowed only inside audit-skill-conflicts. */
const STALE_ALIASES = new Set(["audit-responsive-layout"]);

const TICK_RE = /`([a-z][a-z0-9]+(?:-[a-z0-9]+)+)`/g;

function liveSkillNames() {
  const names = new Set();
  for (const group of GROUPS) {
    const base = join(repoRoot, group);
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base)) {
      if (existsSync(join(base, dir, "SKILL.md"))) names.add(dir);
    }
  }
  return names;
}

/** mobile-mobile-capacitor-platform → mobile-capacitor-platform */
function collapseDoubledPrefix(name) {
  const parts = name.split("-");
  if (parts.length >= 3 && parts[0] === parts[1]) {
    return [parts[0], ...parts.slice(2)].join("-");
  }
  return null;
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      walkFiles(p, out);
    } else if (/\.(md|mdc)$/.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function checkText(rel, text, names) {
  const errors = [];
  const allowStale = rel.includes("audit-skill-conflicts");
  for (const m of text.matchAll(TICK_RE)) {
    const ref = m[1];
    if (names.has(ref)) continue;
    if (STALE_ALIASES.has(ref)) {
      if (!allowStale) errors.push(`${rel}: stale skill alias \`${ref}\` — use audit-responsive`);
      continue;
    }
    const collapsed = collapseDoubledPrefix(ref);
    if (collapsed && names.has(collapsed)) {
      errors.push(`${rel}: doubled prefix \`${ref}\` — did you mean \`${collapsed}\`?`);
    }
  }
  return errors;
}

function main() {
  if (selfTest) {
    const collapsed = collapseDoubledPrefix("mobile-mobile-capacitor-platform");
    const collapsed2 = collapseDoubledPrefix("mobile-capacitor-platform");
    const fail = [];
    if (collapsed !== "mobile-capacitor-platform") {
      fail.push(`collapseDoubledPrefix: got ${collapsed}`);
    }
    if (collapsed2 !== null) fail.push("collapseDoubledPrefix should be null without a double");
    const names = new Set(["mobile-capacitor-platform", "audit-responsive"]);
    const hits = checkText(
      "skills/workflow-spec-tdd/SKILL.md",
      "see `mobile-mobile-capacitor-platform` and `audit-responsive`",
      names,
    );
    if (!hits.some((h) => h.includes("mobile-mobile-capacitor-platform"))) {
      fail.push("self-test missed doubled prefix");
    }
    if (hits.some((h) => h.includes("`audit-responsive`"))) {
      fail.push("self-test false-positive on live skill");
    }
    if (fail.length) {
      for (const f of fail) console.error(`✗ ${f}`);
      process.exit(1);
    }
    console.log("✓ check-skill-refs self-test passed");
    return;
  }

  const names = liveSkillNames();
  const errors = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walkFiles(join(repoRoot, dir))) {
      const rel = relative(repoRoot, file).replaceAll("\\", "/");
      const text = readFileSync(file, "utf8");
      errors.push(...checkText(rel, text, names));
    }
  }
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    console.error(`\n✗ ${errors.length} dangling skill-ref(s).`);
    process.exit(1);
  }
  console.log("✓ Skill cross-refs resolve (no doubled prefixes or stale responsive aliases).");
}

main();
