import { useState, useEffect }       from 'react'
import { motion, AnimatePresence }    from 'framer-motion'
import {
  Phone, Mail, MapPin, Share2, MessageCircle,
  Send, CheckCircle, AlertCircle, Loader2, ArrowRight,
  ClipboardList, PhoneCall, Sparkles,
  Map, Globe2, Plane, MessageSquare,
} from 'lucide-react'
import { SectionHeader }  from '@ui/SectionHeader'
import { BrandLogo }      from '@ui/BrandLogo'
import { LocalQRCode }    from '@ui/LocalQRCode'
import { CONTACT }        from '@data/contact'
import {
  fadeLeftVariants, fadeRightVariants,
  fadeUpVariants, staggerContainer, cardVariants, defaultViewport,
} from '@lib/animations'

// ─── Constants ────────────────────────────────────────────────────────────────
const INT_DESTS = [
  'Hong Kong', 'Vietnam', 'China', 'Europe (Schengen)',
  'Japan', 'Thailand', 'South Korea', 'Dubai',
]
const GENERAL_SERVICES = [
  'Hotel Reservations', 'Group & Corporate Travel', 'Other / Not Sure Yet',
]

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'tourPackage' as const, label: 'Tour Package',    short: 'Tours',   Icon: Map           },
  { id: 'visa'        as const, label: 'Visa Assistance', short: 'Visa',    Icon: Globe2        },
  { id: 'airline'     as const, label: 'Airline Tickets', short: 'Flights', Icon: Plane         },
  { id: 'general'     as const, label: 'General Inquiry', short: 'General', Icon: MessageSquare },
]
type TabType = typeof TABS[number]['id']

