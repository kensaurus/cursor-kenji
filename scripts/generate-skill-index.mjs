#!/usr/bin/env node
/**
 * Generate a categorized, one-line-per-skill index and inject it into README.md
 * between the <!-- SKILL-INDEX:START --> / <!-- SKILL-INDEX:END --> markers.
 *
 * Source of truth: the `name` + `description` frontmatter of every
 * skills/<name>/SKILL.md and skills-cursor/<name>/SKILL.md. The one-liner is the
 * summary sentence of each description (the part before the "Use when…" triggers),
 * so this never drifts from the installed skills.
 *
 *   node scripts/generate-skill-index.mjs           # print to stdout (preview)
 *   node scripts/generate-skill-index.mjs --write   # inject into README.md
 *   node scripts/generate-skill-index.mjs --check    # exit 1 if README block is stale
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(repoRoot, "README.md");
const START = "<!-- SKILL-INDEX:START -->";
const END = "<!-- SKILL-INDEX:END -->";

/** Family prefix → display heading. Anything unmatched falls into "Core & cross-cutting". */
const FAMILY_HEADINGS = {
  audit: "🔍 Audit — read-only assessments",
  plan: "📋 Plan — audit + approve before executing",
  enhance: "🎨 Enhance — improve what already exists",
  design: "✨ Design — build new surfaces",
  backend: "🧱 Backend — server & data-layer patterns",
  mobile: "📱 Mobile — React Native / Capacitor",
  data: "📊 Data — visualization & pipelines",
  docs: "📚 Docs — documentation",
  housekeep: "🧹 Housekeeping — consolidate drift",
  workflow: "🔗 Workflows — multi-step bundles",
  test: "✅ Test & QA",
  deploy: "🚀 Deploy — release & verify",
  debug: "🐛 Debug & operate",
  mushi: "🦟 Mushi Mushi integration",
  protocol: "🛡️ Protocols — session guardrails",
  meta: "✍️ Authoring — build skills & MCP",
  thirdparty: "🤝 Third-party (vendored, upstream-maintained)",
  _other: "🧩 Core & cross-cutting",
};
const FAMILY_ORDER = [
  "audit", "plan", "enhance", "design", "backend", "mobile", "data", "docs",
  "housekeep", "workflow", "test", "deploy", "debug", "mushi", "protocol",
  "meta", "thirdparty", "_other",
];

/** Extract frontmatter name + a clean one-line summary from a SKILL.md file. */
function parseSkill(dir, name) {
  const raw = readFileSync(join(dir, name, "SKILL.md"), "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const block = fm[1];
  const lines = block.split("\n");

  const descLine = lines.findIndex((l) => /^description:/.test(l));
  if (descLine === -1) return { name, summary: "" };

  let description = lines[descLine].replace(/^description:[ \t]*/, "").trim();
  // Folded / literal block scalar (`>`, `>-`, `|`, `|-`) — gather indented lines.
  if (/^[>|][+-]?$/.test(description) || description === "") {
    const out = [];
    for (let i = descLine + 1; i < lines.length; i++) {
      if (/^[A-Za-z_][\w-]*:/.test(lines[i])) break; // next top-level key
      out.push(lines[i].trim());
    }
    description = out.join(" ");
  }
  description = description.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();

  return { name, summary: summarize(description) };
}

/** First sentence / clause of the description, before the trigger list; capped. */
function summarize(desc) {
  if (!desc) return "";
  let s = desc;
  // Cut at the trigger boilerplate that follows the summary.
  const cut = s.search(/\s(?:Use when|Use for|Use this|Use to|Use PROACTIVELY|Triggers?:|Auto-detects|Detects the user)/i);
  if (cut > 0) s = s.slice(0, cut);
  // Prefer the first sentence if it ends early.
  const period = s.indexOf(". ");
  if (period > 40) s = s.slice(0, period);
  s = s.replace(/[.\s—-]+$/, "").trim();
  if (s.length > 155) {
    s = s.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  }
  return s;
}

function collect(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "SKILL.md")))
    .map((d) => parseSkill(dir, d.name))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function familyOf(name) {
  const prefix = name.split("-")[0];
  return FAMILY_ORDER.includes(prefix) ? prefix : "_other";
}

function renderGroup(title, items, open = false) {
  const lines = items.map((s) => `- \`${s.name}\` — ${s.summary}`);
  return `<details${open ? " open" : ""}>\n<summary><strong>${title}</strong> (${items.length})</summary>\n\n${lines.join("\n")}\n\n</details>`;
}

function build() {
  const skills = collect(join(repoRoot, "skills"));
  const cursorSkills = collect(join(repoRoot, "skills-cursor"));

  const buckets = new Map(FAMILY_ORDER.map((f) => [f, []]));
  for (const s of skills) buckets.get(familyOf(s.name)).push(s);

  const parts = [];
  parts.push(START);
  parts.push("");
  parts.push(`_Auto-generated from each skill's \`SKILL.md\` — run \`npm run gen:skill-index\` after adding a skill. Click any group to expand._`);
  parts.push("");
  for (const fam of FAMILY_ORDER) {
    const items = buckets.get(fam);
    if (!items.length) continue;
    parts.push(renderGroup(FAMILY_HEADINGS[fam], items));
    parts.push("");
  }
  if (cursorSkills.length) {
    parts.push(renderGroup("🖱️ Cursor IDE skills", cursorSkills));
    parts.push("");
  }
  parts.push(END);
  return parts.join("\n");
}

const block = build();

if (process.argv.includes("--write") || process.argv.includes("--check")) {
  const readme = readFileSync(readmePath, "utf8");
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (!re.test(readme)) {
    console.error(`✗ Markers ${START} … ${END} not found in README.md. Add them where the skill index should live.`);
    process.exit(1);
  }
  const next = readme.replace(re, block);
  if (process.argv.includes("--check")) {
    if (next !== readme) {
      console.error("✗ README skill index is stale. Run: npm run gen:skill-index");
      process.exit(1);
    }
    console.log("✓ README skill index is in sync.");
    process.exit(0);
  }
  writeFileSync(readmePath, next);
  const n = (block.match(/^- `/gm) || []).length;
  console.log(`✓ Injected skill index (${n} skills) into README.md.`);
} else {
  console.log(block);
}
