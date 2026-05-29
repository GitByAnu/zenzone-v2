/**
 * Mood score → color, emoji, label, gradient
 * Score is 1–5 (matches MOODS array in mood.service.js)
 */
export const MOOD_META = {
  1: { label: 'Awful',   emoji: '😔', color: '#fb7185', bg: 'rgba(251,113,133,0.12)', gradient: 'linear-gradient(135deg,#fb7185,#f43f5e)' },
  2: { label: 'Bad',     emoji: '😟', color: '#f97316', bg: 'rgba(249,115,22,0.12)',  gradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
  3: { label: 'Okay',    emoji: '😐', color: '#f0b97a', bg: 'rgba(240,185,122,0.12)', gradient: 'linear-gradient(135deg,#f0b97a,#d97706)' },
  4: { label: 'Good',    emoji: '🙂', color: '#5eead4', bg: 'rgba(94,234,212,0.12)',  gradient: 'linear-gradient(135deg,#5eead4,#14b8a6)' },
  5: { label: 'Amazing', emoji: '😄', color: '#7c9ef5', bg: 'rgba(124,158,245,0.12)', gradient: 'linear-gradient(135deg,#7c9ef5,#6366f1)' },
}

/**
 * Get mood metadata by score (1–5). Returns score 3 (Okay) as fallback.
 */
export function getMoodMeta(score) {
  return MOOD_META[score] ?? MOOD_META[3]
}

/**
 * Get a CSS color string for a given mood score.
 */
export function moodColor(score) {
  return getMoodMeta(score).color
}

/**
 * Get background tint color for a mood score (for cards/badges).
 */
export function moodBg(score) {
  return getMoodMeta(score).bg
}

/**
 * Convert an array of mood scores to an average (rounded to 1 decimal).
 */
export function averageMood(scores) {
  if (!scores || scores.length === 0) return null
  const sum = scores.reduce((a, b) => a + b, 0)
  return Math.round((sum / scores.length) * 10) / 10
}

/**
 * Mood trend: compare last 7 days average vs previous 7 days.
 * Returns 'up', 'down', or 'stable'.
 */
export function moodTrend(moodLogs) {
  if (!moodLogs || moodLogs.length < 2) return 'stable'
  const sorted = [...moodLogs].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
  const recent = sorted.slice(0, 7).map((l) => l.mood_score)
  const older  = sorted.slice(7, 14).map((l) => l.mood_score)
  if (recent.length === 0 || older.length === 0) return 'stable'
  const recentAvg = averageMood(recent)
  const olderAvg  = averageMood(older)
  if (recentAvg - olderAvg > 0.5) return 'up'
  if (olderAvg - recentAvg > 0.5) return 'down'
  return 'stable'
}