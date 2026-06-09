import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { fetchRoadRoute } from '../../lib/routing';
import { getRouteWeather, getWeatherIcon, getWeatherColor, WeatherPoint } from '../../lib/weather';
import { checkFuelRange, FuelStatus } from '../../lib/fuel';
import { heavyHaptic, successHaptic, warningHaptic } from '../../lib/haptics';
import { speak, speakWaypointArrival, speakOffRoute, speakRideStart, speakRideEnd, speakDirection, isVoiceEnabled, setVoiceEnabled } from '../../lib/voice-nav';
import { NavStep, fetchRouteWithSteps, fetchRerouteToRoute, getManeuverIcon } from '../../lib/navigation';

type Coord = { latitude: number; longitude: number };

function haversineDistance(a: Coord, b: Coord): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function findNearestPointIndex(pos: Coord, route: Coord[]): number {
  let minDist = Infinity;
  let idx = 0;
  for (let i = 0; i < route.length; i++) {
    const d = haversineDistance(pos, route[i]);
    if (d < minDist) { minDist = d; idx = i; }
  }
  return idx;
}

function remainingDistance(fromIdx: number, route: Coord[]): number {
  let dist = 0;
  for (let i = fromIdx; i < route.length - 1; i++) {
    dist += haversineDistance(route[i], route[i + 1]);
  }
  return dist;
}

