import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cardVariants, staggerContainer, defaultViewport } from '@lib/animations'

const coreValues = [
  { num: '01', title: 'Integrity',            desc: 'We conduct business with honesty, transparency, and professionalism.' },
  { num: '02', title: 'Customer Commitment',  desc: 'We prioritize the needs and satisfaction of our clients.' },
  { num: '03', title: 'Excellence',           desc: 'We continuously improve our services to exceed customer expectations.' },
  { num: '04', title: 'Reliability',          desc: 'We provide dependable travel solutions and support.' },
]

export function MissionVision() {
  return (
    <section id="mission" className="relative py-24 overflow-hidden bg-brand-black">

      {/* ── Background travel image with dark overlay ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=60&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
          aria-hidden="true"
        />
      </div>
      {/* gradient fade top & bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-brand-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">Who We Are</p>
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
            Mission, Vision &<br className="hidden sm:block" /> Core Values
          </h2>
          <div className="flex justify-center mt-5">
            <div className="h-1 w-16 rounded-full bg-gradient-orange" />
          </div>
        </motion.div>

        {/* ── Mission + Vision side by side ──────────── */}
        <motion.div
          variants={staggerContainer(0.15, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          {/* MISSION */}
          <motion.div
            variants={cardVariants}
            className="relative rounded-2xl p-8 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-brand-orange/50 transition-colors duration-400 overflow-hidden"
          >
            {/* Left orange accent bar */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-brand-orange rounded-r-full" />
            {/* Decorative large quote */}
            <div className="absolute top-4 right-6 text-brand-orange/10 text-9xl font-serif leading-none select-none pointer-events-none">
              "
            </div>

            <div className="mb-5 pl-4">
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-1">Our</p>
              <h3 className="text-white text-xl font-bold font-heading">Mission</h3>
            </div>
            <p className="text-white/70 text-sm leading-7 pl-4">
              To provide exceptional travel experiences through reliable, affordable, and customer-focused travel solutions while building lasting relationships with our clients through trust, professionalism, and excellence.
            </p>
          </motion.div>

          {/* VISION */}
          <motion.div
            variants={cardVariants}
            className="relative rounded-2xl p-8 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-brand-gold/50 transition-colors duration-400 overflow-hidden"
          >
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-brand-gold rounded-r-full" />
            <div className="absolute top-4 right-6 text-brand-gold/10 text-9xl font-serif leading-none select-none pointer-events-none">
              "
            </div>

            <div className="mb-5 pl-4">
              <p className="text-brand-gold text-[10px] font-bold tracking-widest uppercase mb-1">Our</p>
              <h3 className="text-white text-xl font-bold font-heading">Vision</h3>
            </div>
            <p className="text-white/70 text-sm leading-7 pl-4">
              To become one of the most trusted and preferred travel agencies in the Philippines by delivering outstanding travel services, innovative travel solutions, and exceptional customer satisfaction.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Core Values ────────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="rounded-2xl bg-black/60 backdrop-blur-sm border border-white/10 p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-white text-sm font-bold font-heading tracking-widest uppercase px-4">Our Core Values</p>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((v) => (
              <motion.div
                key={v.num}
                variants={cardVariants}
                className="flex flex-col gap-3 group"
              >
                {/* Number badge */}
                <div className="flex items-center gap-2">
                  <span className="text-brand-orange text-2xl font-black font-heading leading-none">{v.num}</span>
                  <CheckCircle2 size={16} className="text-brand-orange" />
                </div>
                <h4 className="text-white font-semibold text-sm group-hover:text-brand-orange transition-colors duration-300">
                  {v.title}
                </h4>
                <p className="text-white/50 text-xs leading-relaxed">{v.desc}</p>
                <div className="h-px bg-white/10 mt-1 group-hover:bg-brand-orange/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
