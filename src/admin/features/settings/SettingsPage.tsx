import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Building, Palette, Mail, Shield, Bell,
  Save, ExternalLink,
} from 'lucide-react'
import { pageVariants, fadeVariants } from '@admin-lib/adminAnimations'
import { AdminCard } from '@admin-ui/AdminCard'
import { FormField, Input, Textarea, Select } from '@admin-forms/FormField'
import { cn } from '@lib/utils'

const TABS = [
  { id: 'general',   label: 'General',     icon: Building },
  { id: 'branding',  label: 'Branding',    icon: Palette },
  { id: 'email',     label: 'Email',       icon: Mail },
  { id: 'roles',     label: 'Roles',       icon: Shield },
  { id: 'notifications', label: 'Alerts',  icon: Bell },
] as const

type TabId = typeof TABS[number]['id']

// ─── Tab panels ────────────────────────────────────────────────────────────────
function GeneralSettings() {
  return (
    <div className="space-y-4">
      <AdminCard>
        <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Agency Information</h3>
        <div className="space-y-4">
          <FormField label="Agency Name" required>
            <Input defaultValue="A N D Travel and Tours" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Primary Phone">
              <Input defaultValue="+63 917 123 4567" />
            </FormField>
            <FormField label="Secondary Phone">
              <Input defaultValue="+63 999 876 5432" />
            </FormField>
          </div>
          <FormField label="Email Address">
            <Input type="email" defaultValue="info@andtraveltours.com" />
          </FormField>
          <FormField label="Office Address">
            <Textarea defaultValue="123 Travel St., Quezon City, Metro Manila, Philippines 1100" />
          </FormField>
          <FormField label="Website">
            <Input defaultValue="https://andtraveltours.com" />
          </FormField>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Business Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Currency">
            <Select
              defaultValue="PHP"
              options={[
                { label: 'Philippine Peso (PHP)', value: 'PHP' },
                { label: 'US Dollar (USD)', value: 'USD' },
              ]}
            />
          </FormField>
          <FormField label="Time Zone">
            <Select
              defaultValue="Asia/Manila"
              options={[
                { label: 'Asia/Manila (PHT)', value: 'Asia/Manila' },
                { label: 'UTC', value: 'UTC' },
              ]}
            />
          </FormField>
          <FormField label="Date Format">
            <Select
              defaultValue="MMM DD, YYYY"
              options={[
                { label: 'MMM DD, YYYY', value: 'MMM DD, YYYY' },
                { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
              ]}
            />
          </FormField>
          <FormField label="Quotation Validity (days)">
            <Input type="number" defaultValue={7} min={1} max={30} />
          </FormField>
        </div>
      </AdminCard>
    </div>
  )
}

function BrandingSettings() {
  return (
    <div className="space-y-4">
      <AdminCard>
        <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Brand Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Primary (Brand Orange)', value: '#F97316' },
            { label: 'Secondary (Brand Gold)', value: '#D4A017' },
            { label: 'Dark (Brand Black)', value: '#111111' },
          ].map(color => (
            <FormField key={color.label} label={color.label}>
              <div className="flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-xl">
                <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color.value }} />
                <span className="text-sm font-mono text-gray-700">{color.value}</span>
              </div>
            </FormField>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Color tokens are configured in tailwind.config.ts and index.css</p>
      </AdminCard>

      <AdminCard>
        <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Logo & Assets</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Current Logo</label>
            <div className="h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
              <span className="font-heading text-xl font-bold tracking-widest text-brand-orange">A N D</span>
            </div>
          </div>
          <FormField label="Favicon URL">
            <Input defaultValue="/favicon.ico" />
          </FormField>
        </div>
      </AdminCard>
    </div>
  )
}

