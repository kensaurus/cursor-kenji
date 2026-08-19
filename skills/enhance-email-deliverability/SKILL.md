---
name: enhance-email-deliverability
description: >
  Audit and fix transactional/marketing deliverability — SPF, DKIM, DMARC,
  reputation, bounce/complaint handling, list hygiene, unsubscribe compliance —
  so mail lands in the inbox. Use when "emails go to spam", "set up SPF/DKIM",
  or "check deliverability". Templates stay on design-email.
license: MIT
---

# enhance-email-deliverability — Inbox placement & lawful send

**Degree of freedom: MIXED — T1 is the priority.** Scoring auth/hygiene
`[HIGH freedom]`; DNS/config apply `[LOW freedom — after approval]`.
Audit-and-fix. Templates stay on `design-email`.

Close the gap between "the email sends" and "the email arrives". A beautiful
transactional template in spam is a broken signup flow.

Deliverability = authentication + reputation + hygiene + compliance. Miss any
one and placement collapses.

**Audit first. Apply DNS/config on approval.** Template markup stays on
`design-email`.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **enhance-email-deliverability** (this) | SPF/DKIM/DMARC, bounces, complaints, unsubscribe headers |
| `design-email` | Template markup, copy, React Email / MJML |
| `plan-privacy-compliance` | Consent to collect; this owns consent *to send* |
| `audit-analytics` | Whether open/click events fire (not inbox placement) |

Keep `enhance-*` here (audit-and-fix, same family as `enhance-web-seo`). Do
**not** steal "build a welcome email" from `design-email`.

## How to reason

1. **Observe** — SPF/DKIM/DMARC records and a real message's Authentication-Results
2. **Interpret** — pass raw SPF/DKIM but fail alignment? `+all`? DNS-only DKIM?
3. **Classify** — auth fail / hygiene hole / compliance miss / template (hand off)
4. **Severity** — no DMARC or `+all` blocks inbox placement

## Worked example

> **Observe:** one SPF with `+all`; DKIM TXT present; no DMARC; marketing and
> password-resets share `example.com`.
> **Interpret:** anyone can spoof; Gmail/Yahoo bulk will fail; a campaign
> complaint can sink transactional mail.
> **Classify:** auth fail + domain mixing.
> **Fix:** SPF `-all` (or `~all` while warming), DMARC `p=none`+`rua` then
> tighten, split transactional vs marketing domains — apply DNS only after approval.

---

## Phase 0 — Detect sending setup  [HIGH freedom]

- Provider: Resend / Postmark / SES / SendGrid / Mailgun / SMTP
- Sending domain(s) and DNS host
- Transactional vs marketing — **they should not share a domain**
- Where templates live (hand content issues to `design-email`)

---

## Phase 1 — Authentication (pass/fail gate)  [HIGH freedom; headers not DNS-only]

**SPF** — Authorizes the provider. Exactly one record. Under 10 DNS lookups.
Not `+all`.

**DKIM** — Signing on at the provider; public key in DNS; **real message
headers** signed (not DNS-only). 2048-bit keys.

**DMARC** — Record present. `p=none` (monitor) vs `quarantine` / `reject`.
`rua` reporting address. Gmail/Yahoo require DMARC for bulk senders.
**Alignment:** visible From domain matches SPF/DKIM domains. Misalignment
passes raw SPF/DKIM and still fails DMARC.

**PTR / dedicated IP** — if self-hosted or dedicated: PTR set, warmed, not
blocklisted.

---

## Phase 2 — Reputation & hygiene  [HIGH freedom]

**Bounces** — Hard bounces via webhook → suppression list honored on every send.

**Complaints** — Feedback loops / provider webhooks → immediate suppress.

**List hygiene (marketing)** — Opted-in only (cross-check
`plan-privacy-compliance`). No purchased lists. Inactive addresses removed.

**Sending patterns** — Warm new domains. Separate transactional vs marketing
so a campaign complaint does not sink password resets.

**Content flags** — Image-only, spammy phrasing, broken links, missing
plain-text → `design-email`.

---

## Phase 3 — Compliance footer  [HIGH freedom]

- Marketing: functional unsubscribe **and** one-click `List-Unsubscribe`
  headers (Gmail/Yahoo bulk). Transactional is exempt only if it is genuinely
  transactional.
- Physical address + sender ID — CAN-SPAM (US) and Japan 特定電子メール法
  for advertising mail.
- Unsubscribes honored on the *next* send.

---

## Definition of Done

- [ ] Streams identified and separated
- [ ] SPF / DKIM (real headers) / DMARC + alignment scored
- [ ] Bounce + complaint → suppression list
- [ ] Consent + inactive policy noted
- [ ] Warming addressed if cold
- [ ] One-click unsubscribe on marketing; legal footer present
- [ ] Template flags handed to `design-email`
- [ ] DNS/config applied only after approval

## Self-critique before applying DNS  [LOW freedom — do not skip]

1. **Real headers** — DKIM scored from a sent message, not DNS-only
2. **Alignment** — From domain matches SPF/DKIM domains
3. **Streams split** — marketing must not share the transactional domain
4. **Right owner** — markup/copy → `design-email`
5. **Apply only on approval**

## Output format

1. **Auth table** — SPF / DKIM / DMARC / alignment — pass/fail + exact fix
2. **Hygiene** — bounce / complaint / list / warming
3. **Compliance** — unsubscribe / footer / law
4. **Fix plan** — auth first, then hygiene, then compliance
5. Apply approved DNS/config; templates → `design-email`

## Related

- `design-email` — markup and copy
- `plan-privacy-compliance` — consent to collect / to mail
- `audit-analytics` — open/click instrumentation
- `backend-patterns` — webhook + suppression store
