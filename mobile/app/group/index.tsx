import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';
import JoinGroupRide from '../../components/JoinGroupRide';
import type { GroupRide } from '../../lib/group-ride';

export default function GroupRideLobby() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(true);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const onJoined = (ride: GroupRide) => {
    setShowJoin(false);
    router.push(`/group/${ride.joinCode}`);
  };

  if (!signedIn) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Group Ride' }} />
        <Ionicons name="lock-closed-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyText}>Sign in to ride with friends.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Group Ride' }} />
      <View style={styles.hero}>
        <Ionicons name="people-circle-outline" size={56} color={colors.accent} />
        <Text style={styles.title}>Ride Together</Text>
        <Text style={styles.subtitle}>
          Share your live location with friends on the same ride. Set rally points, keep the group
          together with separation alerts, and lead the way. No one can see you once the ride ends.
        </Text>
      </View>

      <View style={styles.featureRow}>
        <Feature icon="navigate-circle-outline" label="Live locations" />
        <Feature icon="flag-outline" label="Rally points" />
        <Feature icon="warning-outline" label="Fall-behind alerts" />
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => { tapHaptic(); setShowJoin(true); }}>
        <Ionicons name="people" size={20} color="#fff" />
        <Text style={styles.primaryText}>Start or Join a Ride</Text>
      </TouchableOpacity>

      <JoinGroupRide visible={showJoin} onClose={() => setShowJoin(false)} onJoined={onJoined} />
    </View>
  );
}

function Feature({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon} size={22} color={colors.accent} />
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.background },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8 },
  hero: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg, gap: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19, paddingHorizontal: spacing.md },
  featureRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: spacing.lg },
  feature: { alignItems: 'center', gap: 6, flex: 1 },
  featureLabel: { color: colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.accent, borderRadius: 12, padding: spacing.md, marginTop: spacing.md,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
