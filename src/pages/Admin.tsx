import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router';
import {
  Home,
  Plus,
  Pencil,
  Trash2,
  Star,
  LogOut,
  Loader2,
  Video,
  X,
  Download,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  DEFAULT_VIDEO,
  CATEGORIES,
  categoryLabel,
  fallbackProperties,
  defaultTexts,
  fetchSiteTexts,
  type Property,
  type SiteTexts,
} from '@/lib/data';

type Tab = 'ilanlar' | 'yazilar' | 'ayarlar';

const AKSARAY_MAHALLELERI = [
  'Aksaray Merkez',
  'Bahçesaray',
  'Büyük Bölcek',
  'Küçük Bölcek',
  'Cumhuriyet',
  'Dadaloğlu',
  'Ereğlikapı',
  'Fatih',
  'Hacılarharmanı',
  'Hamidiye',
  'Hassas',
  'Kılıçarslan',
  'Laleli',
  'Meydan',
  'Minarecik',
  'Paşacık',
  'Sofular',
  'Şifahane',
  'Taşpazar',
  'Yenidoğan',
  'Zafer',
];

interface FormState {
  id: string | null;
  title: string;
  description: string;
  location: string;
  price: string;
  type: 'satilik' | 'kiralik';
  category: string;
  featured: boolean;
  images: string[];
}

const emptyForm: FormState = {
  id: null,
  title: '',
  description: '',
  location: '',
  price: '',
  type: 'satilik',
  category: 'daire',
  featured: false,
  images: [],
};

