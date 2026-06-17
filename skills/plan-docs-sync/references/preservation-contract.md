# Preservation Contract

Applies to **every phase**.

## Never do in this pass

- **Fabricate behavior** in proposed corrections. Docs describe what code does *now*, verified against source. Unknown → `[NEEDS VERIFICATION]`.
- **Guess** codebase facts. Every drift shows doc claim + code fact (path:line).
- **Delete docs** for features that still exist. Stale → correct, don't drop. Removal → proposal for approval.
- **Churn accurate prose** for style-only changes. Flag genuine mismatches only.
- **Pick silently** when two docs disagree — surface both + code truth.
- **Rewrite docs** in this pass. Corrections are proposed with before/after on approval.

## Buckets

- **Factual drift** — doc ≠ code
- **Subjective wording improvement** — accurate but could be clearer (lower priority)
