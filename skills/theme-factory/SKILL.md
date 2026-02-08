---
name: theme-factory
description: Apply cohesive visual themes to artifacts (slides, docs, landing pages). Provides 11 pre-set themes with colors/fonts. Use when user mentions "apply theme", "color palette", "brand colors", "styling slides", "presentation design", "visual identity", or wants consistent styling across artifacts.
---

# Theme Factory Skill

This skill provides a curated collection of professional font and color themes. Once a theme is chosen, it can be applied to any artifact.

## Purpose

To apply consistent, professional styling to presentation slide decks or other artifacts. Each theme includes:
- A cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- A distinct visual identity suitable for different contexts and audiences

## Usage Instructions

To apply styling to a slide deck or other artifact:

1. **Show available themes**: Display the theme options to allow users to see all available themes
2. **Ask for their choice**: Ask which theme to apply
3. **Wait for selection**: Get explicit confirmation about the chosen theme
4. **Apply the theme**: Apply the selected theme's colors and fonts

## Themes Available

The following 10 themes are available:

### 1. Ocean Depths
Professional and calming maritime theme
- **Primary**: `#1a365d` (deep blue)
- **Secondary**: `#2c5282`
- **Accent**: `#63b3ed`
- **Background**: `#ebf8ff`
- **Heading Font**: Playfair Display
- **Body Font**: Source Sans Pro

### 2. Sunset Boulevard
Warm and vibrant sunset colors
- **Primary**: `#c05621` (burnt orange)
- **Secondary**: `#dd6b20`
- **Accent**: `#ed8936`
- **Background**: `#fffaf0`
- **Heading Font**: Poppins
- **Body Font**: Open Sans

### 3. Forest Canopy
Natural and grounded earth tones
- **Primary**: `#276749` (forest green)
- **Secondary**: `#38a169`
- **Accent**: `#9ae6b4`
- **Background**: `#f0fff4`
- **Heading Font**: Merriweather
- **Body Font**: Lato

### 4. Modern Minimalist
Clean and contemporary grayscale
- **Primary**: `#1a202c` (charcoal)
- **Secondary**: `#4a5568`
- **Accent**: `#718096`
- **Background**: `#f7fafc`
- **Heading Font**: Inter
- **Body Font**: Inter

### 5. Golden Hour
Rich and warm autumnal palette
- **Primary**: `#744210` (golden brown)
- **Secondary**: `#b7791f`
- **Accent**: `#ecc94b`
- **Background**: `#fffff0`
- **Heading Font**: Cormorant Garamond
- **Body Font**: Work Sans

### 6. Arctic Frost
Cool and crisp winter-inspired theme
- **Primary**: `#2b6cb0` (ice blue)
- **Secondary**: `#4299e1`
- **Accent**: `#90cdf4`
- **Background**: `#ebf8ff`
- **Heading Font**: Montserrat
- **Body Font**: Nunito

### 7. Desert Rose
Soft and sophisticated dusty tones
- **Primary**: `#97266d` (dusty rose)
- **Secondary**: `#d53f8c`
- **Accent**: `#ed64a6`
- **Background**: `#fff5f7`
- **Heading Font**: DM Serif Display
- **Body Font**: DM Sans

### 8. Tech Innovation
Bold and modern tech aesthetic
- **Primary**: `#2d3748` (slate)
- **Secondary**: `#4c51bf`
- **Accent**: `#667eea`
- **Background**: `#edf2f7`
- **Heading Font**: JetBrains Mono
- **Body Font**: IBM Plex Sans

### 9. Botanical Garden
Fresh and organic garden colors
- **Primary**: `#285e61` (teal)
- **Secondary**: `#319795`
- **Accent**: `#81e6d9`
- **Background**: `#e6fffa`
- **Heading Font**: Libre Baskerville
- **Body Font**: Karla

### 10. Midnight Galaxy
Dramatic and cosmic deep tones
- **Primary**: `#1a1a2e` (midnight)
- **Secondary**: `#16213e`
- **Accent**: `#e94560`
- **Background**: `#0f0f23`
- **Text**: `#edf2f7`
- **Heading Font**: Orbitron
- **Body Font**: Rajdhani

### 11. Tsumagoi Ranch
Neo-Brutalist "Cute-alism" - Japanese ranch/campground aesthetic
- **Primary**: `#0c85f4` (mountain blue)
- **Secondary**: `#10b981` (pine green)
- **Accent**: `#ff6b35` (campfire orange)
- **Accent Alt**: `#FF6D38` (navigate orange - CTAs)
- **Premium**: `#8584FF` (navigate purple)
- **Background Light**: `#faf7f2` (warm cream)
- **Background Dark**: `#0c1424` (night sky)
- **Border**: `#b8a080` (wood/sand tone)
- **Text**: `#1a1a1a` (near black)
- **Heading Font**: M PLUS Rounded 1c
- **Body Font**: Inter
- **Body JP**: Noto Sans JP
- **Mono**: JetBrains Mono

**Neo-Brutal Shadows**: Hard-edge `3px 3px 0 0 #b8a080` (no blur)
**Border Style**: 3px solid with rounded-xl corners
**Motion**: Bounce easing `cubic-bezier(0.34, 1.56, 0.64, 1)`

See `themes/tsumagoi-ranch.md` for full specification including mobile patterns.

## Application Process

After a preferred theme is selected:
1. Read the corresponding theme specifications
2. Apply the specified colors and fonts consistently throughout
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all elements

## Create Your Own Theme

To handle cases where none of the existing themes work, create a custom theme based on:
- User's brand colors
- Specific aesthetic direction
- Industry or context requirements

Generate a new theme with:
- 5 color palette (primary, secondary, accent, background, text)
- Font pairing (heading + body)
- A descriptive name

After generating, show it for review before applying.

## CRITICAL: Check Existing First

**Before applying ANY theme, verify:**

1. **Check for existing theme/design system:**
```bash
cat tailwind.config.* 2>/dev/null | grep -A30 "colors\|fontFamily"
cat src/styles/globals.css docs/THEME_GUIDE.md 2>/dev/null
```

2. **Check for existing CSS variables:**
```bash
rg "var\(--" --type css --type tsx | head -20
```

3. **Check for existing brand colors:**
- Look in `public/` for logos
- Check existing components for color patterns

**Why:** Themes must integrate with existing design systems, not override them arbitrarily.

## Validation

After applying a theme:

1. **Visual consistency** → All components use theme colors
2. **Contrast check** → Text readable on backgrounds (4.5:1 min)
3. **Font loading** → Google Fonts load correctly
4. **Dark mode** → If applicable, verify dark variant works
5. **Mobile check** → Typography scales appropriately
6. **Print preview** → If printable, colors work in print
