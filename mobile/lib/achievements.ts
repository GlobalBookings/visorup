export type AchievementMetrics = {
  rides: number;
  miles: number;
  hours: number;
  routes: number;
  published: number;
  bikes: number;
  favourites: number;
};

export type BadgeDef = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  metric: keyof AchievementMetrics;
  target: number;
};

export type Badge = BadgeDef & { earned: boolean; current: number };

export const BADGES: BadgeDef[] = [
  { id: 'first_ride', title: 'First Ride', desc: 'Record your first ride in ride mode.', icon: 'navigate', metric: 'rides', target: 1 },
  { id: 'rides_10', title: 'Regular Rider', desc: 'Record 10 rides.', icon: 'speedometer', metric: 'rides', target: 10 },
  { id: 'rides_50', title: 'Road Warrior', desc: 'Record 50 rides.', icon: 'trophy', metric: 'rides', target: 50 },
  { id: 'miles_100', title: 'Century', desc: 'Ride 100 total miles.', icon: 'trending-up', metric: 'miles', target: 100 },
  { id: 'miles_500', title: 'Long Hauler', desc: 'Ride 500 total miles.', icon: 'trail-sign', metric: 'miles', target: 500 },
  { id: 'miles_1000', title: 'Iron Butt', desc: 'Ride 1,000 total miles.', icon: 'medal', metric: 'miles', target: 1000 },
  { id: 'first_route', title: 'Route Planner', desc: 'Save your first route.', icon: 'map', metric: 'routes', target: 1 },
  { id: 'routes_10', title: 'Cartographer', desc: 'Save 10 routes.', icon: 'grid', metric: 'routes', target: 10 },
  { id: 'first_publish', title: 'Trailblazer', desc: 'Publish a route to the community.', icon: 'globe', metric: 'published', target: 1 },
  { id: 'garage_started', title: 'Garage Owner', desc: 'Add a bike to your garage.', icon: 'bicycle', metric: 'bikes', target: 1 },
  { id: 'garage_2', title: 'Two-Bike Garage', desc: 'Add 2 bikes to your garage.', icon: 'car-sport', metric: 'bikes', target: 2 },
  { id: 'first_fav', title: 'Collector', desc: 'Favourite a route.', icon: 'heart', metric: 'favourites', target: 1 },
];

export function computeBadges(m: AchievementMetrics): Badge[] {
  return BADGES.map((b) => {
    const current = m[b.metric] ?? 0;
    return { ...b, current, earned: current >= b.target };
  });
}
