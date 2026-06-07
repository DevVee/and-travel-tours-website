import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp, MessageSquare, BookOpen, Calendar,
  Plane, ArrowRight, Users, CheckCircle,
  Plus, FileText, Package, BarChart3, ChevronRight,
} from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { StatCard } from '@admin-ui/StatCard'
import { DashboardActivityFeed } from '@admin-ui/ActivityFeed'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { formatPeso, formatDateShort, daysUntil } from '@admin-lib/formatters'
import { DASHBOARD_STATS, MOCK_ACTIVITY, MOCK_TASKS, MOCK_REPORT_SUMMARY } from '@admin-data/mockReports'
import { MOCK_SCHEDULE } from '@admin-data/mockSchedule'
import { MOCK_INQUIRIES } from '@admin-data/mockInquiries'
import { getDestinationColor } from '@admin-lib/statusColors'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Today's Tours Strip ──────────────────────────────────────────────────

function TodayToursWidget() {
  const today = new Date().toISOString().split('T')[0]
  const todayTours = MOCK_SCHEDULE.filter(t => {
    const from = t.dateFrom.split('T')[0]
    const to   = t.dateTo.split('T')[0]
    return from <= today && today <= to
  })

  return (
    <AdminCard className="mb-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-gray-900">Today's Active Tours</h2>
          <p className="text-sm text-gray-500">Tours currently in progress</p>
        </div>
        <Link to="/admin/schedule" className="flex items-center gap-1 text-sm text-brand-orange font-medium hover:underline">
          View schedule <ArrowRight size={14} />
        </Link>
      </div>

      {todayTours.length === 0 ? (
        <div className="flex items-center gap-3 py-4 text-gray-400">
          <Calendar size={20} />
          <span className="text-sm">No active tours today</span>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
          {todayTours.map(tour => {
            const color = tour.colorTag
            const capacity = Math.round((tour.paxCount / tour.maxCapacity) * 100)
            return (
              <div
                key={tour.id}
                className="flex-shrink-0 w-64 rounded-xl border border-gray-100 p-4 hover:shadow-card-lg transition-all cursor-pointer"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{tour.packageName}</p>
                    <p className="text-xs text-gray-500">{tour.destination}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}18`, color }}>
                    Live
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Capacity</span>
                    <span className="font-medium">{tour.paxCount}/{tour.maxCapacity}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${capacity}%`, background: color }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <Users size={11} />
                  <span>{tour.guideName ?? 'No guide assigned'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminCard>
  )
}

// ─── KPI Strip ────────────────────────────────────────────────────────────

function KPIStrip() {
  const stats = MOCK_REPORT_SUMMARY
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatPeso(stats.totalRevenue, true)}
        delta={stats.revenueGrowth}
        icon={<TrendingUp size={18} className="text-brand-orange" />}
        iconBg="bg-orange-50"
        subtitle="vs last month"
        index={0}
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        delta={stats.bookingGrowth}
        icon={<BookOpen size={18} className="text-blue-600" />}
        iconBg="bg-blue-50"
        subtitle={`${DASHBOARD_STATS.activeBookings} active`}
        index={1}
      />
      <StatCard
        title="New Inquiries"
        value={stats.totalInquiries}
        delta={stats.inquiryGrowth}
        icon={<MessageSquare size={18} className="text-violet-600" />}
        iconBg="bg-violet-50"
        subtitle={`${DASHBOARD_STATS.newInquiriesToday} today`}
        index={2}
      />
      <StatCard
        title="Conversion Rate"
        value={`${(stats.conversionRate * 100).toFixed(1)}%`}
        icon={<CheckCircle size={18} className="text-green-600" />}
        iconBg="bg-green-50"
        subtitle="Inquiry → Booking"
        index={3}
      />
    </div>
  )
}

// ─── Monthly Revenue Chart ────────────────────────────────────────────────

function MonthlyRevenueWidget() {
  const data = MOCK_REPORT_SUMMARY.monthlyRevenue.map(d => ({
    ...d,
    revenueK: Math.round(d.revenue / 1000),
  }))

  return (
    <AdminCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-gray-900">Revenue Trend</h3>
          <p className="text-xs text-gray-500 mt-0.5">Last 12 months</p>
        </div>
        <Link to="/admin/reports" className="text-xs text-brand-orange font-medium hover:underline flex items-center gap-1">
          Full report <ChevronRight size={12} />
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F97316" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
            tickFormatter={v => v.split(' ')[0]} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
            tickFormatter={v => `₱${v}K`} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }}
            formatter={(v: unknown) => [`₱${Number(v)}K`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenueK" stroke="#F97316" strokeWidth={2}
            fill="url(#revenueGradient)" dot={false} activeDot={{ r: 4, fill: '#F97316' }} />
        </AreaChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}

// ─── Booking Pipeline ─────────────────────────────────────────────────────

function BookingPipelineWidget() {
  const funnel = MOCK_REPORT_SUMMARY.conversionFunnel

  return (
    <AdminCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-base font-semibold text-gray-900">Booking Pipeline</h3>
        <Link to="/admin/bookings" className="text-xs text-brand-orange font-medium hover:underline flex items-center gap-1">
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-2.5">
        {funnel.map((stage, idx) => (
          <div key={stage.stage}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">{stage.stage}</span>
              <span className="font-semibold text-gray-900">{stage.count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.percentage * 100}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                className="h-full rounded-full"
                style={{ background: idx === 0 ? '#F97316' : `rgba(249,115,22,${1 - idx * 0.18})` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}

// ─── Recent Inquiries ─────────────────────────────────────────────────────

function RecentInquiriesWidget() {
  const recent = MOCK_INQUIRIES.filter(i => i.status === 'new' || i.status === 'discussion').slice(0, 4)

  return (
    <AdminCard padding="none" className="h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-heading text-base font-semibold text-gray-900">Recent Inquiries</h3>
        <Link to="/admin/inquiries" className="text-xs text-brand-orange font-medium hover:underline flex items-center gap-1">
          Pipeline <ChevronRight size={12} />
        </Link>
      </div>
      <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
        {recent.map(inq => (
          <motion.div key={inq.id} variants={listItem}>
            <Link
              to={`/admin/inquiries/${inq.id}`}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plane size={12} className="text-brand-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{inq.customerName}</p>
                <p className="text-xs text-gray-500">{inq.destination}</p>
              </div>
              <StatusBadge status={inq.status} type="inquiry" size="sm" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AdminCard>
  )
}

// ─── Upcoming Departures ──────────────────────────────────────────────────

function UpcomingDeparturesWidget() {
  const upcoming = MOCK_SCHEDULE
    .filter(t => t.status === 'scheduled')
    .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime())
    .slice(0, 5)

  return (
    <AdminCard padding="none" className="h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-heading text-base font-semibold text-gray-900">Upcoming Departures</h3>
        <Link to="/admin/schedule" className="text-xs text-brand-orange font-medium hover:underline flex items-center gap-1">
          Schedule <ChevronRight size={12} />
        </Link>
      </div>
      <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
        {upcoming.map(tour => {
          const days = daysUntil(tour.dateFrom)
          const color = tour.colorTag
          return (
            <motion.div key={tour.id} variants={listItem} className="flex items-center gap-3 px-5 py-3.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                style={{ background: color }}
              >
                {formatDateShort(tour.dateFrom).split(' ')[0].slice(0, 1)}
                {formatDateShort(tour.dateFrom).split(' ')[1]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{tour.destination}</p>
                <p className="text-xs text-gray-500">{tour.paxCount}/{tour.maxCapacity} pax</p>
              </div>
              <span className={`text-xs font-semibold ${days <= 3 ? 'text-red-600' : days <= 7 ? 'text-amber-600' : 'text-gray-500'}`}>
                {days === 0 ? 'Today' : days < 0 ? 'Active' : `${days}d`}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </AdminCard>
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────

function QuickActionsWidget() {
  const actions = [
    { label: 'New Inquiry', icon: MessageSquare, to: '/inquiries/new', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Quote', icon: FileText, to: '/quotations/new', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Package', icon: Package, to: '/packages/new', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Reports', icon: BarChart3, to: '/admin/reports', color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <AdminCard>
      <h3 className="font-heading text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(a => (
          <Link
            key={a.to}
            to={a.to}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-brand-orange/20 hover:bg-orange-50/30 transition-all"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.bg}`}>
              <a.icon size={14} className={a.color} />
            </div>
            <span className="text-xs font-semibold text-gray-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </AdminCard>
  )
}

// ─── Team Tasks ───────────────────────────────────────────────────────────

function TeamTasksWidget() {
  return (
    <AdminCard className="h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-base font-semibold text-gray-900">Team Tasks</h3>
        <span className="text-xs text-gray-400">{MOCK_TASKS.filter(t => !t.done).length} pending</span>
      </div>
      <div className="space-y-2">
        {MOCK_TASKS.map(task => (
          <div key={task.id} className={`flex items-start gap-3 p-2.5 rounded-xl ${task.done ? 'opacity-50' : 'hover:bg-gray-50'} transition-colors`}>
            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
              {task.done && <CheckCircle size={10} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-400">{task.assignee}</span>
                <span className="text-[10px] text-brand-orange font-medium">{task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}

// ─── Popular Destinations ─────────────────────────────────────────────────

function PopularDestinationsWidget() {
  const top = MOCK_REPORT_SUMMARY.topDestinations.slice(0, 5)

  return (
    <AdminCard className="h-full">
      <h3 className="font-heading text-base font-semibold text-gray-900 mb-3">Top Destinations</h3>
      <div className="space-y-3">
        {top.map((dest, idx) => {
          const slug = dest.destination.toLowerCase().replace(' ', '-')
          const color = getDestinationColor(slug)
          return (
            <div key={dest.destination}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded text-[10px] font-bold bg-gray-100 text-gray-600 flex items-center justify-center">{idx + 1}</span>
                  <span className="font-medium text-gray-700">{dest.destination}</span>
                </div>
                <span className="text-gray-500">{dest.bookingCount} trips</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dest.percentage * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </AdminCard>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Good morning, Andrea 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with A N D Travel today — {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin/inquiries/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
        >
          <Plus size={16} />
          New Inquiry
        </Link>
      </div>

      {/* Today's Tours — full width strip */}
      <TodayToursWidget />

      {/* KPI Strip */}
      <KPIStrip />

      {/* Middle row: Revenue chart + Pipeline + Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <MonthlyRevenueWidget />
        </div>
        <div className="lg:col-span-1">
          <BookingPipelineWidget />
        </div>
        <div className="lg:col-span-1">
          <RecentInquiriesWidget />
        </div>
      </div>

      {/* Bottom row: Activity + Destinations + Upcoming + Tasks + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Activity Feed */}
        <div className="lg:col-span-4">
          <AdminCard className="h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-base font-semibold text-gray-900">Recent Activity</h3>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <DashboardActivityFeed items={MOCK_ACTIVITY.slice(0, 6)} />
          </AdminCard>
        </div>

        {/* Middle: Upcoming + Destinations */}
        <div className="lg:col-span-4 space-y-5">
          <UpcomingDeparturesWidget />
          <PopularDestinationsWidget />
        </div>

        {/* Right: Tasks + Quick Actions */}
        <div className="lg:col-span-4 space-y-5">
          <TeamTasksWidget />
          <QuickActionsWidget />
        </div>
      </div>
    </motion.div>
  )
}
