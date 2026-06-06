import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Share,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import { supabase, SavedTrip } from '../../lib/supabase';
import { colors, spacing } from '../../lib/theme';

export default function RouteViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) setTrip(data);
      setLoading(false);
    })();
  }, [id]);

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

  const coords = (trip.route_coords || []).map((c) => ({
    latitude: c[0],
    longitude: c[1],
  }));

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
    if (trip.gpx_data) {
      const fileName = `${trip.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.gpx`;
      const file = new File(Paths.document, fileName);
      file.create();
      file.write(trip.gpx_data);
      Alert.alert('GPX Saved', `Saved as ${fileName}`);
    } else {
      Alert.alert('No GPX Data', 'Re-save this route on visorup.co.uk to generate GPX data.');
    }
  };

  const shareRoute = async () => {
    try {
      await Share.share({
        message: `Check out my motorcycle route "${trip.name}" on VisorUp!`,
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
        mapType="standard"
        userInterfaceStyle="dark"
      >
        {coords.length > 1 && (
          <Polyline
            coordinates={coords}
            strokeColor={colors.accent}
            strokeWidth={4}
          />
        )}
        {waypoints.map((wp, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
            title={wp.name}
            pinColor={i === 0 ? '#27ae60' : i === waypoints.length - 1 ? '#e74c3c' : colors.accent}
          />
        ))}
      </MapView>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <Text style={styles.routeName}>{trip.name}</Text>

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

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={exportGPX}>
            <Ionicons name="download-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>Export GPX</Text>
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
  map: { height: '55%', width: '100%' },
  panel: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  panelContent: { padding: spacing.lg },
  routeName: { color: colors.text, fontSize: 22, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
  waypointRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  waypointDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  dotStart: { backgroundColor: '#27ae60' },
  dotEnd: { backgroundColor: '#e74c3c' },
  waypointName: { color: colors.text, fontSize: 14 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
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
  actionText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
});
