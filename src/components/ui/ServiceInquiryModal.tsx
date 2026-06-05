import { useState, useEffect } from 'react'
import { createPortal }        from 'react-dom'
import { X, ChevronDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion }              from 'framer-motion'
import emailjs                 from '@emailjs/browser'
import { CONTACT }             from '@data/contact'
import { packages as tourPackages } from '@data/packages'

// ─── Types ────────────────────────────────────────────────────────────────────
export type InquiryType = 'visa' | 'tourPackage' | 'airline'
type Status = 'idle' | 'loading' | 'success' | 'error'

interface ModalProps {
  type: InquiryType
  onClose: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TITLE: Record<InquiryType, string> = {
  visa:        'Visa Assistance Inquiry',
  tourPackage: 'Tour Package Inquiry',
  airline:     'Airline Tickets Inquiry',
}

const VISA_TYPES  = ['Tourism', 'Business']
const INT_DESTS   = ['Hong Kong', 'Vietnam', 'China', 'Europe (Schengen)', 'Japan', 'Thailand', 'South Korea', 'Dubai']
const DOM_DESTS   = ['Boracay', 'El Nido', 'Puerto Prinsesa', 'Bohol', 'Cebu', 'Batanes']

// EmailJS credentials (same as Contact form)
const SVC  = 'service_ast3kud'
const T_IN = 'template_h4dpk4n'   // to AND Travel inbox
const T_AR = 'template_4dfgksp'   // auto-reply to visitor
const PUB  = '11QeIgaaMj6kvVtNa'

// ─── Shared input / select styles ─────────────────────────────────────────────
const ic = [
  'w-full bg-transparent border-b border-gray-300',
  'py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
  'focus:outline-none focus:border-gray-800 transition-colors',
].join(' ')

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function Lbl({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-bold text-gray-900 mb-1.5">{children}</p>
}

function Sel({ children, value, onChange, placeholder }: {
  children: React.ReactNode
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className={ic + ' appearance-none cursor-pointer pr-6'}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}

function ErrorMsg({ onRetry }: { onRetry?: () => void }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-3">
      <AlertCircle size={13} aria-hidden="true" />
      Something went wrong.{' '}
      {onRetry && (
        <button type="button" onClick={onRetry} className="underline">
          Try again
        </button>
      )}{' '}
      or{' '}
      <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" className="underline">
        message us on Messenger
      </a>.
    </p>
  )
}

function SubmitBtn({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-6 w-full py-3.5 rounded-xl bg-brand-black text-white text-sm font-semibold
                 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150
                 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…</>
      ) : (
        'Submit Inquiry'
      )}
    </button>
  )
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-12 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-500" aria-hidden="true" />
        </div>
        <span className="absolute -top-1 -right-1 text-xl">✈️</span>
      </div>
      <div>
        <h3 className="font-heading font-bold text-lg text-brand-black mb-1">Inquiry Sent!</h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          Thank you! We received your inquiry and will reach out within{' '}
          <strong className="text-brand-black">24 hours</strong>.
        </p>
      </div>
      <p className="text-brand-orange text-xs font-semibold italic px-4 py-2 bg-orange-50 rounded-full border border-brand-orange/20">
        Your Journey, Our Priority
      </p>
      <button
        onClick={onClose}
        className="text-xs text-gray-400 underline underline-offset-2 hover:text-brand-orange transition-colors"
      >
        Close
      </button>
    </div>
  )
}

