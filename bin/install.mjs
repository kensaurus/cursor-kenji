#!/usr/bin/env node
/**
 * cursor-kenji installer
 *
 * Usage:
 *   npx @kensaurus/cursor-kenji                  Merge-install into ~/.cursor/ AND ~/.agents/skills/
 *   npx @kensaurus/cursor-kenji --auto           Detect installed tools and install to each
 *   npx @kensaurus/cursor-kenji --claude         Install for Claude Code (~/.claude/) instead
 *   npx @kensaurus/cursor-kenji --codex          Install for Codex CLI (~/.codex/AGENTS.md + prompts)
 *   npx @kensaurus/cursor-kenji --gemini         Install for Gemini CLI (~/.gemini/GEMINI.md + commands)
 *   npx @kensaurus/cursor-kenji --all            Install for all four supported tools
 *   npx @kensaurus/cursor-kenji --clean          Mirror: make target paths match this repo exactly
 *   npx @kensaurus/cursor-kenji --only skills     Install only some groups (csv)
 *   npx @kensaurus/cursor-kenji --skill audit-ux  Install a single skill
 *   npx @kensaurus/cursor-kenji --link           Dev mode: symlink instead of copy
 *   npx @kensaurus/cursor-kenji --restore [stamp] Restore a previous --clean backup
 *   npx @kensaurus/cursor-kenji --dry-run        Preview without changing anything
 *   npx @kensaurus/cursor-kenji --help
 *
 * Why two Cursor paths?
 *   ~/.cursor/skills/   — read by the Cursor agent at runtime
 *   ~/.agents/skills/   — indexed by the Cursor Skills UI panel
 *   Both must be populated for skills to appear AND work.
 *
 * Claude Code paths:
 *   ~/.claude/skills/    — global skills, appear as /slash-commands
 *   ~/.claude/commands/  — custom slash commands
 *   ~/.claude/agents/    — subagent definitions
 *   ~/.claude/rules/     — rules (.mdc sources installed as .md)
 */

import {
  existsSync, mkdirSync, cpSync, rmSync, symlinkSync, readdirSync, statSync,
  readFileSync, writeFileSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { homedir, platform } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dir = fileURLToPath(new URL('..', import.meta.url));
const argv = process.argv.slice(2);

// ---- tiny arg parser (supports `--flag`, `--key value`, `--key=value`) ----
const flags = new Set();
const opts = {};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) continue;
  const [k, inlineVal] = a.slice(2).split('=');
  if (inlineVal !== undefined) { opts[k] = inlineVal; continue; }
  const next = argv[i + 1];
  if (next && !next.startsWith('--')) { opts[k] = next; i++; } else { flags.add(k); }
}
const has = (...names) => names.some((n) => flags.has(n) || n in opts);

