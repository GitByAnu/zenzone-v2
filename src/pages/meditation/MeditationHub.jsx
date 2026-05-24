import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Brain } from 'lucide-react'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import BreathingRing from '@/components/shared/BreathingRing'

const SESSIONS = [
  { id: '1', title: 'Morning Calm',     duration: 5,  desc: 'Gentle awakening for the day ahead',         emoji: '🌅' },
  { id: '2', title: 'Stress Relief',    duration: 10, desc: 'Release tension and restore inner peace',     emoji: '🍃' },
  { id: '3', title: 'Deep Focus',       duration: 15, desc: 'Sharpen attention and clear mental fog',      emoji: '🎯' },
  { id: '4', title: 'Sleep Prep',       duration: 20, desc: 'Wind down and prepare for restful sleep',     emoji: '🌙' },
  { id: '5', title: 'Loving Kindness',  duration: 10, desc: 'Cultivate compassion for self and others',    emoji: '💜' },
  { id: '6', title: 'Body Scan',        duration: 15, desc: 'Release physical tension from head to toe',   emoji: '✨' },
]

function useTimer(durationMinutes) {
  const [running, setRunning] = useState(false)
  const [secs, setSecs] = useState(durationMinutes * 60)
  const total = durationMinutes * 60
  const pct = ((total - secs) / total) * 100
  const fmt = `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`

  const start = () => {
    setRunning(true)
    const interval = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) { clearInterval(interval); setRunning(false); return 0 }
        return s - 1
      })
    }, 1000)
    return interval
  }
  const reset = () => { setRunning(false); setSecs(durationMinutes * 60) }

  return { running, secs, pct, fmt, start, pause: () => setRunning(false), reset }
}

export default function MeditationHub() {
  const [active, setActive] = useState(null)

  if (active) {
    return (
      <PageWrapper>
        <PageContainer className="max-w-xl mx-auto text-center">
          <button onClick={() => setActive(null)} className="btn-ghost mb-8">← Back</button>
          <div className="text-4xl mb-2">{active.emoji}</div>
          <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {active.title}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{active.desc}</p>
          <div className="flex justify-center mb-8">
            <BreathingRing pattern="2:1" size={220} />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {active.duration}-minute session · Follow the breathing ring
          </p>
        </PageContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-3xl mx-auto">
        <PageHeader title="Meditation" subtitle="Guided sessions for inner peace" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SESSIONS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setActive(s)}
              className="glass text-left p-5 rounded-2xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-3xl mb-3">{s.emoji}</div>
              <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              <span className="badge badge-blue">{s.duration} min</span>
            </motion.button>
          ))}
        </div>
      </PageContainer>
    </PageWrapper>
  )
}