// ─── Visa Assistance Form ─────────────────────────────────────────────────────
function VisaForm({ onSuccess }: { onSuccess: () => void }) {
  const [f, setF] = useState({
    visaType: '', destination: '', pax: '',
    name: '', phone: '', email: '', message: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const payload = {
        name:    f.name,
        phone:   f.phone,
        email:   f.email,
        service: `Visa Assistance — ${f.visaType} — ${f.destination} (${f.pax} pax)`,
        message: [
          `Visa Type: ${f.visaType}`,
          `Destination: ${f.destination}`,
          `No. of Pax: ${f.pax}`,
          `Name: ${f.name}`,
          `Phone: ${f.phone}`,
          `Email: ${f.email}`,
          f.message ? `Message: ${f.message}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      }
      await emailjs.send(SVC, T_IN, payload, PUB)
      await emailjs.send(SVC, T_AR, payload, PUB)
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {/* Visa Type */}
      <div>
        <Lbl>Visa Type</Lbl>
        <Sel value={f.visaType} onChange={v => u('visaType', v)} placeholder="Which do you wish to obtain?">
          {VISA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Sel>
      </div>

      {/* Destination */}
      <div>
        <Lbl>Destination</Lbl>
        <Sel value={f.destination} onChange={v => u('destination', v)} placeholder="Where do you want to go?">
          <optgroup label="International">
            {INT_DESTS.map(d => <option key={d} value={d}>{d}</option>)}
          </optgroup>
          <optgroup label="Domestic">
            {DOM_DESTS.map(d => <option key={d} value={d}>{d}</option>)}
          </optgroup>
          <optgroup label="Other">
            <option value="Others">Others</option>
          </optgroup>
        </Sel>
      </div>

      {/* Pax */}
      <div>
        <Lbl>Number of Pax</Lbl>
        <input
          type="number" min="1" placeholder="0" required
          value={f.pax} onChange={e => u('pax', e.target.value)}
          className={ic + ' w-36'}
        />
      </div>

      {/* Contact */}
      <div>
        <Lbl>Full Name</Lbl>
        <input type="text" placeholder="Your full name" required
          value={f.name} onChange={e => u('name', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Mobile Number</Lbl>
        <input type="tel" placeholder="(+63 917 456 7890)" required
          value={f.phone} onChange={e => u('phone', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Email Address</Lbl>
        <input type="email" placeholder="Your email address" required
          value={f.email} onChange={e => u('email', e.target.value)} className={ic} />
      </div>

      {/* Message */}
      <div>
        <Lbl>Message</Lbl>
        <textarea
          rows={3} placeholder="For better assistance, please provide more information."
          value={f.message} onChange={e => u('message', e.target.value)}
          className={ic + ' resize-none'}
        />
      </div>

      {status === 'error' && <ErrorMsg onRetry={() => setStatus('idle')} />}
      <SubmitBtn loading={status === 'loading'} />
    </form>
  )
}

// ─── Tour Package Form ────────────────────────────────────────────────────────
function TourPackageForm({ onSuccess }: { onSuccess: () => void }) {
  const [f, setF] = useState({
    pkg: '', dateFrom: '', dateTo: '', pax: '',
    name: '', phone: '', email: '', details: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const dateRange = [f.dateFrom, f.dateTo].filter(Boolean).join(' → ') || 'Not specified'
      const payload = {
        name:    f.name,
        phone:   f.phone,
        email:   f.email,
        service: `Tour Package — ${f.pkg} (${f.pax} pax)`,
        message: [
          `Package: ${f.pkg}`,
          `Travel Date: ${dateRange}`,
          `No. of Pax: ${f.pax}`,
          `Name: ${f.name}`,
          `Phone: ${f.phone}`,
          `Email: ${f.email}`,
          f.details ? `Details: ${f.details}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      }
      await emailjs.send(SVC, T_IN, payload, PUB)
      await emailjs.send(SVC, T_AR, payload, PUB)
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {/* Package */}
      <div>
        <Lbl>What tour package are you interested in?</Lbl>
        <Sel value={f.pkg} onChange={v => u('pkg', v)} placeholder="Select a package">
          {tourPackages.map(p => (
            <option key={p.id} value={p.title}>{p.title}</option>
          ))}
        </Sel>
      </div>

      {/* Travel Date */}
      <div>
        <Lbl>Preferred Travel Date</Lbl>
        <Row>
          <input type="date" value={f.dateFrom} onChange={e => u('dateFrom', e.target.value)} className={ic} />
          <input type="date" value={f.dateTo}   onChange={e => u('dateTo', e.target.value)}   className={ic} />
        </Row>
      </div>

      {/* Pax */}
      <div>
        <Lbl>Pax</Lbl>
        <input type="number" min="1" placeholder="0" required
          value={f.pax} onChange={e => u('pax', e.target.value)}
          className={ic + ' w-36'} />
      </div>

      {/* Contact */}
      <div>
        <Lbl>Full Name</Lbl>
        <input type="text" placeholder="Your full name" required
          value={f.name} onChange={e => u('name', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Mobile Number</Lbl>
        <input type="tel" placeholder="(+63 917 456 7890)" required
          value={f.phone} onChange={e => u('phone', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Email Address</Lbl>
        <input type="email" placeholder="Your email address" required
          value={f.email} onChange={e => u('email', e.target.value)} className={ic} />
      </div>

      {/* Details */}
      <div>
        <Lbl>Additional Details</Lbl>
        <textarea rows={3} placeholder="Tell us more about your inquiry."
          value={f.details} onChange={e => u('details', e.target.value)}
          className={ic + ' resize-none'} />
      </div>

      {status === 'error' && <ErrorMsg onRetry={() => setStatus('idle')} />}
      <SubmitBtn loading={status === 'loading'} />
    </form>
  )
}

// ─── Airline Tickets Form ─────────────────────────────────────────────────────
function AirlineForm({ onSuccess }: { onSuccess: () => void }) {
  const [f, setF] = useState({
    origin: '', destination: '', dateFrom: '', dateTo: '', pax: '',
    name: '', phone: '', email: '', message: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const u = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const dateRange = [f.dateFrom, f.dateTo].filter(Boolean).join(' → ') || 'Not specified'
      const payload = {
        name:    f.name,
        phone:   f.phone,
        email:   f.email,
        service: `Airline Tickets — ${f.origin} → ${f.destination} (${f.pax} pax)`,
        message: [
          `Origin: ${f.origin}`,
          `Destination: ${f.destination}`,
          `Travel Date: ${dateRange}`,
          `No. of Pax: ${f.pax}`,
          `Name: ${f.name}`,
          `Phone: ${f.phone}`,
          `Email: ${f.email}`,
          f.message ? `Message: ${f.message}` : '',
        ].filter(Boolean).join('\n'),
        time: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      }
      await emailjs.send(SVC, T_IN, payload, PUB)
      await emailjs.send(SVC, T_AR, payload, PUB)
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {/* Origin + Destination */}
      <Row>
        <div>
          <Lbl>Origin</Lbl>
          <input type="text" placeholder="Your origin" required
            value={f.origin} onChange={e => u('origin', e.target.value)} className={ic} />
        </div>
        <div>
          <Lbl>Destination</Lbl>
          <input type="text" placeholder="Your destination" required
            value={f.destination} onChange={e => u('destination', e.target.value)} className={ic} />
        </div>
      </Row>

      {/* Travel Date */}
      <div>
        <Lbl>Preferred Travel Date</Lbl>
        <Row>
          <input type="date" value={f.dateFrom} onChange={e => u('dateFrom', e.target.value)} className={ic} />
          <input type="date" value={f.dateTo}   onChange={e => u('dateTo', e.target.value)}   className={ic} />
        </Row>
      </div>

      {/* Pax */}
      <div>
        <Lbl>Pax</Lbl>
        <input type="number" min="1" placeholder="0" required
          value={f.pax} onChange={e => u('pax', e.target.value)}
          className={ic + ' w-36'} />
      </div>

      {/* Contact */}
      <div>
        <Lbl>Full Name</Lbl>
        <input type="text" placeholder="Your full name" required
          value={f.name} onChange={e => u('name', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Mobile Number</Lbl>
        <input type="tel" placeholder="(+63 917 456 7890)" required
          value={f.phone} onChange={e => u('phone', e.target.value)} className={ic} />
      </div>
      <div>
        <Lbl>Email Address</Lbl>
        <input type="email" placeholder="Your email address" required
          value={f.email} onChange={e => u('email', e.target.value)} className={ic} />
      </div>

      {/* Message */}
      <div>
        <Lbl>Message</Lbl>
        <textarea rows={3} placeholder="For better assistance, please provide more information."
          value={f.message} onChange={e => u('message', e.target.value)}
          className={ic + ' resize-none'} />
      </div>

      {status === 'error' && <ErrorMsg onRetry={() => setStatus('idle')} />}
      <SubmitBtn loading={status === 'loading'} />
    </form>
  )
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
export function ServiceInquiryModal({ type, onClose }: ModalProps) {
  const [success, setSuccess] = useState(false)

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet — slides up from bottom on all screen sizes, centered on sm+ */}
      <div className="fixed inset-0 z-[301] flex items-end sm:items-center justify-center pointer-events-none">
        <motion.div
          key="modal-panel"
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 48, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="pointer-events-auto w-full sm:max-w-md bg-white
                     rounded-t-3xl sm:rounded-2xl shadow-card-lg
                     max-h-[92vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={TITLE[type]}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-semibold text-gray-500 font-heading">
              {TITLE[type]}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close inquiry form"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            {success ? (
              <SuccessView onClose={onClose} />
            ) : (
              <>
                {type === 'visa'        && <VisaForm        onSuccess={() => setSuccess(true)} />}
                {type === 'tourPackage' && <TourPackageForm onSuccess={() => setSuccess(true)} />}
                {type === 'airline'     && <AirlineForm     onSuccess={() => setSuccess(true)} />}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>,
    document.body
  )
}
