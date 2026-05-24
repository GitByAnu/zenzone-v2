import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Music2, ListTodo, Timer, Wind, BookOpen, Heart, Star } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'

const FEATURES = [
  { icon: Brain,    label: 'Meditation',       desc: 'Guided sessions for calm',      color: 'var(--accent-teal)' },
  { icon: Wind,     label: 'Breathing',         desc: 'Science-backed patterns',       color: 'var(--accent-blue)' },
  { icon: Music2,   label: 'Music Zone',        desc: 'Curated wellness playlists',    color: 'var(--accent-lavender)' },
  { icon: ListTodo, label: 'Smart To-Do',       desc: 'Calm, focused task management', color: 'var(--accent-amber)' },
  { icon: Timer,    label: 'Pomodoro',          desc: '25-minute deep work sessions',  color: 'var(--accent-blue)' },
  { icon: Heart,    label: 'Mood Tracker',      desc: 'Daily emotional check-ins',     color: '#fb7185' },
  { icon: BookOpen, label: 'Journal',           desc: 'Your private reflection space', color: 'var(--accent-lavender)' },
  { icon: Star,     label: 'Affirmations',      desc: 'Daily words of intention',      color: 'var(--accent-teal)' },
]

const TESTIMONIALS = [
  { quote: 'ZenZone became my daily morning ritual. It\'s the most calming app I\'ve used.', name: 'Priya S.' },
  { quote: 'The breathing exercises alone changed how I handle stress at work.', name: 'Rahul M.' },
  { quote: 'Finally, a wellness app that actually feels peaceful to use.', name: 'Ananya K.' },
]

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8"
              style={{
                background: 'rgba(124,158,245,0.1)',
                border: '1px solid rgba(124,158,245,0.2)',
                color: 'var(--accent-blue)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Your Digital Sanctuary — V2
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className="font-display text-5xl md:text-7xl font-semibold leading-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Find your{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-lavender))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                calm
              </span>
              {' '}every day
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              ZenZone is a mindful space for meditation, focus, mood tracking, and daily wellness —
              beautifully designed to help you thrive.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register" className="btn-primary !px-8 !py-4 text-base">
                Begin Your Journey
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-ghost !px-8 !py-4 text-base">
                Sign In
              </Link>
            </div>
            <p className="mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Free to use · No credit card required
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="section-title mb-3">Everything you need</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Your complete wellness toolkit
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.label} delay={i * 0.06}>
                <div
                  className="glass p-5 rounded-2xl h-full"
                  style={{ height: '100%' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
                  >
                    <f.icon size={18} style={{ color: f.color }} />
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {f.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {f.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote section ── */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div
              className="glass-card text-center py-12"
              style={{ borderColor: 'rgba(167,139,250,0.15)' }}
            >
              <p
                className="font-display text-2xl md:text-3xl font-normal italic leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                "Almost everything will work again if you unplug it for a few minutes —
                including you."
              </p>
              <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                — Anne Lamott
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              People love their sanctuary
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="glass-card h-full">
                  <p className="text-sm italic leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                    "{t.quote}"
                  </p>
                  <p className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
                    — {t.name}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 py-24 text-center">
        <FadeUp>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready to begin?
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Join thousands building healthier, calmer lives with ZenZone.
          </p>
          <Link to="/register" className="btn-primary !px-10 !py-4 text-base">
            Create Your Free Sanctuary
            <ArrowRight size={18} />
          </Link>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 px-4 text-xs"
        style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-glass)' }}
      >
        <p className="mb-1">
          ZenZone V2 · Built with ❤️ by{' '}
          <span style={{ color: 'var(--text-secondary)' }}>Anupama Bain & Arijit Adhikary</span>
        </p>
        <p>A calm digital sanctuary for modern minds.</p>
      </footer>
    </PageWrapper>
  )
}
