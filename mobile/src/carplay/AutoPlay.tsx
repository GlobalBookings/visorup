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
 *   The route preview shows distance/stops, a Fastest/Curvy toggle (rebuilds in
 *   place) and a Start ride action.
 *
 * DEPTH LIMIT: CarPlay allows at most 5 templates on the navigation stack, so the
 * preview keeps route-type and Start as in-place updates / a root reset rather
 * than pushing more templates.
 *
 * MAP LIMITATION: the iOS 26.5 CarPlay *Simulator* crashes inside Apple's own
 * CarPlayTemplateUIHost process when a CPMapTemplate loads
 * (-[CPSTemplateInstance vehicleSupportsDestinationSharing]: unrecognized
 * selector). That is an Apple simulator bug we cannot patch from the app. So the
 * native map is only rendered on real hardware (Device.isDevice); on the
 * simulator Start updates the summary instead, keeping the whole flow demoable.
 */
import React from 'react';
import { View, Text, StyleSheet, AppRegistry } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import {
  HybridAutoPlay,
  ListTemplate,
  SearchTemplate,
  InformationTemplate,
  MapTemplate,
  AutoPlayModules,
} from '@iternio/react-native-auto-play';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { searchPlaces } from '../../lib/geocode';
import { fetchRoadRoute } from '../../lib/routing';
import { buildRoundTrip } from '../../lib/roundtrip';
import { pois, poiCategories, POICategory } from '../../lib/pois';
import {
  ActiveRide,
  getActiveRide,
  subscribeActiveRide,
} from '../../lib/active-ride';
import { registerCarPlayIcons } from './icons';
import { colors } from '../../lib/theme';

type Coord = { latitude: number; longitude: number };
type Pref = 'fast' | 'curvy';
type BuildResult = { coords: Coord[]; markers: Coord[]; distanceMiles?: number; stops?: number };
type Builder = (pref: Pref) => Promise<BuildResult>;

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

// The head-unit CarPlay scene always mounts an RN root component named
// `AutoPlayRoot` when it connects (via getRootViewForAutoplay). MapTemplate
// re-registers it with the map content on real hardware; we register a default
// so the scene can always mount, even when the map is guarded off.
function AutoPlayRoot() {
  return <View style={styles.fill} />;
}

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

// Live map rendered on the car surface while a ride is running on the phone.
// It subscribes to the shared store and follows the rider's position.
function LiveRideMap() {
  const [ride, setRide] = React.useState<ActiveRide | null>(getActiveRide());
  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    const unsub = subscribeActiveRide((r) => {
      setRide(r);
      if (r?.position) {
        mapRef.current?.animateCamera({
          center: r.position,
          heading: r.heading,
          pitch: 60,
          zoom: 16,
        });
      }
    });
    return unsub;
  }, []);

  if (!ride) return <View style={styles.fill} />;
  const focus = ride.coords.length ? ride.coords : ride.position ? [ride.position] : [];

  return (
    <View style={styles.fill}>
      <MapView
        ref={mapRef}
        style={styles.fill}
        provider={PROVIDER_DEFAULT}
        initialRegion={regionFor(focus)}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
      >
        {ride.coords.length > 1 && (
          <Polyline coordinates={ride.coords} strokeColor={ACCENT} strokeWidth={6} />
        )}
        {ride.waypoints.map((w, i) => (
          <Marker key={i} coordinate={w} />
        ))}
        {ride.position && <Marker coordinate={ride.position} pinColor={ACCENT} />}
      </MapView>
      {ride.maneuver && (
        <View style={styles.banner}>
          <Text style={styles.bannerText} numberOfLines={2}>
            {ride.maneuver.instruction}
          </Text>
          <Text style={styles.bannerSub}>{ride.maneuver.distanceMeters} m</Text>
        </View>
      )}
    </View>
  );
}

// --- route preview (single template; route-type + start in place) ----------

