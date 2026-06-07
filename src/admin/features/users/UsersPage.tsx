import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Mail, Phone, Shield } from 'lucide-react'
import { pageVariants, gridStagger, gridCard } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { MOCK_USERS } from '@admin-data/mockUsers'
import { ROLE_STYLES } from '@admin-lib/statusColors'
import { formatRelative, getInitials } from '@admin-lib/formatters'
import type { UserRole } from '@admin-types/index'
import { cn } from '@lib/utils'

const ROLES: (UserRole | 'all')[] = ['all', 'super_admin', 'administrator', 'consultant', 'staff']

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole]     = useState<UserRole | 'all'>('all')

  const filtered = MOCK_USERS.filter(u => {
    if (role !== 'all' && u.role !== role) return false
    if (search) {
      const q = search.toLowerCase()
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <PageHeader
        title="Team Members"
        subtitle={`${MOCK_USERS.length} staff members`}
        icon={<Users size={18} />}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
            <Plus size={15} />
            Invite User
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl flex-1 max-w-xs">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team members…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(r => {
            const style = r !== 'all' ? ROLE_STYLES[r] : null
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full border transition-all capitalize',
                  role === r
                    ? r === 'all'
                      ? 'bg-brand-black text-white border-brand-black'
                      : `${style?.bg} ${style?.text} ${style?.border}`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* User Grid */}
      <motion.div
        variants={gridStagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map(user => {
          const style = ROLE_STYLES[user.role]
          return (
            <motion.div key={user.id} variants={gridCard}>
              <Link to={`/admin/users/${user.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-card-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  {/* Avatar + status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-lg">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <span className={cn('absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white', user.isActive ? 'bg-green-400' : 'bg-gray-300')} />
                    </div>
                    <span className={cn('px-2.5 py-1 text-[10px] font-bold rounded-full border capitalize', style.bg, style.text, style.border)}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className="font-heading text-sm font-bold text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{user.department}</p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={11} className="text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={11} className="text-gray-400" />
                        {user.phone}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Active {formatRelative(user.lastActiveAt)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Shield size={10} />
                      {user.permissions.length} perms
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
