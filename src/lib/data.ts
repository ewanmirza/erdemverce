import { supabase } from './supabase';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  type: 'satilik' | 'kiralik';
  image_url: string;
  featured: boolean;
  created_at?: string;
}

export interface SiteSettings {
  hero_video_url: string;
}

export const DEFAULT_VIDEO = '/videos/hero.mp4';

// Supabase yapılandırılmamışsa veya hata olursa kullanılacak statik veriler
export const fallbackProperties: Property[] = [
  {
    id: 'f1',
    title: "Merkez'de Lüks Daire",
    description: "Aksaray Merkez'de, 3+1, 140m², asansörlü, otoparklı lüks daire.",
    location: 'Aksaray Merkez',
    price: '6.750.000 TL',
    type: 'satilik',
    image_url: '/images/property-1.jpg',
    featured: true,
  },
  {
    id: 'f2',
    title: "Yenidoğan'da Villa",
    description: "Yenidoğan Mahallesi'nde, 5+2, 300m², bahçeli, müstakil tripleks villa.",
    location: 'Yenidoğan, Aksaray',
    price: '14.500.000 TL',
    type: 'satilik',
    image_url: '/images/property-2.jpg',
    featured: true,
  },
  {
    id: 'f3',
    title: "Zafer'de Yatırımlık Dükkan",
    description: "Zafer Mahallesi'nde, 80m², cadde üzeri, yüksek kira getirili dükkan.",
    location: 'Zafer, Aksaray',
    price: '4.250.000 TL',
    type: 'satilik',
    image_url: '/images/property-3.jpg',
    featured: true,
  },
  {
    id: 'f4',
    title: "Hamidiye'de Arsa",
    description: "Hamidiye'de, 500m², imarlı, yatırıma uygun arsa.",
    location: 'Hamidiye, Aksaray',
    price: '2.900.000 TL',
    type: 'satilik',
    image_url: '/images/property-4.jpg',
    featured: true,
  },
  {
    id: 'f5',
    title: "Açık Cezaevi Yolu'nda 2+1",
    description: 'Açık Cezaevi Yolu üzerinde, 2+1, 100m², yeni bina.',
    location: 'Aksaray Merkez',
    price: '3.500.000 TL',
    type: 'satilik',
    image_url: '/images/property-5.jpg',
    featured: false,
  },
  {
    id: 'f6',
    title: "Kılıçarslan'da 3+1 Daire",
    description: "Kılıçarslan Mahallesi'nde, 3+1, 130m², ferah daire.",
    location: 'Kılıçarslan, Aksaray',
    price: '5.200.000 TL',
    type: 'satilik',
    image_url: '/images/property-6.jpg',
    featured: false,
  },
  {
    id: 'f7',
    title: "Dadaloğlu'nda Kiralık Daire",
    description: "Dadaloğlu Mahallesi'nde, 2+1, 110m², eşyasız kiralık daire.",
    location: 'Dadaloğlu, Aksaray',
    price: '12.000 TL/ay',
    type: 'kiralik',
    image_url: '/images/property-7.jpg',
    featured: false,
  },
];

export async function fetchProperties(): Promise<Property[]> {
  if (!supabase) return fallbackProperties;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return fallbackProperties;
    return data.length > 0 ? (data as Property[]) : fallbackProperties;
  } catch {
    return fallbackProperties;
  }
}

export async function fetchHeroVideoUrl(): Promise<string> {
  if (!supabase) return DEFAULT_VIDEO;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_video_url')
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_VIDEO;
    return data.value as string;
  } catch {
    return DEFAULT_VIDEO;
  }
}
