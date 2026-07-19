import AsyncStorage from '@react-native-async-storage/async-storage';
import { curatedRoutes, CuratedRoute } from './curated-routes';

export type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  region?: CuratedRoute['region'];
  routeIds: string[];
  badgeIcon: string;
};

const RIDDEN_KEY = 'vu_challenge_ridden';
const MIN_ROUTES = 3;

const byCurviness = [...curatedRoutes].sort((a, b) => b.curviness_score - a.curviness_score);

function idsForRegion(region: CuratedRoute['region'], limit: number): string[] {
  return byCurviness.filter((r) => r.region === region).slice(0, limit).map((r) => r.id);
}

function idsForTags(tags: string[], limit: number): string[] {
  return byCurviness
    .filter((r) => r.tags.some((t) => tags.some((tag) => t.includes(tag))))
    .slice(0, limit)
    .map((r) => r.id);
}

// Ensure a challenge has at least MIN_ROUTES ids, topping up from the highest
// curviness routes not already included.
function topUp(ids: string[], min: number): string[] {
  if (ids.length >= min) return ids;
  const result = [...ids];
  for (const r of byCurviness) {
    if (result.length >= min) break;
    if (!result.includes(r.id)) result.push(r.id);
  }
  return result;
}

function build(
  base: Omit<Challenge, 'routeIds'>,
  ids: string[],
): Challenge | null {
  const routeIds = topUp(ids, MIN_ROUTES);
  if (routeIds.length < MIN_ROUTES) return null;
  return { ...base, routeIds };
}

const rawChallenges: (Challenge | null)[] = [
  build(
    { id: 'scotlands-finest', title: "Scotland's Finest", subtitle: 'Ride the best of the Highlands', icon: 'flag-outline', region: 'scotland', badgeIcon: 'ribbon' },
    idsForRegion('scotland', 6),
  ),
  build(
    { id: 'welsh-dragons', title: 'Welsh Dragons', subtitle: 'Conquer the roads of Wales', icon: 'flame-outline', region: 'wales', badgeIcon: 'ribbon' },
    idsForRegion('wales', 6),
  ),
  build(
    { id: 'northern-passes', title: 'Northern Passes', subtitle: 'Tame the North of England', icon: 'triangle-outline', region: 'england-north', badgeIcon: 'ribbon' },
    idsForRegion('england-north', 6),
  ),
  build(
    { id: 'twisty-ten', title: 'The Twisty Ten', subtitle: "Britain's ten curviest roads", icon: 'git-branch-outline', badgeIcon: 'medal' },
    byCurviness.slice(0, 10).map((r) => r.id),
  ),
  build(
    { id: 'coast-to-coast', title: 'Coast to Coast', subtitle: 'Chase the sea on coastal runs', icon: 'boat-outline', badgeIcon: 'medal' },
    idsForTags(['coast', 'sea'], 8),
  ),
  build(
    { id: 'peak-bagger', title: 'Peak Bagger', subtitle: 'Climb the mountain passes', icon: 'trending-up-outline', badgeIcon: 'trophy' },
    idsForTags(['pass', 'mountain', 'peak'], 8),
  ),
];

export const CHALLENGES: Challenge[] = rawChallenges.filter((c): c is Challenge => c !== null);

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export async function getRiddenRouteIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(RIDDEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    return new Set();
  } catch {
    return new Set();
  }
}

export async function markRouteRidden(routeId: string, ridden: boolean): Promise<void> {
  try {
    const current = await getRiddenRouteIds();
    if (ridden) current.add(routeId);
    else current.delete(routeId);
    await AsyncStorage.setItem(RIDDEN_KEY, JSON.stringify([...current]));
  } catch {
    // Ignore storage failures; progress simply won't persist this time.
  }
}

export function challengeProgress(
  c: Challenge,
  ridden: Set<string>,
): { done: number; total: number; complete: boolean } {
  const total = c.routeIds.length;
  const done = c.routeIds.filter((id) => ridden.has(id)).length;
  return { done, total, complete: total > 0 && done === total };
}

export function totalCuratedMiles(ridden: Set<string>): number {
  return curatedRoutes.reduce((sum, r) => (ridden.has(r.id) ? sum + r.distance_miles : sum), 0);
}
