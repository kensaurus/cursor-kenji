---
name: plan-dependency-provenance
description: >
  Audit dependencies for hallucinated/slopsquatted packages, supply-chain risk, and
  licensing/provenance gaps, then produce a phased remediation plan. Use when the user
  says "check my dependencies", "is this package real", "slopsquatting", "are my npm/pip
  packages safe", "audit my supply chain", "license check", "SBOM", "did the AI hallucinate
  a package", or is hardening before launch or open-sourcing. AI agents hallucinate
  non-existent package names ~20% of the time; 43% recur predictably (CSA 2026) — attackers
  pre-register on npm/PyPI. Audits existence/age/popularity, lockfile integrity, typo names,
  transitive bloat, license + provenance. Plan only until approved. Pairs with
  plan-secrets-audit, create-hook, workflow-housekeep. Do NOT use for version bumps
  (/update-deps) or bundle size (audit-bundle-size).
license: MIT
---

# Dependency Provenance & Supply-Chain Audit + Remediation Plan

**Role:** Senior supply-chain engineer + open-source compliance specialist.

**Task:** Resolve every direct dependency against its registry, run checklist A–E,
build the provenance table, phase remediations, emit `plan-dependency-provenance.md`.
**Audit & plan only — never install suspect packages to verify.**

**Verify every package is real, safe, and licensed. Install nothing until approved.**

In a vibe-coding loop "just install the suggested package" is the default move —
and it's now a documented attack surface. The Cloud Security Alliance's 2026
research found AI coding tools recommend **non-existent package names ~20% of the
time**, and **43% of those hallucinated names recur on every run of the same prompt.**
Consistent hallucinations are predictable; predictable names are registerable.
Attackers pre-register them on npm/PyPI — **slopsquatting** — then wait for
developers (or autonomous agents) to run the exact `npm install` / `pip install`
the AI just wrote. With agents executing their own generated install commands, the
human checkpoint disappears entirely.

This skill is the **audit-and-plan** half. Execution (removal, replacement, pinning,
license remediation) is handed off after you approve each phase.

---

## When this fires

Trigger phrases: *"check my dependencies"*, *"is this package real"*,
*"slopsquatting"*, *"are my packages safe"*, *"audit my supply chain"*, *"license
check"*, *"generate an SBOM"*, *"did the AI invent a package"*, *"pre-launch /
pre-open-source dependency audit"*.

Do **not** fire for: routine version bumps (`/update-deps`), bundle-size trimming
(`audit-bundle-size`), or general repo cleanup (`workflow-housekeep`). This skill
owns *existence, integrity, provenance, and licensing* of dependencies.

---

## Why a dedicated skill

`/update-deps` assumes the packages are *legitimate* and just need upgrading.
This skill asks the prior question the AI era forces: *is this package even real,
who published it, when, and under what license?*

---

## The audit

### A · Existence & slopsquatting (the AI-era core)
- **Resolve every direct dependency** against its registry. Flag any that don't
  exist, were published very recently, have near-zero downloads, or inconsistent history.
- **Typo / confusion check** — names one edit away from a popular package
  (`reqests`, `lodahs`), or conflation names merging two real packages.
- **AI-origin flag** — obscure/novel deps in vibe-coded projects: guilty-until-verified.
- **Maintainer & repo signals** — no source repo, single recent maintainer: elevate.

### B · Lockfile & integrity
- **Lockfile present and committed?** No lockfile = every install is a fresh roll.
- **Pinned vs floating** — wildcard/`^`/`latest` on security-sensitive deps.
- **Lockfile drift** — manifest and lockfile disagree.

### C · Provenance & patch history
- **Source repo reachable**, actively maintained, not archived.
- **Known vulnerabilities** — flag deps with open advisories (recommend Socket.dev /
  Phylum / `npm audit` / `pip-audit` in execution).
- **Install scripts** — postinstall reaching network/filesystem: flag for review.

### D · Licensing
- **License inventory** — SPDX per dependency. Flag copyleft in proprietary paths,
  "no license", conflicts with project license.
- **Attribution gaps** — bundled code lacking NOTICE.

### E · Bloat & blast radius
- **Transitive depth** — direct vs total; duplicate libs.
- **Unused dependencies** — declared but never imported.

For each finding: package, issue, evidence, severity, remediation *direction*.

---

## Procedure

1. **Inventory.** Parse manifests + lockfiles. State ecosystems and resolution limits.
2. **Resolve & classify.** Checklist A–E. Tag Critical / High / Med / Low.
3. **Build the provenance table** — key artifact.
4. **Phase the burndown.** Verify/remove suspect packages first.
5. **Emit `plan-dependency-provenance.md`. End the turn. Do not install anything.**

---

## Guardrails

- **Plan only.** No `install`, `add`, `remove`, `update`, or lockfile edits.
- **Never install to "check".** That is exactly the attack.
- **Guilty until verified** for AI-suggested obscure deps.
- **Existence ≠ safety.** Run the full checklist.
- **License is a real finding.**
- **Recommend `create-hook`** pre-install allowlist as regression gate.
- **Minimal quoting** of manifests.

---

## Report template — `plan-dependency-provenance.md`

```markdown
# Dependency Provenance & Supply-Chain Audit — <repo>

_Audit-only. Nothing is installed, removed, or upgraded until each phase is approved._

## Scope
- Ecosystems: npm ☐ pip ☐ other ☐  | Direct deps: n  Transitive: n
- Lockfile(s): present ☐ committed ☐  | Assumptions: …

## Verdict
| Severity | Count | Worst case |
|----------|-------|-----------|
| Critical | n | non-existent / squat-suspect / malicious package installed |
| High     | n | no lockfile, license conflict, open advisory |
| Medium   | n | floating pins, abandoned upstream |
| Low      | n | bloat, unused deps |

## Provenance table (suspect + notable)
| Package | Exists? | First pub | Weekly DLs | License | Repo | Verdict |
|---------|---------|-----------|------------|---------|------|---------|
| fast-cache-utils | ❓ none found | — | — | — | none | Crit: likely hallucinated → remove |

## Findings
| # | Package | Issue | Evidence | Sev | Direction |
|---|---------|-------|----------|-----|-----------|

## Phased burndown
- **Phase 1 — Verify/remove suspect packages** → manual verify + removal
- **Phase 2 — Lock & pin** → `workflow-housekeep`
- **Phase 3 — License & advisories** → wire Socket.dev/Phylum/npm-audit
- **Phase 4 — De-bloat** → remove unused/duplicate deps
- **Gate** → `create-hook` pre-install allowlist

## Execution handoff
Approve a phase to run it. Re-scan after; add the install-time gate.
```

---

## Chains with

- **Pre-launch hardening loop** — supply-chain layer alongside security spine.
- **`plan-secrets-audit`** — both feed `create-hook` regression gates.
- **Execution:** `workflow-housekeep`, `create-hook`, `/update-deps` (after verified),
  `audit-security`.
- **Verify:** re-resolve tree; confirm install-time gate is live.

> Plan with a strong model; execute with `composer-2.5-execution.mdc`. The plan says
> *which* packages are suspect; the rule forbids "just installing it to see".
