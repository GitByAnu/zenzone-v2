import { useAuthStore } from '@/store/authStore'

/**
 * Convenience hook for auth state.
 * Prefer this over useAuthStore directly in components.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const signOut = useAuthStore((s) => s.signOut)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  return {
    user,
    profile,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    signOut,
    updateProfile,
    userId: user?.id ?? null,
    displayName: profile?.display_name ?? user?.email?.split('@')[0] ?? 'Guest',
    avatarUrl: profile?.avatar_url ?? null,
    theme: profile?.theme ?? 'calm-night',
  }
}
