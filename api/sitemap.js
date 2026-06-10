// Dinamik sitemap: her istekte Supabase'den ilanları çekip XML üretir.
// Vercel bu dosyayı otomatik olarak serverless fonksiyona çevirir.
// vercel.json'daki rewrite sayesinde /sitemap.xml adresinden sunulur.

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const base = `https://${host}`;

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  let listings = [];
  if (supabaseUrl && anonKey) {
    try {
      const r = await fetch(
        `${supabaseUrl}/rest/v1/properties?select=id,created_at&order=created_at.desc`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
      );
      if (r.ok) listings = await r.json();
    } catch {
      // Supabase'e ulaşılamazsa sadece sabit sayfalar listelenir
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: `${base}/`, changefreq: 'weekly', priority: '1.0', lastmod: today },
    { loc: `${base}/ilanlar`, changefreq: 'daily', priority: '0.9', lastmod: today },
    ...listings.map((p) => ({
      loc: `${base}/ilan/${p.id}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: p.created_at ? String(p.created_at).slice(0, 10) : today,
    })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>\n';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // 1 saat CDN önbelleği: yeni ilanlar en geç 1 saat içinde sitemap'e düşer
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
