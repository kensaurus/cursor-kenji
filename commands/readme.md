# Session Documentation Sync

## Purpose
After coding, sync all READMEs to reflect changes made this session. Keep docs accurate and concise.

## Trigger
End of coding session or on request.

---

## Process

### 1. Scan Session Changes
```bash
git status              # Modified/added/deleted files
git diff --stat         # Scope of changes
```
- Group changes by folder
- Map each folder to its README (e.g., `components/` → `@_components-README.md`)

### 2. Update Strategy

| Change Type | Action |
|-------------|--------|
| New file | Add to README with description, API, usage |
| Modified file | Update existing docs if API/behavior changed |
| Deleted file | Remove from README |
| Renamed file | Update refs, keep history note if significant |
| New folder | Create README |
| Deleted folder | Remove README |

### 3. README Template

**Naming:** `@_[folder-name]-README.md`

```markdown
# [Folder Name]

## Overview
One-line folder purpose.

## Contents

### ComponentName
Brief description.

**Props:**
| Name | Type | Default | Description |
|------|------|---------|-------------|

**Usage:**
\`\`\`tsx
<ComponentName prop="value" />
\`\`\`

**Notes:**
- Edge cases, gotchas
```

### 4. Writing Rules

**Do:**
- Bullets over paragraphs
- Minimal complete examples (copy-pasteable)
- Include types, signatures, props
- Note gotchas and edge cases
- Show actual import paths

**Don't:**
- Redundant descriptions
- Obvious comments
- Empty sections
- Outdated refs
- Filler words

---

## Codebase Stats

Quick reference (run to update):

```bash
# Total lines by language (excluding deps)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./.venv/*" \
  -exec wc -l {} + | tail -1

# File count
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./.venv/*" | wc -l
```

**Current (Feb 2026):**
| Language | Lines | Files |
|----------|-------|-------|
| TypeScript/TSX | ~156K | 359 |
| Python | ~11K | - |
| CSS | ~11K | - |
| SQL (migrations) | ~20K | - |

---

## Folder Priority

Update READMEs in this order:
1. `src/components/` - UI primitives
2. `src/features/` - Feature modules
3. `src/hooks/` - Shared hooks
4. `src/lib/` - Utilities
5. `supabase/` - Database schema, functions, migrations

---

## Checklist

- [ ] All modified folders have updated READMEs
- [ ] New folders have READMEs created
- [ ] Deleted code refs removed
- [ ] Examples are copy-pasteable
- [ ] Import paths are correct
- [ ] No empty sections
- [ ] Consistent format