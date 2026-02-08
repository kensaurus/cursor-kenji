---
name: creative-workflow
description: End-to-end creative development workflow combining design, frontend, and backend. Use when starting a new feature, building a complete component/page, or when user wants "build", "create", "implement feature", "end-to-end", or "full stack implementation".
---

# Creative Workflow Skill

A comprehensive workflow for building features end-to-end with high design quality and production-ready code.

## CRITICAL: Check Existing First

**Before starting ANY creative work:**

1. **Read project context:**
```bash
cat README.md docs/THEME_GUIDE.md CONTRIBUTING.md 2>/dev/null | head -200
cat .cursor/rules/*.mdc 2>/dev/null
```

2. **Check existing patterns:**
```bash
ls -la src/components/ui/
ls -la src/features/
rg "export function" src/components/ --type tsx | head -20
```

3. **Understand the tech stack:**
```bash
cat package.json | head -50
cat tsconfig.json | head -20
```

**Why:** Every new feature should feel like it belongs in the existing codebase.

## Creative Development Workflow

### Phase 1: Discovery & Context (5 min)

**Gather Requirements:**
1. What problem does this solve?
2. Who is the user?
3. What's the desired emotional response?
4. What are the constraints (time, tech, accessibility)?

**Research Existing:**
```bash
# Check if similar exists
rg "ComponentName\|FeatureName" --type tsx
ls -la src/features/ src/components/

# Check design patterns
cat tailwind.config.* | grep -A30 "colors\|animation"
```

### Phase 2: Design Direction (10 min)

**Choose Aesthetic:**
- [ ] Minimal/Clean
- [ ] Bold/Expressive
- [ ] Playful/Fun
- [ ] Professional/Corporate
- [ ] Other: ___________

**Define Key Interactions:**
- Primary action: ___________
- Secondary actions: ___________
- Feedback mechanism: ___________
- Loading/empty states: ___________

**Color & Typography:**
- Use existing design tokens from `tailwind.config.ts`
- Or propose new tokens that complement existing

### Phase 3: Component Architecture (10 min)

**Structure:**
```
src/features/[feature-name]/
├── components/
│   ├── FeatureCard.tsx
│   ├── FeatureList.tsx
│   └── FeatureForm.tsx
├── hooks/
│   └── useFeatureData.ts
├── server/
│   └── actions.ts
├── types.ts
└── index.ts
```

**Component Breakdown:**
1. Identify atomic components (buttons, inputs, cards)
2. Identify composite components (forms, lists, modals)
3. Identify container components (pages, layouts)

### Phase 4: Implementation

#### Step 1: Types & Schemas
```tsx
// types.ts
export interface Feature {
  id: string
  name: string
  status: 'draft' | 'active' | 'archived'
  createdAt: Date
}

// schemas.ts
import { z } from 'zod'

export const CreateFeatureSchema = z.object({
  name: z.string().min(1).max(100),
})

export type CreateFeatureInput = z.infer<typeof CreateFeatureSchema>
```

#### Step 2: Server Logic
```tsx
// server/actions.ts
'use server'

export async function createFeature(input: CreateFeatureInput): Promise<ActionResult<Feature>> {
  // Validate, auth check, create, revalidate
}
```

#### Step 3: Data Hooks
```tsx
// hooks/useFeatureData.ts
export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  })
}
```

#### Step 4: UI Components
```tsx
// components/FeatureCard.tsx
export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-6"
    >
      {/* Content */}
    </motion.div>
  )
}
```

#### Step 5: Page Assembly
```tsx
// page.tsx
export default async function FeaturesPage() {
  const features = await getFeatures()
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Features</h1>
      <FeatureList features={features} />
    </div>
  )
}
```

### Phase 5: Polish & Delight

**Visual Polish:**
- [ ] Consistent spacing (8px grid)
- [ ] Proper typography hierarchy
- [ ] Color contrast meets WCAG
- [ ] Icons aligned and consistent

**Interactions:**
- [ ] Hover states on interactive elements
- [ ] Loading states for async operations
- [ ] Success/error feedback
- [ ] Smooth transitions (200-300ms)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus indicators visible
- [ ] ARIA labels where needed

**Performance:**
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Lazy loading for below-fold content

### Phase 6: Validation

**Browser Testing:**
```bash
# Use Chrome DevTools MCP or Playwright
- Check console for errors
- Test all interactions
- Verify responsive behavior
- Test dark mode if applicable
```

**Checklist:**
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1280px+)
- [ ] Dark mode compatible
- [ ] No console errors
- [ ] Forms validate correctly
- [ ] Error states handled
- [ ] Loading states present

## Quick Reference: Skills to Combine

| Need | Use Skill |
|------|-----------|
| Beautiful UI | `frontend-design` |
| Animations | `motion-design` |
| 3D/WebGL effects | `creative-effects` |
| Charts/data | `data-visualization` |
| Mobile-first | `mobile-first` |
| Component library | `design-system` |
| Real-time data | `realtime-features` |
| Fun interactions | `interactive-ux` |
| Backend logic | `backend-patterns` |
| Performance | `performance-audit` |
| Security | `security-audit` |
| Accessibility | `accessibility-audit` |

## Output Quality Standards

Every deliverable should be:

1. **Production-ready** - No placeholders, no TODO comments in final code
2. **Type-safe** - Full TypeScript, no `any`
3. **Accessible** - WCAG 2.1 AA compliant
4. **Performant** - 60fps animations, optimized assets
5. **Responsive** - Works on all screen sizes
6. **Consistent** - Matches existing design system
7. **Documented** - JSDoc for complex components
8. **Tested** - Key paths work correctly
