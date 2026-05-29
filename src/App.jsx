import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

import AmbientBackground from '@/components/shared/AmbientBackground'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

// Pages
import Landing          from '@/pages/Landing'
import Login            from '@/pages/auth/Login'
import Register         from '@/pages/auth/Register'
import Dashboard        from '@/pages/Dashboard'
import TodoList         from '@/pages/productivity/TodoList'
import PomodoroTimer    from '@/pages/productivity/PomodoroTimer'
import HabitTracker     from '@/pages/productivity/HabitTracker'
import MeditationHub    from '@/pages/meditation/MeditationHub'
import BreathingExercise from '@/pages/wellness/BreathingExercise'
import MusicZone        from '@/pages/music/MusicZone'
import MoodTracker      from '@/pages/wellness/MoodTracker'
import Journal          from '@/pages/wellness/Journal'
import Affirmations     from '@/pages/wellness/Affirmations'
import SleepSounds      from '@/pages/wellness/SleepSounds'
import ForgotPassword   from '@/pages/auth/ForgotPassword'
import UserProfile      from '@/pages/profile/UserProfile'
import WellnessStats    from '@/pages/profile/WellnessStats'
import AdminDashboard   from '@/pages/admin/AdminDashboard'
import NotFound         from '@/pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected */}
        <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/todos"           element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
        <Route path="/pomodoro"        element={<ProtectedRoute><PomodoroTimer /></ProtectedRoute>} />
        <Route path="/habits"          element={<ProtectedRoute><HabitTracker /></ProtectedRoute>} />
        <Route path="/meditation"      element={<ProtectedRoute><MeditationHub /></ProtectedRoute>} />
        <Route path="/breathing"       element={<ProtectedRoute><BreathingExercise /></ProtectedRoute>} />
        <Route path="/music"           element={<ProtectedRoute><MusicZone /></ProtectedRoute>} />
        <Route path="/sleep-sounds"    element={<ProtectedRoute><SleepSounds /></ProtectedRoute>} />
        <Route path="/mood"            element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
        <Route path="/journal"         element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/affirmations"    element={<ProtectedRoute><Affirmations /></ProtectedRoute>} />
        <Route path="/profile"         element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/stats"           element={<ProtectedRoute><WellnessStats /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin"           element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/*"         element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*"                element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppInitializer() {
  const initialize = useAuthStore((s) => s.initialize)
  const { theme } = useUIStore()

  useEffect(() => {
    // Apply saved theme on load
    document.documentElement.setAttribute('data-theme', theme)
    // Init auth listener
    initialize()
  }, [])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <AmbientBackground />
      <Navbar />
      <Sidebar />
      <AnimatedRoutes />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            backdropFilter: 'blur(20px)',
          },
          success: {
            iconTheme: { primary: 'var(--accent-teal)', secondary: 'var(--bg-secondary)' },
          },
          error: {
            iconTheme: { primary: '#fb7185', secondary: 'var(--bg-secondary)' },
          },
        }}
      />
    </BrowserRouter>
  )
}
