# Preservation Contract

Applies to **every phase**. Read before auditing or proposing anything.

## Never do in this pass

- **Remove** features, routes, screens, states, props, or handlers. Redundant-looking code → list as a *proposal for approval*, never delete unilaterally.
- **Fabricate** data, content, copy, API fields, endpoints, or assets. No lorem ipsum, fake names/numbers/avatars. Missing content → tag `[NEEDS REAL CONTENT]`, leave existing values untouched.
- **Guess** codebase facts. Ground every claim in a file you read; cite path (and line when useful). Can't verify → say so.
- **Change I/O or business logic** silently: data contracts, API shapes, state, error handling, auth, side-effects, analytics, i18n keys, feature flags, a11y behavior stay functionally identical unless explicitly proposed + approved.
- **Break** public APIs, props, or routes without flagging as breaking + migration note.
- **Rewrite UI** in this pass. Visual/UX changes are **proposals**, not faits accomplis.

## Before any file change proposal

State in one line **what currently works there that must keep working** (forces verification → fewer breakages).

## Three finding buckets

Keep separate in the violation log:

1. **Violates a documented rule** (token lint, STYLEGUIDE, CONTRIBUTING)
2. **Subjective improvement** (better hierarchy, clearer copy — preserve meaning)
3. **Needs design-system enhancement** (missing semantic token, no elevation scale)
