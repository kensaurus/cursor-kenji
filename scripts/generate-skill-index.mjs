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
 * Always emits:
 *   1. A category counts table (visible without clicking)
 *   2. Full per-family skill lists under ### headings (always visible — no collapsed details)
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
  audit: "🔍 Audit — inspect; some then fix",
  plan: "📋 Plan — audit first, change only after you approve",
  enhance: "🎨 Enhance — improve what already exists",
  design: "✨ Design — build something new",
  backend: "🧱 Backend — server & data patterns",
  mobile: "📱 Mobile — React Native / Capacitor",
  data: "📊 Data — charts & pipelines",
  docs: "📚 Docs — write it down clearly",
  housekeep: "🧹 Housekeeping — clean up design drift",
  workflow: "🔗 Workflows — multi-step recipes",
  test: "✅ Test & QA — prove it works",
  deploy: "🚀 Deploy — ship & verify",
  debug: "🐛 Debug — find & fix what's broken",
  mushi: "🦟 Mushi Mushi — bug triage helpers",
  protocol: "🛡️ Protocols — session guardrails",
  meta: "✍️ Authoring — build skills & MCP",
  thirdparty: "🤝 Third-party (upstream-maintained)",
  _other: "🧩 Core & cross-cutting",
  cursor: "🖱️ Cursor IDE skills",
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
  if (s.length > 140) {
    s = s.slice(0, 140).replace(/\s+\S*$/, "") + "…";
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

function renderGroup(title, items) {
  const lines = items.map((s) => `| \`${s.name}\` | ${s.summary} |`);
  return [
    `### ${title} (${items.length})`,
    "",
    "| Skill | What it does |",
    "|:------|:-------------|",
    ...lines,
  ].join("\n");
}

function build() {
  const skills = collect(join(repoRoot, "skills"));
  const cursorSkills = collect(join(repoRoot, "skills-cursor"));

  const buckets = new Map(FAMILY_ORDER.map((f) => [f, []]));
  for (const s of skills) buckets.get(familyOf(s.name)).push(s);

  const familyRows = [];
  for (const fam of FAMILY_ORDER) {
    const items = buckets.get(fam);
    if (!items.length) continue;
    familyRows.push({ fam, title: FAMILY_HEADINGS[fam], count: items.length, items });
  }
  if (cursorSkills.length) {
    familyRows.push({
      fam: "cursor",
      title: FAMILY_HEADINGS.cursor,
      count: cursorSkills.length,
      items: cursorSkills,
    });
  }

  const total = familyRows.reduce((n, r) => n + r.count, 0);

  const parts = [];
  parts.push(START);
  parts.push("");
  parts.push(
    `_Auto-generated from each skill's \`SKILL.md\` — run \`npm run gen:skill-index\` after adding a skill. **${total} skills** listed below._`,
  );
  parts.push("");
  parts.push("#### Skill families at a glance");
  parts.push("");
  parts.push("| Family | Count | In one sentence |");
  parts.push("|:-------|------:|:----------------|");
  const blurbs = {
    audit: "Check the codebase — security, UX, analytics, IAP, the skill pack…",
    plan: "Write a fix plan you approve before any code changes",
    enhance: "Polish UI, forms, motion, SEO, PWA, email deliverability",
    design: "Create new UI, APIs, emails, themes from scratch",
    backend: "Auth, caching, queues, realtime, observability",
    mobile: "RN screens, emulators, Capacitor, App Store prep",
    data: "Charts, dashboards, ETL / cron jobs",
    docs: "READMEs, PRDs, RFCs with a reader-first voice",
    housekeep: "Merge a drifted design system into one source of truth",
    workflow: "End-to-end recipes (build, fix, ship, green the repo)",
    test: "Unit, Playwright, visual regression, load, red-team",
    deploy: "npm release + post-deploy smoke tests",
    debug: "Errors, Sentry, frontend↔backend mismatches",
    mushi: "Integrate the Mushi Mushi bug-report pipeline",
    protocol: "Keep browser automation from freezing",
    meta: "Author new skills or MCP servers",
    thirdparty: "Vendored upstream skills (Emil, UI/UX Pro Max, Vercel WIG)",
    _other: "Close everything, burndown, post-launch loops",
    cursor: "Canvas, hooks, rules, PR splitter, CLI helpers",
  };
  for (const row of familyRows) {
    parts.push(`| ${row.title} | **${row.count}** | ${blurbs[row.fam] || ""} |`);
  }
  parts.push(`| **Total** | **${total}** | |`);
  parts.push("");
  parts.push("#### Full list (every skill)");
  parts.push("");

  for (const row of familyRows) {
    parts.push(renderGroup(row.title, row.items));
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
  const n = (block.match(/^\| `[a-z0-9-]+` \|/gm) || []).length;
  console.log(`✓ Injected skill index (${n} skills) into README.md.`);
} else {
  console.log(block);
}
