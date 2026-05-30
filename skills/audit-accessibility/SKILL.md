---
name: audit-accessibility
description: >
  Automated WCAG 2.2 accessibility audit using Playwright browser MCP to crawl every page,
  inject axe-core via browser_evaluate, test keyboard navigation, check color contrast,
  ARIA labels, heading hierarchy, form labels, and focus management. Cross-references
  Sentry for assistive-technology-related errors, researches current WCAG guidelines via
  Firecrawl, and produces a structured PASS/FAIL compliance report per criterion.
  Works with any project — auto-detects pages from the route manifest.
  Use when asked to: "audit accessibility", "check a11y", "WCAG audit", "check keyboard nav",
  "test screen reader", "accessibility compliance", "ADA compliance check",
  "run a11y audit", "check color contrast", or "audit for disabilities".
---

# Accessibility Audit

Automated WCAG 2.2 accessibility audit: axe-core scanning, keyboard navigation testing,
color contrast verification, ARIA compliance, and assistive technology error analysis.
Works with **any project** — auto-detects pages from the codebase route structure.

## Critical Rules

> **Always use the `browser-anti-stall` protocol** when using Playwright browser MCP tools.

> **Test every publicly reachable page.** Accessibility bugs on obscure pages still affect real users.

> **Keyboard-only testing is non-negotiable.** If a feature cannot be operated without a mouse, it fails WCAG 2.1.1 regardless of what axe-core says.

> **Automated tools catch ~30-40% of a11y issues.** Always supplement axe-core with manual checks (heading order, focus management, meaningful link text, reading order).

> **Use concrete WCAG success criteria IDs.** "Color contrast is bad" is not actionable. "Fails WCAG 2.2 SC 1.4.3 (Contrast Minimum) — foreground #777 on background #fff = 4.48:1, needs 4.5:1" is.

---

## Phase 0: Auto-Detect Pages and Components

### 0a. Discover Route Structure

```
Glob("**/app/**/page.{tsx,jsx,ts,js}")
Glob("**/pages/**/*.{tsx,jsx,ts,js}")
Glob("**/src/routes/**/*.{tsx,jsx,svelte,vue}")
```

### 0b. Find the App URL

```
Grep(pattern: "NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_BASE_URL|VITE_APP_URL|APP_URL|localhost", glob: ".env*")
```

If no production URL, default to `http://localhost:3000` (or detected dev server port).

### 0c. Detect CSS Framework and Component Library

```
Grep(pattern: "tailwindcss|@chakra-ui|@mui|@radix-ui|shadcn|bootstrap|bulma", glob: "package.json")
```

This matters because each framework has different a11y defaults (e.g., Radix primitives are accessible by default, custom components may not be).

### 0d. Detect Existing a11y Tooling

```
Grep(pattern: "axe-core|@axe-core|eslint-plugin-jsx-a11y|pa11y|lighthouse|@testing-library", glob: "package.json")
Grep(pattern: "aria-|role=|tabIndex|sr-only|visually-hidden", glob: "*.{tsx,jsx,vue,svelte}", output_mode: "count")
```

Record:
- `APP_URL` — base URL for testing
- `PAGES` — list of routes to audit
- `CSS_FRAMEWORK` — Tailwind, MUI, Chakra, etc.
- `COMPONENT_LIB` — Radix, shadcn, MUI, Headless UI, etc.
- `EXISTING_A11Y_TOOLS` — what's already in place
- `ARIA_USAGE_COUNT` — rough indicator of a11y awareness in the codebase

---

## Phase 1: Research Current WCAG Guidelines

### 1a. Firecrawl Research

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "WCAG 2.2 success criteria checklist web accessibility 2026",
  "limit": 5
})
```

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "axe-core automated accessibility testing best practices common false positives",
  "limit": 5
})
```

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<CSS_FRAMEWORK> <COMPONENT_LIB> accessibility best practices common issues",
  "limit": 5
})
```

Scrape the 2-3 most authoritative results:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<BEST_RESULT_URL>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

### 1b. Framework-Specific a11y Docs (Context7)

If the project uses a component library, fetch its accessibility documentation:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<COMPONENT_LIB e.g. radix-ui or chakra-ui>"
})
```

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<RESOLVED_ID>",
  "query": "accessibility ARIA keyboard navigation focus management"
})
```

---

## Phase 2: Automated Scanning (axe-core via Playwright)

### 2a. Navigate to Each Page

For each page discovered in Phase 0a:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<APP_URL><ROUTE>"
})
```

Apply the `browser-anti-stall` protocol: wait 2s, snapshot, verify page loaded.

### 2b. Inject and Run axe-core

