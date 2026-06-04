import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { staggerContainer, defaultViewport } from '@lib/animations'
import { cn } from '@lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  variants?: Variants
  id?: string
  as?: 'section' | 'div'
}

export function AnimatedSection({
  children,
  className,
  variants,
  id,
  as = 'section',
}: AnimatedSectionProps) {
  const Component = motion[as]

  return (
    <Component
      id={id}
      className={cn(className)}
      variants={variants ?? staggerContainer(0.12, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {children}
    </Component>
  )
}
