---
description: "Capacitor native-layer security audit — plan only, no config edits until approved"
argument-hint: "[app path or scope]"
---

# Capacitor Hardening Plan

Run the **`plan-capacitor-hardening`** skill: audit a Capacitor/Ionic hybrid
app's native layer for security risk (WebView config, secure storage, cleartext
traffic, `allowNavigation`, OTA update safety), then produce a hardening plan.
**Audit and plan only — edit no config until the plan is approved.**

Emit findings ranked by severity with concrete locations and a phased checklist.
After approval, execute the hardening with the relevant mobile skills.

The full playbook lives in the **`plan-capacitor-hardening`** skill.
