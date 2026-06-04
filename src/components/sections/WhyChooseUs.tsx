import { motion } from 'framer-motion'
import { ShieldCheck, BadgeDollarSign, Headphones, UsersRound, Map, Sparkles } from 'lucide-react'
import { AnimatedSection } from '@ui/AnimatedSection'
import { fadeUpVariants, staggerContainer, defaultViewport } from '@lib/animations'

const reasons = [
  {
    icon: ShieldCheck,
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    title: 'Licensed & Accredited',
    description: 'DTI, BIR registered, and Mayor\'s Permit holder. A fully verified travel agency you can trust.',
  },
  {
    icon: BadgeDollarSign,
    iconColor: 'text-green-500',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    title: 'Honest, Transparent Pricing',
    description: 'No hidden fees. No surprises. Just clear, competitive rates that respect your budget.',
  },
  {
    icon: Headphones,
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    title: 'Always Here When You Need Us',
    description: 'Call, email, or Messenger — real people ready to help you, fast.',
  },
  {
    icon: UsersRound,
    iconColor: 'text-brand-orange',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    title: 'A Team That Truly Cares',
    description: 'Years of experience helping Filipino families explore the world, with heart and dedication.',
  },
  {
    icon: Map,
    iconColor: 'text-rose-500',
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50',
    title: 'Built Around You',
    description: 'No cookie-cutter packages. Every itinerary is crafted around your needs, style, and budget.',
  },
  {
    icon: Sparkles,
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    title: 'We Handle Everything',
    description: 'Visas, flights, hotels, transfers — leave the details to us and just enjoy the journey.',
  },
]

export function WhyChooseUs() {
  return (
    <AnimatedSection id="why-us" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Two-column layout: Header left | Grid right ── */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Left: sticky header block */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col justify-start lg:pt-2"
          >
            <p className="text-brand-orange text-xs font-bold tracking-[0.22em] uppercase mb-3">Why Choose Us</p>
            <h2 className="text-brand-black text-3xl md:text-4xl font-bold font-heading leading-tight mb-5">
              We Make Your<br />Trip Happen Right
            </h2>
            <div className="h-1 w-12 rounded-full bg-brand-orange mb-6" />
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              More than a booking service — we're your travel partner from the first inquiry to the moment you land back home.
            </p>

            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop"
                alt="Travel team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-semibold text-sm font-heading">Your Journey, Our Priority</p>
                <p className="text-white/65 text-xs mt-0.5">A N D Travel and Tours</p>
              </div>
            </div>
          </motion.div>

          {/* Right: reasons list */}
          <motion.div
            variants={staggerContainer(0.07, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="lg:col-span-3 flex flex-col"
          >
            {reasons.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  variants={fadeUpVariants}
                  className="group flex items-start gap-5 py-6 border-b border-gray-200 last:border-b-0 hover:border-brand-orange/30 transition-colors duration-300 cursor-default"
                >
                  {/* Icon circle */}
                  <div className={`shrink-0 w-11 h-11 rounded-full ${r.bgColor} border-2 ${r.borderColor} group-hover:border-brand-orange group-hover:bg-brand-orange transition-all duration-300 flex items-center justify-center shadow-sm`}>
                    <Icon size={18} className={`${r.iconColor} group-hover:text-white transition-colors duration-300`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-black text-base font-heading mb-1 group-hover:text-brand-orange transition-colors duration-300">
                      {r.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.description}</p>
                  </div>

                  {/* Step number */}
                  <span className="shrink-0 text-gray-100 text-3xl font-black font-heading leading-none group-hover:text-brand-orange/20 transition-colors duration-300 hidden sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </AnimatedSection>
  )
}
