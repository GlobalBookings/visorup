import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { fetchRoadRoute } from '../../lib/routing';
import { cacheRoute, isCached } from '../../lib/offline';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

export default function RouteViewer() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadCoords, setRoadCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [cached, setCached] = useState(false);

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
    }
  }, [trip]);

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
    // Generate GPX from route coords
    const gpxPoints = coords.map((c) => `      <trkpt lat="${c.latitude}" lon="${c.longitude}"></trkpt>`).join('\n');
    const gpxWaypoints = waypoints.map((w) => `  <wpt lat="${w.latitude}" lon="${w.longitude}"><name>${w.name}</name></wpt>`).join('\n');
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VisorUp">
  <metadata><name>${trip.name}</name></metadata>
${gpxWaypoints}
  <trk>
    <name>${trip.name}</name>
    <trkseg>
${gpxPoints}
    </trkseg>
  </trk>
</gpx>`;

    const fileName = `${trip.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.gpx`;
    const file = new File(Paths.document, fileName);
    file.create();
    file.write(gpx);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/gpx+xml', dialogTitle: 'Share GPX' });
    } else {
      Alert.alert('GPX Saved', `Saved as ${fileName}`);
    }
  };

  const shareRoute = async () => {
    tapHaptic();
    try {
      const message = `Check out my motorcycle route "${trip.name}" on VisorUp! ${waypoints.length} stops, ${trip.route_stats?.distance ? Math.round(trip.route_stats.distance * 0.000621371) + ' miles' : ''}`;
      await Share.share({
        message,
        url: trip.share_slug ? `https://visorup.co.uk/shared/${trip.share_slug}` : 'https://visorup.co.uk',
      });
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      <MapView
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
        <Text style={styles.routeName}>{trip.name}</Text>
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
});
