import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ListTodo, Brain, Music2, Timer, Wind, BookOpen, BarChart2, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { todosService } from '@/services/todos.service'
import { moodService, getMoodByScore } from '@/services/mood.service'
import { supabase } from '@/lib/supabase'
import PageWrapper, { PageContainer } from '@/components/layout/PageWrapper'
import { SkeletonGrid } from '@/components/ui/Skeleton'

const FEATURE_CARDS = [
  { to: '/todos',       icon: ListTodo, label: 'To-Do List',   desc: 'Manage your tasks',    color: 'var(--accent-blue)' },
  { to: '/pomodoro',    icon: Timer,    label: 'Pomodoro',      desc: 'Focus sessions',        color: 'var(--accent-lavender)' },
  { to: '/meditation',  icon: Brain,    label: 'Meditate',      desc: 'Guided sessions',       color: 'var(--accent-teal)' },
  { to: '/breathing',   icon: Wind,     label: 'Breathe',       desc: 'Calming exercises',     color: 'var(--accent-amber)' },
  { to: '/music',       icon: Music2,   label: 'Music Zone',    desc: 'Curated playlists',     color: 'var(--accent-blue)' },
  { to: '/mood',        icon: Heart,    label: 'Mood Log',      desc: 'How are you today?',    color: '#fb7185' },
  { to: '/journal',     icon: BookOpen, label: 'Journal',       desc: 'Reflect & write',       color: 'var(--accent-lavender)' },
  { to: '/stats',       icon: BarChart2,label: 'My Progress',   desc: 'Wellness insights',     color: 'var(--accent-teal)' },
]

const GREETINGS = {
  morning: ['Good morning', 'Rise and shine', 'Welcome to a new day'],
  afternoon: ['Good afternoon', 'How\'s your day going', 'Hope your afternoon is calm'],
  evening: ['Good evening', 'Wind down time', 'Time to reflect'],
  night: ['Good night', 'Rest well', 'A peaceful evening to you'],
}

function getGreeting(name) {
  const h = new Date().getHours()
  const period = h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night'
  const options = GREETINGS[period]
  const base = options[Math.floor(Math.random() * options.length)]
  return `${base}, ${name} 🌿`
}

function StatCard({ label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className="text-2xl font-mono-zen font-medium" style={{ color: color ?? 'var(--text-primary)' }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </motion.div>
  )
}

export default function Dashboard() {
  const { displayName, userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [todayMood, setTodayMood] = useState(null)
  const [affirmation, setAffirmation] = useState(null)
  const greeting = getGreeting(displayName)

  useEffect(() => {
    if (!userId) return
    loadDashboard()
  }, [userId])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [todoStats, mood, aff] = await Promise.all([
        todosService.getStats(userId),
        moodService.getToday(userId),
        fetchAffirmation(),
      ])
      setStats(todoStats)
      setTodayMood(mood.data)
      setAffirmation(aff)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAffirmation() {
    const { data } = await supabase
      .from('affirmations')
      .select('content, author')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(20)
    if (!data || data.length === 0) return null
    return data[Math.floor(Math.random() * data.length)]
  }

  const moodInfo = todayMood ? getMoodByScore(todayMood.mood_score) : null

  return (
    <PageWrapper>
      <PageContainer>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {greeting}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="Tasks pending"
              value={stats?.pending ?? 0}
              sub={`${stats?.completed ?? 0} completed`}
              color="var(--accent-blue)"
            />
            <StatCard
              label="Today's mood"
              value={moodInfo ? moodInfo.emoji : '—'}
              sub={moodInfo?.label ?? 'Not logged yet'}
              color={moodInfo?.color}
            />
            <StatCard
              label="Day"
              value={format(new Date(), 'EEEE')}
              sub="Focus & be present"
            />
            <StatCard
              label="Tasks done today"
              value={stats?.completed ?? 0}
              sub="Keep going!"
              color="var(--accent-teal)"
            />
          </div>
        )}

        {/* Affirmation */}
        {affirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card mb-8 text-center py-8"
            style={{ borderColor: 'rgba(167,139,250,0.15)' }}
          >
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent-lavender)' }}>
              Daily Affirmation
            </p>
            <blockquote className="font-display text-xl md:text-2xl font-normal italic" style={{ color: 'var(--text-primary)' }}>
              "{affirmation.content}"
            </blockquote>
            {affirmation.author && (
              <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                — {affirmation.author}
              </p>
            )}
          </motion.div>
        )}

        {/* Quick actions */}
        <div>
          <p className="section-title mb-4">Your Sanctuary</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  to={card.to}
                  className="glass flex flex-col items-start gap-3 p-4 rounded-2xl group"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${card.color}20`,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {card.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {card.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>
    </PageWrapper>
  )
}
