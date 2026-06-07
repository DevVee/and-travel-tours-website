import { useState, createContext, useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Users, FileText, BookOpen,
  Package, MapPin, Calendar, Map, BarChart3, UserCog,
  Shield, Bell, Settings, ChevronLeft, ChevronRight, X,
  Plane,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { sidebarLabel } from '@admin-lib/adminAnimations'
import { CURRENT_USER } from '@admin-data/mockUsers'
import { ROLE_STYLES } from '@admin-lib/statusColors'
import { getInitials } from '@admin-lib/formatters'

// ─── Sidebar Context ─────────────────────────────────────────────────────────

interface SidebarContextValue {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  setMobileOpen: (v: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => {},
  setMobileOpen: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{
      collapsed,
      mobileOpen,
      toggleCollapsed: () => setCollapsed(c => !c),
      setMobileOpen,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  badge?: number
  exact?: boolean
}

interface NavGroup {
  heading: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'OPERATIONS',
    items: [
      { label: 'Dashboard',       to: '/admin',              icon: LayoutDashboard, exact: true },
      { label: 'Inquiries',       to: '/admin/inquiries',     icon: MessageSquare,   badge: 5 },
      { label: 'Customers',       to: '/admin/customers',     icon: Users },
      { label: 'Quotations',      to: '/admin/quotations',    icon: FileText },
      { label: 'Bookings',        to: '/admin/bookings',      icon: BookOpen },
    ],
  },
  {
    heading: 'CONTENT',
    items: [
      { label: 'Tour Packages',   to: '/admin/packages',      icon: Package },
      { label: 'Destinations',    to: '/admin/destinations',  icon: MapPin },
      { label: 'Tour Scheduling', to: '/admin/schedule',      icon: Calendar },
      { label: 'Itinerary',       to: '/admin/itinerary',     icon: Map },
    ],
  },
  {
    heading: 'INTELLIGENCE',
    items: [
      { label: 'Reports',         to: '/admin/reports',       icon: BarChart3 },
    ],
  },
  {
    heading: 'SYSTEM',
    items: [
      { label: 'Users',           to: '/admin/users',         icon: UserCog },
      { label: 'Audit Logs',      to: '/admin/audit-logs',    icon: Shield },
      { label: 'Notifications',   to: '/admin/notifications', icon: Bell, badge: 3 },
      { label: 'Settings',        to: '/admin/settings',      icon: Settings },
    ],
  },
]

// ─── Nav Item Component ────────────────────────────────────────────────────────

function SidebarNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const isActive = item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to)

  return (
    <NavLink
      to={item.to}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
        'text-sm font-medium',
        isActive
          ? 'bg-orange-50 text-brand-orange'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.label : undefined}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="active-nav"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-orange rounded-r-full"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.38 }}
        />
      )}

      {/* Icon */}
      <item.icon
        size={18}
        className={cn(
          'flex-shrink-0 transition-colors duration-200',
          isActive ? 'text-brand-orange' : 'text-gray-500 group-hover:text-gray-700'
        )}
      />

      {/* Label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            variants={sidebarLabel}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="flex-1 truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && !collapsed && (
        <AnimatePresence>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto min-w-[20px] h-5 px-1.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {item.badge}
          </motion.span>
        </AnimatePresence>
      )}

      {/* Collapsed badge dot */}
      {item.badge && collapsed && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
      )}

      {/* Tooltip on hover when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
          {item.label}
          {item.badge ? ` (${item.badge})` : ''}
        </div>
      )}
    </NavLink>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar()
  const user = CURRENT_USER
  const roleStyle = ROLE_STYLES[user.role]

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden lg:flex flex-col h-screen bg-white border-r border-gray-100 shadow-sidebar overflow-hidden flex-shrink-0 z-30"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 px-4 h-16 border-b border-gray-100 flex-shrink-0',
        collapsed && 'justify-center px-2'
      )}>
        <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center flex-shrink-0">
          <Plane size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              variants={sidebarLabel}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <span className="font-heading font-bold text-sm text-brand-black leading-tight block">
                A N D Travel
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide block">
                Management System
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-none">
        {NAV_GROUPS.map(group => (
          <div key={group.heading} className="mb-2">
            {/* Group Heading */}
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  variants={sidebarLabel}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="px-3 mb-1 text-[10px] font-semibold text-gray-400 tracking-widest uppercase"
                >
                  {group.heading}
                </motion.p>
              )}
            </AnimatePresence>
            {collapsed && <div className="my-1.5 mx-3 h-px bg-gray-100" />}

            {/* Items */}
            {group.items.map(item => (
              <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className={cn(
        'border-t border-gray-100 p-3 flex-shrink-0',
        collapsed ? 'flex justify-center' : ''
      )}>
        <div className={cn(
          'flex items-center gap-2.5 rounded-xl p-2 hover:bg-gray-50 transition-colors cursor-pointer',
          collapsed && 'justify-center'
        )}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-brand-orange/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
            </div>
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                variants={sidebarLabel}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <span className={cn(
                  'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold',
                  roleStyle.bg, roleStyle.text
                )}>
                  {roleStyle.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-brand-orange/40 transition-all text-gray-500 hover:text-brand-orange z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2.5} />
          : <ChevronLeft  size={12} strokeWidth={2.5} />
        }
      </button>
    </motion.aside>
  )
}

// ─── Mobile Sidebar ───────────────────────────────────────────────────────────

export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar()
  const user = CURRENT_USER
  const roleStyle = ROLE_STYLES[user.role]

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                  <Plane size={16} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-brand-black block">A N D Travel</span>
                  <span className="text-[10px] text-gray-400 font-medium">Management System</span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              {NAV_GROUPS.map(group => (
                <div key={group.heading} className="mb-2">
                  <p className="px-3 mb-1 text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                    {group.heading}
                  </p>
                  {group.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-orange-50 text-brand-orange'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="min-w-[20px] h-5 px-1.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            {/* User */}
            <div className="border-t border-gray-100 p-3">
              <div className="flex items-center gap-2.5 rounded-xl p-2">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-orange/20" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <span className={cn('inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold', roleStyle.bg, roleStyle.text)}>
                    {roleStyle.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
