import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, Search, Bell, ChevronDown, LogOut, User,
  Settings, ChevronRight,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { useSidebar } from './Sidebar'
import { CURRENT_USER } from '@admin-data/mockUsers'
import { ROLE_STYLES } from '@admin-lib/statusColors'
import { getInitials } from '@admin-lib/formatters'
import { popoverVariants } from '@admin-lib/adminAnimations'

// ─── Breadcrumb ────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  admin:         'Dashboard',
  inquiries:     'Inquiries',
  customers:     'Customers',
  quotations:    'Quotations',
  bookings:      'Bookings',
  packages:      'Tour Packages',
  destinations:  'Destinations',
  schedule:      'Tour Scheduling',
  itinerary:     'Itinerary Builder',
  reports:       'Reports & Analytics',
  users:         'Users',
  'audit-logs':  'Audit Logs',
  notifications: 'Notifications',
  settings:      'Settings',
  new:           'New',
  edit:          'Edit',
}

function Breadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const crumbs = segments.map((seg, idx) => {
    const label = ROUTE_LABELS[seg] ?? seg.toUpperCase()
    const path  = '/' + segments.slice(0, idx + 1).join('/')
    const isLast = idx === segments.length - 1
    return { label, path, isLast }
  })

  if (crumbs.length <= 1) return null

  return (
    <nav className="hidden sm:flex items-center gap-1 text-sm">
      {crumbs.map((crumb, idx) => (
        <div key={crumb.path} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {crumb.isLast ? (
            <span className="font-semibold text-gray-900">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="text-gray-500 hover:text-brand-orange transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// ─── Notification Bell ─────────────────────────────────────────────────────

function NotificationBell() {
  const [open, setOpen] = useState(false)

  const NOTIFS = [
    { id: 1, title: 'New inquiry received',    msg: 'Rodrigo Macaraeg — South Korea', time: '2h ago', unread: true },
    { id: 2, title: 'Booking BK-0089 confirmed', msg: 'Carla Mendoza — Dubai Dec 22', time: '3h ago', unread: true },
    { id: 3, title: 'Payment received',          msg: '₱58,000 for BK-0089',          time: '3h ago', unread: true },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full ring-2 ring-white" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-admin-modal border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                <button className="text-xs text-brand-orange font-medium hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-gray-50">
                {NOTIFS.map(n => (
                  <div key={n.id} className={cn('px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors', n.unread && 'bg-orange-50/50')}>
                    <div className="flex items-start gap-2">
                      {n.unread && <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.msg}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/notifications" className="block px-4 py-3 text-xs text-center text-brand-orange font-medium hover:bg-orange-50 transition-colors">
                View all notifications →
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── User Menu ─────────────────────────────────────────────────────────────

function UserMenu() {
  const [open, setOpen] = useState(false)
  const user = CURRENT_USER
  const roleStyle = ROLE_STYLES[user.role]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-orange/20" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center">
            <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-gray-900 leading-tight">{user.name}</p>
          <span className={cn('text-[10px] font-medium', roleStyle.text)}>{roleStyle.label}</span>
        </div>
        <ChevronDown size={14} className={cn('text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-admin-modal border border-gray-100 z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="p-1.5">
                <Link to="/admin/users/u001" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <User size={15} className="text-gray-500" />
                  My Profile
                </Link>
                <Link to="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings size={15} className="text-gray-500" />
                  Settings
                </Link>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Topbar ────────────────────────────────────────────────────────────────

interface TopbarProps {
  onCommandPalette?: () => void
}

export function Topbar({ onCommandPalette }: TopbarProps) {
  const { setMobileOpen } = useSidebar()

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center gap-4 px-4 sm:px-6 flex-shrink-0 sticky top-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb />
      </div>

      {/* Search pill */}
      <button
        onClick={onCommandPalette}
        className="hidden sm:flex items-center gap-2.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-500 transition-colors"
      >
        <Search size={14} />
        <span>Search…</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-gray-200 text-gray-400">
          ⌘K
        </kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}
