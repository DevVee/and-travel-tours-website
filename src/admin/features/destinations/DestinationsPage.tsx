import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Plus, Search } from 'lucide-react'
import { pageVariants, gridStagger, gridCard } from '@admin-lib/adminAnimations'
import { PageHeader } from '@admin-ui/PageHeader'
import { destinations } from '@data/destinations'
import { cn } from '@lib/utils'

const REGIONS = ['All', 'Asia', 'Middle East', 'Europe', 'Central Asia']

export function DestinationsPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')

  const filtered = destinations.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Sort so the first item is "featured" (largest card)
  const [featured, ...rest] = filtered

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <PageHeader
        title="Destinations"
        subtitle={`${destinations.length} destinations managed`}
        icon={<Globe size={18} />}
        actions={
          <Link to="/admin/destinations/new" className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
            <Plus size={15} />
            Add Destination
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl flex-1 max-w-xs">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search destinations…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
                region === r
                  ? 'bg-brand-black text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Mosaic Gallery */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No destinations found</div>
      ) : (
        <motion.div variants={gridStagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
          {/* Featured — spans 2 columns + 2 rows */}
          {featured && (
            <motion.div variants={gridCard} className="md:col-span-2 md:row-span-2 relative group rounded-2xl overflow-hidden shadow-card-lg">
              <Link to={`/admin/destinations/${featured.id}/edit`}>
                <img
                  src={featured.imageUrl}
                  alt={featured.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  {featured.badge && (
                    <span className="inline-block px-2.5 py-1 bg-brand-orange text-xs font-bold rounded-full mb-2">{featured.badge}</span>
                  )}
                  <h2 className="font-heading text-3xl font-bold mb-1">{featured.name}</h2>
                  <p className="text-sm text-white/80 max-w-xs">{featured.shortDesc}</p>
                  <span className="inline-block mt-3 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Destination
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Rest — regular cards */}
          {rest.map(dest => (
            <motion.div key={dest.id} variants={gridCard} className="relative group rounded-2xl overflow-hidden shadow-card">
              <Link to={`/admin/destinations/${dest.id}/edit`}>
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  {dest.badge && (
                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-[10px] font-bold rounded-full mb-1.5">{dest.badge}</span>
                  )}
                  <h3 className="font-heading text-lg font-bold">{dest.name}</h3>
                  <p className="text-xs text-white/75 line-clamp-1 mt-0.5">{dest.shortDesc}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 bg-white text-gray-900 text-xs font-semibold rounded-lg shadow">Edit</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
