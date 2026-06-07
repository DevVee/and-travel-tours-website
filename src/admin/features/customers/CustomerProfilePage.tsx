import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, MapPin, Plane, Star, BookOpen, MessageSquare, StickyNote } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { StatusBadge } from '@admin-ui/StatusBadge'
import { MOCK_CUSTOMERS } from '@admin-data/mockCustomers'
import { MOCK_BOOKINGS } from '@admin-data/mockBookings'
import { MOCK_INQUIRIES } from '@admin-data/mockInquiries'
import { formatPeso, formatDate, getInitials } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

const TABS = ['Overview', 'Travel History', 'Inquiries', 'Bookings', 'Notes'] as const
type Tab = typeof TABS[number]

export function CustomerProfilePage() {
  const { id } = useParams()
  const customer = MOCK_CUSTOMERS.find(c => c.id === id)
  const [tab, setTab] = useState<Tab>('Overview')

  if (!customer) return <div className="p-6 text-gray-500">Customer not found.</div>

  const customerBookings  = MOCK_BOOKINGS.filter(b => b.customerId === id)
  const customerInquiries = MOCK_INQUIRIES.filter(i => i.customerId === id)

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6 max-w-5xl">
      {/* Back */}
      <Link to="/admin/customers" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
        <ArrowLeft size={15} />
        Back to Customers
      </Link>

      {/* Profile header */}
      <AdminCard>
        <div className="flex items-start gap-4">
          {customer.avatarUrl ? (
            <img src={customer.avatarUrl} alt={customer.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-orange/10" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center">
              <span className="text-white font-bold text-lg">{getInitials(customer.name)}</span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl font-bold text-gray-900">{customer.name}</h1>
              {customer.tags.includes('vip') && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  VIP Client
                </span>
              )}
              {customer.tags.map(tag => tag !== 'vip' && (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500"><Mail size={13} />{customer.email}</div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500"><Phone size={13} />{customer.phone}</div>
              {customer.address && <div className="flex items-center gap-1.5 text-sm text-gray-500"><MapPin size={13} />{customer.address}</div>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{customer.totalBookings}</p>
              <p className="text-xs text-gray-400">Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-brand-orange">{formatPeso(customer.totalSpent, true)}</p>
              <p className="text-xs text-gray-400">Spent</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{customer.preferredDestinations.length}</p>
              <p className="text-xs text-gray-400">Destinations</p>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all',
              tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-2 gap-5">
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-3">Preferred Destinations</h3>
            <div className="space-y-2">
              {customer.preferredDestinations.map(dest => (
                <div key={dest} className="flex items-center gap-2 text-sm">
                  <Plane size={13} className="text-brand-orange" />
                  <span className="text-gray-700">{dest}</span>
                </div>
              ))}
            </div>
          </AdminCard>
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-3">Personal Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Nationality</span><span className="font-medium">{customer.nationality}</span></div>
              {customer.passportNumber && <div className="flex justify-between"><span className="text-gray-500">Passport</span><span className="font-mono text-xs font-medium">{customer.passportNumber}</span></div>}
              {customer.passportExpiry && <div className="flex justify-between"><span className="text-gray-500">Passport Expiry</span><span className="font-medium">{formatDate(customer.passportExpiry)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Customer Since</span><span className="font-medium">{formatDate(customer.createdAt)}</span></div>
            </div>
          </AdminCard>
        </div>
      )}

      {tab === 'Bookings' && (
        <AdminCard padding="none">
          <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
            {customerBookings.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">No bookings yet</div>
            ) : (
              customerBookings.map(b => (
                <motion.div key={b.id} variants={listItem}>
                  <Link to={`/admin/bookings/${b.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <BookOpen size={15} className="text-brand-orange" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{b.packageName}</p>
                      <p className="text-xs text-gray-500">{formatDate(b.travelDateFrom)} – {formatDate(b.travelDateTo)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPeso(b.totalAmount)}</p>
                      <StatusBadge status={b.status} type="booking" size="sm" />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </AdminCard>
      )}

      {tab === 'Inquiries' && (
        <AdminCard padding="none">
          <motion.div variants={listStagger} initial="hidden" animate="visible" className="divide-y divide-gray-50">
            {customerInquiries.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">No inquiries yet</div>
            ) : (
              customerInquiries.map(inq => (
                <motion.div key={inq.id} variants={listItem}>
                  <Link to={`/admin/inquiries/${inq.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <MessageSquare size={15} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{inq.destination}</p>
                      <p className="text-xs text-gray-500">{inq.id} · {formatDate(inq.createdAt)}</p>
                    </div>
                    <StatusBadge status={inq.status} type="inquiry" size="sm" />
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </AdminCard>
      )}

      {tab === 'Notes' && (
        <AdminCard>
          {customer.notes ? (
            <div className="flex items-start gap-3">
              <StickyNote size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{customer.notes}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No notes added yet.</p>
          )}
        </AdminCard>
      )}

      {tab === 'Travel History' && (
        <AdminCard>
          <p className="text-sm text-gray-400 italic">Travel history timeline coming soon.</p>
        </AdminCard>
      )}
    </motion.div>
  )
}
