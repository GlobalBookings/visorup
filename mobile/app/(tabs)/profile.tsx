import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, RefreshControl, Linking, Platform, Modal, Switch, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { supabase, Profile, UserBike } from '../../lib/supabase';
import { colors, spacing } from '../../lib/theme';
import {
  TERMS_URL, PRIVACY_URL, EULA_SUMMARY, COMMUNITY_GUIDELINES,
  getBlockedProfiles, unblockUser, BlockedProfile,
} from '../../lib/moderation';

export default function ProfileScreen() {
  const router = useRouter();
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
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
    }
  }, []);

  // Blocked accounts
  const [blocked, setBlocked] = useState<BlockedProfile[]>([]);

  // Bike add/edit form
  type BikeForm = { id?: string; make: string; model: string; nickname: string; year: string; tank: string; mpg: string; primary: boolean };
  const [bikeForm, setBikeForm] = useState<BikeForm | null>(null);
  const [savingBike, setSavingBike] = useState(false);

  // Edit profile form
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

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

  const handleAppleSignIn = async () => {
    if (!agreed) {
      Alert.alert('Agreement required', 'Please agree to the Terms of Use (EULA) and Community Guidelines to continue.');
      return;
    }
    try {
      const rawNonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!credential.identityToken) throw new Error('No identity token returned from Apple.');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce,
      });
      if (error) throw error;

      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean).join(' ').trim();
      if (name && data.user) {
        try {
          await supabase.from('profiles').update({ display_name: name }).eq('id', data.user.id).is('display_name', null);
        } catch {}
      }
      await fetchProfile();
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Sign in failed', e?.message || 'Could not sign in with Apple.');
    }
  };

  const openNewBike = () => setBikeForm({ make: '', model: '', nickname: '', year: '', tank: '', mpg: '', primary: bikes.length === 0 });

  const openEditBike = (bike: UserBike) => setBikeForm({
    id: bike.id,
    make: bike.make,
    model: bike.model,
    nickname: bike.nickname ?? '',
    year: bike.year ? String(bike.year) : '',
    tank: bike.tank_litres ? String(bike.tank_litres) : '',
    mpg: bike.mpg ? String(bike.mpg) : '',
    primary: bike.is_primary,
  });

  const saveBike = async () => {
    if (!bikeForm) return;
    if (!bikeForm.make.trim() || !bikeForm.model.trim()) {
      Alert.alert('Add details', 'Enter at least a make and model.');
      return;
    }
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    setSavingBike(true);
    const payload = {
      user_id: u.id,
      make: bikeForm.make.trim(),
      model: bikeForm.model.trim(),
      nickname: bikeForm.nickname.trim() || null,
      year: bikeForm.year ? (parseInt(bikeForm.year, 10) || null) : null,
      tank_litres: bikeForm.tank ? (parseFloat(bikeForm.tank) || null) : null,
      mpg: bikeForm.mpg ? (parseFloat(bikeForm.mpg) || null) : null,
      is_primary: bikeForm.primary,
    };
    try {
      if (bikeForm.primary) {
        await supabase.from('user_bikes').update({ is_primary: false }).eq('user_id', u.id);
      }
      const { error } = bikeForm.id
        ? await supabase.from('user_bikes').update(payload).eq('id', bikeForm.id)
        : await supabase.from('user_bikes').insert(payload);
      if (error) throw error;
      setBikeForm(null);
      await fetchProfile();
    } catch (e: any) {
      Alert.alert('Could not save bike', e?.message || 'Please try again.');
    } finally {
      setSavingBike(false);
    }
  };

  const deleteBike = (bike: UserBike) => {
    Alert.alert('Remove bike', `Remove ${bike.nickname || `${bike.make} ${bike.model}`} from your garage?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('user_bikes').delete().eq('id', bike.id);
          if (error) { Alert.alert('Error', error.message); return; }
          setBikeForm(null);
          await fetchProfile();
        },
      },
    ]);
  };

  const openEditProfile = () => {
    setEditName(profile?.display_name ?? '');
    setEditAvatar(profile?.avatar_url ?? null);
    setEditing(true);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) setEditAvatar(result.assets[0].uri);
  };

  const saveProfile = async () => {
    const name = editName.trim();
    if (!name) { Alert.alert('Add a name', 'Enter a display name so other riders know who you are.'); return; }
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    setSavingProfile(true);
    try {
      let avatarUrl = profile?.avatar_url ?? null;
      if (editAvatar && !editAvatar.startsWith('http')) {
        const fileName = `${u.id}/${Date.now()}.jpg`;
        const response = await fetch(editAvatar);
        const blob = await response.blob();
        const { error: upErr } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = data.publicUrl;
      } else if (editAvatar === null) {
        avatarUrl = null;
      }
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name, avatar_url: avatarUrl })
        .eq('id', u.id);
      if (error) throw error;
      setEditing(false);
      await fetchProfile();
    } catch (e: any) {
      Alert.alert('Could not save profile', e?.message || 'Please try again.');
    } finally {
      setSavingProfile(false);
    }
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
        <Ionicons name="bicycle-outline" size={48} color={colors.accent} />
        <Text style={styles.authTitle}>Welcome to VisorUp</Text>
        <Text style={styles.authSub}>Sign in to access your saved routes, garage, and profile.</Text>

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

        {appleAvailable && (
          <View style={[styles.appleWrap, !agreed && styles.primaryBtnDisabled]}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={10}
              style={styles.appleBtn}
              onPress={handleAppleSignIn}
            />
          </View>
        )}

        {appleAvailable && (
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or use email</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

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
      </KeyboardAvoidingView>
    );
  }

  return (
    <>
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
        <TouchableOpacity style={styles.editProfileBtn} onPress={openEditProfile}>
          <Ionicons name="create-outline" size={14} color={colors.accent} />
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        <Ionicons name="map-outline" size={14} color={colors.accent} /> Your Riding
      </Text>
      <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/routes')}>
        <Ionicons name="bookmark-outline" size={18} color={colors.textMuted} />
        <Text style={styles.linkRowText}>Saved Routes</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/rides')}>
        <Ionicons name="time-outline" size={18} color={colors.textMuted} />
        <Text style={styles.linkRowText}>Ride History</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleInline}>
          <Ionicons name="bicycle-outline" size={14} color={colors.accent} /> Garage
        </Text>
        <TouchableOpacity style={styles.addBikeBtn} onPress={openNewBike}>
          <Ionicons name="add" size={16} color={colors.accent} />
          <Text style={styles.addBikeText}>Add bike</Text>
        </TouchableOpacity>
      </View>
      {bikes.length === 0 ? (
        <Text style={styles.emptyText}>No bikes yet. Add one to unlock fuel-range planning on your routes.</Text>
      ) : (
        bikes.map((bike) => (
          <TouchableOpacity key={bike.id} style={styles.bikeCard} activeOpacity={0.7} onPress={() => openEditBike(bike)}>
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
            <Ionicons name="create-outline" size={18} color={colors.textMuted} style={{ alignSelf: 'center', marginRight: 12 }} />
          </TouchableOpacity>
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

    <Modal visible={!!bikeForm} animationType="slide" transparent onRequestClose={() => setBikeForm(null)}>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{bikeForm?.id ? 'Edit bike' : 'Add a bike'}</Text>
            <TouchableOpacity onPress={() => setBikeForm(null)}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          {bikeForm && (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>Make *</Text>
                  <TextInput style={styles.formInput} value={bikeForm.make} onChangeText={(t) => setBikeForm({ ...bikeForm, make: t })} placeholder="Triumph" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>Model *</Text>
                  <TextInput style={styles.formInput} value={bikeForm.model} onChangeText={(t) => setBikeForm({ ...bikeForm, model: t })} placeholder="Tiger 900" placeholderTextColor={colors.textMuted} />
                </View>
              </View>
              <Text style={styles.formLabel}>Nickname</Text>
              <TextInput style={styles.formInput} value={bikeForm.nickname} onChangeText={(t) => setBikeForm({ ...bikeForm, nickname: t })} placeholder="Optional" placeholderTextColor={colors.textMuted} />
              <View style={styles.formRow2}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>Year</Text>
                  <TextInput style={styles.formInput} value={bikeForm.year} onChangeText={(t) => setBikeForm({ ...bikeForm, year: t })} keyboardType="number-pad" placeholder="2023" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>Tank (L)</Text>
                  <TextInput style={styles.formInput} value={bikeForm.tank} onChangeText={(t) => setBikeForm({ ...bikeForm, tank: t })} keyboardType="decimal-pad" placeholder="20" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>MPG</Text>
                  <TextInput style={styles.formInput} value={bikeForm.mpg} onChangeText={(t) => setBikeForm({ ...bikeForm, mpg: t })} keyboardType="decimal-pad" placeholder="55" placeholderTextColor={colors.textMuted} />
                </View>
              </View>
              <Text style={styles.formHint}>Tank size and MPG power fuel-range alerts when planning routes.</Text>
              <View style={styles.switchRow}>
                <Text style={styles.formLabel}>Set as primary bike</Text>
                <Switch value={bikeForm.primary} onValueChange={(v) => setBikeForm({ ...bikeForm, primary: v })} trackColor={{ true: colors.accent, false: colors.border }} />
              </View>
              <TouchableOpacity style={[styles.primaryBtn, savingBike && styles.primaryBtnDisabled]} onPress={saveBike} disabled={savingBike}>
                <Text style={styles.primaryBtnText}>{savingBike ? 'Saving...' : bikeForm.id ? 'Save changes' : 'Add bike'}</Text>
              </TouchableOpacity>
              {bikeForm.id && (
                <TouchableOpacity style={styles.deleteBikeBtn} onPress={() => { const b = bikes.find((x) => x.id === bikeForm.id); if (b) deleteBike(b); }}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  <Text style={styles.deleteBikeText}>Remove bike</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>

    <Modal visible={editing} animationType="slide" transparent onRequestClose={() => setEditing(false)}>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.avatarEditRow}>
              <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
                {editAvatar ? (
                  <Image source={{ uri: editAvatar }} style={styles.avatarEdit} />
                ) : (
                  <View style={styles.avatarEditPlaceholder}>
                    <Text style={styles.avatarLetter}>{(editName || 'R').charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={14} color={colors.background} />
                </View>
              </TouchableOpacity>
              <View style={styles.avatarEditActions}>
                <TouchableOpacity onPress={pickAvatar}>
                  <Text style={styles.avatarEditLink}>Change photo</Text>
                </TouchableOpacity>
                {editAvatar && (
                  <TouchableOpacity onPress={() => setEditAvatar(null)}>
                    <Text style={styles.avatarRemoveLink}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.formLabel}>Display name *</Text>
            <TextInput
              style={styles.formInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your rider name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              maxLength={40}
            />
            <Text style={styles.formHint}>This is how you appear to other riders in the community and on shared routes.</Text>
            <TouchableOpacity style={[styles.primaryBtn, savingProfile && styles.primaryBtnDisabled]} onPress={saveProfile} disabled={savingProfile}>
              <Text style={styles.primaryBtnText}>{savingProfile ? 'Saving...' : 'Save profile'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  authContainer: {
    flexGrow: 1,
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
  appleWrap: { width: '100%', marginTop: spacing.md },
  appleBtn: { width: '100%', height: 48 },
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
  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  editProfileText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  avatarEditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatarEdit: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: colors.accent },
  avatarEditPlaceholder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.accent,
  },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.surface,
  },
  avatarEditActions: { gap: 6 },
  avatarEditLink: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  avatarRemoveLink: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
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
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  sectionTitleInline: { color: colors.accent, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  addBikeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  addBikeText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    maxHeight: '85%', borderTopWidth: 1, borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  formRow2: { flexDirection: 'row', gap: 10 },
  formCol: { flex: 1 },
  formLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  formInput: {
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 15,
  },
  formHint: { color: colors.textMuted, fontSize: 11, marginTop: 8, lineHeight: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  deleteBikeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.md, padding: spacing.sm },
  deleteBikeText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
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
