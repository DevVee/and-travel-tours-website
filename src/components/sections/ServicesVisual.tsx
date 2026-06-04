import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, staggerContainer, defaultViewport } from '@lib/animations'

// Services exactly matching the reference image
const visualServices = [
  {
    id: 1,
    title: 'Domestic Tour\nPackages',
    description: 'Explore the beauty of the Philippines through carefully planned travel packages.',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'International Tour\nPackages',
    description: 'Discover exciting destinations worldwide with customized travel itineraries.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Airline Ticket\nBooking',
    description: 'Competitive airline options for domestic and international flights.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Hotel\nReservations',
    description: 'Comfortable and budget-friendly accommodation arrangements.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Visa\nAssistance',
    description: 'Guidance and support for visa application requirements and processing.',
    imageUrl: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Group and\nCorporate Travel',
    description: 'Customized travel solutions for organizations, businesses, and group tours.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop',
  },
]

export function ServicesVisual() {
  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Our Services"
          title="Complete Travel Solutions"
          subtitle="From domestic getaways to international adventures — we handle every detail so you just enjoy the journey."
        />

        <motion.div
          variants={staggerContainer(0.08, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {visualServices.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image card */}
              <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-3">
                <img
                  src={service.imageUrl}
                  alt={service.title.replace('\n', ' ')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Orange accent bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-colors duration-400" />
              </div>

              {/* Text */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-brand-black text-sm leading-tight font-heading mb-1.5 whitespace-pre-line group-hover:text-brand-orange transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 text-xs text-brand-orange font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Inquire <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
