---
name: creative-effects
description: Create stunning visual effects using WebGL, Three.js, shaders, particles, and creative coding. Use when user wants "3D", "WebGL", "shader", "particles", "visual effects", "creative coding", "immersive", "interactive background", "hero effect", or "wow factor".
---

# Creative Effects Skill

Create immersive visual experiences using WebGL, Three.js, shaders, and creative coding techniques.

## CRITICAL: Check Existing First

**Before adding ANY effects, verify:**

1. **Check for existing 3D/WebGL setup:**
```bash
cat package.json | grep -i "three\|@react-three\|webgl\|pixi\|p5"
rg "Canvas|useFrame|useThree" --type tsx -l
```

2. **Check for existing effects:**
```bash
ls -la src/components/effects/ src/components/3d/ 2>/dev/null
rg "shader|fragment|vertex" --type ts --type glsl
```

3. **Check performance budget:**
- Is this a content-heavy site? (careful with GPU usage)
- Mobile support required? (simplify effects)

**Why:** WebGL effects are resource-intensive. Don't conflict with existing implementations.

## Three.js with React Three Fiber

### Basic Scene Setup
```tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MyMesh />
      <OrbitControls enableZoom={false} />
      <Environment preset="city" />
    </Canvas>
  )
}

function MyMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

### Interactive Particles
```tsx
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'

function StarField({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null)
  const [sphere] = useState(() => 
    random.inSphere(new Float32Array(count * 3), { radius: 1.5 })
  )

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}
```

### Custom Shaders
```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color(0.2, 0.0, 0.1) },
  // Vertex Shader
  `
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + uTime) * 0.1;
      pos.z += sin(pos.y * 5.0 + uTime * 0.5) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    void main() {
      vec3 color = uColor;
      color.r += sin(vUv.x * 10.0 + uTime) * 0.1;
      color.g += sin(vUv.y * 10.0 + uTime * 0.5) * 0.1;
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ WaveShaderMaterial })

function WavePlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <waveShaderMaterial ref={materialRef} />
    </mesh>
  )
}
```

## CSS/SVG Effects

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

/* Performance tip: isolate to new stacking context */
.glass-container {
  isolation: isolate;
}
```

### Gradient Animations
```css
.animated-gradient {
  background: linear-gradient(
    -45deg,
    #ee7752, #e73c7e, #23a6d5, #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Noise/Grain Texture
```css
.grain {
  position: relative;
}

.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}
```

### SVG Morphing
```tsx
import { motion } from 'framer-motion'

const paths = {
  circle: "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10",
  square: "M10,10 L90,10 L90,90 L10,90 Z",
  star: "M50,10 L61,40 L95,40 L68,60 L79,90 L50,72 L21,90 L32,60 L5,40 L39,40 Z"
}

function MorphingSVG() {
  const [shape, setShape] = useState<keyof typeof paths>('circle')
  
  return (
    <svg viewBox="0 0 100 100">
      <motion.path
        d={paths[shape]}
        animate={{ d: paths[shape] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        fill="currentColor"
      />
    </svg>
  )
}
```

## Canvas 2D Effects

### Particle System
```tsx
'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animationId: number
    
    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
      })
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / 100)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
```

## Mouse-Following Effects

```tsx
'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function CursorFollower() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="fixed w-8 h-8 bg-primary/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 mix-blend-difference"
      style={{ x: springX, y: springY }}
    />
  )
}
```

## Performance Tips

1. **GPU Acceleration**
   - Use `transform: translateZ(0)` or `will-change: transform`
   - Avoid `will-change` on too many elements

2. **Canvas/WebGL**
   - Use `requestAnimationFrame` for animations
   - Implement object pooling for particles
   - Use instanced rendering for many similar objects
   - Lower resolution on mobile (`devicePixelRatio` capped at 2)

3. **CSS Effects**
   - `backdrop-filter` is expensive - use sparingly
   - SVG filters can cause repaints - isolate them

4. **Mobile**
   - Reduce particle counts by 50-75%
   - Disable complex shaders
   - Use CSS fallbacks when WebGL unavailable

## Validation

After implementing effects:

1. **Performance** → GPU usage under 50%, 60fps maintained
2. **Mobile** → Test on real devices, graceful degradation
3. **Accessibility** → Effects don't cause motion sickness, can be disabled
4. **Battery** → Effects pause when tab not visible
5. **Fallback** → Site works without WebGL
