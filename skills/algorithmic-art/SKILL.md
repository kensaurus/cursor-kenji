---
name: algorithmic-art
description: Create algorithmic art using p5.js, Canvas API, or SVG with seeded randomness and interactive parameters. Use when user requests generative art, procedural art, flow fields, particle systems, creative coding, noise patterns, mathematical visualizations, or asks for "art from code", "generate visuals", or "interactive animation".
---

# Algorithmic Art Skill

Create generative, procedural, and mathematical art using code. Transform algorithms into visual experiences.

## CRITICAL: Check Existing First

**Before creating ANY generative art, verify:**

1. **Check for existing creative coding setup:**
```bash
cat package.json | grep -i "p5\|three\|canvas\|pixi\|paper"
ls -la src/components/art/ src/components/generative/ 2>/dev/null
```

2. **Check for existing canvas/WebGL usage:**
```bash
rg "Canvas|useFrame|getContext.*2d|WebGL" --type tsx -l
```

3. **Check for existing noise/random utilities:**
```bash
rg "simplex\|perlin\|noise\|seedrandom" --type ts
```

**Why:** Don't conflict with existing rendering pipelines or duplicate utility code.

## Core Principles

### 1. Seeded Randomness
Every piece should be reproducible with a seed:
```typescript
// Deterministic random number generator
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Usage
const rng = mulberry32(42) // Same seed = same output
const value = rng() // 0-1 deterministic random
```

### 2. Parameterized Generation
Make art controllable via parameters:
```typescript
interface ArtParams {
  seed: number
  density: number       // 0-1
  palette: string[]
  scale: number
  speed: number
  complexity: number    // 0-1
}
```

### 3. Resolution Independence
Design for any canvas size:
```typescript
// Normalize coordinates to 0-1 range
const nx = x / width
const ny = y / height
// Then scale to canvas
const px = nx * canvas.width
const py = ny * canvas.height
```

## Techniques

### Flow Fields
```typescript
function createFlowField(cols: number, rows: number, seed: number) {
  const rng = mulberry32(seed)
  const field: number[][] = []
  
  for (let y = 0; y < rows; y++) {
    field[y] = []
    for (let x = 0; x < cols; x++) {
      // Perlin-like noise using layered sine waves
      const angle = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.PI * 2
        + rng() * 0.5
      field[y][x] = angle
    }
  }
  return field
}

function drawFlowField(ctx: CanvasRenderingContext2D, field: number[][], params: ArtParams) {
  const cellW = ctx.canvas.width / field[0].length
  const cellH = ctx.canvas.height / field.length
  
  // Spawn particles and follow flow
  for (let i = 0; i < params.density * 1000; i++) {
    let x = rng() * ctx.canvas.width
    let y = rng() * ctx.canvas.height
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = params.palette[Math.floor(rng() * params.palette.length)]
    ctx.globalAlpha = 0.3
    
    for (let step = 0; step < 100; step++) {
      const col = Math.floor(x / cellW)
      const row = Math.floor(y / cellH)
      
      if (col < 0 || col >= field[0].length || row < 0 || row >= field.length) break
      
      const angle = field[row][col]
      x += Math.cos(angle) * params.scale
      y += Math.sin(angle) * params.scale
      ctx.lineTo(x, y)
    }
    
    ctx.stroke()
  }
}
```

### Recursive Subdivision
```typescript
function subdivide(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  depth: number, maxDepth: number, rng: () => number,
  palette: string[]
) {
  if (depth >= maxDepth || rng() < 0.15) {
    // Draw leaf
    ctx.fillStyle = palette[Math.floor(rng() * palette.length)]
    ctx.globalAlpha = 0.6 + rng() * 0.4
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
    return
  }
  
  // Random split direction and position
  const horizontal = rng() > 0.5
  const split = 0.3 + rng() * 0.4 // 30-70% split
  
  if (horizontal) {
    const splitY = y + h * split
    subdivide(ctx, x, y, w, splitY - y, depth + 1, maxDepth, rng, palette)
    subdivide(ctx, x, splitY, w, y + h - splitY, depth + 1, maxDepth, rng, palette)
  } else {
    const splitX = x + w * split
    subdivide(ctx, x, y, splitX - x, h, depth + 1, maxDepth, rng, palette)
    subdivide(ctx, splitX, y, x + w - splitX, h, depth + 1, maxDepth, rng, palette)
  }
}
```

### Circle Packing
```typescript
interface Circle {
  x: number; y: number; r: number; color: string
}

function circlePacking(
  width: number, height: number,
  maxCircles: number, maxRadius: number,
  rng: () => number, palette: string[]
): Circle[] {
  const circles: Circle[] = []
  let attempts = 0
  const maxAttempts = maxCircles * 50
  
  while (circles.length < maxCircles && attempts < maxAttempts) {
    attempts++
    const candidate = {
      x: rng() * width,
      y: rng() * height,
      r: 2,
      color: palette[Math.floor(rng() * palette.length)]
    }
    
    // Grow until collision
    let valid = true
    while (valid && candidate.r < maxRadius) {
      candidate.r += 1
      for (const other of circles) {
        const dist = Math.hypot(candidate.x - other.x, candidate.y - other.y)
        if (dist < candidate.r + other.r + 2) {
          candidate.r -= 1
          valid = false
          break
        }
      }
      // Check bounds
      if (candidate.x - candidate.r < 0 || candidate.x + candidate.r > width ||
          candidate.y - candidate.r < 0 || candidate.y + candidate.r > height) {
        candidate.r -= 1
        valid = false
      }
    }
    
    if (candidate.r > 2) circles.push(candidate)
  }
  return circles
}
```

