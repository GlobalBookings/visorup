import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { colors, spacing } from '../../lib/theme';

export default function MyRoutes() {
  const [routes, setRoutes] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const fetchRoutes = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (!u) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', u.id)
      .order('updated_at', { ascending: false });

    if (!error && data) setRoutes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRoutes();
    setRefreshing(false);
  }, [fetchRoutes]);

  const fmtDist = (m: number) => {
    const miles = Math.round(m * 0.000621371);
    return miles > 0 ? `${miles} mi` : '--';
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Sign in to see your routes</Text>
        <Text style={styles.emptyText}>
          Build routes on visorup.co.uk, save them to your profile, then view them here.
        </Text>
      </View>
    );
  }

  if (routes.length === 0) {
    return (
      <View style={styles.center}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        <Ionicons name="map-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No saved routes yet</Text>
        <Text style={styles.emptyText}>
          Head to visorup.co.uk/build-route to create your first motorcycle route.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={routes}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push(`/route/${item.id}`)}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="navigate-outline" size={20} color={colors.accent} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.metaItem}>
              <Ionicons name="location-outline" size={12} color={colors.textMuted} />{' '}
              {item.route_stats?.waypoints || item.waypoints?.length || 0} stops
            </Text>
            <Text style={styles.metaItem}>
              <Ionicons name="speedometer-outline" size={12} color={colors.textMuted} />{' '}
              {item.route_stats?.distance ? fmtDist(item.route_stats.distance) : '--'}
            </Text>
            <Text style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />{' '}
              {fmtDate(item.updated_at)}
            </Text>
          </View>
          {item.route_coords && item.route_coords.length > 0 && (
            <View style={styles.hasRoute}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.hasRouteText}>Full route saved</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: { padding: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    color: colors.textMuted,
    fontSize: 12,
  },
  hasRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  hasRouteText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
});