async function openRoute(name: string, builder: Builder, allowRouteType: boolean) {
  const state: { pref: Pref } & BuildResult = { pref: 'fast', coords: [], markers: [] };
  Object.assign(state, await builder('fast'));

  let info: InformationTemplate | null = null;

  const items = () => {
    const miles = state.distanceMiles ?? routeMiles(state.coords);
    return [
      { type: 'text', title: { text: 'Distance' }, detailedText: { text: miles ? `${Math.round(miles)} mi` : 'n/a' } },
      { type: 'text', title: { text: 'Stops' }, detailedText: { text: String(state.stops ?? state.markers.length) } },
      {
        type: 'text',
        title: { text: 'Route' },
        detailedText: { text: allowRouteType ? (state.pref === 'curvy' ? 'Curvy' : 'Fastest') : 'Saved' },
      },
    ];
  };

  const setPref = async (pref: Pref) => {
    if (pref === state.pref) return;
    Object.assign(state, { pref }, await builder(pref));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?.updateItems(items() as any);
  };

  const start = () => {
    if (MAP_ENABLED && state.coords.length > 1) {
      const map = new MapTemplate({
        component: () => <RouteMap coords={state.coords} markers={state.markers} />,
        onStopNavigation: () => {},
      });
      map.setRootTemplate();
      return;
    }
    const withNote = [
      ...items(),
      { type: 'text', title: { text: 'Navigation' }, detailedText: { text: 'Opens on your car display' } },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?.updateItems(withNote as any);
  };

  const actions: Array<{ type: 'text'; title: string; style?: 'confirm'; onPress: () => void }> = [
    { type: 'text', title: 'Start ride', style: 'confirm', onPress: () => start() },
  ];
  if (allowRouteType) {
    actions.push({ type: 'text', title: 'Fastest', onPress: () => setPref('fast') });
    actions.push({ type: 'text', title: 'Curvy', onPress: () => setPref('curvy') });
  }

  info = new InformationTemplate({
    title: { text: name },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: items() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: { ios: actions as any },
  });
  info.push();
}

// dest is a single destination reached from the rider's current location.
function openDestination(name: string, dest: Coord) {
  openRoute(
    name,
    async (pref) => {
      const from = await currentLocation();
      const coords = await fetchRoadRoute(
        [
          { lat: from.latitude, lng: from.longitude },
          { lat: dest.latitude, lng: dest.longitude },
        ],
        pref
      );
      return { coords, markers: [from, dest], stops: 2 };
    },
    true
  );
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
  const coords = toCoords(trip);
  const markers = (trip.waypoints || []).map((w) => ({ latitude: w.lat, longitude: w.lng }));
  const distanceMiles = trip.route_stats?.distance ? trip.route_stats.distance * 0.000621371 : undefined;
  openRoute(
    trip.name,
    async () => ({ coords, markers, distanceMiles, stops: trip.waypoints?.length }),
    false
  );
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

function openLoop(miles: number) {
  openRoute(
    `${miles} mile loop`,
    async (pref) => {
      const from = await currentLocation();
      const loop = await buildRoundTrip(
        { lat: from.latitude, lng: from.longitude },
        miles,
        Math.floor(Math.random() * 360),
        pref
      );
      if (!loop) return { coords: [], markers: [from], stops: 0 };
      const coords = await fetchRoadRoute(
        loop.waypoints.map((w) => ({ lat: w.lat, lng: w.lng })),
        pref
      );
      return { coords, markers: [from], distanceMiles: loop.distanceMiles, stops: loop.waypoints.length };
    },
    true
  );
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
        onPress: () => openLoop(mi),
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
            onPress: () => openDestination(r.name, { latitude: r.lat, longitude: r.lng }),
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
        onPress: () => openDestination(p.name, { latitude: p.lat, longitude: p.lng }),
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

// --- phone -> CarPlay live ride sync ---------------------------------------

let carplayConnected = false;
let showingLive = false;
let liveInfo: InformationTemplate | null = null;
let lastLiveUpdate = 0;
// CarPlay templates must not be updated many times per second; the phone streams
// location several times a second, so throttle the car-side refresh.
const LIVE_UPDATE_MS = 1000;

function liveItems(ride: ActiveRide) {
  return [
    {
      type: 'text',
      title: { text: 'Next' },
      detailedText: { text: ride.maneuver?.instruction ?? ride.nextWaypointName ?? '—' },
    },
    { type: 'text', title: { text: 'In' }, detailedText: { text: ride.maneuver ? `${ride.maneuver.distanceMeters} m` : '—' } },
    { type: 'text', title: { text: 'Speed' }, detailedText: { text: `${Math.round(ride.speedMph)} mph` } },
    { type: 'text', title: { text: 'Travelled' }, detailedText: { text: `${ride.distanceTravelledMi.toFixed(1)} mi` } },
  ];
}

function showLiveRide(ride: ActiveRide) {
  showingLive = true;
  lastLiveUpdate = Date.now();
  if (MAP_ENABLED) {
    liveInfo = null;
    const map = new MapTemplate({
      component: () => <LiveRideMap />,
      onStopNavigation: () => {},
    });
    map.setRootTemplate();
    return;
  }
  liveInfo = new InformationTemplate({
    title: { text: ride.name },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: liveItems(ride) as any,
  });
  liveInfo.setRootTemplate();
}

function syncLiveRide(ride: ActiveRide | null) {
  if (!carplayConnected) return;
  if (ride) {
    if (!showingLive) {
      showLiveRide(ride);
      return;
    }
    // On real hardware LiveRideMap self-updates via its own subscription; the
    // info-card fallback is refreshed here, throttled to avoid flooding CarPlay.
    if (!liveInfo) return;
    const now = Date.now();
    if (now - lastLiveUpdate < LIVE_UPDATE_MS) return;
    lastLiveUpdate = now;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      liveInfo.updateItems(liveItems(ride) as any);
    } catch (_) {}
  } else if (showingLive) {
    showingLive = false;
    liveInfo = null;
    showMainMenu();
  }
}

export default function registerAutoPlay() {
  registerCarPlayIcons();
  AppRegistry.registerComponent(AutoPlayModules.AutoPlayRoot, () => AutoPlayRoot);
  subscribeActiveRide(syncLiveRide);
  HybridAutoPlay.addListener('didConnect', () => {
    carplayConnected = true;
    const ride = getActiveRide();
    if (ride) showLiveRide(ride);
    else showMainMenu();
  });
  HybridAutoPlay.addListener('didDisconnect', () => {
    carplayConnected = false;
    showingLive = false;
    liveInfo = null;
  });
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  banner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bannerText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  bannerSub: { color: ACCENT, fontSize: 16, fontWeight: '600', marginTop: 2 },
});
