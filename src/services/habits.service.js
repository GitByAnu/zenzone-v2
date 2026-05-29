import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { calculateStreak } from '@/utils/streakCalculator'

export const habitsService = {
  // ── Habits CRUD ────────────────────────────────────────────

  async getAll(userId) {
    const { data, error } = await supabase
      .from('habits')
      .select('*, habit_completions(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  async create(userId, { name, emoji = '✨', frequency = 'daily', color = 'var(--accent-teal)' }) {
    const { data, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, name, emoji, frequency, color })
      .select()
      .single()
    return { data, error }
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async archive(id) {
    return habitsService.update(id, { is_active: false })
  },

  async delete(id) {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    return { error }
  },

  // ── Completions ─────────────────────────────────────────────

  async markComplete(habitId, userId, date = new Date()) {
    const completed_date = format(date, 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({ habit_id: habitId, user_id: userId, completed_date })
      .select()
      .single()
    return { data, error }
  },

  async markIncomplete(habitId, date = new Date()) {
    const completed_date = format(date, 'yyyy-MM-dd')
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', completed_date)
    return { error }
  },

  async toggleToday(habitId, userId, currentlyDone) {
    if (currentlyDone) {
      return habitsService.markIncomplete(habitId)
    } else {
      return habitsService.markComplete(habitId, userId)
    }
  },

  async getCompletions(habitId, days = 30) {
    const since = format(new Date(Date.now() - days * 86400000), 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('habit_completions')
      .select('completed_date')
      .eq('habit_id', habitId)
      .gte('completed_date', since)
      .order('completed_date', { ascending: false })
    return { data, error }
  },

  // ── Streak helpers ──────────────────────────────────────────

  getStreak(completions) {
    if (!completions) return { current: 0, longest: 0, lastActive: null }
    const dates = completions.map((c) => c.completed_date)
    return calculateStreak(dates)
  },

  isTodayComplete(completions) {
    const today = format(new Date(), 'yyyy-MM-dd')
    return completions?.some((c) => c.completed_date === today) ?? false
  },
}