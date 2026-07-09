import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Ride } from '../../lib/supabase';
import { RouteListSkeleton } from '../../components/Skeleton';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

function fmtMiles(m: number) {
  const miles = m * 0.000621371;
  return miles >= 10 ? `${Math.round(miles)}` : miles.toFixed(1);
}

function fmtTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RidesList() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signedIn, setSignedIn] = useState(true);

  const fetchRides = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSignedIn(false); setLoading(false); return; }
    setSignedIn(true);
    const { data } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setRides(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  }, [fetchRides]);

  const totalMiles = rides.reduce((s, r) => s + r.distance_m * 0.000621371, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'My Rides' }} />
        <RouteListSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'My Rides' }} />
      {!signedIn ? (
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>Sign in to record and view your rides.</Text>
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="speedometer-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>No rides yet.</Text>
          <Text style={styles.emptySub}>Start a ride to record your distance, time and route.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          ListHeaderComponent={
            <View style={styles.summary}>
              <Text style={styles.summaryValue}>{Math.round(totalMiles)}</Text>
              <Text style={styles.summaryLabel}>total miles across {rides.length} ride{rides.length === 1 ? '' : 's'}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => { tapHaptic(); router.push(`/rides/${item.id}`); }}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="navigate" size={18} color={colors.accent} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardMeta}>{fmtDate(item.started_at || item.created_at)}</Text>
                <Text style={styles.cardStats}>
                  {fmtMiles(item.distance_m)} mi · {fmtTime(item.duration_s)} · {Math.round(item.avg_speed)} mph avg
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: 8 },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  emptySub: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  list: { padding: spacing.lg },
  summary: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, alignItems: 'center',
  },
  summaryValue: { color: colors.accent, fontSize: 36, fontWeight: '900' },
  summaryLabel: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs,
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  cardStats: { color: colors.accent, fontSize: 12, fontWeight: '600', marginTop: 3 },
});
