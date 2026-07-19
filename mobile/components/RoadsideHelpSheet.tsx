import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView, Pressable, TextInput,
  ActivityIndicator, TouchableOpacity, Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import { tapHaptic, successHaptic } from '../lib/haptics';
import {
  EMERGENCY_NUMBERS, BREAKDOWN_PROVIDERS, FIRST_AID_STEPS, FIRST_AID_DISCLAIMER,
  PersonalBreakdown, getPersonalBreakdown, setPersonalBreakdown,
  callNumber, openMapsSearch, openMapsDirections, findNearbyGarages, Garage,
  findNearbyHospitals, NearbyPlace, sendLocationToContacts, what3wordsUrl,
} from '../lib/emergency-info';

export type RoadsideView = 'menu' | 'breakdown' | 'garage' | 'hospital' | 'firstaid' | 'location';

type Props = {
  visible: boolean;
  initialView?: RoadsideView;
  onClose: () => void;
};

const TITLES: Record<RoadsideView, string> = {
  menu: 'Roadside Help',
  breakdown: 'Emergency & Breakdown',
  garage: 'Nearest Garage',
  hospital: 'Nearest Hospital / A&E',
  firstaid: 'Emergency First Aid',
  location: 'Share My Location',
};

export default function RoadsideHelpSheet({ visible, initialView = 'menu', onClose }: Props) {
  const [view, setView] = useState<RoadsideView>(initialView);

  useEffect(() => {
    if (visible) setView(initialView);
  }, [visible, initialView]);

  const go = (v: RoadsideView) => { tapHaptic(); setView(v); };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          {view !== 'menu' ? (
            <Pressable style={styles.headerBtn} onPress={() => setView('menu')} hitSlop={10}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
          ) : <View style={styles.headerBtn} />}
          <Text style={styles.title}>{TITLES[view]}</Text>
          <Pressable style={styles.headerBtn} onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        {view === 'menu' && <MenuView go={go} />}
        {view === 'breakdown' && <BreakdownView />}
        {view === 'garage' && <GarageView />}
        {view === 'hospital' && <HospitalView />}
        {view === 'firstaid' && <FirstAidView />}
        {view === 'location' && <LocationView />}
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Menu (hub)
// ---------------------------------------------------------------------------

function MenuView({ go }: { go: (v: RoadsideView) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable style={styles.call999} onPress={() => { tapHaptic(); callNumber('999'); }}>
        <Ionicons name="call" size={22} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.call999Text}>Call 999</Text>
          <Text style={styles.call999Sub}>Emergency services</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </Pressable>

      <Pressable style={styles.shareLoc} onPress={() => go('location')}>
        <Ionicons name="share-outline" size={20} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.shareLocText}>Share my location</Text>
          <Text style={styles.shareLocSub}>"I'm OK" or send help your exact spot</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </Pressable>

      <MenuRow icon="construct-outline" title="Emergency & Breakdown" sub="Breakdown providers + your cover" onPress={() => go('breakdown')} />
      <MenuRow icon="location-outline" title="Nearest Garage" sub="Find repair garages near you" onPress={() => go('garage')} />
      <MenuRow icon="medkit-outline" title="Nearest Hospital / A&E" sub="Find hospitals near you" onPress={() => go('hospital')} />
      <MenuRow icon="medkit-outline" title="Emergency First Aid" sub="What to do at a crash scene" onPress={() => go('firstaid')} />
    </ScrollView>
  );
}