Use `browser_evaluate` to inject axe-core from CDN and run a full scan:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "await new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; script.onload = resolve; script.onerror = reject; document.head.appendChild(script); }); const results = await axe.run(); return JSON.stringify({ violations: results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target[0]) })), passes: results.passes.length, incomplete: results.incomplete.length, inapplicable: results.inapplicable.length });"
})
```

For each violation returned, record:
- **Rule ID** (e.g., `color-contrast`, `image-alt`, `label`)
- **Impact** (critical, serious, moderate, minor)
- **WCAG criteria** mapped from the rule
- **Affected elements** (CSS selectors)
- **Count** of affected nodes

### 2c. Check Specific WCAG Categories Manually

axe-core cannot catch everything. For each page, also check:

**Heading Hierarchy (WCAG 1.3.1):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "return JSON.stringify(Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 50) })));"
})
```

Verify: only one `h1`, headings don't skip levels (h1 -> h3 without h2).

**Image Alt Text (WCAG 1.1.1):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "return JSON.stringify(Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src.substring(img.src.lastIndexOf('/') + 1), alt: img.alt, hasAlt: img.hasAttribute('alt'), decorative: img.getAttribute('role') === 'presentation' || img.alt === '' })));"
})
```

Verify: all informative images have descriptive alt text, decorative images have `alt=""` or `role="presentation"`.

**Link Text (WCAG 2.4.4):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "return JSON.stringify(Array.from(document.querySelectorAll('a')).filter(a => { const text = (a.textContent || '').trim().toLowerCase(); return text === 'click here' || text === 'here' || text === 'read more' || text === 'learn more' || text === '' || text === 'link'; }).map(a => ({ href: a.href, text: (a.textContent || '').trim(), ariaLabel: a.getAttribute('aria-label') })));"
})
```

Flag generic link text ("click here", "read more", empty links without aria-label).

**Form Labels (WCAG 1.3.1, 4.1.2):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "return JSON.stringify(Array.from(document.querySelectorAll('input,select,textarea')).map(el => ({ type: el.type, name: el.name, id: el.id, hasLabel: !!document.querySelector('label[for=\"' + el.id + '\"]'), ariaLabel: el.getAttribute('aria-label'), ariaLabelledBy: el.getAttribute('aria-labelledby'), placeholder: el.placeholder })));"
})
```

Verify: every form control has an associated `<label>`, `aria-label`, or `aria-labelledby`.

**Language Attribute (WCAG 3.1.1):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_evaluate", arguments: {
  "javascript": "return JSON.stringify({ htmlLang: document.documentElement.lang, htmlDir: document.documentElement.dir });"
})
```

Verify: `<html>` has a valid `lang` attribute.

### 2d. Take Evidence Screenshots

For each page, capture a screenshot as visual evidence:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_take_screenshot", arguments: {})
```

---

## Phase 3: Keyboard Navigation Testing

### 3a. Tab Order Test

For each page, test that all interactive elements are reachable via Tab key:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<APP_URL><ROUTE>"
})
```

Press Tab repeatedly and snapshot after each press to track focus movement:

```json
CallMcpTool(server: "user-playwright", toolName: "browser_press_key", arguments: {
  "key": "Tab"
})
```

```json
CallMcpTool(server: "user-playwright", toolName: "browser_snapshot", arguments: {})
```

After each Tab, check:
- [ ] Focus is visible (there is a focus indicator on the active element)
- [ ] Focus order is logical (follows visual reading order)
- [ ] No focus trap (Tab eventually cycles back to the beginning or reaches the end)
- [ ] Skip links exist (if there is a large navigation area)

Repeat Tab at least 10-15 times per page to cover the main interactive elements.

### 3b. Interactive Element Testing

For each interactive component (dropdowns, modals, tabs, accordions):

**Enter/Space activation (WCAG 2.1.1):**
- Tab to the element
- Press Enter or Space
- Verify the action fires (snapshot to confirm state change)

**Escape to close (WCAG 2.1.1 for modals/dialogs):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_press_key", arguments: {
  "key": "Escape"
})
```

Verify: modals/dropdowns close, focus returns to the trigger element.

**Arrow key navigation (for tab panels, menus, listboxes):**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_press_key", arguments: {
  "key": "ArrowDown"
})
```

### 3c. Focus Management After State Changes

Test that focus is managed correctly after dynamic updates:
- After opening a modal: focus should move into the modal
- After closing a modal: focus should return to the trigger
- After deleting an item from a list: focus should move to the next item or a logical location
- After form submission: focus should move to a success/error message

---

## Phase 4: Cross-Check with Sentry

### 4a. Search for Assistive Technology Errors

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved aria OR screenreader OR voiceover OR talkback OR nvda OR jaws OR focus OR tabindex OR keyboard"
})
```

### 4b. Check for JavaScript Errors on Keyboard Interaction

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved keydown OR keyup OR keypress OR focusin OR focusout"
})
```

### 4c. Browser/Device Breakdown

