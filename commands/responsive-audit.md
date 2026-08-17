---
description: "Responsive layout & IA audit — desktop is not a wide phone"
argument-hint: "[path or route scope]"
---

# /responsive-audit

Thin entry for the **`audit-responsive`** skill. Optional scope:
`/responsive-audit src/pages/dashboard`.

Finds and fixes linearized mobile layouts at every breakpoint — stacked,
left-aligned, full-width regardless of screen size, with no hierarchy or
grouping. **Desktop is not a wide phone.**

Do **not** route this to `design-mobile-first` (touch / mobile-up) or
`audit-ux-journeys` (cross-page IA). Those are neighbors, not this job.

If the user said `/uiux` and the symptom is "1440 looks like a stretched
phone", use this skill.
