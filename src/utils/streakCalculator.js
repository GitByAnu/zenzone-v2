import { differenceInCalendarDays, parseISO, format, subDays } from 'date-fns'

/**
 * Given an array of ISO date strings (YYYY-MM-DD),
 * calculates current streak and longest streak.
 *
 * @param {string[]} dates - Array of ISO date strings
 * @returns {{ current: number, longest: number, lastActive: string|null }}
 */
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) {
    return { current: 0, longest: 0, lastActive: null }
  }

  // Deduplicate and sort descending
  const unique = [...new Set(dates.map((d) => format(typeof d === 'string' ? parseISO(d) : d, 'yyyy-MM-dd')))]
  unique.sort((a, b) => (a > b ? -1 : 1))

  const today   = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Current streak: must start from today or yesterday
  let current = 0
  if (unique[0] === today || unique[0] === yesterday) {
    current = 1
    for (let i = 1; i < unique.length; i++) {
      const prev = parseISO(unique[i - 1])
      const curr = parseISO(unique[i])
      const diff = differenceInCalendarDays(prev, curr)
      if (diff === 1) {
        current++
      } else {
        break
      }
    }
  }

  // Longest streak: scan all dates
  let longest = 0
  let run = 1
  const asc = [...unique].sort()
  for (let i = 1; i < asc.length; i++) {
    const diff = differenceInCalendarDays(parseISO(asc[i]), parseISO(asc[i - 1]))
    if (diff === 1) {
      run++
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }
  longest = Math.max(longest, run, current)

  return {
    current,
    longest,
    lastActive: unique[0] ?? null,
  }
}

/**
 * Returns a human-friendly streak label.
 * e.g. "🔥 7-day streak"
 */
export function streakLabel(current) {
  if (current === 0) return 'No active streak'
  if (current === 1) return '1-day streak'
  return `${current}-day streak`
}

/**
 * Milestone check — returns a celebration message at key streak milestones.
 */
export function streakMilestone(current) {
  const milestones = {
    3:   '3 days in a row — you\'re building a habit! 🌱',
    7:   'One full week! You\'re on fire 🔥',
    14:  'Two weeks strong. This is becoming part of you ✨',
    21:  '21 days — the habit is forming 🧘',
    30:  'A whole month! You\'re unstoppable 💎',
    60:  'Two months of consistency. Incredible 🌟',
    100: '100 days. You are truly devoted 👑',
  }
  return milestones[current] ?? null
}