/** Public URL'den storage yolunu çıkarır (silme işlemleri için). */
function storagePathFromUrl(url: string): string | null {
  const marker = '/object/public/media/';
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

/** Görseli yüklemeden önce küçültüp WebP'ye çevirir (maks 1600px, ~%80 kalite). */
async function compressImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const MAX = 1600;
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.8)
    );
    // WebP üretilemezse veya orijinalden büyükse orijinali kullan
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export default function Admin() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) {
      setSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(!!s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <div className="max-w-lg mx-auto bg-white shadow-card p-8 mt-20">
          <h1 className="font-display text-2xl text-black mb-4">
            Supabase yapılandırılmamış
          </h1>
          <p className="font-body text-mid-gray text-sm leading-relaxed">
            Admin panelini kullanmak için Vercel'de (veya yerelde .env
            dosyasında) <code className="text-gold">VITE_SUPABASE_URL</code> ve{' '}
            <code className="text-gold">VITE_SUPABASE_ANON_KEY</code>{' '}
            değişkenlerini tanımlayıp Redeploy yapın. Detaylar için projedeki
            KURULUM.md dosyasına bakın.
          </p>
        </div>
      </Shell>
    );
  }

  if (session === null) {
    return (
      <Shell>
        <div className="flex justify-center mt-32">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      </Shell>
    );
  }

  return <Shell>{session ? <Dashboard /> : <Login />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
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
          <span className="font-body text-xs uppercase tracking-[0.1em] text-gold">
            Yönetim Paneli
          </span>
        </div>
      </header>
      <main style={{ padding: '40px 4vw 100px' }}>
        <div className="content-max-width mx-auto">{children}</div>
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError('Giriş başarısız. E-posta veya şifre hatalı.');
    setBusy(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-card p-8 mt-16">
      <h1 className="font-display text-2xl text-black mb-6">Yönetici Girişi</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
        />
        {error && <p className="font-body text-sm text-red-600">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={busy}
          className="w-full bg-black text-white font-body text-sm uppercase tracking-[0.05em] py-3 hover:bg-gold hover:text-black transition-colors disabled:opacity-50"
        >
          {busy ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>('ilanlar');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-3">
          {(
            [
              { key: 'ilanlar', label: 'İlanlar' },
              { key: 'yazilar', label: 'Yazılar' },
              { key: 'ayarlar', label: 'Video & Fotoğraf' },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-body text-sm uppercase tracking-[0.05em] px-5 py-2 border transition-colors ${
                tab === t.key
                  ? 'bg-black text-white border-black'
                  : 'bg-transparent text-black border-black/20 hover:border-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => supabase?.auth.signOut()}
          className="flex items-center gap-2 font-body text-sm text-mid-gray hover:text-black transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış
        </button>
      </div>
      {tab === 'ilanlar' ? <PropertiesAdmin /> : tab === 'yazilar' ? <TextsAdmin /> : <SettingsAdmin />}
    </div>
  );
}

/* ---------------- İlan Yönetimi ---------------- */

function PropertiesAdmin() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as Property[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Sitedeki örnek ilanları veritabanına aktar
  const importSamples = async () => {
    if (!supabase) return;
    setImporting(true);
    setMessage('');
    const payload = fallbackProperties.map((p) => ({
      title: p.title,
      description: p.description,
      location: p.location,
      price: p.price,
      type: p.type,
      category: p.category,
      featured: p.featured,
      image_url: p.image_url,
      images: p.images,
    }));
    const { error } = await supabase.from('properties').insert(payload);
    if (error) setMessage('İçe aktarılamadı: ' + error.message);
    await load();
    setImporting(false);
  };

  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !supabase || !form) return;
    setUploading(true);
    setMessage('');
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      const ext = compressed !== file ? 'webp' : file.name.split('.').pop();
      const path = `properties/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from('media')
        .upload(path, compressed, {
          contentType: compressed !== file ? 'image/webp' : file.type,
        });
      if (error) {
        setMessage(`"${file.name}" yüklenemedi: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    if (urls.length > 0) {
      setForm((f) => (f ? { ...f, images: [...f.images, ...urls] } : f));
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (url: string) => {
    setForm((f) =>
      f ? { ...f, images: f.images.filter((i) => i !== url) } : f
    );
  };

  const makeCover = (url: string) => {
    setForm((f) =>
      f
        ? { ...f, images: [url, ...f.images.filter((i) => i !== url)] }
        : f
    );
  };

  const save = async () => {
    if (!supabase || !form) return;
    if (!form.title || !form.price || form.images.length === 0) {
      setMessage('Başlık, fiyat ve en az bir fotoğraf zorunludur.');
      return;
    }
    setSaving(true);
    setMessage('');
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      price: form.price,
      type: form.type,
      category: form.category,
      featured: form.featured,
      image_url: form.images[0],
      images: form.images,
    };
    const { error } = form.id
      ? await supabase.from('properties').update(payload).eq('id', form.id)
      : await supabase.from('properties').insert(payload);
    if (error) {
      setMessage('Kaydedilemedi: ' + error.message);
    } else {
      setForm(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (p: Property) => {
    if (!supabase) return;
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('properties').delete().eq('id', p.id);
    if (error) {
      setMessage('Silinemedi: ' + error.message);
      return;
    }
    // İlana ait fotoğrafları storage'dan da temizle
    const paths = (p.images?.length ? p.images : [p.image_url])
      .map(storagePathFromUrl)
      .filter((x): x is string => !!x);
    if (paths.length > 0) {
      await supabase.storage.from('media').remove(paths);
    }
    await load();
  };

  const toggleFeatured = async (p: Property) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('properties')
      .update({ featured: !p.featured })
      .eq('id', p.id);
    if (error) setMessage('Güncellenemedi: ' + error.message);
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-display text-2xl text-black">
          İlanlar ({items.length})
        </h2>
        <div className="flex gap-3">
          {items.length === 0 && !loading && (
            <button
              onClick={importSamples}
              disabled={importing}
              className="flex items-center gap-2 border border-black/20 text-black font-body text-sm uppercase tracking-[0.05em] px-5 py-2 hover:border-gold transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {importing ? 'Aktarılıyor…' : 'Sitedeki Örnek İlanları Aktar'}
            </button>
          )}
          <button
            onClick={() => {
              setMessage('');
              setForm({ ...emptyForm, images: [] });
            }}
            className="flex items-center gap-2 bg-gold text-black font-body text-sm uppercase tracking-[0.05em] px-5 py-2 hover:bg-black hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni İlan
          </button>
        </div>
      </div>

      {message && (
        <p className="font-body text-sm text-red-600 mb-4">{message}</p>
      )}

      {/* Form */}
      {form && (
        <div className="bg-white shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-black">
              {form.id ? 'İlanı Düzenle' : 'Yeni İlan'}
            </h3>
            <button onClick={() => setForm(null)}>
              <X className="w-5 h-5 text-mid-gray hover:text-black" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Başlık *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
            />
            <div>
              <input
                list="mahalleler"
                placeholder="Mahalle (listeden seç veya yaz)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
              />
              <datalist id="mahalleler">
                {AKSARAY_MAHALLELERI.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
            <input
              placeholder="Fiyat (örn. 5.200.000 TL veya 12.000 TL/ay) *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as 'satilik' | 'kiralik',
                  })
                }
                className="border border-black/15 px-4 py-3 font-body text-sm bg-white focus:outline-none focus:border-gold"
              >
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-black/15 px-4 py-3 font-body text-sm bg-white focus:outline-none focus:border-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Açıklama (örn. 3+1, 140m², asansörlü…)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="md:col-span-2 border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
            />

            {/* Fotoğraflar */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <label className="font-body text-sm text-black cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={uploadImages}
                    className="hidden"
                  />
                  <span className="inline-block border border-black/20 px-4 py-2 hover:border-gold transition-colors">
                    {uploading ? 'Yükleniyor…' : 'Fotoğraf Seç (birden fazla seçilebilir)'}
                  </span>
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-black cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#b89b5e]"
                  />
                  Öne çıkan (anasayfada büyük gösterilir)
                </label>
              </div>
              {form.images.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt={`Fotoğraf ${i + 1}`}
                          className={`h-20 w-28 object-cover border-2 ${
                            i === 0 ? 'border-gold' : 'border-transparent'
                          }`}
                        />
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-gold text-black font-body text-[10px] uppercase text-center">
                            Kapak
                          </span>
                        )}
                        <button
                          onClick={() => removeImage(url)}
                          title="Kaldır"
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {i !== 0 && (
                          <button
                            onClick={() => makeCover(url)}
                            className="absolute inset-0 flex items-end justify-center bg-black/0 hover:bg-black/40 text-white font-body text-[10px] uppercase opacity-0 hover:opacity-100 transition-all pb-1"
                          >
                            Kapak yap
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-mid-gray mt-2">
                    İlk fotoğraf kapak olarak kullanılır. Bir fotoğrafa gelip
                    "Kapak yap" diyerek değiştirebilirsiniz.
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving || uploading}
            className="mt-5 bg-black text-white font-body text-sm uppercase tracking-[0.05em] px-8 py-3 hover:bg-gold hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="font-body text-mid-gray">Yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="font-body text-mid-gray">
          Henüz ilan yok. "Sitedeki Örnek İlanları Aktar" ile şu an sitede
          görünen 7 örnek ilanı buraya alabilir, sonra düzenleyebilirsiniz.
          Veya "Yeni İlan" ile sıfırdan ekleyin.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-card flex items-center gap-4 p-4"
            >
              <img
                src={p.image_url}
                alt={p.title}
                className="h-16 w-24 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-body font-medium text-black truncate">
                  {p.title}
                </p>
                <p className="font-body text-sm text-mid-gray truncate">
                  {categoryLabel(p.category)} · {p.location} · {p.price} ·{' '}
                  {p.type === 'satilik' ? 'Satılık' : 'Kiralık'}
                  {Array.isArray(p.images) && p.images.length > 1
                    ? ` · ${p.images.length} fotoğraf`
                    : ''}
                </p>
              </div>
              <button
                onClick={() => toggleFeatured(p)}
                title="Öne çıkar"
                aria-label={p.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                className="shrink-0"
              >
                <Star
                  className={`w-5 h-5 ${
                    p.featured
                      ? 'text-gold fill-current'
                      : 'text-black/20 hover:text-gold'
                  }`}
                />
              </button>
              <button
                onClick={() => {
                  setMessage('');
                  const imgs =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images
                      : p.image_url
                      ? [p.image_url]
                      : [];
                  setForm({
                    id: p.id,
                    title: p.title,
                    description: p.description ?? '',
                    location: p.location ?? '',
                    price: p.price,
                    type: p.type,
                    category: p.category ?? 'daire',
                    featured: p.featured,
                    images: imgs,
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="İlanı düzenle"
                className="shrink-0"
              >
                <Pencil className="w-5 h-5 text-mid-gray hover:text-black" />
              </button>
              <button onClick={() => remove(p)} aria-label="İlanı sil" className="shrink-0">
                <Trash2 className="w-5 h-5 text-mid-gray hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Site Yazıları ---------------- */

function TextsAdmin() {
  const [texts, setTexts] = useState<SiteTexts>(defaultTexts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSiteTexts(true).then((t) => {
      setTexts(t);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage('');
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'site_texts', value: JSON.stringify(texts) });
    setMessage(
      error ? 'Kaydedilemedi: ' + error.message : 'Yazılar kaydedildi. Site yenilendiğinde görünür.'
    );
    setSaving(false);
  };

  const field = (
    label: string,
    key: keyof SiteTexts,
    opts?: { textarea?: boolean; placeholder?: string }
  ) => (
    <div>
      <label className="block font-body text-xs uppercase tracking-[0.05em] text-muted-gold mb-1.5">
        {label}
      </label>
      {opts?.textarea ? (
        <textarea
          value={texts[key]}
          rows={4}
          onChange={(e) => setTexts({ ...texts, [key]: e.target.value })}
          className="w-full border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
        />
      ) : (
        <input
          value={texts[key]}
          placeholder={opts?.placeholder}
          onChange={(e) => setTexts({ ...texts, [key]: e.target.value })}
          className="w-full border border-black/15 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold"
        />
      )}
    </div>
  );

  if (loading)
    return <p className="font-body text-mid-gray">Yükleniyor…</p>;

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-2xl text-black mb-6">Site Yazıları</h2>
      <div className="bg-white shadow-card p-6 space-y-5">
        <p className="font-body text-xs uppercase tracking-[0.1em] text-muted-gold border-b border-black/10 pb-2">
          ANASAYFA BÜYÜK BAŞLIK
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('1. Satır', 'hero_line1')}
          {field('2. Satır', 'hero_line2')}
        </div>
        {field('Alt slogan (sol altta)', 'hero_tagline')}

        <p className="font-body text-xs uppercase tracking-[0.1em] text-muted-gold border-b border-black/10 pb-2 pt-3">
          HAKKIMIZDA BÖLÜMÜ
        </p>
        {field('Başlık', 'about_title')}
        {field('Açıklama metni', 'about_text', { textarea: true })}

        <p className="font-body text-xs uppercase tracking-[0.1em] text-muted-gold border-b border-black/10 pb-2 pt-3">
          İLETİŞİM BİLGİLERİ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Telefon', 'phone', { placeholder: '+90 382 000 00 00' })}
          {field('E-posta', 'email')}
        </div>
        {field('Adres', 'address')}
        <p className="font-body text-xs text-mid-gray -mt-2">
          Telefon; "Bizi Arayın" butonlarını ve WhatsApp linkini de otomatik günceller.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Instagram linki (opsiyonel)', 'instagram', {
            placeholder: 'https://instagram.com/...',
          })}
          {field('Facebook linki (opsiyonel)', 'facebook', {
            placeholder: 'https://facebook.com/...',
          })}
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="bg-black text-white font-body text-sm uppercase tracking-[0.05em] px-8 py-3 hover:bg-gold hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
        {message && <p className="font-body text-sm text-black">{message}</p>}
      </div>
    </div>
  );
}

/* ---------------- Video & Fotoğraf ---------------- */

function SettingsAdmin() {
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_VIDEO);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_video_url')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setVideoUrl(data.value as string);
      });
  }, []);

  const uploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    if (file.size > 50 * 1024 * 1024) {
      setMessage('Video 50MB üzerinde. Lütfen sıkıştırılmış bir MP4 kullanın.');
      return;
    }
    setUploading(true);
    setMessage('');
    const path = `videos/hero-${Date.now()}.mp4`;
    const { error } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type || 'video/mp4',
    });
    if (error) {
      setMessage('Video yüklenemedi: ' + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    const { error: upsertError } = await supabase
      .from('site_settings')
      .upsert({ key: 'hero_video_url', value: data.publicUrl });
    if (upsertError) {
      setMessage('Ayar kaydedilemedi: ' + upsertError.message);
    } else {
      setVideoUrl(data.publicUrl);
      setMessage('Video güncellendi. Anasayfa artık yeni videoyu kullanıyor.');
    }
    setUploading(false);
  };

  const [texts, setTexts] = useState<SiteTexts>(defaultTexts);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');

  useEffect(() => {
    fetchSiteTexts(true).then(setTexts);
  }, []);

  const uploadHeroImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploadingPhoto(true);
    setPhotoMessage('');
    const ext = file.name.split('.').pop();
    const path = `site/hero-building-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) {
      setPhotoMessage('Fotoğraf yüklenemedi: ' + error.message);
      setUploadingPhoto(false);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    const next = { ...texts, hero_image_url: data.publicUrl };
    const { error: upsertError } = await supabase
      .from('site_settings')
      .upsert({ key: 'site_texts', value: JSON.stringify(next) });
    if (upsertError) {
      setPhotoMessage('Ayar kaydedilemedi: ' + upsertError.message);
    } else {
      setTexts(next);
      setPhotoMessage('Bina fotoğrafı güncellendi.');
    }
    setUploadingPhoto(false);
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
      <h2 className="font-display text-2xl text-black mb-6">
        Anasayfa Videosu
      </h2>
      <div className="bg-white shadow-card p-6">
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          muted
          className="w-full aspect-video object-cover bg-black mb-5"
        />
        <label className="inline-flex items-center gap-2 font-body text-sm text-black cursor-pointer">
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={uploadVideo}
            className="hidden"
          />
          <span className="flex items-center gap-2 bg-gold text-black font-body text-sm uppercase tracking-[0.05em] px-5 py-3 hover:bg-black hover:text-white transition-colors">
            <Video className="w-4 h-4" />
            {uploading ? 'Yükleniyor…' : 'Yeni Video Yükle'}
          </span>
        </label>
        <p className="font-body text-xs text-mid-gray mt-4 leading-relaxed">
          Önerilen: yatay (16:9), 10–30 saniyelik, sıkıştırılmış MP4 (H.264),
          mümkünse 10MB altı. Büyük videolar sayfanın açılışını yavaşlatır.
        </p>
        {message && (
          <p className="font-body text-sm text-black mt-3">{message}</p>
        )}
      </div>
      </div>

      <div>
        <h2 className="font-display text-2xl text-black mb-6">
          Anasayfa Bina Fotoğrafı
        </h2>
        <div className="bg-white shadow-card p-6">
          <img
            src={texts.hero_image_url}
            alt="Bina fotoğrafı"
            className="w-full aspect-[3/2] object-cover bg-black mb-5"
          />
          <label className="inline-flex items-center gap-2 font-body text-sm text-black cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={uploadHeroImage}
              className="hidden"
            />
            <span className="flex items-center gap-2 bg-gold text-black font-body text-sm uppercase tracking-[0.05em] px-5 py-3 hover:bg-black hover:text-white transition-colors">
              {uploadingPhoto ? 'Yükleniyor…' : 'Yeni Fotoğraf Yükle'}
            </span>
          </label>
          <p className="font-body text-xs text-mid-gray mt-4 leading-relaxed">
            Anasayfanın sağ altındaki bina fotoğrafı ve videonun yüklenmeden
            önceki kapak görseli olarak kullanılır. Önerilen: yatay (3:2),
            JPG, 500KB altı.
          </p>
          {photoMessage && (
            <p className="font-body text-sm text-black mt-3">{photoMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
