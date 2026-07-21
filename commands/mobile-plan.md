---
description: "App Store / Play submission-readiness audit — plan only, no manifest edits until approved"
argument-hint: "[app path or scope]"
---

# Mobile Readiness Plan

Run the **`plan-mobile-readiness`** skill: audit a Capacitor/React Native app
for App Store and Play submission readiness (privacy manifest, data-safety,
permissions, metadata), then produce a readiness plan. **Audit and plan only —
edit no manifests until the plan is approved.**

Emit findings ranked by severity (submission blockers first) with a phased
checklist. After approval, execute with `plan-capacitor-hardening` and the
relevant mobile skills.

The full playbook lives in the **`plan-mobile-readiness`** skill.
