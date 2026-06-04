import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Share2, Menu, X } from 'lucide-react'
import { useScrolled }       from '@hooks/useScrolled'
import { useActiveSection }  from '@hooks/useActiveSection'
import { mobileMenuVariants } from '@lib/animations'
import { BrandLogo }         from '@ui/BrandLogo'
import { CONTACT }           from '@data/contact'
import { cn }                from '@lib/utils'

const navLinks = [
  { label: 'Home',         href: '#home',         sectionId: 'home' },
  { label: 'About Us',     href: '#about',        sectionId: 'about' },
  { label: 'Services',     href: '#packages',     sectionId: 'packages' },
  { label: 'Destinations', href: '#destinations', sectionId: 'destinations' },
]

const SECTION_IDS = navLinks.map(l => l.sectionId)

// Smooth scroll helper — works on all browsers including mobile Safari
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Header() {
  const scrolled     = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
    e.preventDefault()
    setMenuOpen(false)
    // Small delay so mobile menu animation completes before scrolling
    setTimeout(() => scrollToSection(sectionId), menuOpen ? 200 : 0)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-card'
          : 'bg-transparent'
      )}
    >
      {/* ── Top Bar — hidden when scrolled ────────────── */}
      <div className={cn(
        'bg-brand-black text-white text-xs overflow-hidden transition-all duration-400',
        scrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-10 opacity-100'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <a href={CONTACT.phoneTel} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <Phone size={11} aria-hidden="true" /><span>{CONTACT.phoneFormatted}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href={CONTACT.emailHref} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <Mail size={11} aria-hidden="true" /><span className="hidden md:inline">{CONTACT.email}</span>
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <Share2 size={11} aria-hidden="true" /><span className="hidden sm:inline">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Nav ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={cn(
          'flex items-center justify-between transition-all duration-400',
          scrolled ? 'h-14' : 'h-16'
        )}>

          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center group">
            <BrandLogo
              height={scrolled ? 40 : 60}
              variant={scrolled ? 'dark' : 'light'}
              scrolled={scrolled}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map(link => {
              const isActive = activeSection === link.sectionId
              return (
                <a key={link.href} href={link.href}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg transition-all duration-200 whitespace-nowrap',
                    isActive
                      ? scrolled
                        ? 'text-brand-orange font-semibold bg-orange-50'
                        : 'text-white font-semibold underline underline-offset-4'
                      : scrolled
                        ? 'text-gray-700 font-medium hover:text-brand-orange hover:bg-orange-50'
                        : 'text-white/85 font-medium hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </a>
              )
            })}
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}
              className="ml-2 px-5 py-2 bg-brand-orange text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-orange">
              Contact Us
            </a>
          </nav>

          {/* Mobile Burger
              FIX M-05: Added aria-expanded and aria-controls for screen-reader support.
          */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn('lg:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-brand-black hover:bg-gray-100' : 'text-white hover:bg-white/10')}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden bg-white border-t border-gray-100 shadow-card-lg overflow-hidden"
          >
            <nav
              className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {navLinks.map(link => (
                <a key={link.href} href={link.href}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  aria-current={activeSection === link.sectionId ? 'page' : undefined}
                  className={cn(
                    'px-4 py-3 font-medium rounded-lg transition-colors text-sm',
                    activeSection === link.sectionId
                      ? 'text-brand-orange bg-orange-50 font-semibold'
                      : 'text-gray-700 hover:text-brand-orange hover:bg-orange-50'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}
                className="mt-1 px-5 py-3 bg-brand-orange text-white font-semibold rounded-full text-center hover:bg-orange-600 transition-colors text-sm">
                Contact Us
              </a>
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-500">
                <a href={CONTACT.phoneTel} className="flex items-center gap-2 hover:text-brand-orange py-1">
                  <Phone size={14} aria-hidden="true" /> {CONTACT.phoneFormatted}
                </a>
                <a href={CONTACT.emailHref} className="flex items-center gap-2 hover:text-brand-orange py-1">
                  <Mail size={14} aria-hidden="true" /> {CONTACT.email}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
