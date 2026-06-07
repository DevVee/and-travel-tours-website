import type { ReportSummary } from '@admin-types/index'

export const MOCK_REPORT_SUMMARY: ReportSummary = {
  totalRevenue: 2_847_500,
  totalBookings: 87,
  totalInquiries: 234,
  conversionRate: 0.372,
  avgBookingValue: 32_729,
  revenueGrowth: 18.4,
  bookingGrowth: 12.7,
  inquiryGrowth: 24.1,
  monthlyRevenue: [
    { month: 'Jul 2025',  revenue: 185_000, bookings: 6,  inquiries: 18 },
    { month: 'Aug 2025',  revenue: 220_000, bookings: 7,  inquiries: 21 },
    { month: 'Sep 2025',  revenue: 198_000, bookings: 6,  inquiries: 19 },
    { month: 'Oct 2025',  revenue: 264_000, bookings: 8,  inquiries: 22 },
    { month: 'Nov 2025',  revenue: 312_000, bookings: 9,  inquiries: 28 },
    { month: 'Dec 2025',  revenue: 445_000, bookings: 13, inquiries: 35 },
    { month: 'Jan 2026',  revenue: 178_000, bookings: 5,  inquiries: 16 },
    { month: 'Feb 2026',  revenue: 224_000, bookings: 7,  inquiries: 20 },
    { month: 'Mar 2026',  revenue: 356_000, bookings: 11, inquiries: 29 },
    { month: 'Apr 2026',  revenue: 298_000, bookings: 9,  inquiries: 25 },
    { month: 'May 2026',  revenue: 187_500, bookings: 6,  inquiries: 17 },
    { month: 'Jun 2026',  revenue: 179_000, bookings: 5,  inquiries: 12 },  // current month (partial)
  ],
  topDestinations: [
    { destination: 'Japan',        bookingCount: 28, revenue: 945_000, percentage: 0.332 },
    { destination: 'South Korea',  bookingCount: 18, revenue: 612_000, percentage: 0.215 },
    { destination: 'Dubai',        bookingCount: 12, revenue: 516_000, percentage: 0.181 },
    { destination: 'Singapore',    bookingCount: 11, revenue: 330_000, percentage: 0.116 },
    { destination: 'Thailand',     bookingCount: 9,  revenue: 252_000, percentage: 0.089 },
    { destination: 'Others',       bookingCount: 9,  revenue: 192_500, percentage: 0.068 },
  ],
  topPackages: [
    { packageName: 'Japan Cherry Blossom',    bookingCount: 18, revenue: 630_000, rating: 4.9 },
    { packageName: 'South Korea K-Experience',bookingCount: 14, revenue: 476_000, rating: 4.8 },
    { packageName: 'Dubai Luxury Experience', bookingCount: 10, revenue: 430_000, rating: 4.9 },
    { packageName: 'Singapore & Malaysia',    bookingCount: 11, revenue: 330_000, rating: 4.7 },
    { packageName: 'Thailand Grand Tour',     bookingCount: 9,  revenue: 252_000, rating: 4.6 },
  ],
  conversionFunnel: [
    { stage: 'Inquiries',  count: 234, percentage: 1.0 },
    { stage: 'Quoted',     count: 138, percentage: 0.59 },
    { stage: 'Confirmed',  count: 101, percentage: 0.43 },
    { stage: 'Scheduled',  count: 92,  percentage: 0.39 },
    { stage: 'Completed',  count: 87,  percentage: 0.37 },
  ],
}

// Dashboard quick stats
export const DASHBOARD_STATS = {
  todayTours: 2,
  upcomingThisWeek: 5,
  newInquiriesToday: 3,
  pendingQuotations: 8,
  activeBookings: 12,
  confirmedThisMonth: 7,
}

// Activity feed
export const MOCK_ACTIVITY = [
  { id: 'act1', type: 'inquiry',    message: 'New inquiry from Rodrigo Macaraeg — South Korea', time: '2 hours ago',    icon: 'MessageSquare' },
  { id: 'act2', type: 'booking',    message: 'BK-0089 confirmed — Carla Mendoza, Dubai Dec 22', time: '3 hours ago',    icon: 'CheckCircle' },
  { id: 'act3', type: 'payment',    message: 'Payment received ₱58,000 — BK-0089',              time: '3 hours ago',    icon: 'CreditCard' },
  { id: 'act4', type: 'inquiry',    message: 'New inquiry from Paolo Navarro — Vietnam',         time: '4 hours ago',    icon: 'MessageSquare' },
  { id: 'act5', type: 'quotation',  message: 'Quote QT-0089 sent to Carla Mendoza',              time: 'Yesterday 3 PM', icon: 'FileText' },
  { id: 'act6', type: 'inquiry',    message: 'New inquiry from Lourdes Bautista — South Korea', time: 'Yesterday 11 AM',icon: 'MessageSquare' },
  { id: 'act7', type: 'booking',    message: 'BK-0085 fully paid — Lourdes Bautista',            time: '2 days ago',     icon: 'CheckCircle' },
  { id: 'act8', type: 'system',     message: 'Itinerary ITN-0012 created for BK-0082',           time: '2 days ago',     icon: 'FileText' },
]

// Team tasks
export const MOCK_TASKS = [
  { id: 'task1', title: 'Send quote to Maria Dela Cruz (Japan Aug)',   done: false, assignee: 'Ana Reyes',     dueDate: 'Today' },
  { id: 'task2', title: 'Follow up on BK-0085 balance payment',        done: false, assignee: 'Ana Reyes',     dueDate: 'Today' },
  { id: 'task3', title: 'Finalize itinerary for Vietnam tour Jun 15',  done: false, assignee: 'Lia Gomez',     dueDate: 'Tomorrow' },
  { id: 'task4', title: 'Review BK-0089 hotel confirmation',           done: true,  assignee: 'Marco Dela Cruz', dueDate: 'Done' },
  { id: 'task5', title: 'Update Japan package gallery photos',          done: false, assignee: 'Lia Gomez',     dueDate: 'Jun 10' },
]
