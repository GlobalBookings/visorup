import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { tapHaptic } from '../../lib/haptics';
import { colors } from '../../lib/theme';
import {
  joinGroupRide,
  leaveGroupRide,
  broadcastPosition,
  getGroupRideState,
  subscribeGroupRide,
  GroupRideState,
} from '../../lib/group-ride';
import GroupRideMap, { getRiderColor } from '../../components/GroupRideMap';
import GroupRidePanel from '../../components/GroupRidePanel';

type Coord = { latitude: number; longitude: number };

export default function GroupRideScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [group, setGroup] = useState<GroupRideState>(getGroupRideState());
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);

  const myPos = useRef<Coord | null>(null);
  const locSub = useRef<Location.LocationSubscription | null>(null);
  const leftRef = useRef(false);

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

      // Reconnect if we arrived without an active session for this code
      // (deep link / reload). The lobby already connects on create/join.
      const existing = getGroupRideState();
      if (!existing.ride || existing.ride.joinCode !== code) {
        try { await joinGroupRide(code); } catch (_) {}
      }
      if (!active) return;
      setLoading(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locSub.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 10, timeInterval: 2000 },
          (loc) => {
            const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            myPos.current = pos;
            broadcastPosition({
              userId: meObj.id,
              displayName: meObj.name,
              latitude: pos.latitude,
              longitude: pos.longitude,
              heading: loc.coords.heading ?? 0,
              speedMph: Math.max(0, (loc.coords.speed ?? 0) * 2.23694),
              timestamp: Date.now(),
            });
          }
        );
      }
    })();

    const unsub = subscribeGroupRide(setGroup);

    return () => {
      active = false;
      locSub.current?.remove();
      locSub.current = null;
      unsub();
    };
  }, [code]);

  // When the ride ends (leader ended it, or we left), return to the lobby.
  useEffect(() => {
    if (!loading && !group.ride && !leftRef.current) {
      leftRef.current = true;
      router.back();
    }
  }, [group.ride, loading, router]);

  const handleClose = useCallback(() => {
    tapHaptic();
    leftRef.current = true;
    leaveGroupRide();
    router.back();
  }, [router]);

  const shareCode = useCallback(async () => {
    tapHaptic();
    try {
      await Share.share({
        message: `Join my VisorUp group ride! Open the app, tap Group Ride and enter code: ${group.ride?.joinCode ?? code}`,
      });
    } catch (_) {}
  }, [group.ride, code]);

  const riders = group.riders.filter((r) => r.latitude !== 0 || r.longitude !== 0);
  const leaderId = group.ride?.leaderId;

  const region = myPos.current
    ? { ...myPos.current, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : riders.length > 0
    ? { latitude: riders[0].latitude, longitude: riders[0].longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : { latitude: 54.5, longitude: -3.5, latitudeDelta: 6, longitudeDelta: 6 };

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
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
        {riders.map((r, idx) => {
          const isRiderLeader = r.userId === leaderId;
          const isMe = r.userId === me?.id;
          if (isMe) return null;
          return (
            <Marker
              key={r.userId}
              coordinate={{ latitude: r.latitude, longitude: r.longitude }}
              title={isRiderLeader ? `${r.displayName} (leader)` : r.displayName}
              description={r.speedMph > 0 ? `${Math.round(r.speedMph)} mph` : undefined}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.riderMarker, { backgroundColor: getRiderColor(idx, isRiderLeader) }]}>
                <Ionicons name={isRiderLeader ? 'star' : 'person'} size={13} color="#fff" />
              </View>
            </Marker>
          );
        })}

        {group.rallyPoint && (
          <Marker
            coordinate={{ latitude: group.rallyPoint.latitude, longitude: group.rallyPoint.longitude }}
            title={group.rallyPoint.name}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.rallyMarker}>
              <Ionicons name="flag" size={16} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleClose}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>RIDE CODE</Text>
          <Text style={styles.codeValue}>{group.ride?.joinCode ?? code}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={shareCode}>
          <Ionicons name="share-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <GroupRideMap
        riders={riders}
        rallyPoint={group.rallyPoint}
        isLeader={group.isLeader}
        userLocation={myPos.current}
        leaderId={leaderId}
      />

      {group.ride && (
        <GroupRidePanel
          ride={group.ride}
          riders={riders}
          rallyPoint={group.rallyPoint}
          isLeader={group.isLeader}
          userLocation={myPos.current}
        />
      )}
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
  riderMarker: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  rallyMarker: {
    width: 30, height: 30, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent, borderWidth: 2, borderColor: '#fff',
  },
});
