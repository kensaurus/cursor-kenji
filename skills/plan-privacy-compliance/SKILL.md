---
name: plan-privacy-compliance
description: >
  Audit real personal-data flows against the privacy policy and GDPR / Japan APPI /
  store privacy labels, then emit a phased plan. Use when "privacy compliance",
  "what data do we collect", "App Store privacy labels", "GDPR/APPI", or a consumer
  launch. Plan only. Consent-gating of analytics → also see audit-analytics.
license: MIT
---

# plan-privacy-compliance — Data-flow & legal-surface plan

**Role:** Privacy engineer (operational compliance, not legal advice).

**Task:** Map what the *code* collects, diff it against the written policy and
store labels, emit `plan-privacy-compliance.md`. **Audit & plan only — no policy
rewrites, SDK gates, or deletion jobs until each phase is approved.**

**The gap that sinks apps is collection-vs-claimed:** the code gathers more than
the privacy policy admits, and the store label is wrong.

Not legal advice. This operationalizes common GDPR and Japan APPI
(個人情報保護法) requirements into engineering findings. Flag genuine ambiguity
for a lawyer.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **plan-privacy-compliance** (this) | Data inventory, consent timing, deletion/export, store labels |
| `audit-analytics` | Event taxonomy + whether analytics *fires before consent* |
| `plan-mobile-readiness` | Submission mechanics (demo account, 2.5.2) — not the data-flow diff |
| `plan-rls-audit` | Who can *read* rows — not what you promised to collect |
| `plan-error-handling` | PII in Sentry/logs |
| `enhance-email-deliverability` | Lawful send / unsubscribe (consent to mail) |

Do **not** fire for "privacy manifest / Data Safety form paperwork only" if the
user is mid-store-submit → still run this for the *data-flow* half, then
`plan-mobile-readiness` for the rest.

---

## Phase 0 — Inventory personal data actually collected

Do not trust the privacy policy. Derive collection from the code:

- **Direct:** forms, signup, profile, uploads, voice/photo, location
- **Automatic:** IP, device IDs, analytics, crash reports, cookies, session
- **Special-category / 要配慮個人情報:** health, biometrics, precise location
- **Third-party SDKs:** every analytics/ads/attribution/crash SDK and what it
  exfiltrates by default

Build: item → collected where → stored where → shared with → retention → basis.

**Consent-gating handoff:** if analytics/ads SDKs initialize on app start, log
the finding here *and* point at `audit-analytics` for the event-level matrix.

---

## Phase 1 — Audit against requirements

**Collection vs claimed** — Diff inventory vs privacy policy vs App Store
Nutrition Label / Play Data Safety. Collected-but-undisclosed is P0.

**Consent** — Obtained *before* non-essential collection? Granular where GDPR
requires? Withdraw path? APPI: 利用目的 specified and notified?

**Data-subject rights** — Working **deletion** (account + data, not deactivate)
and **export**. Must reach DB, buckets, logs, analytics, backups, third-party
SDKs. A delete that leaves PII in Sentry is non-compliant.

**Retention** — Defined windows + an enforcer (cron/TTL), or prose only?

**Cross-border** — Processor region. EU→US needs a transfer basis. APPI
restricts transfers outside Japan without consent/adequacy.

**Minors** — Age-gating and stricter defaults if the app can be used by children.

**Logs & LLM traces** — Raw PII in app logs / Langfuse → `plan-error-handling`,
`audit-langfuse-llm`.

---

## Phase 2 — Phased plan (approve before executing)

- **P0** — undisclosed collection, absent deletion, consent after fire, PII in logs
- **P1** — incomplete deletion, missing export, no retention job, wrong store form
- **P2** — consent granularity, policy wording, processor docs

Each item: what's wrong, requirement (GDPR art. / APPI / store), fix shape,
execute-via (`audit-analytics`, `plan-rls-audit`, `plan-error-handling`, or a
policy/text change).

## Definition of Done

- [ ] Inventory complete (collection → storage → sharing → retention)
- [ ] Every third-party SDK's exfiltration documented
- [ ] Real collection diffed against policy *and* store label
- [ ] Consent timing + withdraw path checked; analytics handoff to `audit-analytics`
- [ ] Deletion + export traced to all stores
- [ ] Retention enforcement identified or flagged absent
- [ ] Cross-border map per processor
- [ ] Plan approved before any change

## Output format

1. **Data inventory** — item | where | stored | shared | retention | basis
2. **Findings** — issue | GDPR/APPI/store | severity | evidence
3. **Store-label diff** — claimed vs actual
4. **Phased plan** — P0/P1/P2 → executing skill
5. Await approval.

## Related

- `audit-analytics` — event coverage + consent-gated firing (run both)
- `plan-mobile-readiness` — store submission mechanics
- `plan-rls-audit` — access control
- `plan-error-handling` / `audit-langfuse-llm` — PII in logs/traces
- `enhance-email-deliverability` — marketing-mail consent
- `plan-aso` — listing copy after labels are honest
