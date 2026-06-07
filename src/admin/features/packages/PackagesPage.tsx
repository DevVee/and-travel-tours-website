/**
 * PackagesPage — Filterable list of tour packages
 *
 * Replaces the Airbnb-style card grid with a dense, actionable list:
 *  - Search by title or destination
 *  - Filter by badge (Best Value, Most Popular, Premium)
 *  - Sortable: price, duration, name
 *  - One-click row → Package Editor
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Plus, Search, X } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { pageVariants } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { DataTable } from '@admin-ui/DataTable'
import { formatPeso } from '@admin-lib/formatters'
import { packages } from '@data/packages'
import { cn } from '@lib/utils'

// ─── Types & helpers ──────────────────────────────────────────────────────────

type TourPackage = typeof packages[0]

const BADGE_COLORS: Record<string, string> = {
  'Best Value':   'bg-green-50 text-green-700 border-green-200',
  'Most Popular': 'bg-orange-50 text-brand-orange border-orange-200',
  'Premium':      'bg-amber-50 text-amber-700 border-amber-200',
}

const ALL_BADGES = Array.from(new Set(packages.map(p => p.badge).filter(Boolean))) as string[]

// ─── Column definitions ───────────────────────────────────────────────────────

function usePackageColumns(navigate: ReturnType<typeof useNavigate>): ColumnDef<TourPackage>[] {
  return useMemo<ColumnDef<TourPackage>[]>(
    () => [
      {
        id: 'package',
        accessorFn: row => row.title,
        header: 'Package',
        size: 260,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={`${row.original.imageUrl}&w=64&h=48&q=75&auto=format&fit=crop`}
              alt=""
              className="w-14 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{row.original.title}</p>
              {row.original.badge && (
                <span
                  className={cn(
                    'inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full border',
                    BADGE_COLORS[row.original.badge] ?? 'bg-gray-100 text-gray-600 border-gray-200',
                  )}
                >
                  {row.original.badge}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        id: 'destination',
        header: 'Destination',
        accessorFn: row => row.title.split(' ')[0],  // best-effort until data has destination field
        size: 140,
        cell: ({ row }) => (
          <span className="font-medium text-gray-800">{row.original.title.split(' ')[0]}</span>
        ),
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorFn: row => row.nights,
        size: 110,
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 tabular-nums">
            {row.original.nights}N / {row.original.days}D
          </span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 140,
        cell: ({ row }) => (
          <div className="tabular-nums">
            <p className="font-semibold text-gray-900">{formatPeso(row.original.price)}</p>
            {row.original.originalPrice && row.original.originalPrice > row.original.price && (
              <p className="text-xs text-gray-400 line-through">
                {formatPeso(row.original.originalPrice)}
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'includes',
        header: 'Inclusions',
        accessorFn: row => row.includes?.join(', ') ?? '',
        size: 250,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-1 flex-wrap">
            {(row.original.includes ?? []).slice(0, 4).map(inc => (
              <span
                key={inc}
                className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {inc}
              </span>
            ))}
            {(row.original.includes?.length ?? 0) > 4 && (
              <span className="text-[10px] text-gray-400">
                +{(row.original.includes?.length ?? 0) - 4}
              </span>
            )}
          </div>
        ),
      },
      {
        id: '_actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 80,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={e => {
                e.stopPropagation()
                navigate(`/admin/packages/${row.original.id}/edit`)
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    [navigate],
  )
}

// ─── PackagesPage ─────────────────────────────────────────────────────────────

export function PackagesPage() {
  const navigate = useNavigate()
  const [search, setSearch]   = useState('')
  const [badge, setBadge]     = useState<string>('all')

  const filteredData = useMemo(
    () =>
      packages.filter(pkg => {
        if (badge !== 'all' && pkg.badge !== badge) return false
        if (search) {
          const q = search.toLowerCase()
          return pkg.title.toLowerCase().includes(q)
        }
        return true
      }),
    [search, badge],
  )

  const columns = usePackageColumns(navigate)

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-4"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        title="Tour Packages"
        subtitle={`${packages.length} packages`}
        icon={<Package size={18} />}
        actions={
          <Link
            to="/admin/packages/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
          >
            <Plus size={15} />
            New Package
          </Link>
        }
      />

      {/* ── Badge filter tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        <button
          onClick={() => setBadge('all')}
          className={cn(
            'shrink-0 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
            badge === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          All ({packages.length})
        </button>

        {ALL_BADGES.map(b => {
          const count = packages.filter(p => p.badge === b).length
          return (
            <button
              key={b}
              onClick={() => setBadge(b)}
              className={cn(
                'shrink-0 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
                badge === b
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              {b} ({count})
            </button>
          )
        })}
      </div>

      {/* ── Search ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search packages…"
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

        {(badge !== 'all' || search) && (
          <button
            onClick={() => { setBadge('all'); setSearch('') }}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* ── Package list ─────────────────────────────────────────────────────── */}
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={row => navigate(`/admin/packages/${row.id}/edit`)}
        exportFilename="packages"
        emptyMessage={
          search || badge !== 'all'
            ? 'No packages match the current filter.'
            : 'No packages yet. Create your first tour package.'
        }
        defaultSort={[{ id: 'price', desc: false }]}
      />
    </motion.div>
  )
}
