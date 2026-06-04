import { useState }    from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Globe2 } from 'lucide-react'
import { AnimatedSection }  from '@ui/AnimatedSection'
import { SectionHeader }    from '@ui/SectionHeader'
import {
  staggerContainer, defaultViewport,
  cardVariants, destinationImageVariants,
  destinationOverlayVariants, fadeUpVariants,
} from '@lib/animations'
import { destinations } from '@data/destinations'
import type { Destination } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────
function flagUrl(code: string, size: 160 | 320 = 320) {
  return `https://flagcdn.com/w${size}/${code}.png`
}

// ── Destination Modal ─────────────────────────────────────────────────────────
function DestinationModal({
  dest,
  onClose,
}: {
  dest: Destination
  onClose: () => void
}) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.92, opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-card-lg max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Photo header ────────────────── */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={dest.imageUrl}
            alt={dest.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/65" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* ── Body — flag overlaps the photo header ── */}
        <div className="flex flex-col items-center px-6 pb-7 -mt-11 relative z-10">

          {/* Round flag — sits half on photo, half on white */}
          <div className="w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <img
              src={flagUrl(dest.flagCode, 160)}
              alt={`${dest.name} flag`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + badge */}
          <h3 className="font-heading font-bold text-2xl text-brand-black text-center leading-tight mb-1">
            {dest.name}
          </h3>
          {dest.badge && (
            <span className="inline-block px-3 py-1 bg-brand-orange text-white text-[10px] font-semibold rounded-full mb-3">
              {dest.badge}
            </span>
          )}

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed text-center mb-4">
            {dest.shortDesc}
          </p>

          {/* Visa note */}
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-brand-orange/15 mb-5 w-full justify-center">
            <Globe2 size={14} className="text-brand-orange shrink-0" aria-hidden="true" />
            <p className="text-brand-orange text-xs font-semibold">Visa assistance available</p>
          </div>

          {/* CTA — scrolls to contact and closes modal */}
          <a
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-brand-orange text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange text-sm"
          >
            Book This Trip <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Section ──────────────────────────────────────────────────────────────
export function Destinations() {
  const [selected, setSelected] = useState<Destination | null>(null)

  return (
    <AnimatedSection id="destinations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <SectionHeader
          eyebrow="Visa Destinations"
          title="Where Will You Go Next?"
          subtitle="We provide full visa assistance for all destinations below — click any country to learn more."
        />

        {/* ── Destination cards grid ────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.07, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {destinations.map(dest => (
            <motion.div
              key={dest.id}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              onClick={() => setSelected(dest)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4] shadow-card hover:shadow-card-lg transition-shadow duration-300"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${dest.name}`}
              onKeyDown={e => e.key === 'Enter' && setSelected(dest)}
            >
              {/* ── Destination photo ── */}
              <motion.img
                variants={destinationImageVariants}
                src={dest.imageUrl}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* ── Gradient overlay — deepens on hover ── */}
              <div className="absolute inset-0 overlay-dark opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* ── Badge ── */}
              {dest.badge && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand-orange rounded-full text-white text-[10px] font-semibold z-10">
                  {dest.badge}
                </div>
              )}

              {/* ── Flag circle — top-right corner ── */}
              <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={flagUrl(dest.flagCode, 160)}
                  alt={`${dest.name} flag`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* ── Bottom info ── */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-white font-bold text-lg font-heading leading-tight">
                  {dest.name}
                </h3>

                {/* Hover-reveal description + arrow */}
                <motion.div variants={destinationOverlayVariants} className="mt-2">
                  <p className="text-white/80 text-xs leading-relaxed mb-3">
                    {dest.shortDesc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange">
                    View Details <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center text-gray-400 text-sm mt-10 italic"
        >
          And many more destinations available — ask us!
        </motion.p>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DestinationModal dest={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </AnimatedSection>
  )
}
