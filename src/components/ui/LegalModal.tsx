import { useEffect }               from 'react'
import { motion }                   from 'framer-motion'
import { X, FileText }              from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
export type LegalType = 'terms' | 'booking'

interface LegalSection {
  title: string
  plain?: string
  items:  string[]
}

// ─── Terms & Conditions content ───────────────────────────────────────────────
const TERMS: { intro: string; sections: LegalSection[] } = {
  intro: 'Thank you for choosing A N D Travel and Tours. By booking any travel service with us, you agree to the following Terms and Conditions.',
  sections: [
    {
      title: '1. Booking and Reservation',
      items: [
        'All bookings are subject to availability and confirmation from airlines, hotels, embassies, tour operators, and other service providers.',
        'A booking is considered confirmed only upon receipt of the required payment and issuance of a booking confirmation.',
        'Clients are responsible for reviewing all booking details and informing us immediately of any errors.',
      ],
    },
    {
      title: '2. Payments',
      items: [
        'Full payment or the required deposit must be made on or before the specified due date.',
        'Prices are subject to change without prior notice until full payment has been received.',
        'Failure to complete payment on time may result in automatic cancellation of the reservation.',
      ],
    },
    {
      title: '3. Air Ticket Bookings',
      items: [
        'Airline tickets are subject to the fare rules and conditions of the issuing airline.',
        'Promotional and discounted fares are generally non-refundable, non-transferable, and may have restrictions on changes.',
        'Any rebooking, cancellation, refund, or name correction fees imposed by the airline shall be borne by the client.',
        'Flight schedules may change without prior notice and are solely controlled by the airline.',
      ],
    },
    {
      title: '4. Visa Processing Assistance',
      items: [
        'Our agency provides visa application assistance only.',
        'Visa approval or denial is solely at the discretion of the respective embassy or consulate.',
        'Visa fees, embassy fees, courier fees, and service fees are generally non-refundable once processing has begun.',
        'The agency is not liable for visa refusals, delays, or additional document requests from the embassy.',
      ],
    },
    {
      title: '5. Hotel Reservations',
      items: [
        "Hotel bookings are subject to the hotel's cancellation and refund policies.",
        'Early check-in and late check-out requests are not guaranteed and remain subject to hotel availability.',
        'Any additional charges incurred during the stay shall be paid directly to the hotel unless otherwise specified.',
      ],
    },
    {
      title: '6. Tour Packages and Group Tours',
      items: [
        'Tour itineraries may be modified due to weather conditions, government regulations, operational requirements, or unforeseen circumstances.',
        'No refunds will be provided for unused services, missed tours, late arrivals, or voluntary withdrawal from the tour.',
        'The agency reserves the right to make reasonable substitutions to hotels, transportation, or activities of equivalent value when necessary.',
      ],
    },
    {
      title: '7. Cancellations and Refunds',
      items: [
        'Cancellation requests must be submitted in writing.',
        'Refunds, if applicable, are subject to supplier, airline, hotel, embassy, and tour operator policies.',
        "Processing of refunds may take several weeks depending on the supplier's procedures.",
        'Service fees charged by the agency may be non-refundable.',
      ],
    },
    {
      title: '8. Travel Documents',
      items: [
        'Clients are responsible for ensuring that passports, visas, permits, and other travel documents are valid and meet destination requirements.',
        'Passports should generally have at least six (6) months validity from the date of travel.',
        'The agency shall not be responsible for denied boarding, deportation, or travel interruptions resulting from incomplete or invalid documents.',
      ],
    },
    {
      title: '9. Travel Insurance',
      items: [
        'Travel insurance is highly recommended for all travelers.',
        'Unless specifically stated, travel insurance is not included in the quoted package price.',
      ],
    },
    {
      title: '10. Limitation of Liability',
      items: [
        'A N D Travel and Tours acts only as an intermediary between clients and service providers such as airlines, hotels, embassies, transport companies, and tour operators.',
        'A N D Travel and Tours shall not be liable for any loss, injury, accident, delay, baggage loss, flight cancellation, natural disaster, pandemic-related restrictions, political unrest, or any event beyond its reasonable control.',
        "A N D Travel and Tours' liability, if any, shall be limited to the amount paid directly to the agency for the specific service booked.",
      ],
    },
    {
      title: '11. Force Majeure',
      plain: 'A N D Travel and Tours shall not be held responsible for cancellations, delays, or changes caused by events beyond its control, including but not limited to natural disasters, severe weather, pandemics, government restrictions, strikes, war, or other unforeseen circumstances.',
      items: [],
    },
    {
      title: '12. Privacy Policy',
      plain: 'Client information collected during the booking process shall be used solely for reservation, travel processing, and customer service purposes and will be handled in accordance with applicable privacy laws.',
      items: [],
    },
    {
      title: '13. Acceptance of Terms',
      plain: 'By making a booking, submitting payment, or using our services, the client acknowledges that they have read, understood, and agreed to these Terms and Conditions.',
      items: [],
    },
  ],
}

