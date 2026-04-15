---
name: audit-uiux-design-system
description: >
  Audit webpage UI/UX coherency and modular implementation against a design system for any
  project. Auto-detects CSS framework (Tailwind v3/v4, CSS Modules, Styled Components),
  component library (shadcn, Radix, MUI, Chakra), and icon library. Uses browser MCP tools
  for live visual verification, Firecrawl for current design system and WCAG best practices,
  and Context7 for component library documentation. Use when reviewing design consistency,
  checking component modularity, auditing color/typography/spacing tokens, validating
  accessibility (WCAG), or when the user mentions design drift, UI inconsistency, design
  system compliance, visual coherency, or component architecture review.
  Covers React/Next.js/Vue/Svelte with Tailwind CSS, CSS Modules, or Styled Components.
---

# UI/UX Design System Audit Skill

Systematic audit of frontend UI/UX coherency, design token compliance, component modularity,
and accessibility against industry standards.

**Before ANY browser interaction, read the `browser-anti-stall` skill and apply its rules
to every step.** That skill lives at `~/.cursor/skills/browser-anti-stall/SKILL.md`.

---

## Step 0: Auto-Detect Design System

Before auditing, discover the project's design system from its source code.

### 0a. Detect CSS Framework

Read `package.json` and configuration files:

| Signal | Technology |
|--------|-----------|
| `tailwindcss` v3 + `tailwind.config.*` | Tailwind CSS v3 |
| `tailwindcss` v4 + `@theme` in CSS | Tailwind CSS v4 |
| `*.module.css` files | CSS Modules |
| `styled-components` or `@emotion/styled` | CSS-in-JS |
| `@chakra-ui/react` | Chakra UI |
| `@mui/material` | Material UI |
| `@mantine/core` | Mantine |

### 0b. Detect Component Library

```
Glob: **/components/ui/*.tsx        → shadcn/ui primitives
Glob: **/components/ui/*.vue        → Vue component library
Glob: **/components/ui/*.svelte     → Svelte component library
Grep: pattern "from '@radix-ui" glob "*.{ts,tsx}" output_mode "count"
Grep: pattern "from 'lucide-react" glob "*.{ts,tsx}" output_mode "count"
Grep: pattern "from '@heroicons" glob "*.{ts,tsx}" output_mode "count"
Grep: pattern "from 'react-icons" glob "*.{ts,tsx}" output_mode "count"
```

### 0c. Find Design Tokens

```
Glob: **/tailwind.config.*         → Tailwind v3 tokens
Glob: **/app/globals.css           → Tailwind v4 @theme / CSS custom properties
Glob: **/styles/tokens.*           → Token files
Glob: **/theme.*                   → Theme configuration
Grep: pattern "--primary|--secondary|--accent|--muted" glob "*.css"
```

Read the token source file to extract: colors, spacing, typography, radii, shadows.

### 0d. Discover Forbidden Patterns

```
Grep: pattern "NEVER|FORBIDDEN|DO NOT" glob "**/*README*" -i
```

Check project README and design docs for explicit style rules.

### 0e. Record Discovery

```
DESIGN SYSTEM DISCOVERY:
- CSS framework: [Tailwind v3/v4 / CSS Modules / Styled Components / etc.]
- Component library: [shadcn/ui / Radix / MUI / Chakra / custom]
- Icon library: [Lucide / Heroicons / react-icons / mixed]
- Token source: [file path]
- Colors defined: [count]
- Typography scale: [list]
- Spacing base: [4px / 8px / etc.]
- Border radius: [list]
- Shadow levels: [list]
- Dark mode: [YES — class/media / NO]
- Forbidden patterns: [list from README]
```

---

## Step 1: Research Design System Best Practices

### 1a. Context7 — Component Library Docs

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<DETECTED_COMPONENT_LIBRARY>",
  "query": "component variants accessibility patterns"
})
```

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<RESOLVED_ID>",
  "query": "component composition variants accessibility focus management"
})
```

Also fetch CSS framework docs (Tailwind, etc.).

