// ─── Calendar Utilities ────────────────────────────────────────────────────
// Grid computation and date helpers for the Tour Scheduling module.

import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
  addMonths, subMonths, addWeeks, subWeeks,
  format, parseISO, getHours, getMinutes,
  differenceInMinutes, startOfDay,
} from 'date-fns'
import type { ScheduledTour } from '@admin-types/index'

// ─── Month Calendar ───────────────────────────────────────────────────────

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  tours: ScheduledTour[]
}

/** Build a 6-week grid (42 cells) for the given month. */
export function buildMonthGrid(date: Date, tours: ScheduledTour[]): CalendarDay[][] {
  const monthStart = startOfMonth(date)
  const monthEnd   = endOfMonth(date)
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 }) // Mon
  const gridEnd    = endOfWeek(monthEnd,   { weekStartsOn: 1 })

  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const rows: CalendarDay[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7).map(day => ({
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      tours: getToursForDay(day, tours),
    }))
    rows.push(week)
  }
  return rows
}

/** Build a single week array for week view. */
export function buildWeekDays(date: Date, tours: ScheduledTour[]): CalendarDay[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd   = endOfWeek(date,   { weekStartsOn: 1 })
  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(day => ({
    date: day,
    isCurrentMonth: true,
    isToday: isToday(day),
    tours: getToursForDay(day, tours),
  }))
}

/** Get tours that overlap with a given day. */
function getToursForDay(day: Date, tours: ScheduledTour[]): ScheduledTour[] {
  return tours.filter(tour => {
    try {
      const from = parseISO(tour.dateFrom)
      const to   = parseISO(tour.dateTo)
      return day >= startOfDay(from) && day <= startOfDay(to)
    } catch {
      return false
    }
  })
}

// ─── Navigation ───────────────────────────────────────────────────────────

export function nextMonth(date: Date): Date { return addMonths(date, 1) }
export function prevMonth(date: Date): Date { return subMonths(date, 1) }
export function nextWeek(date: Date): Date  { return addWeeks(date, 1) }
export function prevWeek(date: Date): Date  { return subWeeks(date, 1) }

// ─── Formatting ──────────────────────────────────────────────────────────

export function formatMonthHeader(date: Date): string {
  return format(date, 'MMMM yyyy')
}

export function formatWeekHeader(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end   = endOfWeek(date, { weekStartsOn: 1 })
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`
  }
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}

export const WEEK_DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const WEEK_DAY_FULL   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// ─── Week Time Grid ───────────────────────────────────────────────────────

export const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 8) // 08:00 – 21:00

export interface PositionedTour {
  tour: ScheduledTour
  top: number     // percent from top of grid
  height: number  // percent of grid height
}

/** Compute pixel position of a tour block within a day column (08:00–22:00). */
export function computeTourPosition(tour: ScheduledTour): PositionedTour {
  const HOUR_START = 8
  const HOUR_END   = 22
  const TOTAL_MINS = (HOUR_END - HOUR_START) * 60

  const from = parseISO(tour.dateFrom)
  const h    = Math.max(getHours(from), HOUR_START)
  const m    = getMinutes(from)
  const startMins = (h - HOUR_START) * 60 + m

  // Duration defaults to 4 hours for multi-day tours displayed in week view
  const durationMins = Math.min(
    differenceInMinutes(parseISO(tour.dateTo), from),
    (HOUR_END - HOUR_START) * 60
  ) || 240

  const top    = (startMins / TOTAL_MINS) * 100
  const height = (durationMins / TOTAL_MINS) * 100

  return { tour, top, height }
}

// ─── Capacity ────────────────────────────────────────────────────────────

export type CapacityLevel = 'empty' | 'low' | 'medium' | 'high' | 'full'

export function getCapacityLevel(booked: number, max: number): CapacityLevel {
  if (max === 0) return 'empty'
  const ratio = booked / max
  if (ratio === 0)   return 'empty'
  if (ratio < 0.4)   return 'low'
  if (ratio < 0.75)  return 'medium'
  if (ratio < 1)     return 'high'
  return 'full'
}

export function getCapacityColor(level: CapacityLevel): string {
  switch (level) {
    case 'empty':  return 'bg-gray-200 text-gray-500'
    case 'low':    return 'bg-green-100 text-green-700'
    case 'medium': return 'bg-amber-100 text-amber-700'
    case 'high':   return 'bg-orange-100 text-orange-700'
    case 'full':   return 'bg-red-100 text-red-700'
  }
}

// ─── Conflict Detection ───────────────────────────────────────────────────

/** Returns true if two tours overlap in time AND share the same guide. */
export function hasGuideConflict(a: ScheduledTour, b: ScheduledTour): boolean {
  if (!a.guideId || !b.guideId || a.guideId !== b.guideId || a.id === b.id) return false
  const aFrom = parseISO(a.dateFrom).getTime()
  const aTo   = parseISO(a.dateTo).getTime()
  const bFrom = parseISO(b.dateFrom).getTime()
  const bTo   = parseISO(b.dateTo).getTime()
  return aFrom < bTo && bFrom < aTo
}

/** Check if a day has any conflicting tours */
export function getDayConflicts(tours: ScheduledTour[]): Set<string> {
  const conflicts = new Set<string>()
  for (let i = 0; i < tours.length; i++) {
    for (let j = i + 1; j < tours.length; j++) {
      if (hasGuideConflict(tours[i], tours[j])) {
        conflicts.add(tours[i].id)
        conflicts.add(tours[j].id)
      }
    }
  }
  return conflicts
}

// ─── Same-day check ──────────────────────────────────────────────────────

export { isSameDay, isToday, format, parseISO }
