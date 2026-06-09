import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView,
  KeyboardAvoidingView, Platform, FlatList, Modal,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, MapPressEvent } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase, UserBike } from '../../lib/supabase';
import { fetchRoadRoute } from '../../lib/routing';
import { pois, poiCategories, POI, POICategory } from '../../lib/pois';
import { fuelStations } from '../../lib/fuel-data';
import { searchPlaces } from '../../lib/geocode';
import { tapHaptic, heavyHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type Waypoint = { latitude: number; longitude: number; name: string };
type Coord = { latitude: number; longitude: number };
type RoadPreference = 'fast' | 'curvy' | 'twisty';

function pointToSegmentDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const nx = ax + t * dx, ny = ay + t * dy;
  return Math.sqrt((px - nx) ** 2 + (py - ny) ** 2);
}

const ROAD_PREFS: { id: RoadPreference; label: string; icon: string; color: string; desc: string }[] = [
  { id: 'fast', label: 'Fast', icon: 'flash-outline', color: '#2d98da', desc: 'Shortest time, main roads' },
  { id: 'curvy', label: 'Curvy', icon: 'git-compare-outline', color: '#D68A2D', desc: 'Scenic roads, mild detours' },
  { id: 'twisty', label: 'Twisty', icon: 'infinite-outline', color: '#e74c3c', desc: 'Maximum bends, avoid main roads' },
];

