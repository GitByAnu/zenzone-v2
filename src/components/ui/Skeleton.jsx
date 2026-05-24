import clsx from 'clsx'

export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={clsx('skeleton', className)}
      style={{ ...style }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="glass-card">
      <Skeleton className="h-5 w-2/5 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 mb-2" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} rows={2} />
      ))}
    </div>
  )
}
