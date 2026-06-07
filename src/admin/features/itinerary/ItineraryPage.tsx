import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, Plus, ChevronRight, Calendar, Users } from 'lucide-react'
import { pageVariants, listStagger, listItem } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { AdminCard } from '@admin-ui/AdminCard'
import { formatDate } from '@admin-lib/formatters'
import { cn } from '@lib/utils'

// Mock itineraries data
const MOCK_ITINERARIES = [
  {
    id: 'itin-001',
    bookingId: 'BK-0082',
    title: 'Japan Cherry Blossom 7-Day Itinerary',
    destination: 'Japan',
    customerName: 'Maria Dela Cruz',
    days: 7,
    startDate: '2026-06-10',
    endDate: '2026-06-17',
    status: 'published' as const,
    blocksCount: 28,
    color: '#F97316',
  },
  {
    id: 'itin-002',
    bookingId: 'BK-0083',
    title: 'South Korea K-Experience 6D5N',
    destination: 'South Korea',
    customerName: 'Jose Santos',
    days: 6,
    startDate: '2026-06-12',
    endDate: '2026-06-18',
    status: 'draft' as const,
    blocksCount: 21,
    color: '#8B5CF6',
  },
  {
    id: 'itin-003',
    bookingId: 'BK-0089',
    title: 'Dubai Luxury Experience 6-Day Plan',
    destination: 'Dubai',
    customerName: 'Roberto Garcia',
    days: 6,
    startDate: '2026-06-25',
    endDate: '2026-06-30',
    status: 'draft' as const,
    blocksCount: 14,
    color: '#D4A017',
  },
]

const STATUS_STYLES = {
  published: 'bg-green-50 text-green-700',
  draft:     'bg-gray-100 text-gray-600',
}

export function ItineraryPage() {
  const [search] = useState('')

  const filtered = MOCK_ITINERARIES.filter(it =>
    !search || it.title.toLowerCase().includes(search.toLowerCase()) || it.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <PageHeader
        title="Itineraries"
        subtitle={`${MOCK_ITINERARIES.length} itineraries`}
        icon={<Map size={18} />}
        actions={
          <Link to="/admin/itinerary/new" className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
            <Plus size={15} />
            New Itinerary
          </Link>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Itineraries', value: MOCK_ITINERARIES.length },
          { label: 'Published', value: MOCK_ITINERARIES.filter(i => i.status === 'published').length },
          { label: 'Drafts', value: MOCK_ITINERARIES.filter(i => i.status === 'draft').length },
        ].map(stat => (
          <AdminCard key={stat.label}>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </AdminCard>
        ))}
      </div>

      {/* Itinerary list */}
      <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-3">
        {filtered.map(it => (
          <motion.div key={it.id} variants={listItem}>
            <Link to={`/admin/itinerary/${it.id}/edit`}>
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-card-lg hover:-translate-y-0.5 transition-all flex items-center gap-4">
                {/* Color bar */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: it.color }} />

                {/* Days badge */}
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: it.color }}
                >
                  <span className="text-lg font-bold leading-none">{it.days}</span>
                  <span className="text-[10px] font-medium opacity-80">days</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-heading text-sm font-semibold text-gray-900 truncate">{it.title}</h3>
                    <span className={cn('px-2 py-0.5 text-[10px] font-semibold rounded-full', STATUS_STYLES[it.status])}>
                      {it.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {it.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(it.startDate)} – {formatDate(it.endDate)}
                    </span>
                    <span className="font-mono text-gray-400">{it.bookingId}</span>
                  </div>
                </div>

                {/* Blocks count */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{it.blocksCount}</p>
                  <p className="text-xs text-gray-400">blocks</p>
                </div>

                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
