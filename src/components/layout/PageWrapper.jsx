import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
}

/**
 * Wraps every page with:
 * - Framer Motion enter/exit animation
 * - Proper top padding for the fixed navbar
 * - Relative positioning above the ambient background
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={`relative z-10 min-h-screen pt-16 ${className}`}
    >
      {children}
    </motion.main>
  )
}

/**
 * Section container with consistent padding.
 */
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-5xl mx-auto px-4 md:px-8 py-8 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Page header with title + optional subtitle + action.
 */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
