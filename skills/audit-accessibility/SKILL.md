---
name: accessibility-audit
description: Comprehensive web accessibility audit for WCAG compliance. Use when checking accessibility, fixing a11y issues, screen reader compatibility, keyboard navigation, color contrast problems, ARIA attributes, focus management, or when user mentions "accessible", "WCAG", "ADA", "a11y", "screen reader", or "disability".
---

# Accessibility Audit Skill

Systematic methodology for auditing and fixing web accessibility issues per WCAG 2.1 AA standards.

## When to Use

- Accessibility compliance review
- Fixing reported a11y issues
- New feature accessibility check
- Before production deployment
- User complaint investigation

## CRITICAL: Check Existing First

**Before ANY accessibility changes, verify:**

1. **Check for existing a11y utilities:**
```bash
rg "aria-|role=|sr-only" --type tsx -l | head -10
ls -la @/components/ui/
```

2. **Check for existing skip links, focus traps:**
```bash
rg "skip.*content|FocusTrap|focus-visible" --type tsx
```

3. **Review existing patterns:**
- Check `@/components/ui/` for accessible primitives (Dialog, Button, etc.)
- Look for existing `aria-live` regions
- Verify if Radix UI or similar a11y-first library is in use

4. **Check for existing audit configs:**
```bash
cat .eslintrc* | grep -i a11y
cat package.json | grep -i "axe\|a11y\|accessibility"
```

**Why:** Many UI libraries (shadcn/ui, Radix, Headless UI) are already accessible. Don't duplicate what exists.

## Quick WCAG 2.1 AA Checklist

### Perceivable

| Criterion | Check | Common Fix |
|-----------|-------|------------|
| **1.1.1** Text Alternatives | All images have alt text | Add descriptive `alt` |
| **1.3.1** Info & Relationships | Semantic HTML used | Use proper elements |
| **1.4.1** Use of Color | Not only indicator | Add icons/text |
| **1.4.3** Contrast | 4.5:1 text, 3:1 UI | Darken/lighten colors |
| **1.4.4** Resize Text | Works at 200% zoom | Use relative units |

### Operable

| Criterion | Check | Common Fix |
|-----------|-------|------------|
| **2.1.1** Keyboard | All interactive via keyboard | Add `tabindex`, handlers |
| **2.1.2** No Trap | Can navigate away | Check modal focus |
| **2.4.1** Skip Links | Can skip nav | Add skip link |
| **2.4.3** Focus Order | Logical tab order | Fix DOM order |
| **2.4.7** Focus Visible | Clear focus indicator | Add focus styles |

### Understandable

| Criterion | Check | Common Fix |
|-----------|-------|------------|
| **3.1.1** Language | `lang` attribute set | Add to `<html>` |
| **3.2.1** On Focus | No surprise changes | Remove auto-submit |
| **3.3.1** Error ID | Errors identified | Add error messages |
| **3.3.2** Labels | Inputs have labels | Add `<label>` |

### Robust

| Criterion | Check | Common Fix |
|-----------|-------|------------|
| **4.1.1** Parsing | Valid HTML | Fix validation errors |
| **4.1.2** Name/Role | ARIA correct | Add proper ARIA |

## Common Issues & Fixes

### 1. Missing Form Labels

**Issue:** Input without associated label
```tsx
// Bad
<input type="email" placeholder="Email" />

// Good - explicit label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Good - implicit label
<label>
  Email
  <input type="email" />
</label>

// Good - aria-label for icon-only
<input type="search" aria-label="Search products" />
```

### 2. Color Contrast

**Minimum ratios:**
- Normal text: 4.5:1
- Large text (18px+ or 14px+ bold): 3:1
- UI components: 3:1

**Fix low contrast:**
```css
/* Before: 2.5:1 ratio - FAIL */
.text-light { color: #999; }

/* After: 4.5:1 ratio - PASS */
.text-light { color: #666; }

/* Or adjust background */
.card { background: #f5f5f5; }
.card .text-light { color: #555; }
```

**Tools:**
- Chrome DevTools: Inspect → Accessibility pane
- WebAIM Contrast Checker
- axe DevTools extension

### 3. Keyboard Navigation

**Every interactive element must be keyboard accessible:**

```tsx
// Bad - div acting as button
<div onClick={handleClick}>Click me</div>

// Good - semantic button
<button onClick={handleClick}>Click me</button>

// If must use div, add keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  Click me
</div>
```

### 4. Focus Management

**Visible focus indicator:**
```css
/* Remove default (bad) */
:focus { outline: none; }

/* Custom focus (good) */
:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

/* High contrast for dark backgrounds */
.dark :focus-visible {
  outline-color: #fff;
  box-shadow: 0 0 0 2px var(--focus-color);
}
```

**Modal focus trap:**
```tsx
import { FocusTrap } from '@headlessui/react'

<FocusTrap>
  <Dialog>
    {/* Focus stays within dialog */}
  </Dialog>
</FocusTrap>
```

### 5. Image Alt Text

