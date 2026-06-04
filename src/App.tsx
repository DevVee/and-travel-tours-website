import { Header } from '@layout/Header'
import { Footer } from '@layout/Footer'
import { Hero } from '@sections/Hero'
import { About } from '@sections/About'
import { MissionVision } from '@sections/MissionVision'
import { WhyChooseUs } from '@sections/WhyChooseUs'
import { ServicesVisual } from '@sections/ServicesVisual'
import { Destinations } from '@sections/Destinations'
import { Contact } from '@sections/Contact'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <MissionVision />
        <WhyChooseUs />
        <ServicesVisual />
        <Destinations />
        {/* Credentials hidden — will be added later with real documents */}
        {/* <Credentials /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
