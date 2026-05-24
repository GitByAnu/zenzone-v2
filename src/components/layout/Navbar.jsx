import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Sunset, Moon, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import clsx from 'clsx'

const THEME_ICONS = {
  'calm-night': Moon,
  'morning-mist': Sun,
  'forest-deep': Sunset,
}
const THEME_LABELS = {
  'calm-night': 'Calm Night',
  'morning-mist': 'Morning Mist',
  'forest-deep': 'Forest Deep',
}

export default function Navbar() {
  const { isAuthenticated, displayName, avatarUrl, signOut } = useAuth()
  const { theme, cycleTheme, sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  const ThemeIcon = THEME_ICONS[theme] ?? Moon

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 15, 30, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      <nav className="flex items-center justify-between px-4 md:px-8 h-16">
        {/* Left: Logo + sidebar toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="btn-ghost !px-2.5 !py-2"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
                boxShadow: '0 0 20px rgba(124,158,245,0.3)',
              }}
            >
              🌿
            </div>
            <span
              className="text-lg font-display font-semibold hidden sm:block"
              style={{ color: 'var(--text-primary)' }}
            >
              ZenZone
            </span>
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded hidden sm:block"
              style={{
                background: 'rgba(124,158,245,0.1)',
                color: 'var(--accent-blue)',
                border: '1px solid rgba(124,158,245,0.2)',
              }}
            >
              V2
            </span>
          </Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="btn-ghost !px-2.5 !py-2"
            title={`Theme: ${THEME_LABELS[theme]}`}
            aria-label="Cycle theme"
          >
            <ThemeIcon size={16} style={{ color: 'var(--accent-blue)' }} />
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn-ghost !px-2.5 !py-2" title="Profile">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
                      color: '#fff',
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>

              <button
                onClick={signOut}
                className="btn-ghost !px-2.5 !py-2"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm !py-2">
                Begin Journey
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
