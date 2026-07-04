import { useEffect } from 'react';
import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { setSeo } from '@/lib/seo';

export default function NotFound() {
  useEffect(() => {
    setSeo({
      title: 'Sayfa Bulunamadı — Aksaray Emlak',
      description: 'Aradığınız sayfa bulunamadı.',
    });
  }, []);

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
        </div>
      </header>
      <main style={{ padding: '80px 4vw 120px' }}>
        <div className="content-max-width mx-auto text-center">
          <p className="font-display text-gold" style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', lineHeight: 1 }}>
            404
          </p>
          <h1 className="font-display text-3xl text-black mt-4 mb-4">
            Sayfa Bulunamadı
          </h1>
          <p className="font-body text-mid-gray mb-8">
            Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Anasayfa
            </Link>
            <Link
              to="/ilanlar"
              className="inline-flex items-center border border-black/20 px-6 py-3 font-body text-sm uppercase tracking-[0.05em] text-black hover:border-gold transition-colors"
            >
              Tüm İlanlar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
