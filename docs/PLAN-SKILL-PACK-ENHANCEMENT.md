# Skill Pack Enhancement Plan — 2026-07-18

Audit of all 94 skills + 15 commands against current skill-authoring best practice
(Anthropic Agent Skills docs, Claude 4.5+/5 prompting guidance, the Agent Skills open
standard). Three parallel read-only sweeps covered every family. **Plan only — no
edits applied yet.**

**Verdict:** the corpus is well above community average — prose is clean, caps-shouting
is disciplined (≈60 emphasis keywords across 1 MB), workflow bundles correctly delegate
("Read X and follow it") instead of restating, and ~20 skills already use `references/`.
The defects are *packaging, consistency, and always-on token cost* — not writing quality.

---

## P0 — Correctness bugs (runtime-failing, wrong, or leaking)

1. **Wrong Sentry MCP param `naturalLanguageQuery` → `query`** — replicated in 7 files
   (~10 occurrences): `audit-security:78`, `audit-performance:28,38,50`,
   `audit-code-review:52`, `audit-fe-api:138`, `debug-error:33`,
   `debug-fe-be-integration:124`, `debug-sentry-monitor:124,132`. Current Sentry MCP
   `search_issues`/`search_events` take `query`. One find-replace pass.
2. **`test-qa` description leaks private project names** — private project-skill names
   were hardcoded in the frontmatter of a published pack. Replace with a generic
   "project-specific QA skills take precedence" sentence.
3. **`mobile-emulator-start` stale display default** — `1080×4000` at lines 6, 94, 97,
   267 contradicts the corrected guidance (1080×2400 on Windows/Capacitor; never
   `wm size 1080x4000` without a matching tall skin).
4. **`enhance-web-landing:22` leaked codename** — H1 reads
   `# tasteskill: Anti-Slop Frontend Skill`; doesn't match the skill name.
5. **`design-mobile-first` broken description** — slug substituted into prose
   ("Design design-mobile-first responsive interfaces…") and lists its own slug as a
   trigger phrase.
6. **Unverifiable volatile claims baked into always-loaded descriptions** —
   `plan-input-validation` (CVE-2026-41432, also in `plan-llm-cost-guardrails:30`),
   `plan-rls-audit` (Moltbook / CVE-2025-48757, "1.5M API keys"),
   `plan-data-integrity` ("April 2026 PocketOS/Railway… deleted prod DB in 9s").
   Move to body, hedge as "reported", or drop. Anthropic guidance: no time-sensitive
   info in skills; descriptions are for routing.
7. **`test-red-team` description = 1056 chars** — exceeds the spec's 1024-char
   frontmatter limit. Trim the coverage-matrix summary out of frontmatter (it belongs
   in the body).

## P1 — Token usage (largest measurable wins)

1. **Slim the five giant entry bodies (~90 KB combined).** `enhance-web-landing`
   (42.6 KB body / 46.5 KB refs), `enhance-web-ux` (25.8/23.4), `enhance-web-ui`
   (23.6/31.8), `mobile-rn-screen` (22.9/32.8), `enhance-capacitor-ui` (20.7/33.0).
   The progressive-disclosure split was done backwards: detail was *added* to
   `references/` without being *removed* from the body. Target: lean entry file
   (when-to-fire + workflow + pointers, ~5–8 KB), directives in refs. Anthropic's
   cap: SKILL.md body under 500 lines.
2. **Trim the 9 plan-\* descriptions >800 chars** (cluster 675–969, e.g.
   `plan-antislop` 969). Descriptions load into every session's roster; the CVE/stat
   justification doesn't aid routing. Keep what + when + trigger phrases (~300–400
   chars). ≈1k tokens saved per session across the pack.
3. **`workflow-housekeep` (498 lines, no refs)** — extract inline README template
   (L126–160), report template (L440–489), and command cheatsheet to `references/`.
   Halves the body.
4. **`backend-realtime`** — 40-line inline `useRealtimeMessages` hook hardcoded to
   `@/lib/supabase/client` → move to `references/`, note stack assumption.
5. **`thirdparty-emil-design-eng` (27 KB, 690 lines, flat)** — flag only; verbatim
   upstream content, splitting risks drift. Consider an upstream-sync note instead.

## P2 — Consistency & portability (industry standard)

