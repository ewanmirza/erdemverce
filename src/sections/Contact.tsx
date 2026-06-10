import { useEffect, useRef, useState } from 'react';
import { fetchSiteTexts, defaultTexts, phoneDigits, type SiteTexts } from '@/lib/data';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [texts, setTexts] = useState<SiteTexts>(defaultTexts);

  useEffect(() => {
    fetchSiteTexts().then(setTexts);
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="iletisim" ref={sectionRef} className="bg-black">
      {/* Contact Area */}
      <div style={{ padding: '100px 4vw 60px' }}>
        <div className="content-max-width mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <p
              className="font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              İLETİŞİM
            </p>
            <h2
              className="font-display text-white"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.1s',
              }}
            >
              Bize Ulaşın
            </h2>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Column 1 - Info */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.2s',
              }}
            >
              <h3 className="font-body text-lg font-medium text-white mb-6">
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                <a
                  href={`tel:+${phoneDigits(texts.phone)}`}
                  className="flex items-center gap-3 font-body text-base font-light text-white/80 hover:text-gold transition-colors duration-300"
                >
                  <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                  {texts.phone}
                </a>
                <a
                  href={`mailto:${texts.email}`}
                  className="flex items-center gap-3 font-body text-base font-light text-white/80 hover:text-gold transition-colors duration-300"
                >
                  <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                  {texts.email}
                </a>
                <div className="flex items-start gap-3 font-body text-base font-light text-white/80">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>{texts.address}</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-8">
                <a
                  href={texts.facebook || '#'}
                  target={texts.facebook ? '_blank' : undefined}
                  rel={texts.facebook ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:text-gold hover:border-gold transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={texts.instagram || '#'}
                  target={texts.instagram ? '_blank' : undefined}
                  rel={texts.instagram ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:text-gold hover:border-gold transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://wa.me/${phoneDigits(texts.phone)}`}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:text-gold hover:border-gold transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.3s',
              }}
            >
              <h3 className="font-body text-lg font-medium text-white mb-6">
                Hızlı Linkler
              </h3>
              <nav className="space-y-3">
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
                    className="block font-body text-base font-light text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Column 3 - Working Hours */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.4s',
              }}
            >
              <h3 className="font-body text-lg font-medium text-white mb-6">
                Çalışma Saatleri
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-base font-light text-white">
                      Pazartesi - Cuma
                    </p>
                    <p className="font-body text-base font-light text-white/60">
                      09:00 - 18:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-base font-light text-white">
                      Cumartesi
                    </p>
                    <p className="font-body text-base font-light text-white/60">
                      10:00 - 14:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-base font-light text-white">
                      Pazar
                    </p>
                    <p className="font-body text-base font-light text-white/60">
                      Kapalı
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        className="border-t border-white/10"
        style={{ padding: '40px 4vw' }}
      >
        <div className="content-max-width mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm font-light text-white/40">
            © 2025 Aksaray Emlak. Tüm hakları saklıdır.
          </p>
          <p className="font-body text-sm font-light text-white/40">
            Aksaray'da Emlak
          </p>
        </div>
      </div>
    </footer>
  );
}
