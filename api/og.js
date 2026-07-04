// /ilan/:id istekleri için index.html'i alıp ilana özel OG meta
// etiketleriyle değiştirir. WhatsApp/Facebook paylaşım önizlemeleri
// böylece ilanın kendi fotoğrafını ve başlığını gösterir.
// vercel.json'daki "/ilan/:id" rewrite'ı bu fonksiyona yönlenir.

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const base = `https://${host}`;
  const id = req.query.id;

  // SPA kabuğunu al (statik dist/index.html)
  let html = '';
  try {
    const r = await fetch(`${base}/index.html`);
    html = await r.text();
  } catch {
    res.status(500).send('');
    return;
  }

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  let p = null;
  if (id && supabaseUrl && anonKey) {
    try {
      const r = await fetch(
        `${supabaseUrl}/rest/v1/properties?id=eq.${encodeURIComponent(
          id
        )}&select=title,description,price,type,location,image_url&limit=1`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
      );
      if (r.ok) {
        const rows = await r.json();
        p = rows[0] ?? null;
      }
    } catch {
      // ilan çekilemezse varsayılan meta ile devam
    }
  }

  if (p) {
    const title = esc(`${p.title} — ${p.price} | Aksaray Emlak`);
    const desc = esc(
      `${p.type === 'satilik' ? 'Satılık' : 'Kiralık'} · ${p.location}, Aksaray. ${
        p.description || ''
      }`.slice(0, 160)
    );
    const image = esc(
      p.image_url?.startsWith('http') ? p.image_url : `${base}${p.image_url}`
    );
    const url = `${base}/ilan/${esc(id)}`;

    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content="[\s\S]*?"\s*\/>/,
        `<meta name="description" content="${desc}" />`
      )
      .replace(
        /<meta property="og:title" content="[\s\S]*?"\s*\/>/,
        `<meta property="og:title" content="${title}" />`
      )
      .replace(
        /<meta property="og:description" content="[\s\S]*?"\s*\/>/,
        `<meta property="og:description" content="${desc}" />`
      )
      .replace(
        /<meta property="og:image" content="[\s\S]*?"\s*\/>/,
        `<meta property="og:image" content="${image}" />`
      )
      .replace(
        /<meta property="og:url" content="[\s\S]*?"\s*\/>/,
        `<meta property="og:url" content="${url}" />`
      )
      .replace(
        /<link rel="canonical" href="[\s\S]*?"\s*\/>/,
        `<link rel="canonical" href="${url}" />`
      )
      .replace(
        /<meta name="twitter:title" content="[\s\S]*?"\s*\/>/,
        `<meta name="twitter:title" content="${title}" />`
      )
      .replace(
        /<meta name="twitter:description" content="[\s\S]*?"\s*\/>/,
        `<meta name="twitter:description" content="${desc}" />`
      )
      .replace(
        /<meta name="twitter:image" content="[\s\S]*?"\s*\/>/,
        `<meta name="twitter:image" content="${image}" />`
      );
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // 5 dk CDN önbelleği: ilan güncellemesi en geç 5 dk içinde yansır
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
  res.status(200).send(html);
}
