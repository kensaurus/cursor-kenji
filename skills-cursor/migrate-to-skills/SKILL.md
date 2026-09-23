---
name: migrate-to-skills
description: Convert 'Applied intelligently' Cursor rules (.cursor/rules/*.mdc) and slash commands (.cursor/commands/*.md) to Agent Skills format (.cursor/skills/). Use when the user wants to migrate rules or commands to skills, convert .mdc rules to SKILL.md format, or consolidate commands into the skills directory.
disable-model-invocation: true
effort: low
---
# Migrate Rules and Slash Commands to Skills

Convert Cursor rules ("Applied intelligently") and slash commands to Agent Skills format.

Copy each body verbatim — byte for byte, whitespace and typos included. The content is the user's, and an exact copy is what makes the migration reversible.

## Locations

| Level | Source | Destination |
|-------|--------|-------------|
| Project | `{workspaceFolder}/**/.cursor/rules/*.mdc`, `{workspaceFolder}/.cursor/commands/*.md` |
| User | `~/.cursor/commands/*.md` |

Notes:
- Cursor rules inside the project can live in nested directories; glob `**/.cursor/rules/*.mdc` from the workspace root so none are missed.
- Ignore anything in ~/.cursor/worktrees
- Ignore anything in ~/.cursor/skills-cursor. This is reserved for Cursor's internal built-in skills and is managed automatically by the system.

## Finding Files to Migrate

**Rules**: Migrate if rule has a `description` but NO `globs` and NO `alwaysApply: true`.

**Commands**: Migrate all - they're plain markdown without frontmatter.

## Conversion Format

### Rules: .mdc → SKILL.md

```markdown
# Before: .cursor/rules/my-rule.mdc
---
description: What this rule does
globs:
alwaysApply: false
---
# Title
Body content...
```

```markdown
# After: .cursor/skills/my-rule/SKILL.md
---
name: my-rule
description: What this rule does
---
# Title
Body content...
```

Changes: Add `name` field, remove `globs`/`alwaysApply`, keep body exactly.

### Commands: .md → SKILL.md

```markdown
# Before: .cursor/commands/commit.md
# Commit current work
Instructions here...
```

```markdown
# After: .cursor/skills/commit/SKILL.md
---
name: commit
description: Commit current work with standardized message format
disable-model-invocation: true
---
# Commit current work
Instructions here...
```

Changes: Add frontmatter with `name` (from filename), `description` (infer from content), and `disable-model-invocation: true`, keep body exactly.

**Note:** `disable-model-invocation: true` keeps the model from invoking the skill on its own and keeps its description out of the always-on skill roster that every request pays for. Slash commands are user-triggered from the `/` menu, so migrated commands carry it.

## Notes

- `name` must be lowercase with hyphens only
- `description` is critical for skill discovery
- The workflow below deletes originals after the skill file is written; the user can ask to undo, which restores them

### Migrate a Rule (.mdc → SKILL.md)

1. Read the rule file
2. Extract the `description` from the frontmatter
3. Extract the body content (everything after the closing `---` of the frontmatter)
4. Create the skill directory: `.cursor/skills/{skill-name}/` (skill name = filename without .mdc)
5. Write `SKILL.md` with new frontmatter (`name` and `description`) + the EXACT original body content (preserve all whitespace, formatting, code blocks verbatim)
6. Delete the original rule file

### Migrate a Command (.md → SKILL.md)

1. Read the command file
2. Extract description from the first heading (remove `#` prefix)
3. Create the skill directory: `.cursor/skills/{skill-name}/` (skill name = filename without .md)
4. Write `SKILL.md` with new frontmatter (`name`, `description`, and `disable-model-invocation: true`) + blank line + the EXACT original file content (preserve all whitespace, formatting, code blocks verbatim)
5. Delete the original command file

## Workflow

Use the read, edit, and delete tools for these files rather than the terminal: they preserve bytes exactly and keep every change undoable.

If you have the Task tool available, delegate the file work so the main context stays free of file contents. Dispatch three general-purpose subagents in parallel (not Explore — it is read-only), one each for project rules (`{workspaceFolder}/**/.cursor/rules/*.mdc`), user commands (`~/.cursor/commands/*.md`), and project commands (`{workspaceFolder}/**/.cursor/commands/*.md`). The work is mechanical; low effort is enough. Each subagent:
  I. [ ] Finds files to migrate in its pattern
  II. [ ] For rules, keeps only "applied intelligently" rules (has `description`, no `globs`, no `alwaysApply: true`). Commands are always migrated.
  III. [ ] Lists the files to migrate. If empty, done.
  IV. [ ] For each file, reads it, then writes the new skill file with the body verbatim.
  V. [ ] Deletes the original file.
  VI. [ ] Returns the migrated skill paths with their original paths.

1. [ ] Create the skills directories if they don't exist (`.cursor/skills/` for project, `~/.cursor/skills/` for user)
2. [ ] Dispatch the subagents and wait for all of them
3. [ ] Summarize the results and tell the user they can ask you to undo the migration
4. [ ] If asked to undo, reverse the steps to restore the original files

If you don't have the Task tool available, do I–V yourself across both project (`.cursor/`) and user (`~/.cursor/`) directories, then steps 3–4.
