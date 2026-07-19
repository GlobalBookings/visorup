import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Ride, SavedTrip } from '../../lib/supabase';
import { exportGpx, shareRouteCard } from '../../lib/share';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type Coord = { latitude: number; longitude: number };

function fmtMiles(m: number) {
  const miles = m * 0.000621371;
  return miles >= 10 ? `${Math.round(miles)}` : miles.toFixed(1);
}

function fmtTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export default function RideDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [planned, setPlanned] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('rides').select('*').eq('id', id).single();
      if (data) setRide(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!ride?.trip_id) { setPlanned(null); return; }
    (async () => {
      const { data } = await supabase.from('saved_trips').select('*').eq('id', ride.trip_id).single();
      if (data) setPlanned(data);
    })();
  }, [ride?.trip_id]);

  const shareRide = async () => {
    if (!ride) return;
    tapHaptic();
    const message = `I just rode ${fmtMiles(ride.distance_m)} miles in ${fmtTime(ride.duration_s)} on VisorUp (avg ${Math.round(ride.avg_speed)} mph). Plan your own ride at https://visorup.co.uk`;
    await shareRouteCard(mapRef.current, message);
  };

  const exportGPX = async () => {
    if (!ride) return;
    tapHaptic();
    await exportGpx({
      name: ride.name,
      track: (ride.track || []).map((c) => ({ latitude: c[0], longitude: c[1] })),
    });
  };

  const deleteRide = () => {
    Alert.alert('Delete Ride', 'Remove this ride from your history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('rides').delete().eq('id', id);
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Ride not found</Text>
      </View>
    );
  }

  const track: Coord[] = (ride.track || []).map((c) => ({ latitude: c[0], longitude: c[1] }));
  const plannedCoords: Coord[] = (planned?.route_coords || []).map((c) => ({ latitude: c[0], longitude: c[1] }));
  const plannedMiles = planned?.route_stats?.distance ? planned.route_stats.distance * 0.000621371 : null;
  const actualMiles = ride.distance_m * 0.000621371;
  const diffMiles = plannedMiles != null ? actualMiles - plannedMiles : null;

  const region = track.length > 0
    ? {
        latitude: track.reduce((s, c) => s + c.latitude, 0) / track.length,
        longitude: track.reduce((s, c) => s + c.longitude, 0) / track.length,
        latitudeDelta: Math.max(0.05, Math.max(...track.map((c) => c.latitude)) - Math.min(...track.map((c) => c.latitude)) + 0.05),
        longitudeDelta: Math.max(0.05, Math.max(...track.map((c) => c.longitude)) - Math.min(...track.map((c) => c.longitude)) + 0.05),
      }
    : { latitude: 54.5, longitude: -3.5, latitudeDelta: 8, longitudeDelta: 8 };

  const stats = [
    { icon: 'speedometer-outline', label: 'Distance', value: `${fmtMiles(ride.distance_m)} mi` },
    { icon: 'time-outline', label: 'Duration', value: fmtTime(ride.duration_s) },
    { icon: 'trending-up-outline', label: 'Avg speed', value: `${Math.round(ride.avg_speed)} mph` },
    { icon: 'flash-outline', label: 'Max speed', value: `${Math.round(ride.max_speed)} mph` },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: ride.name }} />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
      >
        {plannedCoords.length > 1 && (
          <Polyline coordinates={plannedCoords} strokeColor="rgba(66,133,244,0.7)" strokeWidth={3} lineDashPattern={[6, 6]} />
        )}
        {track.length > 1 && (
          <>
            <Polyline coordinates={track} strokeColor="rgba(214,138,45,0.3)" strokeWidth={8} />
            <Polyline coordinates={track} strokeColor={colors.accent} strokeWidth={4} />
            <Marker coordinate={track[0]} pinColor="#34A853" title="Start" />
            <Marker coordinate={track[track.length - 1]} pinColor="#EA4335" title="Finish" />
          </>
        )}
      </MapView>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <Text style={styles.name}>{ride.name}</Text>
        <Text style={styles.date}>
          {new Date(ride.started_at || ride.created_at).toLocaleString(undefined, {
            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={18} color={colors.accent} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {planned && (
          <View style={styles.compareCard}>
            <View style={styles.compareHeader}>
              <View style={styles.legendRow}>
                <View style={[styles.legendLine, { backgroundColor: '#4285F4' }]} />
                <Text style={styles.legendLabel}>Planned</Text>
                <View style={[styles.legendLine, { backgroundColor: colors.accent, marginLeft: 12 }]} />
                <Text style={styles.legendLabel}>Actual</Text>
              </View>
            </View>
            <View style={styles.compareRow}>
              <View style={styles.compareCol}>
                <Text style={styles.compareValue}>{plannedMiles != null ? plannedMiles.toFixed(1) : '—'}</Text>
                <Text style={styles.compareLabel}>Planned mi</Text>
              </View>
              <View style={styles.compareCol}>
                <Text style={styles.compareValue}>{actualMiles.toFixed(1)}</Text>
                <Text style={styles.compareLabel}>Actual mi</Text>
              </View>
              <View style={styles.compareCol}>
                <Text style={[styles.compareValue, diffMiles != null && diffMiles > 0 ? { color: '#EA4335' } : { color: '#34A853' }]}>
                  {diffMiles != null ? `${diffMiles > 0 ? '+' : ''}${diffMiles.toFixed(1)}` : '—'}
                </Text>
                <Text style={styles.compareLabel}>Difference</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={shareRide}>
            <Ionicons name="share-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={exportGPX}>
            <Ionicons name="download-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>GPX</Text>
          </TouchableOpacity>
        </View>

        {ride.trip_id && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => { tapHaptic(); router.push(`/route/${ride.trip_id}`); }}
          >
            <Ionicons name="map-outline" size={18} color={colors.accent} />
            <Text style={styles.linkText}>View planned route</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => { tapHaptic(); router.push('/rides'); }}
        >
          <Ionicons name="list-outline" size={18} color={colors.accent} />
          <Text style={styles.linkText}>All my rides</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteRide}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteText}>Delete ride</Text>
        </TouchableOpacity>
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
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  date: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  statCard: {
    width: '47%', backgroundColor: colors.surfaceLight, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 4 },
  statLabel: { color: colors.textMuted, fontSize: 12 },
  compareCard: {
    backgroundColor: colors.surfaceLight, borderRadius: 12, padding: spacing.md, marginTop: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  compareHeader: { marginBottom: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendLine: { width: 16, height: 3, borderRadius: 2, marginRight: 5 },
  legendLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  compareCol: { alignItems: 'center', flex: 1 },
  compareValue: { color: colors.text, fontSize: 18, fontWeight: '800' },
  compareLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.surfaceLight, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  actionText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.surfaceLight, borderRadius: 10, padding: spacing.md, marginTop: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  linkText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 10, padding: spacing.md, marginTop: spacing.sm,
  },
  deleteText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});