**Decision tree:**
```tsx
// Decorative - empty alt
<img src="decoration.svg" alt="" role="presentation" />

// Informative - describe content
<img src="chart.png" alt="Sales increased 25% in Q4 2024" />

// Functional (link/button) - describe action
<a href="/home">
  <img src="logo.svg" alt="Go to homepage" />
</a>

// Complex - long description
<figure>
  <img src="org-chart.png" alt="Organization chart" aria-describedby="org-desc" />
  <figcaption id="org-desc">
    CEO at top, three VPs reporting, each with 2-4 direct reports...
  </figcaption>
</figure>
```

### 6. Dynamic Content Announcements

```tsx
// Announce loading/success/error to screen readers
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {status === 'loading' && 'Loading...'}
  {status === 'success' && 'Saved successfully'}
  {status === 'error' && `Error: ${errorMessage}`}
</div>

// For urgent announcements
<div aria-live="assertive" role="alert">
  {criticalError}
</div>
```

### 7. Skip Navigation Link

```tsx
// At top of page
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
>
  Skip to main content
</a>

// Main content
<main id="main-content" tabIndex={-1}>
  {/* Content */}
</main>
```

### 8. Accessible Modals/Dialogs

```tsx
// Use semantic dialog or library
<dialog open={isOpen}>
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
</dialog>

// Or with ARIA
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
```

**Modal requirements:**
- [ ] Focus moves to dialog on open
- [ ] Focus trapped within dialog
- [ ] Escape key closes
- [ ] Focus returns to trigger on close
- [ ] Background content inert

### 9. Tables

```tsx
// Data table with headers
<table>
  <caption>Q4 2024 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North</th>
      <td>$1.2M</td>
      <td>+15%</td>
    </tr>
  </tbody>
</table>

// Layout table (avoid if possible)
<table role="presentation">
  {/* No semantic table markup needed */}
</table>
```

### 10. Forms

**Accessible form pattern:**
```tsx
<form aria-labelledby="form-title">
  <h2 id="form-title">Contact Us</h2>
  
  {/* Required field indication */}
  <p className="text-sm">* Required fields</p>
  
  {/* Grouped fields */}
  <fieldset>
    <legend>Contact Information</legend>
    
    <div>
      <label htmlFor="name">
        Name <span aria-hidden="true">*</span>
      </label>
      <input
        id="name"
        required
        aria-required="true"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? 'name-error' : undefined}
      />
      {errors.name && (
        <p id="name-error" role="alert" className="text-red-600">
          {errors.name}
        </p>
      )}
    </div>
  </fieldset>
  
  <button type="submit">Submit</button>
</form>
```

## Screen Reader Testing

**VoiceOver (Mac):**
- `Cmd + F5` to enable
- `Ctrl + Option + arrows` to navigate
- `Ctrl + Option + U` for rotor

**NVDA (Windows):**
- `Insert + Space` for forms mode
- `H` for headings, `B` for buttons
- `Insert + F7` for elements list

**What to test:**
1. Page title announced
2. Landmarks navigable (main, nav, footer)
3. Headings in logical order
4. Links/buttons have clear labels
5. Form fields have labels
6. Errors announced
7. Dynamic content announced

## Automated Testing

```bash
# axe-core CLI
npx @axe-core/cli https://localhost:3000

# pa11y
npx pa11y https://localhost:3000

# Lighthouse
npx lighthouse https://localhost:3000 --only-categories=accessibility
```

**In tests:**
```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Audit Report Template

```markdown
# Accessibility Audit Report

## Summary
- **WCAG Level**: Targeting AA
- **Critical Issues**: X
- **Serious Issues**: X
- **Moderate Issues**: X

## Critical Issues (Must Fix)

### [A11Y-001] Form inputs missing labels
- **Location**: `/signup` form
- **WCAG**: 3.3.2 Labels or Instructions
- **Impact**: Screen reader users cannot identify inputs
- **Fix**: Add `<label>` elements with `htmlFor`

## Serious Issues

### [A11Y-002] Low color contrast
- **Location**: `.text-muted` class
- **WCAG**: 1.4.3 Contrast (Minimum)
- **Current ratio**: 3.2:1
- **Required**: 4.5:1
- **Fix**: Change color from #888 to #666

## Testing Performed
- [ ] Keyboard navigation
- [ ] Screen reader (VoiceOver)
- [ ] Color contrast check
- [ ] Automated scan (axe)
- [ ] 200% zoom test

## Recommendations
1. Add eslint-plugin-jsx-a11y
2. Include axe in CI pipeline
3. Add skip navigation link
```

## Quick Wins

- [ ] Add `lang` attribute to `<html>`
- [ ] Add skip navigation link
- [ ] Ensure all images have `alt`
- [ ] Add visible focus indicators
- [ ] Label all form inputs
- [ ] Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- [ ] Check color contrast
- [ ] Add `aria-live` for dynamic content
- [ ] Make modals trap focus
- [ ] Test with keyboard only
