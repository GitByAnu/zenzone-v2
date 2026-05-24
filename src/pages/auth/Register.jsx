import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import PageWrapper from '@/components/layout/PageWrapper'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ displayName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)

    const { error } = await authService.signUp(form)

    if (error) {
      toast.error(error.message ?? 'Registration failed.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    const { error } = await authService.signInWithGoogle()
    if (error) toast.error('Google sign up failed.')
  }

  if (done) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full text-center"
          >
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-display text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We sent a confirmation link to <strong>{form.email}</strong>.<br />
              Click it to activate your sanctuary.
            </p>
            <Link to="/login" className="btn-ghost inline-flex mt-6">
              Back to Sign In
            </Link>
          </motion.div>
        </div>
      </PageWrapper>
    )
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
              Create your sanctuary
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Start your wellness journey today
            </p>
          </div>

          <div className="glass-card">
            <button
              onClick={handleGoogle}
              className="w-full btn-ghost justify-center mb-6 py-3"
            >
              <Chrome size={16} />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="divider flex-1" />
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
              <div className="divider flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Your name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    required
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    placeholder="Your full name"
                    className="input-zen pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password
                  <span className="ml-1 font-normal" style={{ color: 'var(--text-tertiary)' }}>(min. 8 chars)</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
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

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                {loading ? 'Creating sanctuary...' : 'Begin Journey'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--accent-blue)' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
