import { motion } from 'framer-motion'
import { Shield, Search, Filter, Download } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { AdminCard } from '@admin-ui/AdminCard'
import { formatRelative } from '@admin-lib/formatters'
import { ROLE_STYLES } from '@admin-lib/statusColors'
import type { AuditLog } from '@admin-types/index'

const MOCK_LOGS: AuditLog[] = [
  { id: 'log001', actorId: 'u003', actorName: 'Ana Reyes', actorRole: 'consultant', action: 'CREATE', resourceType: 'Quotation', resourceId: 'QT-0090', resourceLabel: 'QT-0090 — Lourdes Bautista (South Korea)', createdAt: '2026-06-07T09:00:00Z' },
  { id: 'log002', actorId: 'u004', actorName: 'Marco Dela Cruz', actorRole: 'consultant', action: 'UPDATE', resourceType: 'Booking', resourceId: 'BK-0089', resourceLabel: 'BK-0089 — Carla Mendoza', changes: { status: { from: 'inquiry', to: 'confirmed' } }, createdAt: '2026-06-07T10:30:00Z' },
  { id: 'log003', actorId: 'u002', actorName: 'Darius Reyes', actorRole: 'administrator', action: 'ASSIGN', resourceType: 'Inquiry', resourceId: 'INQ-0043', resourceLabel: 'INQ-0043 — Rodrigo Macaraeg', createdAt: '2026-06-07T07:00:00Z' },
  { id: 'log004', actorId: 'u003', actorName: 'Ana Reyes', actorRole: 'consultant', action: 'UPDATE', resourceType: 'Inquiry', resourceId: 'INQ-0042', resourceLabel: 'INQ-0042 — Maria Dela Cruz', changes: { status: { from: 'new', to: 'discussion' } }, createdAt: '2026-06-06T09:15:00Z' },
  { id: 'log005', actorId: 'u004', actorName: 'Marco Dela Cruz', actorRole: 'consultant', action: 'CREATE', resourceType: 'Quotation', resourceId: 'QT-0089', resourceLabel: 'QT-0089 — Carla Mendoza (Dubai)', createdAt: '2026-06-06T14:00:00Z' },
  { id: 'log006', actorId: 'u001', actorName: 'Andrea Santos', actorRole: 'super_admin', action: 'CREATE', resourceType: 'User', resourceId: 'u005', resourceLabel: 'Lia Gomez — Staff', createdAt: '2026-05-15T10:00:00Z' },
]

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-50 text-green-700',
  UPDATE: 'bg-blue-50 text-blue-700',
  DELETE: 'bg-red-50 text-red-700',
  ASSIGN: 'bg-violet-50 text-violet-700',
  LOGIN:  'bg-gray-100 text-gray-600',
}

export function AuditLogsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-5xl"
    >
      <PageHeader
        title="Audit Logs"
        subtitle="Complete history of all system actions and changes"
        icon={<Shield size={18} />}
        actions={
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
            <Download size={14} />
            Export
          </button>
        }
      />

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search logs…" className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Log List */}
      <AdminCard padding="none">
        <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
          {MOCK_LOGS.map(log => {
            const roleStyle = ROLE_STYLES[log.actorRole]
            const actionStyle = ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-600'
            return (
              <motion.div key={log.id} variants={listItem} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* Action badge */}
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 mt-0.5 ${actionStyle}`}>
                  {log.action}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{log.resourceLabel}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{log.resourceType} · ID: {log.resourceId}</p>
                  {log.changes && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <span key={field} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {field}: <span className="text-red-500">{change.from}</span> → <span className="text-green-600">{change.to}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actor */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-700">{log.actorName}</p>
                  <span className={`text-[10px] font-medium ${roleStyle.text}`}>{roleStyle.label}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatRelative(log.createdAt)}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AdminCard>
    </motion.div>
  )
}
