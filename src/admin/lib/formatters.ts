// ─── Formatters ────────────────────────────────────────────────────────────
// Centralized formatting utilities for the admin system.

import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns'

// ─── Currency ─────────────────────────────────────────────────────────────

/** Format a number as Philippine Peso. e.g. 45000 → '₱45,000' */
export function formatPeso(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(1)}M`
  }
  if (compact && amount >= 1_000) {
    return `₱${(amount / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── Dates ────────────────────────────────────────────────────────────────

/** Format ISO date string as readable date. e.g. '2026-03-15' → 'Mar 15, 2026' */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

/** Format ISO date string as short date. e.g. '2026-03-15' → 'Mar 15' */
export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d')
  } catch {
    return iso
  }
}

/** Format as month+year. e.g. '2026-03-15' → 'March 2026' */
export function formatMonthYear(iso: string): string {
  try {
    return format(parseISO(iso), 'MMMM yyyy')
  } catch {
    return iso
  }
}

/** Human-readable relative time. e.g. '2 hours ago', '3 days ago' */
export function formatRelative(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

/** Format a date range. e.g. 'Mar 15–22, 2026' or 'Mar 29 – Apr 5, 2026' */
export function formatDateRange(fromIso: string, toIso: string): string {
  try {
    const from = parseISO(fromIso)
    const to   = parseISO(toIso)
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
      return `${format(from, 'MMM d')}–${format(to, 'd, yyyy')}`
    }
    return `${format(from, 'MMM d')} – ${format(to, 'MMM d, yyyy')}`
  } catch {
    return `${fromIso} – ${toIso}`
  }
}

/** Days until a future date. Returns negative if past. */
export function daysUntil(iso: string): number {
  try {
    return differenceInDays(parseISO(iso), new Date())
  } catch {
    return 0
  }
}

/** Days since a past date */
export function daysSince(iso: string): number {
  try {
    return differenceInDays(new Date(), parseISO(iso))
  } catch {
    return 0
  }
}

/** Format time string. e.g. '14:00' → '2:00 PM' */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour   = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

// ─── Numbers ──────────────────────────────────────────────────────────────

/** Format number with commas. e.g. 1234567 → '1,234,567' */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-PH').format(n)
}

/** Format percentage. e.g. 0.745 → '74.5%' */
export function formatPercent(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`
}

/** Format a growth delta with sign. e.g. 12.5 → '+12.5%', -3.2 → '-3.2%' */
export function formatGrowth(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(1)}%`
}

// ─── Text ─────────────────────────────────────────────────────────────────

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

/** Capitalize first letter */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/** Humanize slug. e.g. 'south-korea' → 'South Korea' */
export function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
}

/** Generate booking/inquiry reference with prefix. e.g. 'BK-0042' */
export function formatRef(prefix: string, id: number): string {
  return `${prefix}-${String(id).padStart(4, '0')}`
}

// ─── Duration ────────────────────────────────────────────────────────────

/** Format duration in minutes to human-readable. e.g. 90 → '1h 30m' */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/** Format nights + days string. e.g. 6,7 → '6 Nights / 7 Days' */
export function formatTripLength(nights: number, days: number): string {
  return `${nights}N / ${days}D`
}

// ─── Initials ─────────────────────────────────────────────────────────────

/** Get initials from full name. e.g. 'Maria Santos' → 'MS' */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}
