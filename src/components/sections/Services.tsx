import { motion } from 'framer-motion'
import { MapPin, Globe, Plane, Hotel, FileCheck, Users } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, iconFloatVariants, staggerContainer, defaultViewport } from '@lib/animations'
import { services } from '@data/services'

const iconMap: Record<string, React.ElementType> = {
  MapPin, Globe, Plane, Hotel, FileCheck, Users,
}

export function Services() {
  return (
    <AnimatedSection id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="What We Offer"
          title="Complete Travel Solutions"
          subtitle="From planning your itinerary to boarding your flight — we handle every detail of your journey."
        />

        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName] ?? Globe
            const isHighlighted = index < 2

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                className={`group rounded-2xl p-7 transition-all duration-300 cursor-default border ${
                  isHighlighted
                    ? 'bg-brand-black text-white border-brand-black hover:bg-neutral-900'
                    : 'bg-white text-brand-black border-gray-100 hover:border-brand-orange/30 shadow-card hover:shadow-card-lg'
                }`}
              >
                {/* Icon */}
                <motion.div
                  variants={iconFloatVariants}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    isHighlighted ? 'bg-brand-orange' : 'bg-brand-orange/10'
                  }`}
                >
                  <Icon size={22} className={isHighlighted ? 'text-white' : 'text-brand-orange'} />
                </motion.div>

                <h3 className={`font-bold text-base font-heading mb-2 ${isHighlighted ? 'text-white' : 'text-brand-black'}`}>
                  {service.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-5 ${isHighlighted ? 'text-white/65' : 'text-gray-500'}`}>
                  {service.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-2">
                  {service.features.map(f => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-xs ${isHighlighted ? 'text-white/70' : 'text-gray-600'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isHighlighted ? 'bg-brand-orange' : 'bg-brand-orange'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Bottom line */}
                <div className={`mt-6 pt-5 border-t ${isHighlighted ? 'border-white/10' : 'border-gray-100'}`}>
                  <a
                    href="#contact"
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isHighlighted ? 'text-brand-orange hover:text-brand-gold' : 'text-brand-orange hover:text-orange-600'
                    }`}
                  >
                    Inquire Now →
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
