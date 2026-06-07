import { useState }            from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown, ShieldCheck } from 'lucide-react'
import { AnimatedSection }    from '@ui/AnimatedSection'
import { SectionHeader }      from '@ui/SectionHeader'
import { LegalModal }         from '@ui/LegalModal'
import type { LegalType }     from '@ui/LegalModal'
import {
  staggerContainer, cardVariants,
  fadeUpVariants, defaultViewport,
} from '@lib/animations'

// ─── Policy highlight bullets shown in each card ──────────────────────────────
const TERMS_HIGHLIGHTS = [
  'All bookings are confirmed only upon receipt of required payment.',
  'Promotional fares are generally non-refundable and non-transferable.',
  'Visa approval is solely at the discretion of the respective embassy.',
  'Passports must have at least 6 months validity from date of travel.',
  'A N D Travel and Tours acts only as intermediary between clients and service providers.',
]

const BOOKING_HIGHLIGHTS = [
  'A non-refundable deposit may be required to secure a reservation.',
  'Full payment must be settled on or before the specified due date.',
  'All cancellation requests must be submitted in writing.',
  'Airline fares are dynamic and may change without prior notice.',
  'Unused services, missed tours, and late arrivals are non-refundable.',
]

// ─── Individual policy card ───────────────────────────────────────────────────
function PolicyCard({
  type,
  title,
  icon: Icon,
  highlights,
  onOpen,
}: {
  type:       LegalType
  title:      string
  icon:       React.ElementType
  highlights: string[]
  onOpen:     (t: LegalType) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
          <Icon size={18} className="text-brand-orange" aria-hidden="true" />
        </div>
        <h3 className="font-heading font-bold text-brand-black text-lg flex-1 leading-tight">
          {title}
        </h3>
        <button
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-50 flex items-center justify-center transition-colors shrink-0"
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <ChevronDown size={15} aria-hidden="true" />
          </motion.div>
        </button>
      </div>

      {/* Key highlights — always visible */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Key Highlights
        </p>
        <ul className="space-y-2.5">
          {highlights.slice(0, expanded ? highlights.length : 3).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-gray-600 text-sm leading-relaxed">
              <span
                className="mt-[5px] w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Expand/collapse inline highlights */}
        <AnimatePresence initial={false}>
          {!expanded && highlights.length > 3 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(true)}
              className="mt-3 text-xs text-brand-orange font-semibold hover:underline"
            >
              +{highlights.length - 3} more highlights
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-5">
        <button
          onClick={() => onOpen(type)}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-brand-orange text-white
                     text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-orange"
        >
          <FileText size={14} aria-hidden="true" />
          Read Full {title}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function Policies() {
  const [modal, setModal] = useState<LegalType | null>(null)

  return (
    <AnimatedSection id="policies" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <SectionHeader
          eyebrow="Transparency First"
          title="Terms & Policies"
          subtitle="We believe in clear, honest communication. Review our terms before you book."
        />

        {/* ── Policy cards ──────────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid md:grid-cols-2 gap-6"
        >
          <PolicyCard
            type="terms"
            title="Terms & Conditions"
            icon={FileText}
            highlights={TERMS_HIGHLIGHTS}
            onOpen={setModal}
          />
          <PolicyCard
            type="booking"
            title="Booking Policy & Payment Terms"
            icon={ShieldCheck}
            highlights={BOOKING_HIGHLIGHTS}
            onOpen={setModal}
          />
        </motion.div>

        {/* Note */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center text-gray-400 text-xs mt-8 italic"
        >
          By making a reservation, you confirm that you have read and agreed to our policies.
        </motion.p>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && <LegalModal type={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </AnimatedSection>
  )
}
