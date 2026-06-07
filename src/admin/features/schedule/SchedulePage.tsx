import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Plus, Calendar, LayoutGrid,
  AlignLeft, BarChart2, Users, AlertTriangle, Clock
} from 'lucide-react'
import { pageVariants, fadeVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { MOCK_SCHEDULE } from '@admin-data/mockSchedule'
import {
  buildMonthGrid, buildWeekDays, WEEK_DAY_LABELS,
  nextMonth, prevMonth, nextWeek, prevWeek,
  formatMonthHeader, formatWeekHeader,
  getCapacityLevel, getCapacityColor, getDayConflicts,
  format, parseISO, isToday,
} from '@admin-lib/calendarUtils'
import type { ScheduledTour } from '@admin-types/index'
import { cn } from '@lib/utils'

export type ScheduleView = 'month' | 'week' | 'day' | 'timeline'

interface SchedulePageProps {
  view: ScheduleView
}

const VIEW_TABS: { id: ScheduleView; label: string; icon: typeof Calendar }[] = [
  { id: 'month',    label: 'Month',    icon: LayoutGrid },
  { id: 'week',     label: 'Week',     icon: Calendar },
  { id: 'day',      label: 'Day',      icon: AlignLeft },
  { id: 'timeline', label: 'Timeline', icon: BarChart2 },
]

// ─── Capacity dot ────────────────────────────────────────────────────────────
function CapacityDot({ booked, max }: { booked: number; max: number }) {
  const level = getCapacityLevel(booked, max)
  const dot: Record<string, string> = {
    empty:  'bg-gray-300',
    low:    'bg-green-400',
    medium: 'bg-amber-400',
    high:   'bg-orange-400',
    full:   'bg-red-500',
  }
  return <span className={cn('w-1.5 h-1.5 rounded-full inline-block', dot[level])} />
}

// ─── Tour event block (used in month + week) ─────────────────────────────────
function TourBlock({
  tour,
  compact = false,
  conflict = false,
}: {
  tour: ScheduledTour
  compact?: boolean
  conflict?: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'rounded-lg px-2 py-1 cursor-pointer transition-shadow text-white text-[11px] font-medium leading-tight',
        conflict && 'ring-2 ring-red-400 ring-offset-1',
        compact ? 'py-0.5' : 'py-1.5'
      )}
      style={{ backgroundColor: tour.colorTag }}
      title={`${tour.packageName} — ${tour.paxCount}/${tour.maxCapacity} pax`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="truncate">{tour.packageName}</span>
        <CapacityDot booked={tour.paxCount} max={tour.maxCapacity} />
      </div>
      {!compact && (
        <p className="text-white/70 text-[10px] mt-0.5">{tour.paxCount}/{tour.maxCapacity} pax</p>
      )}
      {conflict && (
        <span className="inline-flex items-center gap-0.5 mt-0.5 text-[9px] font-bold text-white bg-red-500 rounded px-1 py-0.5">
          <AlertTriangle size={8} />
          CONFLICT
        </span>
      )}
    </motion.div>
  )
}

