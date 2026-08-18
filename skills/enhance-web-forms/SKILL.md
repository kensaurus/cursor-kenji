---
name: enhance-web-forms
description: >
  Build or upgrade web forms to production quality: accessible structure,
  schema-driven validation, client↔server parity. Use when "improve this form",
  "form validation", "accessible form", "multi-step form", "form error
  handling", or "the form UX is bad".
license: MIT
---

# enhance-web-forms — Production-Quality Forms

Forms are where users hand you their data and where apps most often feel broken: unlabeled
fields, validation that fires on every keystroke, errors screen readers never announce, a
submit button that does nothing visible for three seconds, and no recovery when the request
fails. This skill fixes all of that on real forms in the repo.

> **A form is done when it is accessible, validated on both sides, gives feedback for every
> state, and recovers from failure.** Compile-clean is not done.

**Before any browser interaction, read `protocol-browser-anti-stall` and apply it.**

---

## Phase 0 — Detect the stack and inventory forms

```bash
cat package.json | grep -iE "react-hook-form|formik|@tanstack/react-form|final-form|zod|yup|valibot|superstruct"
rg -n "<form|onSubmit|useForm|handleSubmit" -g "*.{tsx,jsx,vue,svelte}" -l
```

Record: form library (or native), validation/schema library, UI/component library, and the
list of forms to enhance (auth, checkout, settings, contact, search, etc.). If there are no
forms, bow out.

---

## Phase 1 — Research + prioritize

Follow `/research`: Context7 for the detected form/validation library's current API;
Firecrawl for current form UX/a11y guidance dated to now. Prioritize forms by traffic and
risk (auth, payment, destructive actions first).

---

## Phase 2 — Accessible structure (the foundation)

For each form, verify/fix:

- **Every input has a programmatic label** — `<label htmlFor>` or `aria-label`; placeholder
  is **not** a label.
- **Correct input types + `autocomplete`** — `type="email|tel|url|number"`, `inputmode`,
  `autocomplete="email|current-password|cc-number|..."` for autofill.
- **Grouping** — related inputs in `<fieldset>` + `<legend>` (radio groups, address blocks).
- **Required + optional** — marked in text, not color alone; `required` / `aria-required`.
- **Keyboard + focus** — logical tab order, visible focus ring, Enter submits, no keyboard traps.
- **Error association** — each field error linked via `aria-describedby`; invalid fields get
  `aria-invalid="true"`; a form-level error **summary** with links to fields on submit failure.

```bash
rg -n "placeholder=" -g "*.{tsx,jsx}"        # placeholders masquerading as labels?
rg -n "aria-describedby|aria-invalid|htmlFor|aria-label" -g "*.{tsx,jsx}" -c
```

---

## Phase 3 — Validation (schema-driven, both sides)

- **Single schema as SSOT** — define validation once (zod/yup/valibot) and share it
  between client and server so rules can't drift. If the backend validates separately,
  reconcile the two so error shapes match.
- **Timing** — validate on **blur** and on **submit**, not on every keystroke; re-validate a
  field on change **after** it has errored once (so users see fixes immediately).
- **Messages** — specific and actionable ("Password needs 8+ characters", not "Invalid").
- **Server errors** — map field-level server errors back onto the right inputs; show
  form-level errors (e.g. "Email already registered") in the summary.

---

## Phase 4 — States & feedback (every one, no gaps)

Wire the full state machine for each form and submit:

| State | Required behavior |
|---|---|
| Idle | Clean, submit enabled/disabled per validity policy |
| Validating | Inline field feedback (see Phase 3 timing) |
| Submitting | Submit shows spinner/label swap + `disabled` + `aria-busy`; prevent double-submit |
| Success | Confirmation (toast/inline/redirect); reset or lock as appropriate |
| Error | Preserve entered values; surface the failure; keep the user's place; retry path |
| Empty/optional | Sensible defaults; empty state for dependent selects |

Also handle:
- **Multi-step** — progress indicator, per-step validation, back/forward preserves data,
  final review before submit.
- **Unsaved-changes guard** — warn on navigation away from a dirty form.
- **Autosave / draft** — for long forms, if the app already has a persistence pattern.
- **Micro-feedback** — subtle transitions on error/success via `design-motion` conventions
  (reduced-motion safe). Don't animate layout in a way that shifts fields.

---

## Phase 5 — Verify and report

- **playwright-cli:** walk each form — tab through it, submit empty (see the error summary +
  focus moves to first error), submit invalid, submit valid, force a server error. Check
  `console`. Confirm screen-reader names via the accessibility snapshot.
  Screenshots to `.playwright-mcp/`.
- **Build/typecheck/lint:** run the repo's commands.

```markdown
## Forms Enhancement — report
**Stack:** form=[..] · validation=[..] · UI=[..]
**Forms upgraded:** [list]
**Structure:** labels/types/autocomplete/fieldsets fixed on [N] forms
**Validation:** shared schema SSOT · client↔server parity · blur+submit timing
**States:** submitting/success/error/multi-step/unsaved-guard wired
**A11y:** error summary + aria-describedby/aria-invalid + focus management (evidence)
**Verification:** build ✓ · console clean ✓ · flows walked (screenshots [paths])
```

---

## Related

- `audit-accessibility` — deep WCAG audit (run to verify the a11y work)
- `audit-ux` — form usability heuristics, microcopy, cognitive load
- `audit-fe-api` — validate the submit request/response contract against the backend
- `backend-error-handling` — server-side validation + structured error responses
- `design-motion` — reduced-motion-safe micro-feedback for error/success
- `enhance-web-ux` — broader page/flow UX beyond the form itself
