import { motion } from 'framer-motion'
import { fadeVariants } from '@admin-lib/adminAnimations'
import { cn } from '@lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, icon, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex items-start justify-between gap-4 mb-6', className)}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-brand-orange mt-0.5">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
