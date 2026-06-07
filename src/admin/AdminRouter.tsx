import { Routes, Route } from 'react-router-dom'
import { AdminShell } from '@admin-layout/AdminShell'

// ─── Lazy-loaded feature pages ────────────────────────────────────────────
// Using direct imports for prototype (swap to React.lazy when needed)

import { DashboardPage } from '@admin-features/dashboard/DashboardPage'
import { InquiriesPage }  from '@admin-features/inquiries/InquiriesPage'
import { InquiryWorkspace } from '@admin-features/inquiries/InquiryWorkspace'
import { CustomersPage }  from '@admin-features/customers/CustomersPage'
import { CustomerProfilePage } from '@admin-features/customers/CustomerProfilePage'
import { QuotationsPage } from '@admin-features/quotations/QuotationsPage'
import { QuotationBuilder } from '@admin-features/quotations/QuotationBuilder'
import { BookingsPage }   from '@admin-features/bookings/BookingsPage'
import { BookingDetailWorkspace } from '@admin-features/bookings/BookingDetailWorkspace'
import { PackagesPage }   from '@admin-features/packages/PackagesPage'
import { PackageEditor }  from '@admin-features/packages/PackageEditor'
import { DestinationsPage } from '@admin-features/destinations/DestinationsPage'
import { DestinationWorkspace } from '@admin-features/destinations/DestinationWorkspace'
import { SchedulePage }   from '@admin-features/schedule/SchedulePage'
import { ItineraryPage }  from '@admin-features/itinerary/ItineraryPage'
import { ItineraryBuilder } from '@admin-features/itinerary/ItineraryBuilder'
import { ReportsPage }    from '@admin-features/reports/ReportsPage'
import { UsersPage }      from '@admin-features/users/UsersPage'
import { UserProfilePage } from '@admin-features/users/UserProfilePage'
import { AuditLogsPage }  from '@admin-features/audit-logs/AuditLogsPage'
import { NotificationsPage } from '@admin-features/notifications/NotificationsPage'
import { SettingsPage }   from '@admin-features/settings/SettingsPage'

export function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminShell />}>

        {/* Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Inquiries */}
        <Route path="inquiries">
          <Route index element={<InquiriesPage />} />
          <Route path="new" element={<InquiryWorkspace mode="new" />} />
          <Route path=":id" element={<InquiryWorkspace />} />
        </Route>

        {/* Customers */}
        <Route path="customers">
          <Route index element={<CustomersPage />} />
          <Route path=":id" element={<CustomerProfilePage />} />
        </Route>

        {/* Quotations */}
        <Route path="quotations">
          <Route index element={<QuotationsPage />} />
          <Route path="new" element={<QuotationBuilder />} />
          <Route path=":id" element={<QuotationBuilder editMode />} />
        </Route>

        {/* Bookings */}
        <Route path="bookings">
          <Route index element={<BookingsPage />} />
          <Route path=":id" element={<BookingDetailWorkspace />} />
        </Route>

        {/* Packages */}
        <Route path="packages">
          <Route index element={<PackagesPage />} />
          <Route path="new" element={<PackageEditor />} />
          <Route path=":id/edit" element={<PackageEditor />} />
        </Route>

        {/* Destinations */}
        <Route path="destinations">
          <Route index element={<DestinationsPage />} />
          <Route path="new" element={<DestinationWorkspace mode="new" />} />
          <Route path=":id/edit" element={<DestinationWorkspace />} />
        </Route>

        {/* Schedule */}
        <Route path="schedule">
          <Route index element={<SchedulePage view="month" />} />
          <Route path="week" element={<SchedulePage view="week" />} />
          <Route path="day" element={<SchedulePage view="day" />} />
          <Route path="timeline" element={<SchedulePage view="timeline" />} />
        </Route>

        {/* Itinerary */}
        <Route path="itinerary">
          <Route index element={<ItineraryPage />} />
          <Route path="new" element={<ItineraryBuilder />} />
          <Route path=":id/edit" element={<ItineraryBuilder />} />
        </Route>

        {/* Reports */}
        <Route path="reports">
          <Route index element={<ReportsPage />} />
        </Route>

        {/* Users */}
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":id" element={<UserProfilePage />} />
        </Route>

        {/* System */}
        <Route path="audit-logs"    element={<AuditLogsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings"      element={<SettingsPage />} />

      </Route>
    </Routes>
  )
}
