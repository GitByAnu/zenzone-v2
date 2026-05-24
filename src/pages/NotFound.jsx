import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/layout/PageWrapper'

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="text-7xl mb-6">🌿</div>
          <h1 className="font-display text-5xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            404
          </h1>
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            This path leads to stillness
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
            The page you're looking for doesn't exist, but your sanctuary does.
          </p>
          <Link to="/" className="btn-primary !px-8 !py-3">
            Return to ZenZone
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
