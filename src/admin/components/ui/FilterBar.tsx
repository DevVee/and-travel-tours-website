import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@lib/utils'

interface FilterOption {
  label: string
  value: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (v: string) => void
  filters?: FilterConfig[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
  rightSlot?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = 'Search…',
  searchValue = '',
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  rightSlot,
  className,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const activeCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main bar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange placeholder:text-gray-400 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(f => !f)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-colors',
              showFilters || activeCount > 0
                ? 'bg-orange-50 border-orange-200 text-brand-orange'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        )}

        {/* Clear filters */}
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <X size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* Right slot (e.g. view toggle, create button) */}
        {rightSlot && <div className="ml-auto">{rightSlot}</div>}
      </div>

      {/* Filter dropdowns */}
      <AnimatePresence>
        {showFilters && filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-1">
              {filters.map(filter => (
                <FilterDropdown
                  key={filter.key}
                  filter={filter}
                  value={activeFilters[filter.key] ?? ''}
                  onChange={val => onFilterChange?.(filter.key, val)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Filter Dropdown ───────────────────────────────────────────────────────

function FilterDropdown({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = filter.options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl border transition-colors',
          value
            ? 'bg-orange-50 border-orange-200 text-brand-orange font-medium'
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
        )}
      >
        <span>{selected?.label ?? filter.label}</span>
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-admin-popover z-20 overflow-hidden py-1"
            >
              <button
                onClick={() => { onChange(''); setOpen(false) }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm transition-colors',
                  !value ? 'text-brand-orange font-medium bg-orange-50' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                All {filter.label}
              </button>
              {filter.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm transition-colors',
                    value === opt.value ? 'text-brand-orange font-medium bg-orange-50' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
