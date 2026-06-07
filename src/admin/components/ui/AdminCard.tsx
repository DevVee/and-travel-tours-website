import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

interface AdminCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function AdminCard({ children, className, hover = false, padding = 'md', onClick }: AdminCardProps) {
  const paddingClass = {
    none: '',
    sm:   'p-4',
    md:   'p-5',
    lg:   'p-6',
  }[padding]

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-admin-card',
        hover && 'hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  )
}

// Animated version for list/grid reveals
export function AnimatedCard({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
  index = 0,
}: AdminCardProps & { index?: number }) {
  const paddingClass = {
    none: '',
    sm:   'p-4',
    md:   'p-5',
    lg:   'p-6',
  }[padding]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-admin-card',
        hover && 'hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        paddingClass,
        className
      )}
    >
      {children}
    </motion.div>
  )
}