// ─── Month View ────────────────────────────────────────────────────────────────
function MonthView({ date }: { date: Date }) {
  const grid = buildMonthGrid(date, MOCK_SCHEDULE)
  const allConflicts = getDayConflicts(MOCK_SCHEDULE)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-admin-card">
      {/* Day labels header */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEK_DAY_LABELS.map(day => (
          <div key={day} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {grid.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-gray-50 last:border-0">
          {week.map(cell => (
            <div
              key={cell.date.toISOString()}
              className={cn(
                'min-h-[110px] p-2 border-r border-gray-50 last:border-r-0 flex flex-col gap-1',
                !cell.isCurrentMonth && 'bg-gray-50/50',
                cell.isToday && 'bg-orange-50/40'
              )}
            >
              {/* Date number */}
              <div className={cn(
                'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium self-end',
                cell.isToday ? 'bg-brand-orange text-white' : 'text-gray-600',
                !cell.isCurrentMonth && 'text-gray-300'
              )}>
                {format(cell.date, 'd')}
              </div>

              {/* Tour blocks */}
              <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                {cell.tours.slice(0, 3).map(tour => (
                  <TourBlock
                    key={tour.id}
                    tour={tour}
                    compact
                    conflict={allConflicts.has(tour.id)}
                  />
                ))}
                {cell.tours.length > 3 && (
                  <span className="text-[10px] text-gray-400 pl-1">+{cell.tours.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Week View ─────────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8)

function WeekView({ date }: { date: Date }) {
  const weekDays = buildWeekDays(date, MOCK_SCHEDULE)
  const allConflicts = getDayConflicts(MOCK_SCHEDULE)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-admin-card overflow-x-auto">
      {/* Day headers */}
      <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        <div className="py-3 px-2 text-xs text-gray-400" />
        {weekDays.map(day => (
          <div
            key={day.date.toISOString()}
            className={cn(
              'py-3 text-center border-l border-gray-100',
              day.isToday && 'bg-orange-50/50'
            )}
          >
            <p className="text-xs text-gray-500">{format(day.date, 'EEE')}</p>
            <div className={cn(
              'w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mx-auto mt-0.5',
              day.isToday ? 'bg-brand-orange text-white' : 'text-gray-800'
            )}>
              {format(day.date, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {HOURS.map(hour => (
          <div
            key={hour}
            className="grid border-b border-gray-50 last:border-0"
            style={{ gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '48px' }}
          >
            <div className="px-2 py-1 text-[10px] text-gray-400 border-r border-gray-100 self-start pt-1">
              {hour}:00
            </div>
            {weekDays.map(day => (
              <div
                key={day.date.toISOString()}
                className={cn('border-l border-gray-50 px-1 py-0.5', day.isToday && 'bg-orange-50/20')}
              >
                {day.tours
                  .filter(t => {
                    const from = parseISO(t.dateFrom)
                    return from.getHours() === hour
                  })
                  .map(tour => (
                    <TourBlock
                      key={tour.id}
                      tour={tour}
                      conflict={allConflicts.has(tour.id)}
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Day View ──────────────────────────────────────────────────────────────────
function DayView({ date }: { date: Date }) {
  const toursToday = MOCK_SCHEDULE.filter(t => {
    const from = parseISO(t.dateFrom)
    const to   = parseISO(t.dateTo)
    return date >= new Date(from.getFullYear(), from.getMonth(), from.getDate()) &&
           date <= new Date(to.getFullYear(), to.getMonth(), to.getDate())
  })
  const allConflicts = getDayConflicts(toursToday)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-admin-card">
      <div className={cn(
        'px-5 py-4 border-b border-gray-100 flex items-center gap-3',
        isToday(date) && 'bg-orange-50/40'
      )}>
        <div className={cn(
          'w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold',
          isToday(date) ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-700'
        )}>
          {format(date, 'd')}
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-gray-900">{format(date, 'EEEE, MMMM d, yyyy')}</p>
          <p className="text-xs text-gray-500">{toursToday.length} tour{toursToday.length !== 1 ? 's' : ''} scheduled</p>
        </div>
      </div>

      {toursToday.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No tours scheduled for this day</p>
          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600">
            <Plus size={14} />
            Schedule Tour
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {toursToday.map(tour => {
            const level = getCapacityLevel(tour.paxCount, tour.maxCapacity)
            const cap = getCapacityColor(level)
            const conflict = allConflicts.has(tour.id)
            return (
              <div key={tour.id} className={cn('flex gap-4 px-5 py-4', conflict && 'bg-red-50/50')}>
                {/* Color bar */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: tour.colorTag }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm">{tour.packageName}</h3>
                        {conflict && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                            <AlertTriangle size={9} />
                            Guide Conflict
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{tour.destination}</p>
                    </div>
                    <span className={cn('px-2 py-1 text-[10px] font-semibold rounded-full', cap)}>
                      {tour.paxCount}/{tour.maxCapacity} pax
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {format(parseISO(tour.dateFrom), 'MMM d')} – {format(parseISO(tour.dateTo), 'MMM d')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      Guide: {tour.guideName}
                    </span>
                  </div>
                  {tour.notes && (
                    <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 px-2 py-1.5 rounded-lg">{tour.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Timeline View ─────────────────────────────────────────────────────────────
function TimelineView() {
  const sorted = [...MOCK_SCHEDULE].sort((a, b) =>
    new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-admin-card divide-y divide-gray-50">
      <div className="px-5 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className="col-span-3">Package</span>
        <span className="col-span-2">Destination</span>
        <span className="col-span-2">Dates</span>
        <span className="col-span-2">Guide</span>
        <span className="col-span-2">Capacity</span>
        <span className="col-span-1">Status</span>
      </div>
      {sorted.map(tour => {
        const level = getCapacityLevel(tour.paxCount, tour.maxCapacity)
        const pct   = (tour.paxCount / tour.maxCapacity) * 100
        const cap   = getCapacityColor(level)
        return (
          <div key={tour.id} className="px-5 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors">
            <div className="col-span-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tour.colorTag }} />
              <span className="text-sm font-semibold text-gray-900 truncate">{tour.packageName}</span>
            </div>
            <span className="col-span-2 text-sm text-gray-600">{tour.destination}</span>
            <div className="col-span-2 text-xs text-gray-500">
              <p>{format(parseISO(tour.dateFrom), 'MMM d')}</p>
              <p>{format(parseISO(tour.dateTo), 'MMM d')}</p>
            </div>
            <span className="col-span-2 text-xs text-gray-600 truncate">{tour.guideName}</span>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('h-full rounded-full', level === 'full' ? 'bg-red-400' : level === 'high' ? 'bg-orange-400' : 'bg-green-400')}
                  />
                </div>
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', cap)}>
                  {tour.paxCount}/{tour.maxCapacity}
                </span>
              </div>
            </div>
            <span className="col-span-1">
              <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full">
                {tour.status}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SchedulePage({ view }: SchedulePageProps) {
  const [activeView, setActiveView] = useState<ScheduleView>(view)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)) // June 2026

  const navigate = (dir: 'prev' | 'next') => {
    if (dir === 'prev') {
      setCurrentDate(activeView === 'week' ? prevWeek(currentDate) : prevMonth(currentDate))
    } else {
      setCurrentDate(activeView === 'week' ? nextWeek(currentDate) : nextMonth(currentDate))
    }
  }

  const headerLabel = activeView === 'week'
    ? formatWeekHeader(currentDate)
    : activeView === 'day'
    ? format(currentDate, 'MMMM d, yyyy')
    : formatMonthHeader(currentDate)

  // Conflict count for badge
  const conflicts = getDayConflicts(MOCK_SCHEDULE)

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Tour Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {MOCK_SCHEDULE.length} scheduled tours
            {conflicts.size > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-medium">
                <AlertTriangle size={12} />
                {Math.floor(conflicts.size / 2)} guide conflict{conflicts.size / 2 !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
          <Plus size={15} />
          Schedule Tour
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <span className="font-heading font-semibold text-gray-900 min-w-[180px] text-center">{headerLabel}</span>
          <button
            onClick={() => navigate('next')}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-medium text-brand-orange bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors"
          >
            Today
          </button>
        </div>

        {/* View switcher */}
        <div className="flex gap-0.5 p-1 bg-gray-100 rounded-xl">
          {VIEW_TABS.map(tab => (
            <Link
              key={tab.id}
              to={tab.id === 'month' ? '/schedule' : `/schedule/${tab.id}`}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                activeView === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon size={13} />
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* ── Main Calendar Area ─────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeView} variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
              {activeView === 'month'    && <MonthView    date={currentDate} />}
              {activeView === 'week'     && <WeekView     date={currentDate} />}
              {activeView === 'day'      && <DayView      date={currentDate} />}
              {activeView === 'timeline' && <TimelineView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Sidebar ────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Upcoming tours */}
          <AdminCard padding="none">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Upcoming Tours</p>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_SCHEDULE.slice(0, 5).map(tour => {
                const level = getCapacityLevel(tour.paxCount, tour.maxCapacity)
                const cap   = getCapacityColor(level)
                return (
                  <div key={tour.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: tour.colorTag }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{tour.packageName}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {format(parseISO(tour.dateFrom), 'MMM d')} – {format(parseISO(tour.dateTo), 'MMM d')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', cap)}>
                          {tour.paxCount}/{tour.maxCapacity}
                        </span>
                        {conflicts.has(tour.id) && (
                          <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
                            <AlertTriangle size={8} /> Conflict
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </AdminCard>

          {/* Legend */}
          <AdminCard>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Capacity Legend</p>
            <div className="space-y-2">
              {[
                { label: 'Low (< 40%)',    className: 'bg-green-400' },
                { label: 'Medium (40–75%)', className: 'bg-amber-400' },
                { label: 'High (75–99%)',  className: 'bg-orange-400' },
                { label: 'Fully Booked',   className: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full', item.className)} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100 mt-1">
                <div className="w-2.5 h-2.5 rounded-sm border-2 border-red-400" />
                <span className="text-xs text-gray-600">Guide Conflict</span>
              </div>
            </div>
          </AdminCard>

          {/* Guide assignments */}
          <AdminCard>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Guides on Duty</p>
            {Array.from(new Map(MOCK_SCHEDULE.map(t => [t.guideId, t.guideName]))).map(([id, name]) => {
              const tours = MOCK_SCHEDULE.filter(t => t.guideId === id)
              const displayName = name ?? 'Unknown Guide'
              return (
                <div key={id} className="flex items-center gap-3 mb-2 last:mb-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{displayName}</p>
                    <p className="text-[10px] text-gray-500">{tours.length} tour{tours.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )
            })}
          </AdminCard>
        </div>
      </div>
    </motion.div>
  )
}
