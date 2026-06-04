import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote, Pause, Play } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader }   from '@ui/SectionHeader'
import { testimonialVariants, defaultViewport } from '@lib/animations'
import { useSlider }       from '@hooks/useSlider'
import { testimonials }    from '@data/testimonials'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  const { currentIndex, direction, paused, goNext, goPrev, goTo, setPaused } = useSlider(testimonials.length, 5000)
  const testimonial = testimonials[currentIndex]

  return (
    <AnimatedSection id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="What Clients Say"
          title="Trusted by Thousands of Travelers"
          subtitle="Real stories from real travelers who trusted A N D Travel and Tours with their journeys."
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Large quote icon */}
          <div className="absolute -top-4 -left-4 text-brand-orange/10 pointer-events-none" aria-hidden="true">
            <Quote size={80} />
          </div>

          {/* Testimonial Card */}
          <div
            className="bg-white rounded-3xl shadow-card-lg p-8 md:p-12 min-h-[280px] flex flex-col justify-between relative overflow-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6"
              >
                {/* Stars + Destination */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <StarRating rating={testimonial.rating} />
                  <span className="text-xs text-brand-orange font-semibold bg-orange-50 px-2.5 py-1 rounded-full">
                    {testimonial.destination}
                  </span>
                </div>

                {/* Quote Text */}
                <blockquote className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-orange/20"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.location}</p>
                  </div>
                  <div className="ml-auto text-4xl font-bold font-heading text-gray-100 select-none" aria-hidden="true">
                    "
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation + Pause ─────────────────────────────────────────────────
              FIX H-05: Pause button added for WCAG 2.2.2 (Pause, Stop, Hide).
          ──────────────────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-pressed={i === currentIndex}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 h-2 bg-brand-orange'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Pause / Play */}
            <button
              onClick={() => setPaused(p => !p)}
              aria-label={paused ? 'Resume testimonials' : 'Pause testimonials'}
              aria-pressed={paused}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all duration-200"
            >
              {paused
                ? <Play  size={16} aria-hidden="true" />
                : <Pause size={16} aria-hidden="true" />}
            </button>

            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile grid of all testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={defaultViewport}
          transition={{ delay: 0.3 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:hidden"
        >
          {testimonials.slice(0, 3).map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
              <StarRating rating={t.rating} />
              <p className="text-gray-600 text-sm italic mt-3 mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  className="w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="text-xs font-semibold text-brand-black">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
