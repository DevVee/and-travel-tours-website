import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Users, CreditCard, FileText, Map } from 'lucide-react'
import { useState } from 'react'
import { pageVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { MOCK_BOOKINGS } from '@admin-data/mockBookings'
import { formatPeso, formatDate, formatDateRange } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

const TABS = ['Details', 'Payments', 'Itinerary', 'Notes'] as const
type Tab = typeof TABS[number]

export function BookingDetailWorkspace() {
  const { id } = useParams()
  const booking = MOCK_BOOKINGS.find(b => b.id === id)
  const [tab, setTab] = useState<Tab>('Details')

  if (!booking) return <div className="p-6 text-gray-500">Booking not found.</div>

  const paymentPercent = (booking.paidAmount / booking.totalAmount) * 100

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6 max-w-5xl">
      {/* Back */}
      <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange">
        <ArrowLeft size={15} />
        Back to Bookings
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm text-gray-500">{booking.id}</span>
            <StatusBadge status={booking.status} type="booking" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">{booking.packageName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{booking.customerName} · {booking.destination}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/admin/itinerary/new`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-xl hover:border-gray-300">
            <Map size={14} />
            Itinerary
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
            <FileText size={14} />
            Invoice
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Travel Dates', value: formatDateRange(booking.travelDateFrom, booking.travelDateTo), icon: Calendar },
          { label: 'Passengers', value: `${booking.paxAdults + booking.paxChildren} pax`, icon: Users },
          { label: 'Total Amount', value: formatPeso(booking.totalAmount), icon: CreditCard },
          { label: 'Balance', value: formatPeso(booking.balanceAmount), icon: CreditCard },
        ].map(kpi => (
          <AdminCard key={kpi.label}>
            <div className="flex items-center gap-2 mb-1">
              <kpi.icon size={14} className="text-brand-orange" />
              <span className="text-xs text-gray-500">{kpi.label}</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{kpi.value}</p>
          </AdminCard>
        ))}
      </div>

      {/* Payment progress */}
      <AdminCard>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Payment Progress</span>
          <span className="text-sm font-bold text-brand-orange">{paymentPercent.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${paymentPercent}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-brand-orange rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span>Paid: {formatPeso(booking.paidAmount)}</span>
          <span>Balance: {formatPeso(booking.balanceAmount)}</span>
        </div>
      </AdminCard>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Details' && (
        <div className="grid grid-cols-2 gap-4">
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-3">Booking Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-medium">{booking.packageName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium">{booking.destination}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">From Date</span><span className="font-medium">{formatDate(booking.travelDateFrom)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">To Date</span><span className="font-medium">{formatDate(booking.travelDateTo)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Pax (Adults)</span><span className="font-medium">{booking.paxAdults}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Pax (Children)</span><span className="font-medium">{booking.paxChildren}</span></div>
            </div>
          </AdminCard>
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-3">Customer Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{booking.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{booking.customerEmail}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{booking.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Consultant</span><span className="font-medium">{booking.consultantName}</span></div>
            </div>
          </AdminCard>
        </div>
      )}

      {tab === 'Payments' && (
        <AdminCard padding="none">
          <div className="px-5 py-3.5 border-b border-gray-100 grid grid-cols-4 gap-4 text-xs font-semibold text-gray-500 uppercase">
            <span>Date</span><span>Amount</span><span>Method</span><span>Reference</span>
          </div>
          {booking.payments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No payments recorded</p>
          ) : (
            booking.payments.map(pay => (
              <div key={pay.id} className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-gray-50 text-sm">
                <span className="text-gray-600">{formatDate(pay.paidAt)}</span>
                <span className="font-semibold text-green-600">{formatPeso(pay.amount)}</span>
                <span className="capitalize text-gray-700">{pay.method.replace('_', ' ')}</span>
                <span className="font-mono text-xs text-gray-500">{pay.reference ?? '—'}</span>
              </div>
            ))
          )}
        </AdminCard>
      )}

      {tab === 'Itinerary' && (
        <AdminCard>
          {booking.itineraryId ? (
            <Link to={`/admin/itinerary/${booking.itineraryId}/edit`} className="flex items-center gap-2 text-brand-orange hover:underline font-medium">
              <Map size={15} />
              View Itinerary {booking.itineraryId}
            </Link>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">No itinerary created yet</p>
              <Link to="/admin/itinerary/new" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600">
                <Map size={14} />
                Create Itinerary
              </Link>
            </div>
          )}
        </AdminCard>
      )}

      {tab === 'Notes' && (
        <AdminCard>
          {booking.specialRequests && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Special Requests</p>
              <p className="text-sm text-gray-700">{booking.specialRequests}</p>
            </div>
          )}
          {booking.notes && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Internal Notes</p>
              <p className="text-sm text-gray-700">{booking.notes}</p>
            </div>
          )}
          {!booking.specialRequests && !booking.notes && (
            <p className="text-sm text-gray-400 italic">No notes yet.</p>
          )}
        </AdminCard>
      )}
    </motion.div>
  )
}
