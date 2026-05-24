// Affirmations Page
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'

const FALLBACK = [
  { content: 'I am calm, centered, and capable of handling whatever comes my way.', author: null },
  { content: 'Each breath I take fills me with peace and clarity.', author: null },
  { content: 'I choose to focus on what I can control and release what I cannot.', author: null },
  { content: 'I am worthy of rest, joy, and deep inner peace.', author: null },
  { content: 'My mind is clear. My heart is open. I am present.', author: null },
]

export function Affirmations() {
  const [all, setAll]         = useState([])
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from('affirmations')
      .select('content, author, category')
      .eq('is_active', true)
    const pool = (data && data.length > 0) ? data : FALLBACK
    setAll(pool)
    setCurrent(pool[Math.floor(Math.random() * pool.length)])
    setLoading(false)
  }

  function next() {
    setFlipping(true)
    setTimeout(() => {
      const filtered = all.filter((a) => a.content !== current?.content)
      const next = filtered[Math.floor(Math.random() * filtered.length)] ?? all[0]
      setCurrent(next)
      setFlipping(false)
    }, 200)
  }

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader title="Affirmations" subtitle="Daily words of intention and encouragement" />

        <div className="flex flex-col items-center justify-center min-h-64">
          <AnimatePresence mode="wait">
            {!loading && current && (
              <motion.div
                key={current.content}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card w-full text-center py-12 mb-8"
                style={{ borderColor: 'rgba(167,139,250,0.2)' }}
              >
                <Star size={24} className="mx-auto mb-6" style={{ color: 'var(--accent-lavender)' }} />
                <blockquote
                  className="font-display text-2xl md:text-3xl font-normal italic leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  "{current.content}"
                </blockquote>
                {current.author && (
                  <p className="mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    — {current.author}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={next}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary !px-8"
          >
            <RefreshCw size={16} className={flipping ? 'animate-spin' : ''} />
            New Affirmation
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card text-center mt-8 py-6"
        >
          <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
            "What you think, you become. What you feel, you attract. What you imagine, you create."
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>— Buddha</p>
        </motion.div>
      </PageContainer>
    </PageWrapper>
  )
}

export default Affirmations
