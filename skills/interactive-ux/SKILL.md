---
name: interactive-ux
description: Create delightful, playful, and engaging interactive experiences. Use when user wants "fun interactions", "playful UI", "gamification", "delightful", "engaging", "interactive experience", "Easter eggs", "surprise and delight", or "memorable UX".
---

# Interactive UX Skill

Create memorable, engaging user experiences through playful interactions, delightful surprises, and gamification elements.

## CRITICAL: Check Existing First

**Before adding ANY interactive element, verify:**

1. **Check for existing interaction patterns:**
```bash
rg "useSpring|useDrag|useGesture" --type tsx -l
rg "confetti|particles|celebration" --type tsx
cat package.json | grep -i "use-gesture\|react-spring\|lottie\|confetti"
```

2. **Check existing animations:**
```bash
rg "framer-motion\|motion\." --type tsx | head -20
```

**Why:** Maintain consistent interaction language. Don't overload with competing effects.

## Principles of Delightful UX

### 1. Purposeful Play
- Every interaction should enhance understanding or provide feedback
- Fun should support the task, not distract from it
- Balance delight with usability

### 2. Progressive Discovery
- Basic interactions work immediately
- Advanced/fun features reveal over time
- Reward exploration without penalizing straightforward use

### 3. Respect User Intent
- Never block progress with mandatory interactions
- Provide skip/dismiss options
- Remember preferences

## Playful Micro-interactions

### Success Celebrations
```tsx
'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function useSuccessCelebration() {
  const celebrate = (intensity: 'small' | 'medium' | 'large' = 'medium') => {
    const config = {
      small: { particleCount: 30, spread: 50 },
      medium: { particleCount: 100, spread: 70 },
      large: { particleCount: 200, spread: 100, startVelocity: 45 },
    }

    confetti({
      ...config[intensity],
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
    })
  }

  return { celebrate }
}

// Fireworks burst
export function fireworks() {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}
```

### Bouncy Buttons
```tsx
import { motion } from 'framer-motion'

export function BouncyButton({ children, onClick }: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
      }}
      className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
    >
      {children}
    </motion.button>
  )
}

// Jelly effect
export function JellyButton({ children }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{
        scale: [1, 0.9, 1.1, 0.95, 1.02, 1],
        transition: { duration: 0.4 },
      }}
      className="px-6 py-3 bg-primary rounded-lg"
    >
      {children}
    </motion.button>
  )
}
```

### Magnetic Elements
```tsx
'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Pull toward cursor (magnetic effect)
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
    >
      {children}
    </motion.button>
  )
}
```

### Satisfying Toggle
```tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function SatisfyingToggle({ onToggle }: { onToggle: (on: boolean) => void }) {
  const [isOn, setIsOn] = useState(false)

  const toggle = () => {
    setIsOn(!isOn)
    onToggle(!isOn)
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <motion.button
      onClick={toggle}
      className={`w-14 h-8 rounded-full p-1 ${isOn ? 'bg-primary' : 'bg-muted'}`}
      animate={{ backgroundColor: isOn ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md"
        animate={{
          x: isOn ? 22 : 0,
          scale: [1, 1.1, 1],
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
        }}
      />
    </motion.button>
  )
}
```

## Gamification Elements

### Progress with Personality
```tsx
'use client'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  showMilestones?: boolean
}

export function PlayfulProgress({ value, showMilestones = true }: ProgressBarProps) {
  const milestones = [25, 50, 75, 100]

  return (
    <div className="relative">
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </div>
      
      {showMilestones && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone}
              className="w-2 h-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{
                scale: value >= milestone ? [1, 1.5, 1] : 1,
                backgroundColor: value >= milestone 
                  ? 'hsl(var(--primary-foreground))' 
                  : 'hsl(var(--muted-foreground))',
              }}
              transition={{ delay: 0.2 }}
            />
          ))}
        </div>
      )}
      
      {/* Celebration at 100% */}
      {value === 100 && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-6 right-0 text-sm"
        >
          🎉 Complete!
        </motion.span>
      )}
    </div>
  )
}
```

