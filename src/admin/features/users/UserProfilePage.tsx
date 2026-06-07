import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, Shield, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { MOCK_USERS } from '@admin-data/mockUsers'
import { ROLE_STYLES } from '@admin-lib/statusColors'
import { formatDate, formatRelative, getInitials } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

const ALL_PERMISSIONS = [
  { module: 'Inquiries',      keys: ['inquiries.read', 'inquiries.create', 'inquiries.update', 'inquiries.delete', 'inquiries.*'] },
  { module: 'Customers',      keys: ['customers.read', 'customers.create', 'customers.update', 'customers.*'] },
  { module: 'Quotations',     keys: ['quotations.read', 'quotations.create', 'quotations.update', 'quotations.*'] },
  { module: 'Bookings',       keys: ['bookings.read', 'bookings.create', 'bookings.update', 'bookings.*'] },
  { module: 'Schedule',       keys: ['schedule.read', 'schedule.create', 'schedule.update', 'schedule.*'] },
  { module: 'Itinerary',      keys: ['itinerary.read', 'itinerary.create', 'itinerary.update', 'itinerary.*'] },
  { module: 'Reports',        keys: ['reports.read', 'reports.*'] },
  { module: 'Users',          keys: ['users.read', 'users.create', 'users.update', 'users.*'] },
  { module: 'Audit Logs',     keys: ['audit.read'] },
  { module: 'Settings',       keys: ['settings.read', 'settings.update'] },
]

function hasPermission(permissions: string[], key: string): boolean {
  return permissions.includes('*') || permissions.includes(key) || permissions.some(p => {
    if (p.endsWith('.*')) {
      const module = p.replace('.*', '')
      return key.startsWith(module + '.')
    }
    return false
  })
}

export function UserProfilePage() {
  const { id } = useParams()
  const user = MOCK_USERS.find(u => u.id === id)

  if (!user) return (
    <div className="p-6">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-brand-orange hover:underline mb-4">
        <ArrowLeft size={14} /> Back to Users
      </Link>
      <p className="text-gray-500">User not found.</p>
    </div>
  )

  const style = ROLE_STYLES[user.role]

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-5xl space-y-6">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange">
        <ArrowLeft size={14} />
        Back to Team
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-2xl">
              {getInitials(user.name)}
            </div>
          )}
          <span className={cn(
            'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white',
            user.isActive ? 'bg-green-400' : 'bg-gray-300'
          )} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-heading text-2xl font-bold text-gray-900">{user.name}</h1>
            <span className={cn('px-3 py-1 text-xs font-bold rounded-full border capitalize', style.bg, style.text, style.border)}>
              {user.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">{user.department}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-gray-400" />
              {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-gray-400" />
                {user.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              Joined {formatDate(user.joinedAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300">
            Edit Profile
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-orange rounded-xl hover:bg-orange-600 shadow-orange">
            Save Changes
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Status',     value: user.isActive ? 'Active' : 'Inactive', positive: user.isActive },
          { label: 'Department', value: user.department },
          { label: 'Last Active', value: formatRelative(user.lastActiveAt) },
          { label: 'Permissions', value: `${user.permissions.length} granted` },
        ].map(stat => (
          <AdminCard key={stat.label}>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={cn('text-sm font-bold mt-0.5', 'positive' in stat && stat.positive ? 'text-green-600' : 'text-gray-900')}>
              {stat.value}
            </p>
          </AdminCard>
        ))}
      </div>

      {/* Permissions Matrix */}
      <AdminCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-base font-semibold text-gray-900">Permissions Matrix</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.permissions.includes('*') ? 'Full system access (super_admin)' : 'Module-level permission grants'}
            </p>
          </div>
          <Shield size={16} className="text-gray-300" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500">Module</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500">Read</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500">Create</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500">Update</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500">Delete</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500">Full</th>
              </tr>
            </thead>
            <motion.tbody variants={listStagger} initial="hidden" animate="visible">
              {ALL_PERMISSIONS.map(mod => {
                const checks = {
                  read:   hasPermission(user.permissions, `${mod.module.toLowerCase().replace(/ /g, '.')}.read`)   || hasPermission(user.permissions, `${mod.keys[0]}`),
                  create: hasPermission(user.permissions, `${mod.module.toLowerCase().replace(/ /g, '.')}.create`) || hasPermission(user.permissions, mod.keys[0].replace('.read', '.create')),
                  update: hasPermission(user.permissions, `${mod.module.toLowerCase().replace(/ /g, '.')}.update`) || hasPermission(user.permissions, mod.keys[0].replace('.read', '.update')),
                  delete: hasPermission(user.permissions, `${mod.module.toLowerCase().replace(/ /g, '.')}.delete`),
                  full:   hasPermission(user.permissions, mod.keys[mod.keys.length - 1]),
                }
                return (
                  <motion.tr key={mod.module} variants={listItem} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium text-gray-700">{mod.module}</td>
                    {(['read', 'create', 'update', 'delete', 'full'] as const).map(action => (
                      <td key={action} className="py-2.5 px-2 text-center">
                        {checks[action]
                          ? <CheckCircle2 size={14} className="text-green-500 mx-auto" />
                          : <XCircle size={14} className="text-gray-200 mx-auto" />
                        }
                      </td>
                    ))}
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </table>
        </div>
      </AdminCard>
    </motion.div>
  )
}
