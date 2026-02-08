# UI/UX Sync & Alignment

## Purpose
Enforce existing design system, fix rogue implementations, standardize interactions across the app.

## Process

### 1. Discover Existing System
- Scan for design tokens, theme config, CSS variables
- Identify reusable components and variants
- Note established animation/transition patterns
- Map interaction standards already in use

### 2. Detect Rogue Implementations

**Styling:**
- Hardcoded values instead of tokens
- Inline styles bypassing system
- Duplicate components
- Inconsistent spacing

**Interactions:**
- Inconsistent hover/focus/active states
- Mismatched animation durations/easing
- Missing transitions where others exist
- Unresponsive touch targets

### 3. Fix & Align

- Replace hardcoded values → existing tokens
- Replace one-offs → existing components/variants
- Match animations to established patterns
- Add missing interaction states (hover, focus, active, loading)
- Ensure mobile touch targets match rest of app

### 4. Validate

- All UI uses existing design system
- Interactions feel consistent
- Animations match established timing
- Mobile behavior consistent
- No rogue overrides remain

## Output
- Rogue patterns found & fixed
- Inconsistencies aligned to existing system
- Missing interactions added
- Gaps flagged for review