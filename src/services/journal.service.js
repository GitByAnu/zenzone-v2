import { supabase } from '@/lib/supabase'

export const journalService = {
  async getAll(userId, limit = 20, offset = 0) {
    const { data, error, count } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error, count }
  },

  async getOne(id) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(userId, { title, content, mood_score, tags = [], is_private = true }) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ user_id: userId, title, content, mood_score, tags, is_private })
      .select()
      .single()
    return { data, error }
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id)
    return { error }
  },

  async search(userId, query) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    return { data, error }
  },
}
