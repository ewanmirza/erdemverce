-- ============================================
-- AKSARAY EMLAK - Supabase Kurulum Betiği
-- Supabase Dashboard > SQL Editor'e yapıştırıp çalıştırın
-- ============================================

-- İlanlar tablosu
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  location text default '',
  price text not null,
  type text not null default 'satilik' check (type in ('satilik', 'kiralik')),
  image_url text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Site ayarları (hero video URL'i vb.)
create table if not exists public.site_settings (
  key text primary key,
  value text not null
);

-- RLS: herkes okuyabilir, sadece giriş yapmış kullanıcı yazabilir
alter table public.properties enable row level security;
alter table public.site_settings enable row level security;

create policy "public read properties"
  on public.properties for select using (true);

create policy "auth write properties"
  on public.properties for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read settings"
  on public.site_settings for select using (true);

create policy "auth write settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: medya bucket'ı (görseller + video)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "auth upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
