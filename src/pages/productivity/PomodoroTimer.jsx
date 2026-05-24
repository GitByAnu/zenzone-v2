import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react'
import { usePomodoro } from '@/hooks/usePomodoro'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import clsx from 'clsx'

const MODE_LABELS = {
  work: { label: 'Focus', color: 'var(--accent-blue)', icon: Zap },
  break: { label: 'Short Break', color: 'var(--accent-teal)', icon: Coffee },
  'long-break': { label: 'Long Break', color: 'var(--accent-lavender)', icon: Coffee },
}

export default function PomodoroPage() {
  const {
    mode, formattedTime, isRunning, sessions,
    progress, taskDescription, setTaskDescription,
    start, pause, reset, switchMode,
  } = usePomodoro()

  const { color, label, icon: ModeIcon } = MODE_LABELS[mode] ?? MODE_LABELS.work

  // SVG ring math
  const r = 90
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (progress / 100) * circ

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="Pomodoro Timer"
          subtitle="Structured focus sessions for deep work"
        />

        {/* Mode tabs */}
        <div className="flex gap-2 mb-8">
          {Object.entries(MODE_LABELS).map(([m, info]) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={clsx(
                'flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200',
                mode === m ? 'text-white' : ''
              )}
              style={{
                background: mode === m ? `${info.color}25` : 'var(--bg-glass)',
                border: `1px solid ${mode === m ? info.color : 'var(--border-glass)'}`,
                color: mode === m ? info.color : 'var(--text-secondary)',
              }}
            >
              {info.label}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative" style={{ width: 240, height: 240 }}>
            <svg width="240" height="240" viewBox="0 0 240 240" aria-label="Timer progress">
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor="var(--accent-lavender)" />
                </linearGradient>
              </defs>
              {/* Background ring */}
              <circle
                cx="120" cy="120" r={r}
                fill="none"
                stroke="var(--border-glass)"
                strokeWidth="8"
              />
              {/* Progress ring */}
              <motion.circle
                cx="120" cy="120" r={r}
                fill="none"
                stroke="url(#timerGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 120 120)"
                initial={false}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.8, ease: 'linear' }}
              />
            </svg>

            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <ModeIcon size={14} style={{ color }} />
                <span className="text-xs font-medium" style={{ color }}>
                  {label}
                </span>
              </div>
              <div
                className="text-5xl font-mono-zen font-medium tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {formattedTime}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {sessions} {sessions === 1 ? 'session' : 'sessions'} today
              </div>
            </div>
          </div>

          {/* Task input */}
          <div className="w-full max-w-sm">
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="What are you focusing on?"
              className="input-zen text-center text-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={reset} className="btn-ghost !p-3" aria-label="Reset timer">
              <RotateCcw size={18} />
            </button>

            <button
              onClick={isRunning ? pause : start}
              className="btn-primary !px-10 !py-4 text-base"
              style={{ background: `linear-gradient(135deg, ${color}, var(--accent-lavender))` }}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pause' : 'Start Focus'}
            </button>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card w-full max-w-sm text-center py-4"
          >
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'work'
                ? '🎯 Silence notifications. Focus fully for 25 minutes.'
                : mode === 'break'
                ? '🌿 Step away. Stretch, breathe, hydrate.'
                : '🌙 Great work! Enjoy a longer rest — you\'ve earned it.'}
            </p>
          </motion.div>
        </div>
      </PageContainer>
    </PageWrapper>
  )
}