Check if errors disproportionately affect specific browsers or devices that assistive technology users favor:

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "get_issue_tag_values", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "issueId": "<ISSUE_ID>",
  "tagKey": "browser"
})
```

---

## Phase 5: Static Code Analysis

Supplement runtime testing with static analysis of the source code.

### 5a. Missing ARIA Attributes

```
Grep(pattern: "onClick(?!.*role=)(?!.*tabIndex)", glob: "*.{tsx,jsx}")
```

Flag `div` or `span` elements with click handlers but no `role` or `tabIndex` — these are invisible to keyboard and screen reader users.

### 5b. Inaccessible Custom Components

```
SemanticSearch(query: "Where are custom interactive components defined (dropdowns, modals, tabs, accordions) that don't use a component library?", target_directories: [])
```

Custom components are the highest risk for a11y issues. Check each for:
- Proper ARIA roles (`role="dialog"`, `role="tabpanel"`, etc.)
- Keyboard event handlers (`onKeyDown`)
- Focus management (`useRef` + `.focus()`)
- ARIA states (`aria-expanded`, `aria-selected`, `aria-hidden`)

### 5c. Color Contrast in CSS/Tailwind

```
Grep(pattern: "text-gray-[345]|text-slate-[345]|text-zinc-[345]|text-neutral-[345]|color:\\s*#[789abc]", glob: "*.{tsx,jsx,css,scss}")
```

Light gray text on white background is the most common contrast failure. Flag files using light gray text colors for manual contrast checking.

---

## Phase 6: Report

```
═══════════════════════════════════════════════════════
   WCAG 2.2 ACCESSIBILITY AUDIT REPORT
   Project: <PROJECT_NAME>
   Date: <DATE>
   Standard: WCAG 2.2 Level AA
   Pages Tested: <COUNT>
═══════════════════════════════════════════════════════

## 1. EXECUTIVE SUMMARY

| Metric                    | Result          |
|---------------------------|-----------------|
| Pages tested              | X               |
| Total violations          | N               |
| Critical violations       | N               |
| Serious violations        | N               |
| axe-core rules passed     | N               |
| Keyboard navigable pages  | X/Y             |
| Overall compliance        | X% (estimated)  |

## 2. AXE-CORE SCAN RESULTS (per page)

| Page | Critical | Serious | Moderate | Minor | Pass | Score |
|------|----------|---------|----------|-------|------|-------|
| /    | ...      | ...     | ...      | ...   | ...  | A-F   |
| /about | ...   | ...     | ...      | ...   | ...  | A-F   |

## 3. VIOLATIONS BY WCAG CRITERION

| WCAG SC | Name | Level | Pages Affected | Elements | Impact | Status |
|---------|------|-------|----------------|----------|--------|--------|
| 1.1.1   | Non-text Content | A | ... | ... | ... | PASS/FAIL |
| 1.3.1   | Info and Relationships | A | ... | ... | ... | PASS/FAIL |
| 1.4.3   | Contrast (Minimum) | AA | ... | ... | ... | PASS/FAIL |
| 2.1.1   | Keyboard | A | ... | ... | ... | PASS/FAIL |
| 2.4.3   | Focus Order | A | ... | ... | ... | PASS/FAIL |
| 2.4.4   | Link Purpose | A | ... | ... | ... | PASS/FAIL |
| 2.4.7   | Focus Visible | AA | ... | ... | ... | PASS/FAIL |
| 3.1.1   | Language of Page | A | ... | ... | ... | PASS/FAIL |
| 4.1.2   | Name, Role, Value | A | ... | ... | ... | PASS/FAIL |

## 4. KEYBOARD NAVIGATION

| Page | Tab Order Logical | Focus Visible | No Focus Trap | Skip Link | Score |
|------|-------------------|---------------|---------------|-----------|-------|
| /    | ...               | ...           | ...           | ...       | A-F   |

## 5. INTERACTIVE COMPONENTS

| Component | Location | ARIA Roles | Keyboard Operable | Focus Managed | Score |
|-----------|----------|------------|-------------------|---------------|-------|
| Modal     | ...      | ...        | ...               | ...           | A-F   |
| Dropdown  | ...      | ...        | ...               | ...           | A-F   |

## 6. SENTRY ASSISTIVE TECHNOLOGY ERRORS

| Issue | Error Type | Events | Browser/AT | Fix Needed |
|-------|------------|--------|------------|------------|
| ...   | ...        | ...    | ...        | ...        |

## 7. STATIC CODE FINDINGS

| Pattern | Files | Count | Risk |
|---------|-------|-------|------|
| onClick without role/tabIndex | ... | N | High |
| Custom interactive without ARIA | ... | N | High |
| Low-contrast text classes | ... | N | Medium |

## 8. CRITICAL FINDINGS (Action Required)

P0 — Level A violations (legal risk):
1. [finding with WCAG SC, element, page, evidence]

P1 — Level AA violations (compliance gap):
1. [finding with WCAG SC, element, page, evidence]

P2 — Best practice improvements:
1. [finding with rationale]

## 9. RECOMMENDATIONS

| # | WCAG SC | Current | Recommended | Effort | Files to Change |
|---|---------|---------|-------------|--------|-----------------|
| 1 | ...     | ...     | ...         | S/M/L  | ...             |

═══════════════════════════════════════════════════════
```
