# Documentation index

Quick map of `docs/` — start with [GETTING-STARTED.md](GETTING-STARTED.md) if you're new to Cursor.

| File | Purpose |
|:-----|:--------|
| [GETTING-STARTED.md](GETTING-STARTED.md) | Plain-language install, first phrases, and copy-paste combo pipelines |
| [CATALOG.md](CATALOG.md) | Full skill/command reference + highest-impact composition patterns |
| [TRIGGER-CHEATSHEET.md](TRIGGER-CHEATSHEET.md) | "Say X → skill Y" lookup table |
| [PLAN-LOOPS.md](PLAN-LOOPS.md) | How to chain the 20 `plan-*` skills (grouped loops) |
| [THIRD-PARTY-SKILLS.md](THIRD-PARTY-SKILLS.md) | Vendored upstream skills (`thirdparty-*`), attribution, update policy |
| [AGENTS.template.md](AGENTS.template.md) | Project constitution template (mission / stack / roadmap / agent discipline) |
| [examples/](examples/) | Sample `plan-*.md` audit outputs |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Skill authoring, validation, PR expectations |
| [PROMPT-ENHANCEMENT-PLAYBOOK.md](PROMPT-ENHANCEMENT-PLAYBOOK.md) | T1–T6 prompt craft via `enhance-skill-prompts` (how a skill instructs, not what it does) |
| [PROMOTION.md](PROMOTION.md) | Checklist for listing on skills.sh, cursor.directory, etc. |
| [DISTRIBUTION.md](DISTRIBUTION.md) | Install surfaces, directory listings, discovery links |
| [PUBLISHING.md](PUBLISHING.md) | Maintainer release guide (OIDC npm publish) |

Repo root also has [README.md](../README.md) (install + overview), [llms.txt](../llms.txt) (AI/crawler index), [SECURITY.md](../SECURITY.md) (secrets + MCP hygiene), [CONTRIBUTING.md](../CONTRIBUTING.md) (short form), and [CHANGELOG.md](../CHANGELOG.md).

**Skill count:** run `npm run check:skills` — the number in README, `package.json`, and this catalog is derived from `skills/*/SKILL.md`, not hand-edited.

**Third-party skills:** directories prefixed `thirdparty-*` are upstream-maintained — see [THIRD-PARTY-SKILLS.md](THIRD-PARTY-SKILLS.md) before editing.