export default function BuildRouteScreen() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  // Route state
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [routeName, setRouteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadPref, setRoadPref] = useState<RoadPreference>('curvy');

  // UI state
  const [showPanel, setShowPanel] = useState<'main' | 'pois' | 'days' | 'save' | null>('main');
  const [activePOICategories, setActivePOICategories] = useState<POICategory[]>([]);

  // Undo/redo history
  const [history, setHistory] = useState<Waypoint[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // POI detail popup
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number; displayName: string }[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Map region for POI filtering and zoom (performance)
  const [mapRegion, setMapRegion] = useState({ latitude: 54.0, longitude: -2.5, latitudeDelta: 8, longitudeDelta: 8 });

  // Bike selection
  const [bikes, setBikes] = useState<UserBike[]>([]);
  const [selectedBike, setSelectedBike] = useState<UserBike | null>(null);

  // Day planning
  const [dayMode, setDayMode] = useState<'miles' | 'hours'>('miles');
  const [maxPerDay, setMaxPerDay] = useState('200');
  const [dayBreaks, setDayBreaks] = useState<number[]>([]); // indices into waypoints where days split

  // Stats
  const [totalDistMiles, setTotalDistMiles] = useState(0);
  const [routeColor, setRouteColor] = useState('#D68A2D');

  // Load user bikes
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_bikes')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false });
        if (data && data.length > 0) {
          setBikes(data);
          setSelectedBike(data.find((b: UserBike) => b.is_primary) || data[0]);
        }
      }
    })();
  }, []);

  // Calculate total distance whenever routeCoords changes
  useEffect(() => {
    if (routeCoords.length < 2) { setTotalDistMiles(0); return; }
    let dist = 0;
    for (let i = 1; i < routeCoords.length; i++) {
      const prev = routeCoords[i - 1];
      const curr = routeCoords[i];
      const R = 6371000;
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    setTotalDistMiles(dist * 0.000621371);
  }, [routeCoords]);

  // Auto-split days based on max miles per day
  useEffect(() => {
    if (waypoints.length < 2 || totalDistMiles === 0) { setDayBreaks([]); return; }
    const max = parseInt(maxPerDay, 10) || 200;
    if (totalDistMiles <= max) { setDayBreaks([]); return; }
    const breaks: number[] = [];
    const distPerWp = totalDistMiles / (waypoints.length - 1);
    let accum = 0;
    for (let i = 1; i < waypoints.length; i++) {
      accum += distPerWp;
      if (accum >= max && i < waypoints.length - 1) {
        breaks.push(i);
        accum = 0;
      }
    }
    setDayBreaks(breaks);
  }, [waypoints, totalDistMiles, maxPerDay]);

  const fuelRange = selectedBike?.tank_litres && selectedBike?.mpg
    ? (selectedBike.tank_litres / 4.546) * selectedBike.mpg
    : null;
  const fuelWarning = fuelRange ? totalDistMiles > fuelRange * 0.8 : false;

  // Push state to history for undo/redo
  const pushHistory = useCallback((wps: Waypoint[]) => {
    setHistory((prev) => [...prev.slice(0, historyIdx + 1), wps]);
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx]);

  const undo = useCallback(async () => {
    if (historyIdx <= 0) return;
    tapHaptic();
    const prevWps = history[historyIdx - 1];
    setHistoryIdx((i) => i - 1);
    setWaypoints(prevWps);
    if (prevWps.length >= 2) {
      const wpForRoute = prevWps.map((w) => ({ lat: w.latitude, lng: w.longitude }));
      const coords = await fetchRoadRoute(wpForRoute, roadPref);
      setRouteCoords(coords);
    } else {
      setRouteCoords([]);
    }
  }, [historyIdx, history, roadPref]);

  const redo = useCallback(async () => {
    if (historyIdx >= history.length - 1) return;
    tapHaptic();
    const nextWps = history[historyIdx + 1];
    setHistoryIdx((i) => i + 1);
    setWaypoints(nextWps);
    if (nextWps.length >= 2) {
      const wpForRoute = nextWps.map((w) => ({ lat: w.latitude, lng: w.longitude }));
      const coords = await fetchRoadRoute(wpForRoute, roadPref);
      setRouteCoords(coords);
    } else {
      setRouteCoords([]);
    }
  }, [historyIdx, history, roadPref]);

  const onSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (text.length < 2) { setSearchResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setSearchResults(results);
    }, 400);
  }, []);

  const buildRoute = useCallback(async (wps: Waypoint[], pref?: RoadPreference, skipFuel?: boolean) => {
    if (wps.length < 2) { setRouteCoords([]); return; }
    const wpForRoute = wps.map((w) => ({ lat: w.latitude, lng: w.longitude }));
    const coords = await fetchRoadRoute(wpForRoute, pref || roadPref);
    setRouteCoords(coords);

    // Auto-insert fuel stops every 100 miles (only on first build, not recursive)
    if (!skipFuel && coords.length > 1) {
      let totalDist = 0;
      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1], curr = coords[i];
        const R = 6371000;
        const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
        const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        totalDist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }
      const routeMiles = totalDist * 0.000621371;

      if (routeMiles > 100) {
        if (fuelStations.length > 0) {
          const fuelPoints: Waypoint[] = [];
          let accumDist = 0;
          let nextStop = 100;

          for (let i = 1; i < coords.length; i++) {
            const prev = coords[i - 1], curr = coords[i];
            const R = 6371000;
            const dLat2 = (curr.latitude - prev.latitude) * Math.PI / 180;
            const dLon2 = (curr.longitude - prev.longitude) * Math.PI / 180;
            const a2 = Math.sin(dLat2 / 2) ** 2 + Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * Math.sin(dLon2 / 2) ** 2;
            accumDist += (R * 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2))) * 0.000621371;

            if (accumDist >= nextStop) {
              let nearestFuel = fuelStations[0];
              let nearestD = Infinity;
              for (const f of fuelStations) {
                const d = Math.sqrt((f.lat - curr.latitude) ** 2 + (f.lng - curr.longitude) ** 2);
                if (d < nearestD) { nearestD = d; nearestFuel = f; }
              }
              if (nearestD < 0.15) { // Within ~15km
                fuelPoints.push({ latitude: nearestFuel.lat, longitude: nearestFuel.lng, name: `⛽ ${nearestFuel.name}` });
              }
              nextStop = accumDist + 100;
            }
          }

          if (fuelPoints.length > 0) {
            const updated: Waypoint[] = [...wps];
            for (const fp of fuelPoints) {
              let bestIdx = updated.length - 1;
              let bestD = Infinity;
              for (let j = 0; j < updated.length - 1; j++) {
                const d = pointToSegmentDist(fp.latitude, fp.longitude, updated[j].latitude, updated[j].longitude, updated[j + 1].latitude, updated[j + 1].longitude);
                if (d < bestD) { bestD = d; bestIdx = j + 1; }
              }
              updated.splice(bestIdx, 0, fp);
            }
            setWaypoints(updated);
            const newWpForRoute = updated.map((w) => ({ lat: w.latitude, lng: w.longitude }));
            const newCoords = await fetchRoadRoute(newWpForRoute, pref || roadPref);
            setRouteCoords(newCoords);
          }
        }
      }
    }
  }, [roadPref, fuelRange]);

  const addSearchResult = useCallback(async (result: { name: string; lat: number; lng: number }) => {
    tapHaptic();
    const newWp: Waypoint = { latitude: result.lat, longitude: result.lng, name: result.name };
    const updated = [...waypoints, newWp];
    pushHistory(updated);
    setWaypoints(updated);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    await buildRoute(updated);
    mapRef.current?.animateToRegion({
      latitude: result.lat, longitude: result.lng, latitudeDelta: 0.1, longitudeDelta: 0.1,
    }, 500);
  }, [waypoints, pushHistory, buildRoute]);

  const addWaypoint = useCallback(async (e: MapPressEvent) => {
    tapHaptic();
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newWp: Waypoint = { latitude, longitude, name: `Stop ${waypoints.length + 1}` };
    const updated = [...waypoints, newWp];
    pushHistory(updated);
    setWaypoints(updated);
    await buildRoute(updated);
  }, [waypoints, buildRoute, pushHistory]);

  // Insert a POI at the optimal position in the route (nearest leg)
  const addPOIAsWaypoint = useCallback(async (poi: POI) => {
    tapHaptic();
    const newWp: Waypoint = { latitude: poi.lat, longitude: poi.lng, name: poi.name };

    if (waypoints.length < 2) {
      const updated = [...waypoints, newWp];
      pushHistory(updated);
      setWaypoints(updated);
      await buildRoute(updated);
      return;
    }

    // Find the nearest leg to insert into
    let bestIdx = waypoints.length;
    let bestDist = Infinity;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i];
      const b = waypoints[i + 1];
      const d = pointToSegmentDist(poi.lat, poi.lng, a.latitude, a.longitude, b.latitude, b.longitude);
      if (d < bestDist) { bestDist = d; bestIdx = i + 1; }
    }

    const updated = [...waypoints];
    updated.splice(bestIdx, 0, newWp);
    pushHistory(updated);
    setWaypoints(updated);
    await buildRoute(updated);
  }, [waypoints, buildRoute, pushHistory]);

  // Manual fuel stop insertion - every 100 miles
  const autoInsertFuelStops = useCallback(async () => {
    if (waypoints.length < 2 || totalDistMiles < 100) {
      Alert.alert('No Fuel Needed', 'Route is under 100 miles.');
      return;
    }

    tapHaptic();
    // Walk along route coords to find 100mi intervals
    const fuelInterval = 100;
    const fuelPoints: Waypoint[] = [];
    let accumDist = 0;
    let nextStop = fuelInterval;

    for (let i = 1; i < routeCoords.length; i++) {
      const prev = routeCoords[i - 1], curr = routeCoords[i];
      const R = 6371000;
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      accumDist += (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 0.000621371;

      if (accumDist >= nextStop) {
        let nearestFuel = fuelStations[0];
        let nearestD = Infinity;
        for (const f of fuelStations) {
          const d = Math.sqrt((f.lat - curr.latitude) ** 2 + (f.lng - curr.longitude) ** 2);
          if (d < nearestD) { nearestD = d; nearestFuel = f; }
        }
        if (nearestD < 0.15) {
          fuelPoints.push({ latitude: nearestFuel.lat, longitude: nearestFuel.lng, name: `⛽ ${nearestFuel.name}` });
        }
        nextStop = accumDist + fuelInterval;
      }
    }

    if (fuelPoints.length > 0) {
      const updated = [...waypoints];
      for (const fp of fuelPoints) {
        let bestIdx = updated.length - 1;
        let bestD = Infinity;
        for (let i = 0; i < updated.length - 1; i++) {
          const d = pointToSegmentDist(fp.latitude, fp.longitude, updated[i].latitude, updated[i].longitude, updated[i + 1].latitude, updated[i + 1].longitude);
          if (d < bestD) { bestD = d; bestIdx = i + 1; }
        }
        updated.splice(bestIdx, 0, fp);
      }
      pushHistory(updated);
      setWaypoints(updated);
      await buildRoute(updated, undefined, true); // skipFuel to avoid recursion
      successHaptic();
      Alert.alert('Fuel Stops Added', `Added ${fuelPoints.length} fuel stop(s) every ~100 miles.`);
    } else {
      Alert.alert('No Fuel Stations', 'Couldn\'t find fuel stations near the route.');
    }
  }, [waypoints, totalDistMiles, routeCoords, buildRoute, pushHistory]);

  const removeWaypoint = useCallback(async (idx: number) => {
    tapHaptic();
    const updated = waypoints.filter((_, i) => i !== idx);
    pushHistory(updated);
    setWaypoints(updated);
    await buildRoute(updated);
  }, [waypoints, buildRoute, pushHistory]);

  const clearRoute = useCallback(() => {
    heavyHaptic();
    setWaypoints([]);
    setRouteCoords([]);
    setRouteName('');
    setDayBreaks([]);
    setShowPanel('main');
  }, []);

  const changeRoadPref = useCallback((pref: RoadPreference) => {
    tapHaptic();
    setRoadPref(pref);
    setRouteColor(ROAD_PREFS.find((r) => r.id === pref)?.color || '#D68A2D');
    if (waypoints.length >= 2) buildRoute(waypoints, pref);
  }, [waypoints, buildRoute]);

  const togglePOICategory = useCallback((cat: POICategory) => {
    tapHaptic();
    setActivePOICategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const saveRoute = useCallback(async () => {
    if (!routeName.trim()) { Alert.alert('Name Required', 'Give your route a name.'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { Alert.alert('Sign In', 'Sign in to save routes.'); return; }

    setLoading(true);
    const { error } = await supabase.from('saved_trips').insert({
      user_id: user.id,
      name: routeName.trim(),
      description: '',
      waypoints: waypoints.map((w) => ({ lat: w.latitude, lng: w.longitude, name: w.name })),
      route_coords: routeCoords.map((c) => [c.latitude, c.longitude]),
      route_stats: { waypoints: waypoints.length, distance: totalDistMiles / 0.000621371 },
      settings: { road_preference: roadPref, bike_id: selectedBike?.id },
      day_segments: dayBreaks.length > 0
        ? dayBreaks.map((breakIdx, i) => ({
            day: i + 1,
            startIdx: i === 0 ? 0 : dayBreaks[i - 1],
            endIdx: breakIdx,
          }))
        : [],
      is_public: false,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      successHaptic();
      Alert.alert('Route Saved!', `${routeName} saved to your routes.`);
      clearRoute();
    }
  }, [routeName, waypoints, routeCoords, totalDistMiles, roadPref, selectedBike, dayBreaks, clearRoute]);

  // Only show POIs in the current map viewport (max 100 for performance)
  const visiblePOIs = pois.filter((p) => {
    if (!activePOICategories.includes(p.category)) return false;
    const latMin = mapRegion.latitude - mapRegion.latitudeDelta / 2;
    const latMax = mapRegion.latitude + mapRegion.latitudeDelta / 2;
    const lngMin = mapRegion.longitude - mapRegion.longitudeDelta / 2;
    const lngMax = mapRegion.longitude + mapRegion.longitudeDelta / 2;
    return p.lat >= latMin && p.lat <= latMax && p.lng >= lngMin && p.lng <= lngMax;
  }).slice(0, 100);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{ latitude: 54.0, longitude: -2.5, latitudeDelta: 8, longitudeDelta: 8 }}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsUserLocation
        onPress={addWaypoint}
        onRegionChangeComplete={setMapRegion}
      >
        {routeCoords.length > 1 && (
          <>
            <Polyline coordinates={routeCoords} strokeColor={`${routeColor}40`} strokeWidth={10} />
            <Polyline coordinates={routeCoords} strokeColor={routeColor} strokeWidth={4} />
          </>
        )}
        {waypoints.map((wp, i) => {
          const isFuel = wp.name.startsWith('⛽');
          const isStart = i === 0;
          const isEnd = i === waypoints.length - 1;
          return (
            <Marker
              key={`wp-${i}`}
              coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
              title={wp.name}
              description="Tap callout to remove"
              anchor={{ x: 0.5, y: 0.5 }}
              onCalloutPress={() => removeWaypoint(i)}
            >
              <View style={[
                styles.wpMarker,
                isStart && styles.wpMarkerStart,
                isEnd && styles.wpMarkerEnd,
                isFuel && styles.wpMarkerFuel,
              ]}>
                {isFuel ? (
                  <Text style={{ fontSize: 14 }}>⛽</Text>
                ) : isStart ? (
                  <Ionicons name="radio-button-on" size={10} color="#fff" />
                ) : isEnd ? (
                  <Ionicons name="flag" size={10} color="#fff" />
                ) : (
                  <Text style={styles.wpMarkerText}>{i}</Text>
                )}
              </View>
            </Marker>
          );
        })}
        {/* Day break markers */}
        {dayBreaks.map((breakIdx) => (
          <Marker
            key={`day-${breakIdx}`}
            coordinate={{ latitude: waypoints[breakIdx]?.latitude, longitude: waypoints[breakIdx]?.longitude }}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.dayMarker}>
              <Ionicons name="moon-outline" size={10} color="#fff" />
            </View>
          </Marker>
        ))}
        {/* POI markers - tap to show detail */}
        {visiblePOIs.map((poi, i) => {
          const cat = poiCategories.find((c) => c.id === poi.category);
          return (
            <Marker
              key={`poi-${i}`}
              coordinate={{ latitude: poi.lat, longitude: poi.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              onPress={(e) => { e.stopPropagation(); tapHaptic(); setSelectedPOI(poi); }}
            >
              <View style={[styles.poiMarker, { backgroundColor: cat?.color || colors.accent }]}>
                {cat?.icon === 'fuel' ? (
                  <Text style={{ fontSize: 12 }}>⛽</Text>
                ) : (
                  <Ionicons name={(cat?.icon as any) || 'location'} size={12} color="#fff" />
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* POI detail popup */}
      {selectedPOI && (
        <View style={styles.poiPopup}>
          <View style={styles.poiPopupContent}>
            <View style={styles.poiPopupHeader}>
              <View style={[styles.poiPopupIcon, { backgroundColor: (poiCategories.find((c) => c.id === selectedPOI.category)?.color || colors.accent) + '30' }]}>
                {selectedPOI.category === 'fuel' ? (
                  <Text style={{ fontSize: 18 }}>⛽</Text>
                ) : (
                  <Ionicons
                    name={(poiCategories.find((c) => c.id === selectedPOI.category)?.icon as any) || 'location'}
                    size={18}
                    color={poiCategories.find((c) => c.id === selectedPOI.category)?.color || colors.accent}
                  />
                )}
              </View>
              <View style={styles.poiPopupInfo}>
                <Text style={styles.poiPopupName} numberOfLines={1}>{selectedPOI.name}</Text>
                <Text style={styles.poiPopupCategory}>{poiCategories.find((c) => c.id === selectedPOI.category)?.label}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPOI(null)}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {selectedPOI.desc ? <Text style={styles.poiPopupDesc}>{selectedPOI.desc}</Text> : null}
            <TouchableOpacity
              style={styles.poiPopupAddBtn}
              onPress={() => { addPOIAsWaypoint(selectedPOI); setSelectedPOI(null); }}
            >
              <Ionicons name="add-circle" size={16} color="#fff" />
              <Text style={styles.poiPopupAddText}>Add to Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search bar */}
      <View style={styles.searchContainer}>
        {showSearch ? (
          <View style={styles.searchExpanded}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search a place..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(''); }}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.searchBtn} onPress={() => setShowSearch(true)}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <Text style={styles.searchBtnText}>Search a place...</Text>
          </TouchableOpacity>
        )}
        {searchResults.length > 0 && (
          <View style={styles.searchDropdown}>
            {searchResults.map((result, i) => (
              <TouchableOpacity key={i} style={styles.searchResult} onPress={() => addSearchResult(result)}>
                <Ionicons name="location-outline" size={16} color={colors.accent} />
                <View style={styles.searchResultText}>
                  <Text style={styles.searchResultName} numberOfLines={1}>{result.name}</Text>
                  <Text style={styles.searchResultAddr} numberOfLines={1}>{result.displayName}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map controls - zoom + undo/redo */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapBtn} onPress={() => {
          mapRef.current?.animateToRegion({
            ...mapRegion,
            latitudeDelta: mapRegion.latitudeDelta / 2,
            longitudeDelta: mapRegion.longitudeDelta / 2,
          }, 300);
        }}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapBtn} onPress={() => {
          mapRef.current?.animateToRegion({
            ...mapRegion,
            latitudeDelta: mapRegion.latitudeDelta * 2,
            longitudeDelta: mapRegion.longitudeDelta * 2,
          }, 300);
        }}>
          <Ionicons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        {historyIdx > 0 && (
          <TouchableOpacity style={styles.mapBtn} onPress={undo}>
            <Ionicons name="arrow-undo" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {historyIdx < history.length - 1 && (
          <TouchableOpacity style={styles.mapBtn} onPress={redo}>
            <Ionicons name="arrow-redo" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Instructions */}
      {waypoints.length === 0 && (
        <View style={styles.instructions}>
          <Ionicons name="finger-print-outline" size={18} color={colors.accent} />
          <Text style={styles.instructionText}>Tap the map to add waypoints</Text>
        </View>
      )}

      {/* Stats bar */}
      {waypoints.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statPill}>{waypoints.length} stops</Text>
          {totalDistMiles > 0 && <Text style={styles.statPill}>{Math.round(totalDistMiles)} mi</Text>}
          {dayBreaks.length > 0 && <Text style={styles.statPill}>{dayBreaks.length + 1} days</Text>}
          {fuelWarning && (
            <View style={styles.fuelWarnPill}>
              <Ionicons name="warning" size={11} color="#FFC107" />
              <Text style={styles.fuelWarnText}>Refuel needed</Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom panel */}
      <View style={styles.panel}>
        {showPanel === 'main' && (
          <>
            {/* Road preference selector */}
            <View style={styles.prefRow}>
              {ROAD_PREFS.map((pref) => (
                <TouchableOpacity
                  key={pref.id}
                  style={[styles.prefBtn, roadPref === pref.id && { backgroundColor: pref.color, borderColor: pref.color }]}
                  onPress={() => changeRoadPref(pref.id)}
                >
                  <Ionicons name={pref.icon as any} size={14} color={roadPref === pref.id ? '#fff' : colors.textMuted} />
                  <Text style={[styles.prefLabel, roadPref === pref.id && { color: '#fff' }]}>{pref.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bike selector */}
            {bikes.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bikeRow}>
                {bikes.map((bike) => (
                  <TouchableOpacity
                    key={bike.id}
                    style={[styles.bikePill, selectedBike?.id === bike.id && styles.bikePillActive]}
                    onPress={() => { tapHaptic(); setSelectedBike(bike); }}
                  >
                    <Ionicons name="bicycle-outline" size={12} color={selectedBike?.id === bike.id ? '#fff' : colors.textMuted} />
                    <Text style={[styles.bikeLabel, selectedBike?.id === bike.id && { color: '#fff' }]}>
                      {bike.nickname || `${bike.make} ${bike.model}`}
                    </Text>
                    {bike.mpg && <Text style={styles.bikeMpg}>{bike.mpg}mpg</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPanel('pois')}>
                <Ionicons name="layers-outline" size={16} color={colors.accent} />
                <Text style={styles.actionLabel}>POIs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPanel('days')}>
                <Ionicons name="moon-outline" size={16} color={colors.accent} />
                <Text style={styles.actionLabel}>Days</Text>
              </TouchableOpacity>
              {waypoints.length >= 2 && (
                <TouchableOpacity style={styles.actionBtn} onPress={autoInsertFuelStops}>
                  <Text style={{ fontSize: 14 }}>⛽</Text>
                  <Text style={[styles.actionLabel, { color: '#FFC107' }]}>Fuel</Text>
                </TouchableOpacity>
              )}
              {waypoints.length > 0 && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => { const rev = [...waypoints].reverse(); setWaypoints(rev); buildRoute(rev); tapHaptic(); }}>
                  <Ionicons name="swap-horizontal-outline" size={16} color={colors.accent} />
                  <Text style={styles.actionLabel}>Reverse</Text>
                </TouchableOpacity>
              )}
              {waypoints.length > 0 && (
                <TouchableOpacity style={styles.actionBtnDanger} onPress={clearRoute}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  <Text style={styles.actionLabelDanger}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Save button */}
            {waypoints.length >= 2 && (
              <TouchableOpacity style={styles.saveRow} onPress={() => setShowPanel('save')}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.saveLabel}>Save Route</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {showPanel === 'pois' && (
          <View>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Points of Interest</Text>
              <TouchableOpacity onPress={() => setShowPanel('main')}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.panelSubtitle}>Toggle layers on map. Tap a marker to insert it into your route.</Text>
            <View style={styles.poiGrid}>
              {poiCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.poiBtn, activePOICategories.includes(cat.id) && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => togglePOICategory(cat.id)}
                >
                  {cat.icon === 'fuel' ? (
                    <Text style={{ fontSize: 14 }}>⛽</Text>
                  ) : (
                    <Ionicons name={cat.icon as any} size={16} color={activePOICategories.includes(cat.id) ? '#fff' : cat.color} />
                  )}
                  <Text style={[styles.poiBtnLabel, activePOICategories.includes(cat.id) && { color: '#fff' }]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Nearby POIs along current route */}
            {routeCoords.length > 1 && (
              <View style={styles.nearbySection}>
                <Text style={styles.nearbyTitle}>Near your route</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {pois
                    .filter((p) => {
                      // Check if POI is within ~15km of any route coord (sampled)
                      const step = Math.max(1, Math.floor(routeCoords.length / 20));
                      for (let i = 0; i < routeCoords.length; i += step) {
                        const d = Math.sqrt((p.lat - routeCoords[i].latitude) ** 2 + (p.lng - routeCoords[i].longitude) ** 2);
                        if (d < 0.15) return true;
                      }
                      return false;
                    })
                    .slice(0, 10)
                    .map((poi, i) => {
                      const catInfo = poiCategories.find((c) => c.id === poi.category);
                      return (
                        <TouchableOpacity key={i} style={styles.nearbyChip} onPress={() => addPOIAsWaypoint(poi)}>
                          {catInfo?.icon === 'fuel' ? (
                            <Text style={{ fontSize: 11 }}>⛽</Text>
                          ) : (
                            <Ionicons name={catInfo?.icon as any || 'location'} size={12} color={catInfo?.color || colors.accent} />
                          )}
                          <Text style={styles.nearbyChipText} numberOfLines={1}>{poi.name}</Text>
                          <Ionicons name="add-circle-outline" size={14} color={colors.accent} />
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {showPanel === 'days' && (
          <View>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Day Planning</Text>
              <TouchableOpacity onPress={() => setShowPanel('main')}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.dayModeRow}>
              <TouchableOpacity
                style={[styles.dayModeBtn, dayMode === 'miles' && styles.dayModeBtnActive]}
                onPress={() => setDayMode('miles')}
              >
                <Text style={[styles.dayModeLabel, dayMode === 'miles' && { color: '#fff' }]}>Split by miles</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dayModeBtn, dayMode === 'hours' && styles.dayModeBtnActive]}
                onPress={() => setDayMode('hours')}
              >
                <Text style={[styles.dayModeLabel, dayMode === 'hours' && { color: '#fff' }]}>Split by hours</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dayInputRow}>
              <Text style={styles.dayInputLabel}>Max {dayMode === 'miles' ? 'miles' : 'hours'} per day:</Text>
              <TextInput
                style={styles.dayInput}
                value={maxPerDay}
                onChangeText={setMaxPerDay}
                keyboardType="numeric"
                placeholder={dayMode === 'miles' ? '200' : '6'}
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {dayBreaks.length > 0 && (
              <Text style={styles.dayResult}>{dayBreaks.length + 1} day trip ({Math.round(totalDistMiles)} mi total)</Text>
            )}
            {selectedBike && fuelRange && (
              <View style={styles.fuelInfo}>
                <Text style={{ fontSize: 12 }}>⛽</Text>
                <Text style={[styles.fuelInfoText, fuelWarning && { color: '#FFC107' }]}>
                  {selectedBike.nickname || selectedBike.make}: ~{Math.round(fuelRange)} mi range
                  {fuelWarning ? ' (refuel needed)' : ''}
                </Text>
              </View>
            )}
          </View>
        )}

        {showPanel === 'save' && (
          <View>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Save Route</Text>
              <TouchableOpacity onPress={() => setShowPanel('main')}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Route name..."
              placeholderTextColor={colors.textMuted}
              value={routeName}
              onChangeText={setRouteName}
              autoFocus
            />
            <View style={styles.saveSummary}>
              <Text style={styles.saveSummaryText}>{waypoints.length} stops · {Math.round(totalDistMiles)} mi · {ROAD_PREFS.find((r) => r.id === roadPref)?.label} roads</Text>
              {dayBreaks.length > 0 && <Text style={styles.saveSummaryText}>{dayBreaks.length + 1} days planned</Text>}
              {selectedBike && <Text style={styles.saveSummaryText}>Bike: {selectedBike.nickname || `${selectedBike.make} ${selectedBike.model}`}</Text>}
            </View>
            <TouchableOpacity style={[styles.confirmSaveBtn, loading && { opacity: 0.5 }]} onPress={saveRoute} disabled={loading}>
              <Text style={styles.confirmSaveText}>{loading ? 'Saving...' : 'Save Route'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },

  searchContainer: {
    position: 'absolute', top: 52, left: 12, right: 12, zIndex: 10,
  },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(32,33,36,0.9)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24,
  },
  searchBtnText: { color: colors.textMuted, fontSize: 13 },
  searchExpanded: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(32,33,36,0.95)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 4 },
  searchDropdown: {
    backgroundColor: 'rgba(32,33,36,0.95)', borderRadius: 12, marginTop: 4,
    overflow: 'hidden',
  },
  searchResult: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  searchResultText: { flex: 1 },
  searchResultName: { color: colors.text, fontSize: 13, fontWeight: '600' },
  searchResultAddr: { color: colors.textMuted, fontSize: 11, marginTop: 1 },

  mapControls: {
    position: 'absolute', top: 100, right: 12, gap: 8,
  },
  mapBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(32,33,36,0.85)', justifyContent: 'center', alignItems: 'center',
  },

  instructions: {
    position: 'absolute', top: 100, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(32,33,36,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
  },
  instructionText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  statsBar: {
    position: 'absolute', bottom: 280, right: 12,
    flexDirection: 'column', alignItems: 'flex-end', gap: 4,
  },
  statPill: {
    color: '#fff', fontSize: 11, fontWeight: '700',
    backgroundColor: 'rgba(32,33,36,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  fuelWarnPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,193,7,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  fuelWarnText: { color: '#FFC107', fontSize: 10, fontWeight: '600' },

  // Waypoint markers
  wpMarker: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#4285F4',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  wpMarkerStart: { backgroundColor: '#34A853' },
  wpMarkerEnd: { backgroundColor: '#EA4335' },
  wpMarkerFuel: { backgroundColor: '#FFC107', width: 28, height: 28, borderRadius: 14 },
  wpMarkerText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Day break markers
  dayMarker: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#9C27B0',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },

  // POI markers
  poiMarker: {
    width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },

  // POI detail popup
  poiPopup: {
    position: 'absolute', bottom: 280, left: 12, right: 12, zIndex: 20,
  },
  poiPopupContent: {
    backgroundColor: 'rgba(32,33,36,0.95)', borderRadius: 12, padding: 12,
  },
  poiPopupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  poiPopupIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  poiPopupInfo: { flex: 1 },
  poiPopupName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  poiPopupCategory: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  poiPopupDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 8 },
  poiPopupAddBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#4285F4', borderRadius: 8, paddingVertical: 10, marginTop: 10,
  },
  poiPopupAddText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Bottom panel
  panel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: spacing.md, paddingBottom: Platform.OS === 'ios' ? 32 : spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
    maxHeight: '45%',
  },

  // Road preferences
  prefRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  prefBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
  },
  prefLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },

  // Bike selector
  bikeRow: { marginBottom: 10 },
  bikePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14,
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, marginRight: 6,
  },
  bikePillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  bikeLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  bikeMpg: { color: colors.textMuted, fontSize: 9, opacity: 0.7 },

  // Actions
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.surfaceLight,
  },
  actionLabel: { color: colors.accent, fontSize: 11, fontWeight: '600' },
  actionBtnDanger: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,68,68,0.1)',
  },
  actionLabelDanger: { color: colors.danger, fontSize: 11, fontWeight: '600' },

  // Save row
  saveRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#4285F4', borderRadius: 10, padding: 12, marginTop: 10,
  },
  saveLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Panel headers
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  panelTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  panelSubtitle: { color: colors.textMuted, fontSize: 11, marginBottom: 10 },

  // POI grid
  poiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  poiBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
  },
  poiBtnLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  nearbySection: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  nearbyTitle: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  nearbyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceLight, paddingHorizontal: 8, paddingVertical: 6,
    borderRadius: 8, marginRight: 6, maxWidth: 160,
  },
  nearbyChipText: { color: colors.text, fontSize: 11, flex: 1 },

  // Day planning
  dayModeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  dayModeBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surfaceLight },
  dayModeBtnActive: { backgroundColor: colors.accent },
  dayModeLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  dayInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayInputLabel: { color: colors.text, fontSize: 13 },
  dayInput: {
    backgroundColor: colors.surfaceLight, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6,
    color: colors.text, fontSize: 14, fontWeight: '700', width: 60, textAlign: 'center',
  },
  dayResult: { color: colors.accent, fontSize: 12, fontWeight: '600', marginTop: 8 },
  fuelInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  fuelInfoText: { color: '#34A853', fontSize: 11, fontWeight: '600' },

  // Save panel
  nameInput: {
    backgroundColor: colors.surfaceLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12,
    color: colors.text, fontSize: 16, marginBottom: 10,
  },
  saveSummary: { marginBottom: 10 },
  saveSummaryText: { color: colors.textMuted, fontSize: 12, marginBottom: 2 },
  confirmSaveBtn: { backgroundColor: '#34A853', borderRadius: 10, padding: 14, alignItems: 'center' },
  confirmSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
