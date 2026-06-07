import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Save, Eye, Printer,
  MapPin, Hotel, UtensilsCrossed, Plane, FileText,
  X, GripVertical,
  Edit3,
} from 'lucide-react'
import { pageVariants, fadeVariants } from '@admin-lib/adminAnimations'
import { cn } from '@lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────
type BlockType = 'activity' | 'hotel' | 'meal' | 'transport' | 'note'

interface ItineraryBlock {
  id:          string
  type:        BlockType
  time:        string
  title:       string
  description: string
  duration:    string
  location:    string
  mealType?:   'breakfast' | 'lunch' | 'dinner'
}

interface Day {
  day:    number
  title:  string
  blocks: ItineraryBlock[]
}

// ─── Block metadata ────────────────────────────────────────────────────────────
const BLOCK_META: Record<BlockType, { icon: typeof MapPin; label: string; color: string; bg: string }> = {
  activity:  { icon: MapPin,          label: 'Activity',  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  hotel:     { icon: Hotel,           label: 'Hotel',     color: 'text-purple-600', bg: 'bg-purple-50' },
  meal:      { icon: UtensilsCrossed, label: 'Meal',      color: 'text-amber-600',  bg: 'bg-amber-50'  },
  transport: { icon: Plane,           label: 'Transport', color: 'text-teal-600',   bg: 'bg-teal-50'   },
  note:      { icon: FileText,        label: 'Note',      color: 'text-gray-500',   bg: 'bg-gray-50'   },
}

// ─── Seed data ─────────────────────────────────────────────────────────────────
const INITIAL_DAYS: Day[] = [
  {
    day: 1, title: 'Arrival Day',
    blocks: [
      { id: 'b1', type: 'transport', time: '14:00', title: 'Arrive at Narita Airport', description: 'International terminal, meet tour guide', duration: '1h', location: 'Narita Airport' },
      { id: 'b2', type: 'transport', time: '16:00', title: 'Transfer to Shinjuku', description: 'Airport limousine bus to hotel', duration: '1.5h', location: 'Narita → Shinjuku' },
      { id: 'b3', type: 'hotel',     time: '17:30', title: 'Check-in: Shinjuku Grand Hotel', description: 'Superior twin room, 3 nights', duration: '', location: 'Shinjuku, Tokyo' },
      { id: 'b4', type: 'meal',      time: '19:00', title: 'Welcome Dinner', description: 'Traditional Japanese kaiseki at local restaurant', duration: '1.5h', location: 'Shinjuku', mealType: 'dinner' },
    ],
  },
  {
    day: 2, title: 'Tokyo Highlights',
    blocks: [
      { id: 'b5', type: 'meal',     time: '08:00', title: 'Hotel Breakfast', description: 'Buffet at the hotel', duration: '45min', location: 'Hotel', mealType: 'breakfast' },
      { id: 'b6', type: 'activity', time: '09:30', title: 'Tsukiji Outer Market', description: 'Famous fish market, fresh seafood stalls', duration: '2h', location: 'Tsukiji, Tokyo' },
      { id: 'b7', type: 'meal',     time: '12:00', title: 'Sushi Lunch', description: 'Omakase lunch at Tsukiji sushi restaurant', duration: '1h', location: 'Tsukiji', mealType: 'lunch' },
      { id: 'b8', type: 'activity', time: '14:00', title: 'Harajuku & Takeshita Street', description: 'Trendy fashion district, Meiji Shrine', duration: '2.5h', location: 'Harajuku, Tokyo' },
      { id: 'b9', type: 'activity', time: '17:00', title: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing + shopping', duration: '2h', location: 'Shibuya, Tokyo' },
      { id: 'b10', type: 'meal',    time: '20:00', title: 'Ramen Dinner', description: 'Ichiran Ramen solo booth experience', duration: '45min', location: 'Shibuya', mealType: 'dinner' },
    ],
  },
  { day: 3, title: 'Nikko Day Trip',    blocks: [] },
  { day: 4, title: 'Kyoto Arrival',     blocks: [] },
  { day: 5, title: 'Kyoto Exploration', blocks: [] },
  { day: 6, title: 'Osaka & Departure', blocks: [] },
  { day: 7, title: 'Departure',         blocks: [] },
]

// ─── Block card (in timeline) ──────────────────────────────────────────────────
function BlockCard({
  block,
  selected,
  onSelect,
  onRemove,
}: {
  block: ItineraryBlock
  selected: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const meta = BLOCK_META[block.type]
  const Icon = meta.icon
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={cn(
        'flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all',
        selected
          ? 'border-brand-orange bg-orange-50 shadow-orange/20 shadow-md'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-card'
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <GripVertical size={14} className="text-gray-300" />
      </div>
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
        <Icon size={13} className={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {block.time && <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{block.time}</span>}
          <p className="text-xs font-semibold text-gray-800 truncate">{block.title || 'Untitled'}</p>
        </div>
        {block.description && (
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{block.description}</p>
        )}
        {block.location && (
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5">
            <MapPin size={9} />
            {block.location}
          </p>
        )}
      </div>
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-400 transition-colors"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function ItineraryBuilder() {
  const { id } = useParams()
  const [days, setDays]         = useState<Day[]>(id ? INITIAL_DAYS : INITIAL_DAYS)
  const [activeDay, setActiveDay]   = useState(0)
  const [selectedBlock, setSelectedBlock] = useState<ItineraryBlock | null>(null)
  const [showPreview, setShowPreview]     = useState(false)

  const currentDay = days[activeDay]

  const addBlock = (type: BlockType) => {
    const newBlock: ItineraryBlock = {
      id: `b${Date.now()}`,
      type,
      time: '',
      title: `New ${BLOCK_META[type].label}`,
      description: '',
      duration: '',
      location: '',
    }
    setDays(prev => prev.map((d, i) =>
      i === activeDay ? { ...d, blocks: [...d.blocks, newBlock] } : d
    ))
    setSelectedBlock(newBlock)
  }

  const removeBlock = (blockId: string) => {
    setDays(prev => prev.map((d, i) =>
      i === activeDay ? { ...d, blocks: d.blocks.filter(b => b.id !== blockId) } : d
    ))
    if (selectedBlock?.id === blockId) setSelectedBlock(null)
  }

  const updateBlock = (field: keyof ItineraryBlock, value: string) => {
    if (!selectedBlock) return
    const updated = { ...selectedBlock, [field]: value }
    setSelectedBlock(updated)
    setDays(prev => prev.map((d, i) =>
      i === activeDay
        ? { ...d, blocks: d.blocks.map(b => b.id === updated.id ? updated : b) }
        : d
    ))
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="h-full flex flex-col">
      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/admin/itinerary" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200">
            <ArrowLeft size={15} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-heading text-base font-bold text-gray-900">
              {id ? 'Japan Cherry Blossom 7-Day Itinerary' : 'New Itinerary'}
            </h1>
            <p className="text-xs text-gray-400">
              {id ? 'BK-0082 · Maria Dela Cruz' : 'Draft'} · {days.reduce((acc, d) => acc + d.blocks.length, 0)} blocks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(v => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl border transition-all',
              showPreview ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            <Eye size={14} />
            Preview
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300">
            <Printer size={14} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-600 shadow-orange">
            <Save size={14} />
            Save Draft
          </button>
        </div>
      </div>

      {/* ── Day tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-1 px-6 py-2 overflow-x-auto border-b border-gray-100 bg-white flex-shrink-0">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => { setActiveDay(i); setSelectedBlock(null) }}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
              activeDay === i
                ? 'bg-brand-orange text-white shadow-orange/40 shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <span className="font-bold">D{d.day}</span>
            <span className="hidden sm:inline max-w-[80px] truncate">{d.title}</span>
            {d.blocks.length > 0 && (
              <span className={cn('rounded-full px-1.5 text-[10px] font-bold', activeDay === i ? 'bg-white/30 text-white' : 'bg-white text-gray-600')}>
                {d.blocks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── 3-Panel Layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Left: Block Palette ───────────────────────────────────── */}
        <div className="w-48 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 p-3 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-3">Add Block</p>
          {(Object.entries(BLOCK_META) as [BlockType, (typeof BLOCK_META)[BlockType]][]).map(([type, meta]) => {
            const Icon = meta.icon
            return (
              <motion.button
                key={type}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addBlock(type)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-card transition-all text-left'
                )}
              >
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
                  <Icon size={13} className={meta.color} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{meta.label}</p>
                  <p className="text-[10px] text-gray-400">Click to add</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* ── Center: Day Timeline ──────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-gray-900">Day {currentDay.day}: {currentDay.title}</h2>
              <p className="text-xs text-gray-500">{currentDay.blocks.length} blocks</p>
            </div>
          </div>

          <AnimatePresence>
            {currentDay.blocks.length === 0 ? (
              <motion.div
                key="empty"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center py-16 text-gray-400"
              >
                <MapPin size={28} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium">No blocks yet</p>
                <p className="text-xs mt-1">Click a block type on the left to add</p>
              </motion.div>
            ) : (
              currentDay.blocks.map(block => (
                <BlockCard
                  key={block.id}
                  block={block}
                  selected={selectedBlock?.id === block.id}
                  onSelect={() => setSelectedBlock(selectedBlock?.id === block.id ? null : block)}
                  onRemove={() => removeBlock(block.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Block Editor ───────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 border-l border-gray-100 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedBlock ? (
              <motion.div
                key={selectedBlock.id}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 space-y-4"
              >
                {/* Block type header */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const meta = BLOCK_META[selectedBlock.type]
                    const Icon = meta.icon
                    return (
                      <>
                        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', meta.bg)}>
                          <Icon size={15} className={meta.color} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">{meta.label}</p>
                          <p className="text-[10px] text-gray-400">Edit block details</p>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* Fields */}
                {[
                  { key: 'title',       label: 'Title',       placeholder: 'e.g. Tsukiji Market', type: 'text' },
                  { key: 'time',        label: 'Time',        placeholder: '10:00', type: 'time' },
                  { key: 'duration',    label: 'Duration',    placeholder: '2h 30min', type: 'text' },
                  { key: 'location',    label: 'Location',    placeholder: 'Tsukiji, Tokyo', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={(selectedBlock as unknown as Record<string, string>)[field.key]}
                      onChange={e => updateBlock(field.key as keyof ItineraryBlock, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                  <textarea
                    value={selectedBlock.description}
                    onChange={e => updateBlock('description', e.target.value)}
                    placeholder="Additional details, tips, or notes…"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 resize-none"
                  />
                </div>

                {selectedBlock.type === 'meal' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meal Type</label>
                    <select
                      value={selectedBlock.mealType ?? ''}
                      onChange={e => updateBlock('mealType', e.target.value)}
                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={() => { removeBlock(selectedBlock.id); setSelectedBlock(null) }}
                  className="w-full py-2 text-xs font-medium text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Remove Block
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty-editor"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center h-full py-16 px-4 text-center text-gray-400"
              >
                <Edit3 size={24} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium">Select a block</p>
                <p className="text-xs mt-1">Click any block in the timeline to edit its details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
