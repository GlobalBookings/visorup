import poiData from './poi-data.json';

export type POI = {
  name: string;
  lat: number;
  lng: number;
  desc: string;
  category: POICategory;
};

export type POICategory = 'fuel' | 'campsites' | 'roads' | 'viewpoints' | 'bridges' | 'pubs' | 'mountain_passes' | 'wildlife' | 'waterfalls' | 'castles' | 'beaches';

export const poiCategories: { id: POICategory; label: string; icon: string; color: string }[] = [
  { id: 'fuel', label: 'Fuel', icon: 'fuel', color: '#FFC107' },
  { id: 'roads', label: 'Top Roads', icon: 'git-compare-outline', color: '#E91E63' },
  { id: 'mountain_passes', label: 'Passes', icon: 'triangle-outline', color: '#FF5722' },
  { id: 'viewpoints', label: 'Views', icon: 'eye-outline', color: '#4CAF50' },
  { id: 'campsites', label: 'Campsites', icon: 'bonfire-outline', color: '#FF6B35' },
  { id: 'pubs', label: 'Pubs & Cafes', icon: 'beer-outline', color: '#8D6E63' },
  { id: 'bridges', label: 'Bridges', icon: 'trail-sign-outline', color: '#607D8B' },
  { id: 'wildlife', label: 'Wildlife', icon: 'paw-outline', color: '#795548' },
  { id: 'waterfalls', label: 'Waterfalls', icon: 'water-outline', color: '#03A9F4' },
  { id: 'castles', label: 'Castles', icon: 'shield-outline', color: '#9C27B0' },
  { id: 'beaches', label: 'Beaches', icon: 'sunny-outline', color: '#00BCD4' },
];

// Load from extracted website database (1800+ curated UK POIs)
export const pois: POI[] = (poiData as any[]).map((p) => ({
  name: p.n,
  lat: p.lat,
  lng: p.lng,
  desc: p.d,
  category: p.c as POICategory,
}));
