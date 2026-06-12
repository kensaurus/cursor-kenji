---
name: workflow-launch-ready
description: >-
  Full launch preparation sweep for a new app or major release. One entry point
  that sequences enhance-web-seo, enhance-pwa, audit-bundle-size, audit-i18n,
  workflow-quality-gate, deploy-verify, and iterate-post-launch. Produces a
  launch checklist with all open items and a launch-readiness verdict. Use when
  "prepare for launch", "launch week", "everything before going live", "is the
  app launch-ready?", "pre-launch sweep", or "ship it to the world".
license: MIT
---

# workflow-launch-ready — Full Launch Preparation

The pre-launch sequence. Run once, get the complete picture across SEO, PWA,
performance, quality, and post-launch monitoring.

---

## Sweep sequence

```
1. SEO          → enhance-web-seo    (meta, OG, JSON-LD, sitemap, canonicals)
2. PWA          → enhance-pwa        (manifest, service worker, offline, install)
3. BUNDLE       → audit-bundle-size  (first-load JS ≤ 200 KB goal)
4. i18n         → audit-i18n         (if multi-locale: natural copy, no hardcoded strings)
5. QUALITY GATE → workflow-quality-gate (red-team + security + perf + unit tests)
6. DEPLOY       → deploy-verify      (post-deploy smoke after the release)
7. ITERATE      → iterate-post-launch (close loop on day-1 production signals)
```

Skip steps 2 (PWA) and 4 (i18n) if not applicable — note the skip in the checklist.

---

## Step 1: SEO (read enhance-web-seo)

> Read `~/.cursor/skills/enhance-web-seo/SKILL.md` and follow it.

Every public page needs: `<title>`, `meta description`, OG tags, canonical URL,
structured data (JSON-LD), and a sitemap entry.

---

## Step 2: PWA (read enhance-pwa)

> Read `~/.cursor/skills/enhance-pwa/SKILL.md` and follow it.

Required: Web App Manifest + service worker with offline fallback. Lighthouse
PWA score ≥ 90 before launch.

---

## Step 3: Bundle size (read audit-bundle-size)

> Read `~/.cursor/skills/audit-bundle-size/SKILL.md` and follow it.

Target: first-load JS ≤ 200 KB gzip. All routes lazy-loaded.

---

## Step 4: i18n (read audit-i18n — skip if single locale)

> Read `~/.cursor/skills/audit-i18n/SKILL.md` and follow it.

Priority: no hardcoded user-facing strings, natural copy in all supported
locales, correct date/number/currency formatting.

---

## Step 5: Quality gate (read workflow-quality-gate)

> Read `~/.cursor/skills/workflow-quality-gate/SKILL.md` and follow it.

This step runs test-red-team, audit-security, audit-performance, and test-unit
internally. A NO-GO verdict from this step blocks launch.

---

## Step 6: Deploy & smoke (read deploy-verify)

> Read `~/.cursor/skills/deploy-verify/SKILL.md` and follow it.

Run immediately after the production deploy. Confirm no new Sentry errors,
schema is healthy, and critical flows work.

---

## Step 7: Day-1 iteration loop (read iterate-post-launch)

> Read `~/.cursor/skills/iterate-post-launch/SKILL.md` and follow it.

Schedule this 24–48 hours after launch. Pull first real-user signals and
prioritize the first fix pass.

---

## Launch checklist output

```markdown
## Launch Readiness — [App] — [Date]

### Verdict: LAUNCH-READY / LAUNCH WITH CONDITIONS / NOT READY

| Step | Status | Open items |
|------|--------|------------|
| SEO | ✅ / ⚠️ / ❌ | [list] |
| PWA | ✅ / ⚠️ / ❌ / skipped | [list] |
| Bundle size | ✅ / ⚠️ / ❌ | [X KB] |
| i18n | ✅ / ⚠️ / skipped | [list] |
| Quality gate | GO / NO-GO / CONDITIONAL | [see gate report] |
| Deploy smoke | ✅ / ❌ | [notes] |
| Day-1 plan | scheduled / not yet | [date] |

### Blockers (must fix before launch)
[list]

### Post-launch backlog (fix within 48 h)
[list]
```