// ─── Booking Policy content ───────────────────────────────────────────────────
const BOOKING: { intro: string; sections: LegalSection[] } = {
  intro: 'Please read the following policies and payment terms carefully before making any reservation with A N D Travel and Tours.',
  sections: [
    {
      title: 'Reservation Policy',
      items: [
        'All reservations are subject to availability and confirmation.',
        'No booking shall be guaranteed without the required deposit or full payment.',
        'Prices quoted are subject to change without prior notice until booking is confirmed and ticketed.',
        'Submission of travel documents does not automatically guarantee a confirmed reservation.',
      ],
    },
    {
      title: 'Payment Terms',
      items: [
        'A non-refundable reservation fee or deposit may be required to secure a booking.',
        'Full payment must be settled on or before the specified due date.',
        'Failure to complete payment may result in automatic cancellation of the reservation without prior notice.',
        'Clients must provide proof of payment after every transaction.',
      ],
    },
    {
      title: 'Air Ticket Policy',
      items: [
        'Airline fares are dynamic and may change without prior notice.',
        'Tickets are subject to airline fare rules and restrictions.',
        'Promotional fares are generally non-refundable, non-reroutable, and non-transferable.',
        'Rebooking, cancellation, refund, and other penalties imposed by the airline shall be shouldered by the passenger.',
        'A N D Travel and Tours is not responsible for flight schedule changes, delays, or cancellations made by the airline.',
      ],
    },
    {
      title: 'Visa Assistance Policy',
      items: [
        'A N D Travel and Tours provides visa processing assistance only.',
        'Visa approval is solely at the discretion of the embassy or consulate.',
        'Visa fees, service fees, courier fees, and embassy fees are non-refundable once processing has commenced.',
        'A N D Travel and Tours shall not be held liable for visa denial, delayed processing, or additional requirements requested by the embassy.',
      ],
    },
    {
      title: 'Tour Package Policy',
      items: [
        'Tour package rates are based on current supplier rates and are subject to change before confirmation.',
        'Unused services are non-refundable.',
        "Tour itineraries may be modified due to weather conditions, operational requirements, or circumstances beyond the agency's control.",
        'Clients are expected to follow the tour schedule and instructions provided by the tour leader or guide.',
      ],
    },
    {
      title: 'Hotel Reservation Policy',
      items: [
        'Hotel bookings are subject to hotel terms and conditions.',
        'Cancellation penalties vary depending on the hotel policy.',
        'Special requests such as early check-in, late check-out, or room preferences are not guaranteed.',
      ],
    },
    {
      title: 'Cancellation Policy',
      items: [
        'All cancellation requests must be submitted in writing.',
        'Cancellation charges shall apply according to airline, hotel, supplier, or tour operator policies.',
        'Any service fees collected by the agency are non-refundable.',
        'Refund processing times vary depending on the supplier and may take several weeks.',
      ],
    },
    {
      title: 'Travel Document Responsibility',
      items: [
        'Passengers are responsible for ensuring that their passports and travel documents are valid.',
        'Passport validity should be at least six (6) months from the date of travel unless otherwise required by the destination country.',
        'A N D Travel and Tours shall not be responsible for denied boarding or immigration issues resulting from incomplete or invalid travel documents.',
      ],
    },
    {
      title: 'Force Majeure',
      plain: 'A N D Travel and Tours shall not be liable for delays, cancellations, losses, or changes resulting from events beyond its control, including but not limited to natural disasters, pandemics, government regulations, airline operational issues, strikes, political unrest, or acts of God.',
      items: [],
    },
    {
      title: 'Agreement',
      plain: 'By making a reservation and/or payment, the client confirms that they have read, understood, and agreed to all booking policies, payment terms, and conditions stated herein.',
      items: [],
    },
  ],
}

// ─── LegalModal Component ─────────────────────────────────────────────────────
interface Props {
  type:    LegalType
  onClose: () => void
}

export function LegalModal({ type, onClose }: Props) {
  const data  = type === 'terms' ? TERMS : BOOKING
  const title = type === 'terms'
    ? 'Terms and Conditions'
    : 'Booking Policy & Payment Terms'

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[88vh]
                   flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center">
              <FileText size={15} className="text-brand-orange" aria-hidden="true" />
            </span>
            <h2 className="font-heading font-bold text-base text-brand-black">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                       hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {/* Intro paragraph */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6 pb-6 border-b border-gray-100 italic">
            {data.intro}
          </p>

          {/* Sections */}
          <div className="space-y-6">
            {data.sections.map((sec, i) => (
              <div key={i}>
                <h3 className="font-semibold text-brand-black text-sm mb-2.5">
                  {sec.title}
                </h3>
                {sec.plain && (
                  <p className="text-gray-600 text-sm leading-relaxed">{sec.plain}</p>
                )}
                {sec.items.length > 0 && (
                  <ul className="space-y-2" role="list">
                    {sec.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-gray-600 text-sm leading-relaxed">
                        <span
                          className="mt-[5px] w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-400">A N D Travel and Tours · Bacoor, Cavite, Philippines</p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-orange text-white text-sm font-semibold
                       rounded-full hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}
