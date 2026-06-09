type GeoResult = {
  name: string;
  lat: number;
  lng: number;
  displayName: string;
};

export async function searchPlaces(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gb&limit=5&addressdetails=1`,
      { headers: { 'User-Agent': 'VisorUp-Mobile/1.0' } }
    );
    const data = await res.json();

    return data.map((item: any) => ({
      name: item.name || item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name.split(',').slice(0, 3).join(','),
    }));
  } catch (e) {
    console.warn('[Geocode] Search failed:', e);
    return [];
  }
}
