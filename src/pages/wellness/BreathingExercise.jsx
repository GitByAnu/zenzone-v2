import { useState } from 'react'
import { motion } from 'framer-motion'
import BreathingRing, { PATTERNS } from '@/components/shared/BreathingRing'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import clsx from 'clsx'

export default function BreathingPage() {
  const [selected, setSelected] = useState('4-7-8')

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="Breathing"
          subtitle="Activate your calm with guided breath patterns"
        />

        {/* Pattern selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {Object.entries(PATTERNS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={clsx(
                'glass text-left p-4 rounded-2xl transition-all duration-200',
                selected === key ? 'ring-1' : ''
              )}
              style={{
                ringColor: p.color,
                borderColor: selected === key ? p.color : 'var(--border-glass)',
                boxShadow: selected === key ? `0 0 20px ${p.color}25` : 'none',
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: selected === key ? p.color : 'var(--text-primary)' }}>
                {p.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {p.description}
              </p>
              <div className="flex gap-2 mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>In: {p.inhale}s</span>
                {p.hold && <span>Hold: {p.hold}s</span>}
                <span>Out: {p.exhale}s</span>
              </div>
            </button>
          ))}
        </div>

        {/* The breathing ring */}
        <div className="flex justify-center mb-10">
          <BreathingRing pattern={selected} size={260} />
        </div>

        {/* Guide text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card text-center"
        >
          <p className="font-display text-lg font-normal italic mb-2" style={{ color: 'var(--text-primary)' }}>
            "The breath is the bridge between mind and body."
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Tap the ring to begin. Breathe naturally at first, then follow the rhythm.
          </p>
        </motion.div>
      </PageContainer>
    </PageWrapper>
  )
}
