import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, BarChart2, Users, FileText, DollarSign, Star } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { AdminCard } from '@admin-ui/AdminCard'
import { MOCK_REPORT_SUMMARY } from '@admin-data/mockReports'
import { formatPeso, formatPercent } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year', 'Custom']

const DESTINATION_COLORS = ['#F97316', '#8B5CF6', '#D4A017', '#10B981', '#EC4899', '#6B7280']

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card-lg px-3 py-2">
      <p className="text-xs font-bold text-gray-800">{label}</p>
      <p className="text-sm font-bold text-brand-orange mt-0.5">{formatPeso(payload[0].value)}</p>
      {payload[1] && (
        <p className="text-xs text-gray-500">{payload[1].value} bookings</p>
      )}
    </div>
  )
}

export function ReportsPage() {
  const [range, setRange] = useState('This Year')
  const report = MOCK_REPORT_SUMMARY

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatPeso(report.totalRevenue),
      growth: report.revenueGrowth,
      icon: DollarSign,
      color: 'text-brand-orange',
      bg: 'bg-orange-50',
    },
    {
      label: 'Total Bookings',
      value: String(report.totalBookings),
      growth: report.bookingGrowth,
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Inquiries',
      value: String(report.totalInquiries),
      growth: report.inquiryGrowth,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Conversion Rate',
      value: formatPercent(report.conversionRate),
      growth: 3.2,
      icon: BarChart2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Reports & Analytics"
          subtitle="Business intelligence overview"
          icon={<BarChart2 size={18} />}
        />
        {/* Date range picker */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {DATE_RANGES.filter(r => r !== 'Custom').map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                range === r ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const positive = kpi.growth >= 0
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminCard hover>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', kpi.bg)}>
                    <kpi.icon size={16} className={kpi.color} />
                  </div>
                  <span className={cn(
                    'flex items-center gap-0.5 text-xs font-semibold',
                    positive ? 'text-green-600' : 'text-red-500'
                  )}>
                    {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(kpi.growth)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </AdminCard>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Revenue + Bookings Chart ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <AdminCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-base font-semibold text-gray-900">Monthly Revenue</h2>
                <p className="text-xs text-gray-500 mt-0.5">12-month rolling trend</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-brand-orange inline-block" />Revenue</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={report.monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F97316" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis
                  tickFormatter={v => `₱${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#F97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-base font-semibold text-gray-900">Bookings vs Inquiries</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={report.monthlyRevenue} barGap={2} margin={{ top: 0, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="bookings"  name="Bookings"  fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="inquiries" name="Inquiries" fill="#D4A017" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </AdminCard>

          {/* Conversion Funnel */}
          <AdminCard>
            <h2 className="font-heading text-base font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
            <div className="space-y-2">
              {report.conversionFunnel.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{stage.stage}</span>
                    <span className="text-gray-500">{stage.count} ({(stage.percentage * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage * 100}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: `rgba(249, 115, 22, ${0.4 + stage.percentage * 0.6})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Destination donut */}
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-800 mb-3">Top Destinations</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={report.topDestinations}
                  dataKey="percentage"
                  nameKey="destination"
                  cx="50%" cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {report.topDestinations.map((_, idx) => (
                    <Cell key={idx} fill={DESTINATION_COLORS[idx % DESTINATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: unknown) => [`${(Number(v) * 100).toFixed(1)}%`]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-2 mt-2">
              {report.topDestinations.slice(0, 5).map((d, i) => (
                <motion.div key={d.destination} variants={listItem} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DESTINATION_COLORS[i] }} />
                  <span className="flex-1 text-xs text-gray-600 truncate">{d.destination}</span>
                  <span className="text-xs font-semibold text-gray-800">{(d.percentage * 100).toFixed(0)}%</span>
                </motion.div>
              ))}
            </motion.div>
          </AdminCard>

          {/* Top packages */}
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-800 mb-3">Top Packages</h3>
            <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-3">
              {report.topPackages.map((pkg, i) => (
                <motion.div key={pkg.packageName} variants={listItem} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{pkg.packageName}</p>
                    <p className="text-[10px] text-gray-500">{pkg.bookingCount} bookings · {formatPeso(pkg.revenue)}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold flex-shrink-0">
                    <Star size={9} fill="currentColor" />
                    {pkg.rating}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AdminCard>

          {/* Quick stats */}
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-800 mb-3">Quick Stats</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Avg. Booking Value', value: formatPeso(report.avgBookingValue) },
                { label: 'Revenue Growth (YoY)', value: `+${report.revenueGrowth}%`, positive: true },
                { label: 'Booking Growth (YoY)', value: `+${report.bookingGrowth}%`, positive: true },
                { label: 'Inquiry Growth (YoY)', value: `+${report.inquiryGrowth}%`, positive: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 text-xs">{item.label}</span>
                  <span className={cn('font-semibold text-xs', item.positive ? 'text-green-600' : 'text-gray-900')}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </motion.div>
  )
}
