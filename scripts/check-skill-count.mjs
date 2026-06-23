#!/usr/bin/env node
/**
 * Single source of truth for the skill count across README, CATALOG, PROMOTION,
 * and package.json. Plan-* count tokens in README are also derived.
 *
 * Derived from filesystem: `skills/<name>/SKILL.md` directories.
 *
 *   node scripts/check-skill-count.mjs        # verify; exit 1 on mismatch
 *   node scripts/check-skill-count.mjs --fix  # rewrite tokens to the true count
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(repoRoot, "skills");
const readmePath = join(repoRoot, "README.md");
const catalogPath = join(repoRoot, "docs", "CATALOG.md");
const promotionPath = join(repoRoot, "docs", "PROMOTION.md");
const packagePath = join(repoRoot, "package.json");
const fix = process.argv.includes("--fix");

const count = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md")))
  .length;

const planCount = readdirSync(skillsDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      d.name.startsWith("plan-") &&
      existsSync(join(skillsDir, d.name, "SKILL.md")),
  ).length;

/** @param {string} src */
function applyReadmeRules(src) {
  const rules = [
    { name: "badge anchor", re: /#skills-\d+/g, to: `#skills-${count}` },
    { name: "badge label", re: /-\d+_Skills-/g, to: `-${count}_Skills-` },
    { name: "badge alt", re: /alt="\d+ Skills"/g, to: `alt="${count} Skills"` },
    { name: "pie slice", re: /"Skills \(\d+\)" : \d+/g, to: `"Skills (${count})" : ${count}` },
    { name: "graph node", re: /SK\["Skills \(\d+\)"\]/g, to: `SK["Skills (${count})"]` },
    { name: "install step", re: /Install \d+ skills/g, to: `Install ${count} skills` },
    { name: "installs all", re: /Installs all \d+ skills/g, to: `Installs all ${count} skills` },
    { name: "section heading", re: /^## Skills \(\d+\)/gm, to: `## Skills (${count})` },
    { name: "mindmap root", re: /root\(\(\d+ Skills\)\)/g, to: `root((${count} Skills))` },
    {
      name: "hero tagline",
      re: /\d+ agent skills ·/g,
      to: `${count} agent skills ·`,
    },
    {
      name: "intro ships",
      re: /ships \*\*\d+ Cursor agent skills\*\*/g,
      to: `ships **${count} Cursor agent skills**`,
    },
    {
      name: "intro toolkit",
      re: /toolkit of \d+ Cursor agent skills/g,
      to: `toolkit of ${count} Cursor agent skills`,
    },
    {
      name: "intro picks",
      re: /agent now has \d+ skills it picks/g,
      to: `agent now has ${count} skills it picks`,
    },
    {
      name: "whats inside table",
      re: /\| \*\*Skills\*\* \| \d+ \|/g,
      to: `| **Skills** | ${count} |`,
    },
    {
      name: "tree comment",
      re: /# \d+ Agent Skills/g,
      to: `# ${count} Agent Skills`,
    },
    {
      name: "plan skill count",
      re: /The \d+ `plan-\*` skills/g,
      to: `The ${planCount} \`plan-*\` skills`,
    },
    {
      name: "plan skill count bold",
      re: /\*\*\d+ `plan-\*` skills\*\*/g,
      to: `**${planCount} \`plan-*\` skills**`,
    },
    {
      name: "plan prefix taxonomy",
      re: /burndowns \(\d+ skills\)/g,
      to: `burndowns (${planCount} skills)`,
    },
  ];

  const mismatches = [];
  for (const { name, re, to } of rules) {
    for (const hit of src.match(re) || []) {
      if (hit !== to) mismatches.push({ file: "README.md", name, hit, to });
    }
    src = src.replace(re, to);
  }
  return { src, mismatches };
}

/** @param {string} path @param {string} label @param {Array<{name: string, re: RegExp, to: string}>} rules */
function applyFileRules(path, label, rules) {
  if (!existsSync(path)) return { src: "", mismatches: [] };
  let src = readFileSync(path, "utf8");
  const mismatches = [];
  for (const { name, re, to } of rules) {
    for (const hit of src.match(re) || []) {
      if (hit !== to) mismatches.push({ file: label, name, hit, to });
    }
    src = src.replace(re, to);
  }
  return { src, mismatches };
}

const readmeResult = applyReadmeRules(readFileSync(readmePath, "utf8"));

const catalogResult = applyFileRules(catalogPath, "docs/CATALOG.md", [
  { name: "catalog heading", re: /^## Skills \(\d+\)/m, to: `## Skills (${count})` },
]);

const promotionResult = applyFileRules(promotionPath, "docs/PROMOTION.md", [
  {
    name: "promotion issue body",
    re: /\d+ Cursor agent skills for React/g,
    to: `${count} Cursor agent skills for React`,
  },
  {
    name: "promotion pr copy",
    re: /\d+ production-ready agent skills/g,
    to: `${count} production-ready agent skills`,
  },
]);

let packageResult = { src: "", mismatches: [] };
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  const nextDesc = `${count} Cursor AI agent skills, 13 slash commands, 5 subagents, and MCP configs for React/Next.js/Supabase development.`;
  if (pkg.description !== nextDesc) {
    packageResult.mismatches.push({
      file: "package.json",
      name: "description",
      hit: pkg.description,
      to: nextDesc,
    });
    pkg.description = nextDesc;
    packageResult.src = JSON.stringify(pkg, null, 2) + "\n";
  }
}

const allMismatches = [
  ...readmeResult.mismatches,
  ...catalogResult.mismatches,
  ...promotionResult.mismatches,
  ...packageResult.mismatches,
];

if (fix) {
  writeFileSync(readmePath, readmeResult.src);
  if (catalogResult.src) writeFileSync(catalogPath, catalogResult.src);
  if (promotionResult.src) writeFileSync(promotionPath, promotionResult.src);
  if (packageResult.src) writeFileSync(packagePath, packageResult.src);
  console.log(`✓ Normalized to ${count} skills (${planCount} plan-*).`);
  process.exit(0);
}

if (allMismatches.length) {
  console.error(`✗ Skill count out of sync. True count: ${count} (${planCount} plan-*).`);
  for (const m of allMismatches) {
    console.error(`  [${m.file} · ${m.name}] "${m.hit}" -> "${m.to}"`);
  }
  console.error(`\nRun: node scripts/check-skill-count.mjs --fix`);
  process.exit(1);
}

console.log(`✓ Skill count matches filesystem (${count} skills, ${planCount} plan-*).`);
