import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../lib/theme';
import { tapHaptic } from '../../lib/haptics';
import {
  CHALLENGES,
  Challenge,
  challengeProgress,
  getRiddenRouteIds,
  totalCuratedMiles,
} from '../../lib/challenges';

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

export default function ChallengesList() {
  const router = useRouter();
  const [ridden, setRidden] = useState<Set<string>>(new Set());
  const [miles, setMiles] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const set = await getRiddenRouteIds();
        if (!active) return;
        setRidden(set);
        setMiles(totalCuratedMiles(set));
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const open = (c: Challenge) => {
    tapHaptic();
    router.push(`/challenges/${c.id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>UK Iconic Roads</Text>
      <Text style={styles.subheading}>
        Tick off Britain's legendary roads and earn badges for every collection you complete.
      </Text>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{ridden.size}</Text>
          <Text style={styles.summaryLabel}>Iconic roads ridden</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(miles)}</Text>
          <Text style={styles.summaryLabel}>Curated miles</Text>
        </View>
      </View>

      {CHALLENGES.map((c) => {
        const { done, total, complete } = challengeProgress(c, ridden);
        return (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => open(c)} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name={c.icon as any} size={22} color={colors.accent} />
              </View>
              <View style={styles.cardTitleWrap}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSubtitle}>{c.subtitle}</Text>
              </View>
              {complete ? (
                <Ionicons name="trophy" size={22} color={colors.accent} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              )}
            </View>

            <ProgressBar done={done} total={total} />
            <Text style={styles.progressText}>
              {complete ? 'Complete!' : `${done} of ${total} ridden`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  heading: { color: colors.textBright, fontSize: 26, fontWeight: '800' },
  subheading: { color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: spacing.lg },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: colors.accent, fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: colors.border },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleWrap: { flex: 1 },
  cardTitle: { color: colors.textBright, fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.accent },
  progressText: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
});
