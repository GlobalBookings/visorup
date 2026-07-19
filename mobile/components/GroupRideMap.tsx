/**
 * GroupRideMap — Screen-fixed status overlay for the group ride.
 *
 * Rider markers are drawn geographically on the real MapView by the screen;
 * this overlay adds the separation alert banner, rally-point badge, and the
 * nearest-rider distance badge on top of that map.
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import type { RallyPoint, RiderPosition } from '../lib/group-ride';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Coord = { latitude: number; longitude: number };

type Props = {
  riders: RiderPosition[];
  rallyPoint: RallyPoint | null;
  isLeader: boolean;
  userLocation: Coord | null;
  leaderId?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RIDER_COLORS = [
  '#4ecdc4', // teal
  '#ff6b6b', // coral
  '#a29bfe', // lavender
  '#fdcb6e', // sun
  '#6c5ce7', // purple
  '#00b894', // mint
  '#e17055', // terracotta
  '#74b9ff', // sky
  '#fd79a8', // pink
  '#55a3e0', // blue
];

const SEPARATION_THRESHOLD_MILES = 2;

/**
 * Haversine distance in miles between two coordinates.
 */
function distanceMiles(a: Coord, b: Coord): number {
  const R = 3958.8; // Earth radius in miles
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

export function getRiderColor(index: number, isLeader: boolean): string {
  if (isLeader) return colors.accent;
  return RIDER_COLORS[index % RIDER_COLORS.length];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GroupRideMap({
  riders,
  rallyPoint,
  isLeader: _isLeader,
  userLocation,
  leaderId,
}: Props) {
  // Calculate nearest rider distance and separation alerts
  const { nearestDistance, separatedRiders } = useMemo(() => {
    if (!userLocation || riders.length < 2) {
      return { nearestDistance: null, separatedRiders: [] };
    }

    let nearest = Infinity;
    const separated: RiderPosition[] = [];

    // Find the leader position (front of group)
    const leaderPos = riders.find((r) => r.userId === leaderId);
    const referencePos = leaderPos ?? { latitude: userLocation.latitude, longitude: userLocation.longitude };

    for (const rider of riders) {
      if (rider.latitude === 0 && rider.longitude === 0) continue;

      // Distance from current user
      const d = distanceMiles(userLocation, {
        latitude: rider.latitude,
        longitude: rider.longitude,
      });
      if (d > 0 && d < nearest) nearest = d;

      // Check separation from leader/front
      const sepDist = distanceMiles(
        { latitude: referencePos.latitude, longitude: referencePos.longitude },
        { latitude: rider.latitude, longitude: rider.longitude }
      );
      if (sepDist > SEPARATION_THRESHOLD_MILES) {
        separated.push(rider);
      }
    }

    return {
      nearestDistance: nearest === Infinity ? null : nearest,
      separatedRiders: separated,
    };
  }, [riders, userLocation, leaderId]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Separation alert banner */}
      {separatedRiders.length > 0 && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={18} color={colors.danger} />
          <Text style={styles.alertText}>
            {separatedRiders.length === 1
              ? `${separatedRiders[0].displayName} is more than 2 miles behind`
              : `${separatedRiders.length} riders are more than 2 miles behind`}
          </Text>
          {/* TODO: Voice alert — "Rider {name} has fallen behind" */}
        </View>
      )}

      {/* Rally point indicator */}
      {rallyPoint && (
        <View style={styles.rallyIndicator}>
          <Ionicons name="flag" size={16} color={colors.accent} />
          <Text style={styles.rallyText}>{rallyPoint.name}</Text>
        </View>
      )}

      {/* Nearest rider distance */}
      {nearestDistance !== null && (
        <View style={styles.distanceBadge}>
          <Ionicons name="people" size={14} color={colors.text} />
          <Text style={styles.distanceText}>
            {nearestDistance < 0.1
              ? `${Math.round(nearestDistance * 5280)} ft`
              : `${nearestDistance.toFixed(1)} mi`}
            {' '}nearest
          </Text>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alertBanner: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  alertText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  ridersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  riderMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  leaderDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  riderLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rallyIndicator: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  rallyText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  distanceText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
});
