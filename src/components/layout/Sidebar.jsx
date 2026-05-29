import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ListTodo, Music2, Brain, Timer,
  BookOpen, BarChart2, Wind, Star, Shield, X, Heart, Moon, Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',    group: 'main' },
  { to: '/todos',       icon: ListTodo,        label: 'To-Do List',   group: 'productivity' },
  { to: '/pomodoro',    icon: Timer,           label: 'Pomodoro',     group: 'productivity' },
  { to: '/habits',      icon: Zap,             label: 'Habit Tracker',group: 'productivity' },
  { to: '/meditation',  icon: Brain,           label: 'Meditation',   group: 'wellness' },
  { to: '/breathing',   icon: Wind,            label: 'Breathing',    group: 'wellness' },
  { to: '/music',       icon: Music2,          label: 'Music Zone',   group: 'wellness' },
  { to: '/sleep',       icon: Moon,            label: 'Sleep Sounds', group: 'wellness' },
  { to: '/mood',        icon: Heart,           label: 'Mood Log',     group: 'wellness' },
  { to: '/journal',     icon: BookOpen,        label: 'Journal',      group: 'wellness' },
  { to: '/affirmations',icon: Star,            label: 'Affirmations', group: 'wellness' },
  { to: '/stats',       icon: BarChart2,       label: 'My Progress',  group: 'profile' },
  { to: '/stats',       icon: BarChart2,       label: 'My Progress', group: 'profile' },
]

const GROUPS = {
  main: null,
  productivity: 'Productivity',
  wellness: 'Wellness',
  profile: 'Growth',
}

export default function Sidebar() {
  const { isAdmin } = useAuth()
  const { sidebarOpen, closeSidebar, sidebarCollapsed } = useUIStore()

  const grouped = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-16 bottom-0 z-40 overflow-y-auto"
            style={{
              width: 240,
              background: 'rgba(10, 15, 30, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid var(--border-glass)',
            }}
          >
            <div className="p-4">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-6">
                  {GROUPS[group] && (
                    <p className="section-title px-3 mb-2">
                      {GROUPS[group]}
                    </p>
                  )}

                  <div className="flex flex-col gap-0.5">
                    {items.map(({ to, icon: Icon, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                            isActive
                              ? 'text-white font-medium'
                              : 'hover:text-white'
                          )
                        }
                        style={({ isActive }) => ({
                          background: isActive
                            ? 'linear-gradient(135deg, rgba(124,158,245,0.2), rgba(167,139,250,0.15))'
                            : 'transparent',
                          color: isActive ? '#e8edf5' : 'var(--text-secondary)',
                          borderLeft: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                        })}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}

              {/* Admin link */}
              {isAdmin && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <p className="section-title px-3 mb-2">Admin</p>
                  <NavLink
                    to="/admin"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                        isActive ? 'text-white font-medium' : ''
                      )
                    }
                    style={({ isActive }) => ({
                      background: isActive
                        ? 'rgba(251,113,133,0.15)'
                        : 'transparent',
                      color: isActive ? '#fb7185' : 'var(--text-secondary)',
                    })}
                  >
                    <Shield size={16} />
                    <span>Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}