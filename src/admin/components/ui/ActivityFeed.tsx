import { motion } from 'framer-motion'
import {
  MessageSquare, CheckCircle, CreditCard, FileText, AlertCircle,
  UserCheck, ArrowRightLeft,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { listStagger, listItem } from '@admin-lib/adminAnimations'
import type { InquiryActivity } from '@admin-types/index'
import { formatRelative } from '@admin-lib/formatters'

// ─── Activity Icon ────────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  system:       { icon: AlertCircle,    bg: 'bg-gray-100',     color: 'text-gray-500' },
  status_change:{ icon: ArrowRightLeft, bg: 'bg-blue-50',      color: 'text-blue-600' },
  assignment:   { icon: UserCheck,      bg: 'bg-violet-50',    color: 'text-violet-600' },
  quotation:    { icon: FileText,       bg: 'bg-amber-50',     color: 'text-amber-600' },
  note:         { icon: MessageSquare,  bg: 'bg-orange-50',    color: 'text-brand-orange' },
  booking:      { icon: CheckCircle,    bg: 'bg-green-50',     color: 'text-green-600' },
  payment:      { icon: CreditCard,     bg: 'bg-emerald-50',   color: 'text-emerald-600' },
}

// ─── Inquiry Activity Feed ────────────────────────────────────────────────

interface ActivityFeedProps {
  activities: InquiryActivity[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <motion.div
      variants={listStagger}
      initial="hidden"
      animate="visible"
      className={cn('space-y-0', className)}
    >
      {activities.map((activity, idx) => {
        const iconConfig = ACTIVITY_ICONS[activity.type] ?? ACTIVITY_ICONS.system
        const Icon = iconConfig.icon
        const isLast = idx === activities.length - 1

        return (
          <motion.div key={activity.id} variants={listItem} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10', iconConfig.bg)}>
                <Icon size={13} className={iconConfig.color} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <p className="text-sm text-gray-700">{activity.description}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 font-medium">{activity.actorName}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{formatRelative(activity.createdAt)}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Dashboard Activity Feed (simpler version) ────────────────────────────

interface DashboardFeedItem {
  id: string
  type: string
  message: string
  time: string
  icon: string
}

const DASHBOARD_ICON_MAP: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  MessageSquare: { icon: MessageSquare, bg: 'bg-blue-50',   color: 'text-blue-600' },
  CheckCircle:   { icon: CheckCircle,   bg: 'bg-green-50',  color: 'text-green-600' },
  CreditCard:    { icon: CreditCard,    bg: 'bg-emerald-50',color: 'text-emerald-600' },
  FileText:      { icon: FileText,      bg: 'bg-amber-50',  color: 'text-amber-600' },
}

interface DashboardActivityFeedProps {
  items: DashboardFeedItem[]
  className?: string
}

export function DashboardActivityFeed({ items, className }: DashboardActivityFeedProps) {
  return (
    <motion.div
      variants={listStagger}
      initial="hidden"
      animate="visible"
      className={cn('space-y-1', className)}
    >
      {items.map(item => {
        const iconConfig = DASHBOARD_ICON_MAP[item.icon] ?? DASHBOARD_ICON_MAP.MessageSquare
        const Icon = iconConfig.icon

        return (
          <motion.div
            key={item.id}
            variants={listItem}
            className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', iconConfig.bg)}>
              <Icon size={13} className={iconConfig.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 leading-snug">{item.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
