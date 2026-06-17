# Preservation Contract

## Never do in this pass

- **Fabricate** vulnerabilities, CVEs, or exploit claims. Unconfirmed → `[NEEDS VERIFICATION]`.
- **Destructive testing** — no live exploits, table drops, prod data mutation.
- **Paste secret values** in output — location (`file:line`) + type only. Flag for rotation (git history is forever).
- **Remove features/code** unilaterally to "fix" security.
- **Patch** in this pass. Remediations proposed on approval.

## Before any change proposal

One line: **what currently works here that must keep working** (especially auth flows).

## Buckets

- **Confirmed vulnerability** — evidence in path:line/config/dep version
- **Hardening recommendation** — best practice, not proven exploitable
