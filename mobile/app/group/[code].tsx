import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { tapHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type Coord = { latitude: number; longitude: number };
type Participant = {
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  updatedAt: number;
};

const DOT_COLORS = ['#4285F4', '#34A853', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63'];

export default function GroupRideMap() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);

  const myPos = useRef<Coord | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const locSub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSignedIn(false); setLoading(false); return; }

      const { data: prof } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
      const name = prof?.display_name || user.email?.split('@')[0] || 'Rider';
      const meObj = { id: user.id, name };
      if (!active) return;
      setMe(meObj);
      setLoading(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locSub.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 15, timeInterval: 4000 },
          (loc) => {
            const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            myPos.current = pos;
            channelRef.current?.track({
              user_id: meObj.id, name: meObj.name,
              latitude: pos.latitude, longitude: pos.longitude, updatedAt: Date.now(),
            });
          }
        );
      }

      const channel = supabase.channel(`group-ride:${code}`, {
        config: { presence: { key: meObj.id } },
      });
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<Participant>();
        const list: Participant[] = [];
        Object.values(state).forEach((arr) => { if (arr[0]) list.push(arr[0]); });
        setParticipants(list);
      });
      channel.subscribe(async (st) => {
        if (st === 'SUBSCRIBED') {
          const pos = myPos.current;
          await channel.track({
            user_id: meObj.id, name: meObj.name,
            latitude: pos?.latitude ?? 0, longitude: pos?.longitude ?? 0, updatedAt: Date.now(),
          });
        }
      });
      channelRef.current = channel;
    })();

    return () => {
      active = false;
      locSub.current?.remove();
      locSub.current = null;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [code]);

  const shareCode = async () => {
    tapHaptic();
    try {
      await Share.share({ message: `Join my VisorUp group ride! Open the app, tap Group Ride and enter code: ${code}` });
    } catch (_) {}
  };

  const colorFor = (id: string) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) % DOT_COLORS.length;
    return DOT_COLORS[h];
  };

  const visible = participants.filter((p) => p.latitude !== 0 || p.longitude !== 0);

  const region = myPos.current
    ? { ...myPos.current, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : visible.length > 0
    ? { latitude: visible[0].latitude, longitude: visible[0].longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : { latitude: 54.5, longitude: -3.5, latitudeDelta: 6, longitudeDelta: 6 };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  if (!signedIn) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Group Ride' }} />
        <Ionicons name="lock-closed-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyText}>Sign in to join a group ride.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsUserLocation
      >
        {visible.map((p) => (
          <Marker
            key={p.user_id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.user_id === me?.id ? 'You' : p.name}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.riderMarker, { backgroundColor: colorFor(p.user_id) }]}>
              <Ionicons name="person" size={12} color="#fff" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>RIDE CODE</Text>
          <Text style={styles.codeValue}>{code}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={shareCode}>
          <Ionicons name="share-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.riderBar}>
        <Ionicons name="people" size={16} color={colors.accent} />
        <Text style={styles.riderCount}>
          {visible.length} rider{visible.length === 1 ? '' : 's'} sharing location
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.background },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  map: { ...StyleSheet.absoluteFill },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(32,33,36,0.95)',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center',
  },
  codeBox: { alignItems: 'center' },
  codeLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  codeValue: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  riderBar: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(32,33,36,0.95)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
  },
  riderCount: { color: '#fff', fontSize: 13, fontWeight: '700' },
  riderMarker: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
});
