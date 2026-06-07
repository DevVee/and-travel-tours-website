import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Tag, FileText } from 'lucide-react'
import { pageVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { FormField, Input, Textarea, Select } from '@admin-forms/FormField'
import { destinations } from '@data/destinations'

interface DestinationWorkspaceProps {
  mode?: 'new'
}

const REGION_OPTIONS = [
  { label: 'Asia', value: 'asia' },
  { label: 'Middle East', value: 'middle-east' },
  { label: 'Europe', value: 'europe' },
  { label: 'Central Asia', value: 'central-asia' },
  { label: 'Americas', value: 'americas' },
]

const BADGE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Most Popular', value: 'Most Popular' },
  { label: 'Trending', value: 'Trending' },
  { label: 'Visa-Free 🇵🇭', value: 'Visa-Free 🇵🇭' },
  { label: 'Multi-Country', value: 'Multi-Country' },
  { label: 'New', value: 'New' },
]

export function DestinationWorkspace({ mode }: DestinationWorkspaceProps) {
  const { id } = useParams()
  const existing = id ? destinations.find(d => String(d.id) === id) : null
  const isNew = mode === 'new' || !existing

  const [form, setForm] = useState({
    name:      existing?.name      ?? '',
    slug:      existing?.slug      ?? '',
    flagCode:  existing?.flagCode  ?? '',
    imageUrl:  existing?.imageUrl  ?? '',
    badge:     existing?.badge     ?? '',
    shortDesc: existing?.shortDesc ?? '',
    region:    '',
    visaInfo:  '',
    bestTime:  '',
    highlights: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/destinations" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">
            {isNew ? 'Add Destination' : `Edit: ${existing?.name}`}
          </h1>
          {!isNew && existing && (
            <p className="text-xs text-gray-400 mt-0.5">ID: {existing.id} · Slug: {existing.slug}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <AdminCard>
            <h2 className="font-heading text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Globe size={15} className="text-brand-orange" />
              Destination Info
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Destination Name" required>
                  <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Japan" />
                </FormField>
                <FormField label="URL Slug" required>
                  <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. japan" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Flag Code (ISO 2-letter)">
                  <Input value={form.flagCode} onChange={e => set('flagCode', e.target.value)} placeholder="e.g. jp" />
                </FormField>
                <FormField label="Region">
                  <Select value={form.region} onChange={e => set('region', e.target.value)} placeholder="Select region" options={REGION_OPTIONS} />
                </FormField>
              </div>
              <FormField label="Short Description">
                <Textarea value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="One-sentence destination pitch for the website…" />
              </FormField>
              <FormField label="Badge / Tag">
                <Select value={form.badge} onChange={e => set('badge', e.target.value)} options={BADGE_OPTIONS} />
              </FormField>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-heading text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={15} className="text-brand-orange" />
              Content & Media
            </h2>
            <div className="space-y-4">
              <FormField label="Main Image URL">
                <Input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/…" />
              </FormField>
              <FormField label="Best Time to Visit">
                <Input value={form.bestTime} onChange={e => set('bestTime', e.target.value)} placeholder="e.g. March–May (Spring), October–November (Autumn)" />
              </FormField>
              <FormField label="Visa Information for Filipinos">
                <Textarea value={form.visaInfo} onChange={e => set('visaInfo', e.target.value)} placeholder="e.g. Requires tourist visa. Processing time: 5–7 business days…" />
              </FormField>
              <FormField label="Highlights (one per line)">
                <Textarea value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder="Cherry Blossom Season&#10;Mount Fuji&#10;Tokyo Disneyland&#10;Shinkansen Experience" />
              </FormField>
            </div>
          </AdminCard>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <AdminCard padding="none">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Preview</p>
            </div>
            <div className="overflow-hidden rounded-b-xl">
              {form.imageUrl ? (
                <div className="relative aspect-[4/3]">
                  <img src={form.imageUrl} alt={form.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    {form.badge && (
                      <span className="inline-block px-2 py-0.5 bg-brand-orange text-[10px] font-bold rounded-full mb-2">{form.badge}</span>
                    )}
                    <h3 className="font-heading text-xl font-bold">{form.name || 'Name'}</h3>
                    <p className="text-xs text-white/75 mt-1 line-clamp-2">{form.shortDesc || 'Short description…'}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image set
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Region</span>
                <span className="font-medium capitalize">{form.region || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flag</span>
                <span className="font-mono text-xs">{form.flagCode ? `🏳️ ${form.flagCode.toUpperCase()}` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs text-gray-400">/destinations/{form.slug || '…'}</span>
              </div>
              {form.badge && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Badge</span>
                  <span className="inline-flex items-center gap-1">
                    <Tag size={11} />
                    {form.badge}
                  </span>
                </div>
              )}
            </div>
          </AdminCard>

          <div className="flex gap-3">
            <Link to="/admin/destinations" className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 text-center">
              Cancel
            </Link>
            <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-brand-orange rounded-xl hover:bg-orange-600 shadow-orange text-center">
              {isNew ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
