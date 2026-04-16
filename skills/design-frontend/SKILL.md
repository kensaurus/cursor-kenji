---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces avoiding generic AI aesthetics. Use when building web components, landing pages, dashboards, React components, or when user mentions "make it look good", "beautify", "style this", "redesign", "modern UI", "professional look", or "improve the design".
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## CRITICAL: Check Existing First

**Before creating ANY UI, verify:**

1. **Check existing design system:**
```bash
ls -la src/components/ui/
cat tailwind.config.* | head -50
cat src/styles/globals.css | head -50
```

2. **Check for existing patterns:**
```bash
rg "className.*bg-|text-|rounded-" --type tsx | head -20
rg "@/components/ui" --type tsx -l | head -10
```

3. **Check for theming:**
- Look in `tailwind.config.ts` for custom colors, fonts
- Check for CSS variables in `globals.css`
- Look for existing animation utilities

4. **Check README/docs:**
```bash
cat README.md docs/THEME_GUIDE.md .cursor/rules/*.md 2>/dev/null | head -100
```

**Why:** Maintain visual consistency. Reuse existing primitives and design tokens.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Implementation Checklist

### Typography
- [ ] Display font selected (not Inter/Roboto/Arial)
- [ ] Body font paired thoughtfully
- [ ] Font sizes create clear hierarchy
- [ ] Line heights optimized for readability
- [ ] Letter-spacing refined where needed

### Color System
- [ ] Primary color with 2-3 shades
- [ ] Accent color(s) for emphasis
- [ ] Neutral palette for text/backgrounds
- [ ] CSS variables for consistency
- [ ] Contrast ratios meet WCAG standards

### Layout & Spacing
- [ ] Consistent spacing scale (4px/8px base)
- [ ] Intentional asymmetry or symmetry
- [ ] Breathing room around elements
- [ ] Grid system established
- [ ] Mobile-responsive breakpoints

### Motion & Interaction
- [ ] Page load animations (staggered reveals)
- [ ] Hover states that delight
- [ ] Smooth transitions (200-400ms)
- [ ] Focus states for accessibility
- [ ] Loading states if async

### Visual Details
- [ ] Background treatment (not just solid)
- [ ] Shadows/depth where appropriate
- [ ] Border treatments refined
- [ ] Icons consistent in style
- [ ] Images optimized and styled

### Quality Assurance
- [ ] No console errors
- [ ] Responsive on all screen sizes
- [ ] Accessible (keyboard nav, ARIA)
- [ ] Performance optimized
- [ ] Cross-browser tested

## Validation

After creating any frontend component:

1. **Browser test** → Open in Chrome DevTools, check console
2. **Mobile preview** → Test at 375px, 768px, 1024px widths
3. **Accessibility check** → Tab through all interactive elements
4. **Performance** → Lighthouse audit > 90 score
5. **Visual review** → Does it match the intended aesthetic?
6. **Dark mode** → If applicable, test dark variant

**Use Chrome DevTools MCP** to automate browser testing after implementation.
