---
name: design-frontend
description: Create distinctive, production-grade frontend interfaces. Use when building web components, pages, dashboards, or beautifying UI. Avoids generic AI aesthetics.
license: MIT
---

# Frontend Design Skill

> Discover design systems, respect existing patterns, create beautiful interfaces.

---

## Phase 1: Design System Discovery (MANDATORY)

**Before writing ANY frontend code:**

### 1.1 Find Design System Files
```
Glob: **/*design-system*.{md,ts,css}
Glob: **/tokens*.{ts,json}
Glob: **/components/ui/**
Glob: **/_*README*
```

### 1.2 Extract & Document Tokens
| Category | Find | Examples |
|----------|------|----------|
| Typography | Sizes, weights | `text-xs`, `font-medium` |
| Spacing | Padding, gaps | `p-4`, `gap-2` |
| Colors | Palette, semantic | `bg-emerald-50` |
| Borders | Radius, styles | `rounded-sm` |
| Animations | Durations | `duration-200` |

### 1.3 Find Forbidden Patterns
```bash
grep -r "NEVER\|FORBIDDEN\|❌" docs/ README*
```

### 1.4 Verification Statement (REQUIRED)
```
"Design System Discovery:
├─ Found: [design system path]
├─ Typography min: [e.g., text-xs]
├─ Radius standard: [e.g., rounded-sm]
├─ Forbidden: [list patterns]
└─ Reusing: [existing components]"
```

---

## Phase 2: Implementation Standards

### Typography Minimums
| Context | Minimum | Usage |
|---------|---------|-------|
| Body | `text-sm` (14px) | Primary content |
| Captions | `text-xs` (12px) | Labels, hints |
| Compact | `text-[10px]` | Dense dashboards only |

**Never use** `text-[8px]` or `text-[9px]` for readable content.

### Accessibility Requirements
| Check | Requirement |
|-------|-------------|
| Touch targets | ≥44×44px |
| Contrast | 4.5:1 text, 3:1 UI |
| Keyboard | `tabIndex`, focus styles |
| Motion | `prefers-reduced-motion` |

### Quick Reference
```
Typography: text-xs=12px, text-sm=14px, text-base=16px
Spacing: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px
```

---

## Phase 3: Quality Checklist

```
[ ] Uses design system tokens (no hardcoded values)
[ ] Extends existing components (no duplicates)
[ ] Typography ≥ text-xs for readable content
[ ] Touch targets ≥ 44px
[ ] Focus states visible
[ ] prefers-reduced-motion respected
```

### Common Fixes
| Issue | Fix |
|-------|-----|
| Tiny text | `text-[9px]` → `text-xs` |
| Bold weights | `font-bold` → `font-medium` |
| Large radius | `rounded-lg` → `rounded-sm` |
| Spin animation | `animate-spin` → `animate-pulse` |

---

## Anti-Generic Checklist

Avoid these AI clichés:
- [ ] Inter/Roboto/Arial fonts
- [ ] Purple gradients on white
- [ ] Cookie-cutter card layouts
- [ ] Same choices every generation

---

> **Remember:** The codebase's design system is the source of truth. Search before creating. Reuse before reinventing.
