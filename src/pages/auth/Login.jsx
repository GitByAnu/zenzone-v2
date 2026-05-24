import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import PageWrapper from '@/components/layout/PageWrapper'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await authService.signIn(form)

    if (error) {
      toast.error(error.message ?? 'Sign in failed. Please check your credentials.')
    } else {
      toast.success('Welcome back 🌿')
      navigate(from, { replace: true })
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await authService.signInWithGoogle()
    if (error) {
      toast.error('Google sign in failed.')
      setGoogleLoading(false)
    }
    // On success, Supabase redirects automatically
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
                boxShadow: '0 0 40px rgba(124,158,245,0.3)',
              }}
            >
              🌿
            </div>
            <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your sanctuary
            </p>
          </div>

          {/* Card */}
          <div className="glass-card">
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full btn-ghost justify-center mb-6 py-3"
            >
              {googleLoading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <Chrome size={16} />
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="divider flex-1" />
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
              <div className="divider flex-1" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="input-zen pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs hover:underline"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="input-zen pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              New to ZenZone?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{ color: 'var(--accent-blue)' }}>
                Begin your journey →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
