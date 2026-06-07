/**
 * CustomersPage — Filterable list (no card grid, no kanban)
 *
 * A single, dense table of all customers with:
 *  - Search by name / email / phone
 *  - Quick filter tabs: All | VIP | Repeat
 *  - Sortable columns (name, bookings, total spent, last trip)
 *  - Bulk selection + export
 *  - One-click row → Customer Profile
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Star, X } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { pageVariants } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { DataTable } from '@admin-ui/DataTable'
import { MOCK_CUSTOMERS } from '@admin-data/mockCustomers'
import { formatPeso, formatDate, getInitials } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// ─── Column definitions ───────────────────────────────────────────────────────

type Customer = typeof MOCK_CUSTOMERS[0]

function useCustomerColumns(): ColumnDef<Customer>[] {
  return useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: 'name',
        accessorFn: row => row.name,
        header: 'Customer',
        size: 220,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.avatarUrl ? (
              <img
                src={row.original.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">{getInitials(row.original.name)}</span>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-gray-900 truncate">{row.original.name}</p>
                {row.original.tags.includes('vip') && (
                  <Star size={11} className="text-amber-500 fill-amber-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{row.original.address}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 210,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 truncate block">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 145,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 tabular-nums">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: 'totalBookings',
        header: 'Bookings',
        size: 95,
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900 tabular-nums">
            {row.original.totalBookings}
          </span>
        ),
      },
      {
        accessorKey: 'totalSpent',
        header: 'Total Spent',
        size: 135,
        cell: ({ row }) => (
          <span className="font-semibold text-brand-orange tabular-nums">
            {formatPeso(row.original.totalSpent, true)}
          </span>
        ),
      },
      {
        id: 'lastTrip',
        header: 'Last Trip',
        accessorFn: row => row.lastTravelDate ?? '',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 tabular-nums">
            {row.original.lastTravelDate ? formatDate(row.original.lastTravelDate) : '—'}
          </span>
        ),
      },
      {
        id: 'destinations',
        header: 'Preferred Destinations',
        accessorFn: row => row.preferredDestinations.join(', '),
        size: 220,
        cell: ({ row }) => (
          <div className="flex gap-1 flex-wrap">
            {row.original.preferredDestinations.slice(0, 3).map(dest => (
              <span
                key={dest}
                className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-brand-orange font-medium rounded-full"
              >
                {dest}
              </span>
            ))}
            {row.original.preferredDestinations.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{row.original.preferredDestinations.length - 3}
              </span>
            )}
          </div>
        ),
      },
    ],
    [],
  )
}

// ─── Quick filter tabs ────────────────────────────────────────────────────────

type QuickFilter = 'all' | 'vip' | 'repeat'

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: 'all',    label: 'All Customers' },
  { key: 'vip',    label: 'VIP'           },
  { key: 'repeat', label: 'Repeat (3+)'   },
]

// ─── CustomersPage ────────────────────────────────────────────────────────────

export function CustomersPage() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')

  const filteredData = useMemo(
    () =>
      MOCK_CUSTOMERS.filter(c => {
        // Quick filter
        if (quickFilter === 'vip'    && !c.tags.includes('vip'))      return false
        if (quickFilter === 'repeat' && c.totalBookings < 3)           return false
        // Search
        if (search) {
          const q = search.toLowerCase()
          return (
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.includes(q)
          )
        }
        return true
      }),
    [search, quickFilter],
  )

  const columns = useCustomerColumns()

  const vipCount    = MOCK_CUSTOMERS.filter(c => c.tags.includes('vip')).length
  const repeatCount = MOCK_CUSTOMERS.filter(c => c.totalBookings >= 3).length

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-4"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        title="Customer Directory"
        subtitle={`${MOCK_CUSTOMERS.length} total customers`}
        icon={<Users size={18} />}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange">
            <Plus size={15} />
            Add Customer
          </button>
        }
      />

      {/* ── Quick filter tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {QUICK_FILTERS.map(f => {
          const count =
            f.key === 'all'    ? MOCK_CUSTOMERS.length :
            f.key === 'vip'    ? vipCount :
            repeatCount
          return (
            <button
              key={f.key}
              onClick={() => setQuickFilter(f.key)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
                quickFilter === f.key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              {f.key === 'vip' && (
                <Star size={12} className={quickFilter === 'vip' ? 'fill-white' : 'fill-amber-400 text-amber-400'} />
              )}
              {f.label}
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
            placeholder="Search name, email, phone…"
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

        {(quickFilter !== 'all' || search) && (
          <button
            onClick={() => { setQuickFilter('all'); setSearch('') }}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Customer list (spreadsheet) ──────────────────────────────────────── */}
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={row => navigate(`/admin/customers/${row.id}`)}
        exportFilename="customers"
        emptyMessage={
          search || quickFilter !== 'all'
            ? 'No customers match the current filter.'
            : 'No customers yet.'
        }
        defaultSort={[{ id: 'totalSpent', desc: true }]}
      />
    </motion.div>
  )
}