export default function RideMode() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [userLocation, setUserLocation] = useState<Coord | null>(null);
  const [speed, setSpeed] = useState(0);
  const [rideStarted, setRideStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [nextWaypointIdx, setNextWaypointIdx] = useState(0);
  const [offRoute, setOffRoute] = useState(false);
  const [routeLoading, setRouteLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherPoint[]>([]);
  const [fuel, setFuel] = useState<FuelStatus | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);

  // Turn-by-turn navigation
  const [navSteps, setNavSteps] = useState<NavStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isRerouting, setIsRerouting] = useState(false);
  const lastSpokenStep = useRef(-1);
  const offRouteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastPos = useRef<Coord | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeCoordsRef = useRef<Coord[]>([]);
  const waypointsRef = useRef<{ latitude: number; longitude: number; name: string }[]>([]);

  // Load trip data
  useEffect(() => {
    if (id?.startsWith('demo-')) {
      const found = sampleRoutes.find((r) => r.id === id);
      if (found) setTrip(found);
    } else {
      (async () => {
        const { data } = await supabase
          .from('saved_trips')
          .select('*')
          .eq('id', id)
          .single();
        if (data) setTrip(data);
      })();
    }
  }, [id]);

  // Fetch road-snapped route with turn-by-turn steps
  useEffect(() => {
    if (!trip) return;
    (async () => {
      setRouteLoading(true);
      const { coords, steps } = await fetchRouteWithSteps(trip.waypoints);
      setRouteCoords(coords);
      setNavSteps(steps);
      setRouteLoading(false);

      // Fetch weather for route points
      const weatherData = await getRouteWeather(
        trip.waypoints.map((w) => ({ latitude: w.lat, longitude: w.lng }))
      );
      setWeather(weatherData);

      // Check fuel range
      if (trip.route_stats?.distance) {
        const fuelStatus = await checkFuelRange(trip.route_stats.distance);
        setFuel(fuelStatus);
      }
    })();
  }, [trip]);

  const waypoints = (trip?.waypoints || []).map((wp, i) => ({
    latitude: wp.lat,
    longitude: wp.lng,
    name: wp.name || `Stop ${i + 1}`,
  }));

  // Keep refs in sync for use inside location callback
  useEffect(() => { routeCoordsRef.current = routeCoords; }, [routeCoords]);
  useEffect(() => { waypointsRef.current = waypoints; });

  const startRide = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Required', 'Enable location access to use ride mode.');
      return;
    }

    heavyHaptic();
    speakRideStart();
    setRideStarted(true);
    setElapsed(0);
    setDistanceTravelled(0);
    setNextWaypointIdx(0);

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      (loc) => {
        const pos: Coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setUserLocation(pos);
        setSpeed(Math.max(0, (loc.coords.speed ?? 0) * 2.23694));

        if (lastPos.current) {
          const d = haversineDistance(lastPos.current, pos);
          if (d > 2 && d < 500) {
            setDistanceTravelled((prev) => prev + d);
          }
        }
        lastPos.current = pos;

        const currentRoute = routeCoordsRef.current;
        if (currentRoute.length > 0) {
          const nearestIdx = findNearestPointIndex(pos, currentRoute);
          const distFromRoute = haversineDistance(pos, currentRoute[nearestIdx]);
          const wasOffRoute = distFromRoute > 150;
          setOffRoute(wasOffRoute);

          // Auto-reroute back to original route when off-route for 5+ seconds
          if (wasOffRoute && !offRouteTimer.current) {
            warningHaptic();
            offRouteTimer.current = setTimeout(async () => {
              setIsRerouting(true);
              speakOffRoute();
              const reroute = await fetchRerouteToRoute(
                { lat: pos.latitude, lng: pos.longitude },
                currentRoute
              );
              if (reroute.steps.length > 0) {
                setNavSteps(reroute.steps);
                setCurrentStepIdx(0);
                lastSpokenStep.current = -1;
                // Announce first reroute step
                speakDirection(reroute.steps[0].instruction);
              }
              setIsRerouting(false);
              offRouteTimer.current = null;
            }, 5000);
          } else if (!wasOffRoute && offRouteTimer.current) {
            clearTimeout(offRouteTimer.current);
            offRouteTimer.current = null;
          }

          // Advance turn-by-turn steps
          setCurrentStepIdx((prevStepIdx) => {
            setNavSteps((steps) => {
              if (steps.length === 0 || prevStepIdx >= steps.length) return steps;
              const nextStep = steps[prevStepIdx];
              const distToStep = haversineDistance(pos, nextStep.location);

              // Announce upcoming turn at 200m
              if (distToStep < 200 && lastSpokenStep.current !== prevStepIdx) {
                lastSpokenStep.current = prevStepIdx;
                const distText = distToStep > 100 ? 'In 200 metres, ' : '';
                speakDirection(`${distText}${nextStep.instruction}`);
              }

              // Advance to next step when within 30m of maneuver point
              if (distToStep < 30 && prevStepIdx < steps.length - 1) {
                return steps;
              }
              return steps;
            });

            // Check if we should advance
            if (navSteps.length > 0 && prevStepIdx < navSteps.length) {
              const step = navSteps[prevStepIdx];
              const d = haversineDistance(pos, step.location);
              if (d < 30 && prevStepIdx < navSteps.length - 1) {
                return prevStepIdx + 1;
              }
            }
            return prevStepIdx;
          });
        }

        const currentWaypoints = waypointsRef.current;
        if (currentWaypoints.length > 0) {
          setNextWaypointIdx((prevIdx) => {
            if (prevIdx < currentWaypoints.length) {
              const d = haversineDistance(pos, currentWaypoints[prevIdx]);
              if (d < 80) {
                successHaptic();
                speakWaypointArrival(currentWaypoints[prevIdx].name);
                return Math.min(prevIdx + 1, currentWaypoints.length - 1);
              }
            }
            return prevIdx;
          });
        }

        mapRef.current?.animateCamera({
          center: pos,
          heading: loc.coords.heading ?? 0,
          pitch: 60,
          zoom: 17,
        });
      },
    );
  }, []);

  const stopRide = useCallback(() => {
    heavyHaptic();
    speakRideEnd(distanceTravelled * 0.000621371, elapsed / 60);
    locationSub.current?.remove();
    locationSub.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRideStarted(false);
  }, [distanceTravelled, elapsed]);

  useEffect(() => {
    return () => {
      locationSub.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
      if (offRouteTimer.current) clearTimeout(offRouteTimer.current);
    };
  }, []);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  const fmtMiles = (m: number) => {
    const miles = m * 0.000621371;
    return miles >= 10 ? `${Math.round(miles)}` : miles.toFixed(1);
  };

  const distRemaining = userLocation && routeCoords.length > 0
    ? remainingDistance(findNearestPointIndex(userLocation, routeCoords), routeCoords)
    : routeCoords.length > 0
    ? remainingDistance(0, routeCoords)
    : 0;

  const etaMinutes = speed > 2 ? Math.round((distRemaining * 0.000621371) / speed * 60) : 0;

  const region = routeCoords.length > 0
    ? {
        latitude: routeCoords[Math.floor(routeCoords.length / 2)].latitude,
        longitude: routeCoords[Math.floor(routeCoords.length / 2)].longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }
    : waypoints.length > 0
    ? { latitude: waypoints[0].latitude, longitude: waypoints[0].longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : { latitude: 54.5, longitude: -3.5, latitudeDelta: 5, longitudeDelta: 5 };

  if (!trip || routeLoading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEmoji}>🗺️</Text>
          <Text style={styles.loadingTitle}>Planning route...</Text>
          <Text style={styles.loadingText}>Calculating road directions</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsUserLocation
        showsCompass={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterests={false}
        pitchEnabled
        rotateEnabled
      >
        {/* Route line - Google Maps blue */}
        {routeCoords.length > 1 && (
          <>
            <Polyline
              coordinates={routeCoords}
              strokeColor="rgba(66,133,244,0.3)"
              strokeWidth={10}
            />
            <Polyline
              coordinates={routeCoords}
              strokeColor="#4285F4"
              strokeWidth={5}
            />
          </>
        )}

        {/* Waypoint markers */}
        {waypoints.map((wp, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
            title={wp.name}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[
              styles.waypointMarker,
              i === 0 && styles.markerStart,
              i === waypoints.length - 1 && styles.markerEnd,
            ]}>
              {i === 0 ? (
                <Ionicons name="radio-button-on" size={12} color="#fff" />
              ) : i === waypoints.length - 1 ? (
                <Ionicons name="flag" size={10} color="#fff" />
              ) : (
                <Text style={styles.markerText}>{i}</Text>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top bar - route info */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <Text style={styles.routeName} numberOfLines={1}>{trip.name}</Text>
          {waypoints.length > 0 && nextWaypointIdx < waypoints.length && (
            <Text style={styles.nextStop} numberOfLines={1}>
              Next: {waypoints[nextWaypointIdx].name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.voiceBtn, !voiceOn && styles.voiceBtnOff]}
          onPress={() => { const next = !voiceOn; setVoiceOn(next); setVoiceEnabled(next); }}
        >
          <Ionicons name={voiceOn ? 'volume-high' : 'volume-mute'} size={18} color={voiceOn ? '#fff' : '#666'} />
        </TouchableOpacity>
      </View>

      {/* Off-route warning */}
      {offRoute && rideStarted && (
        <View style={styles.offRouteBanner}>
          <Ionicons name="navigate-outline" size={16} color="#fff" />
          <Text style={styles.offRouteText}>{isRerouting ? 'Rerouting...' : 'Off route'}</Text>
        </View>
      )}

      {/* Turn-by-turn instruction */}
      {rideStarted && navSteps.length > 0 && currentStepIdx < navSteps.length && !offRoute && (
        <View style={styles.turnCard}>
          <Text style={styles.turnIcon}>
            {getManeuverIcon(navSteps[currentStepIdx].maneuverType, navSteps[currentStepIdx].modifier)}
          </Text>
          <View style={styles.turnInfo}>
            <Text style={styles.turnInstruction} numberOfLines={1}>
              {navSteps[currentStepIdx].instruction}
            </Text>
            <Text style={styles.turnDistance}>
              {navSteps[currentStepIdx].distance > 1000
                ? `${(navSteps[currentStepIdx].distance / 1609).toFixed(1)} mi`
                : `${Math.round(navSteps[currentStepIdx].distance)} m`}
              {navSteps[currentStepIdx].roadName ? ` · ${navSteps[currentStepIdx].roadName}` : ''}
            </Text>
          </View>
        </View>
      )}

      {/* Weather strip */}
      {weather.length > 0 && (
        <View style={styles.weatherStrip}>
          {weather.map((w, i) => (
            <View key={i} style={styles.weatherItem}>
              <Ionicons
                name={getWeatherIcon(w.condition) as any}
                size={14}
                color={getWeatherColor(w.condition)}
              />
              <Text style={styles.weatherTemp}>{w.temperature}°</Text>
            </View>
          ))}
          {weather.some((w) => w.windSpeed > 30) && (
            <View style={styles.windWarning}>
              <Ionicons name="warning-outline" size={12} color="#FFC107" />
              <Text style={styles.windText}>High wind</Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom HUD - Google Maps style */}
      <View style={styles.bottomPanel}>
        {rideStarted ? (
          <>
            <View style={styles.navRow}>
              <View style={styles.navMetric}>
                <Text style={styles.navBigNumber}>{Math.round(speed)}</Text>
                <Text style={styles.navUnit}>mph</Text>
              </View>
              <View style={styles.navDivider} />
              <View style={styles.navMetric}>
                <Text style={styles.navBigNumber}>{fmtMiles(distRemaining)}</Text>
                <Text style={styles.navUnit}>mi left</Text>
              </View>
              <View style={styles.navDivider} />
              <View style={styles.navMetric}>
                <Text style={styles.navBigNumber}>{fmtTime(elapsed)}</Text>
                <Text style={styles.navUnit}>elapsed</Text>
              </View>
              {etaMinutes > 0 && (
                <>
                  <View style={styles.navDivider} />
                  <View style={styles.navMetric}>
                    <Text style={styles.navBigNumber}>{etaMinutes}</Text>
                    <Text style={styles.navUnit}>min ETA</Text>
                  </View>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.endRideBtn} onPress={stopRide}>
              <Text style={styles.endRideText}>End</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.preRide}>
            <View style={styles.preRideInfo}>
              <Text style={styles.preRideDist}>{fmtMiles(distRemaining)} mi</Text>
              <Text style={styles.preRideSub}>{waypoints.length} stops</Text>
              {fuel && (
                <View style={[styles.fuelRow, fuel.needsRefuel && styles.fuelRowWarn]}>
                  {fuel.needsRefuel ? (
                    <Ionicons name="warning-outline" size={12} color="#FFC107" />
                  ) : (
                    <Text style={{ fontSize: 11 }}>⛽</Text>
                  )}
                  <Text style={[styles.fuelText, fuel.needsRefuel && styles.fuelTextWarn]}>
                    {fuel.needsRefuel
                      ? `Refuel needed ~${fuel.refuelAt} mi in`
                      : `${fuel.rangeMiles} mi range`}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.startBtn} onPress={startRide}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  loadingCard: { alignItems: 'center', padding: 32 },
  loadingEmoji: { fontSize: 40 },
  loadingTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12 },
  loadingText: { color: '#8e8ea0', fontSize: 14, marginTop: 4 },
  map: { ...StyleSheet.absoluteFill },

  // Waypoint markers
  waypointMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    ...Platform.select({ ios: {
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3,
    }}),
  },
  markerStart: { backgroundColor: '#34A853' },
  markerEnd: { backgroundColor: '#EA4335' },
  markerText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(32,33,36,0.95)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topInfo: { flex: 1, marginLeft: 12 },
  routeName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  nextStop: { color: '#8ab4f8', fontSize: 13, marginTop: 2 },
  voiceBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(66,133,244,0.3)', justifyContent: 'center', alignItems: 'center',
  },
  voiceBtnOff: { backgroundColor: 'rgba(255,255,255,0.1)' },

  // Off route
  // Turn-by-turn card
  turnCard: {
    position: 'absolute',
    top: 120,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(32,33,36,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({ ios: {
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6,
    }}),
  },
  turnIcon: { fontSize: 28 },
  turnInfo: { flex: 1 },
  turnInstruction: { color: '#fff', fontSize: 16, fontWeight: '700' },
  turnDistance: { color: '#8ab4f8', fontSize: 13, marginTop: 2 },

  offRouteBanner: {
    position: 'absolute',
    top: 175,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EA4335',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({ ios: {
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
    }}),
  },
  offRouteText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Bottom panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#202124',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    ...Platform.select({ ios: {
      shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.3, shadowRadius: 6,
    }}),
  },

  // Navigation metrics row
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navMetric: { alignItems: 'center' },
  navBigNumber: { color: '#fff', fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
  navUnit: { color: '#9aa0a6', fontSize: 11, fontWeight: '500', marginTop: 2 },
  navDivider: { width: 1, height: 32, backgroundColor: '#3c4043' },

  // End ride button
  endRideBtn: {
    alignSelf: 'center',
    backgroundColor: '#EA4335',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 10,
    marginTop: 16,
  },
  endRideText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Pre-ride state
  preRide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preRideInfo: {},
  preRideDist: { color: '#fff', fontSize: 22, fontWeight: '700' },
  preRideSub: { color: '#9aa0a6', fontSize: 13, marginTop: 2 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4285F4',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Fuel indicator
  fuelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  fuelRowWarn: {},
  fuelText: { color: '#34A853', fontSize: 11, fontWeight: '600' },
  fuelTextWarn: { color: '#FFC107' },

  // Weather strip
  weatherStrip: {
    position: 'absolute',
    top: 110,
    right: 12,
    flexDirection: 'column',
    gap: 4,
    backgroundColor: 'rgba(32,33,36,0.9)',
    borderRadius: 10,
    padding: 8,
  },
  weatherItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weatherTemp: { color: '#fff', fontSize: 11, fontWeight: '600' },
  windWarning: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  windText: { color: '#FFC107', fontSize: 10, fontWeight: '600' },
});
