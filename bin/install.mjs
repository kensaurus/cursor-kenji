#!/usr/bin/env node
/**
 * cursor-kenji installer
 *
 * Usage:
 *   npx @kensaurus/cursor-kenji                  Merge-install into ~/.cursor/ AND ~/.agents/skills/
 *   npx @kensaurus/cursor-kenji --clean          Mirror: make both paths match this repo exactly
 *   npx @kensaurus/cursor-kenji --only skills     Install only some groups (csv)
 *   npx @kensaurus/cursor-kenji --skill audit-ux  Install a single skill
 *   npx @kensaurus/cursor-kenji --link           Dev mode: symlink instead of copy
 *   npx @kensaurus/cursor-kenji --restore [stamp] Restore a previous --clean backup
 *   npx @kensaurus/cursor-kenji --dry-run        Preview without changing anything
 *   npx @kensaurus/cursor-kenji --help
 *
 * Why two paths?
 *   ~/.cursor/skills/   — read by the Cursor agent at runtime
 *   ~/.agents/skills/   — indexed by the Cursor Skills UI panel
 *   Both must be populated for skills to appear AND work.
 */

import {
  existsSync, mkdirSync, cpSync, rmSync, symlinkSync, readdirSync, statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
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
  npx @kensaurus/cursor-kenji --clean           Mirror: wipe and rebuild both paths from this repo
  npx @kensaurus/cursor-kenji --only skills      Install only some groups (skills,commands,agents,rules)
  npx @kensaurus/cursor-kenji --skill <name>     Install one skill by name
  npx @kensaurus/cursor-kenji --link            Dev mode: symlink repo into ~/.cursor (live edits)
  npx @kensaurus/cursor-kenji --restore [stamp]  Restore a previous --clean backup (latest if omitted)
  npx @kensaurus/cursor-kenji --dry-run         Preview without changing anything

Flags:
  --clean, --mirror   Wipe managed dirs first so both paths exactly mirror this repo.
  --no-backup         Skip the timestamped backup taken before a --clean wipe.
  --only <csv>        Limit to a subset of: skills, commands, agents, rules.
  --skill <name>      Install a single skill (implies --only skills).
  --link              Symlink (junction on Windows) instead of copying — for repo dev.
  --restore [stamp]   Copy a backup under ~/.cursor/.cursor-kenji-backups/ back into place.
  --dry-run           Show what would happen; make no changes.

What gets installed:
  ~/.cursor/skills/       ← agent skills at runtime (skills/ + skills-cursor/ merged)
  ~/.agents/skills/       ← Cursor Skills UI index (same content, required for UI visibility)
  ~/.cursor/commands/     ← slash commands
  ~/.cursor/agents/       ← subagent definitions
  ~/.cursor/rules/        ← project rules starter pack
  ~/.cursor/mcp.json      ← MCP server template (only if missing; never overwritten)
  `.trim());
  process.exit(0);
}

const isDryRun = has('dry-run');
const isClean = has('clean', 'mirror', 'force');
const noBackup = has('no-backup');
const useLink = has('link');
const targetBase = join(homedir(), '.cursor');
const agentsBase = join(homedir(), '.agents');   // Cursor Skills UI reads ~/.agents/skills/
const backupsRoot = join(targetBase, '.cursor-kenji-backups');

const ALL_DIRS = [
  { src: 'skills',        dest: 'skills'   },
  { src: 'skills-cursor', dest: 'skills'   },  // merge cursor-specific skills
  { src: 'commands',      dest: 'commands' },
  { src: 'agents',        dest: 'agents'   },
  { src: 'rules',         dest: 'rules'    },
];

// ---- restore mode ----------------------------------------------------------
if (has('restore')) {
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
    const to = join(targetBase, dest);
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

// ---- mirror mode: back up, then wipe managed dirs --------------------------
let wiped = 0;
let backupRoot = null;
if (isClean) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  backupRoot = join(backupsRoot, stamp);
  for (const dest of managedDests) {
    const p = join(targetBase, dest);
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
}

// ---- copy / link -----------------------------------------------------------
let copiedDirs = 0;
let copiedFiles = 0;
for (const { src, dest } of DIRS) {
  const srcPath = resolve(__dir, src);
  const destPath = join(targetBase, dest);
  if (!existsSync(srcPath)) continue;
  if (!isDryRun) mkdirSync(destPath, { recursive: true });

  for (const item of readdirSync(srcPath)) {
    if (skillName && item !== skillName) continue;
    const itemSrc = join(srcPath, item);
    const itemDest = join(destPath, item);
    const isDir = statSync(itemSrc).isDirectory();
    place(itemSrc, itemDest, isDir);
    if (isDir) copiedDirs++; else copiedFiles++;
  }
}

if (skillName && copiedDirs + copiedFiles === 0) {
  console.error(`✗ Skill '${skillName}' not found in skills/ or skills-cursor/.`);
  process.exit(1);
}

// ---- also write skills to ~/.agents/skills/ (Cursor Skills UI reads here) --
// ~/.cursor/skills/ is used by the Cursor agent at runtime.
// ~/.agents/skills/ is the path Cursor's Skills UI panel indexes.
// Both must be populated or skills appear in the agent context but not the UI.
if (!onlyGroups || onlyGroups.has('skills')) {
  const agentsSkillsDest = join(agentsBase, 'skills');
  const cursorSkillsSrc = join(targetBase, 'skills');
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

// ---- MCP config template (only if missing; never overwritten) --------------
const mcpDest = join(targetBase, 'mcp.json');
const mcpTemplate = resolve(__dir, 'mcp', 'mcp.json.template');
let mcpInstalled = false;
if (!onlyGroups && existsSync(mcpTemplate) && !existsSync(mcpDest)) {
  if (isDryRun) console.log(`  [dry-run] ${mcpTemplate} → ${mcpDest}`);
  else { mkdirSync(targetBase, { recursive: true }); cpSync(mcpTemplate, mcpDest); }
  mcpInstalled = true;
}

// ---- summary ---------------------------------------------------------------
const mode = `${isClean ? 'mirror' : 'merge'}${useLink ? '+link' : ''}${skillName ? `:skill=${skillName}` : ''}`;
const verb = useLink ? 'linked' : 'copied';

if (isDryRun) {
  console.log(
    `\n[dry-run] mode: ${mode}` +
    (isClean ? ` — would back up + wipe ${wiped} managed dir(s)` : '') +
    `\n[dry-run] Would ${useLink ? 'link' : 'copy'} ${copiedDirs} directories and ${copiedFiles} files to ${targetBase}` +
    (mcpInstalled ? ' (plus mcp.json template)' : '')
  );
  console.log('Run without --dry-run to apply.');
} else {
  if (isClean && backupRoot && !noBackup) {
    console.log(`✓ Backed up previous ~/.cursor/{${managedDests.join(',')}} → ${backupRoot}`);
  }
  console.log(`\n✓ cursor-kenji installed (${mode}) — ${copiedDirs} directories and ${copiedFiles} files ${verb} to ${targetBase}`);
  if (!onlyGroups || onlyGroups.has('skills')) {
    const agentsCount = existsSync(join(agentsBase, 'skills')) ? readdirSync(join(agentsBase, 'skills')).length : 0;
    console.log(`✓ Skills synced to ${join(agentsBase, 'skills')} (${agentsCount} skills — Cursor UI path)`);
  }
  if (linkFallbacks) console.log(`  (note: ${linkFallbacks} file(s) copied instead of linked — symlinks need elevated rights on this OS)`);
  if (mcpInstalled) console.log(`✓ MCP template written to ${mcpDest} — edit it to add your API keys.`);
  console.log('Restart Cursor to activate skills, commands, and agents.');
}