### L-Systems (Fractal Trees/Plants)
```typescript
interface LSystem {
  axiom: string
  rules: Record<string, string>
  angle: number
  length: number
  iterations: number
}

const fractalTree: LSystem = {
  axiom: 'F',
  rules: { 'F': 'FF+[+F-F-F]-[-F+F+F]' },
  angle: 25,
  length: 4,
  iterations: 4,
}

function generateLSystem(system: LSystem): string {
  let current = system.axiom
  for (let i = 0; i < system.iterations; i++) {
    current = current.split('').map(c => system.rules[c] || c).join('')
  }
  return current
}

function drawLSystem(ctx: CanvasRenderingContext2D, system: LSystem, startX: number, startY: number) {
  const instructions = generateLSystem(system)
  const stack: { x: number; y: number; angle: number }[] = []
  let x = startX, y = startY, angle = -90 // Start pointing up
  
  ctx.beginPath()
  ctx.moveTo(x, y)
  
  for (const char of instructions) {
    switch (char) {
      case 'F':
        const nx = x + Math.cos(angle * Math.PI / 180) * system.length
        const ny = y + Math.sin(angle * Math.PI / 180) * system.length
        ctx.lineTo(nx, ny)
        x = nx; y = ny
        break
      case '+': angle += system.angle; break
      case '-': angle -= system.angle; break
      case '[': stack.push({ x, y, angle }); break
      case ']':
        const state = stack.pop()!
        x = state.x; y = state.y; angle = state.angle
        ctx.moveTo(x, y)
        break
    }
  }
  ctx.stroke()
}
```

## React Component Pattern

```tsx
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface GenerativeArtProps {
  seed?: number
  width?: number
  height?: number
  palette?: string[]
  className?: string
}

export function GenerativeArt({
  seed = Date.now(),
  width = 800,
  height = 600,
  palette = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  className,
}: GenerativeArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentSeed, setCurrentSeed] = useState(seed)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const rng = mulberry32(currentSeed)

    // Clear
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // Your generative algorithm here
    drawFlowField(ctx, createFlowField(40, 30, currentSeed), {
      seed: currentSeed,
      density: 0.8,
      palette,
      scale: 2,
      speed: 1,
      complexity: 0.7,
    })
  }, [currentSeed, width, height, palette])

  useEffect(() => { render() }, [render])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setCurrentSeed(Date.now())}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Regenerate
        </button>
        <input
          type="number"
          value={currentSeed}
          onChange={(e) => setCurrentSeed(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg w-32"
          aria-label="Seed value"
        />
      </div>
    </div>
  )
}
```

## Color Palettes

```typescript
// Curated palettes for generative art
const PALETTES = {
  // Warm
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
  autumn: ['#d35400', '#e67e22', '#f39c12', '#2c3e50', '#ecf0f1'],
  
  // Cool
  ocean: ['#0c2461', '#1e3799', '#4a69bd', '#6a89cc', '#82ccdd'],
  forest: ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d'],
  
  // Monochrome
  ink: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666'],
  paper: ['#f5f0e8', '#ede4d4', '#e5d9c0', '#ddc9a3', '#d4ba87'],
  
  // Vibrant
  neon: ['#ff00ff', '#00ffff', '#ff0066', '#66ff00', '#ffff00'],
  candy: ['#ff6f91', '#ff9671', '#ffc75f', '#f9f871', '#d4fc79'],
  
  // Japanese-inspired
  wabi: ['#2c1810', '#5c3a2e', '#b5651d', '#daa06d', '#f5deb3'],
  sakura: ['#ffb7c5', '#ff69b4', '#c71585', '#8b008b', '#4a0028'],
}
```

## Animation Loop

```typescript
function animatedArt(canvas: HTMLCanvasElement, params: ArtParams) {
  const ctx = canvas.getContext('2d')!
  let frame = 0
  let animationId: number
  
  function loop() {
    frame++
    const t = frame * params.speed * 0.01
    
    // Semi-transparent overlay for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Animated elements
    for (let i = 0; i < 50; i++) {
      const x = canvas.width / 2 + Math.cos(t + i * 0.5) * 200
      const y = canvas.height / 2 + Math.sin(t * 0.7 + i * 0.3) * 200
      const r = 2 + Math.sin(t + i) * 1
      
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = params.palette[i % params.palette.length]
      ctx.globalAlpha = 0.8
      ctx.fill()
    }
    
    animationId = requestAnimationFrame(loop)
  }
  
  loop()
  return () => cancelAnimationFrame(animationId)
}
```

## Export & Sharing

```typescript
// Export canvas as PNG
function exportPNG(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = `${filename}-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// Export as SVG (for vector output)
function exportSVG(svgElement: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const link = document.createElement('a')
  link.download = `${filename}-${Date.now()}.svg`
  link.href = URL.createObjectURL(blob)
  link.click()
}
```

## Related Skills

- `creative-effects` — WebGL, Three.js, shaders for 3D generative art
- `motion-design` — Animation patterns for interactive pieces
- `canvas-design` — Print-quality visual design philosophy
- `data-visualization` — Data-driven generative compositions

## Validation

After creating algorithmic art:

1. **Reproducibility** → Same seed produces identical output
2. **Performance** → 60fps for animated pieces
3. **Resolution** → Looks good at target export size
4. **Palette** → Colors work together harmoniously
5. **Parameters** → Controls produce meaningful visual changes
6. **Export** → PNG/SVG export works correctly
7. **Accessibility** → Animated art respects `prefers-reduced-motion`
