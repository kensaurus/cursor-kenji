---
name: design-canvas
description: Create museum-quality visual art in .png and .pdf formats using design philosophy. Use when user asks for poster, visual design, infographic, certificate, badge, banner, social media graphic, print design, or mentions "create artwork", "design graphic", "visual identity", or "print material".
license: Apache-2.0
---

# Canvas Design Skill

**Degree of freedom: MIXED.** Movement name and composition `[HIGH freedom]`;
brand-asset inventory `[LOW freedom — run exactly]`.

Create design philosophies that are expressed visually. Output .md files (philosophy) and .pdf/.png files (visual art).

## How to reason

1. **Inventory** — existing brand assets and visual language
2. **Name** — 1–2 word movement
3. **Compose** — form, space, color; text as accent only
4. **Refine** — second pass; nothing overlaps; museum craft

## Worked example

> **Inventory:** wordmark in `public/brand/`; no poster system; palette is charcoal + one red.
> **Name:** "Chromatic Silence".
> **Compose:** one red field, monumental type as shape, 12pt label only; no paragraph copy.
> **Refine:** crop so the wordmark does not collide; export PNG at print dpi.

## Self-critique before reporting

- **Brand-first** — new art complements existing assets; it does not invent a second identity
- **Text is accent** — no paragraph dump on the canvas
- **Craft pass** — second refine happened; nothing overlaps or clips
- **Right owner** — UI chrome → `design-frontend`; data charts → `data-visualization`; token SSOT → `design-system`

## Process

### Step 1: Design Philosophy Creation  [HIGH freedom]

Create a VISUAL PHILOSOPHY that will be expressed through:
- Form, space, color, composition
- Images, graphics, shapes, patterns
- Minimal text as visual accent

**Philosophy Structure:**
1. **Name the movement** (1-2 words): "Brutalist Joy" / "Chromatic Silence"
2. **Articulate the philosophy** (4-6 paragraphs):
 - Space and form
 - Color and material
 - Scale and rhythm
 - Composition and balance
 - Visual hierarchy

**Guidelines:**
- Avoid redundancy
- Emphasize craftsmanship repeatedly
- Leave creative space for interpretation

### Step 2: Canvas Creation  [HIGH freedom]

With the philosophy established, express it visually.

**Principles:**
- Create museum or magazine quality work
- Use repeating patterns and perfect shapes
- Treat abstract design as systematic observation
- Add sparse, clinical typography
- Use limited, intentional color palette
- Ensure nothing overlaps or falls off the canvas

**Text Rules:**
- Text is always minimal and visual-first
- Context guides scale (punk poster vs. minimalist identity)
- Fonts should be design-forward
- Use different fonts for variety
- All elements need breathing room and clear separation

## Example Philosophies

**"Concrete Poetry"**
Communication through monumental form and bold geometry. Massive color blocks, sculptural typography, Brutalist spatial divisions. Ideas expressed through visual weight and spatial tension. Text as rare, gesture - never paragraphs.

**"Chromatic Language"**
Color as the primary information system. Geometric precision where color zones create meaning. Typography minimal - small sans-serif labels letting chromatic fields communicate. Information encoded spatially and chromatically.

**"Analog Meditation"**
Quiet visual contemplation through texture and breathing room. Paper grain, ink bleeds, vast negative space. Photography and illustration dominate. Typography whispered. Japanese photobook aesthetic.

**"Organic Systems"**
Natural clustering and modular growth patterns. Rounded forms, organic arrangements, color from nature. Information shown through visual diagrams, spatial relationships, iconography. Text only for key labels.

**"Geometric Silence"**
Pure order and restraint. Grid-based precision, bold photography, dramatic negative space. Typography precise but minimal. Swiss formalism meets Brutalist honesty. Structure communicates.

## Quality Standards

**CRITICAL Requirements:**
- Work must appear meticulously crafted
- Every detail should look labored over with care
- Composition, spacing, color choices must show expert-level craftsmanship
- Nothing overlaps, formatting is flawless
- Could be displayed in a museum

**Refinement Process:**
- Take a second pass to refine/polish
- Don't add more graphics; refine what exists
- Ask: "How can I make what's here more of a piece of art?"

## Multi-Page Option

When requested:
- Create additional pages following the design philosophy
- Each page should be a unique twist on the original
- Almost tell a story in a tasteful way
- Bundle in same .pdf or multiple .pngs

## Output

1. **Design Philosophy** (.md) - 4-6 paragraphs describing the aesthetic movement
2. **Visual Artifact** (.pdf or .png) - Museum-quality visual design

## CRITICAL: Check Existing First  [LOW freedom — run exactly]

**Before creating ANY visual design, verify:**

1. **Check for existing brand assets:**
```bash
ls -la public/ assets/ src/assets/ 2>/dev/null
ls -la *.svg *.png brand/ logos/ 2>/dev/null
```

2. **Check for existing design system:**
```bash
cat tailwind.config.* 2>/dev/null | grep -A20 "colors\|fontFamily"
cat docs/THEME_GUIDE.md .cursor/rules/*.md 2>/dev/null
```

3. **Understand context:**
- Is there an existing brand identity?
- What are the target use cases?

**Why:** Visual designs should complement, not conflict with, existing brand identity.

## Validation  [LOW freedom — do not skip]

After creating the artifact:

1. **Visual inspection** → Check composition and balance
2. **Typography check** → Fonts render correctly, readable hierarchy
3. **Color verification** → Colors match specification
4. **Export quality** → Resolution appropriate for intended use
5. **Accessibility** → Sufficient contrast for any text elements
6. **File size** → Optimized for intended distribution
