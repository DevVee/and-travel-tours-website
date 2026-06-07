// ─── Centralized Status Color Map ──────────────────────────────────────────
// All status → Tailwind color class mappings live here.
// Import this everywhere instead of inline switch statements.

import type { InquiryStatus, QuotationStatus, BookingStatus } from '@admin-types/index'

interface StatusStyle {
  dot: string       // Tailwind bg class for dot indicator
  bg: string        // Tailwind bg class for badge background
  text: string      // Tailwind text class for badge text
  border: string    // Tailwind border class
  label: string     // Human-readable label
}

// ─── Inquiry Statuses ─────────────────────────────────────────────────────

export const INQUIRY_STATUS_STYLES: Record<InquiryStatus, StatusStyle> = {
  new: {
    dot:    'bg-blue-500',
    bg:     'bg-blue-50',
    text:   'text-blue-700',
    border: 'border-blue-200',
    label:  'New',
  },
  discussion: {
    dot:    'bg-violet-500',
    bg:     'bg-violet-50',
    text:   'text-violet-700',
    border: 'border-violet-200',
    label:  'In Discussion',
  },
  quoted: {
    dot:    'bg-amber-500',
    bg:     'bg-amber-50',
    text:   'text-amber-700',
    border: 'border-amber-200',
    label:  'Quoted',
  },
  converted: {
    dot:    'bg-green-500',
    bg:     'bg-green-50',
    text:   'text-green-700',
    border: 'border-green-200',
    label:  'Converted',
  },
  archived: {
    dot:    'bg-gray-400',
    bg:     'bg-gray-100',
    text:   'text-gray-600',
    border: 'border-gray-200',
    label:  'Archived',
  },
}

// ─── Quotation Statuses ───────────────────────────────────────────────────

export const QUOTATION_STATUS_STYLES: Record<QuotationStatus, StatusStyle> = {
  draft: {
    dot:    'bg-gray-400',
    bg:     'bg-gray-100',
    text:   'text-gray-700',
    border: 'border-gray-200',
    label:  'Draft',
  },
  sent: {
    dot:    'bg-blue-500',
    bg:     'bg-blue-50',
    text:   'text-blue-700',
    border: 'border-blue-200',
    label:  'Sent',
  },
  approved: {
    dot:    'bg-green-500',
    bg:     'bg-green-50',
    text:   'text-green-700',
    border: 'border-green-200',
    label:  'Approved',
  },
  expired: {
    dot:    'bg-amber-500',
    bg:     'bg-amber-50',
    text:   'text-amber-700',
    border: 'border-amber-200',
    label:  'Expired',
  },
  rejected: {
    dot:    'bg-red-500',
    bg:     'bg-red-50',
    text:   'text-red-700',
    border: 'border-red-200',
    label:  'Rejected',
  },
}

// ─── Booking Statuses ─────────────────────────────────────────────────────

export const BOOKING_STATUS_STYLES: Record<BookingStatus, StatusStyle> = {
  inquiry: {
    dot:    'bg-blue-500',
    bg:     'bg-blue-50',
    text:   'text-blue-700',
    border: 'border-blue-200',
    label:  'Inquiry',
  },
  quoted: {
    dot:    'bg-amber-500',
    bg:     'bg-amber-50',
    text:   'text-amber-700',
    border: 'border-amber-200',
    label:  'Quoted',
  },
  confirmed: {
    dot:    'bg-green-500',
    bg:     'bg-green-50',
    text:   'text-green-700',
    border: 'border-green-200',
    label:  'Confirmed',
  },
  scheduled: {
    dot:    'bg-orange-500',
    bg:     'bg-orange-50',
    text:   'text-orange-700',
    border: 'border-orange-200',
    label:  'Scheduled',
  },
  completed: {
    dot:    'bg-gray-500',
    bg:     'bg-gray-100',
    text:   'text-gray-700',
    border: 'border-gray-200',
    label:  'Completed',
  },
  cancelled: {
    dot:    'bg-red-500',
    bg:     'bg-red-50',
    text:   'text-red-700',
    border: 'border-red-200',
    label:  'Cancelled',
  },
}

// ─── Role Styles ──────────────────────────────────────────────────────────

export const ROLE_STYLES = {
  super_admin: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    label: 'Super Admin',
  },
  administrator: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Administrator',
  },
  consultant: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    label: 'Consultant',
  },
  staff: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    label: 'Staff',
  },
} as const

// ─── Destination Color Tags (for calendar) ───────────────────────────────

export const DESTINATION_COLORS: Record<string, string> = {
  japan:        '#F97316',   // brand orange
  'south-korea':'#8B5CF6',   // violet
  dubai:        '#D4A017',   // brand gold
  singapore:    '#10B981',   // emerald
  thailand:     '#EC4899',   // pink
  vietnam:      '#14B8A6',   // teal
  'hong-kong':  '#F43F5E',   // rose
  malaysia:     '#3B82F6',   // blue
  default:      '#6B7280',   // gray
}

export function getDestinationColor(slug: string): string {
  return DESTINATION_COLORS[slug] ?? DESTINATION_COLORS.default
}
