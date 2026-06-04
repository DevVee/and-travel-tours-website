import { useState }   from 'react'
import { motion }     from 'framer-motion'
import {
  Phone, Mail, MapPin, Share2, MessageCircle,
  Send, CheckCircle, AlertCircle, Loader2, ArrowRight,
  ClipboardList, PhoneCall, Sparkles,
} from 'lucide-react'
import { SectionHeader } from '@ui/SectionHeader'
import { BrandLogo }     from '@ui/BrandLogo'
import { LocalQRCode }   from '@ui/LocalQRCode'
import { CONTACT }       from '@data/contact'
import {
  fadeLeftVariants, fadeRightVariants,
  fadeUpVariants, staggerContainer, cardVariants, defaultViewport,
} from '@lib/animations'

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'idle' | 'loading' | 'success' | 'error'
interface FormState {
  name: string; phone: string; email: string; service: string; message: string; honeypot: string
}
const EMPTY: FormState = { name:'', phone:'', email:'', service:'', message:'', honeypot:'' }

const SERVICES = [
  'Domestic Tour Packages', 'International Tour Packages',
  'Airline Ticket Booking',  'Hotel Reservations',
  'Visa Assistance',         'Group & Corporate Travel', 'Other / Not Sure Yet',
]

// "What happens next" process steps — shown below the main grid
const STEPS = [
  {
    icon: ClipboardList,
    num: '01',
    title: 'Submit Your Inquiry',
    desc: 'Fill in the form with your travel details — destination, group size, and budget.',
  },
  {
    icon: PhoneCall,
    num: '02',
    title: "We'll Reach Out",
    desc: 'Our travel expert contacts you within 24 hours to discuss your options.',
  },
  {
    icon: Sparkles,
    num: '03',
    title: 'Plan Your Dream Trip',
    desc: 'Receive a personalized itinerary and package crafted just for you. Then just enjoy!',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validate(f: FormState) {
  const e: Record<string,string> = {}
  if (!f.name.trim())   e.name    = 'Full name is required'
  if (!f.phone.trim())  e.phone   = 'Phone number is required'
  else if (!/^[0-9+\s\-().]{7,20}$/.test(f.phone)) e.phone = 'Enter a valid phone number'
  if (!f.email.trim())  e.email   = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email'
  if (!f.service)       e.service = 'Please select a service'
  if (!f.message.trim()) e.message = 'Please tell us about your trip'
  else if (f.message.trim().length < 10) e.message = 'Give us a little more detail'
  return e
}

function Field({ label, id, error, required=true, children }: {
  label:string; id:string; error?:string; required?:boolean; children:React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 leading-none">
        {label}{required && <span className="text-brand-orange ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs text-red-600 font-medium">
          <AlertCircle size={11} aria-hidden="true"/> {error}
        </p>
      )}
    </div>
  )
}

function inputCls(err?: boolean) {
  return [
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 text-sm font-medium',
    'placeholder:text-gray-400 placeholder:font-normal',
    'transition-all duration-150 outline-none',
    'focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
    err ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300',
  ].join(' ')
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function ContactForm() {
  const [form,   setForm]   = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [status, setStatus] = useState<Status>('idle')

  function update(field: keyof FormState, value: string) {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => { const n={...p}; delete n[field]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.honeypot) return
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    setStatus('loading'); setErrors({})
    try {
      // ── EmailJS — paste 3 keys + uncomment when ready ─────────────────────
      // import emailjs from '@emailjs/browser'
      // await emailjs.send('service_ast3kud', 'YOUR_TEMPLATE_ID', {
      //   from_name: form.name, phone: form.phone,
      //   reply_to: form.email, service: form.service, message: form.message,
      // }, 'YOUR_PUBLIC_KEY')
      // ─────────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 1300))
      setStatus('success'); setForm(EMPTY)
    } catch { setStatus('error') }
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        className="flex flex-col items-center justify-center text-center py-14 px-4 gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center">
            <CheckCircle size={36} className="text-green-500"/>
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">✈️</span>
        </div>
        <div>
          <h4 className="text-xl font-bold text-brand-black font-heading mb-2">Message Sent!</h4>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
            Thank you! We received your inquiry and will reach out within{' '}
            <strong className="text-brand-black">24 hours</strong> to help plan your trip.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-brand-orange/20">
          <p className="text-brand-orange text-xs font-semibold italic">Your Journey, Our Priority</p>
        </div>
        <button onClick={() => setStatus('idle')}
          className="text-xs text-gray-400 underline-offset-2 underline hover:text-brand-orange transition-colors">
          Send another message
        </button>
      </motion.div>
    )
  }

  // ── Form body ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact inquiry form">
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position:'absolute', opacity:0, pointerEvents:'none', left:'-9999px' }}>
        <input id="honeypot" name="honeypot" type="text" tabIndex={-1}
          autoComplete="off" value={form.honeypot} onChange={e => update('honeypot', e.target.value)}/>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" id="name" error={errors.name}>
          <input id="name" type="text" placeholder="e.g. Maria Santos" autoComplete="name"
            value={form.name} onChange={e => update('name', e.target.value)}
            className={inputCls(!!errors.name)} aria-required="true"/>
        </Field>

        <Field label="Phone Number" id="phone" error={errors.phone}>
          <input id="phone" type="tel" placeholder="e.g. 09159234547" autoComplete="tel"
            value={form.phone} onChange={e => update('phone', e.target.value)}
            className={inputCls(!!errors.phone)} aria-required="true"/>
        </Field>

        <Field label="Email Address" id="email" error={errors.email}>
          <input id="email" type="email" placeholder="e.g. maria@gmail.com" autoComplete="email"
            value={form.email} onChange={e => update('email', e.target.value)}
            className={inputCls(!!errors.email)} aria-required="true"/>
        </Field>

        <Field label="Service Interested In" id="service" error={errors.service}>
          <select id="service" value={form.service} onChange={e => update('service', e.target.value)}
            className={inputCls(!!errors.service) + ' cursor-pointer'} aria-required="true">
            <option value="">Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Your Message / Inquiry" id="message" error={errors.message}>
            <textarea id="message" rows={4} aria-required="true"
              placeholder="Tell us about your dream trip — destination, number of travellers, budget, any special requests…"
              value={form.message} onChange={e => update('message', e.target.value)}
              className={inputCls(!!errors.message) + ' resize-none'}/>
          </Field>
        </div>
      </div>

      {status === 'error' && (
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="mt-4 flex items-center gap-2 text-sm text-red-700 font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
          <AlertCircle size={15} aria-hidden="true"/>
          Something went wrong. Try again or{' '}
          <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" className="underline font-bold">
            message us on Messenger
          </a>.
        </motion.p>
      )}

      {/* ── CTA Button ─────────────────────────────────────────────────────
          Full-width, bold, with a right arrow that slides on hover.
          Communicates action clearly and has strong visual weight.
      ── */}
      <button type="submit" disabled={status==='loading'}
        className="group mt-5 w-full relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base text-white bg-brand-orange hover:bg-orange-600 transition-all duration-200 shadow-orange active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden">
        {/* Subtle shimmer on idle */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"/>
        {status === 'loading' ? (
          <><Loader2 size={18} className="animate-spin" aria-hidden="true"/> Sending your message…</>
        ) : (
          <>
            <Send size={17} aria-hidden="true"/>
            Send My Inquiry
            <ArrowRight size={17} className="ml-auto group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true"/>
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-gray-400">
        We typically reply within 24 hours ·{' '}
        <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer"
          className="text-brand-orange font-semibold hover:underline">Chat on Messenger</a>{' '}
        for a faster response
      </p>
    </form>
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
            subtitle="Fill in the form or reach us directly — our travel experts are ready to plan your perfect trip."
          />

          {/* ════════════════════════════════════════════════════════════════
              MAIN GRID  ·  Contact Info (left)  ·  Form (right)
          ════════════════════════════════════════════════════════════════ */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">

            {/* ── LEFT: Contact Info ─── */}
            <motion.div
              variants={fadeLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-brand-black rounded-2xl p-8 text-white flex flex-col gap-6"
            >
              <h3 className="font-bold text-xl font-heading">Contact Information</h3>

              <div className="flex flex-col gap-5">
                <a href={CONTACT.phoneTel} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors duration-200">
                    <Phone size={16} className="text-brand-orange group-hover:text-white transition-colors" aria-hidden="true"/>
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Phone</p>
                    <p className="text-white text-sm font-semibold group-hover:text-brand-orange transition-colors">
                      {CONTACT.phoneFormatted}
                    </p>
                  </div>
                </a>

                <a href={CONTACT.emailHref} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors duration-200">
                    <Mail size={16} className="text-brand-orange group-hover:text-white transition-colors" aria-hidden="true"/>
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Email</p>
                    <p className="text-white text-sm font-semibold group-hover:text-brand-orange transition-colors break-all">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-orange" aria-hidden="true"/>
                  </div>
                  <div>
                    <p className="text-white/45 text-xs mb-1 uppercase tracking-wider">Address</p>
                    <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{CONTACT.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10"/>

              <div className="flex flex-col gap-3">
                <p className="text-white/45 text-xs uppercase tracking-widest">Connect With Us</p>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors">
                  <Share2 size={15} aria-hidden="true"/> A N D Travel and Tours — Facebook
                </a>
                <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm text-white font-medium hover:bg-brand-orange transition-colors">
                  <MessageCircle size={15} aria-hidden="true"/> Chat with us on Messenger
                </a>
              </div>

              {/* QR compact — lives inside the contact card */}
              <div className="border-t border-white/10 pt-5 flex items-center gap-5">
                <div className="bg-white rounded-xl p-1.5 shrink-0">
                  <LocalQRCode size={80}/>
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

            {/* ── RIGHT: Form ─── */}
            <motion.div
              variants={fadeRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
            >
              {/* Card header — brand-black with logo, far more premium than plain orange */}
              <div className="bg-brand-black px-7 py-5 flex items-center gap-5">
                <BrandLogo height={42} variant="light"/>
                <div className="border-l border-white/20 pl-5">
                  <h3 className="text-white font-bold text-lg font-heading leading-tight">Send Us a Message</h3>
                  <p className="text-white/55 text-xs mt-0.5">We'll reply within 24 hours</p>
                </div>
              </div>

              {/* Form */}
              <div className="p-7">
                <ContactForm/>
              </div>
            </motion.div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              ROW 2 — "What Happens Next" process strip
              Senior UX rationale: reduces post-submission anxiety by showing
              users exactly what to expect — a proven trust-building pattern
              for service businesses. Much more valuable than the QR alone.
          ════════════════════════════════════════════════════════════════ */}
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

                  {/* Connector arrow between steps — desktop only */}
                  {!isLast && (
                    <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-brand-orange rounded-full items-center justify-center shadow-orange">
                      <ArrowRight size={12} className="text-white" aria-hidden="true"/>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border-2 border-brand-orange/20 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-brand-orange" aria-hidden="true"/>
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
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        style={{ height:'420px' }}
        className="w-full"
      >
        <iframe
          title="A N D Travel and Tours — Blk 10 Lot 6, Danarose Residences, Bacoor Cavite"
          src={CONTACT.mapEmbed}
          width="100%"
          height="100%"
          style={{ border:0, display:'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin"
        />
      </motion.div>
    </section>
  )
}
