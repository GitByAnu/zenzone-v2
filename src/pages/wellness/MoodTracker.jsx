import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { moodService, MOODS, getMoodByScore } from '@/services/mood.service'
import { useAuth } from '@/hooks/useAuth'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'

export default function MoodTracker() {
  const { userId } = useAuth()
  const [selectedMood, setSelectedMood] = useState(null)
  const [energy, setEnergy] = useState(3)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [todayLog, setTodayLog] = useState(null)
  const [history, setHistory] = useState([])
  const [histLoading, setHistLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  async function loadData() {
    setHistLoading(true)
    const [today, hist] = await Promise.all([
      moodService.getToday(userId),
      moodService.getHistory(userId, 14),
    ])
    if (today.data) {
      setTodayLog(today.data)
      setDone(true)
    }
    setHistory(hist.data ?? [])
    setHistLoading(false)
  }

  async function handleSubmit() {
    if (!selectedMood) {
      toast.error('Please select how you\'re feeling.')
      return
    }
    setLoading(true)
    const moodInfo = getMoodByScore(selectedMood)
    const { error } = await moodService.log(userId, {
      mood_score: selectedMood,
      mood_label: moodInfo.label,
      energy_level: energy,
      notes,
    })
    if (error) {
      toast.error('Could not save mood log.')
    } else {
      toast.success('Mood logged 💜')
      setDone(true)
      loadData()
    }
    setLoading(false)
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader title="Mood Log" subtitle="Track how you feel each day" />

        {/* Log form */}
        <AnimatePresence mode="wait">
          {done && todayLog ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card mb-8 text-center py-8"
            >
              <div className="text-5xl mb-3">{getMoodByScore(todayLog.mood_score).emoji}</div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Today you felt <strong>{getMoodByScore(todayLog.mood_score).label}</strong>
              </p>
              {todayLog.notes && (
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  "{todayLog.notes}"
                </p>
              )}
              <p className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Logged at {format(new Date(todayLog.logged_at), 'h:mm a')}
              </p>
              <button
                onClick={() => { setDone(false); setTodayLog(null); setSelectedMood(null); setNotes('') }}
                className="btn-ghost mt-4 text-xs"
              >
                Log again
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card mb-8">
              <p className="font-display text-lg mb-6" style={{ color: 'var(--text-primary)' }}>
                How are you feeling right now?
              </p>

              {/* Mood selector */}
              <div className="flex justify-between gap-2 mb-6">
                {MOODS.map((mood) => (
                  <button
                    key={mood.score}
                    onClick={() => setSelectedMood(mood.score)}
                    className={`mood-btn flex-1 ${selectedMood === mood.score ? 'selected' : ''}`}
                    style={selectedMood === mood.score ? { borderColor: mood.color, boxShadow: `0 0 20px ${mood.color}30` } : {}}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Energy */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Energy level
                  </label>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>
                    {energy}/5
                  </span>
                </div>
                <input
                  type="range"
                  min={1} max={5}
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-zen-blue"
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              {/* Notes */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything on your mind? (optional)"
                rows={3}
                className="input-zen resize-none mb-4"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !selectedMood}
                className="btn-primary w-full justify-center"
              >
                {loading ? 'Saving...' : 'Log Mood'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <div>
          <p className="section-title mb-4">Last 14 days</p>
          {histLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
              No mood logs yet. Start tracking to see your history here.
            </p>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((log) => {
                const m = getMoodByScore(log.mood_score)
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-sm flex items-center gap-4 p-4"
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {m.label}
                        <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                          Energy: {log.energy_level}/5
                        </span>
                      </p>
                      {log.notes && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                          {log.notes}
                        </p>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {format(new Date(log.logged_at), 'MMM d')}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </PageWrapper>
  )
}
