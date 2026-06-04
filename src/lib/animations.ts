import type { Variants, Transition } from 'framer-motion'

// ─── Viewport Default ───────────────────────────────────────────────────────
// margin: '-80px' means animation starts 80px before element enters view = feels natural
export const defaultViewport = { once: true, margin: '-80px' }

// ─── Base Transitions ────────────────────────────────────────────────────────
// Slightly slower ease = more premium feel, not snappy
const ease: Transition = { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }

// ─── All scroll-reveal variants use pure opacity fade ────────────────────────
export const fadeUpVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

export const fadeDownVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

export const fadeLeftVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

export const fadeRightVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
  exit:    { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
}

// ─── Stagger Containers ──────────────────────────────────────────────────────
export function staggerContainer(staggerDelay = 0.1, initialDelay = 0.05): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }
}

export const gridStagger: Variants = staggerContainer(0.08, 0.04)
export const wordStagger: Variants = staggerContainer(0.05, 0)

// ─── Hero Slide crossfade — smooth, premium feel ────────────────────────────
export const heroSlideVariants: Variants = {
  enter:  { opacity: 0 },
  center: { opacity: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
  exit:   { opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } },
}

// Hero text — simple fade (no blur / rotateX)
export const heroWordVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const heroSupportVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 } },
}

// ─── Card scroll-reveal ──────────────────────────────────────────────────────
export const cardVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

// ─── Destination card hover (image zoom + overlay reveal) ────────────────────
export const destinationImageVariants: Variants = {
  rest:  { scale: 1,    transition: { duration: 0.45, ease: 'easeOut' } },
  hover: { scale: 1.07, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const destinationOverlayVariants: Variants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}

// ─── Service card icon float ─────────────────────────────────────────────────
export const iconFloatVariants: Variants = {
  rest:  { y: 0,  scale: 1    },
  hover: { y: -5, scale: 1.12, transition: { type: 'spring', stiffness: 200, damping: 18 } },
}

export const glowVariants: Variants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
}

// ─── Section header underline ────────────────────────────────────────────────
export const lineVariants: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.25 } },
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const statVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
}

// ─── Testimonial carousel (fade only — no x slide) ───────────────────────────
export const testimonialVariants: Variants = {
  enter:  { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:   { opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } },
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────
export const mobileMenuVariants: Variants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, height: 0,    transition: { duration: 0.2, ease: 'easeIn' } },
}

// ─── Kept for compatibility ───────────────────────────────────────────────────
export const premiumEase: Transition = { duration: 0.55, ease: 'easeOut' }
export const springBounce: Transition = { type: 'spring', stiffness: 80, damping: 18, mass: 1 }