### Achievement Badges
```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface Badge {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
}

export function AchievementBadge({ badge, onUnlock }: { badge: Badge; onUnlock: () => void }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: badge.unlocked ? 1.1 : 1.02 }}
      onHoverStart={() => setShowDetails(true)}
      onHoverEnd={() => setShowDetails(false)}
    >
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
          badge.unlocked 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
            : 'bg-muted grayscale'
        }`}
        animate={badge.unlocked ? {
          boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0)', '0 0 0 10px rgba(251, 191, 36, 0.3)', '0 0 0 0 rgba(251, 191, 36, 0)'],
        } : {}}
        transition={{ repeat: badge.unlocked ? 2 : 0, duration: 1 }}
      >
        {badge.icon}
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover rounded-lg shadow-lg whitespace-nowrap z-10"
          >
            <p className="font-semibold">{badge.title}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            {!badge.unlocked && (
              <p className="text-xs text-muted-foreground mt-1">🔒 Locked</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

### Streak Counter
```tsx
'use client'
import { motion } from 'framer-motion'

export function StreakCounter({ days }: { days: number }) {
  const flames = Math.min(Math.floor(days / 7), 3) + 1 // 1-4 flames based on streak

  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <span className="text-2xl">
        {'🔥'.repeat(flames)}
      </span>
      <span className="font-bold text-orange-600">
        {days} day streak!
      </span>
    </motion.div>
  )
}
```

## Easter Eggs & Surprises

### Konami Code
```tsx
'use client'
import { useEffect, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
]

export function useKonamiCode(callback: () => void) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI_CODE[index]) {
        if (index === KONAMI_CODE.length - 1) {
          callback()
          setIndex(0)
        } else {
          setIndex(index + 1)
        }
      } else {
        setIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, callback])
}

// Usage
function App() {
  useKonamiCode(() => {
    fireworks()
    // Show secret feature, change theme, etc.
  })
}
```

### Click Counter Surprises
```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SurpriseLogo() {
  const [clicks, setClicks] = useState(0)
  const [showSurprise, setShowSurprise] = useState(false)

  const handleClick = () => {
    const newClicks = clicks + 1
    setClicks(newClicks)

    if (newClicks === 5) {
      setShowSurprise(true)
      setTimeout(() => setShowSurprise(false), 3000)
      setClicks(0)
    }
  }

  return (
    <div className="relative">
      <motion.img
        src="/logo.svg"
        alt="Logo"
        onClick={handleClick}
        whileTap={{ rotate: [0, -10, 10, -10, 0] }}
        className="cursor-pointer"
      />
      
      <AnimatePresence>
        {showSurprise && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
          >
            🎊 You found a secret! 🎊
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Sound Design (Optional)

```tsx
'use client'
import { useCallback, useRef } from 'react'

export function useSoundEffects() {
  const audioContext = useRef<AudioContext | null>(null)

  const playSound = useCallback((type: 'click' | 'success' | 'error') => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    const ctx = audioContext.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    const sounds = {
      click: { freq: 800, duration: 0.1 },
      success: { freq: 880, duration: 0.2 },
      error: { freq: 200, duration: 0.3 },
    }

    const { freq, duration } = sounds[type]
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  }, [])

  return { playSound }
}
```

## Validation

After implementing interactive UX:

1. **Purpose** → Every interaction enhances the experience
2. **Performance** → Effects don't cause jank or lag
3. **Accessibility** → Can be disabled, keyboard accessible
4. **Mobile** → Touch-friendly, no hover-dependent features
5. **Reduced motion** → Respects `prefers-reduced-motion`
6. **Not annoying** → Users can skip/dismiss, not blocking
7. **Memorable** → Creates positive emotional response
