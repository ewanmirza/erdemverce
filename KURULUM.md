# Aksaray Emlak — Kurulum (Admin Panelli Sürüm)

Site Supabase olmadan da çalışır (örnek ilanlar ve mevcut video gösterilir). Admin panelini aktif etmek için aşağıdaki adımları izleyin.

## 1. Supabase projesi

1. https://supabase.com adresinden yeni bir proje oluşturun (ücretsiz plan yeterli).
2. **SQL Editor**'e gidin, projedeki `supabase-setup.sql` dosyasının içeriğini yapıştırıp **Run** deyin. Bu betik ilan tablosunu, ayar tablosunu, `media` storage bucket'ını ve güvenlik kurallarını oluşturur.
3. **Authentication > Users > Add user** ile kendinize (veya emlakçıya) bir e-posta + şifre ile admin kullanıcısı oluşturun. "Auto confirm user" işaretli olsun.

## 2. Ortam değişkenleri

Supabase Dashboard > **Settings > API** sayfasından iki değeri alın:

- Project URL → `VITE_SUPABASE_URL`
- anon public key → `VITE_SUPABASE_ANON_KEY`

**Vercel + Supabase entegrasyonu kullandıysanız (önerilen):** Vercel Marketplace üzerinden Supabase'i projeye bağladıysanız `SUPABASE_URL` ve `SUPABASE_ANON_KEY` değişkenleri Vercel'e otomatik eklenir — elle bir şey girmenize gerek yok. Kod bu değişkenleri otomatik tanır; entegrasyonu bağladıktan sonra bir **Redeploy** yapmanız yeterli. (Entegrasyonun eklediği `SUPABASE_SERVICE_ROLE_KEY` siteye hiçbir şekilde gömülmez, güvendesiniz.)

**Elle eklemek isterseniz:** Project > Settings > Environment Variables bölümüne yukarıdaki iki değeri ekleyin, sonra Redeploy yapın.

**Yerelde:** proje kökünde `.env` dosyası oluşturun:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 3. Kullanım

- **Admin paneli:** `siteadresi.com/admin` — oluşturduğunuz e-posta/şifre ile giriş yapın.
- **İlan ekleme:** "Yeni İlan" → başlık, fiyat, görsel zorunlu. "Öne çıkan" işaretli ilanlar anasayfada büyük blok olarak (en fazla 4 adet), diğerleri kart olarak gösterilir.
- **Tüm ilanlar sayfası:** `siteadresi.com/ilanlar` — satılık/kiralık filtresiyle tüm ilanlar.
- **Video değiştirme:** Admin > "Video / Ayarlar" sekmesinden yeni MP4 yükleyin. Anında anasayfaya yansır. Önerilen: 16:9, sıkıştırılmış H.264, mümkünse 10MB altı.

## Notlar

- Veritabanında hiç ilan yokken sitede örnek (statik) ilanlar gösterilir. İlk ilanı ekledikten sonra gerçek veriler devreye girer.
- İlan silmek görseli storage'dan silmez; depolama dolmaya başlarsa Supabase > Storage > media içinden eski dosyaları temizleyebilirsiniz (ücretsiz plan 1GB).
- Şifre sıfırlama gerekirse Supabase Dashboard > Authentication > Users üzerinden yapılır.
