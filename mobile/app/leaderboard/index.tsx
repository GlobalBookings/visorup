import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { colors, spacing } from '../../lib/theme';
import { tapHaptic } from '../../lib/haptics';
import {
  fetchLeaderboard, fetchMyStat, upsertMyStat, LeaderboardScope, RiderStat,
} from '../../lib/leaderboard';

const SCOPES: { id: LeaderboardScope; label: string }[] = [
  { id: 'curvy_miles', label: 'Curvy Miles' },
  { id: 'total_miles', label: 'Total Miles' },
  { id: 'rides', label: 'Rides' },
];

const MEDALS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function scopeValue(stat: RiderStat, scope: LeaderboardScope): string {
  if (scope === 'rides') {
    const n = stat.rides || 0;
    return `${n} ${n === 1 ? 'ride' : 'rides'}`;
  }
  const miles = scope === 'curvy_miles' ? stat.curvy_miles : stat.total_miles;
  return `${Math.round(miles || 0)} mi`;
}

export default function LeaderboardScreen() {
  const [scope, setScope] = useState<LeaderboardScope>('curvy_miles');
  const [rows, setRows] = useState<RiderStat[]>([]);
  const [myStat, setMyStat] = useState<RiderStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (s: LeaderboardScope) => {
    const [board, mine] = await Promise.all([fetchLeaderboard(s), fetchMyStat()]);
    setRows(board);
    setMyStat(mine);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      await upsertMyStat();
      if (!active) return;
      await load(scope);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [scope, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await upsertMyStat();
    await load(scope);
    setRefreshing(false);
  }, [scope, load]);

  const myRank = myStat ? rows.findIndex((r) => r.user_id === myStat.user_id) : -1;

  const renderRow = (item: RiderStat, index: number) => {
    const rank = index + 1;
    const isMe = myStat != null && item.user_id === myStat.user_id;
    const medal = rank <= 3 ? MEDALS[rank - 1] : null;
    return (
      <View style={[styles.row, isMe && styles.rowMe]}>
        <View style={styles.rankWrap}>
          {medal ? (
            <Ionicons name="medal" size={22} color={medal} />
          ) : (
            <Text style={styles.rankText}>{rank}</Text>
          )}
        </View>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {(item.display_name || 'R').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {item.display_name || 'Rider'}{isMe ? ' (You)' : ''}
        </Text>
        <Text style={styles.value}>{scopeValue(item, scope)}</Text>
      </View>
    );
  };

  const renderMyCard = () => {
    if (!myStat) return null;
    return (
      <View style={styles.myCard}>
        <Text style={styles.myCardLabel}>Your rank</Text>
        <View style={styles.myCardBody}>
          <Text style={styles.myCardRank}>
            {myRank >= 0 ? `#${myRank + 1}` : '—'}
          </Text>
          {myStat.avatar_url ? (
            <Image source={{ uri: myStat.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {(myStat.display_name || 'R').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.myCardName} numberOfLines={1}>
            {myStat.display_name || 'Rider'}
          </Text>
          <Text style={styles.myCardValue}>{scopeValue(myStat, scope)}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <View style={styles.pillRow}>
        {SCOPES.map((s) => {
          const active = scope === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => { tapHaptic(); setScope(s.id); }}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {renderMyCard()}
    </>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Ionicons name="trophy-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>
          Leaderboards are just getting started — ride and check back soon.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Leaderboards' }} />
      {loading ? (
        <View style={styles.loading}>
          {renderHeader()}
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item, index }) => renderRow(item, index)}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={renderEmpty()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  pillRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: colors.background },
  myCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  myCardLabel: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: spacing.sm },
  myCardBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  myCardRank: { color: colors.textBright, fontSize: 18, fontWeight: '800', width: 44 },
  myCardName: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
  myCardValue: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  rowMe: { borderColor: colors.accent },
  rankWrap: { width: 32, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: colors.textMuted, fontSize: 15, fontWeight: '800' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  avatarLetter: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  name: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' },
  value: { color: colors.textBright, fontSize: 15, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: spacing.lg },
});
