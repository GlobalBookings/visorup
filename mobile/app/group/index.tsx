import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function genCode() {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

export default function GroupRideLobby() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const create = () => {
    tapHaptic();
    successHaptic();
    router.push(`/group/${genCode()}`);
  };

  const join = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) { Alert.alert('Enter a code', 'Ask the host for the ride code.'); return; }
    tapHaptic();
    router.push(`/group/${c}`);
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
        <Text style={styles.subtitle}>Share your live location with friends on the same ride. No one can see you once the ride ends.</Text>
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={create}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.createText}>Start a group ride</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or join one</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.joinRow}>
        <TextInput
          style={styles.codeInput}
          placeholder="Enter code"
          placeholderTextColor={colors.textMuted}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity style={styles.joinBtn} onPress={join}>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.background },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8 },
  hero: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl, gap: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19, paddingHorizontal: spacing.md },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#4285F4', borderRadius: 12, padding: spacing.md,
  },
  createText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 12 },
  joinRow: { flexDirection: 'row', gap: 8 },
  codeInput: {
    flex: 1, backgroundColor: colors.surfaceLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    color: colors.text, fontSize: 18, fontWeight: '700', letterSpacing: 3, textAlign: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  joinBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 24, justifyContent: 'center' },
  joinText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