1. **Converge the two plan-\* templates.** 6 skills use the references-style
   (`## vs neighbors` → `⛔ Preservation Contract` → refs), 11 inline everything.
   Hybrid: keep the inline family's richer "When this fires / Why a dedicated skill"
   prose; extract the preservation contract to a shared `references/` file (currently
   restated near-verbatim in 11 files). Standardize the neighbor-table heading.
2. **Normalize MCP invocation syntax.** `CallMcpTool(server: user-firecrawl…)`
   pseudo-syntax appears in 19 files (firecrawl 38×, sentry 37×, supabase 33×,
   playwright 20×). Cursor-flavored; not runnable in Claude Code. Use the portable
   `ServerName:tool_name` convention from the Agent Skills docs, stated as prose.
3. **Dual-runtime paths.** `~/.cursor/skills/…` hardcoded in 4 workflow bundles
   (~20 lines) and 14 of 15 commands; only `commands/burndown-full.md` gives both
   runtimes. Fix: refer to skills by bare name ("Read the `test-red-team` skill and
   follow it") — resolves in any runtime. `commands/plan.md` is 100 % Cursor-UI
   (Shift+Tab, `.cursor/plans/`) — add a Claude Code section or mark Cursor-only.
4. **Command frontmatter.** Only 4/15 commands have YAML frontmatter. Add
   `description` (+ `argument-hint` where applicable) so both Cursor and Claude Code
   surface them properly.
5. **De-duplicate:**
   - `meta-skill-creator` (skills/) vs `create-skill` (skills-cursor/) — same job,
     9 KB vs 8.5 KB, real drift risk. Merge or make one a thin pointer.
   - `enhance-web-ui` ↔ `enhance-web-ux`: 41 identical lines (Critical Rules /
     silent-pain catalogue / squint-pass) → shared reference file.
   - backend family: "## CRITICAL: Check Existing First / Before implementing ANY…"
     near-verbatim in 4/5 files → one shared convention line or reference.
6. **Frontmatter key hygiene.** Only mushi-\* use a `triggers:` key duplicating the
   description verbatim — drop it (spec-compliant runtimes ignore unknown keys, but
   it's dead weight and inconsistent).
7. **Stack-assumption framing.** audit/test families frame Supabase/Next as
   auto-detected (good); backend-\* hardcodes without framing. Copy the audit
   family's framing sentence.

## P3 — Wording, tone, freshness

1. **Rewrite ~13 thin descriptions** to the house standard (third person, what + when
   + concrete failure-mode triggers — the `enhance-web-ui` / `design-email` /
   `data-pipeline` pattern): `design-api`, `design-frontend`, `design-system`,
   `design-motion`, `design-mobile-first`, `data-visualization`, `docs-writer`,
   `meta-mcp-builder`, `backend-patterns` (238 chars, no triggers), `babysit`
   (no triggers, overlaps workflow-pr), `deploy-npm`, plus the two remaining generic
   ones surfaced in CATALOG review. Slightly "pushy" descriptions are correct —
   models under-trigger skills.
2. **`audit-ux` emphasis overload** — 19× "you MUST", "Do NOT skip Step 0",
   "CRITICAL:" headers. Claude 4.5+/5 models follow instructions literally and
   over-trigger on aggressive emphasis; state the rule once + why. Also rewrite its
   `Glob:`/`Grep:` pseudo-instructions (L55–59, 82–87) — they conflict with this
   repo's own shell-first rule and aren't runnable; same for
   `audit-security:236` "Grep for: …".
3. **Stale references:** GPT-4o ×7 and Claude 3/3.5 in `audit-langfuse-llm`
   illustrative snippets → current model IDs; `thirdparty-ui-ux-pro-max` hardcodes
   "67 styles" twice → "the full style catalog".
4. **`deploy-npm`** — reframe from personal runbook ("exact workflow used to ship
   mushi-mushi v0.7.3 on 2026-05-27") to a generalized release skill with the
   mushi run as an example in `references/`.
5. **Licensing hygiene:** pin actual upstream licenses in
   `thirdparty-emil-design-eng/ATTRIBUTION.md` and
   `thirdparty-web-interface-guidelines/ATTRIBUTION.md` (currently "See upstream
   repository"; only ui-ux-pro-max pins MIT).

## Explicitly keep (verified strengths — do not "fix")

- Bold-over-caps emphasis style; low ALWAYS/NEVER density outside `audit-ux` and
  `enhance-web-landing`.
- Workflow bundles delegating by reference instead of restating sub-skills.
- The ~12 exemplary descriptions (enhance-web-ui/ux/web3d, design-email/prd,
  mobile-rn-screen, mobile-emulator-test, data-pipeline, docs-coauthor, test-red-team
  body, audit family generally).
- The thirdparty ATTRIBUTION.md pattern itself.
- `references/` three-file pattern in the 6 references-style plan skills
  (preservation-contract / output-templates / domain scope) — this is the template to
  converge *toward*.
- Cursor-first paths in `rules/*.mdc` — intentional; the repo's primary target is
  Cursor. Only the *skill/command* bodies need runtime-neutral wording.

## Suggested execution order

| Phase | Items | Effort | Risk |
|-------|-------|--------|------|
| 1 | P0.1–P0.7 (bug fixes, leak, over-limit description) | ~1 session | Low |
| 2 | P1.2 + P3.1 (description pass across ~25 skills) | ~1 session | Low |
| 3 | P1.1/P1.3/P1.4 (body slimming into existing refs) | 2–3 sessions | Medium — diff carefully; content moves, never deleted |
| 4 | P2.1–P2.7 (template convergence, MCP syntax, dual-runtime) | 2 sessions | Medium |
| 5 | P3.2–P3.5 (tone, staleness, licensing) | ~1 session | Low |

Each phase is independently shippable. Phase 3 should be one skill per commit so
`git diff --stat` proves nothing was dropped (content relocated ≠ removed).

## Execution log

### Phase 3 · P1.1 — five giant entry bodies: verified already-split, left intact
Checked 2026-07-18. The five skills (`enhance-web-landing`, `enhance-web-ux`,
`enhance-web-ui`, `mobile-rn-screen`, `enhance-capacitor-ui`) are **already
progressively split**: each `SKILL.md` ends in a `## Further reading` pointer and
the heavy reference material (extended failure modes, pattern libraries, research
anchors, long examples) lives only in `references/details.md`. Heading-level
intersection between each body and its `details.md` is **empty** — there is no
duplicated content to remove, and all five bodies are already under the 500-line
validator cap.

The residual body size (20–42 KB) is the skill's **operating core**: the
when-to-fire router, Critical Rules, Workflow Checklist, and numbered step
procedure — exactly the material Anthropic guidance keeps in the always-loaded
body. Reaching the aspirational "~5–8 KB body" would require relocating this
non-duplicated, load-bearing procedure into refs, forcing a second read to
execute the skill and risking reliability. Per anti-deletion discipline ("if
something seems removable, leave it and note it"), these five are left intact.
P1.3/P1.4/P1.5 (genuine duplication / oversized inline blocks) were already
completed in earlier Phase 3 commits.

Follow-up (out of P1.1 scope, non-blocking): the `enhance-web-ui` body has a few
`see *Primitive-First Patch Rule* below` / `Composition Move 4` cross-references
that now resolve into `references/details.md` rather than "below" — minor
correctness nits from the original split, worth a future cross-ref pass.

### Phase 4 · P2.3 — dual-runtime paths
All 44 `~/.cursor/skills/<name>/SKILL.md` references in the 4 workflow bundles and
the commands now refer to skills by bare name (`Read the \`X\` skill and follow it`),
which resolves in any runtime; the redundant `(path)` parentheticals were dropped.
`commands/plan.md` gained a runtime note (Shift+Tab works in both Cursor and Claude
Code; `.cursor/plans/` is Cursor-only). **Left intentionally:** script-execution
paths (`thirdparty-ui-ux-pro-max/scripts/search.py`, `enhance-readme/scripts/*.mjs`)
and the `ATTRIBUTION.md` install-path docs — these are real per-runtime file paths,
not skill references, and the ui-ux-pro-max ATTRIBUTION explicitly asks to preserve
its script paths. A future dual-runtime pass could show both `~/.cursor/` and
`~/.claude/` forms for those scripts.

## Sources

- [Skill authoring best practices — Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Equipping agents for the real world with Agent Skills — Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Claude 4.x prompting best practices — Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Agent Skills open standard — agentskills/agentskills](https://github.com/agentskills/agentskills)
- [Agent Skills — OpenAI Codex docs](https://developers.openai.com/codex/skills)
