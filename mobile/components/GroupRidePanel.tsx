/**
 * GroupRidePanel — Bottom panel overlay during an active group ride.
 *
 * Shows rider count, rider list with distances/speeds, leader controls,
 * join code, and ride status.
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import type { GroupRide, RallyPoint, RiderPosition } from '../lib/group-ride';
import {
  endGroupRide,
  leaveGroupRide,
  setRallyPoint,
  startGroupRide,
} from '../lib/group-ride';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Coord = { latitude: number; longitude: number };

type Props = {
  ride: GroupRide;
  riders: RiderPosition[];
  rallyPoint: RallyPoint | null;
  isLeader: boolean;
  userLocation: Coord | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function distanceMiles(a: Coord, b: Coord): number {
  const R = 3958.8;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function formatDistance(miles: number): string {
  if (miles < 0.1) return `${Math.round(miles * 5280)} ft`;
  return `${miles.toFixed(1)} mi`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RiderRow({
  rider,
  userLocation,
  isLeader,
}: {
  rider: RiderPosition;
  userLocation: Coord | null;
  isLeader: boolean;
}) {
  const dist =
    userLocation && rider.latitude !== 0
      ? distanceMiles(userLocation, {
          latitude: rider.latitude,
          longitude: rider.longitude,
        })
      : null;

  return (
    <View style={styles.riderRow}>
      <View style={styles.riderInfo}>
        <Text style={styles.riderName} numberOfLines={1}>
          {rider.displayName}
          {isLeader ? ' ★' : ''}
        </Text>
        {rider.speedMph > 0 && (
          <Text style={styles.riderSpeed}>{Math.round(rider.speedMph)} mph</Text>
        )}
      </View>
      {dist !== null && dist > 0 && (
        <Text style={styles.riderDist}>{formatDistance(dist)}</Text>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function GroupRidePanel({
  ride,
  riders,
  rallyPoint: _rallyPoint,
  isLeader,
  userLocation,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleCopyCode = useCallback(async () => {
    await Clipboard.setStringAsync(ride.joinCode);
    Alert.alert('Copied', `Join code "${ride.joinCode}" copied to clipboard.`);
  }, [ride.joinCode]);

  const handleSetRally = useCallback(() => {
    if (!userLocation) {
      Alert.alert('Location unavailable', 'Cannot set rally point without GPS.');
      return;
    }
    Alert.prompt(
      'Set Rally Point',
      'Enter a name for this rally point:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: (name: string | undefined) => {
            setRallyPoint({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              name: name || 'Rally Point',
              timestamp: Date.now(),
            });
          },
        },
      ],
      'plain-text',
      'Rally Point'
    );
  }, [userLocation]);

  const handleEndRide = useCallback(() => {
    Alert.alert('End Group Ride', 'This will end the ride for all participants.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Ride', style: 'destructive', onPress: () => endGroupRide() },
    ]);
  }, []);

  const handleLeave = useCallback(() => {
    Alert.alert('Leave Ride', 'Are you sure you want to leave this group ride?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => leaveGroupRide() },
    ]);
  }, []);

  const handleStart = useCallback(() => {
    startGroupRide();
  }, []);

  const sortedRiders = useMemo(() => {
    if (!userLocation) return riders;
    return [...riders].sort((a, b) => {
      // Leader first
      if (a.userId === ride.leaderId) return -1;
      if (b.userId === ride.leaderId) return 1;
      // Then by distance from user
      const distA = distanceMiles(userLocation, { latitude: a.latitude, longitude: a.longitude });
      const distB = distanceMiles(userLocation, { latitude: b.latitude, longitude: b.longitude });
      return distA - distB;
    });
  }, [riders, userLocation, ride.leaderId]);

  const statusColor =
    ride.status === 'active' ? colors.success : colors.accent;
  const statusLabel = ride.status === 'waiting' ? 'Waiting' : 'Active';

  return (
    <View style={styles.container}>
      {/* Header bar — tap to expand */}
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.rideName} numberOfLines={1}>
            {ride.name}
          </Text>
          <View style={styles.riderCountBadge}>
            <Ionicons name="people" size={14} color={colors.text} />
            <Text style={styles.riderCountText}>{riders.length}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>

      {/* Join code */}
      <Pressable style={styles.codeRow} onPress={handleCopyCode}>
        <Text style={styles.codeLabel}>Join Code:</Text>
        <Text style={styles.codeValue}>{ride.joinCode}</Text>
        <Ionicons name="copy-outline" size={14} color={colors.textMuted} />
      </Pressable>

      {/* Expanded rider list */}
      {expanded && (
        <View style={styles.expandedSection}>
          <FlatList
            data={sortedRiders}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
              <RiderRow
                rider={item}
                userLocation={userLocation}
                isLeader={item.userId === ride.leaderId}
              />
            )}
            style={styles.riderList}
            scrollEnabled={riders.length > 5}
          />
        </View>
      )}

      {/* Status and controls */}
      <View style={styles.controls}>
        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>

        {isLeader ? (
          <View style={styles.leaderButtons}>
            {ride.status === 'waiting' && (
              <Pressable style={styles.startButton} onPress={handleStart}>
                <Ionicons name="play" size={16} color={colors.textBright} />
                <Text style={styles.startButtonText}>Start</Text>
              </Pressable>
            )}
            <Pressable style={styles.rallyButton} onPress={handleSetRally}>
              <Ionicons name="flag" size={16} color={colors.accent} />
            </Pressable>
            <Pressable style={styles.endButton} onPress={handleEndRide}>
              <Ionicons name="stop" size={16} color={colors.danger} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.leaveButton} onPress={handleLeave}>
            <Ionicons name="exit-outline" size={16} color={colors.danger} />
            <Text style={styles.leaveButtonText}>Leave</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rideName: {
    color: colors.textBright,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  riderCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  riderCountText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  codeLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  codeValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: 200,
  },
  riderList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  riderName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 160,
  },
  riderSpeed: {
    color: colors.textMuted,
    fontSize: 12,
  },
  riderDist: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  startButtonText: {
    color: colors.textBright,
    fontSize: 13,
    fontWeight: '600',
  },
  rallyButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  endButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  leaveButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
