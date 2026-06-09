import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<SavedTrip[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (u) {
      const { data } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', u.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      if (data) setRoutes(data);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const fmtDist = (m: number) => `${Math.round(m * 0.000621371)} mi`;

  const quickActions = [
    { icon: 'add-circle-outline' as const, label: 'Build Route', color: '#4285F4', onPress: () => router.push('/(tabs)/build') },
    { icon: 'compass-outline' as const, label: 'Explore', color: '#34A853', onPress: () => router.push('/(tabs)/explore') },
    { icon: 'people-outline' as const, label: 'Community', color: '#9C27B0', onPress: () => router.push('/(tabs)/community') },
    { icon: 'person-outline' as const, label: 'Profile', color: colors.accent, onPress: () => router.push('/(tabs)/profile') },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {user ? 'Welcome back' : 'Welcome to'}
        </Text>
        <Text style={styles.appName}>VisorUp</Text>
        <Text style={styles.tagline}>Plan. Ride. Explore.</Text>
      </View>

      {/* Quick actions grid */}
      <View style={styles.actionsGrid}>
        {quickActions.map((action, i) => (
          <TouchableOpacity
            key={i}
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => { tapHaptic(); action.onPress(); }}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent routes */}
      {routes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Routes</Text>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={styles.routeCard}
              activeOpacity={0.7}
              onPress={() => { tapHaptic(); router.push(`/route/${route.id}`); }}
            >
              <Ionicons name="navigate-outline" size={18} color={colors.accent} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeName} numberOfLines={1}>{route.name}</Text>
                <Text style={styles.routeMeta}>
                  {route.route_stats?.distance ? fmtDist(route.route_stats.distance) : ''}
                  {route.waypoints?.length ? ` · ${route.waypoints.length} stops` : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Features showcase */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What you can do</Text>
        <View style={styles.featureList}>
          {[
            { icon: 'map-outline', title: 'Build Routes', desc: 'Plan rides with twisty road preferences and auto fuel stops' },
            { icon: 'navigate-outline', title: 'Live Ride Mode', desc: 'GPS navigation with speed, ETA, and off-route alerts' },
            { icon: 'layers-outline', title: '1800+ POIs', desc: 'Fuel, campsites, cafes, top roads, viewpoints & more' },
            { icon: 'cloud-download-outline', title: 'Offline Routes', desc: 'Download routes for areas with no signal' },
            { icon: 'rainy-outline', title: 'Weather Along Route', desc: 'See conditions at each point of your journey' },
            { icon: 'speedometer-outline', title: 'Fuel Range', desc: 'Alerts based on your bike\'s tank and MPG' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={18} color={colors.accent} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 20 },

  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  greeting: { color: colors.textMuted, fontSize: 14 },
  appName: { color: colors.accent, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  tagline: { color: colors.textMuted, fontSize: 13, marginTop: 2 },

  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    paddingHorizontal: spacing.lg, marginTop: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },

  section: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  sectionTitle: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm },

  routeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs,
  },
  routeInfo: { flex: 1 },
  routeName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  routeMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },

  featureList: { gap: spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
  featureDesc: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
});
