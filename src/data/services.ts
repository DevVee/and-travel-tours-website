import type { Service } from '@/types'

export const services: Service[] = [
  {
    id: 1,
    title: 'Domestic Tour Packages',
    description: 'Explore the beauty of the Philippines through carefully planned travel packages to Palawan, Cebu, Bohol, Siargao, and more.',
    iconName: 'MapPin',
    features: ['Customized itineraries', 'All-in packages', 'Expert local guides', 'Group & private tours'],
  },
  {
    id: 2,
    title: 'International Tour Packages',
    description: 'Discover exciting destinations worldwide with curated travel packages covering Asia, Europe, and the Middle East.',
    iconName: 'Globe',
    features: ['8+ Asian destinations', 'European grand tours', 'Visa-ready assistance', 'Budget & premium tiers'],
  },
  {
    id: 3,
    title: 'Airline Ticket Booking',
    description: 'Competitive airfare options for domestic and international flights, ensuring the best value for every route.',
    iconName: 'Plane',
    features: ['Lowest fare guarantee', 'All major airlines', 'Roundtrip & one-way', 'Group booking discounts'],
  },
  {
    id: 4,
    title: 'Hotel Reservations',
    description: 'Comfortable and budget-friendly accommodation arrangements tailored to your preferences and destination.',
    iconName: 'Hotel',
    features: ['3–5 star hotels', 'Beachfront & city', 'Best rate guarantee', 'Breakfast inclusions'],
  },
  {
    id: 5,
    title: 'Visa Assistance',
    description: 'Expert guidance and support for visa application requirements, documentation, and processing for all destinations.',
    iconName: 'FileCheck',
    features: ['Japan, Korea, Europe', 'Document checklist', 'Application review', 'High approval rate'],
  },
  {
    id: 6,
    title: 'Group & Corporate Travel',
    description: 'Customized travel solutions for organizations, businesses, events, and group tours with dedicated account managers.',
    iconName: 'Users',
    features: ['10+ pax group rates', 'MICE packages', 'Team building tours', 'Dedicated coordinator'],
  },
]
