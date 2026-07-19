import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { exportGpx, shareRouteCard } from '../../lib/share';
import { publishRoute, unpublishRoute, cloneRouteToMine } from '../../lib/library';
import { sampleRoutes } from '../../lib/sample-routes';
import { fetchRoadRoute } from '../../lib/routing';
import { cacheRoute, isCached } from '../../lib/offline';
import { getFavouriteRouteIds, toggleFavourite } from '../../lib/favourites';
import { getRouteWeather, getWeatherIcon, getWeatherColor, WeatherPoint } from '../../lib/weather';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

export default function RouteViewer() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadCoords, setRoadCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [cached, setCached] = useState(false);
  const [fav, setFav] = useState(false);
  const [weather, setWeather] = useState<WeatherPoint[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    if (demo === '1' || id?.startsWith('demo-')) {
      const found = sampleRoutes.find((r) => r.id === id);
      if (found) setTrip(found);
      setLoading(false);
    } else {
      (async () => {
        const { data, error } = await supabase
          .from('saved_trips')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) setTrip(data);
        setLoading(false);
      })();
    }
  }, [id, demo]);

  useEffect(() => {
    if (trip?.waypoints && trip.waypoints.length >= 2) {
      fetchRoadRoute(trip.waypoints).then(setRoadCoords);
    }
    if (trip) {
      isCached(trip.id).then(setCached);
      getFavouriteRouteIds().then((ids) => setFav(ids.has(trip.id))).catch(() => {});
      setIsPublic(!!trip.is_public);
    }
    if (trip?.waypoints && trip.waypoints.length > 0) {
      getRouteWeather(trip.waypoints.map((w) => ({ latitude: w.lat, longitude: w.lng })))
        .then(setWeather)
        .catch(() => {});
    }
  }, [trip]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)).catch(() => {});
  }, []);

  const isDemo = demo === '1' || id?.startsWith('demo-');
  const isOwner = !isDemo && !!trip && !!userId && trip.user_id === userId;
  const canClone = !!trip && !isOwner;

  const onTogglePublish = async () => {
    if (!trip) return;
    tapHaptic();
    setPublishing(true);
    if (isPublic) {
      const { error } = await unpublishRoute(trip.id);
      if (error) Alert.alert('Error', error); else { setIsPublic(false); }
    } else {
      const { error } = await publishRoute(trip);
      if (error) Alert.alert('Error', error);
      else { setIsPublic(true); successHaptic(); Alert.alert('Published', 'Your route is now discoverable by the community in Explore.'); }
    }
    setPublishing(false);
  };

  const onClone = async () => {
    if (!trip) return;
    tapHaptic();
    setCloning(true);
    const { error } = await cloneRouteToMine(trip);
    setCloning(false);
    if (error) { Alert.alert('Sign in required', error); return; }
    successHaptic();
    Alert.alert('Saved', 'This route has been copied to your saved routes.');
  };

  const onToggleFav = async () => {
    if (!trip) return;
    tapHaptic();
    const currently = fav;
    setFav(!currently);
    const { error } = await toggleFavourite(trip.id, currently);
    if (error) { setFav(currently); Alert.alert('Sign in required', error); }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Route not found</Text>
      </View>
    );
  }

  const coords = roadCoords.length > 0
    ? roadCoords
    : (trip.route_coords || []).map((c) => ({ latitude: c[0], longitude: c[1] }));

  const waypoints = (trip.waypoints || []).map((wp, i) => ({
    latitude: wp.lat,
    longitude: wp.lng,
    name: wp.name || `Stop ${i + 1}`,
  }));

  const region = coords.length > 0
    ? {
        latitude: coords.reduce((s, c) => s + c.latitude, 0) / coords.length,
        longitude: coords.reduce((s, c) => s + c.longitude, 0) / coords.length,
        latitudeDelta: Math.max(
          0.05,
          Math.max(...coords.map((c) => c.latitude)) - Math.min(...coords.map((c) => c.latitude)) + 0.1
        ),
        longitudeDelta: Math.max(
          0.05,
          Math.max(...coords.map((c) => c.longitude)) - Math.min(...coords.map((c) => c.longitude)) + 0.1
        ),
      }
    : waypoints.length > 0
    ? {
        latitude: waypoints[0].latitude,
        longitude: waypoints[0].longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }
    : { latitude: 54.5, longitude: -3.5, latitudeDelta: 10, longitudeDelta: 10 };

  const fmtDist = (m: number) => `${Math.round(m * 0.000621371)} miles`;

  const exportGPX = async () => {
    tapHaptic();
    await exportGpx({ name: trip.name, waypoints, track: coords });
  };

  const shareRoute = async () => {
    tapHaptic();
    const miles = trip.route_stats?.distance ? `${Math.round(trip.route_stats.distance * 0.000621371)} miles` : '';
    const message = `Check out my motorcycle route "${trip.name}" on VisorUp! ${waypoints.length} stops${miles ? `, ${miles}` : ''}. Plan yours at https://visorup.co.uk`;
    await shareRouteCard(mapRef.current, message);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
      >
        {coords.length > 1 && (
          <>
            <Polyline
              coordinates={coords}
              strokeColor="rgba(66,133,244,0.3)"
              strokeWidth={8}
            />
            <Polyline
              coordinates={coords}
              strokeColor="#4285F4"
              strokeWidth={4}
            />
          </>
        )}
        {waypoints.map((wp, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
            title={wp.name}
            pinColor={i === 0 ? '#34A853' : i === waypoints.length - 1 ? '#EA4335' : '#4285F4'}
          />
        ))}
      </MapView>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <View style={styles.nameRow}>
          <Text style={[styles.routeName, { flex: 1 }]}>{trip.name}</Text>
          <TouchableOpacity onPress={onToggleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? '#EA4335' : colors.textMuted} />
          </TouchableOpacity>
        </View>
        {trip.description ? (
          <Text style={styles.routeDesc}>{trip.description}</Text>
        ) : null}

        <View style={styles.statsRow}>
          {trip.route_stats?.distance && (
            <View style={styles.stat}>
              <Ionicons name="speedometer-outline" size={16} color={colors.accent} />
              <Text style={styles.statValue}>{fmtDist(trip.route_stats.distance)}</Text>
            </View>
          )}
          <View style={styles.stat}>
            <Ionicons name="location-outline" size={16} color={colors.accent} />
            <Text style={styles.statValue}>{waypoints.length} stops</Text>
          </View>
        </View>

        {weather.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Weather along route</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weatherRow}>
              {weather.map((w, i) => (
                <View key={i} style={styles.weatherCard}>
                  <Ionicons name={getWeatherIcon(w.condition) as any} size={22} color={getWeatherColor(w.condition)} />
                  <Text style={styles.weatherTemp}>{w.temperature}°C</Text>
                  <Text style={styles.weatherDesc} numberOfLines={1}>{w.description}</Text>
                  <View style={styles.weatherWind}>
                    <Ionicons name="flag-outline" size={10} color={colors.textMuted} />
                    <Text style={styles.weatherWindText}>{w.windSpeed} mph</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            {weather.some((w) => w.windSpeed > 30) && (
              <View style={styles.windAlert}>
                <Ionicons name="warning-outline" size={14} color="#FFC107" />
                <Text style={styles.windAlertText}>High winds on this route, ride with caution.</Text>
              </View>
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>Waypoints</Text>
        {waypoints.map((wp, i) => (
          <View key={i} style={styles.waypointRow}>
            <View style={[styles.waypointDot, i === 0 && styles.dotStart, i === waypoints.length - 1 && styles.dotEnd]} />
            <Text style={styles.waypointName}>{wp.name}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.rideBtn}
          onPress={() => { tapHaptic(); router.push(`/ride/${id}`); }}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.rideBtnText}>Start Ride</Text>
        </TouchableOpacity>

        {canClone && (
          <TouchableOpacity style={styles.editRouteBtn} onPress={onClone} disabled={cloning}>
            <Ionicons name="bookmark-outline" size={18} color={colors.accent} />
            <Text style={styles.editRouteText}>{cloning ? 'Saving…' : 'Save to my routes'}</Text>
          </TouchableOpacity>
        )}

        {isOwner && (
          <>
            <TouchableOpacity
              style={styles.editRouteBtn}
              onPress={() => { tapHaptic(); router.push({ pathname: '/(tabs)/build', params: { editId: id } }); }}
            >
              <Ionicons name="create-outline" size={18} color={colors.accent} />
              <Text style={styles.editRouteText}>Edit Route</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editRouteBtn, isPublic && { borderColor: colors.success, backgroundColor: 'rgba(39,174,96,0.1)' }]}
              onPress={onTogglePublish}
              disabled={publishing}
            >
              <Ionicons name={isPublic ? 'globe' : 'globe-outline'} size={18} color={isPublic ? colors.success : colors.accent} />
              <Text style={[styles.editRouteText, isPublic && { color: colors.success }]}>
                {publishing ? 'Working…' : isPublic ? 'Published (tap to unpublish)' : 'Publish to community'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, cached && styles.actionBtnActive]}
            onPress={async () => {
              if (!cached && trip) {
                await cacheRoute(trip, roadCoords);
                setCached(true);
                successHaptic();
                Alert.alert('Saved Offline', 'This route is now available without signal.');
              }
            }}
          >
            <Ionicons name={cached ? 'cloud-done' : 'cloud-download-outline'} size={18} color={cached ? '#34A853' : colors.accent} />
            <Text style={[styles.actionText, cached && { color: '#34A853' }]}>{cached ? 'Offline' : 'Save Offline'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={exportGPX}>
            <Ionicons name="download-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>GPX</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={shareRoute}>
            <Ionicons name="share-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.textMuted, fontSize: 16, marginTop: spacing.md },
  map: { height: '45%', width: '100%' },
  panel: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  panelContent: { padding: spacing.lg, paddingBottom: 40 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  routeName: { color: colors.text, fontSize: 22, fontWeight: '800' },
  routeDesc: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
  waypointRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  waypointDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4285F4' },
  dotStart: { backgroundColor: '#34A853' },
  dotEnd: { backgroundColor: '#EA4335' },
  waypointName: { color: colors.text, fontSize: 14 },
  weatherRow: { gap: spacing.sm, paddingVertical: 4, paddingRight: spacing.md },
  weatherCard: {
    alignItems: 'center', backgroundColor: colors.surfaceLight, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 14, minWidth: 84, gap: 2,
  },
  weatherTemp: { color: colors.text, fontSize: 16, fontWeight: '800' },
  weatherDesc: { color: colors.textMuted, fontSize: 10 },
  weatherWind: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  weatherWindText: { color: colors.textMuted, fontSize: 10 },
  windAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm,
    backgroundColor: 'rgba(255,193,7,0.12)', borderRadius: 10, padding: spacing.sm,
  },
  windAlertText: { color: '#FFC107', fontSize: 12, fontWeight: '600', flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnActive: { borderColor: '#34A853', backgroundColor: 'rgba(52,168,83,0.1)' },
  actionText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  rideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  rideBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  editRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editRouteText: { color: colors.accent, fontSize: 15, fontWeight: '700' },
});
