// ─── Shared Admin Types ────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'administrator' | 'consultant' | 'staff'

export type InquiryStatus = 'new' | 'discussion' | 'quoted' | 'converted' | 'archived'

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'expired' | 'rejected'

export type BookingStatus =
  | 'inquiry'
  | 'quoted'
  | 'confirmed'
  | 'scheduled'
  | 'completed'
  | 'cancelled'

export type ItineraryBlockType = 'activity' | 'hotel' | 'transport' | 'meal' | 'note'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// ─── User ─────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  department?: string
  joinedAt: string           // ISO date string
  lastActiveAt: string
  isActive: boolean
  permissions: string[]
}

// ─── Customer ─────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  avatarUrl?: string
  nationality: string
  passportNumber?: string
  passportExpiry?: string
  totalBookings: number
  totalSpent: number          // PHP amount
  lastTravelDate?: string
  preferredDestinations: string[]
  notes?: string
  createdAt: string
  tags: string[]
}

// ─── Inquiry ──────────────────────────────────────────────────────────────

export interface InquiryNote {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export interface InquiryActivity {
  id: string
  type: 'status_change' | 'note' | 'assignment' | 'quotation' | 'system'
  description: string
  actorName: string
  actorAvatar?: string
  metadata?: Record<string, string>
  createdAt: string
}

export interface Inquiry {
  id: string                 // e.g. INQ-0042
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  destination: string
  destinationSlug: string
  travelDateFrom?: string
  travelDateTo?: string
  paxAdults: number
  paxChildren: number
  budgetMin?: number
  budgetMax?: number
  message: string
  status: InquiryStatus
  assignedConsultantId?: string
  assignedConsultantName?: string
  assignedConsultantAvatar?: string
  source: 'website' | 'facebook' | 'messenger' | 'walk_in' | 'referral' | 'phone'
  notes: InquiryNote[]
  activity: InquiryActivity[]
  createdAt: string
  updatedAt: string
  respondedAt?: string
}

// ─── Quotation ────────────────────────────────────────────────────────────

export interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  category: 'package' | 'hotel' | 'airfare' | 'transfer' | 'addon' | 'visa' | 'other'
}

export interface Quotation {
  id: string                 // e.g. QT-0089
  inquiryId: string
  customerId: string
  customerName: string
  packageId?: string
  packageName?: string
  destination: string
  travelDateFrom: string
  travelDateTo: string
  paxAdults: number
  paxChildren: number
  items: QuotationItem[]
  subtotal: number
  discountAmount: number
  discountNote?: string
  total: number
  inclusions: string[]
  exclusions: string[]
  terms?: string
  notes?: string
  validUntil: string
  status: QuotationStatus
  consultantId: string
  consultantName: string
  sentAt?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Booking ──────────────────────────────────────────────────────────────

export interface BookingPayment {
  id: string
  amount: number
  method: 'cash' | 'bank_transfer' | 'gcash' | 'maya' | 'credit_card'
  reference?: string
  paidAt: string
  note?: string
}

export interface Booking {
  id: string                 // e.g. BK-0089
  quotationId?: string
  inquiryId?: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  packageId?: string
  packageName: string
  destination: string
  travelDateFrom: string
  travelDateTo: string
  returnDate?: string
  paxAdults: number
  paxChildren: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: BookingStatus
  consultantId: string
  consultantName: string
  itineraryId?: string
  scheduleId?: string
  payments: BookingPayment[]
  specialRequests?: string
  notes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

// ─── Package ──────────────────────────────────────────────────────────────

export interface TourPackage {
  id: string
  title: string
  destination: string
  destinationSlug: string
  imageUrl: string
  gallery: string[]
  nights: number
  days: number
  price: number
  originalPrice?: number
  includes: string[]
  excludes: string[]
  highlights: string[]
  badge?: string
  category: 'domestic' | 'international' | 'group' | 'corporate' | 'honeymoon'
  isFeatured: boolean
  isActive: boolean
  bookingCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

// ─── Schedule ─────────────────────────────────────────────────────────────

export interface ScheduledTour {
  id: string
  bookingId: string
  bookingRef: string
  packageId?: string
  packageName: string
  destination: string
  destinationSlug: string
  dateFrom: string
  dateTo: string
  paxCount: number
  maxCapacity: number
  guideId?: string
  guideName?: string
  consultantId: string
  consultantName: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  colorTag: string           // hex color for calendar display
  notes?: string
}

// ─── Itinerary ────────────────────────────────────────────────────────────

export interface ItineraryBlock {
  id: string
  type: ItineraryBlockType
  time?: string              // HH:MM
  duration?: number          // minutes
  title: string
  description?: string
  location?: string
  mealType?: MealType        // for meal blocks
  checkIn?: string           // for hotel blocks
  checkOut?: string          // for hotel blocks
  hotelName?: string
  transportMode?: string     // for transport blocks
  imageUrl?: string
  notes?: string
  sortOrder: number
}

export interface ItineraryDay {
  id: string
  dayNumber: number
  date?: string
  title?: string
  blocks: ItineraryBlock[]
}

export interface Itinerary {
  id: string
  bookingId: string
  bookingRef: string
  customerName: string
  destination: string
  title: string
  travelDateFrom: string
  travelDateTo: string
  days: ItineraryDay[]
  notes?: string
  consultantId: string
  consultantName: string
  createdAt: string
  updatedAt: string
}

// ─── Reports ──────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  month: string              // e.g. 'Jan 2026'
  revenue: number
  bookings: number
  inquiries: number
}

export interface DestinationStats {
  destination: string
  bookingCount: number
  revenue: number
  percentage: number
}

export interface PackageStats {
  packageName: string
  bookingCount: number
  revenue: number
  rating: number
}

export interface ConversionFunnel {
  stage: string
  count: number
  percentage: number
}

export interface ReportSummary {
  totalRevenue: number
  totalBookings: number
  totalInquiries: number
  conversionRate: number
  avgBookingValue: number
  revenueGrowth: number      // percentage vs previous period
  bookingGrowth: number
  inquiryGrowth: number
  monthlyRevenue: RevenueDataPoint[]
  topDestinations: DestinationStats[]
  topPackages: PackageStats[]
  conversionFunnel: ConversionFunnel[]
}

// ─── Notification ─────────────────────────────────────────────────────────

export interface AdminNotification {
  id: string
  type: 'inquiry' | 'booking' | 'quotation' | 'system' | 'task'
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

// ─── Audit Log ────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: UserRole
  action: string
  resourceType: string
  resourceId: string
  resourceLabel: string
  changes?: Record<string, { from: string; to: string }>
  ipAddress?: string
  createdAt: string
}
