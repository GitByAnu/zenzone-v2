import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PATTERNS = {
  '4-7-8': {
    name: '4-7-8 Relaxation',
    inhale: 4, hold: 7, exhale: 8,
    description: 'Reduces anxiety, aids sleep',
    color: 'var(--accent-lavender)',
  },
  'box': {
    name: 'Box Breathing',
    inhale: 4, hold: 4, exhale: 4, holdOut: 4,
    description: 'Used by Navy SEALs for calm focus',
    color: 'var(--accent-blue)',
  },
  '2:1': {
    name: '2:1 Calming',
    inhale: 4, exhale: 8,
    description: 'Activates parasympathetic system',
    color: 'var(--accent-teal)',
  },
}

const PHASES = {
  inhale: { label: 'Breathe In', scale: 1.6, opacity: 1 },
  hold:   { label: 'Hold', scale: 1.6, opacity: 0.8 },
  exhale: { label: 'Breathe Out', scale: 1.0, opacity: 0.6 },
  holdOut:{ label: 'Hold', scale: 1.0, opacity: 0.5 },
}

export default function BreathingRing({ pattern: patternKey = '4-7-8', size = 220 }) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale')
  const [countdown, setCountdown] = useState(0)
  const [cycles, setCycles] = useState(0)
  const pattern = PATTERNS[patternKey] ?? PATTERNS['4-7-8']
  const timerRef = useRef(null)

  const getPhaseSequence = () => {
    const seq = [
      { key: 'inhale', dur: pattern.inhale },
    ]
    if (pattern.hold)    seq.push({ key: 'hold',    dur: pattern.hold })
    seq.push({ key: 'exhale', dur: pattern.exhale })
    if (pattern.holdOut) seq.push({ key: 'holdOut', dur: pattern.holdOut })
    return seq
  }

  useEffect(() => {
    if (!isActive) {
      clearTimeout(timerRef.current)
      setPhase('inhale')
      setCountdown(pattern.inhale)
      return
    }

    const sequence = getPhaseSequence()
    let seqIdx = 0
    let remaining = sequence[0].dur

    setPhase(sequence[0].key)
    setCountdown(sequence[0].dur)

    const tick = () => {
      remaining -= 1
      setCountdown(remaining)

      if (remaining <= 0) {
        seqIdx = (seqIdx + 1) % sequence.length
        if (seqIdx === 0) setCycles((c) => c + 1)
        remaining = sequence[seqIdx].dur
        setPhase(sequence[seqIdx].key)
        setCountdown(remaining)
      }

      timerRef.current = setTimeout(tick, 1000)
    }

    timerRef.current = setTimeout(tick, 1000)
    return () => clearTimeout(timerRef.current)
  }, [isActive, patternKey])

  const phaseInfo = PHASES[phase] ?? PHASES.inhale

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ring */}
      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{ width: size, height: size }}
        onClick={() => setIsActive((a) => !a)}
        role="button"
        aria-label={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${pattern.color}20, transparent 70%)`,
          }}
          animate={isActive ? {
            scale: phaseInfo.scale,
            opacity: phaseInfo.opacity,
          } : { scale: 1, opacity: 0.4 }}
          transition={{
            duration: phaseInfo.label === 'Breathe In' ? pattern.inhale
                    : phaseInfo.label === 'Breathe Out' ? (pattern.exhale || 8)
                    : 0.1,
            ease: 'easeInOut',
          }}
        />

        {/* Main ring */}
        <motion.div
          className="absolute rounded-full border-2"
          style={{
            inset: size * 0.1,
            borderColor: pattern.color,
            boxShadow: `0 0 30px ${pattern.color}40`,
          }}
          animate={isActive ? {
            scale: phaseInfo.scale * 0.9,
            opacity: phaseInfo.opacity,
          } : { scale: 1, opacity: 0.3 }}
          transition={{
            duration: phaseInfo.label === 'Breathe In' ? pattern.inhale
                    : phaseInfo.label === 'Breathe Out' ? (pattern.exhale || 8)
                    : 0.1,
            ease: 'easeInOut',
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: size * 0.25,
            background: `radial-gradient(circle, ${pattern.color}30, ${pattern.color}05)`,
          }}
          animate={isActive ? {
            scale: phaseInfo.scale * 0.7,
          } : { scale: 1 }}
          transition={{
            duration: phaseInfo.label === 'Breathe In' ? pattern.inhale
                    : phaseInfo.label === 'Breathe Out' ? (pattern.exhale || 8)
                    : 0.1,
            ease: 'easeInOut',
          }}
        />

        {/* Center content */}
        <div className="relative text-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="text-sm font-medium mb-1"
                style={{ color: pattern.color }}
              >
                {isActive ? phaseInfo.label : 'Tap to begin'}
              </div>
              {isActive && (
                <div
                  className="text-3xl font-mono-zen font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {countdown}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Cycle counter */}
      {isActive && cycles > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="badge badge-blue"
        >
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
        </motion.div>
      )}
    </div>
  )
}

export { PATTERNS }
