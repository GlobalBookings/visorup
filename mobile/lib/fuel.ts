import { supabase, UserBike } from './supabase';

export type FuelStatus = {
  rangeMiles: number;
  routeDistMiles: number;
  needsRefuel: boolean;
  refuelAt: number | null; // miles into route where you'll need fuel
  bikeName: string;
};

export async function checkFuelRange(routeDistMetres: number): Promise<FuelStatus | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: bikes } = await supabase
    .from('user_bikes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_primary', true)
    .limit(1);

  if (!bikes || bikes.length === 0) return null;

  const bike: UserBike = bikes[0];
  if (!bike.tank_litres || !bike.mpg) return null;

  // Calculate range: tank_litres / 4.546 = gallons, gallons * mpg = range miles
  const gallons = bike.tank_litres / 4.546;
  const rangeMiles = gallons * bike.mpg;
  const routeDistMiles = routeDistMetres * 0.000621371;

  // Assume starting with 80% tank (conservative)
  const effectiveRange = rangeMiles * 0.8;
  const needsRefuel = routeDistMiles > effectiveRange;
  const refuelAt = needsRefuel ? Math.round(effectiveRange) : null;

  return {
    rangeMiles: Math.round(rangeMiles),
    routeDistMiles: Math.round(routeDistMiles),
    needsRefuel,
    refuelAt,
    bikeName: bike.nickname || `${bike.make} ${bike.model}`,
  };
}
