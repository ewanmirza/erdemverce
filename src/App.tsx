import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Properties from './sections/Properties'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="min-h-[100dvh]">
      <Hero />
      <About />
      <Services />
      <Properties />
      <Contact />
    </div>
  )
}
