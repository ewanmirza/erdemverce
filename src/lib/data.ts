import { supabase } from './supabase';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  type: 'satilik' | 'kiralik';
  category: string;
  image_url: string;
  images: string[];
  featured: boolean;
  created_at?: string;
}

export const CATEGORIES = [
  { key: 'daire', label: 'Daire' },
  { key: 'villa', label: 'Villa' },
  { key: 'mustakil', label: 'Müstakil Ev' },
  { key: 'arsa', label: 'Arsa' },
  { key: 'dukkan', label: 'Dükkan' },
  { key: 'isyeri', label: 'İşyeri' },
  { key: 'diger', label: 'Diğer' },
] as const;

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? 'Diğer';
}

export const DEFAULT_VIDEO = '/videos/hero.mp4';

// Supabase yapılandırılmamışsa veya veritabanı boşsa kullanılan örnek ilanlar
export const fallbackProperties: Property[] = [
  {
    id: 'f1',
    title: "Merkez'de Lüks Daire",
    description: "Aksaray Merkez'de, 3+1, 140m², asansörlü, otoparklı lüks daire.",
    location: 'Aksaray Merkez',
    price: '6.750.000 TL',
    type: 'satilik',
    category: 'daire',
    image_url: '/images/property-1.jpg',
    images: ['/images/property-1.jpg'],
    featured: true,
  },
  {
    id: 'f2',
    title: "Yenidoğan'da Villa",
    description: "Yenidoğan Mahallesi'nde, 5+2, 300m², bahçeli, müstakil tripleks villa.",
    location: 'Yenidoğan',
    price: '14.500.000 TL',
    type: 'satilik',
    category: 'villa',
    image_url: '/images/property-2.jpg',
    images: ['/images/property-2.jpg'],
    featured: true,
  },
  {
    id: 'f3',
    title: "Zafer'de Yatırımlık Dükkan",
    description: "Zafer Mahallesi'nde, 80m², cadde üzeri, yüksek kira getirili dükkan.",
    location: 'Zafer',
    price: '4.250.000 TL',
    type: 'satilik',
    category: 'dukkan',
    image_url: '/images/property-3.jpg',
    images: ['/images/property-3.jpg'],
    featured: true,
  },
  {
    id: 'f4',
    title: "Hamidiye'de Arsa",
    description: "Hamidiye'de, 500m², imarlı, yatırıma uygun arsa.",
    location: 'Hamidiye',
    price: '2.900.000 TL',
    type: 'satilik',
    category: 'arsa',
    image_url: '/images/property-4.jpg',
    images: ['/images/property-4.jpg'],
    featured: true,
  },
  {
    id: 'f5',
    title: "Açık Cezaevi Yolu'nda 2+1",
    description: 'Açık Cezaevi Yolu üzerinde, 2+1, 100m², yeni bina.',
    location: 'Aksaray Merkez',
    price: '3.500.000 TL',
    type: 'satilik',
    category: 'daire',
    image_url: '/images/property-5.jpg',
    images: ['/images/property-5.jpg'],
    featured: false,
  },
  {
    id: 'f6',
    title: "Kılıçarslan'da 3+1 Daire",
    description: "Kılıçarslan Mahallesi'nde, 3+1, 130m², ferah daire.",
    location: 'Kılıçarslan',
    price: '5.200.000 TL',
    type: 'satilik',
    category: 'daire',
    image_url: '/images/property-6.jpg',
    images: ['/images/property-6.jpg'],
    featured: false,
  },
  {
    id: 'f7',
    title: "Dadaloğlu'nda Kiralık Daire",
    description: "Dadaloğlu Mahallesi'nde, 2+1, 110m², eşyasız kiralık daire.",
    location: 'Dadaloğlu',
    price: '12.000 TL/ay',
    type: 'kiralik',
    category: 'daire',
    image_url: '/images/property-7.jpg',
    images: ['/images/property-7.jpg'],
    featured: false,
  },
];

function normalize(p: Record<string, unknown>): Property {
  const images = Array.isArray(p.images) ? (p.images as string[]) : [];
  const cover = (p.image_url as string) || images[0] || '';
  return {
    ...(p as unknown as Property),
    category: (p.category as string) || 'diger',
    image_url: cover,
    images: images.length > 0 ? images : cover ? [cover] : [],
  };
}

export async function fetchProperties(): Promise<Property[]> {
  if (!supabase) return fallbackProperties;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return fallbackProperties;
    return data.length > 0 ? data.map(normalize) : fallbackProperties;
  } catch {
    return fallbackProperties;
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const fromFallback = fallbackProperties.find((p) => p.id === id) ?? null;
  if (!supabase) return fromFallback;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return fromFallback;
    return normalize(data);
  } catch {
    return fromFallback;
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
