import { motion } from 'framer-motion'
import { cn } from '@lib/utils'
import { fadeVariants } from '@admin-lib/adminAnimations'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 text-brand-orange">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
