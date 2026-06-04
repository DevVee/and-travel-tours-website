import { Phone, Mail, MapPin, Share2, MessageCircle, ArrowRight } from 'lucide-react'
import { BrandLogo } from '@ui/BrandLogo'

const quickLinks = ['Home', 'About Us', 'Services', 'Destinations', 'Packages', 'Credentials', 'Contact']
const serviceLinks = ['Domestic Tours', 'International Tours', 'Airline Ticketing', 'Hotel Reservations', 'Visa Assistance', 'Group Travel']
const destinations = ['Japan', 'South Korea', 'Singapore', 'Thailand', 'Hong Kong', 'Vietnam', 'Europe', 'Dubai', 'Maldives', 'Taiwan', 'Bali', 'Turkey', '& Many More...']

export function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      {/* CTA Band */}
      <div className="bg-gradient-orange py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/85 mb-6 text-sm md:text-base">
            Talk to our travel experts today and get a free personalized itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-orange font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm"
            >
              Get Free Quote <ArrowRight size={16} />
            </a>
            <a
              href="https://www.facebook.com/messages/t/61590018405492"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 text-white font-semibold rounded-full hover:bg-white/25 transition-colors border border-white/30 text-sm"
            >
              <MessageCircle size={16} /> Chat on Messenger
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <BrandLogo height={56} variant="light" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              A duly registered travel agency based in Bacoor, Cavite, Philippines, committed to providing reliable, affordable, and customer-focused travel solutions.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61590018405492"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label="Facebook"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://www.facebook.com/messages/t/61590018405492"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label="Messenger"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-white/60 text-sm hover:text-brand-orange transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0 duration-200" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Destinations</h4>
            <ul className="space-y-2.5">
              {destinations.map(dest => (
                <li key={dest}>
                  <a
                    href="#destinations"
                    className="text-white/60 text-sm hover:text-brand-orange transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0 duration-200" />
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:09755614712" className="flex items-start gap-3 text-white/60 hover:text-brand-orange transition-colors group">
                  <Phone size={15} className="mt-0.5 shrink-0 group-hover:text-brand-orange" />
                  <span className="text-sm">0975 561 4712<br />0915 923 4547</span>
                </a>
              </li>
              <li>
                <a href="mailto:A.travelandtours@gmail.com" className="flex items-start gap-3 text-white/60 hover:text-brand-orange transition-colors group">
                  <Mail size={15} className="mt-0.5 shrink-0 group-hover:text-brand-orange" />
                  <span className="text-sm">A.travelandtours@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span className="text-sm">Bacoor, Cavite, Philippines</span>
              </li>
            </ul>
            {/* Services quick list */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Our Services</h4>
              <ul className="space-y-2">
                {serviceLinks.map(s => (
                  <li key={s}>
                    <a href="#services" className="text-white/60 text-sm hover:text-brand-orange transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© 2024 A N D Travel and Tours. All Rights Reserved.</span>
          <span className="text-brand-gold italic font-medium">Your Journey, Our Priority</span>
        </div>
      </div>
    </footer>
  )
}
