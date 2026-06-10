import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Home, ArrowLeft, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPropertyById, fetchSiteTexts, defaultTexts, phoneDigits, categoryLabel, type Property, type SiteTexts } from '@/lib/data';
import { setSeo } from '@/lib/seo';

export default function IlanDetay() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [texts, setTexts] = useState<SiteTexts>(defaultTexts);

  useEffect(() => {
    fetchSiteTexts().then(setTexts);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    fetchPropertyById(id).then((p) => {
      setProperty(p);
      setLoading(false);
      if (p) {
        setSeo({
          title: `${p.title} — ${p.price} | Aksaray Emlak`,
          description: `${categoryLabel(p.category)} · ${
            p.type === 'satilik' ? 'Satılık' : 'Kiralık'
          } · ${p.location}, Aksaray. ${p.description}`.slice(0, 160),
          path: `/ilan/${p.id}`,
        });
      }
    });
  }, [id]);

  const images = property?.images?.length ? property.images : property ? [property.image_url] : [];

  return (
    <div className="min-h-[100dvh] bg-cream">
      <header className="bg-black" style={{ padding: '0 4vw' }}>
        <div className="content-max-width mx-auto flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gold" />
            <span className="font-display text-xl font-normal text-white">
              AKSARAY EMLAK
            </span>
          </Link>
          <Link
            to="/ilanlar"
            className="flex items-center gap-2 font-body text-sm uppercase tracking-[0.05em] text-white hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm İlanlar
          </Link>
        </div>
      </header>

      <main style={{ padding: '50px 4vw 120px' }}>
        <div className="content-max-width mx-auto">
          {loading ? (
            <p className="font-body text-mid-gray">İlan yükleniyor…</p>
          ) : !property ? (
            <div>
              <h1 className="font-display text-3xl text-black mb-4">
                İlan bulunamadı
              </h1>
              <p className="font-body text-mid-gray mb-6">
                Aradığınız ilan kaldırılmış veya bağlantı hatalı olabilir.
              </p>
              <Link to="/ilanlar" className="btn-primary inline-block">
                Tüm İlanlara Dön
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              {/* Galeri */}
              <div className="lg:col-span-3">
                <div className="relative overflow-hidden bg-black">
                  <img
                    src={images[activeImage]}
                    alt={`${property.title} — fotoğraf ${activeImage + 1}`}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImage((i) => (i - 1 + images.length) % images.length)
                        }
                        aria-label="Önceki fotoğraf"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-2 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                        aria-label="Sonraki fotoğraf"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-2 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white font-body text-xs px-3 py-1">
                        {activeImage + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {images.map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => setActiveImage(i)}
                        className={`overflow-hidden border-2 transition-colors ${
                          i === activeImage ? 'border-gold' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bilgiler */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`font-body text-xs uppercase tracking-[0.05em] px-3 py-1 ${
                      property.type === 'satilik'
                        ? 'bg-gold text-black'
                        : 'bg-black text-white'
                    }`}
                  >
                    {property.type === 'satilik' ? 'Satılık' : 'Kiralık'}
                  </span>
                  <span className="font-body text-xs uppercase tracking-[0.05em] px-3 py-1 border border-black/20 text-black">
                    {categoryLabel(property.category)}
                  </span>
                </div>

                <h1
                  className="font-display text-black mb-3"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, lineHeight: 1.15 }}
                >
                  {property.title}
                </h1>

                <p className="flex items-center gap-1.5 font-body text-muted-gold mb-6">
                  <MapPin className="w-4 h-4" />
                  {property.location}, Aksaray
                </p>

                <p className="font-body text-3xl font-medium text-gold mb-8">
                  {property.price}
                </p>

                {property.description && (
                  <>
                    <h2 className="font-body text-xs uppercase tracking-[0.1em] text-muted-gold mb-3">
                      İLAN AÇIKLAMASI
                    </h2>
                    <p className="font-body text-mid-gray font-light leading-relaxed mb-10 whitespace-pre-line">
                      {property.description}
                    </p>
                  </>
                )}

                <a
                  href={`tel:+${phoneDigits(texts.phone)}`}
                  className="flex items-center justify-center gap-2 bg-black text-white font-body text-sm uppercase tracking-[0.05em] py-4 px-8 hover:bg-gold hover:text-black transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Bu İlan İçin Bizi Arayın
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
