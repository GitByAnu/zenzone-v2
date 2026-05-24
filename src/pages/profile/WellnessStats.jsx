import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Calendar, Zap } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { moodService, getMoodByScore } from '@/services/mood.service'
import { todosService } from '@/services/todos.service'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { SkeletonGrid } from '@/components/ui/Skeleton'

export function WellnessStats() {
  const { userId } = useAuth()
  const [loading, setLoading]     = useState(true)
  const [moodHistory, setMoods]   = useState([])
  const [todoStats, setTodoStats] = useState(null)
  const [weekAvg, setWeekAvg]     = useState(null)

  useEffect(() => {
    if (!userId) return
    load()
  }, [userId])

  async function load() {
    setLoading(true)
    const [hist, todos, avg] = await Promise.all([
      moodService.getHistory(userId, 14),
      todosService.getStats(userId),
      moodService.getWeeklyAverage(userId),
    ])
    setMoods(hist.data ?? [])
    setTodoStats(todos)
    setWeekAvg(avg)
    setLoading(false)
  }

  if (loading) {
    return (
      <PageWrapper>
        <PageContainer className="max-w-3xl mx-auto">
          <PageHeader title="My Progress" subtitle="Your wellness journey at a glance" />
          <SkeletonGrid count={4} />
        </PageContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-3xl mx-auto">
        <PageHeader title="My Progress" subtitle="Your wellness journey at a glance" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BarChart2, label: 'Weekly mood avg', value: weekAvg ? `${weekAvg}/5` : '—', color: 'var(--accent-lavender)' },
            { icon: TrendingUp, label: 'Tasks completed', value: todoStats?.completed ?? 0, color: 'var(--accent-teal)' },
            { icon: Calendar,   label: 'Mood entries',   value: moodHistory.length, color: 'var(--accent-blue)' },
            { icon: Zap,        label: 'Total tasks',    value: todoStats?.total ?? 0, color: 'var(--accent-amber)' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card"
            >
              <s.icon size={18} className="mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-mono-zen font-medium" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mood timeline */}
        <div className="glass-card">
          <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Mood — last 14 days</p>
          {moodHistory.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
              Start logging your mood daily to see trends here.
            </p>
          ) : (
            <div className="flex items-end gap-1.5 h-24">
              {moodHistory.map((log, i) => {
                const m = getMoodByScore(log.mood_score)
                const height = (log.mood_score / 5) * 100
                return (
                  <motion.div
                    key={log.id}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: 'easeOut' }}
                    title={`${format(new Date(log.logged_at), 'MMM d')} · ${m.label}`}
                    className="flex-1 rounded-t-lg cursor-pointer"
                    style={{ background: m.color, opacity: 0.7, minHeight: 4 }}
                  />
                )
              })}
            </div>
          )}
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>14 days ago</span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Today</span>
          </div>
        </div>
      </PageContainer>
    </PageWrapper>
  )
}

export default WellnessStats