function EmailSettings() {
  return (
    <div className="space-y-4">
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-semibold text-gray-800">EmailJS Configuration</h3>
          <a
            href="https://www.emailjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand-orange hover:underline"
          >
            <ExternalLink size={11} />
            EmailJS Dashboard
          </a>
        </div>
        <div className="space-y-3">
          <FormField label="Service ID">
            <Input defaultValue="service_ast3kud" />
          </FormField>
          <FormField label="Inquiry Template ID">
            <Input defaultValue="YOUR_TEMPLATE_ID" />
          </FormField>
          <FormField label="Public Key">
            <Input defaultValue="YOUR_PUBLIC_KEY" type="password" />
          </FormField>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
            ⚠️ EmailJS is currently stubbed with a fake delay. Activate by uncommenting the emailjs.send() call in Contact.tsx.
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Email Templates</h3>
        <div className="space-y-3">
          {[
            'Inquiry Confirmation',
            'Quotation Sent',
            'Booking Confirmation',
            'Payment Received',
            'Departure Reminder',
          ].map(template => (
            <div key={template} className="flex items-center justify-between px-3 py-2.5 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-gray-400" />
                <span className="text-sm text-gray-700">{template}</span>
              </div>
              <button className="text-xs text-brand-orange hover:underline font-medium">Edit</button>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}

function RolesSettings() {
  const roles = [
    { name: 'Super Admin',   slug: 'super_admin',   desc: 'Full system access. Can manage all data and settings.', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Administrator', slug: 'administrator',  desc: 'Full operational access. Cannot manage system settings.', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Consultant',    slug: 'consultant',     desc: 'Manage inquiries, customers, quotations. Read-only bookings.', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Staff',         slug: 'staff',          desc: 'Manage schedule and itinerary. Read-only access.', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  ]
  return (
    <AdminCard>
      <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Role Definitions</h3>
      <div className="space-y-3">
        {roles.map(r => (
          <div key={r.slug} className={cn('px-4 py-3.5 border rounded-xl', r.color)}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{r.name}</span>
              <button className="text-xs font-medium opacity-70 hover:opacity-100">Edit Permissions</button>
            </div>
            <p className="text-xs mt-1 opacity-75">{r.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Role permission editing coming in the next release.</p>
    </AdminCard>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    newInquiry:    true,
    quotationSent: true,
    bookingConf:   true,
    paymentDue:    true,
    guideConflict: true,
    systemAlerts:  false,
  })

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }))

  const items: { key: keyof typeof settings; label: string; desc: string }[] = [
    { key: 'newInquiry',    label: 'New Inquiry',       desc: 'When a new inquiry arrives via the website form' },
    { key: 'quotationSent', label: 'Quotation Sent',    desc: 'When a quotation is sent to a customer' },
    { key: 'bookingConf',   label: 'Booking Confirmed', desc: 'When a booking status changes to Confirmed' },
    { key: 'paymentDue',    label: 'Payment Due',       desc: 'When a balance payment is overdue' },
    { key: 'guideConflict', label: 'Guide Conflict',    desc: 'When two tours share the same guide on overlapping dates' },
    { key: 'systemAlerts',  label: 'System Alerts',     desc: 'Low-level system and error notifications' },
  ]

  return (
    <AdminCard>
      <h3 className="font-heading text-sm font-semibold text-gray-800 mb-4">Notification Preferences</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={cn(
                'relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0',
                settings[item.key] ? 'bg-brand-orange' : 'bg-gray-200'
              )}
              style={{ height: 22 }}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200',
                  settings[item.key] ? 'translate-x-4.5' : 'translate-x-0'
                )}
                style={{ width: 18, height: 18, transform: settings[item.key] ? 'translateX(18px)' : 'translateX(0)' }}
              />
            </button>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={22} className="text-brand-orange" />
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage agency configuration and preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
          {activeTab === 'general'       && <GeneralSettings />}
          {activeTab === 'branding'      && <BrandingSettings />}
          {activeTab === 'email'         && <EmailSettings />}
          {activeTab === 'roles'         && <RolesSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </motion.div>
      </AnimatePresence>

      {/* Save button (sticky at bottom for all tabs except notifications which has inline toggles) */}
      {activeTab !== 'notifications' && (
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">
            Discard Changes
          </button>
          <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-orange rounded-xl hover:bg-orange-600 shadow-orange">
            <Save size={14} />
            Save Settings
          </button>
        </div>
      )}
    </motion.div>
  )
}
