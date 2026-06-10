import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { fetchProperties, type Property } from '@/lib/data';

function FeaturedProperty({
  property,
  index,
}: {
  property: Property & { number: string };
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-24 last:mb-0 ${
        index % 2 === 1 ? 'lg:direction-rtl' : ''
      }`}
    >
      {/* Image */}
      <div
        className={`overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}
        style={{ perspective: '1000px' }}
      >
        <div
          className="overflow-hidden"
          style={{
            opacity: visible ? 1 : 0.2,
            transform: visible ? 'rotateX(0deg)' : 'rotateX(40deg)',
            transition: 'all 1.2s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full aspect-[3/2] object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className={`${index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`}>
        {/* Property Number */}
        <span
          className="font-display text-gold/20 block mb-4"
          style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: 400,
            lineHeight: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          {property.number}
        </span>

        {/* Title with character animation */}
        <h3
          className="font-display text-black mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
            transitionDelay: '0.15s',
          }}
        >
          {property.title}
        </h3>

        <p
          className="font-body text-mid-gray max-w-md"
          style={{
            fontSize: '17px',
            fontWeight: 300,
            lineHeight: 1.7,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
            transitionDelay: '0.25s',
          }}
        >
          {property.description}
        </p>

        <Link
          to={`/ilan/${property.id}`}
          className="btn-primary mt-6 inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
            transitionDelay: '0.35s',
          }}
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
}

export default function Properties() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperties().then(setProperties);
  }, []);

  const featured = properties
    .filter((p) => p.featured)
    .slice(0, 4)
    .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') }));
  const others = properties.filter((p) => !p.featured).slice(0, 6);

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
      id="ilanlar"
      className="bg-cream"
      style={{ padding: '120px 4vw' }}
    >
      <div className="content-max-width mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-20">
          <p
            className="font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-6"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
            }}
          >
            ÖNE ÇIKAN İLANLAR
          </p>
          <h2
            className="font-display text-black"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
              transitionDelay: '0.1s',
            }}
          >
            Aksaray'ın En İyi Lokasyonlarından Seçmeler
          </h2>
        </div>

        {/* Featured Properties */}
        <div className="mb-24">
          {featured.map((property, i) => (
            <FeaturedProperty key={property.id} property={property} index={i} />
          ))}
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((card, i) => (
            <PropertyCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Tüm ilanlar */}
        <div className="mt-16 text-center">
          <Link
            to="/ilanlar"
            className="inline-block btn-primary"
          >
            Tüm İlanları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({
  card,
  index,
}: {
  card: Property;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Link
      to={`/ilan/${card.id}`}
      ref={cardRef}
      className="bg-white shadow-card overflow-hidden group cursor-pointer block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
      }}
    >
      <div className="overflow-hidden">
        <img
          src={card.image_url}
          alt={card.title}
          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-600"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h4 className="font-body text-xl font-medium text-black mb-1">
          {card.title}
        </h4>
        <p className="font-body text-sm font-light text-muted-gold mb-3">
          {card.location}
        </p>
        <p className="font-body text-2xl font-medium text-gold">
          {card.price}
        </p>
      </div>
    </Link>
  );
}
