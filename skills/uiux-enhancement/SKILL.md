---
name: uiux-enhancement
description: Improve existing UI/UX with targeted, incremental enhancements. Use when user mentions "improve UI", "polish", "enhance", "fix usability", "user flow", "make intuitive", "loading states", "empty states", "mobile experience", or "micro-interactions".
---

# UI/UX Enhancement Skill

Systematic approach to improving existing interfaces without full redesigns. Focus on high-impact, incremental enhancements.

## When to Use

- Improving existing component/page usability
- Fixing user pain points
- Enhancing visual polish
- Optimizing user flows
- Adding micro-interactions
- Improving mobile experience

## CRITICAL: Check Existing First

**Before ANY UI enhancement, verify:**

1. **Check existing UI components:**
```bash
ls -la src/components/ui/             # @/components/ui primitives
rg "export.*function|export.*const" src/components/ui/ --type tsx
```

2. **Check for existing patterns in the codebase:**
```bash
rg "className.*hover:" --type tsx | head -20  # Hover patterns
rg "motion\." --type tsx | head -10  # Animation patterns
rg "Skeleton|Loading" --type tsx -l  # Loading states
```

3. **Check design system/theme:**
- Review `tailwind.config.ts` for existing colors/spacing
- Check `globals.css` for CSS variables
- Look for existing animation utilities

4. **Verify component doesn't already exist:**
```bash
rg "ErrorState|EmptyState|LoadingState" --type tsx
```

**Why:** Creating duplicate components fragments the design system. Always reuse existing primitives.

## Enhancement Framework

### 1. Quick Wins Assessment

**Before enhancing, identify:**
1. What's the core user task?
2. What friction exists?
3. What's working well (preserve it)?
4. What's the lowest-effort, highest-impact fix?

### 2. Visual Hierarchy Fixes

**Problems → Solutions:**

| Issue | Fix |
|-------|-----|
| Everything looks same priority | Increase size contrast (1.5-2x for headings) |
| CTAs don't stand out | Use accent color, increase padding |
| Content feels cluttered | Add whitespace (double current margins) |
| Users miss important info | Add visual indicators (icons, badges, color) |

**Typography Quick Fixes:**
```css
/* Before: flat hierarchy */
h1 { font-size: 24px; }
h2 { font-size: 20px; }

/* After: clear hierarchy */
h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; }
h2 { font-size: 20px; font-weight: 600; color: var(--muted); }
```

### 3. Interactive Feedback

**Every interaction needs feedback:**

```tsx
// Button states
<button className={cn(
  "transition-all duration-200",
  "hover:scale-[1.02] hover:shadow-md",
  "active:scale-[0.98]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "focus-visible:ring-2 focus-visible:ring-offset-2"
)}>
  Save
</button>

// Loading states
{isLoading ? (
  <span className="inline-flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    Saving...
  </span>
) : "Save"}

// Success feedback
{saved && (
  <motion.span
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-green-600"
  >
    ✓ Saved
  </motion.span>
)}
```

### 4. Form UX Improvements

**Common Issues → Fixes:**

| Issue | Enhancement |
|-------|-------------|
| Unclear what's required | Add asterisk + "Required" label |
| Errors after submit | Inline validation on blur |
| Long forms intimidating | Break into steps/sections |
| No progress indication | Add step indicator or progress bar |
| Submit confusion | Clear primary CTA, disable on submit |

**Enhanced Form Pattern:**
```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    className={cn(
      "w-full px-3 py-2 border rounded-lg",
      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
      error && "border-red-500 focus:ring-red-500/20"
    )}
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <p id="email-error" className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3.5 w-3.5" />
      {error}
    </p>
  )}
</div>
```

### 5. Empty States & Edge Cases

**Every list/table needs:**
```tsx
// Empty state
{items.length === 0 && (
  <div className="text-center py-12">
    <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
    <h3 className="mt-4 font-semibold">No items yet</h3>
    <p className="text-sm text-muted-foreground mt-1">
      Get started by creating your first item.
    </p>
    <Button className="mt-4">
      <Plus className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  </div>
)}

// Loading skeleton
{isLoading && (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2 mt-2" />
      </div>
    ))}
  </div>
)}

// Error state
{error && (
  <div className="text-center py-8">
    <AlertCircle className="h-10 w-10 mx-auto text-red-500" />
    <p className="mt-2 text-red-600">{error.message}</p>
    <Button variant="outline" onClick={retry} className="mt-4">
      Try Again
    </Button>
  </div>
)}
```

### 6. Mobile Responsiveness

**Common Mobile Fixes:**

```css
/* Touch-friendly tap targets (min 44x44px) */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Stack horizontal layouts on mobile */
@media (max-width: 640px) {
  .button-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .button-group button {
    width: 100%;
  }
}

/* Hide non-essential columns in tables */
@media (max-width: 768px) {
  .table-cell-secondary {
    display: none;
  }
}
```

### 7. Micro-interactions

**High-Impact Animations:**
```tsx
// Page/section entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// Staggered list items
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05 }}
  >

// Hover card lift
<motion.div
  whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)" }}
  transition={{ duration: 0.2 }}
>

// Checkbox/toggle
<motion.div
  animate={{ scale: checked ? [1, 1.2, 1] : 1 }}
  transition={{ duration: 0.2 }}
>
```

### 8. Navigation & Wayfinding

**Improvements:**
- Active state on current page/section
- Breadcrumbs for deep navigation
- Back button where appropriate
- Clear section headings
- Persistent search access

```tsx
// Active nav item
<Link
  href={href}
  className={cn(
    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-muted"
  )}
>
```

### 9. Information Density

**Too Dense → Solutions:**
- Add section dividers
- Group related items
- Use accordion/collapse for secondary info
- Progressive disclosure (show more on click)

**Too Sparse → Solutions:**
- Reduce whitespace
- Use multi-column layouts
- Combine related fields
- Use inline editing

### 10. Accessibility Quick Wins

```tsx
// Focus visible styles
.focus-visible:ring-2.focus-visible:ring-primary.focus-visible:ring-offset-2

// Skip to main content
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>

// Announce dynamic changes
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Button with icon needs label
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
```

## Enhancement Checklist

### Visual Polish
- [ ] Consistent spacing (8px grid)
- [ ] Clear visual hierarchy
- [ ] Proper color contrast (4.5:1 min)
- [ ] Icons aligned and consistent size
- [ ] Borders/shadows consistent

### Interactions
- [ ] All buttons have hover/active states
- [ ] Loading states for async actions
- [ ] Success/error feedback
- [ ] Form validation feedback
- [ ] Disabled states clear

### States
- [ ] Empty states designed
- [ ] Error states handled
- [ ] Loading skeletons
- [ ] Offline handling (if applicable)

### Mobile
- [ ] Touch targets 44px+
- [ ] No horizontal scroll
- [ ] Readable text (16px min)
- [ ] Forms work on mobile
- [ ] Modals scroll properly

### Accessibility
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Color not only indicator
- [ ] Screen reader tested

## Validation

After any UI enhancement:

1. **Visual comparison** → Before/after screenshots
2. **Interaction test** → All states work (hover, focus, active, disabled)
3. **Mobile test** → Touch targets 44px+, no horizontal scroll
4. **Accessibility** → Tab through, screen reader test
5. **Console check** → Zero errors/warnings
6. **Performance** → No layout shifts or jank

**Use Chrome DevTools MCP** to verify enhancements work correctly.