if (has('help', 'h')) {
  console.log(`
cursor-kenji installer

Usage:
  npx @kensaurus/cursor-kenji                   Merge-install into ~/.cursor/ + ~/.agents/skills/
  npx @kensaurus/cursor-kenji --auto            Detect installed tools and install to each
  npx @kensaurus/cursor-kenji --claude          Install for Claude Code (~/.claude/) instead
  npx @kensaurus/cursor-kenji --codex           Install for Codex CLI (~/.codex/AGENTS.md)
  npx @kensaurus/cursor-kenji --gemini          Install for Gemini CLI (~/.gemini/GEMINI.md)
  npx @kensaurus/cursor-kenji --all             Install for all four supported tools
  npx @kensaurus/cursor-kenji --clean           Mirror: wipe and rebuild target paths from this repo
  npx @kensaurus/cursor-kenji --only skills      Install only some groups (skills,commands,agents,rules)
  npx @kensaurus/cursor-kenji --skill <name>     Install one skill by name
  npx @kensaurus/cursor-kenji --link            Dev mode: symlink repo into ~/.cursor (live edits)
  npx @kensaurus/cursor-kenji --restore [stamp]  Restore a previous --clean backup (latest if omitted)
  npx @kensaurus/cursor-kenji --dry-run         Preview without changing anything

Flags:
  --auto              Detect installed tools (~/.cursor, ~/.claude, ~/.codex, ~/.gemini) and
                      install to each; falls back to Cursor if none are found.
  --cursor            Target Cursor explicitly (same as the bare default).
  --claude            Target Claude Code (~/.claude/) instead of Cursor.
  --codex             Target Codex CLI — merged rules → ~/.codex/AGENTS.md + prompt ports.
  --gemini            Target Gemini CLI — merged rules → ~/.gemini/GEMINI.md + command ports.
  --all               Target all four supported tools in one run.
  --clean, --mirror   Wipe managed dirs first so target paths exactly mirror this repo.
  --no-backup         Skip the timestamped backup taken before a --clean wipe.
  --only <csv>        Limit to a subset of: skills, commands, agents, rules.
  --skill <name>      Install a single skill (implies --only skills).
  --link              Symlink (junction on Windows) instead of copying — for repo dev.
  --restore [stamp]   Copy a backup under <target>/.cursor-kenji-backups/ back into place.
  --dry-run           Show what would happen; make no changes.

What gets installed (Cursor):
  ~/.cursor/skills/       ← agent skills at runtime (skills/ + skills-cursor/ merged)
  ~/.agents/skills/       ← Cursor Skills UI index (same content, required for UI visibility)
  ~/.cursor/commands/     ← slash commands
  ~/.cursor/agents/       ← subagent definitions
  ~/.cursor/rules/        ← project rules starter pack
  ~/.cursor/mcp.json      ← MCP server template (only if missing; never overwritten)

What gets installed (Claude Code, with --claude or --all):
  ~/.claude/skills/       ← global skills (appear as /slash-commands)
  ~/.claude/commands/     ← custom slash commands
  ~/.claude/agents/       ← subagent definitions
  ~/.claude/rules/        ← rules (.mdc installed as .md)

What gets installed (Codex CLI / Gemini CLI — no skills system):
  ~/.codex/AGENTS.md      ← rules merged into one context file (auto-loaded)
  ~/.codex/prompts/       ← portable commands as custom prompts (plan, research, fix-issue)
  ~/.gemini/GEMINI.md     ← rules merged into one context file (auto-loaded)
  ~/.gemini/commands/     ← portable commands as TOML commands
  These tools have no skills loader, so skills/agents are not written there.
  Existing AGENTS.md/GEMINI.md is backed up (.bak-<stamp>) before an update.
  `.trim());
  process.exit(0);
}

const isDryRun = has('dry-run');
const isClean = has('clean', 'mirror', 'force');
const noBackup = has('no-backup');
const useLink = has('link');

// ---- target resolution -----------------------------------------------------
// Backward compatible: a bare invocation still installs Cursor only.
//   --auto           detect installed tools (~/.cursor, ~/.claude, ~/.codex, ~/.gemini)
//                    and install to each; falls back to Cursor if none are found.
//   --all            force all four supported targets, installed or not.
//   --cursor/--claude/--codex/--gemini   explicit target(s); combine freely.
const codexBase = join(homedir(), '.codex');    // Codex CLI reads ~/.codex/AGENTS.md
const geminiBase = join(homedir(), '.gemini');  // Gemini CLI reads ~/.gemini/GEMINI.md
const cursorBase = join(homedir(), '.cursor');
const agentsBase = join(homedir(), '.agents');   // Cursor Skills UI reads ~/.agents/skills/
const claudeBase = join(homedir(), '.claude');

const explicitTargets = ['cursor', 'claude', 'codex', 'gemini'].filter((t) => has(t));
let targets;
if (has('all')) {
  targets = new Set(['cursor', 'claude', 'codex', 'gemini']);
} else if (has('auto')) {
  targets = detectTools();
  if (targets.size === 0) targets = new Set(['cursor']);
} else if (explicitTargets.length) {
  targets = new Set(explicitTargets);
} else {
  targets = new Set(['cursor']); // backward-compatible default
}
const wantCursor = targets.has('cursor');
const wantClaude = targets.has('claude');
const wantCodex = targets.has('codex');
const wantGemini = targets.has('gemini');

