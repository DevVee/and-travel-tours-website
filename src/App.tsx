import { MotionConfig } from 'framer-motion'
import { Header }        from '@layout/Header'
import { Footer }        from '@layout/Footer'
import { Hero }          from '@sections/Hero'
import { About }         from '@sections/About'
import { MissionVision } from '@sections/MissionVision'
import { WhyChooseUs }   from '@sections/WhyChooseUs'
import { ServicesVisual }from '@sections/ServicesVisual'
import { Destinations }  from '@sections/Destinations'
import { Contact }       from '@sections/Contact'

function App() {
  return (
    // MotionConfig: respect OS-level "prefers reduced motion" for all Framer Motion
    // animations — WCAG 2.3.3 Animation from Interactions (AAA)
    <MotionConfig reducedMotion="user">

      {/* ── Skip to main content — WCAG 2.4.1 (Bypass Blocks) ───────────────
          Visually hidden until focused via keyboard Tab, then appears as an
          orange pill at the top-left corner of the screen.
      ──────────────────────────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-brand-orange focus:text-white focus:px-5 focus:py-2.5 focus:rounded-full focus:font-semibold focus:text-sm focus:shadow-orange"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-white">
        <Header />

        <main id="main-content">
          <Hero />
          <About />
          <MissionVision />
          <WhyChooseUs />
          <ServicesVisual />
          <Destinations />
          {/* Credentials hidden — will be restored when real document scans are ready */}
          {/* <Credentials /> */}
          <Contact />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
