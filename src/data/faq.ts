export interface FAQItem {
  q: string
  a?: string
  list?: string[]
}

export interface FAQCategory {
  id:    string
  title: string
  items: FAQItem[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    title: 'General Questions',
    items: [
      {
        q: 'What services do you offer?',
        a: 'We provide a full range of travel services:',
        list: [
          'Domestic Air Ticket Booking',
          'International Air Ticket Booking',
          'Visa Processing Assistance',
          'Tour Packages (Local & International)',
          'Group Tours',
          'Hotel Reservations',
          'Travel Consultation',
        ],
      },
      {
        q: 'How can I book with your agency?',
        a: 'You may contact us through Facebook, WhatsApp, email, or visit our office. Our travel consultants will assist you with your travel requirements and provide available options.',
      },
      {
        q: 'Do I need to visit your office to book?',
        a: 'No. We can process bookings and payments online for your convenience.',
      },
    ],
  },
  {
    id: 'flights',
    title: 'Air Ticket Booking',
    items: [
      {
        q: 'Do you offer both domestic and international flights?',
        a: 'Yes. We offer airline tickets for both domestic and international destinations.',
      },
      {
        q: 'Can you find the cheapest available flights?',
        a: 'We always try to provide the best available fares based on your travel dates, destination, and preferences.',
      },
      {
        q: 'Can I change or cancel my flight ticket?',
        a: "Flight changes and cancellations depend on the airline's policies and fare rules. Applicable fees may apply.",
      },
      {
        q: 'How early should I book my flight?',
        a: 'For the best fares, we recommend booking:',
        list: [
          'Domestic flights: 1–3 months before departure',
          'International flights: 2–6 months before departure',
        ],
      },
    ],
  },
  {
    id: 'visa',
    title: 'Visa Processing',
    items: [
      {
        q: 'Do you guarantee visa approval?',
        a: 'No. Visa approval is solely at the discretion of the embassy or consulate. We assist with document preparation and application submission.',
      },
      {
        q: 'What countries do you process visas for?',
        a: 'We assist with tourist visa applications for various countries, including Japan, South Korea, Australia, Schengen countries, Canada, and more.',
      },
      {
        q: 'What documents are required for visa applications?',
        a: 'Requirements vary by country. We will provide a personalized checklist based on your destination and purpose of travel.',
      },
      {
        q: 'How long does visa processing take?',
        a: 'Processing times vary depending on the embassy and destination country. We recommend applying well in advance of your travel date.',
      },
    ],
  },
  {
    id: 'tours',
    title: 'Tour Packages',
    items: [
      {
        q: 'What is included in your tour packages?',
        list: [
          'Roundtrip airfare',
          'Hotel accommodation',
          'Airport transfers',
          'Tours and sightseeing',
          'Travel insurance (if applicable)',
          'Meals (depending on the package)',
        ],
      },
      {
        q: 'Can you customize a tour package?',
        a: 'Yes. We can create personalized itineraries based on your budget, destination, and travel preferences.',
      },
      {
        q: 'Do you offer installment payment options?',
        a: 'Installment availability depends on the package and booking conditions. Please inquire for details.',
      },
    ],
  },
  {
    id: 'group',
    title: 'Group Tours',
    items: [
      {
        q: 'What is a group tour?',
        a: 'A group tour is a pre-arranged trip where travelers join other participants and follow a scheduled itinerary with a tour leader or guide.',
      },
      {
        q: 'What are the advantages of joining a group tour?',
        a: 'Group tours offer many benefits:',
        list: [
          'Lower travel costs',
          'Hassle-free planning',
          'Guided sightseeing',
          'Opportunity to meet fellow travelers',
          'Coordinated transportation and accommodations',
        ],
      },
      {
        q: 'Do you organize private group tours?',
        a: 'Yes. We can arrange private group tours for families, friends, schools, churches, and corporate groups.',
      },
    ],
  },
  {
    id: 'hotel',
    title: 'Hotel Booking',
    items: [
      {
        q: 'Can you book hotels only without airfare?',
        a: 'Yes. We can assist with hotel reservations even if you do not require flight bookings.',
      },
      {
        q: 'Do you offer budget and luxury hotel options?',
        a: 'Yes. We provide accommodations ranging from budget-friendly hotels to luxury resorts.',
      },
      {
        q: 'Can I request a specific hotel?',
        a: 'Absolutely. We can check availability and provide rates for your preferred hotel.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Policies',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, online payments, e-wallets, and other available payment methods.',
      },
      {
        q: 'Is my booking refundable?',
        a: 'Refund policies depend on airlines, hotels, embassies, and suppliers. Terms and conditions will be explained before booking.',
      },
      {
        q: 'Why should I book through a travel agency?',
        a: 'Booking through a travel agency gives you professional assistance, travel advice, booking support, visa guidance, and help in case of travel disruptions.',
      },
      {
        q: 'How can I contact you?',
        a: 'Send us a message through our Facebook page, email, phone number, or WhatsApp for quick assistance.',
      },
    ],
  },
]
