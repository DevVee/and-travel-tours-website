import { cn } from '@lib/utils'
import {
  INQUIRY_STATUS_STYLES,
  QUOTATION_STATUS_STYLES,
  BOOKING_STATUS_STYLES,
} from '@admin-lib/statusColors'
import type { InquiryStatus, QuotationStatus, BookingStatus } from '@admin-types/index'

interface StatusBadgeProps {
  status: InquiryStatus | QuotationStatus | BookingStatus
  type: 'inquiry' | 'quotation' | 'booking'
  size?: 'sm' | 'md'
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, type, size = 'md', showDot = true, className }: StatusBadgeProps) {
  let style: { bg: string; text: string; dot: string; label: string }

  if (type === 'inquiry') {
    style = INQUIRY_STATUS_STYLES[status as InquiryStatus]
  } else if (type === 'quotation') {
    style = QUOTATION_STATUS_STYLES[status as QuotationStatus]
  } else {
    style = BOOKING_STATUS_STYLES[status as BookingStatus]
  }

  if (!style) return null

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      style.bg,
      style.text,
      className
    )}>
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', style.dot)} />
      )}
      {style.label}
    </span>
  )
}
