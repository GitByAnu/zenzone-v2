import { supabase } from '@/lib/supabase'

export const todosService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(userId, { title, description, priority = 'medium', category, due_date }) {
    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id: userId, title, description, priority, category, due_date })
      .select()
      .single()
    return { data, error }
  },

  async toggle(id, completed) {
    const { data, error } = await supabase
      .from('todos')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    return { error }
  },

  async getStats(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('completed')
      .eq('user_id', userId)

    if (error) return { total: 0, completed: 0, pending: 0 }
    const total = data.length
    const completed = data.filter((t) => t.completed).length
    return { total, completed, pending: total - completed }
  },
}
