import type { Variants, Transition } from 'framer-motion'

// ─── Viewport Default ────────────────────────────────────────────────────────
// margin: '-80px' triggers the animation 80 px before the element enters view
export const defaultViewport = { once: true, margin: '-80px' }

// ─── Base Easings ────────────────────────────────────────────────────────────
// Primary: smooth deceleration — elements settle like they have a tiny bit of weight
const ease: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1], // expo-out — fast start, silky landing
}

// Gentle: for large section reveals where too-fast feels cheap
const easeGentle: Transition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1],
}

// ─── Scroll-Reveal Variants ───────────────────────────────────────────────────
// Each variant combines opacity + a directional transform for spatial depth.
// Transforms are small (24–32 px) so they enhance without feeling overdone.

export const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: ease },
}

export const fadeDownVariants: Variants = {
  hidden:  { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: ease },
}

export const fadeLeftVariants: Variants = {
  hidden:  { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: easeGentle },
}

export const fadeRightVariants: Variants = {
  hidden:  { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: easeGentle },
}

export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: ease },
  exit:    { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
}

// ─── Stagger Containers ───────────────────────────────────────────────────────
export function staggerContainer(staggerDelay = 0.1, initialDelay = 0.05): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren:   initialDelay,
      },
    },
  }
}

export const gridStagger: Variants = staggerContainer(0.08, 0.04)
export const wordStagger: Variants = staggerContainer(0.05, 0)

// ─── Hero Slide — premium crossfade with subtle scale ────────────────────────
// A tiny scale on enter/exit gives the slide transitions depth without
// any lateral movement that could feel jarring.
export const heroSlideVariants: Variants = {
  enter:  { opacity: 0, scale: 1.04 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit:   {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.75, ease: [0.4, 0, 1, 1] },
  },
}

// Hero text — slides up softly as each slide enters
export const heroWordVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const heroSupportVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
}

// ─── Card scroll-reveal — float up into place ────────────────────────────────
export const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0,  transition: ease },
  // hover handled directly on motion.div with whileHover prop
  rest:    { scale: 1 },
  hover:   { scale: 1.02 },
}

// ─── Destination card hover (image zoom + overlay reveal) ────────────────────
export const destinationImageVariants: Variants = {
  rest:  { scale: 1,    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  hover: { scale: 1.08, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const destinationOverlayVariants: Variants = {
  rest:  { opacity: 0, y: 8 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

// ─── Service card icon float (spring physics) ─────────────────────────────────
export const iconFloatVariants: Variants = {
  rest:  { y: 0,  scale: 1 },
  hover: {
    y: -6,
    scale: 1.15,
    transition: { type: 'spring', stiffness: 320, damping: 20 },
  },
}

export const glowVariants: Variants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
}

// ─── Section header underline grow-in ────────────────────────────────────────
export const lineVariants: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const statVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: ease },
}

// ─── Testimonial carousel — fade with subtle vertical drift ──────────────────
export const testimonialVariants: Variants = {
  enter:  { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
}

// ─── Mobile Menu — slide down from top ───────────────────────────────────────
export const mobileMenuVariants: Variants = {
  hidden:  { opacity: 0, height: 0,      y: -8 },
  visible: { opacity: 1, height: 'auto', y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, height: 0,      y: -8,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
}

// ─── Kept for compatibility ───────────────────────────────────────────────────
export const premiumEase: Transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
export const springBounce: Transition = {
  type: 'spring', stiffness: 220, damping: 18, mass: 0.9,
}