### 1b. Firecrawl — Design System and Accessibility

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<COMPONENT_LIBRARY> design system audit best practices [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Additional searches:

| Topic | Query |
|-------|-------|
| WCAG | `WCAG 2.2 checklist web accessibility [current year]` |
| Token compliance | `design token audit Tailwind CSS consistency` |
| Component patterns | `React component modularity composition patterns` |
| Dark mode | `Tailwind dark mode implementation best practices` |

Scrape the most authoritative result:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<BEST_RESULT_URL>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

---

## Step 2: Token Compliance Audit

### 2a. Color Tokens

| Rule | Standard | How to Check |
|------|----------|-------------|
| Semantic naming | `primary`, `secondary`, `destructive`, `muted`, `accent` | No raw hex/rgb in components |
| CSS variables | `hsl(var(--primary))` or `oklch()` pattern | All colors reference variables |
| Foreground pairs | Every bg color has matching `*-foreground` | Text contrast maintained |
| Dark mode | All tokens have dark variant | `.dark` class or `@media` |
| Status colors | `success`, `warning`, `error`, `info` defined | Consistent across alerts, badges, toasts |

**Find violations with Grep:**

```
Grep: pattern "(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\([^v])" glob "*.tsx" — raw color values
Grep: pattern "\[(#|rgb|hsl)" glob "*.tsx" — Tailwind arbitrary colors
```

### 2b. Typography Tokens

| Rule | Standard |
|------|----------|
| Font families | Max 2-3 families defined in theme |
| Size scale | Consistent scale (`text-sm`, `text-base`, `text-lg`) |
| Weight scale | Limited set (`font-normal`, `font-medium`, `font-semibold`, `font-bold`) |
| Heading hierarchy | `h1` > `h2` > `h3` in visual weight AND DOM order |
| No arbitrary sizes | No `text-[14px]` when `text-sm` exists |

```
Grep: pattern "text-\[" glob "*.tsx" — arbitrary font sizes
Grep: pattern "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)" glob "*.tsx" output_mode "count"
```

### 2c. Spacing Tokens

| Rule | Standard |
|------|----------|
| Base unit | 4px grid (Tailwind default) |
| Consistent gaps | Same spacing for same contexts |
| No arbitrary values | No `p-[13px]` when `p-3` exists |

```
Grep: pattern "(p|m|gap|space)-\[" glob "*.tsx" — arbitrary spacing
```

### 2d. Borders, Radii, Shadows

```
Grep: pattern "rounded-\[" glob "*.tsx" — arbitrary border-radius
Grep: pattern "shadow-" glob "*.tsx" output_mode "count" — shadow usage distribution
```

---

## Step 3: Component Modularity Audit

### 3a. Component Health

| Rule | Standard |
|------|----------|
| Single responsibility | One component = one purpose |
| Composable | Small pieces compose into larger ones |
| Reusable | Same UI = same component everywhere |
| Consistent props | `variant`, `size`, `disabled`, `className` across all |
| Variants pattern | `cva()` or similar for style variants |

### 3b. Find Duplicate Components

```
Grep: pattern "<button " glob "*.tsx" — raw buttons outside ui/ (should use Button component)
Grep: pattern "<input " glob "*.tsx" — raw inputs (should use Input component)
Grep: pattern "<select " glob "*.tsx" — raw selects
Grep: pattern "<a " glob "*.tsx" — raw anchors (should use Link component)
```

Exclude `components/ui/*` from these searches — those are the legitimate primitives.

### 3c. Check Component Consistency

```
Grep: pattern "function (Button|Input|Modal|Dialog|Card)" glob "*.tsx" output_mode "files_with_matches"
```

Multiple files defining the same component name = duplication.

### 3d. Mixed Icon Libraries

```
Grep: pattern "from .lucide-react" glob "*.tsx" output_mode "count"
Grep: pattern "from .@heroicons" glob "*.tsx" output_mode "count"
Grep: pattern "from .react-icons" glob "*.tsx" output_mode "count"
```

If multiple icon libraries detected, flag as inconsistency.

---

## Step 4: Live Visual Verification (Browser MCP)

For each major page/route, perform live verification using browser MCP tools.

### 4a. Navigate and Capture

```
browser_navigate → http://localhost:<PORT>/<ROUTE>
browser_wait_for → { time: 2 }
browser_snapshot → verify content rendered
browser_take_screenshot → visual evidence
browser_console_messages → check for errors
```

### 4b. Check Per Page

| Check | How |
|-------|-----|
| Token compliance | Screenshot — look for inconsistent colors, spacing |
| Component reuse | Snapshot — are shared primitives used? |
| Accessibility | Snapshot — labels, aria attributes, roles |
| Console errors | `browser_console_messages` — hydration errors, missing CSS vars |
| Layout shift | Snapshot before/after interaction — does content jump? |
| Dark mode | Navigate, toggle dark mode, re-screenshot |

### 4c. Responsive Check

Test at three viewport widths:

```
browser_navigate → page URL
// Desktop (1280px)
browser_take_screenshot → evidence

// Tablet (768px) — resize by navigating with viewport param or checking responsive classes
browser_take_screenshot → evidence

// Mobile (375px)
browser_take_screenshot → evidence
```

### 4d. Focus and Keyboard Navigation

```
browser_snapshot → identify interactive elements
browser_click → tab through elements
browser_snapshot → verify focus ring visible
```

---

## Step 5: Accessibility Audit (WCAG AA)

### 5a. Automated Checks

| Rule | How to Check |
|------|-------------|
| Color contrast | 4.5:1 text, 3:1 large text/UI — inspect via screenshot |
| Semantic HTML | `Grep: "<nav>|<main>|<section>|<article>|<aside>" glob "*.tsx"` |
| Headings | `Grep: "<h[1-6]" glob "*.tsx"` — sequential, no skips |
| Labels | `Grep: "<(input|Input)" glob "*.tsx" -C 3` — verify associated label |
| Alt text | `Grep: "<(img|Image)" glob "*.tsx"` then `Grep -v "alt="` for violations |
| Focus visible | Live check via browser MCP — tab through |
| Keyboard nav | All actions keyboard accessible |
| ARIA | `Grep: "aria-" glob "*.tsx" output_mode "count"` |
| Reduced motion | `Grep: "prefers-reduced-motion|motion-safe|motion-reduce" glob "*.tsx"` |

### 5b. Click Handler Violations

```
Grep: pattern "<div.*onClick|<span.*onClick" glob "*.tsx" — should be button
```

Clickable divs/spans are accessibility violations — should use `<button>` or `<a>`.

---

## Step 6: Nielsen's 10 Usability Heuristics

Assess via browser MCP live navigation:

| # | Heuristic | What to Check |
|---|-----------|---------------|
| 1 | Visibility of system status | Loading indicators, progress bars, active nav states |
| 2 | Match real world | Natural language, familiar icons, logical grouping |
| 3 | User control and freedom | Undo, cancel flows, back navigation, close modals |
| 4 | Consistency and standards | Same component for same action, platform conventions |
| 5 | Error prevention | Confirmation dialogs, input validation, disabled states |
| 6 | Recognition over recall | Visible options, search, breadcrumbs, clear labels |
| 7 | Flexibility and efficiency | Keyboard shortcuts, bulk actions, filters |
| 8 | Aesthetic and minimal | No clutter, progressive disclosure, whitespace |
| 9 | Help recover from errors | Clear error messages, inline validation, suggested fixes |
| 10 | Help and documentation | Tooltips, help text, onboarding, contextual help |

---

## Step 7: Animation and Dark Mode

### Animations

| Rule | Standard |
|------|----------|
| Duration scale | `150ms`, `200ms`, `300ms`, `500ms` |
| Easing | Consistent (`ease-in-out` default) |
| Reduced motion | `motion-safe:` prefix or `prefers-reduced-motion` |
| No layout shift | Transitions don't cause CLS |

```
Grep: pattern "duration-[0-9]+" glob "*.tsx" output_mode "count"
Grep: pattern "transition-" glob "*.tsx" output_mode "count"
```

### Dark Mode

| Rule | Standard |
|------|----------|
| All tokens switch | CSS variables change in dark mode |
| No hardcoded colors | No `bg-white`, `text-black` — use semantic tokens |
| Borders visible | In both modes |
| Contrast | Meets WCAG in BOTH light and dark |

```
Grep: pattern "(bg-white|bg-black|text-white|text-black)" glob "*.tsx" output_mode "count"
```

---

## Output Template

```markdown
## UI/UX Design System Audit Report

**Date:** [date]
**Framework:** [detected]
**CSS:** [Tailwind v3/v4 / CSS Modules / etc.]
**Component library:** [shadcn / Radix / MUI / custom]
**Pages Audited:** [count]
**Issues Found:** [count]

---

### Design Token Compliance

| Token Category | Defined | Violations | Status |
|----------------|---------|------------|--------|
| Colors | [count] | [count] raw hex/rgb | [pass/warn/fail] |
| Typography | [count] | [count] arbitrary sizes | [pass/warn/fail] |
| Spacing | [count] | [count] arbitrary values | [pass/warn/fail] |
| Radii | [count] | [count] arbitrary radii | [pass/warn/fail] |
| Shadows | [count] | [count] inconsistent | [pass/warn/fail] |

---

### Component Health

| Component | Used In | Variants | Issues |
|-----------|---------|----------|--------|
| Button | [N] files | [N] | [notes] |
| Input | [N] files | [N] | [notes] |
| Card | [N] files | [N] | [notes] |

---

### Duplicate / Redundant Components

| Pattern | Locations | Recommendation |
|---------|-----------|----------------|
| Raw `<button>` | [files] | Use `<Button>` from `components/ui` |
| Custom modal | [file] | Use `<Dialog>` from `components/ui` |

---

### Accessibility Score

| Criteria | Status | Issues |
|----------|--------|--------|
| Color contrast | [pass/warn/fail] | [details] |
| Semantic HTML | [pass/warn/fail] | [details] |
| Keyboard navigation | [pass/warn/fail] | [details] |
| Focus management | [pass/warn/fail] | [details] |
| Alt text | [pass/warn/fail] | [details] |
| ARIA usage | [pass/warn/fail] | [details] |

---

### Nielsen's Heuristics Assessment

| # | Heuristic | Score (1-5) | Notes |
|---|-----------|-------------|-------|
| 1 | System status visibility | [1-5] | [notes] |
| 2 | Real world match | [1-5] | [notes] |
| 3 | User control and freedom | [1-5] | [notes] |
| 4 | Consistency and standards | [1-5] | [notes] |
| 5 | Error prevention | [1-5] | [notes] |
| 6 | Recognition over recall | [1-5] | [notes] |
| 7 | Flexibility and efficiency | [1-5] | [notes] |
| 8 | Aesthetic and minimal | [1-5] | [notes] |
| 9 | Error recovery | [1-5] | [notes] |
| 10 | Help and documentation | [1-5] | [notes] |

---

### Research Findings Applied
- [Pattern from research]: [how it applies]
- [WCAG requirement]: [gap identified]

---

### Critical Issues (Must Fix)

#### 1. [Component/Page] — [Issue]
- **Problem:** [description]
- **Impact:** [UX / accessibility / consistency]
- **Fix:** [specific code change]

---

### Page-by-Page Summary

| Page | Token Compliance | Components | A11y | Heuristics | Overall |
|------|-----------------|------------|------|------------|---------|
| / | pass | pass | warn | 4.2/5 | Good |
| /dashboard | warn | fail | fail | 3.1/5 | Needs Work |

---

### Next Steps

1. [ ] Fix critical accessibility issues: [list]
2. [ ] Replace raw HTML with shared components: [list]
3. [ ] Remove arbitrary token values: [list]
4. [ ] Add dark mode support: [components]
5. [ ] Add reduced motion support: [animations]
```
