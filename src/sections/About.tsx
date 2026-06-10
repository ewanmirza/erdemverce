import { useEffect, useRef, useState } from 'react';
import { fetchSiteTexts, defaultTexts, type SiteTexts } from '@/lib/data';
import { Star, Shield, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: '15+ Yıllık Deneyim',
    description: '2008\'den beri Aksaray\'da hizmet',
  },
  {
    icon: Shield,
    title: 'Güvenilir Hizmet',
    description: 'Binlerce memnun müşteri',
  },
  {
    icon: Clock,
    title: 'Hızlı Süreç',
    description: 'Profesyonel ve hızlı işlem',
  },
  {
    icon: Users,
    title: 'Geniş Portföy',
    description: 'Her bütçeye uygun seçenek',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [texts, setTexts] = useState<SiteTexts>(defaultTexts);

  useEffect(() => {
    fetchSiteTexts().then(setTexts);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.animate-item');
            elements.forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hakkimizda"
      ref={sectionRef}
      className="bg-cream"
      style={{ padding: '100px 4vw 80px' }}
    >
      <div className="content-max-width mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-10">
          {/* Left Content */}
          <div className="lg:col-span-5">
            <p
              className="animate-item font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-6"
              style={{ opacity: 0, transform: 'translateY(60px)', transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)' }}
            >
              HAKKIMIZDA
            </p>
            <h2
              className="animate-item font-display text-black mb-8"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                opacity: 0,
                transform: 'translateY(60px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.1s',
              }}
            >
              {texts.about_title}
            </h2>
            <p
              className="animate-item font-body text-black/80 mb-10 max-w-xl"
              style={{
                fontSize: '17px',
                fontWeight: 300,
                lineHeight: 1.7,
                opacity: 0,
                transform: 'translateY(60px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.2s',
              }}
            >
              {texts.about_text}
            </p>
            <button
              onClick={() => scrollTo('iletisim')}
              className="animate-item btn-primary"
              style={{
                opacity: 0,
                transform: 'translateY(60px)',
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transitionDelay: '0.3s',
              }}
            >
              Daha Fazla Bilgi
            </button>
          </div>

          {/* Right Content - Feature Badges */}
          <div className="lg:col-span-4 lg:col-start-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="animate-item bg-white p-8 shadow-card group hover:shadow-lg transition-shadow duration-300"
                    style={{
                      opacity: 0,
                      transform: 'translateY(60px)',
                      transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                      transitionDelay: `${0.3 + i * 0.1}s`,
                    }}
                  >
                    <Icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-body text-lg font-medium text-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm font-light text-mid-gray">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
