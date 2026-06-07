/**
 * QuotationsPage — Simple filtered list (replaces status-column kanban)
 *
 * Status columns look organized but make it hard to:
 *  - Compare quotes across statuses at a glance
 *  - Sort by total value or expiry date
 *  - Select multiple and export
 *  - Know at a glance what the total pipeline value is
 *
 * This replaces it with a dense, sortable table plus a summary strip at top.
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, X, TrendingUp } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { pageVariants } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { DataTable } from '@admin-ui/DataTable'
import { MOCK_QUOTATIONS } from '@admin-data/mockQuotations'
import { QUOTATION_STATUS_STYLES } from '@admin-lib/statusColors'
import type { QuotationStatus } from '@admin-types/index'
import { formatPeso, formatDate } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// ─── Status pipeline ──────────────────────────────────────────────────────────

const STATUS_ORDER: QuotationStatus[] = ['draft', 'sent', 'approved', 'expired', 'rejected']

// ─── Column definitions ───────────────────────────────────────────────────────

type Quotation = typeof MOCK_QUOTATIONS[0]

function useQuotationColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Quotation>[] {
  return useMemo<ColumnDef<Quotation>[]>(
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
        size: 190,
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900">{row.original.customerName}</span>
        ),
      },
      {
        accessorKey: 'destination',
        header: 'Destination',
        size: 145,
        cell: ({ row }) => (
          <span className="font-medium text-gray-800">{row.original.destination}</span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 140,
        cell: ({ row }) => (
          <span className="font-semibold text-brand-orange tabular-nums">
            {formatPeso(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} type="quotation" size="sm" />
        ),
      },
      {
        id: 'validUntil',
        header: 'Valid Until',
        accessorFn: row => row.validUntil,
        size: 120,
        cell: ({ row }) => {
          const expiry = new Date(row.original.validUntil)
          const today  = new Date()
          const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000)
          const isExpiring = daysLeft <= 3 && daysLeft >= 0
          const isExpired  = daysLeft < 0

          return (
            <span
              className={cn(
                'text-sm tabular-nums',
                isExpired  ? 'text-red-600 font-medium' :
                isExpiring ? 'text-amber-600 font-medium' :
                'text-gray-700',
              )}
            >
              {formatDate(row.original.validUntil)}
              {isExpiring && !isExpired && (
                <span className="ml-1 text-xs text-amber-500">({daysLeft}d)</span>
              )}
            </span>
          )
        },
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorFn: row => row.createdAt,
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-gray-600 tabular-nums">
            {formatDate(row.original.createdAt)}
          </span>
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
              navigate(`/admin/quotations/${row.original.id}`)
            }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-brand-orange hover:bg-orange-50 opacity-0 group-hover:opacity-100 transition-all"
            title="Open quotation"
          >
            <FileText size={14} />
          </button>
        ),
      },
    ],
    [navigate],
  )
}

// ─── QuotationsPage ───────────────────────────────────────────────────────────

export function QuotationsPage() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState<QuotationStatus | 'all'>('all')
  const [search, setSearch]             = useState('')

  const filteredData = useMemo(
    () =>
      MOCK_QUOTATIONS.filter(q => {
        if (activeStatus !== 'all' && q.status !== activeStatus) return false
        if (search) {
          const s = search.toLowerCase()
          return (
            q.id.toLowerCase().includes(s) ||
            q.customerName.toLowerCase().includes(s) ||
            q.destination.toLowerCase().includes(s)
          )
        }
        return true
      }),
    [activeStatus, search],
  )

  // Pipeline value summary
  const pipelineValue = useMemo(
    () =>
      MOCK_QUOTATIONS.filter(q => q.status === 'sent' || q.status === 'draft')
        .reduce((sum, q) => sum + q.total, 0),
    [],
  )
  const approvedValue = useMemo(
    () =>
      MOCK_QUOTATIONS.filter(q => q.status === 'approved')
        .reduce((sum, q) => sum + q.total, 0),
    [],
  )

  const columns = useQuotationColumns(navigate)

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-4"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        title="Quotations"
        subtitle={`${MOCK_QUOTATIONS.length} total quotations`}
        icon={<FileText size={18} />}
        actions={
          <Link
            to="/admin/quotations/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
          >
            <Plus size={15} />
            New Quote
          </Link>
        }
      />

      {/* ── Pipeline value strip ──────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
          <TrendingUp size={16} className="text-brand-orange" />
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Open Pipeline</p>
            <p className="text-base font-bold text-gray-900 tabular-nums">{formatPeso(pipelineValue)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <TrendingUp size={16} className="text-green-600" />
          <div>
            <p className="text-[11px] text-green-700 font-medium uppercase tracking-wider">Approved</p>
            <p className="text-base font-bold text-green-900 tabular-nums">{formatPeso(approvedValue)}</p>
          </div>
        </div>
      </div>

      {/* ── Status tabs ───────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveStatus('all')}
          className={cn(
            'shrink-0 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            activeStatus === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          All ({MOCK_QUOTATIONS.length})
        </button>

        {STATUS_ORDER.map(status => {
          const style = QUOTATION_STATUS_STYLES[status]
          const count = MOCK_QUOTATIONS.filter(q => q.status === status).length
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

      {/* ── Quotation list ────────────────────────────────────────────────────── */}
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={row => navigate(`/admin/quotations/${row.id}`)}
        exportFilename="quotations"
        emptyMessage={
          search || activeStatus !== 'all'
            ? 'No quotations match the current filter.'
            : 'No quotations yet. Create your first quote to get started.'
        }
        defaultSort={[{ id: 'createdAt', desc: true }]}
      />
    </motion.div>
  )
}