// ─── "What happens next" steps ────────────────────────────────────────────────
const STEPS = [
  { icon: ClipboardList, num: '01', title: 'Submit Your Inquiry',
    desc: 'Fill in the form with your travel details — destination, group size, and budget.' },
  { icon: PhoneCall,     num: '02', title: "We'll Reach Out",
    desc: 'Our travel expert contacts you within 24 hours to discuss your options.' },
  { icon: Sparkles,      num: '03', title: 'Plan Your Dream Trip',
    desc: 'Receive a personalized itinerary and package crafted just for you. Then just enjoy!' },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────
type Status = 'idle' | 'loading' | 'success' | 'error'

function ic(err?: boolean) {
  return [
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 text-sm font-medium',
    'placeholder:text-gray-400 placeholder:font-normal transition-all duration-150 outline-none',
    'focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
    err ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300',
  ].join(' ')
}

function Fld({ label, id, error, required = true, half, children }: {
  label: string; id: string; error?: string; required?: boolean
  half?: boolean; children: React.ReactNode
}) {
  return (
    <div className={half ? 'sm:col-span-1' : ''}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5 leading-none">
        {label}{required && <span className="text-brand-orange ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium">
          <AlertCircle size={11} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}

function SubmitBtn({ loading, label = 'Send My Inquiry' }: { loading: boolean; label?: string }) {
  return (
    <button type="submit" disabled={loading}
      className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 mt-2
                 rounded-xl font-bold text-base text-white bg-brand-orange hover:bg-orange-600
                 transition-all duration-200 shadow-orange active:scale-[0.98]
                 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden">
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                       -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      {loading
        ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…</>
        : <><Send size={17} aria-hidden="true" />{label}<ArrowRight size={17} className="ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" /></>}
    </button>
  )
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center py-12 px-4 gap-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <span className="absolute -top-1 -right-1 text-2xl">✈️</span>
      </div>
      <div>
        <h4 className="text-xl font-bold text-brand-black font-heading mb-2">Inquiry Sent!</h4>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          Thank you! We received your message and will reach out within{' '}
          <strong className="text-brand-black">24 hours</strong>.
        </p>
      </div>
      <span className="px-4 py-2 bg-orange-50 rounded-full border border-brand-orange/20 text-brand-orange text-xs font-semibold italic">
        Your Journey, Our Priority
      </span>
      <button onClick={onReset}
        className="text-xs text-gray-400 underline underline-offset-2 hover:text-brand-orange transition-colors">
        Send another message
      </button>
    </motion.div>
  )
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm text-red-700 font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-2"
      role="alert">
      <AlertCircle size={15} aria-hidden="true" />
      Something went wrong.{' '}
      <button onClick={onRetry} className="underline font-bold">Try again</button>
      {' '}or{' '}
      <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" className="underline font-bold">
        message us on Messenger
      </a>.
    </motion.p>
  )
}

async function sendEmail(payload: Record<string, string>) {
  const res = await fetch('/api/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Email send failed')
}

// ─── Tour Package Form ────────────────────────────────────────────────────────
function TourPackageForm() {
  const [f, setF] = useState({ pkg: '', dateFrom: '', dateTo: '', pax: '', name: '', phone: '', email: '', details: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => {
    setF(p => ({ ...p, [k]: v }))
    if (err[k]) setErr(p => { const n = { ...p }; delete n[k]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!f.pkg)          e.pkg   = 'Please select a package type'
    if (!f.pax)          e.pax   = 'Number of pax is required'
    if (!f.name.trim())  e.name  = 'Full name is required'
    if (!f.phone.trim()) e.phone = 'Phone number is required'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email is required'
    return e
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(); if (Object.keys(errs).length) { setErr(errs); return }
    setStatus('loading')
    try {
      await sendEmail({
        name: f.name, phone: f.phone, email: f.email,
        service: `Tour Package — ${f.pkg}`,
        message: [
          `Package: ${f.pkg}`,
          f.dateFrom ? `Travel Date: ${f.dateFrom} → ${f.dateTo || 'TBD'}` : '',
          `No. of Pax: ${f.pax}`,
          f.details ? `Details: ${f.details}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      })
      setStatus('success')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <SuccessCard onReset={() => setStatus('idle')} />

  return (
    <form onSubmit={submit} noValidate className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Fld label="Tour Package" id="pkg" error={err.pkg}>
          <select id="pkg" value={f.pkg} onChange={e => u('pkg', e.target.value)} className={ic(!!err.pkg) + ' cursor-pointer'}>
            <option value="">Select a package…</option>
            <option value="Roundtrip airfare">Roundtrip airfare</option>
            <option value="Hotel accommodation">Hotel accommodation</option>
            <option value="Airport transfers">Airport transfers</option>
            <option value="Tours and sightseeing">Tours and sightseeing</option>
            <option value="Travel insurance (if applicable)">Travel insurance (if applicable)</option>
            <option value="Meals (depending on the package)">Meals (depending on the package)</option>
          </select>
        </Fld>
      </div>

      <Fld label="Travel Date (From)" id="dateFrom" error={err.dateFrom} required={false}>
        <input id="dateFrom" type="date" value={f.dateFrom} onChange={e => u('dateFrom', e.target.value)} className={ic()} />
      </Fld>
      <Fld label="Travel Date (To)" id="dateTo" error={err.dateTo} required={false}>
        <input id="dateTo" type="date" value={f.dateTo} onChange={e => u('dateTo', e.target.value)} className={ic()} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Number of Pax" id="pax" error={err.pax}>
          <input id="pax" type="number" min="1" placeholder="e.g. 2" value={f.pax} onChange={e => u('pax', e.target.value)} className={ic(!!err.pax) + ' sm:w-40'} />
        </Fld>
      </div>

      <Fld label="Full Name" id="name" error={err.name}>
        <input id="name" type="text" placeholder="e.g. Maria Santos" autoComplete="name" value={f.name} onChange={e => u('name', e.target.value)} className={ic(!!err.name)} />
      </Fld>
      <Fld label="Mobile Number" id="phone" error={err.phone}>
        <input id="phone" type="tel" placeholder="e.g. 09159234547" autoComplete="tel" value={f.phone} onChange={e => u('phone', e.target.value)} className={ic(!!err.phone)} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Email Address" id="email" error={err.email}>
          <input id="email" type="email" placeholder="e.g. maria@gmail.com" autoComplete="email" value={f.email} onChange={e => u('email', e.target.value)} className={ic(!!err.email)} />
        </Fld>
      </div>

      <div className="sm:col-span-2">
        <Fld label="Additional Details" id="details" error={err.details} required={false}>
          <textarea id="details" rows={3} placeholder="Tell us more about your inquiry — preferred activities, room type, special requests…"
            value={f.details} onChange={e => u('details', e.target.value)} className={ic() + ' resize-none'} />
        </Fld>
      </div>

      {status === 'error' && <div className="sm:col-span-2"><ErrorBanner onRetry={() => setStatus('idle')} /></div>}
      <div className="sm:col-span-2"><SubmitBtn loading={status === 'loading'} /></div>
    </form>
  )
}

// ─── Visa Assistance Form ─────────────────────────────────────────────────────
function VisaForm() {
  const [f, setF] = useState({ visaType: '', destination: '', pax: '', name: '', phone: '', email: '', message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => {
    setF(p => ({ ...p, [k]: v }))
    if (err[k]) setErr(p => { const n = { ...p }; delete n[k]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!f.visaType)     e.visaType     = 'Please select a visa type'
    if (!f.destination)  e.destination  = 'Please select a destination'
    if (!f.pax)          e.pax          = 'Number of pax is required'
    if (!f.name.trim())  e.name         = 'Full name is required'
    if (!f.phone.trim()) e.phone        = 'Phone number is required'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email is required'
    return e
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(); if (Object.keys(errs).length) { setErr(errs); return }
    setStatus('loading')
    try {
      await sendEmail({
        name: f.name, phone: f.phone, email: f.email,
        service: `Visa Assistance — ${f.visaType} — ${f.destination}`,
        message: [
          `Visa Type: ${f.visaType}`,
          `Destination: ${f.destination}`,
          `No. of Pax: ${f.pax}`,
          f.message ? `Notes: ${f.message}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      })
      setStatus('success')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <SuccessCard onReset={() => setStatus('idle')} />

  return (
    <form onSubmit={submit} noValidate className="grid sm:grid-cols-2 gap-4">
      <Fld label="Visa Type" id="visaType" error={err.visaType}>
        <select id="visaType" value={f.visaType} onChange={e => u('visaType', e.target.value)} className={ic(!!err.visaType) + ' cursor-pointer'}>
          <option value="">Which do you wish to obtain?</option>
          <option value="Tourism">Tourism</option>
          <option value="Business">Business</option>
        </select>
      </Fld>

      <Fld label="Destination" id="destination" error={err.destination}>
        <select id="destination" value={f.destination} onChange={e => u('destination', e.target.value)} className={ic(!!err.destination) + ' cursor-pointer'}>
          <option value="">Where do you want to go?</option>
          <optgroup label="International">
            {INT_DESTS.map(d => <option key={d} value={d}>{d}</option>)}
          </optgroup>
          <optgroup label="Other">
            <option value="Others">Others</option>
          </optgroup>
        </select>
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Number of Pax" id="pax" error={err.pax}>
          <input id="pax" type="number" min="1" placeholder="e.g. 2" value={f.pax} onChange={e => u('pax', e.target.value)} className={ic(!!err.pax) + ' sm:w-40'} />
        </Fld>
      </div>

      <Fld label="Full Name" id="name" error={err.name}>
        <input id="name" type="text" placeholder="e.g. Maria Santos" autoComplete="name" value={f.name} onChange={e => u('name', e.target.value)} className={ic(!!err.name)} />
      </Fld>
      <Fld label="Mobile Number" id="phone" error={err.phone}>
        <input id="phone" type="tel" placeholder="e.g. 09159234547" autoComplete="tel" value={f.phone} onChange={e => u('phone', e.target.value)} className={ic(!!err.phone)} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Email Address" id="email" error={err.email}>
          <input id="email" type="email" placeholder="e.g. maria@gmail.com" autoComplete="email" value={f.email} onChange={e => u('email', e.target.value)} className={ic(!!err.email)} />
        </Fld>
      </div>

      <div className="sm:col-span-2">
        <Fld label="Message" id="message" error={err.message} required={false}>
          <textarea id="message" rows={3} placeholder="For better assistance, please provide more information about your travel plans."
            value={f.message} onChange={e => u('message', e.target.value)} className={ic() + ' resize-none'} />
        </Fld>
      </div>

      {status === 'error' && <div className="sm:col-span-2"><ErrorBanner onRetry={() => setStatus('idle')} /></div>}
      <div className="sm:col-span-2"><SubmitBtn loading={status === 'loading'} /></div>
    </form>
  )
}

// ─── Airline Tickets Form ─────────────────────────────────────────────────────
function AirlineForm() {
  const [f, setF] = useState({ origin: '', dest: '', dateFrom: '', dateTo: '', pax: '', name: '', phone: '', email: '', message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => {
    setF(p => ({ ...p, [k]: v }))
    if (err[k]) setErr(p => { const n = { ...p }; delete n[k]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!f.origin.trim()) e.origin = 'Origin is required'
    if (!f.dest.trim())   e.dest   = 'Destination is required'
    if (!f.pax)           e.pax    = 'Number of pax is required'
    if (!f.name.trim())   e.name   = 'Full name is required'
    if (!f.phone.trim())  e.phone  = 'Phone number is required'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email is required'
    return e
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(); if (Object.keys(errs).length) { setErr(errs); return }
    setStatus('loading')
    try {
      await sendEmail({
        name: f.name, phone: f.phone, email: f.email,
        service: `Airline Tickets — ${f.origin} → ${f.dest}`,
        message: [
          `Route: ${f.origin} → ${f.dest}`,
          f.dateFrom ? `Travel Date: ${f.dateFrom} → ${f.dateTo || 'TBD'}` : '',
          `No. of Pax: ${f.pax}`,
          f.message ? `Notes: ${f.message}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      })
      setStatus('success')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <SuccessCard onReset={() => setStatus('idle')} />

  return (
    <form onSubmit={submit} noValidate className="grid sm:grid-cols-2 gap-4">
      <Fld label="Origin" id="origin" error={err.origin}>
        <input id="origin" type="text" placeholder="e.g. Manila" value={f.origin} onChange={e => u('origin', e.target.value)} className={ic(!!err.origin)} />
      </Fld>
      <Fld label="Destination" id="dest" error={err.dest}>
        <input id="dest" type="text" placeholder="e.g. Tokyo" value={f.dest} onChange={e => u('dest', e.target.value)} className={ic(!!err.dest)} />
      </Fld>

      <Fld label="Travel Date (From)" id="dateFrom" error={err.dateFrom} required={false}>
        <input id="dateFrom" type="date" value={f.dateFrom} onChange={e => u('dateFrom', e.target.value)} className={ic()} />
      </Fld>
      <Fld label="Travel Date (To)" id="dateTo" error={err.dateTo} required={false}>
        <input id="dateTo" type="date" value={f.dateTo} onChange={e => u('dateTo', e.target.value)} className={ic()} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Number of Pax" id="pax" error={err.pax}>
          <input id="pax" type="number" min="1" placeholder="e.g. 2" value={f.pax} onChange={e => u('pax', e.target.value)} className={ic(!!err.pax) + ' sm:w-40'} />
        </Fld>
      </div>

      <Fld label="Full Name" id="name" error={err.name}>
        <input id="name" type="text" placeholder="e.g. Maria Santos" autoComplete="name" value={f.name} onChange={e => u('name', e.target.value)} className={ic(!!err.name)} />
      </Fld>
      <Fld label="Mobile Number" id="phone" error={err.phone}>
        <input id="phone" type="tel" placeholder="e.g. 09159234547" autoComplete="tel" value={f.phone} onChange={e => u('phone', e.target.value)} className={ic(!!err.phone)} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Email Address" id="email" error={err.email}>
          <input id="email" type="email" placeholder="e.g. maria@gmail.com" autoComplete="email" value={f.email} onChange={e => u('email', e.target.value)} className={ic(!!err.email)} />
        </Fld>
      </div>

      <div className="sm:col-span-2">
        <Fld label="Message" id="message" error={err.message} required={false}>
          <textarea id="message" rows={3} placeholder="For better assistance, please provide more information."
            value={f.message} onChange={e => u('message', e.target.value)} className={ic() + ' resize-none'} />
        </Fld>
      </div>

      {status === 'error' && <div className="sm:col-span-2"><ErrorBanner onRetry={() => setStatus('idle')} /></div>}
      <div className="sm:col-span-2"><SubmitBtn loading={status === 'loading'} /></div>
    </form>
  )
}

// ─── General Inquiry Form ─────────────────────────────────────────────────────
function GeneralForm() {
  const [f, setF] = useState({ service: '', name: '', phone: '', email: '', message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => {
    setF(p => ({ ...p, [k]: v }))
    if (err[k]) setErr(p => { const n = { ...p }; delete n[k]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!f.service)      e.service = 'Please select a service'
    if (!f.name.trim())  e.name    = 'Full name is required'
    if (!f.phone.trim()) e.phone   = 'Phone number is required'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email is required'
    if (!f.message.trim())              e.message = 'Please tell us about your inquiry'
    else if (f.message.trim().length < 10) e.message = 'Give us a little more detail'
    return e
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(); if (Object.keys(errs).length) { setErr(errs); return }
    setStatus('loading')
    try {
      await sendEmail({
        name: f.name, phone: f.phone, email: f.email,
        service: f.service,
        message: f.message,
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      })
      setStatus('success')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <SuccessCard onReset={() => setStatus('idle')} />

  return (
    <form onSubmit={submit} noValidate className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Fld label="Service / Inquiry Type" id="service" error={err.service}>
          <select id="service" value={f.service} onChange={e => u('service', e.target.value)} className={ic(!!err.service) + ' cursor-pointer'}>
            <option value="">What can we help you with?</option>
            {GENERAL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Fld>
      </div>

      <Fld label="Full Name" id="name" error={err.name}>
        <input id="name" type="text" placeholder="e.g. Maria Santos" autoComplete="name" value={f.name} onChange={e => u('name', e.target.value)} className={ic(!!err.name)} />
      </Fld>
      <Fld label="Mobile Number" id="phone" error={err.phone}>
        <input id="phone" type="tel" placeholder="e.g. 09159234547" autoComplete="tel" value={f.phone} onChange={e => u('phone', e.target.value)} className={ic(!!err.phone)} />
      </Fld>

      <div className="sm:col-span-2">
        <Fld label="Email Address" id="email" error={err.email}>
          <input id="email" type="email" placeholder="e.g. maria@gmail.com" autoComplete="email" value={f.email} onChange={e => u('email', e.target.value)} className={ic(!!err.email)} />
        </Fld>
      </div>

      <div className="sm:col-span-2">
        <Fld label="Your Message / Inquiry" id="message" error={err.message}>
          <textarea id="message" rows={4} placeholder="Tell us about your trip — destination, number of travellers, budget, any special requests…"
            value={f.message} onChange={e => u('message', e.target.value)} className={ic(!!err.message) + ' resize-none'} />
        </Fld>
      </div>

      {status === 'error' && <div className="sm:col-span-2"><ErrorBanner onRetry={() => setStatus('idle')} /></div>}
      <div className="sm:col-span-2"><SubmitBtn loading={status === 'loading'} label="Send My Inquiry" /></div>
    </form>
  )
}

// ─── Tabbed Form Card ─────────────────────────────────────────────────────────
function TabbedForm() {
  const [activeTab, setActiveTab] = useState<TabType>('tourPackage')

  // Service cards can pre-select a tab via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail as TabType
      if (TABS.some(t => t.id === tab)) setActiveTab(tab)
    }
    window.addEventListener('and-travel:select-tab', handler)
    return () => window.removeEventListener('and-travel:select-tab', handler)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">

      {/* Card header */}
      <div className="bg-brand-black px-7 py-5 flex items-center gap-5">
        <BrandLogo height={42} variant="light" />
        <div className="border-l border-white/20 pl-5">
          <h3 className="text-white font-bold text-lg font-heading leading-tight">Send Us a Message</h3>
          <p className="text-white/55 text-xs mt-0.5">We'll reply within 24 hours</p>
        </div>
      </div>

      {/* Tab bar — segmented control style */}
      <div className="px-5 pt-5">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl" role="tablist" aria-label="Inquiry type">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-colors duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.38 }}
                />
              )}
              <tab.Icon
                size={14}
                aria-hidden="true"
                className={activeTab === tab.id ? 'text-brand-orange' : 'text-gray-400'}
              />
              <span className={[
                'hidden sm:inline',
                activeTab === tab.id ? 'text-brand-orange' : 'text-gray-500',
              ].join(' ')}>
                {tab.label}
              </span>
              <span className={[
                'sm:hidden',
                activeTab === tab.id ? 'text-brand-orange' : 'text-gray-500',
              ].join(' ')}>
                {tab.short}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form content — animated swap between tabs */}
      <div className="px-7 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'tourPackage' && <TourPackageForm />}
            {activeTab === 'visa'        && <VisaForm />}
            {activeTab === 'airline'     && <AirlineForm />}
            {activeTab === 'general'     && <GeneralForm />}
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 text-center text-xs text-gray-400">
          We typically reply within 24 hours ·{' '}
          <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer"
            className="text-brand-orange font-semibold hover:underline">
            Chat on Messenger
          </a>{' '}
          for a faster response
        </p>
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function Contact() {
  return (
    <section id="contact" className="bg-gray-50">
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <SectionHeader
            eyebrow="Get In Touch"
            title="We'd Love to Hear From You"
            subtitle="Choose your inquiry type below — our travel experts will get back to you within 24 hours."
          />

          <div className="grid lg:grid-cols-2 gap-6 mb-6">

            {/* ── LEFT: Contact Info ── */}
            <motion.div
              variants={fadeLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-brand-black rounded-2xl p-8 text-white flex flex-col gap-6"
            >
              <h3 className="font-bold text-xl font-heading">Contact Information</h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={16} className="text-brand-orange" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white/45 text-xs mb-0.5 uppercase tracking-wider">Phone</p>
                    <a href={CONTACT.phoneTel} className="text-white text-sm font-semibold hover:text-brand-orange transition-colors">{CONTACT.phoneFormatted}</a>
                    <a href={CONTACT.phone2Tel} className="text-white text-sm font-semibold hover:text-brand-orange transition-colors">{CONTACT.phone2Formatted}</a>
                  </div>
                </div>

                <a href={CONTACT.emailHref} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors duration-200">
                    <Mail size={16} className="text-brand-orange group-hover:text-white transition-colors" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Email</p>
                    <p className="text-white text-sm font-semibold group-hover:text-brand-orange transition-colors break-all">{CONTACT.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-orange" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Address</p>
                    <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{CONTACT.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10" />

              <div className="flex flex-col gap-3">
                <p className="text-white/45 text-xs uppercase tracking-widest">Connect With Us</p>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors">
                  <Share2 size={15} aria-hidden="true" /> A N D Travel and Tours — Facebook
                </a>
                <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors">
                  <MessageCircle size={15} aria-hidden="true" /> Chat with us on Messenger
                </a>
              </div>

              <div className="border-t border-white/10 pt-5 flex items-center gap-5">
                <div className="bg-white rounded-xl p-1.5 shrink-0">
                  <LocalQRCode size={80} />
                </div>
                <div>
                  <p className="text-white/45 text-xs uppercase tracking-wider mb-1">Scan to Connect</p>
                  <p className="text-white/80 text-xs leading-relaxed">Scan the QR code with your camera to open our Facebook page directly.</p>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-white/10">
                <p className="text-brand-gold italic text-sm font-medium">Your Journey, Our Priority</p>
              </div>
            </motion.div>

            {/* ── RIGHT: Tabbed Form ── */}
            <motion.div
              variants={fadeRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <TabbedForm />
            </motion.div>
          </div>

          {/* ── "What Happens Next" strip ── */}
          <motion.div
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid sm:grid-cols-3 gap-5"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isLast = i === STEPS.length - 1
              return (
                <motion.div key={step.num} variants={cardVariants}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex flex-col gap-4">
                  {!isLast && (
                    <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-brand-orange rounded-full items-center justify-center shadow-orange">
                      <ArrowRight size={12} className="text-white" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border-2 border-brand-orange/20 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-brand-orange" aria-hidden="true" />
                    </div>
                    <span className="text-3xl font-black font-heading text-gray-100 leading-none">{step.num}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-black text-base font-heading mb-1.5">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>

      {/* ── Full-width Map ── */}
      <motion.div
        variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={defaultViewport}
        style={{ height: '420px' }} className="w-full"
      >
        <iframe
          title="A N D Travel and Tours — Danarose Residences, Bacoor, Cavite"
          src={CONTACT.mapEmbed} width="100%" height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen loading="lazy" referrerPolicy="strict-origin"
        />
      </motion.div>
    </section>
  )
}
