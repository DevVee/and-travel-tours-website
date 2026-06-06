import { useState }                from 'react'
import { motion, AnimatePresence }  from 'framer-motion'
import { ChevronDown, HelpCircle }  from 'lucide-react'
import { AnimatedSection }          from '@ui/AnimatedSection'
import { SectionHeader }            from '@ui/SectionHeader'
import { faqCategories }            from '@data/faq'
import type { FAQItem }             from '@data/faq'
import { fadeUpVariants, defaultViewport } from '@lib/animations'

// ─── Accordion Item ───────────────────────────────────────────────────────────
interface ItemProps {
  item:     FAQItem & { num: number }
  itemId:   string
  isOpen:   boolean
  onToggle: () => void
}

function AccordionItem({ item, itemId, isOpen, onToggle }: ItemProps) {
  return (
    <div
      className={[
        'rounded-xl border-2 bg-white overflow-hidden transition-colors duration-200',
        isOpen
          ? 'border-brand-orange/40 shadow-sm'
          : 'border-gray-100 hover:border-gray-200',
      ].join(' ')}
    >
      {/* Question button */}
      <button
        id={`faq-q-${itemId}`}
        aria-expanded={isOpen}
        aria-controls={`faq-a-${itemId}`}
        onClick={onToggle}
        className="w-full flex items-center gap-3.5 px-5 py-4 text-left
                   hover:bg-orange-50/40 transition-colors duration-150"
      >
        {/* Number badge */}
        <span
          className={[
            'shrink-0 w-6 h-6 rounded-full text-[11px] font-black',
            'flex items-center justify-center transition-colors duration-200',
            isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400',
          ].join(' ')}
          aria-hidden="true"
        >
          {item.num}
        </span>

        <span className="flex-1 font-semibold text-brand-black text-sm leading-snug pr-2">
          {item.q}
        </span>

        <ChevronDown
          size={17}
          aria-hidden="true"
          className={[
            'shrink-0 text-brand-orange transition-transform duration-300',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* Answer panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-a-${itemId}`}
            role="region"
            aria-labelledby={`faq-q-${itemId}`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100">
              <div className="pt-3.5 pl-9 text-gray-600 text-sm leading-relaxed">
                {item.a && <p>{item.a}</p>}
                {item.list && (
                  <ul className="mt-3 space-y-2" role="list">
                    {item.list.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-[5px] w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
export function FAQ() {
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (id: string) => setOpen(prev => (prev === id ? null : id))

  // Assign sequential numbers across all categories
  let qNum = 0
  const numberedCats = faqCategories.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({ ...item, num: ++qNum })),
  }))

  return (
    <AnimatedSection id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Header ──────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-12"
        >
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            centered
          />
          <p className="mt-1 text-brand-gold font-medium italic text-base tracking-wide">
            In case you were wondering…
          </p>
        </motion.div>

        {/* ── Accordion Categories ─────────────────────── */}
        <div className="space-y-10">
          {numberedCats.map(cat => (
            <motion.div
              key={cat.id}
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              {/* Category pill + divider */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5
                             bg-brand-orange/10 text-brand-orange shrink-0
                             text-xs font-bold rounded-full uppercase tracking-wider"
                >
                  <HelpCircle size={11} aria-hidden="true" />
                  {cat.title}
                </span>
                <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
              </div>

              {/* Questions */}
              <div className="space-y-2.5">
                {cat.items.map((item, ii) => {
                  const itemId = `${cat.id}-${ii}`
                  return (
                    <AccordionItem
                      key={itemId}
                      item={item}
                      itemId={itemId}
                      isOpen={open === itemId}
                      onToggle={() => toggle(itemId)}
                    />
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-14 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            Still have a question not listed here?
          </p>
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white
                       font-semibold rounded-full hover:bg-orange-600 transition-colors
                       shadow-orange text-sm"
          >
            Ask Us Directly →
          </button>
        </motion.div>

      </div>
    </AnimatedSection>
  )
}
