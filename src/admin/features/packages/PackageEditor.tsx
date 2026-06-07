import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Users, Plus, X } from 'lucide-react'
import { pageVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { FormField, Input, Textarea, Select, PriceInput } from '@admin-forms/FormField'
import { formatPeso } from '@admin-lib/formatters'
import { packages } from '@data/packages'
import { cn } from '@lib/utils'

const BADGE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Most Popular', value: 'Most Popular' },
  { label: 'Best Value', value: 'Best Value' },
  { label: 'Premium', value: 'Premium' },
  { label: 'New', value: 'New' },
]

const DESTINATION_OPTIONS = [
  { label: 'Japan', value: 'Japan' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Kazakhstan', value: 'Kazakhstan' },
  { label: 'Uzbekistan', value: 'Uzbekistan' },
]

export function PackageEditor() {
  const { id } = useParams()
  const existing = id ? packages.find(p => String(p.id) === id) : null

  const [form, setForm] = useState({
    title:         existing?.title         ?? '',
    destination:   existing?.destination   ?? '',
    nights:        existing?.nights        ?? 5,
    days:          existing?.days          ?? 6,
    price:         existing?.price         ?? 0,
    originalPrice: existing?.originalPrice ?? 0,
    badge:         existing?.badge         ?? '',
    imageUrl:      existing?.imageUrl      ?? '',
    description:   '',
    includes:      existing?.includes      ?? [],
    newInclude:    '',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const addInclude = () => {
    if (form.newInclude.trim()) {
      set('includes', [...form.includes, form.newInclude.trim()])
      set('newInclude', '')
    }
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/packages" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-heading text-xl font-bold text-gray-900">
          {existing ? `Edit: ${existing.title}` : 'New Package'}
        </h1>
        {form.badge && (
          <span className="px-2.5 py-1 text-xs font-bold bg-brand-orange text-white rounded-full">{form.badge}</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Form ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <AdminCard>
            <h2 className="font-heading text-base font-semibold text-gray-800 mb-4">Basic Info</h2>
            <div className="space-y-4">
              <FormField label="Package Title" required>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Japan Cherry Blossom Tour" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Destination" required>
                  <Select
                    value={form.destination}
                    onChange={e => set('destination', e.target.value)}
                    placeholder="Select destination"
                    options={DESTINATION_OPTIONS}
                  />
                </FormField>
                <FormField label="Badge">
                  <Select value={form.badge} onChange={e => set('badge', e.target.value)} options={BADGE_OPTIONS} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nights">
                  <Input type="number" min={1} value={form.nights} onChange={e => set('nights', +e.target.value)} />
                </FormField>
                <FormField label="Days">
                  <Input type="number" min={1} value={form.days} onChange={e => set('days', +e.target.value)} />
                </FormField>
              </div>
              <FormField label="Description">
                <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description of the package…" />
              </FormField>
              <FormField label="Image URL">
                <Input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/…" />
              </FormField>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-heading text-base font-semibold text-gray-800 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Price per Person (PHP)" required>
                <PriceInput value={form.price} onChange={v => set('price', v)} />
              </FormField>
              <FormField label="Original Price (for strikethrough)">
                <PriceInput value={form.originalPrice} onChange={v => set('originalPrice', v)} />
              </FormField>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-heading text-base font-semibold text-gray-800 mb-4">Inclusions</h2>
            <div className="space-y-2 mb-3">
              {form.includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                  <span className="flex-1">{inc}</span>
                  <button onClick={() => set('includes', form.includes.filter((_, idx) => idx !== i))} className="text-green-500 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={form.newInclude}
                onChange={e => set('newInclude', e.target.value)}
                placeholder="e.g. Roundtrip airfare"
                onKeyDown={e => e.key === 'Enter' && addInclude()}
              />
              <button onClick={addInclude} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600">
                <Plus size={14} />
                Add
              </button>
            </div>
          </AdminCard>
        </div>

        {/* ── Right: Live Preview ───────────────────────────── */}
        <div className="space-y-4">
          <AdminCard padding="none">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</p>
            </div>
            {/* Card preview */}
            <div className="overflow-hidden rounded-b-xl">
              {form.imageUrl ? (
                <div className="relative aspect-[16/9]">
                  <img src={form.imageUrl} alt={form.title} className="w-full h-full object-cover" />
                  {form.badge && (
                    <span className={cn(
                      'absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full',
                      form.badge === 'Most Popular' ? 'bg-brand-orange text-white' :
                      form.badge === 'Premium'      ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    )}>
                      {form.badge}
                    </span>
                  )}
                  {(form.nights > 0 || form.days > 0) && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      <Clock size={10} />
                      {form.nights}N / {form.days}D
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image set
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{form.destination || 'Destination'}</p>
                <h3 className="font-heading text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {form.title || 'Package Title'}
                </h3>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-base font-bold text-brand-orange">
                      {form.price ? formatPeso(form.price) : '₱ —'}
                    </span>
                    {form.originalPrice > 0 && (
                      <span className="ml-2 text-xs text-gray-400 line-through">{formatPeso(form.originalPrice)}</span>
                    )}
                    <p className="text-[10px] text-gray-400">per person</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users size={11} />
                    <span className="text-xs">Group</span>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Pricing summary */}
          <AdminCard>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Pricing Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  {form.nights}N / {form.days}D
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-bold text-brand-orange">{form.price ? formatPeso(form.price) : '—'}</span>
              </div>
              {form.originalPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Savings</span>
                  <span className="font-medium text-green-600">
                    {formatPeso(form.originalPrice - form.price)} ({Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off)
                  </span>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Save actions */}
          <div className="flex gap-3">
            <Link to="/admin/packages" className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 text-center transition-colors">
              Cancel
            </Link>
            <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-brand-orange rounded-xl hover:bg-orange-600 transition-colors shadow-orange">
              {existing ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
