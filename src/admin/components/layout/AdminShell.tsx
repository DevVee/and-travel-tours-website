import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, MobileSidebar, SidebarProvider } from './Sidebar'
import { Topbar } from './Topbar'
import { pageVariants, scaleIn, backdropVariants } from '@admin-lib/adminAnimations'
import { Search, X } from 'lucide-react'

// ─── Command Palette ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'New Inquiry',      path: '/inquiries/new',     group: 'Create' },
  { label: 'New Quotation',    path: '/quotations/new',    group: 'Create' },
  { label: 'New Package',      path: '/packages/new',      group: 'Create' },
  { label: 'Dashboard',        path: '/',                   group: 'Navigate' },
  { label: 'Inquiries',        path: '/inquiries',         group: 'Navigate' },
  { label: 'Bookings',         path: '/bookings',          group: 'Navigate' },
  { label: 'Tour Scheduling',  path: '/schedule',          group: 'Navigate' },
  { label: 'Reports',          path: '/reports',           group: 'Navigate' },
]

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')

  const filtered = QUICK_ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-lg bg-white rounded-2xl shadow-admin-modal overflow-hidden border border-gray-100"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search or jump to…"
                  className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
                  onKeyDown={e => e.key === 'Escape' && onClose()}
                />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="py-2 max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-6">No results found</p>
                ) : (
                  <div>
                    {Array.from(new Set(filtered.map(a => a.group))).map(group => (
                      <div key={group}>
                        <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          {group}
                        </p>
                        {filtered.filter(a => a.group === group).map(action => (
                          <a
                            key={action.path}
                            href={action.path}
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                          >
                            {action.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="font-mono">↵</kbd> Open</span>
                <span><kbd className="font-mono">Esc</kbd> Close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Admin Shell ───────────────────────────────────────────────────────────

export function AdminShell() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="admin-root flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        <MobileSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar onCommandPalette={() => setPaletteOpen(true)} />

          <main
            id="admin-main"
            className="flex-1 overflow-y-auto"
          >
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>

        {/* Command Palette */}
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
        />
      </div>
    </SidebarProvider>
  )
}
