import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Flame, Check } from 'lucide-react'
import { format, subDays } from 'date-fns'
import toast from 'react-hot-toast'
import { habitsService } from '@/services/habits.service'
import { useAuth } from '@/hooks/useAuth'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'

const COLORS = [
  { label: 'Teal',    value: '#5eead4' },
  { label: 'Blue',    value: '#7c9ef5' },
  { label: 'Lavender',value: '#a78bfa' },
  { label: 'Amber',   value: '#f0b97a' },
  { label: 'Rose',    value: '#fb7185' },
  { label: 'Green',   value: '#86efac' },
]

const EMOJIS = ['✨', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '🎨', '🎵', '🌿', '❤️']

// Build last-N-days grid
function buildGrid(completions, days = 21) {
  const today = new Date()
  const grid = []
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(today, i), 'yyyy-MM-dd')
    grid.push({ date: d, done: completions?.some((c) => c.completed_date === d) ?? false })
  }
  return grid
}

function HabitRow({ habit, onToggle, onDelete }) {
  const grid = buildGrid(habit.habit_completions)
  const streak = habitsService.getStreak(habit.habit_completions)
  const todayDone = habitsService.isTodayComplete(habit.habit_completions)
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-sm p-4 group"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Today toggle */}
        <button
          onClick={() => onToggle(habit.id, todayDone)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: todayDone ? `${habit.color}30` : 'var(--bg-glass)',
            border: `2px solid ${todayDone ? habit.color : 'var(--border-glass)'}`,
          }}
          aria-label={todayDone ? 'Mark incomplete' : 'Mark complete for today'}
        >
          {todayDone
            ? <Check size={16} style={{ color: habit.color }} />
            : <span style={{ fontSize: 16 }}>{habit.emoji}</span>
          }
        </button>

        {/* Name + streak */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {habit.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Flame size={11} style={{ color: habit.color }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {streak.current > 0 ? `${streak.current}-day streak` : 'Start today'}
            </span>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(habit.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label="Delete habit"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 21-day grid */}
      <div className="flex gap-1 flex-wrap">
        {grid.map((cell) => (
          <div
            key={cell.date}
            title={cell.date}
            className="habit-cell"
            style={cell.done ? { background: habit.color, boxShadow: `0 0 6px ${habit.color}60` } : {}}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <span>Best: {streak.longest} days</span>
        <span>Total: {habit.habit_completions?.length ?? 0} completions</span>
      </div>
    </motion.div>
  )
}

export default function HabitTracker() {
  const { userId } = useAuth()
  const [habits,   setHabits]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)

  // Form
  const [name,      setName]      = useState('')
  const [emoji,     setEmoji]     = useState('✨')
  const [color,     setColor]     = useState('#5eead4')
  const [frequency, setFrequency] = useState('daily')

  useEffect(() => { if (userId) load() }, [userId])

  async function load() {
    setLoading(true)
    const { data } = await habitsService.getAll(userId)
    setHabits(data ?? [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const { data, error } = await habitsService.create(userId, { name: name.trim(), emoji, color, frequency })
    if (error) {
      toast.error('Could not add habit.')
    } else {
      setHabits((prev) => [...prev, { ...data, habit_completions: [] }])
      setName(''); setEmoji('✨'); setColor('#5eead4')
      setShowForm(false)
      toast.success('Habit added 🌱')
    }
    setSaving(false)
  }

  async function handleToggle(habitId, currentlyDone) {
    // Optimistic update
    const today = format(new Date(), 'yyyy-MM-dd')
    setHabits((prev) => prev.map((h) => {
      if (h.id !== habitId) return h
      const completions = currentlyDone
        ? (h.habit_completions ?? []).filter((c) => c.completed_date !== today)
        : [...(h.habit_completions ?? []), { completed_date: today }]
      return { ...h, habit_completions: completions }
    }))

    const { error } = await habitsService.toggleToday(habitId, userId, currentlyDone)
    if (error) {
      toast.error('Could not update habit.')
      load()
    }
  }

  async function handleDelete(habitId) {
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
    const { error } = await habitsService.delete(habitId)
    if (error) { toast.error('Could not delete.'); load() }
  }

  const todayCount = habits.filter((h) => habitsService.isTodayComplete(h.habit_completions)).length

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="Habit Tracker"
          subtitle="Small daily actions compound into big change"
          action={
            <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
              <Plus size={16} />
              Add Habit
            </button>
          }
        />

        {/* Today progress */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card mb-6 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(94,234,212,0.15)', border: '1px solid rgba(94,234,212,0.2)' }}
            >
              {todayCount === habits.length ? '🎉' : '🌱'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {todayCount === habits.length
                  ? 'All habits complete for today!'
                  : `${todayCount} of ${habits.length} habits done today`}
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${habits.length ? (todayCount / habits.length) * 100 : 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleAdd}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="glass-card overflow-hidden"
            >
              <p className="section-title mb-4">New Habit</p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning meditation, Drink 2L water"
                className="input-zen mb-4"
                autoFocus
              />

              {/* Emoji picker */}
              <div className="mb-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Icon</p>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200"
                      style={{
                        background: emoji === em ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
                        border: `1px solid ${emoji === em ? 'var(--accent-blue)' : 'var(--border-glass)'}`,
                        transform: emoji === em ? 'scale(1.2)' : 'scale(1)',
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div className="mb-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Color</p>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className="w-7 h-7 rounded-full transition-all duration-200"
                      title={c.label}
                      style={{
                        background: c.value,
                        transform: color === c.value ? 'scale(1.3)' : 'scale(1)',
                        boxShadow: color === c.value ? `0 0 10px ${c.value}80` : 'none',
                        outline: color === c.value ? `2px solid ${c.value}` : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Frequency</p>
                <div className="flex gap-2">
                  {['daily', 'weekly'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className="px-4 py-1.5 rounded-xl text-sm capitalize transition-all duration-200"
                      style={{
                        background: frequency === f ? 'rgba(124,158,245,0.15)' : 'var(--bg-glass)',
                        color: frequency === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        border: `1px solid ${frequency === f ? 'rgba(124,158,245,0.3)' : 'var(--border-glass)'}`,
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={saving || !name.trim()} className="btn-primary flex-1 justify-center">
                  {saving ? 'Adding...' : 'Add Habit'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Habit list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-16"
          >
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
              Plant your first habit
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Consistency is the foundation of every transformation.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={15} />
              Add Your First Habit
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </PageContainer>
    </PageWrapper>
  )
}