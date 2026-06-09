import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type RouteCategory = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const categories: RouteCategory[] = [
  { id: 'popular', label: 'Popular', icon: 'flame-outline' },
  { id: 'scenic', label: 'Scenic', icon: 'leaf-outline' },
  { id: 'twisty', label: 'Twisty', icon: 'git-compare-outline' },
  { id: 'coastal', label: 'Coastal', icon: 'water-outline' },
  { id: 'mountain', label: 'Mountain', icon: 'triangle-outline' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [routes, setRoutes] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const fetchPublicRoutes = useCallback(async () => {
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(20);

    const publicRoutes = (!error && data) ? data : [];
    // Merge with sample routes for a richer experience
    const all = [...publicRoutes, ...sampleRoutes];
    setRoutes(all);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPublicRoutes(); }, [fetchPublicRoutes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPublicRoutes();
    setRefreshing(false);
  }, [fetchPublicRoutes]);

  const filteredRoutes = routes.filter((r) => {
    if (search) {
      return r.name.toLowerCase().includes(search.toLowerCase()) ||
             r.description?.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const fmtDist = (m: number) => {
    const miles = Math.round(m * 0.000621371);
    return miles > 0 ? `${miles} mi` : '--';
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category pills */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryPill, selectedCategory === item.id && styles.categoryActive]}
            onPress={() => { tapHaptic(); setSelectedCategory(item.id); }}
          >
            <Ionicons
              name={item.icon}
              size={14}
              color={selectedCategory === item.id ? colors.background : colors.textMuted}
            />
            <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Route list */}
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
              tapHaptic();
              router.push({ pathname: '/route/[id]', params: { id: item.id, demo: item.id.startsWith('demo-') ? '1' : '0' } });
            }}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardHeader}>
                <Ionicons name="navigate-outline" size={18} color={colors.accent} />
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
              </View>
              {item.route_stats?.distance && (
                <Text style={styles.cardDist}>{fmtDist(item.route_stats.distance)}</Text>
              )}
            </View>
            {item.description ? (
              <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            ) : null}
            <View style={styles.cardFooter}>
              <View style={styles.cardStat}>
                <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                <Text style={styles.cardStatText}>
                  {item.route_stats?.waypoints || item.waypoints?.length || 0} stops
                </Text>
              </View>
              {item.is_public && (
                <View style={styles.publicBadge}>
                  <Ionicons name="globe-outline" size={10} color={colors.accent} />
                  <Text style={styles.publicText}>Public</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="compass-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No routes found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12, marginLeft: 8 },
  categoryList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  categoryText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  categoryTextActive: { color: colors.background },
  list: { padding: spacing.md, paddingTop: 0 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700', flex: 1 },
  cardDist: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  cardDesc: { color: colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardStatText: { color: colors.textMuted, fontSize: 11 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  publicText: { color: colors.accent, fontSize: 10, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: spacing.sm },
});