if (has('auto')) {
  console.log(`Auto-detected targets: ${[...targets].join(', ') || '(none — defaulting to Cursor)'}`);
}

const ALL_DIRS = [
  { src: 'skills',        dest: 'skills'   },
  { src: 'skills-cursor', dest: 'skills'   },  // merge cursor-specific skills
  { src: 'commands',      dest: 'commands' },
  { src: 'agents',        dest: 'agents'   },
  { src: 'rules',         dest: 'rules'    },
];

// ---- restore mode ----------------------------------------------------------
if (has('restore')) {
  const restoreBase = wantClaude && !wantCursor ? claudeBase : cursorBase;
  const backupsRoot = join(restoreBase, '.cursor-kenji-backups');
  const stamp = typeof opts.restore === 'string'
    ? opts.restore
    : (existsSync(backupsRoot)
        ? readdirSync(backupsRoot).filter((n) => statSync(join(backupsRoot, n)).isDirectory()).sort().pop()
        : null);
  if (!stamp) { console.error('No backups found under ' + backupsRoot); process.exit(1); }
  const snap = join(backupsRoot, stamp);
  if (!existsSync(snap)) { console.error('Backup not found: ' + snap); process.exit(1); }

  let restored = 0;
  for (const dest of readdirSync(snap)) {
    const from = join(snap, dest);
    const to = join(restoreBase, dest);
    if (isDryRun) {
      console.log(`  [dry-run] restore ${from} → ${to}`);
    } else {
      rmSync(to, { recursive: true, force: true });
      cpSync(from, to, { recursive: true });
    }
    restored++;
  }
  console.log(`${isDryRun ? '[dry-run] ' : '✓ '}Restored ${restored} dir(s) from ${snap}`);
  process.exit(0);
}

// ---- selection (--only / --skill) ------------------------------------------
const skillName = typeof opts.skill === 'string' ? opts.skill : null;
let onlyGroups = null;
if (typeof opts.only === 'string') onlyGroups = new Set(opts.only.split(',').map((s) => s.trim()).filter(Boolean));
if (skillName) onlyGroups = new Set(['skills']);

const DIRS = ALL_DIRS.filter((d) => !onlyGroups || onlyGroups.has(d.dest));
const managedDests = [...new Set(DIRS.map((d) => d.dest))];

// ---- placement helper (copy or symlink) ------------------------------------
let linkFallbacks = 0;
function place(src, dest, isDir) {
  if (isDryRun) { console.log(`  [dry-run] ${useLink ? 'link' : 'copy'} ${src} → ${dest}`); return; }
  if (useLink) {
    rmSync(dest, { recursive: true, force: true });
    try {
      const type = isDir ? (platform() === 'win32' ? 'junction' : 'dir') : 'file';
      symlinkSync(src, dest, type);
      return;
    } catch {
      cpSync(src, dest, { recursive: true }); // file symlinks may need privileges on Windows
      linkFallbacks++;
      return;
    }
  }
  cpSync(src, dest, { recursive: true });
}

// ---- mirror mode: back up, then wipe managed dirs under a target base ------
function backupAndWipe(base) {
  let wiped = 0;
  let backupRoot = null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  backupRoot = join(base, '.cursor-kenji-backups', stamp);
  for (const dest of managedDests) {
    const p = join(base, dest);
    if (!existsSync(p)) continue;
    if (isDryRun) {
      console.log(`  [dry-run] backup ${p} → ${join(backupRoot, dest)}`);
      console.log(`  [dry-run] wipe   ${p}`);
    } else {
      if (!noBackup) { mkdirSync(backupRoot, { recursive: true }); cpSync(p, join(backupRoot, dest), { recursive: true }); }
      rmSync(p, { recursive: true, force: true });
    }
    wiped++;
  }
  return { wiped, backupRoot };
}

