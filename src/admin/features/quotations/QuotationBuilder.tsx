import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, User, Package, DollarSign, Eye } from 'lucide-react'
import { pageVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { FormField, Input, Select, Textarea, PriceInput, DateRangePicker } from '@admin-forms/FormField'
import { formatPeso } from '@admin-lib/formatters'

const STEPS = [
  { id: 1, label: 'Customer',  icon: User },
  { id: 2, label: 'Package',   icon: Package },
  { id: 3, label: 'Pricing',   icon: DollarSign },
  { id: 4, label: 'Review',    icon: Eye },
]

interface QuotationBuilderProps {
  editMode?: boolean
}

export function QuotationBuilder({ editMode }: QuotationBuilderProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    destination: '', dateFrom: '', dateTo: '',
    paxAdults: 2, paxChildren: 0,
    packageId: '', notes: '',
    subtotal: 0, discount: 0,
  })

  const total = form.subtotal - form.discount

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/quotations" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-heading text-xl font-bold text-gray-900">
          {editMode ? 'Edit Quotation' : 'New Quotation'}
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, idx) => {
          const isDone = step > s.id
          const isActive = step === s.id
          return (
            <div key={s.id} className="flex items-center">
              <button onClick={() => step > s.id && setStep(s.id)} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone ? 'bg-green-500 border-green-500' :
                  isActive ? 'bg-brand-orange border-brand-orange' :
                  'border-gray-300 bg-white'
                }`}>
                  {isDone
                    ? <Check size={14} className="text-white" />
                    : <s.icon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                  }
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-brand-orange' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <AdminCard>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-gray-900">Customer Details</h2>
                <FormField label="Full Name" required>
                  <Input value={form.customerName} onChange={e => setForm(f => ({...f, customerName: e.target.value}))} placeholder="e.g. Maria Santos" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email" required>
                    <Input type="email" value={form.customerEmail} onChange={e => setForm(f => ({...f, customerEmail: e.target.value}))} placeholder="customer@email.com" />
                  </FormField>
                  <FormField label="Phone" required>
                    <Input value={form.customerPhone} onChange={e => setForm(f => ({...f, customerPhone: e.target.value}))} placeholder="09XX XXX XXXX" />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Adults">
                    <Input type="number" min={1} value={form.paxAdults} onChange={e => setForm(f => ({...f, paxAdults: +e.target.value}))} />
                  </FormField>
                  <FormField label="Children">
                    <Input type="number" min={0} value={form.paxChildren} onChange={e => setForm(f => ({...f, paxChildren: +e.target.value}))} />
                  </FormField>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-gray-900">Package & Dates</h2>
                <FormField label="Destination" required>
                  <Select
                    value={form.destination}
                    onChange={e => setForm(f => ({...f, destination: e.target.value}))}
                    placeholder="Select destination"
                    options={[
                      { label: 'Japan', value: 'japan' },
                      { label: 'South Korea', value: 'south-korea' },
                      { label: 'Dubai', value: 'dubai' },
                      { label: 'Singapore', value: 'singapore' },
                      { label: 'Thailand', value: 'thailand' },
                      { label: 'Vietnam', value: 'vietnam' },
                    ]}
                  />
                </FormField>
                <FormField label="Travel Dates" required>
                  <DateRangePicker fromValue={form.dateFrom} toValue={form.dateTo} onFromChange={v => setForm(f => ({...f, dateFrom: v}))} onToChange={v => setForm(f => ({...f, dateTo: v}))} />
                </FormField>
                <FormField label="Notes for Customer">
                  <Textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Special requests, inclusions, terms…" />
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-gray-900">Pricing</h2>
                <FormField label="Subtotal (PHP)" required>
                  <PriceInput value={form.subtotal} onChange={v => setForm(f => ({...f, subtotal: v}))} />
                </FormField>
                <FormField label="Discount (PHP)">
                  <PriceInput value={form.discount} onChange={v => setForm(f => ({...f, discount: v}))} />
                </FormField>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPeso(form.subtotal)}</span>
                  </div>
                  {form.discount > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600 font-medium">-{formatPeso(form.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-orange-200">
                    <span>Total</span>
                    <span className="text-brand-orange">{formatPeso(total)}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-gray-900">Review & Send</h2>
                <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-medium">{form.customerName || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium capitalize">{form.destination || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Dates</span><span className="font-medium">{form.dateFrom && form.dateTo ? `${form.dateFrom} – ${form.dateTo}` : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Pax</span><span className="font-medium">{form.paxAdults} adults, {form.paxChildren} children</span></div>
                  <div className="flex justify-between border-t pt-3"><span className="font-bold">Total Amount</span><span className="font-bold text-brand-orange text-base">{formatPeso(total)}</span></div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => step < 4 ? setStep(s => s + 1) : undefined}
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-orange rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
              >
                {step === 4 ? 'Send Quotation' : 'Next'}
              </button>
            </div>
          </AdminCard>
        </div>

        {/* Pricing sidebar */}
        <div className="space-y-4">
          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-3">Quote Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium truncate max-w-[120px]">{form.customerName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination</span>
                <span className="font-medium capitalize">{form.destination || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pax</span>
                <span className="font-medium">{form.paxAdults + form.paxChildren}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-orange">{formatPeso(total)}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="font-heading text-sm font-semibold text-gray-700 mb-2">Tips</h3>
            <ul className="text-xs text-gray-500 space-y-1.5 list-disc list-inside">
              <li>Include all inclusions and exclusions</li>
              <li>Set a validity date (usually 5–7 days)</li>
              <li>Double check pricing before sending</li>
            </ul>
          </AdminCard>
        </div>
      </div>
    </motion.div>
  )
}
