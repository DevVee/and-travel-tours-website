import { motion } from 'framer-motion'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, staggerContainer, defaultViewport, fadeUpVariants } from '@lib/animations'

// ── Registration data ─────────────────────────────────────────────────────────
const credentials = [
  {
    id: 1,
    agency: 'DTI',
    agencyFull: 'Department of Trade and Industry',
    title: 'DTI Registered',
    description: 'Duly registered business with the Department of Trade and Industry, Philippines.',
    accentColor: 'border-blue-400',
    badgeText: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    fields: [
      { label: 'Business Name No.', value: '8228632' },
    ],
  },
  {
    id: 2,
    agency: "Mayor's",
    agencyFull: 'City/Municipal Business Permit',
    title: "Mayor's Permit",
    description: "Legally authorized to operate in Bacoor, Cavite with a valid Mayor's Permit.",
    accentColor: 'border-brand-orange',
    badgeText: 'text-brand-orange',
    badgeBg: 'bg-orange-50',
    iconBg: 'bg-orange-50',
    iconColor: 'text-brand-orange',
    fields: [
      { label: 'Account No.',  value: 'D-04812' },
      { label: 'Plate No.',    value: '14477'   },
      { label: 'Status',       value: 'NEW'     },
    ],
  },
  {
    id: 3,
    agency: 'BIR',
    agencyFull: 'Bureau of Internal Revenue',
    title: 'BIR Registered',
    description: 'Committed to lawful and transparent operations with full BIR compliance.',
    accentColor: 'border-green-400',
    badgeText: 'text-green-600',
    badgeBg: 'bg-green-50',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    fields: [
      { label: 'Registration', value: 'Certificate of Registration' },
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function Credentials() {
  return (
    <AnimatedSection id="credentials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <SectionHeader
          eyebrow="Business Credentials"
          title="Fully Registered & Accredited"
          subtitle="We operate with complete legal compliance, giving you the confidence and peace of mind you deserve."
        />

        {/* ── Credential cards ─────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {credentials.map(cred => (
            <motion.div
              key={cred.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-2xl border-2 ${cred.accentColor} shadow-card hover:shadow-card-lg transition-shadow duration-300 flex flex-col overflow-hidden`}
            >
              {/* Top accent bar */}
              <div className={`h-1.5 w-full ${cred.accentColor.replace('border-', 'bg-')}`} />

              <div className="p-6 flex flex-col gap-4 flex-1">

                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${cred.iconBg} flex items-center justify-center shrink-0`}>
                    <ShieldCheck size={22} className={cred.iconColor} aria-hidden="true" />
                  </div>
                  <div>
                    <div className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-1 ${cred.badgeBg} ${cred.badgeText}`}>
                      {cred.agencyFull}
                    </div>
                    <h3 className="font-bold text-brand-black text-lg font-heading leading-tight">
                      {cred.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {cred.description}
                </p>

                {/* Registration fields */}
                <div className={`rounded-xl ${cred.badgeBg} border ${cred.accentColor.replace('border-', 'border-')} divide-y divide-white/50 overflow-hidden`}>
                  {cred.fields.map(f => (
                    <div key={f.label} className="flex items-center justify-between px-4 py-2.5">
                      <span className={`text-xs font-medium ${cred.badgeText} opacity-70`}>{f.label}</span>
                      <span className={`text-sm font-black ${cred.badgeText} tracking-wide`}>{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Verified badge */}
                <div className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-green-500" aria-hidden="true" />
                  <span className="text-xs text-green-600 font-semibold">Verified &amp; Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Trust strip ──────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="bg-brand-black rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-brand-orange/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={28} className="text-brand-orange" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg font-bold font-heading mb-1">
              Your Safety Is Our Priority
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
              A N D Travel and Tours is a duly registered travel agency with complete legal documentation.
              Book with confidence — we're fully compliant with DTI, BIR, and local government regulations.
            </p>
          </div>
          <a
            href="https://www.facebook.com/profile.php?id=61590018405492"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            Verify on Facebook
          </a>
        </motion.div>

      </div>
    </AnimatedSection>
  )
}