function MenuRow({ icon, title, sub, onPress }: { icon: any; title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Breakdown & emergency numbers + personal cover
// ---------------------------------------------------------------------------

function PhoneRow({ name, phone, note }: { name: string; phone: string; note?: string }) {
  return (
    <Pressable style={styles.phoneRow} onPress={() => { tapHaptic(); callNumber(phone); }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.phoneName}>{name}</Text>
        {note ? <Text style={styles.phoneNote}>{note}</Text> : null}
      </View>
      <View style={styles.callChip}>
        <Ionicons name="call" size={14} color={colors.success} />
        <Text style={styles.callChipText}>{phone}</Text>
      </View>
    </Pressable>
  );
}

function BreakdownView() {
  const [personal, setPersonal] = useState<PersonalBreakdown | null>(null);
  const [editing, setEditing] = useState(false);
  const [provider, setProvider] = useState('');
  const [phone, setPhone] = useState('');
  const [membership, setMembership] = useState('');

  useEffect(() => {
    getPersonalBreakdown().then((p) => {
      setPersonal(p);
      if (p) { setProvider(p.provider); setPhone(p.phone); setMembership(p.membership ?? ''); }
    });
  }, []);

  const save = useCallback(async () => {
    if (!provider.trim() || !phone.trim()) return;
    const value: PersonalBreakdown = { provider: provider.trim(), phone: phone.trim(), membership: membership.trim() || undefined };
    await setPersonalBreakdown(value);
    setPersonal(value);
    setEditing(false);
    successHaptic();
  }, [provider, phone, membership]);

  const remove = useCallback(async () => {
    await setPersonalBreakdown(null);
    setPersonal(null);
    setProvider(''); setPhone(''); setMembership('');
    setEditing(false);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionLabel}>YOUR BREAKDOWN COVER</Text>
      {personal && !editing ? (
        <View style={styles.card}>
          <Pressable style={styles.phoneRow} onPress={() => { tapHaptic(); callNumber(personal.phone); }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneName}>{personal.provider}</Text>
              {personal.membership ? <Text style={styles.phoneNote}>Member #{personal.membership}</Text> : null}
            </View>
            <View style={styles.callChip}>
              <Ionicons name="call" size={14} color={colors.success} />
              <Text style={styles.callChipText}>{personal.phone}</Text>
            </View>
          </Pressable>
          <TouchableOpacity style={styles.editLink} onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={14} color={colors.accent} />
            <Text style={styles.editLinkText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ) : editing ? (
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder="Provider (e.g. AA)" placeholderTextColor={colors.textMuted} value={provider} onChangeText={setProvider} />
          <TextInput style={styles.input} placeholder="Phone number" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Membership / policy number (optional)" placeholderTextColor={colors.textMuted} value={membership} onChangeText={setMembership} />
          <View style={styles.editButtons}>
            <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost]} onPress={() => { setEditing(false); if (!personal) { setProvider(''); setPhone(''); setMembership(''); } }}>
              <Text style={styles.smallBtnGhostText}>Cancel</Text>
            </TouchableOpacity>
            {personal && (
              <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost]} onPress={remove}>
                <Text style={[styles.smallBtnGhostText, { color: colors.danger }]}>Remove</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.smallBtn, styles.smallBtnPrimary, (!provider.trim() || !phone.trim()) && { opacity: 0.4 }]} onPress={save} disabled={!provider.trim() || !phone.trim()}>
              <Text style={styles.smallBtnPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addCover} onPress={() => setEditing(true)}>
          <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
          <Text style={styles.addCoverText}>Add your breakdown provider & membership</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionLabel}>EMERGENCY</Text>
      <View style={styles.card}>
        {EMERGENCY_NUMBERS.map((e) => <PhoneRow key={e.phone} {...e} />)}
      </View>

      <Text style={styles.sectionLabel}>UK BREAKDOWN PROVIDERS</Text>
      <View style={styles.card}>
        {BREAKDOWN_PROVIDERS.map((p) => <PhoneRow key={p.name} {...p} />)}
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Nearest garage
// ---------------------------------------------------------------------------

function GarageView() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [garages, setGarages] = useState<Garage[]>([]);

  const search = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') { setStatus('error'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const found = await findNearbyGarages({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setGarages(found);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { search(); }, [search]);

  const fmt = (m: number) => (m < 1609 ? `${Math.round(m / 160.9) / 10} mi` : `${(m / 1609).toFixed(1)} mi`);

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.mutedText}>Finding garages near you…</Text>
      </View>
    );
  }

  if (status === 'error' || garages.length === 0) {
    return (
      <View style={styles.centerFill}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mutedText}>
          {status === 'error' ? 'Could not search (no signal or location off).' : 'No garages found nearby.'}
        </Text>
        <TouchableOpacity style={styles.mapsBtn} onPress={() => { tapHaptic(); openMapsSearch('motorcycle repair near me'); }}>
          <Ionicons name="map-outline" size={16} color="#fff" />
          <Text style={styles.mapsBtnText}>Search in Maps</Text>
        </TouchableOpacity>
        {status === 'error' && (
          <TouchableOpacity style={styles.retryBtn} onPress={search}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {garages.map((g) => (
        <View key={g.id} style={styles.garageRow}>
          <View style={[styles.garageIcon, g.kind === 'motorcycle' && { backgroundColor: `${colors.accent}22` }]}>
            <Ionicons name={g.kind === 'motorcycle' ? 'bicycle-outline' : 'car-outline'} size={20} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.garageName} numberOfLines={1}>{g.name}</Text>
            <Text style={styles.garageMeta}>{fmt(g.distanceM)} away{g.kind === 'motorcycle' ? ' · Motorcycle' : ''}</Text>
          </View>
          {g.phone ? (
            <TouchableOpacity style={styles.garageAction} onPress={() => { tapHaptic(); callNumber(g.phone!); }}>
              <Ionicons name="call" size={18} color={colors.success} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.garageAction} onPress={() => { tapHaptic(); openMapsDirections(g.latitude, g.longitude, g.name); }}>
            <Ionicons name="navigate" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={[styles.mapsBtn, { alignSelf: 'center', marginTop: spacing.md }]} onPress={() => { tapHaptic(); openMapsSearch('motorcycle repair near me'); }}>
        <Ionicons name="map-outline" size={16} color="#fff" />
        <Text style={styles.mapsBtnText}>More in Maps</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Nearest hospital / A&E
// ---------------------------------------------------------------------------

function HospitalView() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);

  const search = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') { setStatus('error'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const found = await findNearbyHospitals({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setPlaces(found);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { search(); }, [search]);

  const fmt = (m: number) => (m < 1609 ? `${Math.round(m / 160.9) / 10} mi` : `${(m / 1609).toFixed(1)} mi`);

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.mutedText}>Finding hospitals near you…</Text>
      </View>
    );
  }

  if (status === 'error' || places.length === 0) {
    return (
      <View style={styles.centerFill}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mutedText}>
          {status === 'error' ? 'Could not search (no signal or location off).' : 'No hospitals found nearby.'}
        </Text>
        <TouchableOpacity style={styles.mapsBtn} onPress={() => { tapHaptic(); openMapsSearch('hospital A&E near me'); }}>
          <Ionicons name="map-outline" size={16} color="#fff" />
          <Text style={styles.mapsBtnText}>Search in Maps</Text>
        </TouchableOpacity>
        {status === 'error' && (
          <TouchableOpacity style={styles.retryBtn} onPress={search}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {places.map((p) => (
        <View key={p.id} style={styles.garageRow}>
          <View style={[styles.garageIcon, { backgroundColor: `${colors.danger}22` }]}>
            <Ionicons name="medkit-outline" size={20} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.garageName} numberOfLines={1}>{p.name}</Text>
            <Text style={styles.garageMeta}>{fmt(p.distanceM)} away</Text>
          </View>
          {p.phone ? (
            <TouchableOpacity style={styles.garageAction} onPress={() => { tapHaptic(); callNumber(p.phone!); }}>
              <Ionicons name="call" size={18} color={colors.success} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.garageAction} onPress={() => { tapHaptic(); openMapsDirections(p.latitude, p.longitude, p.name); }}>
            <Ionicons name="navigate" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Share my location ("I'm OK" / send help)
// ---------------------------------------------------------------------------

function LocationView() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [coord, setCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const locate = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') { setStatus('error'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoord({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { locate(); }, [locate]);

  const send = useCallback(async (prefix: string) => {
    if (!coord) return;
    tapHaptic();
    const result = await sendLocationToContacts(coord, prefix);
    if (result === 'sms') { successHaptic(); setSent('Opening a message to your emergency contacts…'); }
    else if (result === 'share') { setSent('No saved contacts — pick who to send to.'); }
    else { setSent('Could not open a message on this device.'); }
  }, [coord]);

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.mutedText}>Getting your location…</Text>
      </View>
    );
  }

  if (status === 'error' || !coord) {
    return (
      <View style={styles.centerFill}>
        <Ionicons name="location-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mutedText}>Could not get your location. Enable location and try again.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={locate}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={{ paddingVertical: spacing.md }}>
          <Text style={styles.phoneName}>Your coordinates</Text>
          <Text style={styles.phoneNote}>{coord.latitude.toFixed(5)}, {coord.longitude.toFixed(5)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.success }]} onPress={() => send("I'm OK — here's where I am.")}>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.locBtnText}>I'm OK — send my location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.locBtn, { backgroundColor: colors.danger }]} onPress={() => send('I need help. This is my location.')}>
        <Ionicons name="alert-circle" size={20} color="#fff" />
        <Text style={styles.locBtnText}>I need help — send my location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locBtnGhost} onPress={() => { tapHaptic(); Linking.openURL(what3wordsUrl(coord.latitude, coord.longitude)).catch(() => {}); }}>
        <Ionicons name="grid-outline" size={18} color={colors.accent} />
        <Text style={styles.locBtnGhostText}>Open in what3words (read to 999)</Text>
      </TouchableOpacity>

      {sent ? (
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>{sent}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// First aid
// ---------------------------------------------------------------------------

function FirstAidView() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable style={styles.call999} onPress={() => { tapHaptic(); callNumber('999'); }}>
        <Ionicons name="call" size={22} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.call999Text}>Call 999</Text>
          <Text style={styles.call999Sub}>Do this first if someone is seriously hurt</Text>
        </View>
      </Pressable>

      {FIRST_AID_STEPS.map((s, i) => (
        <View key={i} style={styles.aidRow}>
          <View style={styles.aidNum}><Text style={styles.aidNumText}>{i + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aidTitle}>{s.title}</Text>
            <Text style={styles.aidDetail}>{s.detail}</Text>
          </View>
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.disclaimerText}>{FIRST_AID_DISCLAIMER}</Text>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerBtn: { width: 32, alignItems: 'center' },
  title: { color: colors.textBright, fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  content: { padding: spacing.md, paddingBottom: spacing.xl },

  call999: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.danger, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md,
  },
  call999Text: { color: '#fff', fontSize: 18, fontWeight: '800' },
  call999Sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },

  shareLoc: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.accent, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md,
  },
  shareLocText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  shareLocSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },

  locBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderRadius: 12, padding: spacing.md, marginTop: spacing.sm,
  },
  locBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  locBtnGhost: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderRadius: 12, padding: spacing.md, marginTop: spacing.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  locBtnGhostText: { color: colors.accent, fontSize: 14, fontWeight: '700' },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  menuIcon: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
  },
  menuTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  menuSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  sectionLabel: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: spacing.md, marginBottom: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },

  phoneRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  phoneName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  phoneNote: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  callChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surfaceLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  callChipText: { color: colors.text, fontSize: 13, fontWeight: '700' },

  addCover: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
  },
  addCoverText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  editLink: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.sm },
  editLinkText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: colors.background, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 15, marginTop: spacing.md,
  },
  editButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginVertical: spacing.md },
  smallBtn: { borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: 8 },
  smallBtnGhost: { backgroundColor: colors.surfaceLight },
  smallBtnGhostText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  smallBtnPrimary: { backgroundColor: colors.accent },
  smallBtnPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  mutedText: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent,
    borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: 10,
  },
  mapsBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  retryBtn: { paddingVertical: spacing.sm },
  retryText: { color: colors.accent, fontSize: 14, fontWeight: '600' },

  garageRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  garageIcon: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
  },
  garageName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  garageMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  garageAction: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
  },

  aidRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  aidNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  aidNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  aidTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  aidDetail: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 2 },
  disclaimer: {
    flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface,
    borderRadius: 10, padding: spacing.md, marginTop: spacing.sm,
  },
  disclaimerText: { color: colors.textMuted, fontSize: 12, lineHeight: 17, flex: 1 },
});
