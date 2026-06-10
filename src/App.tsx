import { Routes, Route } from 'react-router'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Properties from './sections/Properties'
import Contact from './sections/Contact'
import Ilanlar from './pages/Ilanlar'
import Admin from './pages/Admin'

function Home() {
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ilanlar" element={<Ilanlar />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
