import { supabase } from '@/lib/supabase'

/**
 * All functions here require is_admin = true.
 * RLS policies enforce this at the database level too.
 */
export const adminService = {
  // ── Platform stats ───────────────────────────────────────────

  async getStats() {
    const [
      { count: userCount },
      { count: todoCount },
      { count: moodCount },
      { count: journalCount },
      { count: focusCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('todos').select('*', { count: 'exact', head: true }),
      supabase.from('mood_logs').select('*', { count: 'exact', head: true }),
      supabase.from('journal_entries').select('*', { count: 'exact', head: true }),
      supabase.from('focus_sessions').select('*', { count: 'exact', head: true }),
    ])
    return { userCount, todoCount, moodCount, journalCount, focusCount }
  },

  // ── Users ────────────────────────────────────────────────────

  async getAllUsers(limit = 100, offset = 0) {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, is_admin, onboarded, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error, count }
  },

  async setAdminRole(userId, isAdmin) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async deleteUser(userId) {
    // Deletes profile — cascades to all user data via FK constraints
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    return { error }
  },

  // ── Affirmations ─────────────────────────────────────────────

  async getAllAffirmations() {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createAffirmation({ content, author, category, createdBy }) {
    const { data, error } = await supabase
      .from('affirmations')
      .insert({ content, author, category, is_active: true, created_by: createdBy })
      .select()
      .single()
    return { data, error }
  },

  async updateAffirmation(id, updates) {
    const { data, error } = await supabase
      .from('affirmations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteAffirmation(id) {
    const { error } = await supabase.from('affirmations').delete().eq('id', id)
    return { error }
  },

  async toggleAffirmation(id, current) {
    return adminService.updateAffirmation(id, { is_active: !current })
  },

  // ── Recent activity (for dashboard feed) ─────────────────────

  async getRecentActivity(limit = 20) {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('id, mood_score, mood_label, logged_at, profiles(display_name)')
      .order('logged_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },
}