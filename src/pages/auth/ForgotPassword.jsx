import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import PageWrapper from '@/components/layout/PageWrapper'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    const { error } = await authService.resetPassword(email.trim())

    if (error) {
      toast.error(error.message ?? 'Could not send reset email.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {sent ? (
            /* ── Success state ── */
            <div className="glass-card text-center py-10">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Check your inbox
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                We sent a password reset link to <strong>{email}</strong>.
                <br />
                Click the link to set a new password.
              </p>
              <Link to="/login" className="btn-ghost inline-flex">
                <ArrowLeft size={15} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
                    boxShadow: '0 0 30px rgba(124,158,245,0.25)',
                  }}
                >
                  🔑
                </div>
                <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Reset your password
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Enter your email and we'll send a reset link
                </p>
              </div>

              <div className="glass-card">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-zen pl-10"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="btn-primary w-full justify-center py-3"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ArrowLeft size={13} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  )
}