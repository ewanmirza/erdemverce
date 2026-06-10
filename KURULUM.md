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


## Yazıları ve görselleri düzenleme

- **Yazılar sekmesi (admin):** Anasayfa büyük başlığı, alt slogan, Hakkımızda başlığı ve metni, telefon, e-posta, adres, Instagram/Facebook linkleri buradan değiştirilir. Telefonu değiştirmek tüm "Bizi Arayın" butonlarını ve WhatsApp linkini de günceller.
- **Video & Fotoğraf sekmesi (admin):** Hero videosu ve anasayfadaki bina fotoğrafı buradan değiştirilir.

## 4. Veritabanı güncellemesi (mevcut kurulumlar)

Daha önce `supabase-setup.sql`'i çalıştırdıysanız, çoklu fotoğraf ve kategori desteği için `supabase-update.sql` dosyasını SQL Editor'de bir kez çalıştırın. Yeni kurulum yapıyorsanız gerek yok, `supabase-setup.sql` zaten güncel.

## 5. Google SEO

Kod tarafında yapılanlar: sayfa bazlı başlık/açıklama, anahtar kelimeler (aksaray emlak, erdem emlak, aksaray 1+1 daire vb.), Open Graph etiketleri, Schema.org RealEstateAgent yapısal verisi, robots.txt ve sitemap.xml.

Sizin yapmanız gerekenler:

1. **Alan adını yazın:** `index.html` içindeki `SITEADRESINIZ.com` ifadelerini gerçek alan adınızla değiştirin. Telefon numarasını da (`+90 382 000 00 00`) gerçek numarayla güncelleyin. (robots.txt ve sitemap.xml artık otomatik üretiliyor, onlara dokunmanıza gerek yok.)
   - **Sitemap otomatiktir:** `siteadresi.com/sitemap.xml` her çağrıldığında veritabanındaki TÜM ilanları (`/ilan/...` sayfaları dahil) içerecek şekilde anında üretilir. Yeni ilan eklediğinizde en geç 1 saat içinde sitemap'e otomatik düşer; elle güncelleme gerekmez.
2. **Google Search Console:** https://search.google.com/search-console adresinden siteyi ekleyin (alan adı doğrulaması Keyubu DNS panelinden TXT kaydıyla yapılır). Doğrulama sonrası Sitemaps bölümünden `sitemap.xml` gönderin. Bu, Google'ın siteyi taramasını ciddi hızlandırır.
3. **Google Business Profile (çok önemli):** https://business.google.com üzerinden "Erdem Emlak" / "Aksaray Emlak" işletme kaydı oluşturun, adres ve telefonu girin, web sitesini bağlayın. "Aksaray emlak" aramalarında haritada çıkmanın yolu budur ve yerel aramalarda web sitesinden daha fazla trafik getirir.
4. **Gerçekçi beklenti:** "Erdem Emlak" gibi marka aramalarında 1-2 hafta içinde ilk sırada çıkarsınız. "Aksaray emlak", "aksaray 1+1 daire" gibi genel aramalar rekabetlidir (sahibinden, emlakjet, hepsiemlak gibi devler var); ilk sayfaya girmek aylar sürer ve düzenli ilan girişi + Google Business yorumlarıyla desteklenmelidir. İlan başlıklarını arama diline yakın yazmak ("Kılıçarslan'da Satılık 3+1 Daire" gibi) yardımcı olur.
