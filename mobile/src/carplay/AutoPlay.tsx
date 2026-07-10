/**
 * VisorUp CarPlay experience.
 *
 * Wiring: call `registerAutoPlay()` once from app/_layout.tsx (see mobile/CARPLAY.md).
 *
 * Menu flow (all built on templates that work on the CarPlay simulator):
 *   Main menu (List) -> My Routes / Looped Ride / Search Location / Points of Interest
 *     - My Routes   : the rider's saved routes (+ sample routes) -> route preview
 *     - Looped Ride : pick a distance -> generate a round trip from current location
 *     - Search      : geocode search (Nominatim) -> pick a destination
 *     - POIs        : category -> nearest points of interest -> pick a destination
 *   Destinations first ask for a route type (Fastest / Curvy) then build the route.
 *
 * MAP LIMITATION: the iOS 26.5 CarPlay *Simulator* crashes inside Apple's own
 * CarPlayTemplateUIHost process when a CPMapTemplate loads
 * (-[CPSTemplateInstance vehicleSupportsDestinationSharing]: unrecognized
 * selector). That is an Apple simulator bug we cannot patch from the app. So the
 * native map is only rendered on real hardware (Device.isDevice); on the
 * simulator we show a route summary (InformationTemplate) instead, keeping the
 * whole flow demoable. Turn-by-turn (CPTrip / navigation session) is a follow-up
 * that can reuse lib/navigation.ts once validated on a real head unit.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import {
  HybridAutoPlay,
  ListTemplate,
  SearchTemplate,
  InformationTemplate,
  MapTemplate,
} from '@iternio/react-native-auto-play';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { searchPlaces } from '../../lib/geocode';
import { fetchRoadRoute } from '../../lib/routing';
import { buildRoundTrip } from '../../lib/roundtrip';
import { pois, poiCategories, POICategory } from '../../lib/pois';
import { registerCarPlayIcons } from './icons';
import { colors } from '../../lib/theme';

type Coord = { latitude: number; longitude: number };
type Pref = 'fast' | 'curvy';

// See MAP LIMITATION above: only draw the native map on real hardware.
const MAP_ENABLED = Device.isDevice;
const UK_CENTRE: Coord = { latitude: 54.5, longitude: -3.5 };
const ACCENT = '#D68A2D';

// --- geo helpers -----------------------------------------------------------

function milesBetween(a: Coord, b: Coord): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function routeMiles(coords: Coord[]): number {
  let d = 0;
  for (let i = 1; i < coords.length; i++) d += milesBetween(coords[i - 1], coords[i]);
  return d;
}

function regionFor(coords: Coord[]) {
  if (coords.length === 0)
    return { latitude: 54.5, longitude: -3.5, latitudeDelta: 6, longitudeDelta: 6 };
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  return {
    latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
    longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
    latitudeDelta: Math.max(0.05, Math.max(...lats) - Math.min(...lats) + 0.1),
    longitudeDelta: Math.max(0.05, Math.max(...lngs) - Math.min(...lngs) + 0.1),
  };
}

async function currentLocation(): Promise<Coord> {
  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last) return { latitude: last.coords.latitude, longitude: last.coords.longitude };
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      const pos = await Location.getCurrentPositionAsync({});
      return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    }
  } catch (_) {}
  return UK_CENTRE;
}

// --- native map (real hardware only) --------------------------------------

function RouteMap({ coords, markers }: { coords: Coord[]; markers: Coord[] }) {
  return (
    <View style={styles.fill}>
      <MapView
        style={styles.fill}
        provider={PROVIDER_DEFAULT}
        initialRegion={regionFor(coords.length ? coords : markers)}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
      >
        {coords.length > 1 && <Polyline coordinates={coords} strokeColor={ACCENT} strokeWidth={5} />}
        {markers.map((m, i) => (
          <Marker key={i} coordinate={m} />
        ))}
      </MapView>
    </View>
  );
}

// --- route preview ---------------------------------------------------------

function showRoutePreview(opts: {
  name: string;
  coords: Coord[];
  markers: Coord[];
  distanceMiles?: number;
  stops?: number;
  prefLabel?: string;
}) {
  if (MAP_ENABLED && opts.coords.length > 1) {
    const map = new MapTemplate({
      component: () => <RouteMap coords={opts.coords} markers={opts.markers} />,
      onStopNavigation: () => {},
    });
    map.push();
    return;
  }

  const miles = opts.distanceMiles ?? routeMiles(opts.coords);
  const items = [
    { type: 'text', title: { text: 'Distance' }, detailedText: { text: miles ? `${Math.round(miles)} mi` : 'n/a' } },
    { type: 'text', title: { text: 'Stops' }, detailedText: { text: String(opts.stops ?? opts.markers.length) } },
    { type: 'text', title: { text: 'Route' }, detailedText: { text: opts.prefLabel ?? 'Saved' } },
    { type: 'text', title: { text: 'Map' }, detailedText: { text: 'Opens on your car display' } },
  ];
  const info = new InformationTemplate({
    title: { text: opts.name },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: items as any,
  });
  info.push();
}

function showMessage(text: string) {
  const info = new InformationTemplate({
    title: { text: 'VisorUp' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: [{ type: 'text', title: { text } }] as any,
  });
  info.push();
}

function chooseRouteType(onPick: (pref: Pref, label: string) => void) {
  const list = new ListTemplate({
    title: { text: 'Route Type' },
    sections: {
      type: 'default',
      items: [
        { type: 'default' as const, title: { text: 'Fastest' }, onPress: () => onPick('fast', 'Fastest') },
        { type: 'default' as const, title: { text: 'Curvy' }, onPress: () => onPick('curvy', 'Curvy') },
      ],
    },
  });
  list.push();
}

// dest is a single destination reached from the rider's current location.
function chooseDestination(name: string, dest: Coord) {
  chooseRouteType(async (pref, label) => {
    const from = await currentLocation();
    const coords = await fetchRoadRoute(
      [
        { lat: from.latitude, lng: from.longitude },
        { lat: dest.latitude, lng: dest.longitude },
      ],
      pref
    );
    showRoutePreview({ name, coords, markers: [from, dest], stops: 2, prefLabel: label });
  });
}

// --- saved routes ----------------------------------------------------------

function toCoords(trip: SavedTrip): Coord[] {
  if (trip.route_coords?.length) {
    return trip.route_coords.map((c) => ({ latitude: c[0], longitude: c[1] }));
  }
  return (trip.waypoints || []).map((w) => ({ latitude: w.lat, longitude: w.lng }));
}

async function fetchRoutes(): Promise<SavedTrip[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

function showSavedRoute(trip: SavedTrip) {
  showRoutePreview({
    name: trip.name,
    coords: toCoords(trip),
    markers: (trip.waypoints || []).map((w) => ({ latitude: w.lat, longitude: w.lng })),
    distanceMiles: trip.route_stats?.distance ? trip.route_stats.distance * 0.000621371 : undefined,
    stops: trip.waypoints?.length,
    prefLabel: 'Saved',
  });
}

async function showRouteList() {
  const routes = await fetchRoutes();
  const list = new ListTemplate({
    title: { text: 'My Routes' },
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
        browsable: true,
        onPress: () => showSavedRoute(r),
      })),
    },
  });
  list.push();
}

// --- looped ride -----------------------------------------------------------

function buildLoop(miles: number) {
  chooseRouteType(async (pref, label) => {
    const from = await currentLocation();
    const bearing = Math.floor(Math.random() * 360);
    const loop = await buildRoundTrip(
      { lat: from.latitude, lng: from.longitude },
      miles,
      bearing,
      pref
    );
    if (!loop) {
      showMessage('Could not build a loop from here. Try a different distance.');
      return;
    }
    const coords = await fetchRoadRoute(
      loop.waypoints.map((w) => ({ lat: w.lat, lng: w.lng })),
      pref
    );
    showRoutePreview({
      name: `${Math.round(loop.distanceMiles)} mi loop`,
      coords,
      markers: [from],
      distanceMiles: loop.distanceMiles,
      stops: loop.waypoints.length,
      prefLabel: label,
    });
  });
}

function showLoopMenu() {
  const list = new ListTemplate({
    title: { text: 'Looped Ride' },
    sections: {
      type: 'default',
      items: [25, 50, 100, 150].map((mi) => ({
        type: 'default' as const,
        title: { text: `${mi} mile loop` },
        detailedText: { text: 'Round trip from here' },
        browsable: true,
        onPress: () => buildLoop(mi),
      })),
    },
  });
  list.push();
}

// --- search ----------------------------------------------------------------

let searchTimer: ReturnType<typeof setTimeout> | null = null;

function showSearch() {
  const search: SearchTemplate = new SearchTemplate({
    title: { text: 'Search Location' },
    searchHint: 'Town, place or postcode',
    onSearchTextChanged: (text) => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(async () => {
        const results = await searchPlaces(text);
        search.updateSearchResults({
          type: 'default',
          items: results.map((r) => ({
            type: 'default' as const,
            title: { text: r.name },
            detailedText: { text: r.displayName },
            onPress: () => chooseDestination(r.name, { latitude: r.lat, longitude: r.lng }),
          })),
        });
      }, 400);
    },
    onSearchTextSubmitted: () => {},
  });
  search.push();
}

// --- points of interest ----------------------------------------------------

async function showPoiList(cat: POICategory, label: string) {
  const from = await currentLocation();
  const nearby = pois
    .filter((p) => p.category === cat)
    .map((p) => ({ p, d: milesBetween(from, { latitude: p.lat, longitude: p.lng }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 12);

  const list = new ListTemplate({
    title: { text: label },
    sections: {
      type: 'default',
      items: nearby.map(({ p, d }) => ({
        type: 'default' as const,
        title: { text: p.name },
        detailedText: { text: `${Math.round(d)} mi` },
        browsable: true,
        onPress: () => chooseDestination(p.name, { latitude: p.lat, longitude: p.lng }),
      })),
    },
  });
  list.push();
}

function showPoiCategories() {
  const list = new ListTemplate({
    title: { text: 'Points of Interest' },
    sections: {
      type: 'default',
      items: poiCategories.map((c) => ({
        type: 'default' as const,
        title: { text: c.label },
        browsable: true,
        onPress: () => showPoiList(c.id, c.label),
      })),
    },
  });
  list.push();
}

// --- main menu -------------------------------------------------------------

function showMainMenu() {
  const list = new ListTemplate({
    title: { text: 'VisorUp' },
    sections: {
      type: 'default',
      items: [
        { type: 'default' as const, title: { text: 'My Routes' }, browsable: true, onPress: () => showRouteList() },
        { type: 'default' as const, title: { text: 'Looped Ride' }, browsable: true, onPress: () => showLoopMenu() },
        { type: 'default' as const, title: { text: 'Search Location' }, browsable: true, onPress: () => showSearch() },
        { type: 'default' as const, title: { text: 'Points of Interest' }, browsable: true, onPress: () => showPoiCategories() },
      ],
    },
  });
  list.setRootTemplate();
}

export default function registerAutoPlay() {
  registerCarPlayIcons();
  HybridAutoPlay.addListener('didConnect', () => {
    showMainMenu();
  });
  HybridAutoPlay.addListener('didDisconnect', () => {});
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
});
