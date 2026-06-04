import { motion } from 'framer-motion'
import { Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, staggerContainer, defaultViewport } from '@lib/animations'
import { packages } from '@data/packages'

function formatPrice(n: number) {
  return `₱${n.toLocaleString()}`
}

const badgeColors: Record<string, string> = {
  'Best Value':    'bg-green-500',
  'Most Popular':  'bg-brand-orange',
  'Premium':       'bg-brand-gold',
  'New':           'bg-blue-500',
}

export function Packages() {
  return (
    <AnimatedSection id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Tour Packages"
          title="Handpicked Travel Packages"
          subtitle="Carefully crafted packages for every type of traveler — budget, mid-range, and premium."
        />

        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-dark opacity-50" />

                {/* Badge */}
                {pkg.badge && (
                  <div className={`absolute top-3 right-3 px-2.5 py-1 ${badgeColors[pkg.badge] ?? 'bg-brand-orange'} text-white text-[10px] font-bold rounded-full`}>
                    {pkg.badge}
                  </div>
                )}

                {/* Duration overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Clock size={11} />
                  {pkg.nights}N / {pkg.days}D
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-brand-orange tracking-widest uppercase">{pkg.destination}</span>
                </div>
                <h3 className="font-bold text-brand-black text-base font-heading leading-snug mb-3">{pkg.title}</h3>

                {/* Includes */}
                <ul className="space-y-1.5 mb-4 flex-1">
                  {pkg.includes.slice(0, 4).map(inc => (
                    <li key={inc} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle size={12} className="text-brand-orange shrink-0" />
                      {inc}
                    </li>
                  ))}
                  {pkg.includes.length > 4 && (
                    <li className="text-xs text-brand-orange font-medium ml-5">
                      +{pkg.includes.length - 4} more inclusions
                    </li>
                  )}
                </ul>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    {pkg.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(pkg.originalPrice)}</div>
                    )}
                    <div className="text-xl font-bold text-brand-orange font-heading">{formatPrice(pkg.price)}</div>
                    <div className="text-[10px] text-gray-400">per person</div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-orange text-white text-xs font-semibold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Book Now <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm mb-4">All packages are customizable. Let us build your perfect trip.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-orange text-brand-orange font-semibold rounded-full hover:bg-brand-orange hover:text-white transition-all duration-300 text-sm"
          >
            Request Custom Package <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
