import { useEffect, useRef, useState } from 'react';
import { Home, Key, TrendingUp, Users, FileCheck } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Satış',
    description: 'Aksaray\'da daire, villa ve arsa satış işlemlerinizde profesyonel destek.',
  },
  {
    icon: Key,
    title: 'Kiralama',
    description: 'Güvenilir kiracı ve ev sahibi buluşturma hizmeti.',
  },
  {
    icon: TrendingUp,
    title: 'Değerleme',
    description: 'Uzman değerleme ekibimizle gayrimenkulünüzün gerçek değerini öğrenin.',
  },
  {
    icon: Users,
    title: 'Danışmanlık',
    description: 'Yatırım danışmanlığı ve pazar analizi hizmetleri.',
  },
  {
    icon: FileCheck,
    title: 'Tapu İşlemleri',
    description: 'Tapu devri ve tüm resmi işlemlerde yardımcı oluyoruz.',
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 150);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          opacity: visible ? 1 : 0,
          translate: visible ? '0 0' : '0 60px',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease, translate 0.8s ease',
          transitionDelay: visible ? '0s' : `${index * 0.15}s`,
        }}
      >
        {/* Front Face */}
        <div
          className="bg-charcoal p-10 min-h-[280px] flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Icon className="w-12 h-12 text-gold mb-6" />
          <h3 className="font-body text-xl font-medium text-white">{service.title}</h3>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-gold p-10 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h3 className="font-body text-xl font-medium text-black mb-4">{service.title}</h3>
          <p className="font-body text-[15px] font-normal text-black/80 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hizmetler"
      className="bg-black"
      style={{ padding: '100px 4vw' }}
    >
      <div className="content-max-width mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16">
          <p
            className="font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-6"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
            }}
          >
            HİZMETLERİMİZ
          </p>
          <h2
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
              transitionDelay: '0.1s',
            }}
          >
            Kapsamlı Emlak Hizmetleri
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
