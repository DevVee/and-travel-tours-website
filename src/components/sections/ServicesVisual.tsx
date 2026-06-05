import { motion }     from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@ui/SectionHeader'
import { cardVariants, staggerContainer, defaultViewport } from '@lib/animations'

// ─── Service data ─────────────────────────────────────────────────────────────
// serviceValue: the exact string that matches the Contact form's SERVICES dropdown.
// null = card is display-only (no click action).
type ServiceEntry = {
  id: number
  title: string
  description: string
  imageUrl: string
  serviceValue: string | null
}

const visualServices: ServiceEntry[] = [
  {
    id: 1,
    title: 'Domestic Tour\nPackages',
    description: 'Explore the beauty of the Philippines through carefully planned travel packages.',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80&auto=format&fit=crop',
    serviceValue: 'Domestic Tour Packages',
  },
  {
    id: 2,
    title: 'International Tour\nPackages',
    description: 'Discover exciting destinations worldwide with customized travel itineraries.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80&auto=format&fit=crop',
    serviceValue: 'International Tour Packages',
  },
  {
    id: 3,
    title: 'Airline Ticket\nBooking',
    description: 'Competitive airline options for domestic and international flights.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop',
    serviceValue: 'Airline Ticket Booking',
  },
  {
    id: 4,
    title: 'Hotel\nReservations',
    description: 'Comfortable and budget-friendly accommodation arrangements.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop',
    serviceValue: null,
  },
  {
    id: 5,
    title: 'Visa\nAssistance',
    description: 'Guidance and support for visa application requirements and processing.',
    imageUrl: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80&auto=format&fit=crop',
    serviceValue: 'Visa Assistance',
  },
  {
    id: 6,
    title: 'Group and\nCorporate Travel',
    description: 'Customized travel solutions for organizations, businesses, and group tours.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop',
    serviceValue: null,
  },
]

// ─── Section ──────────────────────────────────────────────────────────────────
export function ServicesVisual() {

  // Maps each service card to the correct tab in the Contact form
  const SERVICE_TO_TAB: Record<string, string> = {
    'Domestic Tour Packages':    'tourPackage',
    'International Tour Packages': 'tourPackage',
    'Airline Ticket Booking':    'airline',
    'Visa Assistance':           'visa',
  }

  function handleCardClick(service: ServiceEntry) {
    if (!service.serviceValue) return
    const tab = SERVICE_TO_TAB[service.serviceValue]
    if (tab) {
      window.dispatchEvent(new CustomEvent('and-travel:select-tab', { detail: tab }))
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

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
          {visualServices.map((service) => {
            const clickable = !!service.serviceValue
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={['flex flex-col', clickable ? 'group cursor-pointer' : ''].join(' ')}
                onClick={() => handleCardClick(service)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? `Inquire about ${service.title.replace('\n', ' ')}` : undefined}
                onKeyDown={clickable ? e => e.key === 'Enter' && handleCardClick(service) : undefined}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-3">
                  <img
                    src={service.imageUrl}
                    alt={service.title.replace('\n', ' ')}
                    className={[
                      'w-full h-full object-cover transition-transform duration-500',
                      clickable ? 'group-hover:scale-105' : '',
                    ].join(' ')}
                    loading="lazy"
                  />
                  {clickable && <>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                    <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-colors duration-400" />
                  </>}
                </div>

                {/* Text */}
                <div className="flex-1 flex flex-col">
                  <h3 className={[
                    'font-bold text-brand-black text-sm leading-tight font-heading mb-1.5 whitespace-pre-line transition-colors duration-300',
                    clickable ? 'group-hover:text-brand-orange' : '',
                  ].join(' ')}>
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">
                    {service.description}
                  </p>
                  {clickable && (
                    <span
                      className="inline-flex items-center gap-1 text-xs text-brand-orange font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    >
                      Inquire <ArrowRight size={11} />
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
