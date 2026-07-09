import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { sampleRoutes } from '../../lib/sample-routes';
import { getFavouriteRouteIds, toggleFavourite, fetchFavouriteRoutes } from '../../lib/favourites';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type RouteCategory = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const categories: RouteCategory[] = [
  { id: 'popular', label: 'Popular', icon: 'flame-outline' },
  { id: 'saved', label: 'Saved', icon: 'heart-outline' },
  { id: 'scenic', label: 'Scenic', icon: 'leaf-outline' },
  { id: 'twisty', label: 'Twisty', icon: 'git-compare-outline' },
  { id: 'coastal', label: 'Coastal', icon: 'water-outline' },
  { id: 'mountain', label: 'Mountain', icon: 'triangle-outline' },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  scenic: ['scenic', 'coast', 'lake', 'loch', 'glen', 'moor', 'dale', 'valley', 'forest', 'view', 'national park', 'highland'],
  twisty: ['twist', 'bend', 'pass', 'hairpin', 'snake', 'curv', 'switchback'],
  coastal: ['coast', 'sea', 'bay', 'beach', 'cliff', 'harbour', 'harbor', 'shore', 'ness', 'promenade', 'island'],
  mountain: ['mountain', 'peak', 'pass', 'summit', 'moor', 'fell', 'dale', 'hill', 'highland', 'mount', 'brecon', 'snowdon', 'cairngorm', 'pennine'],
};

function matchesCategory(r: SavedTrip, cat: string): boolean {
  if (cat === 'popular') return true;
  const hay = `${r.name} ${r.description ?? ''}`.toLowerCase();
  const kws = CATEGORY_KEYWORDS[cat] ?? [];
  if (kws.some((k) => hay.includes(k))) return true;
  const pref = (r.settings as { road_preference?: string })?.road_preference;
  if ((cat === 'twisty' || cat === 'scenic') && (pref === 'twisty' || pref === 'curvy')) return true;
  return false;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [routes, setRoutes] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [favRoutes, setFavRoutes] = useState<SavedTrip[]>([]);

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
    try {
      setFavIds(await getFavouriteRouteIds());
      setFavRoutes(await fetchFavouriteRoutes());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchPublicRoutes(); }, [fetchPublicRoutes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPublicRoutes();
    setRefreshing(false);
  }, [fetchPublicRoutes]);

  const onToggleFav = useCallback(async (routeId: string) => {
    tapHaptic();
    const currently = favIds.has(routeId);
    setFavIds((prev) => {
      const next = new Set(prev);
      if (currently) next.delete(routeId); else next.add(routeId);
      return next;
    });
    const { error } = await toggleFavourite(routeId, currently);
    if (error) {
      // revert on failure
      setFavIds((prev) => {
        const next = new Set(prev);
        if (currently) next.add(routeId); else next.delete(routeId);
        return next;
      });
      return;
    }
    try { setFavRoutes(await fetchFavouriteRoutes()); } catch {}
  }, [favIds]);

  const source = selectedCategory === 'saved' ? favRoutes : routes;
  const filteredRoutes = source.filter((r) => {
    if (selectedCategory !== 'saved' && !matchesCategory(r, selectedCategory)) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || (r.description?.toLowerCase().includes(q) ?? false);
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
              <View style={styles.cardTopRight}>
                {item.route_stats?.distance ? (
                  <Text style={styles.cardDist}>{fmtDist(item.route_stats.distance)}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={() => onToggleFav(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={favIds.has(item.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={favIds.has(item.id) ? '#EA4335' : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
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
            <Ionicons name={selectedCategory === 'saved' ? 'heart-outline' : 'compass-outline'} size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {selectedCategory === 'saved' ? 'No saved routes yet' : 'No routes found'}
            </Text>
            {selectedCategory === 'saved' && (
              <Text style={styles.emptySub}>Tap the heart on any route to save it here.</Text>
            )}
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
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 8 },
  cardDist: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  heartBtn: { padding: 2 },
  cardDesc: { color: colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardStatText: { color: colors.textMuted, fontSize: 11 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  publicText: { color: colors.accent, fontSize: 10, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: spacing.sm },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center', paddingHorizontal: spacing.xl },
});
