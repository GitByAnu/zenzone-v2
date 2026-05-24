import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  error: null,

  // ─── Setters ───
  setUser: (user) => set({ user }),
  setProfile: (profile) =>
    set({ profile, isAdmin: profile?.is_admin ?? false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // ─── Actions ───
  initialize: async () => {
    set({ isLoading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        set({ user: session.user })
        await get().fetchProfile(session.user.id)
      }
    } catch (err) {
      console.error('Auth initialize error:', err)
      set({ error: err.message })
    } finally {
      set({ isLoading: false })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        set({ user: session.user })
        await get().fetchProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, profile: null, isAdmin: false })
      } else if (event === 'TOKEN_REFRESHED') {
        set({ user: session?.user ?? null })
      }
    })
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        set({ profile: data, isAdmin: data.is_admin ?? false })
      } else {
        // Profile doesn't exist yet — create it (first sign-in)
        await get().createProfile(userId)
      }
    } catch (err) {
      console.error('fetchProfile error:', err)
    }
  },

  createProfile: async (userId) => {
    const user = get().user
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Zen User',
        avatar_url: user?.user_metadata?.avatar_url ?? null,
        onboarded: false,
        theme: 'calm-night',
      })
      .select()
      .single()

    if (!error && data) {
      set({ profile: data, isAdmin: false })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, isAdmin: false, error: null })
  },

  updateProfile: async (updates) => {
    const userId = get().user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (!error && data) {
      set({ profile: data })
    }
    return { data, error }
  },
}))
