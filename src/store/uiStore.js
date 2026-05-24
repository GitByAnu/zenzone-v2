import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const THEMES = ['calm-night', 'morning-mist', 'forest-deep']

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'calm-night',
      sidebarOpen: false,
      sidebarCollapsed: false,
      ambientSound: null,       // null | 'rain' | 'forest' | 'ocean' | 'cafe'
      ambientVolume: 0.4,
      isMuted: false,
      activeSection: 'dashboard',

      // ─── Theme ───
      setTheme: (theme) => {
        if (!THEMES.includes(theme)) return
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },

      cycleTheme: () => {
        const current = get().theme
        const idx = THEMES.indexOf(current)
        const next = THEMES[(idx + 1) % THEMES.length]
        get().setTheme(next)
      },

      // ─── Sidebar ───
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ─── Ambient Sound ───
      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setAmbientVolume: (vol) => set({ ambientVolume: Math.max(0, Math.min(1, vol)) }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      stopAmbient: () => set({ ambientSound: null }),

      // ─── Navigation ───
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: 'zenzone-ui',
      partialize: (state) => ({
        theme: state.theme,
        ambientVolume: state.ambientVolume,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