// ---- copy / link one target base -------------------------------------------
// renameMdc: Claude Code reads .md rules; .mdc sources are installed as .md.
function installDirs(base, { renameMdc = false } = {}) {
  let copiedDirs = 0;
  let copiedFiles = 0;
  for (const { src, dest } of DIRS) {
    const srcPath = resolve(__dir, src);
    const destPath = join(base, dest);
    if (!existsSync(srcPath)) continue;
    if (!isDryRun) mkdirSync(destPath, { recursive: true });

    for (const item of readdirSync(srcPath)) {
      if (skillName && item !== skillName) continue;
      const itemSrc = join(srcPath, item);
      const isDir = statSync(itemSrc).isDirectory();
      let outName = item;
      if (renameMdc && dest === 'rules' && !isDir && item.endsWith('.mdc')) {
        outName = item.slice(0, -4) + '.md';
      }
      place(itemSrc, join(destPath, outName), isDir);
      if (isDir) copiedDirs++; else copiedFiles++;
    }
  }
  return { copiedDirs, copiedFiles };
}

// ============================================================================
// Codex CLI + Gemini CLI — tools with NO skills system.
// They read a single global context/instructions file, so we map:
//   rules/ (minus the skill-routing index) → one merged Markdown file
//   commands-portable/ → per-tool custom prompt/command files
// No SKILL.md dirs are written — nothing in these tools would load them.
// ============================================================================

// Detect installed tools by their home-dir config footprint.
function detectTools() {
  const found = new Set();
  if (existsSync(cursorBase)) found.add('cursor');
  if (existsSync(claudeBase)) found.add('claude');
  if (existsSync(codexBase)) found.add('codex');
  if (existsSync(geminiBase)) found.add('gemini');
  return found;
}

// Rules merged into the global context file. The skill-routing index is
// excluded — it points at skills these tools cannot load (would be dead text).
const RULES_EXCLUDE = new Set(['skill-workflows.mdc']);
const RULES_ORDER = [
  'senior-engineer.md',
  'full-stack-ship-discipline.mdc',
  'composer-2.5-execution.mdc',
  'shell-first-search.md',
];

// Strip a leading `--- ... ---` YAML frontmatter block, returning the body.
function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  const after = text.indexOf('\n', end + 1);
  return text.slice(after + 1).replace(/^\s+/, '');
}

// Parse `description:` out of frontmatter and return { description, body }.
function parseFrontmatter(text) {
  let description = '';
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end !== -1) {
      const m = text.slice(3, end).match(/description:\s*"?(.*?)"?\s*$/m);
      if (m) description = m[1];
    }
  }
  return { description, body: stripFrontmatter(text) };
}

// Concatenate top-level rule files (non-recursive — skips project-starter/ etc.)
// into one deterministic Markdown document. No timestamp → regeneration is
// idempotent, so re-running the installer produces byte-identical output.
function buildMergedRules(toolLabel, loadPath) {
  const rulesDir = resolve(__dir, 'rules');
  const files = readdirSync(rulesDir)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdc'))
      && !RULES_EXCLUDE.has(f)
      && statSync(join(rulesDir, f)).isFile())
    .sort((a, b) => {
      const ia = RULES_ORDER.indexOf(a); const ib = RULES_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
  const header = `<!-- Generated by cursor-kenji — https://github.com/kensaurus/cursor-kenji
     Merged from rules/. The skill-routing index is omitted (this tool has no skills loader).
     Applies to: ${toolLabel} — loaded automatically from ${loadPath}.
     Regenerate: npx @kensaurus/cursor-kenji --auto -->\n\n`;
  const body = files
    .map((f) => stripFrontmatter(readFileSync(join(rulesDir, f), 'utf8')).trim())
    .join('\n\n---\n\n');
  return header + body + '\n';
}

// Load the tool-agnostic portable commands (single source of truth).
function portableCommands() {
  const dir = resolve(__dir, 'commands-portable');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const { description, body } = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
      return { name: f.replace(/\.md$/, ''), description, body: body.trim() };
    });
}

