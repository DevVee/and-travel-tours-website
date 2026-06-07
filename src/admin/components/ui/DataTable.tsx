/**
 * DataTable — Spreadsheet-mode table component
 *
 * Features:
 *  • Column sort (click any header — ↑↓ icons indicate state)
 *  • Column visibility toggle (Columns button → checkbox list)
 *  • Row selection with checkboxes (supports indeterminate "select-all")
 *  • Bulk actions bar (slides in when rows are selected)
 *  • Export CSV (visible columns, current sort order)
 *  • Sticky header (scrolls content, header stays)
 *  • Row click navigation (optional)
 *  • Dense rows — designed for 8h/day staff use
 *
 * Usage:
 *   const columns = useMemo<ColumnDef<MyType>[]>(() => [...], [])
 *   <DataTable data={filteredData} columns={columns} onRowClick={row => navigate(`/${row.id}`)} />
 *
 * The caller is responsible for pre-filtering `data` (search, status tabs, etc.).
 * DataTable handles sort, visibility, selection, and export internally.
 */

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown, Columns3, Download, X } from 'lucide-react'
import { cn } from '@lib/utils'

// ─── Indeterminate Checkbox ───────────────────────────────────────────────────
// Native HTML inputs don't support `indeterminate` as a prop — must be set via ref.

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  disabled,
  className,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate && !checked
    }
  }, [indeterminate, checked])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      onClick={e => e.stopPropagation()}
      className={cn(
        'w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    />
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BulkAction<T> {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  variant?: 'default' | 'danger'
  action: (selectedRows: T[]) => void
}

export interface DataTableProps<T extends object> {
  /** Pre-filtered data rows. DataTable handles sort only; callers own filtering. */
  data: T[]
  /** Column definitions (do NOT include a select column — DataTable adds it). */
  columns: ColumnDef<T>[]
  /** Navigate / open detail when a row is clicked. */
  onRowClick?: (row: T) => void
  /** Actions shown in the bulk-actions bar when ≥1 row is selected. */
  bulkActions?: BulkAction<T>[]
  /** Show the Export CSV button (default: true). */
  enableExport?: boolean
  /** Filename prefix for exported CSV (default: "export"). */
  exportFilename?: string
  /** Message shown when data is empty (default: "No records found"). */
  emptyMessage?: string
  /** Extra nodes rendered on the right side of the toolbar row. */
  toolbar?: React.ReactNode
  /** Default sort applied on first render. */
  defaultSort?: SortingState
  className?: string
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  data,
  columns,
  onRowClick,
  bulkActions = [],
  enableExport = true,
  exportFilename = 'export',
  emptyMessage = 'No records found',
  toolbar,
  defaultSort = [],
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [showColumnPicker, setShowColumnPicker] = useState(false)

  // Prepend the bulk-select checkbox column automatically
  const allColumns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: '_select',
        size: 44,
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler() as React.ChangeEventHandler<HTMLInputElement>}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler() as React.ChangeEventHandler<HTMLInputElement>}
          />
        ),
      },
      ...columns,
    ],
    [columns],
  )

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedData = useMemo(
    () => selectedRows.map(r => r.original),
    [selectedRows],
  )

  // ── Export CSV ──────────────────────────────────────────────────────────────
  function handleExportCSV() {
    const exportCols = table
      .getVisibleLeafColumns()
      .filter(col => col.id !== '_select' && col.id !== '_actions')

    const headers = exportCols
      .map(col => String(col.columnDef.header ?? col.id))
      .join(',')

    const rows = table.getRowModel().rows.map(row =>
      exportCols
        .map(col => {
          const val = row.getValue(col.id)
          return `"${String(val ?? '').replace(/"/g, '""')}"`
        })
        .join(','),
    )

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exportFilename}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const totalRows = table.getFilteredRowModel().rows.length

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Column visibility picker */}
        <div className="relative">
          <button
            onClick={() => setShowColumnPicker(v => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
              showColumnPicker
                ? 'bg-orange-50 border-orange-300 text-brand-orange'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
            )}
          >
            <Columns3 size={14} />
            Columns
          </button>

          {showColumnPicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowColumnPicker(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-admin-popover z-20 py-1.5 overflow-hidden">
                <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Show / Hide Columns
                </p>
                {table
                  .getAllLeafColumns()
                  .filter(col => col.getCanHide())
                  .map(col => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={col.getToggleVisibilityHandler()}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                      />
                      <span className="text-sm text-gray-800 capitalize">
                        {String(col.columnDef.header ?? col.id)}
                      </span>
                    </label>
                  ))}
              </div>
            </>
          )}
        </div>

        {enableExport && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}

        {/* Caller-provided extra toolbar content */}
        {toolbar}

        {/* Row count — right-aligned */}
        <span className="ml-auto text-sm text-gray-500 tabular-nums">
          {selectedRows.length > 0
            ? `${selectedRows.length} of ${totalRows} selected`
            : `${totalRows} record${totalRows !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* ── Bulk-Actions Bar ─────────────────────────────────────────────────── */}
      {selectedRows.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl">
          <span className="text-sm font-semibold text-orange-900 tabular-nums">
            {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
          </span>

          <div className="flex items-center gap-2 ml-2">
            {bulkActions.map(action => (
              <button
                key={action.label}
                onClick={() => action.action(selectedData)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
                )}
              >
                <action.icon size={13} />
                {action.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setRowSelection({})}
            className="ml-auto p-1 text-orange-600 hover:text-orange-900 rounded transition-colors"
            title="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="overflow-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm border-collapse" style={{ minWidth: 'max-content' }}>
          {/* Sticky header */}
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-gray-200">
                {hg.headers.map(header => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <th
                      key={header.id}
                      style={{ width: header.column.columnDef.size }}
                      className={cn(
                        'px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap select-none',
                        canSort &&
                          'cursor-pointer hover:text-gray-800 hover:bg-gray-100 transition-colors',
                      )}
                      onClick={
                        canSort
                          ? e => header.column.getToggleSortingHandler()?.(e)
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="shrink-0">
                            {sorted === 'asc' ? (
                              <ChevronUp size={12} className="text-brand-orange" />
                            ) : sorted === 'desc' ? (
                              <ChevronDown size={12} className="text-brand-orange" />
                            ) : (
                              <ChevronsUpDown size={12} className="text-gray-300" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-16 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={cn(
                    'group transition-colors',
                    row.getIsSelected() ? 'bg-orange-50' : 'hover:bg-gray-50',
                    onRowClick && 'cursor-pointer',
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-gray-900 align-middle whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
