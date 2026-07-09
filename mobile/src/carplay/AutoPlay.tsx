/**
 * VisorUp CarPlay experience (STARTING POINT — requires on-device validation).
 *
 * Wiring: call `registerAutoPlay()` once from app/_layout.tsx (see mobile/CARPLAY.md).
 * When a CarPlay head unit connects, we show a list of the rider's saved routes
 * (plus the built-in sample routes). Selecting one opens a MapTemplate that
 * renders the route on a native map surface.
 *
 * Full turn-by-turn on the car screen (CPTrip / navigation session / maneuvers)
 * is a follow-up: the phone already has the guidance engine in lib/navigation.ts
 * and lib/voice-nav.ts, which can drive the MapTemplate maneuvers once validated.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import {
  HybridAutoPlay,
  ListTemplate,
  MapTemplate,
} from '@iternio/react-native-auto-play';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { registerCarPlayIcons } from './icons';
import { colors } from '../../lib/theme';

type Coord = { latitude: number; longitude: number };

function toCoords(trip: SavedTrip): Coord[] {
  if (trip.route_coords?.length) {
    return trip.route_coords.map((c) => ({ latitude: c[0], longitude: c[1] }));
  }
  return (trip.waypoints || []).map((w) => ({ latitude: w.lat, longitude: w.lng }));
}

function regionFor(coords: Coord[]) {
  if (coords.length === 0) return { latitude: 54.5, longitude: -3.5, latitudeDelta: 6, longitudeDelta: 6 };
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  return {
    latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
    longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
    latitudeDelta: Math.max(0.05, Math.max(...lats) - Math.min(...lats) + 0.1),
    longitudeDelta: Math.max(0.05, Math.max(...lngs) - Math.min(...lngs) + 0.1),
  };
}

function RouteMapScreen({ trip }: { trip: SavedTrip }) {
  const coords = toCoords(trip);
  return (
    <View style={styles.fill}>
      <MapView
        style={styles.fill}
        provider={PROVIDER_DEFAULT}
        initialRegion={regionFor(coords)}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
      >
        {coords.length > 1 && <Polyline coordinates={coords} strokeColor="#4285F4" strokeWidth={5} />}
        {(trip.waypoints || []).map((w, i) => (
          <Marker key={i} coordinate={{ latitude: w.lat, longitude: w.lng }} />
        ))}
      </MapView>
    </View>
  );
}

async function fetchRoutes(): Promise<SavedTrip[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (data?.length) return data as SavedTrip[];
    }
  } catch (_) {}
  return sampleRoutes as unknown as SavedTrip[];
}

function showRoute(trip: SavedTrip) {
  const mapTemplate = new MapTemplate({
    component: () => <RouteMapScreen trip={trip} />,
    onStopNavigation: () => {},
  });
  mapTemplate.setRootTemplate();
}

async function showRouteList() {
  const routes = await fetchRoutes();
  const listTemplate = new ListTemplate({
    title: { text: 'VisorUp Routes' },
    sections: {
      type: 'default',
      items: routes.map((r) => ({
        type: 'default' as const,
        title: { text: r.name },
        detailedText: {
          text: r.route_stats?.distance
            ? `${Math.round(r.route_stats.distance * 0.000621371)} mi`
            : `${r.waypoints?.length ?? 0} stops`,
        },
        onPress: () => showRoute(r),
      })),
    },
  });
  listTemplate.setRootTemplate();
}

export default function registerAutoPlay() {
  registerCarPlayIcons();
  HybridAutoPlay.addListener('didConnect', () => {
    showRouteList();
  });
  HybridAutoPlay.addListener('didDisconnect', () => {});
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
});
