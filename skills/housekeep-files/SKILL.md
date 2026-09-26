---
name: housekeep-files
description: >
  Copy-not-move organizer for document trees: hash inventory, dry run,
  labeled copies, search catalog, verify every source survived. Use when
  "organize my Downloads", "sort my company folders", or "file my receipts".
  Repo cleanup → workflow-housekeep.
license: MIT
---

# housekeep-files — File the documents, keep every original

**Degree of freedom: MIXED.** Which owner, area, and doc type a file belongs
to, and which layout option fits the person `[HIGH freedom]`. The
copy-not-move rule, the hash inventory before the first copy, and the
verify gate `[LOW freedom — run exactly]`.

Apply-now for one drifted **file tree**: a Downloads pile, a cloud folder
named for one company that holds two, receipts spread across three places.
The output is an added, labeled copy of the documents plus a catalog an
agent can grep. The input tree is left complete. Retiring the duplicates
later is a separate, human-run decision.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **housekeep-files** (this) | Personal / business document trees on disk or a synced drive |
| `workflow-housekeep` | A git repository: README, dead artifacts, dependencies |
| `housekeep-backlog` | Parked work register, not files |
| `plan-data-integrity` | Database destructive-op safety |
| `plan-secrets-audit` | Finding leaked keys; this skill only refuses to copy them |

## How to reason (every file)

1. **Owner** — which legal entity or person pays for or signs this? Two
   companies are two sets of books, even when one person runs both; a CV
   or an ID scan belongs to neither company.
2. **Area** — company / finance / product / client / site / tax / identity.
3. **Doc type and date** — invoice, receipt, contract, tax-return, payroll,
   registration, lease, cv, brand, plan, correspondence, other. Date from
   the filename first, then the parent folder, else `undated`.
4. **Copy or index** — signing keys, credentials, media over the size cap,
   installers: never copied, only cataloged where they already are.

An ambiguous file goes to `90_inbox` with its best-guess tags. Guessing an
owner wrong files company A's receipt under company B; `90_inbox` files it
nowhere wrong.

## Worked example

> **Owner:** `Form 9 - Certificate.pdf` sits in a folder named for
> company B; the form is company B's incorporation paper → `acme-uk`.
> **Area / type:** company / registration; no date in the name → `undated`.
> **Copy or index:** PDF, 80 KB → copy.
> **Label:** `acme-uk_company_undated_registration__Form 9 - Certificate.pdf`
> — original name kept after `__` so the old string still matches search.
> **Catalog line:** entity, area, doc_type, tags `["acme","companies-house","incorporation"]`,
> `original_path`, `canonical_path`, `sha256`, `persist: copied-source-kept`.
> **Neighbor:** `AuthKey_XXXX.p8` in an app folder → `indexed-in-place`,
> reason `secret`; the catalog records its folder, not its bytes.

---

## Phase 0 — Inventory the tree, then pick the layout with the human

Read before moving anything: the top two levels of every source root,
which folders already exist at the destination, and which names repeat
in more than one place. Then offer the options below and let the person
choose; each is a different tree, so the plan cannot be written first.

### Option A — Root per owner (default)

```
<Drive>/<Owner-A>/   00_company  10_finance  20_<site-or-venture>  30_products  40_clients  90_inbox
<Drive>/<Owner-B>/   00_company  10_finance  90_inbox
<Drive>/_personal/   tax  identity  job-search  family
```

Best when owners are separate legal entities or the accountant for one
must never see the other. Two or three levels deep. Numbered areas keep a
fixed order without freezing IDs the way full Johnny.Decimal does.

### Option B — One root, owners inside

```
<Drive>/Documents/<Owner-A>/…   <Drive>/Documents/<Owner-B>/…   <Drive>/Documents/_personal/…
```

Best when one root folder is already shared or synced and re-sharing is
costly. Same area folders inside each owner.

### Option C — PARA-lite for a single owner

```
<Drive>/10_projects  20_areas  30_resources  40_archive
```

Best for one person with no company split. Active work moves between
projects and archive; areas hold the standing responsibilities.

### Label and metadata options (combine with any layout)

| Option | When |
|---|---|
| Catalog only (`_ai-catalog.jsonl`, names untouched) | Names already carry date and subject, or apps read files by name |
| Catalog + prefix on vague names (`prefix=yes` rows) | Loose files like `Form 9.pdf`, `scan001.jpg`; original kept after `__` |
| Folder rename only | Whole folders like `#projectX` → `30_products/project-x`, internals untouched |

Why these and not cloud properties or hidden sidecars: cloud custom
properties are API fields, not files; hidden sidecar folders often do not
sync. A visible catalog plus an ASCII prefix is what a later agent on any
machine can grep. Sources and the exact schema:
[references/naming-and-catalog.md](references/naming-and-catalog.md).

