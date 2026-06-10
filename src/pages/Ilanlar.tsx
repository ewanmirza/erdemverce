import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Home, ArrowLeft, MapPin } from 'lucide-react';
import { fetchProperties, type Property } from '@/lib/data';

type Filter = 'hepsi' | 'satilik' | 'kiralik';

export default function Ilanlar() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('hepsi');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperties().then((p) => {
      setProperties(p);
      setLoading(false);
    });
  }, []);

  const filtered =
    filter === 'hepsi' ? properties : properties.filter((p) => p.type === filter);

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Header */}
      <header
        className="bg-black"
        style={{ padding: '0 4vw' }}
      >
        <div className="content-max-width mx-auto flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gold" />
            <span className="font-display text-xl font-normal text-white">
              AKSARAY EMLAK
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 font-body text-sm uppercase tracking-[0.05em] text-white hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Anasayfa
          </Link>
        </div>
      </header>

      <main style={{ padding: '60px 4vw 120px' }}>
        <div className="content-max-width mx-auto">
          {/* Page title */}
          <p className="font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-4">
            PORTFÖYÜMÜZ
          </p>
          <h1
            className="font-display text-black mb-10"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1 }}
          >
            Tüm İlanlar
          </h1>

          {/* Filter */}
          <div className="flex gap-3 mb-12">
            {(
              [
                { key: 'hepsi', label: 'Hepsi' },
                { key: 'satilik', label: 'Satılık' },
                { key: 'kiralik', label: 'Kiralık' },
              ] as { key: Filter; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`font-body text-sm uppercase tracking-[0.05em] px-5 py-2 border transition-colors duration-300 ${
                  filter === f.key
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-black border-black/20 hover:border-black'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <p className="font-body text-mid-gray">İlanlar yükleniyor…</p>
          ) : filtered.length === 0 ? (
            <p className="font-body text-mid-gray">
              Bu kategoride henüz ilan bulunmuyor.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white shadow-card overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-4 left-4 font-body text-xs uppercase tracking-[0.05em] px-3 py-1 ${
                        p.type === 'satilik'
                          ? 'bg-gold text-black'
                          : 'bg-black text-white'
                      }`}
                    >
                      {p.type === 'satilik' ? 'Satılık' : 'Kiralık'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-body text-xl font-medium text-black mb-1">
                      {p.title}
                    </h3>
                    <p className="flex items-center gap-1 font-body text-sm font-light text-muted-gold mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {p.location}
                    </p>
                    <p className="font-body text-sm font-light text-mid-gray mb-4 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="font-body text-2xl font-medium text-gold">
                      {p.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
