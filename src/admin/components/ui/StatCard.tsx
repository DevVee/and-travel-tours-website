import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@lib/utils'
import { statCard } from '@admin-lib/adminAnimations'
import { formatGrowth } from '@admin-lib/formatters'

interface StatCardProps {
  title: string
  value: string | number
  delta?: number          // percentage change vs previous period
  icon: React.ReactNode
  iconBg?: string
  subtitle?: string
  index?: number
  onClick?: () => void
}

export function StatCard({ title, value, delta, icon, iconBg = 'bg-orange-50', subtitle, index = 0, onClick }: StatCardProps) {
  const isPositive = delta !== undefined && delta > 0
  const isNegative = delta !== undefined && delta < 0
  const isNeutral  = delta !== undefined && delta === 0

  return (
    <motion.div
      variants={statCard}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-admin-card p-5',
        onClick && 'cursor-pointer hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200'
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          {icon}
        </div>

        {/* Delta */}
        {delta !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            isPositive && 'bg-green-50 text-green-700',
            isNegative && 'bg-red-50 text-red-600',
            isNeutral  && 'bg-gray-100 text-gray-500',
          )}>
            {isPositive && <TrendingUp size={11} />}
            {isNegative && <TrendingDown size={11} />}
            {isNeutral  && <Minus size={11} />}
            {formatGrowth(delta)}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 font-heading">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
