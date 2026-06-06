import { motion } from 'framer-motion'
import { AnimatedSection } from '@ui/AnimatedSection'
import { SectionHeader } from '@ui/SectionHeader'
import { fadeUpVariants, fadeLeftVariants, fadeRightVariants, defaultViewport } from '@lib/animations'

const collageImages = [
  { src: 'https://images.unsplash.com/photo-1576647025587-2b77cd953cba?w=400&q=80&auto=format&fit=crop', alt: 'Whale shark swimming with snorkeler, Oslob, Cebu' },
  { src: 'https://images.unsplash.com/photo-1495031451303-d8ab59c8df37?w=400&q=80&auto=format&fit=crop', alt: 'Boracay paraw sailboats, Philippines' },
  { src: 'https://images.unsplash.com/photo-1664602078796-68ee76b3fc59?w=400&q=80&auto=format&fit=crop', alt: 'Registan Square ancient architecture, Samarkand, Uzbekistan' },
  { src: 'https://images.unsplash.com/photo-1684453728339-aa45743ab516?w=400&q=80&auto=format&fit=crop', alt: 'Bayterek Tower in Astana, Kazakhstan' },
]

export function About() {
  return (
    <AnimatedSection id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: 2×2 Image Collage ───────────────── */}
          <motion.div
            variants={fadeLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-2 gap-3"
          >
            {collageImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>

          {/* ── Right: Company Overview ───────────────── */}
          <motion.div
            variants={fadeRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <SectionHeader
              eyebrow="Company Overview"
              title="A N D Travel and Tours"
              centered={false}
            />

            <motion.p variants={fadeUpVariants} className="text-gray-600 text-base leading-relaxed mb-4">
              A N D Travel and Tours is a duly registered travel agency based in Bacoor, Cavite, Philippines, committed to providing reliable, affordable, and customer-focused travel solutions. We specialize in domestic and international travel arrangements, helping individuals, families, groups, and corporate clients experience seamless and memorable journeys.
            </motion.p>

            <motion.p variants={fadeUpVariants} className="text-gray-600 text-base leading-relaxed mb-4">
              Our goal is to make travel planning convenient and stress-free through professional assistance, personalized service, and carefully curated travel packages. Whether for leisure, business, educational tours, or group travel, A N D Travel and Tours is dedicated to delivering quality travel experiences that exceed expectations.
            </motion.p>

            <motion.p variants={fadeUpVariants} className="text-gray-600 text-base leading-relaxed mb-8">
              We also specialize in emerging visa-free destinations for Filipino passport holders — <span className="font-semibold text-brand-orange">Kazakhstan</span>, <span className="font-semibold text-brand-orange">Kyrgyzstan</span>, <span className="font-semibold text-brand-orange">Tajikistan</span>, <span className="font-semibold text-brand-orange">Turkmenistan</span>, and <span className="font-semibold text-brand-orange">Uzbekistan</span> — giving you access to breathtaking Central Asian landscapes, Silk Road heritage, and unforgettable adventures without the hassle of visa applications.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-orange text-sm"
              >
                Contact Us
              </button>
              <button
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 border-2 border-brand-orange text-brand-orange font-semibold rounded-full hover:bg-brand-orange hover:text-white transition-all duration-300 text-sm"
              >
                Our Services
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </AnimatedSection>
  )
}
