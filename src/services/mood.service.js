import { supabase } from '@/lib/supabase'
import { subDays, format, startOfDay, endOfDay } from 'date-fns'

export const moodService = {
  async log(userId, { mood_score, mood_label, energy_level, notes, tags = [] }) {
    const { data, error } = await supabase
      .from('mood_logs')
      .insert({ user_id: userId, mood_score, mood_label, energy_level, notes, tags })
      .select()
      .single()
    return { data, error }
  },

  async getToday(userId) {
    const today = new Date()
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfDay(today).toISOString())
      .lte('logged_at', endOfDay(today).toISOString())
      .order('logged_at', { ascending: false })
      .limit(1)
    return { data: data?.[0] ?? null, error }
  },

  async getHistory(userId, days = 30) {
    const since = subDays(new Date(), days)
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: true })
    return { data, error }
  },

  async getWeeklyAverage(userId) {
    const { data } = await moodService.getHistory(userId, 7)
    if (!data || data.length === 0) return null
    const avg = data.reduce((sum, l) => sum + l.mood_score, 0) / data.length
    return Math.round(avg * 10) / 10
  },
}

// Mood metadata helpers
export const MOODS = [
  { score: 1, label: 'Awful',   emoji: '😔', color: '#fb7185' },
  { score: 2, label: 'Bad',     emoji: '😟', color: '#f97316' },
  { score: 3, label: 'Okay',    emoji: '😐', color: '#f0b97a' },
  { score: 4, label: 'Good',    emoji: '🙂', color: '#5eead4' },
  { score: 5, label: 'Amazing', emoji: '😄', color: '#7c9ef5' },
]

export function getMoodByScore(score) {
  return MOODS.find((m) => m.score === score) ?? MOODS[2]
}
