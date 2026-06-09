import fuelRaw from './fuel-stations.json';

export type FuelStation = { lat: number; lng: number; name: string };

// 9900+ UK fuel stations - [lat, lng, name] format
export const fuelStations: FuelStation[] = (fuelRaw as [number, number, string][]).map(([lat, lng, name]) => ({
  lat, lng, name,
}));
