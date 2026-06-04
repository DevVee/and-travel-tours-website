import { motion } from 'framer-motion'
import { fadeUpVariants, lineVariants, defaultViewport } from '@lib/animations'
import { cn } from '@lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn('mb-12', centered && 'text-center', className)}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {eyebrow && (
        <motion.p
          variants={fadeUpVariants}
          className={cn(
            'text-xs font-semibold tracking-[0.2em] uppercase mb-3',
            light ? 'text-brand-gold' : 'text-brand-orange'
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUpVariants}
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
          light ? 'text-white' : 'text-brand-black'
        )}
      >
        {title}
      </motion.h2>
      {/* Animated underline */}
      <div className={cn('flex mt-4', centered ? 'justify-center' : 'justify-start')}>
        <div className="relative h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            variants={lineVariants}
            className="absolute inset-0 bg-gradient-orange rounded-full"
          />
        </div>
      </div>
      {subtitle && (
        <motion.p
          variants={fadeUpVariants}
          className={cn(
            'mt-5 text-base md:text-lg max-w-2xl leading-relaxed',
            centered && 'mx-auto',
            light ? 'text-white/75' : 'text-gray-500'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
