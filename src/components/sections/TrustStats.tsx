import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, CheckCircle } from 'lucide-react'
import { useCounter } from '@hooks/useCounter'
import { statVariants, staggerContainer, defaultViewport } from '@lib/animations'

interface StatItemProps {
  value: number
  suffix: string
  label: string
  icon: React.ReactNode
}

function StatItem({ value, suffix, label, icon }: StatItemProps) {
  const [active, setActive] = useState(false)
  const count = useCounter(value, 1800, active)

  return (
    <motion.div
      variants={statVariants}
      onViewportEnter={() => setActive(true)}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center group"
    >
      <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="text-3xl sm:text-4xl font-bold font-heading text-brand-black mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </motion.div>
  )
}

// Exact numbers from company reference — no made-up data
const stats = [
  { value: 5000, suffix: '+', label: 'Happy Travelers', icon: <Users size={24} /> },
  { value: 50,   suffix: '+', label: 'Destinations',    icon: <Globe size={24} /> },
  { value: 1000, suffix: '+', label: 'Tours Completed', icon: <CheckCircle size={24} /> },
]

export function TrustStats() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-3 gap-8 lg:gap-16 max-w-3xl mx-auto"
        >
          {stats.map(stat => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
