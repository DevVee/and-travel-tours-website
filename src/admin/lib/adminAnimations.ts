// ─── Admin Animation Variants ──────────────────────────────────────────────
// Framer Motion variants designed for the admin dashboard.
// Uses the same premium easing as the public site: cubic-bezier(0.22, 1, 0.36, 1)

import type { Variants, Transition } from 'framer-motion'

// ─── Shared Transitions ───────────────────────────────────────────────────

export const premiumEase: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
}

export const fastEase: Transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

export const slowEase: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
}

export const springBounce: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
  mass: 0.8,
}

// ─── Page Transitions ─────────────────────────────────────────────────────

/** Used on module page entry — subtle slide from left */
export const pageVariants: Variants = {
  hidden:  { opacity: 0, x: -12, y: 0 },
  visible: { opacity: 1, x: 0,   y: 0, transition: { ...premiumEase, duration: 0.32 } },
  exit:    { opacity: 0, x: 12,  y: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}

/** Simple fade for tab/panel switches */
export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: fastEase },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

// ─── List / Stagger ──────────────────────────────────────────────────────

/** Container for staggered list children */
export const listStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
}

/** Individual list item — slides in from left */
export const listItem: Variants = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
}

/** Card grid stagger container */
export const gridStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

/** Grid card — floats up */
export const gridCard: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Drawers & Sidebars ──────────────────────────────────────────────────

/** Slide-in from right (detail panels, drawers) */
export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: 48, transition: { duration: 0.2, ease: 'easeIn' } },
}

/** Slide-in from bottom (mobile drawers, bottom sheets) */
export const slideInBottom: Variants = {
  hidden:  { opacity: 0, y: 64 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: 64, transition: { duration: 0.22, ease: 'easeIn' } },
}

/** Sidebar collapse — width animation handled inline, but labels use this */
export const sidebarLabel: Variants = {
  expanded:  { opacity: 1, x: 0,   transition: { delay: 0.12, duration: 0.2 } },
  collapsed: { opacity: 0, x: -12, transition: { duration: 0.12 } },
}

// ─── Modals & Popovers ───────────────────────────────────────────────────

/** Scale-in (modals, command palette, confirm dialogs) */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.94, transition: { duration: 0.15, ease: 'easeIn' } },
}

/** Backdrop for modals */
export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
}

/** Tooltip / popover — small scale + fade */
export const popoverVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: fastEase },
  exit:    { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.12 } },
}

// ─── Kanban ───────────────────────────────────────────────────────────────

/** Kanban card — floats up on enter */
export const kanbanCardVariants: Variants = {
  hidden:  { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' } },
}

// ─── Calendar ─────────────────────────────────────────────────────────────

/** Calendar month transition */
export const calendarSlide: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: -32, transition: { duration: 0.2 } },
}

/** Calendar event block */
export const calendarEventVariants: Variants = {
  hidden:  { opacity: 0, scaleY: 0.8, originY: 0 },
  visible: { opacity: 1, scaleY: 1,   transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Status / Progress ────────────────────────────────────────────────────

/** Animated bar width (for progress bars) */
export const progressBar: Variants = {
  hidden:  { width: '0%' },
  visible: (width: string) => ({
    width,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  }),
}

// ─── Stat Cards ───────────────────────────────────────────────────────────

/** Dashboard stat card — count-up feel with slight bounce */
export const statCard: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { ...premiumEase, duration: 0.4 } },
}

// ─── Notification Bell ────────────────────────────────────────────────────

/** Bell shake animation variants */
export const bellShake: Variants = {
  idle:   { rotate: 0 },
  shake:  {
    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

// ─── Itinerary Builder ────────────────────────────────────────────────────

/** Block palette item */
export const paletteBlock: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, y: -2, transition: springBounce },
  tap:  { scale: 0.96 },
}

/** Block being dragged */
export const dragBlock: Variants = {
  rest:    { scale: 1,    rotate: 0,   boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  dragging:{ scale: 1.04, rotate: 1.5, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' },
}

// ─── View Transition ──────────────────────────────────────────────────────

/** defaultViewport mirrors public site — used on whileInView calls */
export const defaultViewport = { once: true, margin: '-60px' }
