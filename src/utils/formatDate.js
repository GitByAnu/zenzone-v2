import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

/**
 * Smart date label: "Today", "Yesterday", or "Mar 15"
 */
export function smartDate(dateInput) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  if (isToday(d))     return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d')
}

/**
 * Full readable date: "Monday, March 15, 2025"
 */
export function fullDate(dateInput) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  return format(d, 'EEEE, MMMM d, yyyy')
}

/**
 * Short date: "Mar 15"
 */
export function shortDate(dateInput) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  return format(d, 'MMM d')
}

/**
 * Time only: "3:42 PM"
 */
export function timeOnly(dateInput) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  return format(d, 'h:mm a')
}

/**
 * Relative time: "2 hours ago", "3 days ago"
 */
export function relativeTime(dateInput) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * ISO date string for Supabase queries: "2025-03-15"
 */
export function isoDate(dateInput = new Date()) {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput
  return format(d, 'yyyy-MM-dd')
}

/**
 * Greeting period based on current hour
 */
export function getDayPeriod() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}