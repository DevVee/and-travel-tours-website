import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCheck, ExternalLink, ImageOff, X, ZoomIn } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, staggerContainer, defaultViewport } from '@lib/animations'

const QR_VERIFY = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent('https://www.facebook.com/profile.php?id=61590018405492')}&bgcolor=111111&color=ffffff&margin=8`

const credentials = [
  {
    id: 1,
    title: 'DTI Registered',
    body: 'Department of Trade and Industry',
    description: 'We are a duly registered business with the Department of Trade and Industry (DTI).',
    regNumber: 'DTI Business Name Registration',
    borderColor: 'border-blue-400',
    badgeText: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    docImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'BIR Registered',
    body: 'Bureau of Internal Revenue',
    description: 'Committed to lawful and transparent business operations with full BIR compliance.',
    regNumber: 'BIR Certificate of Registration',
    borderColor: 'border-green-400',
    badgeText: 'text-green-600',
    badgeBg: 'bg-green-50',
    docImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    title: "Mayor's Permit",
    body: 'City/Municipal Business Permit',
    description: "Legally authorized to operate in the City of Bacoor, Cavite with a valid Mayor's Permit.",
    regNumber: "Business Permit & License",
    borderColor: 'border-brand-orange',
    badgeText: 'text-brand-orange',
    badgeBg: 'bg-orange-50',
    docImage: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=500&q=80&auto=format&fit=crop',
  },
]

export function Credentials() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <AnimatedSection id="credentials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Business Credentials"
          title="Fully Registered & Accredited"
          subtitle="We operate with complete legal compliance, giving you the confidence and peace of mind you deserve."
        />

        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {credentials.map((cred) => (
            <motion.div
              key={cred.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-2xl border-2 ${cred.borderColor} shadow-card hover:shadow-card-lg transition-shadow duration-300 flex flex-col overflow-hidden`}
            >
              {/* Document placeholder image — click to view large */}
              <button
                onClick={() => setLightbox(cred.docImage)}
                className="relative h-44 bg-gray-100 overflow-hidden w-full group/img text-left cursor-zoom-in"
                aria-label={`View ${cred.title} document`}
              >
                <img
                  src={cred.docImage}
                  alt={`${cred.title} document placeholder`}
                  className="w-full h-full object-cover opacity-65 group-hover/img:opacity-80 transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-black/50 flex flex-col items-center justify-center gap-2">
                  <ImageOff size={18} className="text-white/50" />
                  <p className="text-white/70 text-[10px] font-medium text-center px-6 leading-snug">
                    Placeholder — tap to view
                  </p>
                </div>
                {/* Zoom hint on hover */}
                <div className="absolute inset-0 bg-brand-orange/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn size={28} className="text-white drop-shadow" />
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow">
                  <BadgeCheck size={12} className="text-green-500" />
                  <span className={`text-[10px] font-bold ${cred.badgeText}`}>Verified</span>
                </div>
              </button>

              {/* Card content */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                  <div className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2 ${cred.badgeBg} ${cred.badgeText}`}>
                    {cred.regNumber}
                  </div>
                  <h3 className="font-bold text-brand-black text-lg font-heading">{cred.title}</h3>
                  <p className="text-brand-orange text-xs font-medium mt-0.5">{cred.body}</p>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{cred.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* QR Verification Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={defaultViewport}
          transition={{ delay: 0.3 }}
          className="bg-brand-black rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="bg-white rounded-xl p-3 shrink-0">
            <img src={QR_VERIFY} alt="Verify QR" width={120} height={120} className="rounded-lg block" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-2">Scan to Verify</p>
            <h3 className="text-white text-xl font-bold font-heading mb-2">DTI Business Name Registration</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-lg">
              Scan the QR code to verify our business registration details or connect with us on Facebook for real-time updates and inquiries.
            </p>
          </div>
          <div className="md:ml-auto shrink-0">
            <a href="https://www.facebook.com/profile.php?id=61590018405492" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors">
              View Profile <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Lightbox ─────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-card-lg hover:bg-gray-100 z-10"
                aria-label="Close"
              >
                <X size={18} className="text-brand-black" />
              </button>
              <img
                src={lightbox}
                alt="Document"
                className="w-full rounded-2xl shadow-card-lg"
              />
              <p className="text-white/60 text-xs text-center mt-3">
                Placeholder image — replace with your actual document scan
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AnimatedSection>
  )
}
