import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import {
  cardVariants,
  destinationImageVariants,
  destinationOverlayVariants,
  staggerContainer,
  defaultViewport,
} from '@lib/animations'
import { destinations } from '@data/destinations'

export function Destinations() {
  return (
    <AnimatedSection id="destinations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Featured Destinations"
          title="Where Will You Go Next?"
          subtitle="Handpicked destinations across Asia, Europe and the Middle East — each one promising unforgettable memories."
        />

        <motion.div
          variants={staggerContainer(0.07, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.id}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4]"
            >
              {/* Image */}
              <motion.img
                variants={destinationImageVariants}
                src={dest.imageUrl}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Always-on gradient */}
              <div className="absolute inset-0 overlay-dark opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Badge */}
              {dest.badge && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand-orange rounded-full text-white text-[10px] font-semibold z-10">
                  {dest.badge}
                </div>
              )}

              {/* Always visible name */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-white font-bold text-lg font-heading leading-tight">{dest.name}</h3>

                {/* Hover reveal content */}
                <motion.div variants={destinationOverlayVariants} className="mt-2">
                  <p className="text-white/80 text-xs leading-relaxed mb-3">{dest.shortDesc}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-gold transition-colors"
                  >
                    Explore <ArrowRight size={12} />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Many more note — no CTA button */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={defaultViewport}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-400 text-sm mt-10 italic"
        >
          And many more destinations available — ask us!
        </motion.p>
      </div>
    </AnimatedSection>
  )
}
