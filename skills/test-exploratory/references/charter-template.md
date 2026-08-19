# SBTM charter template (test-exploratory)

One charter = one time-boxed session + one identity. Copy a row, fill it, debrief.

## Charter card

| Field | Value |
|:------|:------|
| Charter | e.g. Guest: public routes + auth walls + public forms |
| Identity | guest / authed / post-logout |
| Session name | `explore-guest` / `explore-authed` / `explore-post-logout` |
| Time box | 30–45 min (stop when the box ends; record leftovers) |
| Target URL | non-prod only |
| In scope | routes / areas |
| Out of scope | MFA walls, paid checkout, production data, WCAG (→ `audit-accessibility`) |
| Stop when | time box ends **or** high-blast-radius areas done |

## Debrief (required)

- Areas covered / not covered
- Real bugs (id list)
- Flakes re-run? (yes/no)
- What was **not** reached and why

## Suggested charters (run both identities)

1. **Guest — walls & public surface** — deep-link protected URLs, public forms (valid/empty/junk), login entry.
2. **Authed — mutate & navigate** — every control on high-blast-radius pages, double-submit, back/forward, refresh mid-flow.
3. **Post-logout — isolation** — fresh session, no profile; hit last authed URL + Back; confirm no private cache/cookies/`sessionStorage`.
