import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, ScanLine, MessageCircle, Pause, Play } from 'lucide-react'
import { useSlider } from '@hooks/useSlider'
import { heroSlideVariants, heroSupportVariants, staggerContainer } from '@lib/animations'
import { LocalQRCode } from '@ui/LocalQRCode'
import { CONTACT }    from '@data/contact'
import type { HeroSlide } from '@/types'

// Facebook "f" icon
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const slides: HeroSlide[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=90&auto=format&fit=crop',
    location: 'Mt. Fuji, Japan',
    headline: 'Discover the Magic',
    headline2: 'of Japan',
    subCopy: 'Mt. Fuji, cherry blossoms, ancient temples and futuristic cities await you.',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=90&auto=format&fit=crop',
    location: 'Paris, Europe',
    headline: 'Explore Timeless',
    headline2: 'Europe',
    subCopy: 'From the Eiffel Tower to the Colosseum — Europe never disappoints.',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=90&auto=format&fit=crop',
    location: 'Dubai, UAE',
    headline: 'Experience Luxury',
    headline2: 'in Dubai',
    subCopy: 'Towering skyscrapers, desert safaris & world-class hospitality.',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1576647025587-2b77cd953cba?w=1600&q=90&auto=format&fit=crop',
    location: 'Oslob, Cebu',
    headline: 'Swim with',
    headline2: 'Whale Sharks',
    subCopy: 'One of the world\'s most breathtaking marine experiences, right here in the Philippines.',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=90&auto=format&fit=crop',
    location: 'Bangkok, Thailand',
    headline: 'Escape to Paradise',
    headline2: 'Thailand',
    subCopy: 'Golden temples, tropical beaches, and vibrant street markets.',
  },
]

export function Hero() {
  const { currentIndex, direction, paused, goNext, goPrev, goTo, setPaused } = useSlider(slides.length, 6000)
  const slide = slides[currentIndex]

  return (
    <section id="home" className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden">

      {/* ── Background — pure crossfade, NO movement ─── */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={heroSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/*
            fetchPriority="high" → tells browser to fetch this before lower-priority
            resources, improving Largest Contentful Paint (LCP).
            The first slide uses loading="eager" since it IS the LCP element.
          */}
          <img
            src={slide.imageUrl}
            alt={slide.location}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />

      {/* ── Hero Content ─────────────────────────────── */}
      <div className="relative h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={staggerContainer(0.1, 0.1)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="max-w-xl"
            >
              {/* Location badge */}
              <motion.div
                variants={heroSupportVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-5 border border-white/20"
              >
                <MapPin size={12} className="text-brand-orange" aria-hidden="true" />
                {slide.location}
              </motion.div>

              {/*
                FIX M-02: Single <h1> with an inline <span> for the coloured second line.
                Previously two separate <h1> elements — only one <h1> per page (SEO + a11y).
              */}
              <motion.h1
                variants={heroSupportVariants}
                className="font-heading font-bold text-white leading-tight mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
              >
                {slide.headline}{' '}
                <span className="text-brand-orange">{slide.headline2}</span>
              </motion.h1>

              {/* Sub copy */}
              <motion.p variants={heroSupportVariants} className="text-white/80 text-base sm:text-lg mb-2 max-w-md leading-relaxed">
                {slide.subCopy}
              </motion.p>
              <motion.p variants={heroSupportVariants} className="text-brand-gold font-medium italic text-sm sm:text-base mb-8">
                Your Journey, Our Priority
              </motion.p>

              {/* CTAs */}
              <motion.div variants={heroSupportVariants} className="flex flex-wrap gap-3">
                {/* Facebook — brand orange */}
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-orange text-sm"
                >
                  <FbIcon /> Facebook
                </a>
                {/* Messenger — desktop only */}
                <a
                  href={CONTACT.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 text-white font-semibold rounded-full hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/25 text-sm"
                >
                  <MessageCircle size={17} aria-hidden="true" /> Messenger
                </a>
                {/* Contact Us — mobile only */}
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="lg:hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 text-white font-semibold rounded-full hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/25 text-sm"
                >
                  Contact Us
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── QR — desktop: 30% from right, center-right ─
          FIX M-04: Replaced api.qrserver.com third-party fetch with LocalQRCode
          (client-side rendering, no external API call, no IP leakage)
      ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute top-1/2 -translate-y-1/2 right-[10%] z-10 hidden lg:flex"
      >
        <div className="bg-brand-black/80 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 w-full justify-center bg-brand-orange rounded-lg px-4 py-1.5">
            <ScanLine size={12} className="text-white" aria-hidden="true" />
            <span className="text-white text-[10px] font-black tracking-[0.22em] uppercase">Scan Me</span>
          </div>
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <LocalQRCode size={200} />
          </div>
          <p className="text-white/75 text-[10px] text-center leading-snug">
            Scan to connect with us<br/>on Facebook!
          </p>
        </div>
      </motion.div>

      {/* ── Nav Arrows ───────────────────────────────── */}
      <button onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-orange transition-all duration-300 border border-white/20 z-10"
        aria-label="Previous slide">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-orange transition-all duration-300 border border-white/20 z-10"
        aria-label="Next slide">
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      {/* ── Dot Indicators + Pause button ────────────────────────────────────
          FIX H-05: Pause button added for WCAG 2.2.2 (Pause, Stop, Hide).
          Auto-playing content must be pausable by the user.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-7 h-2 bg-brand-orange' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
        <button
          onClick={() => setPaused(p => !p)}
          aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
          aria-pressed={paused}
          className="ml-1 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-orange transition-colors"
        >
          {paused
            ? <Play  size={12} aria-hidden="true" />
            : <Pause size={12} aria-hidden="true" />}
        </button>
      </div>

      {/* ── Slide counter ────────────────────────────── */}
      <div className="absolute bottom-8 left-4 text-white/50 text-xs font-medium z-10 hidden sm:block" aria-hidden="true">
        <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