### Move instead of copy

Only when the human states that the source tree may lose paths and the
target is on the same volume. Even then run `inventory` first and `verify`
after. The bundled scripts do not move; a move is a manual step the
person performs after `verify` passes on the copies.

## Phase 1 — Write `plan.tsv`  [HIGH freedom]

One row per source folder or loose file. Tab-separated, header row:

```
source	destination	entity	area	project	doc_type	tags	prefix	catalog_root
```

- `source` — existing file or folder. A folder row copies its whole tree
  under `destination`, internals unrenamed.
- `entity` — short ASCII token per owner (`acme-uk`, `acme-sg`, `personal`).
- `prefix` — `yes` only for loose files whose name says neither owner nor
  date. Folder rows are `no`.
- `tags` — comma-separated, English plus the person's own language, words
  they would actually type: `acme,invoice,請求書`.
- `catalog_root` — the owner root that gets a `_ai-catalog.jsonl`.

Keep dated expense month-folders and app folders exactly as named. Do not
plan rows for RAW, video, camera-card dumps, or installers; list those
folders in `count-only.txt` so the verify gate proves they were untouched.

## Phase 2 — Inventory, dry run, apply, verify  [LOW freedom — this order]

Windows (PowerShell 5.1+):

```powershell
$S = "$HOME\.cursor\skills\housekeep-files\scripts\housekeep-files.ps1"
& $S -Mode inventory -Plan .\plan.tsv -Out .\work -CountOnly .\count-only.txt
& $S -Mode dry-run   -Plan .\plan.tsv -Out .\work      # read work\preview.tsv, fix the plan, rerun
& $S -Mode apply     -Plan .\plan.tsv -Out .\work
& $S -Mode verify    -Plan .\plan.tsv -Out .\work -CountOnly .\count-only.txt
```

macOS / Linux (bash, `shasum` or `sha256sum`):

```bash
S="$HOME/.cursor/skills/housekeep-files/scripts/housekeep-files.sh"
"$S" inventory plan.tsv work count-only.txt
"$S" dry-run   plan.tsv work
"$S" apply     plan.tsv work
"$S" verify    plan.tsv work count-only.txt
```

What the scripts enforce, identically on both platforms:

- `inventory` writes `work/inventory.csv` (path, bytes, sha256) for every
  source file in the plan — hash for files that will be copied, size only
  for in-place items so a streaming drive never downloads media — and
  `work/count-only.csv` for the untouched folders. `apply` refuses to run
  without it.
- `dry-run` writes `work/preview.tsv` with one of `copy`,
  `indexed-in-place` (reason `secret`, `ext`, `size`), or `skipped-exists`
  per file, plus the proposed name. Nothing on disk changes.
- `apply` copies only when the destination path is absent, hashes the
  copy, and marks a mismatch `failed` with the source untouched. It never
  calls a delete. It appends `_ai-catalog.jsonl` at each `catalog_root`
  and at `work/catalog.jsonl`, and drops a `_SEARCH.md` where none exists.
- `verify` re-checks every inventory path (exists, same size), re-hashes
  every copy, recounts every count-only folder, and exits non-zero on the
  first missing file. Its `work/verify-report.txt` is the evidence.

Leave a `README-MOVED.txt` in the old root naming the new roots and
stating that the old tree was not removed.

## Self-critique before reporting

- **Inventory predates the first copy** — `inventory.csv` mtime is earlier
  than the first `copied-source-kept` line.
- **Zero deletes** — the scripts were run unmodified; `apply-log.tsv` has
  no `removed` action; every `count-only` folder count is unchanged.
- **Every source path in `inventory.csv` still exists** at its original
  size — `verify` exit code 0, report listed.
- **No secret gained a second copy** — every `.p8 / .p12 / keystore /
  credentials` row reads `indexed-in-place`.
- **Prefixed names keep the original after `__`**, and no new path exceeds
  the length cap.
- **Storage growth stated** — total bytes copied, so the human can decide
  when to retire the originals.
- **Nothing person-specific leaked into shared artifacts** — the catalog
  holds paths and labels; the skill and its examples hold placeholders.

## Output format

1. **Layout chosen** — option letter, roots created, area folders
2. **Counts** — copied | skipped-exists | indexed-in-place by reason | failed
3. **Verify** — exit code, source paths checked, hashes matched,
   count-only folders unchanged
4. **Catalog** — where `_ai-catalog.jsonl` and `_SEARCH.md` landed, line count
5. **Left for the human** — duplicates to retire later, `90_inbox` items

The turn may end after `verify` exits 0 and the report is written; a
non-zero verify is a finding to fix, never a reason to delete anything.
