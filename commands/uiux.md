---
description: "Route to the right UI/UX skill: design-system audit, UX heuristics, cosmetic polish, or semantic-data rewrite"
argument-hint: "[route, component, or symptom]"
---

# /uiux

> Discover existing system → detect rogue implementations → fix → validate.

This command is a thin entry point. Six skills cover the UI/UX surface — pick the right one for the goal:

- **`audit-responsive`** — linearized mobile layout at every breakpoint; desktop is not a wide phone. Prefer `/responsive-audit` when that is the symptom.
- **`audit-ui-states`** — empty / loading / error / offline / overflow matrix.
- **`audit-uiux-design-system`** — token compliance, component modularity, design drift.
- **`audit-ux`** — NN/g heuristics, microcopy, content patterns, user flows.
- **`enhance-web-ui`** — cosmetic polish, hierarchy, spacing, vague-but-visceral feedback.
- **`enhance-web-ux`** — replace generic AI-templated UI with semantic data.

Use `/uiux` to explicitly trigger UI/UX work. Otherwise, describe the symptom ("page feels AI-generated", "design drift", "tokens are inconsistent") and the right skill auto-fires.
