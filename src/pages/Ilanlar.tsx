import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Home, ArrowLeft, MapPin, Search } from 'lucide-react';
import { fetchProperties, CATEGORIES, categoryLabel, type Property } from '@/lib/data';
import { setSeo } from '@/lib/seo';

type TypeFilter = 'hepsi' | 'satilik' | 'kiralik';

export default function Ilanlar() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('hepsi');
  const [categoryFilter, setCategoryFilter] = useState<string>('hepsi');
  const [mahalleFilter, setMahalleFilter] = useState<string>('hepsi');
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setSeo({
      title: 'Aksaray Satılık ve Kiralık İlanlar | Daire, Arsa, Villa, Dükkan — Aksaray Emlak',
      description:
        "Aksaray'da satılık daire, kiralık daire, arsa, villa, dükkan ve işyeri ilanları. Kılıçarslan, Yenidoğan, Zafer, Hamidiye ve tüm Aksaray mahalleleri. Erdem Emlak güvencesiyle.",
      path: '/ilanlar',
    });
    fetchProperties().then((p) => {
      setProperties(p);
      setLoading(false);
    });
  }, []);

  // Mahalle listesi mevcut ilanlardan türetilir
  const mahalleler = useMemo(() => {
    const set = new Set(properties.map((p) => p.location).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return properties.filter((p) => {
      if (typeFilter !== 'hepsi' && p.type !== typeFilter) return false;
      if (categoryFilter !== 'hepsi' && p.category !== categoryFilter) return false;
      if (mahalleFilter !== 'hepsi' && p.location !== mahalleFilter) return false;
      if (q) {
        const hay = `${p.title} ${p.description} ${p.location} ${categoryLabel(
          p.category
        )} ${p.price}`.toLocaleLowerCase('tr');
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [properties, typeFilter, categoryFilter, mahalleFilter, query]);

  const resetFilters = () => {
    setTypeFilter('hepsi');
    setCategoryFilter('hepsi');
    setMahalleFilter('hepsi');
    setQuery('');
  };

  const hasActiveFilter =
    typeFilter !== 'hepsi' ||
    categoryFilter !== 'hepsi' ||
    mahalleFilter !== 'hepsi' ||
    query.trim() !== '';

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Header */}
      <header className="bg-black" style={{ padding: '0 4vw' }}>
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
          <p className="font-body text-xs font-normal uppercase tracking-[0.1em] text-muted-gold mb-4">
            PORTFÖYÜMÜZ
          </p>
          <h1
            className="font-display text-black mb-10"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1 }}
          >
            Aksaray'daki Tüm İlanlar
          </h1>

          {/* Hızlı arama: kategori çipleri */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setCategoryFilter('hepsi')}
              className={`font-body text-sm px-4 py-2 border transition-colors duration-300 ${
                categoryFilter === 'hepsi'
                  ? 'bg-gold text-black border-gold'
                  : 'bg-transparent text-black border-black/20 hover:border-gold'
              }`}
            >
              Tümü
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                className={`font-body text-sm px-4 py-2 border transition-colors duration-300 ${
                  categoryFilter === c.key
                    ? 'bg-gold text-black border-gold'
                    : 'bg-transparent text-black border-black/20 hover:border-gold'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Filtre satırı */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {/* Satılık / Kiralık */}
            <div className="flex">
              {(
                [
                  { key: 'hepsi', label: 'Hepsi' },
                  { key: 'satilik', label: 'Satılık' },
                  { key: 'kiralik', label: 'Kiralık' },
                ] as { key: TypeFilter; label: string }[]
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`font-body text-sm uppercase tracking-[0.05em] px-4 py-2.5 border transition-colors duration-300 -ml-px first:ml-0 ${
                    typeFilter === f.key
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black/20 hover:border-black'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Mahalle */}
            <select
              value={mahalleFilter}
              onChange={(e) => setMahalleFilter(e.target.value)}
              className="font-body text-sm px-4 py-2.5 border border-black/20 bg-white text-black focus:outline-none focus:border-gold"
            >
              <option value="hepsi">Tüm Mahalleler</option>
              {mahalleler.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Serbest arama */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara: 1+1, 3+1, bahçeli, asansörlü…"
                className="w-full font-body text-sm pl-9 pr-4 py-2.5 border border-black/20 bg-white focus:outline-none focus:border-gold"
              />
            </div>

            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="font-body text-sm text-muted-gold underline underline-offset-4 hover:text-black transition-colors"
              >
                Filtreleri temizle
              </button>
            )}
          </div>

          {/* Sonuçlar */}
          {loading ? (
            <p className="font-body text-mid-gray">İlanlar yükleniyor…</p>
          ) : filtered.length === 0 ? (
            <div>
              <p className="font-body text-mid-gray mb-4">
                Bu kriterlere uygun ilan bulunamadı.
              </p>
              <button onClick={resetFilters} className="btn-primary">
                Tüm İlanları Göster
              </button>
            </div>
          ) : (
            <>
              <p className="font-body text-sm text-mid-gray mb-6">
                {filtered.length} ilan bulundu
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    to={`/ilan/${p.id}`}
                    className="bg-white shadow-card overflow-hidden group block"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={p.image_url}
                        alt={`${p.title} — ${p.location}, Aksaray`}
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
                      {p.images.length > 1 && (
                        <span className="absolute bottom-3 right-3 bg-black/60 text-white font-body text-xs px-2.5 py-1">
                          {p.images.length} fotoğraf
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="font-body text-xs uppercase tracking-[0.05em] text-muted-gold mb-2">
                        {categoryLabel(p.category)}
                      </p>
                      <h3 className="font-body text-xl font-medium text-black mb-1 group-hover:text-gold transition-colors">
                        {p.title}
                      </h3>
                      <p className="flex items-center gap-1 font-body text-sm font-light text-muted-gold mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {p.location}, Aksaray
                      </p>
                      <p className="font-body text-2xl font-medium text-gold">
                        {p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
