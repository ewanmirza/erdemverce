-- Mevcut veritabanını yeni sürüme yükseltir (çoklu fotoğraf + kategori)
-- Supabase Dashboard > SQL Editor'de bir kez çalıştırın.

alter table public.properties
  add column if not exists images text[] not null default '{}';

alter table public.properties
  add column if not exists category text not null default 'daire';

-- Eski tek görselli ilanları yeni yapıya taşı
update public.properties
  set images = array[image_url]
  where (images is null or cardinality(images) = 0) and image_url is not null;
