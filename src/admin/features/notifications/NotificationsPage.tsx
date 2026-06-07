import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, MessageSquare, CheckCircle, FileText, CreditCard, Check } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { AdminCard } from '@admin-ui/AdminCard'
import { cn } from '@lib/utils'

const NOTIFICATIONS = [
  { id: 'n1', group: 'Today', type: 'inquiry', icon: 'MessageSquare', title: 'New inquiry received', msg: 'Rodrigo Macaraeg — South Korea (4 adults, 2 kids)', time: '2 hours ago', unread: true },
  { id: 'n2', group: 'Today', type: 'booking', icon: 'CheckCircle', title: 'Booking BK-0089 confirmed', msg: 'Carla Mendoza — Dubai, December 22–28, 2026', time: '3 hours ago', unread: true },
  { id: 'n3', group: 'Today', type: 'payment', icon: 'CreditCard', title: 'Payment received', msg: '₱58,000 downpayment for BK-0089 via GCash', time: '3 hours ago', unread: true },
  { id: 'n4', group: 'Today', type: 'inquiry', icon: 'MessageSquare', title: 'New inquiry received', msg: 'Paolo Navarro — Vietnam (group of 6)', time: '4 hours ago', unread: true },
  { id: 'n5', group: 'Yesterday', type: 'quotation', icon: 'FileText', title: 'Quotation QT-0089 sent', msg: 'Marco Dela Cruz sent quote to Carla Mendoza', time: 'Yesterday 3:00 PM', unread: false },
  { id: 'n6', group: 'Yesterday', type: 'inquiry', icon: 'MessageSquare', title: 'New inquiry received', msg: 'Lourdes Bautista — South Korea (fall foliage tour)', time: 'Yesterday 11:00 AM', unread: false },
  { id: 'n7', group: 'Older', type: 'booking', icon: 'CheckCircle', title: 'BK-0085 fully paid', msg: 'Lourdes Bautista — South Korea, full payment received', time: '2 days ago', unread: false },
]

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquare, CheckCircle, FileText, CreditCard,
}

const TYPE_COLORS: Record<string, string> = {
  inquiry:   'bg-blue-50 text-blue-600',
  booking:   'bg-green-50 text-green-600',
  payment:   'bg-emerald-50 text-emerald-600',
  quotation: 'bg-amber-50 text-amber-600',
}

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const markAllRead = () => setNotifs(n => n.map(item => ({ ...item, unread: false })))
  const groups = Array.from(new Set(notifs.map(n => n.group)))

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={`${notifs.filter(n => n.unread).length} unread notifications`}
        icon={<Bell size={18} />}
        actions={
          <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300">
            <Check size={14} />
            Mark all read
          </button>
        }
      />

      {groups.map(group => (
        <div key={group}>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group}</h3>
          <AdminCard padding="none">
            <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
              {notifs.filter(n => n.group === group).map(notif => {
                const Icon = ICON_MAP[notif.icon] ?? Bell
                const colorClass = TYPE_COLORS[notif.type] ?? 'bg-gray-100 text-gray-600'
                return (
                  <motion.div
                    key={notif.id}
                    variants={listItem}
                    className={cn('flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer', notif.unread && 'bg-orange-50/30')}
                  >
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', colorClass)}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-sm font-semibold', notif.unread ? 'text-gray-900' : 'text-gray-700')}>{notif.title}</p>
                        {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{notif.msg}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AdminCard>
        </div>
      ))}
    </motion.div>
  )
}
