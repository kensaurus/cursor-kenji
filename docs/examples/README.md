# Examples

Reference artifacts and sample outputs — not installed with skills.

## Plan audit samples

`plan-audits/<repo>/` holds example `plan-*.md` burndowns produced by running plan skills
on a real codebase. Use as format reference when authoring or reviewing plan output.

| Sample | Skill | Repo audited |
|--------|-------|--------------|
| [plan-antislop.md](plan-audits/cursor-kenji/plan-antislop.md) | `plan-antislop` | cursor-kenji (Jun 2026) |
| [plan-aeo-readiness.md](plan-audits/cursor-kenji/plan-aeo-readiness.md) | `plan-aeo-readiness` | cursor-kenji |
| [plan-dependency-provenance.md](plan-audits/cursor-kenji/plan-dependency-provenance.md) | `plan-dependency-provenance` | cursor-kenji |
| [plan-secrets-audit.md](plan-audits/cursor-kenji/plan-secrets-audit.md) | `plan-secrets-audit` | cursor-kenji |

**Local runs:** new audit outputs belong at the repo root as `plan-<skill>.md` while you
work — they are gitignored. Copy finished samples here if you want them in version control.

## Project constitution

Copy [AGENTS.template.md](../AGENTS.template.md) to your app repo root as `AGENTS.md`.