// Wrap a portable command as a Gemini TOML command. Uses a literal ''' string
// so shell backslashes/quotes pass through verbatim; fails loud if the body
// would collide with the delimiter rather than silently corrupting output.
function toGeminiToml({ name, description, body }) {
  if (body.includes("'''")) {
    throw new Error(`portable command '${name}' contains ''' — cannot wrap as a TOML literal string`);
  }
  const desc = String(description).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `description = "${desc}"\n\nprompt = '''\n${body}\n'''\n`;
}

// Write a single managed file. Idempotent (skips identical content), backs up
// on overwrite unless --no-backup, and honours --dry-run.
function writeManagedFile(destPath, content) {
  if (isDryRun) { console.log(`  [dry-run] write ${destPath}`); return 'dry-run'; }
  mkdirSync(dirname(destPath), { recursive: true });
  if (existsSync(destPath)) {
    if (readFileSync(destPath, 'utf8') === content) return 'unchanged';
    if (!noBackup) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      cpSync(destPath, `${destPath}.bak-${stamp}`);
    }
    writeFileSync(destPath, content);
    return 'updated';
  }
  writeFileSync(destPath, content);
  return 'created';
}

// Install a context-file tool (Codex / Gemini). `spec` describes its layout.
function installContextTool(spec) {
  const { label, base, rulesFile, rulesLoadPath, commandsDir, commandExt, render } = spec;
  console.log(`\n${isDryRun ? '[dry-run] ' : ''}${label} → ${base}`);

  // --skill / --only skills has no meaning here (no skills loader).
  const doRules = !onlyGroups || onlyGroups.has('rules');
  const doCommands = (!onlyGroups || onlyGroups.has('commands')) && !skillName;
  if (!doRules && !doCommands) {
    console.log('  (no skills loader — nothing to install for the selected groups)');
    return;
  }

  let rulesStatus = 'skipped';
  if (doRules) {
    rulesStatus = writeManagedFile(join(base, rulesFile), buildMergedRules(label, rulesLoadPath));
  }
  let cmdCount = 0;
  if (doCommands) {
    for (const cmd of portableCommands()) {
      writeManagedFile(join(base, commandsDir, `${cmd.name}${commandExt}`), render(cmd));
      cmdCount++;
    }
  }
  if (!isDryRun) {
    const parts = [];
    if (doRules) parts.push(`${rulesFile} ${rulesStatus}`);
    if (doCommands) parts.push(`${cmdCount} command(s) → ${commandsDir}/`);
    console.log(`  ✓ ${parts.join(', ')}`);
  }
}

const results = [];

// ---- Cursor ----------------------------------------------------------------
if (wantCursor) {
  const clean = isClean ? backupAndWipe(cursorBase) : null;
  const counts = installDirs(cursorBase);

  if (skillName && counts.copiedDirs + counts.copiedFiles === 0) {
    console.error(`✗ Skill '${skillName}' not found in skills/ or skills-cursor/.`);
    process.exit(1);
  }

  // Also write skills to ~/.agents/skills/ (Cursor Skills UI reads here).
  if (!onlyGroups || onlyGroups.has('skills')) {
    const agentsSkillsDest = join(agentsBase, 'skills');
    const cursorSkillsSrc = join(cursorBase, 'skills');
    if (isDryRun) {
      console.log(`  [dry-run] sync ${cursorSkillsSrc} → ${agentsSkillsDest}`);
    } else if (existsSync(cursorSkillsSrc)) {
      if (isClean) rmSync(agentsSkillsDest, { recursive: true, force: true });
      mkdirSync(agentsSkillsDest, { recursive: true });
      for (const item of readdirSync(cursorSkillsSrc)) {
        if (skillName && item !== skillName) continue;
        cpSync(join(cursorSkillsSrc, item), join(agentsSkillsDest, item), { recursive: true });
      }
    }
  }

  // MCP config template (only if missing; never overwritten).
  const mcpDest = join(cursorBase, 'mcp.json');
  const mcpTemplate = resolve(__dir, 'mcp', 'mcp.json.template');
  let mcpInstalled = false;
  if (!onlyGroups && existsSync(mcpTemplate) && !existsSync(mcpDest)) {
    if (isDryRun) console.log(`  [dry-run] ${mcpTemplate} → ${mcpDest}`);
    else { mkdirSync(cursorBase, { recursive: true }); cpSync(mcpTemplate, mcpDest); }
    mcpInstalled = true;
  }

  results.push({ target: 'Cursor', base: cursorBase, ...counts, clean, mcpInstalled });
}

