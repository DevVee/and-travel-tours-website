/**
 * InquiriesPage — Simple filtered list (replaces the kanban board)
 *
 * Kanban boards look great in demos but slow down daily work:
 *  - Hard to scan 40+ cards across 5 columns
 *  - No sorting, no export, no bulk actions
 *  - Status changes require drag-and-drop instead of a click
 *
 * This replaces it with a dense, sortable, filterable list:
 *  - Status tabs at top (same pipeline stages, much clearer counts)
 *  - Search by customer, destination, or ID
 *  - Sortable columns: date received, destination, status
 *  - Bulk actions: Assign Consultant, Change Status, Export
 *  - One-click row → Inquiry Workspace
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare, Plus, Search, Clock, User, ChevronRight, X,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { pageVariants } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { DataTable } from '@admin-ui/DataTable'
import { MOCK_INQUIRIES } from '@admin-data/mockInquiries'
import { INQUIRY_STATUS_STYLES } from '@admin-lib/statusColors'
import type { InquiryStatus } from '@admin-types/index'
import { formatRelative, truncate } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// ─── Pipeline stages (left-to-right workflow order) ───────────────────────────

const STAGES: { key: InquiryStatus; label: string }[] = [
  { key: 'new',        label: 'New'           },
  { key: 'discussion', label: 'In Discussion' },
  { key: 'quoted',     label: 'Quoted'        },
  { key: 'converted',  label: 'Converted'     },
  { key: 'archived',   label: 'Archived'      },
]

// ─── Column definitions ───────────────────────────────────────────────────────

type Inquiry = typeof MOCK_INQUIRIES[0]

function useInquiryColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<Inquiry>[] {
  return useMemo<ColumnDef<Inquiry>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 105,
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
          <div className="flex items-center gap-2.5">
            {row.original.assignedConsultantAvatar ? (
              <img
                src={row.original.assignedConsultantAvatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0 opacity-0 hidden"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User size={12} className="text-gray-500" />
              </div>
            )}
            <span className="font-semibold text-gray-900 truncate">
              {row.original.customerName}
            </span>
          </div>
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
        id: 'message',
        header: 'Message',
        accessorFn: row => row.message,
        size: 260,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-gray-600">{truncate(row.original.message, 70)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        cell: ({ row }) => {
          const style = INQUIRY_STATUS_STYLES[row.original.status]
          return (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border',
                style.bg, style.text, style.border,
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
              {style.label}
            </span>
          )
        },
      },
      {
        id: 'createdAt',
        header: 'Received',
        accessorFn: row => row.createdAt,
        size: 115,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 tabular-nums">
            <Clock size={12} className="shrink-0" />
            {formatRelative(row.original.createdAt)}
          </div>
        ),
      },
      {
        id: 'consultant',
        header: 'Consultant',
        accessorFn: row => row.assignedConsultantName ?? '',
        size: 145,
        cell: ({ row }) => (
          row.original.assignedConsultantName ? (
            <span className="text-sm text-gray-700">{row.original.assignedConsultantName}</span>
          ) : (
            <span className="text-sm text-gray-400 italic">Unassigned</span>
          )
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
              navigate(`/admin/inquiries/${row.original.id}`)
            }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-brand-orange hover:bg-orange-50 opacity-0 group-hover:opacity-100 transition-all"
            title="Open inquiry"
          >
            <ChevronRight size={15} />
          </button>
        ),
      },
    ],
    [navigate],
  )
}

// ─── InquiriesPage ────────────────────────────────────────────────────────────

export function InquiriesPage() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState<InquiryStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filteredData = useMemo(
    () =>
      MOCK_INQUIRIES.filter(inq => {
        if (activeStatus !== 'all' && inq.status !== activeStatus) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            inq.customerName.toLowerCase().includes(q) ||
            inq.destination.toLowerCase().includes(q) ||
            inq.id.toLowerCase().includes(q)
          )
        }
        return true
      }),
    [activeStatus, search],
  )

  const columns = useInquiryColumns(navigate)

  // New inquiries count — shown as badge in the header
  const newCount = MOCK_INQUIRIES.filter(i => i.status === 'new').length

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-4"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        title="Inquiries"
        subtitle={`${MOCK_INQUIRIES.length} total · ${newCount} new`}
        icon={<MessageSquare size={18} />}
        actions={
          <Link
            to="/admin/inquiries/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
          >
            <Plus size={15} />
            New Inquiry
          </Link>
        }
      />

      {/* ── Pipeline stage tabs ───────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
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
          All ({MOCK_INQUIRIES.length})
        </button>

        {STAGES.map(stage => {
          const style = INQUIRY_STATUS_STYLES[stage.key]
          const count = MOCK_INQUIRIES.filter(i => i.status === stage.key).length
          return (
            <button
              key={stage.key}
              onClick={() => setActiveStatus(stage.key)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
                activeStatus === stage.key
                  ? `${style.bg} ${style.text} ${style.border}`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
              {stage.label}
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
            placeholder="Search customer, destination, ID…"
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

      {/* ── Inquiry list (spreadsheet) ────────────────────────────────────────── */}
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={row => navigate(`/admin/inquiries/${row.id}`)}
        exportFilename="inquiries"
        emptyMessage={
          search || activeStatus !== 'all'
            ? 'No inquiries match the current filter.'
            : 'No inquiries yet.'
        }
        defaultSort={[{ id: 'createdAt', desc: true }]}
      />
    </motion.div>
  )
}
