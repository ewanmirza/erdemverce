import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Properties from './sections/Properties'
import Contact from './sections/Contact'
import Ilanlar from './pages/Ilanlar'
import IlanDetay from './pages/IlanDetay'
import Admin from './pages/Admin'
import { setSeo } from './lib/seo'

function Home() {
  useEffect(() => {
    setSeo({
      title: "Aksaray Emlak | Erdem Emlak — Aksaray'da Satılık & Kiralık Daire, Arsa, Villa",
      description:
        "Aksaray'da 15+ yıllık deneyimle güvenilir emlak danışmanlığı. Satılık daire, kiralık daire, 1+1, 2+1, 3+1 daireler, arsa, villa, dükkan ve işyeri ilanları. Değerleme ve tapu işlemleri.",
      path: '/',
    });
  }, []);
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
      <Route path="/ilan/:id" element={<IlanDetay />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
