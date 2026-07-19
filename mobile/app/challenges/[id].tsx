import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../lib/theme';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { curatedRoutes, CuratedRoute } from '../../lib/curated-routes';
import { setPendingRoute } from '../../lib/pending-route';
import {
  getChallenge,
  challengeProgress,
  getRiddenRouteIds,
  markRouteRidden,
} from '../../lib/challenges';

const REGION_LABELS: Record<CuratedRoute['region'], string> = {
  scotland: 'Scotland',
  wales: 'Wales',
  'england-north': 'North England',
  'england-midlands': 'Midlands',
  'england-south': 'South England',
  'isle-of-man': 'Isle of Man',
};

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const challenge = getChallenge(id);
  const [ridden, setRidden] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const set = await getRiddenRouteIds();
        if (active) setRidden(set);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  if (!challenge) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Challenge not found</Text>
      </View>
    );
  }

  const routes = challenge.routeIds
    .map((rid) => curatedRoutes.find((r) => r.id === rid))
    .filter((r): r is CuratedRoute => r !== undefined);

  const { done, total, complete } = challengeProgress(challenge, ridden);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggle = async (route: CuratedRoute) => {
    const next = !ridden.has(route.id);
    const optimistic = new Set(ridden);
    if (next) optimistic.add(route.id);
    else optimistic.delete(route.id);
    setRidden(optimistic);

    const nowComplete = challengeProgress(challenge, optimistic).complete;
    if (next && nowComplete) successHaptic();
    else tapHaptic();

    await markRouteRidden(route.id, next);
  };

  const openInBuild = (route: CuratedRoute) => {
    tapHaptic();
    setPendingRoute({
      name: route.name,
      waypoints: route.waypoints,
      roadPreference: route.settings.road_preference,
    });
    router.push('/(tabs)/build');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{challenge.title}</Text>
      <Text style={styles.subheading}>{challenge.subtitle}</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressText}>{`${done} of ${total} complete`}</Text>

      {complete && (
        <View style={styles.banner}>
          <Ionicons name={challenge.badgeIcon as any} size={24} color={colors.accent} />
          <Text style={styles.bannerText}>Challenge complete — badge earned!</Text>
        </View>
      )}

      {routes.map((route) => {
        const isRidden = ridden.has(route.id);
        return (
          <View key={route.id} style={styles.card}>
            <TouchableOpacity
              style={styles.rowBody}
              onPress={() => openInBuild(route)}
              activeOpacity={0.8}
            >
              <View style={styles.rowText}>
                <Text style={styles.routeName}>{route.name}</Text>
                <Text style={styles.routeMeta}>
                  {REGION_LABELS[route.region]} · {route.distance_miles} mi · Curviness {route.curviness_score}/10
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.check, isRidden && styles.checkOn]}
              onPress={() => toggle(route)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isRidden ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={isRidden ? colors.accent : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.textMuted, fontSize: 16, marginTop: spacing.md },
  heading: { color: colors.textBright, fontSize: 24, fontWeight: '800' },
  subheading: { color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: spacing.lg },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.accent },
  progressText: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm, marginBottom: spacing.md },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerText: { color: colors.textBright, fontSize: 14, fontWeight: '700', flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rowBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowText: { flex: 1 },
  routeName: { color: colors.textBright, fontSize: 16, fontWeight: '700' },
  routeMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  check: { paddingLeft: spacing.md },
  checkOn: {},
});
