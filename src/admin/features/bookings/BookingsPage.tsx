/**
 * BookingsPage — Operations Center (Spreadsheet-first layout)
 *
 * Layout:
 *  1. Page header + quick stats
 *  2. Attention banner (outstanding balance, pending confirmation)
 *  3. Status pipeline tabs (All → Inquiry → Quoted → Confirmed → Scheduled → Completed → Cancelled)
 *  4. Search bar
 *  5. DataTable (spreadsheet mode, sortable, selectable, exportable)
 *
 * Design: information-dense, high-contrast, no decorative whitespace.
 * Staff can see every booking in one glance and act on it in one click.
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Plus, Search, AlertCircle, ChevronRight,
  RefreshCw, UserCheck, X,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { pageVariants } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { DataTable, type BulkAction } from '@admin-ui/DataTable'
import { MOCK_BOOKINGS } from '@admin-data/mockBookings'
import { BOOKING_STATUS_STYLES } from '@admin-lib/statusColors'
import type { BookingStatus } from '@admin-types/index'
import { formatPeso, formatDateRange } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_ORDER: BookingStatus[] = [
  'inquiry', 'quoted', 'confirmed', 'scheduled', 'completed', 'cancelled',
]

// ─── Column definitions ───────────────────────────────────────────────────────

type Booking = typeof MOCK_BOOKINGS[0]

function useBookingColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Booking>[] {
  return useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Ref #',
        size: 110,
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-gray-500 tracking-wide">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        size: 200,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{row.original.customerName}</p>
            <p className="text-xs text-gray-500 truncate">{row.original.consultantName}</p>
          </div>
        ),
      },
      {
        accessorKey: 'destination',
        header: 'Destination',
        size: 140,
        cell: ({ row }) => (
          <span className="font-medium text-gray-800">{row.original.destination}</span>
        ),
      },
      {
        id: 'travelDates',
        header: 'Travel Dates',
        accessorFn: row => row.travelDateFrom,
        size: 175,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 tabular-nums">
            {formatDateRange(row.original.travelDateFrom, row.original.travelDateTo)}
          </span>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: 'Amount',
        size: 145,
        cell: ({ row }) => (
          <div className="tabular-nums">
            <p className="font-semibold text-gray-900">{formatPeso(row.original.totalAmount)}</p>
            {row.original.balanceAmount > 0 && (
              <p className="text-[11px] font-semibold text-red-600">
                Bal: {formatPeso(row.original.balanceAmount)}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 135,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} type="booking" size="sm" />
        ),
      },
      {
        id: '_actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 48,
        cell: ({ row }) => (
          <button
            onClick={e => {
              e.stopPropagation()
              navigate(`/admin/bookings/${row.original.id}`)
            }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-brand-orange hover:bg-orange-50 opacity-0 group-hover:opacity-100 transition-all"
            title="Open booking"
          >
            <ChevronRight size={15} />
          </button>
        ),
      },
    ],
    [navigate],
  )
}

// ─── BookingsPage ─────────────────────────────────────────────────────────────

export function BookingsPage() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState<BookingStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  // Pre-filter data — DataTable receives already-filtered rows
  const filteredData = useMemo(
    () =>
      MOCK_BOOKINGS.filter(b => {
        if (activeStatus !== 'all' && b.status !== activeStatus) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            b.id.toLowerCase().includes(q) ||
            b.customerName.toLowerCase().includes(q) ||
            b.destination.toLowerCase().includes(q)
          )
        }
        return true
      }),
    [activeStatus, search],
  )

  // Attention items — computed once from the full dataset
  const outstandingBalanceCount = useMemo(
    () => MOCK_BOOKINGS.filter(b => b.balanceAmount > 0).length,
    [],
  )
  const pendingConfirmCount = useMemo(
    () => MOCK_BOOKINGS.filter(b => b.status === 'quoted').length,
    [],
  )
  const hasAttention = outstandingBalanceCount > 0 || pendingConfirmCount > 0

  // Columns and bulk actions
  const columns = useBookingColumns(navigate)
  const bulkActions = useMemo<BulkAction<Booking>[]>(
    () => [
      {
        label: 'Change Status',
        icon: RefreshCw,
        action: rows =>
          console.info('[BookingsPage] Change status for:', rows.map(r => r.id)),
      },
      {
        label: 'Assign Consultant',
        icon: UserCheck,
        action: rows =>
          console.info('[BookingsPage] Assign consultant for:', rows.map(r => r.id)),
      },
    ],
    [],
  )

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-4"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        title="Booking Operations"
        subtitle={`${MOCK_BOOKINGS.length} total bookings`}
        icon={<BookOpen size={18} />}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange">
            <Plus size={15} />
            New Booking
          </button>
        }
      />

      {/* ── Attention banner ─────────────────────────────────────────────────── */}
      {hasAttention && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap text-amber-900">
            <span className="font-semibold">Needs attention:</span>
            {outstandingBalanceCount > 0 && (
              <button
                onClick={() => setActiveStatus('confirmed')}
                className="font-medium hover:underline underline-offset-2"
              >
                {outstandingBalanceCount} booking
                {outstandingBalanceCount !== 1 ? 's' : ''} with outstanding balance
              </button>
            )}
            {outstandingBalanceCount > 0 && pendingConfirmCount > 0 && (
              <span className="text-amber-400 font-light">·</span>
            )}
            {pendingConfirmCount > 0 && (
              <button
                onClick={() => setActiveStatus('quoted')}
                className="font-medium hover:underline underline-offset-2"
              >
                {pendingConfirmCount} quotation
                {pendingConfirmCount !== 1 ? 's' : ''} awaiting customer confirmation
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Status pipeline tabs ─────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
        {/* All */}
        <button
          onClick={() => setActiveStatus('all')}
          className={cn(
            'shrink-0 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            activeStatus === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          All ({MOCK_BOOKINGS.length})
        </button>

        {STATUS_ORDER.map(status => {
          const style = BOOKING_STATUS_STYLES[status]
          const count = MOCK_BOOKINGS.filter(b => b.status === status).length
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
                activeStatus === status
                  ? `${style.bg} ${style.text} ${style.border}`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
              {style.label}
              <span className="opacity-60 tabular-nums text-xs">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reference, customer, destination…"
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                       placeholder:text-gray-400 text-gray-900 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Active filter indicator */}
        {(activeStatus !== 'all' || search) && (
          <button
            onClick={() => { setActiveStatus('all'); setSearch('') }}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Spreadsheet ──────────────────────────────────────────────────────── */}
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={row => navigate(`/admin/bookings/${row.id}`)}
        bulkActions={bulkActions}
        exportFilename="bookings"
        emptyMessage={
          search || activeStatus !== 'all'
            ? 'No bookings match the current filter. Try adjusting your search or status tab.'
            : 'No bookings yet. Create your first booking to get started.'
        }
        defaultSort={[{ id: 'travelDates', desc: false }]}
      />
    </motion.div>
  )
}
