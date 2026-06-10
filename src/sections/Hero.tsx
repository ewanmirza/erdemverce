import { useState, useEffect } from 'react';
import { Home, Menu, X, Phone } from 'lucide-react';

export default function Hero() {
  const [loaderPhase, setLoaderPhase] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setLoaderPhase('exiting'), 1500);
    const timer2 = setTimeout(() => setLoaderPhase('done'), 2800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loaderText = 'AKSARAY';

  return (
    <>
      {/* Loader */}
      {loaderPhase !== 'done' && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-all duration-700 ${
            loaderPhase === 'exiting' ? 'translate-x-full skew-x-12' : 'translate-x-0'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)' }}
        >
          <div className="loader-stripes absolute inset-0 opacity-20" />
          <div className="relative z-10 text-center">
            <div className="flex justify-center overflow-hidden">
              {loaderText.split('').map((char, i) => (
                <span
                  key={i}
                  className={`inline-block font-display text-white transition-transform duration-700 ${
                    loaderPhase === 'loading'
                      ? 'translate-y-0'
                      : loaderPhase === 'exiting'
                      ? '-translate-y-full'
                      : 'translate-y-full'
                  }`}
                  style={{
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    fontWeight: 400,
                    transitionDelay: `${i * 0.08}s`,
                    transitionTimingFunction:
                      loaderPhase === 'loading'
                        ? 'cubic-bezier(0.16, 1, 0.3, 1)'
                        : 'cubic-bezier(0.7, 0, 0.84, 0)',
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
            <div
              className={`mx-auto mt-4 h-[6px] w-[200px] bg-gold transition-transform duration-700 origin-left ${
                loaderPhase === 'loading' ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{
                transitionDelay: loaderPhase === 'loading' ? '0.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)',
                transformOrigin: loaderPhase === 'loading' ? 'left' : 'right',
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
        style={{ paddingLeft: '4vw', paddingRight: '4vw' }}
      >
        <div className="flex items-center justify-between content-max-width mx-auto">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 group"
          >
            <Home
              className={`w-5 h-5 transition-colors duration-300 ${
                scrolled ? 'text-gold' : 'text-gold'
              }`}
            />
            <span
              className={`font-display text-xl font-normal transition-colors duration-300 ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              AKSARAY EMLAK
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Anasayfa', id: 'hero' },
              { label: 'Hakkımızda', id: 'hakkimizda' },
              { label: 'Hizmetler', id: 'hizmetler' },
              { label: 'İlanlar', id: 'ilanlar' },
              { label: 'İletişim', id: 'iletisim' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`font-body text-sm font-normal uppercase tracking-[0.05em] transition-colors duration-300 hover:text-gold ${
                  scrolled ? 'text-black' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+903820000000"
              className={`hidden sm:flex items-center gap-2 btn-primary ${
                scrolled ? '' : 'bg-gold text-black'
              }`}
            >
              <Phone className="w-4 h-4" />
              Bizi Arayın
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-black transition-all duration-500 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {[
            { label: 'Anasayfa', id: 'hero' },
            { label: 'Hakkımızda', id: 'hakkimizda' },
            { label: 'Hizmetler', id: 'hizmetler' },
            { label: 'İlanlar', id: 'ilanlar' },
            { label: 'İletişim', id: 'iletisim' },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-display text-3xl text-white hover:text-gold transition-all duration-500 ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 0.05}s` : '0s' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[100dvh] bg-black overflow-hidden flex items-center justify-center"
      >
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster="/images/hero-building.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Gold gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 75% 85%, rgba(201, 169, 98, 0.25) 0%, transparent 60%)',
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 hidden lg:block">
          <div
            className={`w-[12vw] aspect-square bg-gold transition-all duration-[1500ms] ${
              loaderPhase === 'done' ? 'opacity-60 scale-100' : 'opacity-0 scale-80'
            }`}
            style={{ transitionDelay: '3s' }}
          />
        </div>
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block">
          <div
            className={`w-[12vw] aspect-square border-[40px] border-gold bg-transparent transition-all duration-[1500ms] ${
              loaderPhase === 'done' ? 'opacity-50 scale-100' : 'opacity-0 scale-70'
            }`}
            style={{ transitionDelay: '3.2s' }}
          />
        </div>
        <div className="absolute right-[15%] top-[45%] hidden lg:block">
          <div
            className={`w-[10vw] aspect-square bg-gold rounded-full transition-all duration-[1500ms] ${
              loaderPhase === 'done' ? 'opacity-40 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '3.4s' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1
            className={`font-display text-white uppercase transition-opacity duration-1000 ${
              loaderPhase === 'done' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              fontSize: 'clamp(3rem, 10vw, 10rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              lineHeight: 0.85,
              transitionDelay: '0.3s',
            }}
          >
            <span className="block">AKSARAY'IN</span>
            <span className="block mt-2">PREMİER EMLAK</span>
          </h1>

          <div
            className={`mt-10 transition-opacity duration-1000 ${
              loaderPhase === 'done' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '0.8s' }}
          >
            <button onClick={() => scrollTo('ilanlar')} className="btn-primary text-base px-10 py-4">
              İlanları İncele
            </button>
          </div>
        </div>

        {/* Bottom Label */}
        <div
          className={`absolute bottom-8 left-0 transition-opacity duration-1000 ${
            loaderPhase === 'done' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ paddingLeft: '4vw', transitionDelay: '1s' }}
        >
          <p className="font-body text-xs font-normal uppercase tracking-[0.1em] text-white/60">
            Aksaray'da Güvenilir Emlak Çözümleri
          </p>
        </div>

        {/* Hero Image */}
        <div
          className={`absolute bottom-8 right-0 w-[90vw] md:w-[50vw] lg:w-[35vw] overflow-hidden transition-all duration-[1500ms] ${
            loaderPhase === 'done' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ paddingRight: '4vw', transitionDelay: '0.5s' }}
        >
          <img
            src="/images/hero-building.jpg"
            alt="Aksaray'da modern konut"
            className="w-full aspect-[3/2] object-cover"
            fetchPriority="high"
          />
        </div>
      </section>
    </>
  );
}
