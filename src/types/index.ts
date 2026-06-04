export interface HeroSlide {
  id: number
  imageUrl: string
  location: string
  headline: string
  headline2: string
  subCopy: string
}

export interface Destination {
  id: number
  name: string
  /** ISO 3166-1 alpha-2 code used with flagcdn.com — 'eu' for Schengen */
  flagCode: string
  imageUrl: string
  shortDesc: string
  badge?: string
  slug: string
}

export interface Service {
  id: number
  title: string
  description: string
  iconName: string
  features: string[]
}

export interface Package {
  id: number
  title: string
  destination: string
  imageUrl: string
  nights: number
  days: number
  price: number
  originalPrice?: number
  includes: string[]
  badge?: string
}

export interface Testimonial {
  id: number
  name: string
  location: string
  avatarUrl: string
  rating: number
  text: string
  destination: string
}

export interface TrustStat {
  id: number
  value: number
  suffix: string
  label: string
  iconName: string
}