// ---- Claude Code -----------------------------------------------------------
if (wantClaude) {
  const clean = isClean ? backupAndWipe(claudeBase) : null;
  const counts = installDirs(claudeBase, { renameMdc: true });

  if (skillName && counts.copiedDirs + counts.copiedFiles === 0) {
    console.error(`✗ Skill '${skillName}' not found in skills/ or skills-cursor/.`);
    process.exit(1);
  }

  results.push({ target: 'Claude Code', base: claudeBase, ...counts, clean, mcpInstalled: false });
}

// ---- Codex CLI (context file + prompt ports) -------------------------------
if (wantCodex) {
  installContextTool({
    label: 'Codex CLI (OpenAI)',
    base: codexBase,
    rulesFile: 'AGENTS.md',
    rulesLoadPath: '~/.codex/AGENTS.md',
    commandsDir: 'prompts',
    commandExt: '.md',
    render: (cmd) => (cmd.body.endsWith('\n') ? cmd.body : cmd.body + '\n'),
  });
}

// ---- Gemini CLI (context file + TOML command ports) ------------------------
if (wantGemini) {
  installContextTool({
    label: 'Gemini CLI',
    base: geminiBase,
    rulesFile: 'GEMINI.md',
    rulesLoadPath: '~/.gemini/GEMINI.md',
    commandsDir: 'commands',
    commandExt: '.toml',
    render: toGeminiToml,
  });
}

// ---- summary ---------------------------------------------------------------
const mode = `${isClean ? 'mirror' : 'merge'}${useLink ? '+link' : ''}${skillName ? `:skill=${skillName}` : ''}`;
const verb = useLink ? 'linked' : 'copied';

if (isDryRun) {
  for (const r of results) {
    console.log(
      `\n[dry-run] ${r.target} (${mode})` +
      (r.clean ? ` — would back up + wipe ${r.clean.wiped} managed dir(s)` : '') +
      `\n[dry-run] Would ${useLink ? 'link' : 'copy'} ${r.copiedDirs} directories and ${r.copiedFiles} files to ${r.base}` +
      (r.mcpInstalled ? ' (plus mcp.json template)' : '')
    );
  }
  console.log('Run without --dry-run to apply.');
} else {
  for (const r of results) {
    if (r.clean && r.clean.backupRoot && !noBackup && r.clean.wiped > 0) {
      console.log(`✓ Backed up previous ${r.base}/{${managedDests.join(',')}} → ${r.clean.backupRoot}`);
    }
    console.log(`\n✓ cursor-kenji installed for ${r.target} (${mode}) — ${r.copiedDirs} directories and ${r.copiedFiles} files ${verb} to ${r.base}`);
    if (r.target === 'Cursor' && (!onlyGroups || onlyGroups.has('skills'))) {
      const agentsCount = existsSync(join(agentsBase, 'skills')) ? readdirSync(join(agentsBase, 'skills')).length : 0;
      console.log(`✓ Skills synced to ${join(agentsBase, 'skills')} (${agentsCount} skills — Cursor UI path)`);
    }
    if (r.mcpInstalled) console.log(`✓ MCP template written to ${join(r.base, 'mcp.json')} — edit it to add your API keys.`);
  }
  if (linkFallbacks) console.log(`  (note: ${linkFallbacks} file(s) copied instead of linked — symlinks need elevated rights on this OS)`);
  if (wantCursor) console.log('Restart Cursor to activate skills, commands, and agents.');
  if (wantClaude) console.log('Restart any active claude sessions — skills appear as /slash-commands.');
  if (wantCodex) console.log('Codex CLI loads ~/.codex/AGENTS.md automatically; prompts appear via the / picker.');
  if (wantGemini) console.log('Gemini CLI loads ~/.gemini/GEMINI.md automatically; run /memory refresh in an active session.');
}
