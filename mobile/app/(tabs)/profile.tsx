import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, RefreshControl, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Profile, UserBike } from '../../lib/supabase';
import { colors, spacing } from '../../lib/theme';
import {
  TERMS_URL, PRIVACY_URL, EULA_SUMMARY, COMMUNITY_GUIDELINES,
  getBlockedProfiles, unblockUser, BlockedProfile,
} from '../../lib/moderation';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bikes, setBikes] = useState<UserBike[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Blocked accounts
  const [blocked, setBlocked] = useState<BlockedProfile[]>([]);

  const fetchProfile = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (!u) { setLoading(false); return; }

    const { data: p } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bike_slug, created_at')
      .eq('id', u.id)
      .single();
    if (p) setProfile({ ...p, email: u.email ?? '' } as Profile);

    const { data: b } = await supabase
      .from('user_bikes')
      .select('*')
      .eq('user_id', u.id)
      .order('is_primary', { ascending: false });
    if (b) setBikes(b);

    try { setBlocked(await getBlockedProfiles()); } catch {}

    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Listen for auth state changes (e.g. after Google redirect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setUser(null);
        setProfile(null);
        setBikes([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const openUrl = (url: string) => { Linking.openURL(url).catch(() => {}); };

  const showGuidelines = () => {
    Alert.alert(
      'Community Guidelines',
      EULA_SUMMARY + '\n\n' + COMMUNITY_GUIDELINES.map((g) => '\u2022 ' + g).join('\n\n')
    );
  };

  const handleUnblock = (b: BlockedProfile) => {
    Alert.alert('Unblock rider', `Unblock ${b.display_name || 'this rider'}? Their content will be visible again.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        onPress: async () => {
          const { error } = await unblockUser(b.id);
          if (error) { Alert.alert('Error', error); return; }
          setBlocked((prev) => prev.filter((x) => x.id !== b.id));
        },
      },
    ]);
  };

  const handleAuth = async () => {
    if (!email || !password) { Alert.alert('Error', 'Enter email and password'); return; }
    if (!agreed) {
      Alert.alert('Agreement required', 'Please agree to the Terms of Use (EULA) and Community Guidelines to continue.');
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('Check your email', 'We sent you a confirmation link.');
      }
      await fetchProfile();
    } catch (e: any) {
      Alert.alert('Auth Error', e.message);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setBikes([]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This permanently deletes your account, saved routes, garage, posts, and comments. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
              if (error) throw error;
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
              setBikes([]);
              Alert.alert('Account deleted', 'Your account and data have been removed.');
            } catch (e: any) {
              Alert.alert('Could not delete account', e?.message || 'Please try again later.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.authContainer}>
        <Ionicons name="bicycle-outline" size={48} color={colors.accent} />
        <Text style={styles.authTitle}>Welcome to VisorUp</Text>
        <Text style={styles.authSub}>Sign in to access your saved routes, garage, and profile.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.agreeRow}
          onPress={() => setAgreed((v) => !v)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={agreed ? 'checkbox' : 'square-outline'}
            size={22}
            color={agreed ? colors.accent : colors.textMuted}
          />
          <Text style={styles.agreeText}>
            I agree to the{' '}
            <Text style={styles.agreeLink} onPress={() => openUrl(TERMS_URL)}>Terms of Use (EULA)</Text>
            {' '}and{' '}
            <Text style={styles.agreeLink} onPress={showGuidelines}>Community Guidelines</Text>
            . I understand VisorUp has zero tolerance for objectionable content or abusive behaviour.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, !agreed && styles.primaryBtnDisabled]}
          onPress={handleAuth}
          disabled={authLoading || !agreed}
        >
          <Text style={styles.primaryBtnText}>
            {authLoading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          <Text style={styles.switchAuth}>
            {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.legalFootnote}>
          By continuing you agree to our{' '}
          <Text style={styles.agreeLink} onPress={() => openUrl(TERMS_URL)}>Terms</Text>
          {' '}and{' '}
          <Text style={styles.agreeLink} onPress={() => openUrl(PRIVACY_URL)}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <View style={styles.profileHeader}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {(profile?.display_name || 'R').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.displayName}>{profile?.display_name || 'Rider'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        <Ionicons name="bicycle-outline" size={14} color={colors.accent} /> Garage
      </Text>
      {bikes.length === 0 ? (
        <Text style={styles.emptyText}>No bikes in your garage. Add them on visorup.co.uk.</Text>
      ) : (
        bikes.map((bike) => (
          <View key={bike.id} style={styles.bikeCard}>
            {bike.photo_url && (
              <Image source={{ uri: bike.photo_url }} style={styles.bikePhoto} />
            )}
            <View style={styles.bikeInfo}>
              <Text style={styles.bikeName}>
                {bike.nickname || `${bike.make} ${bike.model}`}
                {bike.is_primary && (
                  <Text style={styles.primaryBadge}> PRIMARY</Text>
                )}
              </Text>
              <Text style={styles.bikeDetails}>
                {bike.make} {bike.model} {bike.year ? `(${bike.year})` : ''}
              </Text>
              {(bike.tank_litres || bike.mpg) && (
                <Text style={styles.bikeSpecs}>
                  {bike.tank_litres ? `${bike.tank_litres}L tank` : ''}
                  {bike.tank_litres && bike.mpg ? ' · ' : ''}
                  {bike.mpg ? `${bike.mpg} MPG` : ''}
                </Text>
              )}
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent} /> Safety & Legal
      </Text>
      <TouchableOpacity style={styles.linkRow} onPress={showGuidelines}>
        <Ionicons name="people-outline" size={18} color={colors.textMuted} />
        <Text style={styles.linkRowText}>Community Guidelines</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(TERMS_URL)}>
        <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
        <Text style={styles.linkRowText}>Terms of Use (EULA)</Text>
        <Ionicons name="open-outline" size={16} color={colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow} onPress={() => openUrl(PRIVACY_URL)}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
        <Text style={styles.linkRowText}>Privacy Policy</Text>
        <Ionicons name="open-outline" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      {blocked.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            <Ionicons name="ban-outline" size={14} color={colors.accent} /> Blocked Accounts
          </Text>
          {blocked.map((b) => (
            <View key={b.id} style={styles.blockedRow}>
              <Text style={styles.blockedName}>{b.display_name || 'Rider'}</Text>
              <TouchableOpacity onPress={() => handleUnblock(b)}>
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  authTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: spacing.md },
  authSub: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 20 },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.text,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: colors.background, fontSize: 15, fontWeight: '700' },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '100%', marginTop: spacing.md },
  agreeText: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  agreeLink: { color: colors.accent, fontWeight: '700' },
  legalFootnote: { color: colors.textMuted, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: spacing.lg },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkRowText: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockedName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  unblockText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 12, marginHorizontal: spacing.sm },
  googleBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    padding: spacing.md,
  },
  googleBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  switchAuth: { color: colors.accent, fontSize: 13, marginTop: spacing.md },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.accent },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.accent,
  },
  avatarLetter: { color: colors.accent, fontSize: 32, fontWeight: '800' },
  displayName: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.sm },
  email: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  sectionTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: { color: colors.textMuted, fontSize: 13, paddingHorizontal: spacing.md },
  bikeCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  bikePhoto: { width: 80, height: 80 },
  bikeInfo: { flex: 1, padding: spacing.sm },
  bikeName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  primaryBadge: { color: colors.accent, fontSize: 10, fontWeight: '800' },
  bikeDetails: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bikeSpecs: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
  },
  signOutText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  deleteText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
});
