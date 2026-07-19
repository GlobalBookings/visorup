import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';

export type RoutingAvoidance = {
  avoidMotorways?: boolean;
  avoidAroads?: boolean;
  avoidTollRoads?: boolean;
  avoidUnpaved?: boolean;
  avoidNarrowLanes?: boolean;
  avoidFerries?: boolean;
};

type ToggleConfig = {
  key: keyof RoutingAvoidance;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TOGGLES: ToggleConfig[] = [
  { key: 'avoidMotorways', label: 'Motorways', icon: 'speedometer-outline' },
  { key: 'avoidAroads', label: 'A-Roads', icon: 'car-outline' },
  { key: 'avoidTollRoads', label: 'Toll Roads', icon: 'cash-outline' },
  { key: 'avoidUnpaved', label: 'Unpaved', icon: 'trail-sign-outline' },
  { key: 'avoidNarrowLanes', label: 'Narrow', icon: 'resize-outline' },
  { key: 'avoidFerries', label: 'Ferries', icon: 'boat-outline' },
];

type Props = {
  avoidance: RoutingAvoidance;
  onChange: (avoidance: RoutingAvoidance) => void;
};

export default function AvoidanceToggles({ avoidance, onChange }: Props) {
  const toggle = (key: keyof RoutingAvoidance) => {
    onChange({ ...avoidance, [key]: !avoidance[key] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Avoid</Text>
      <View style={styles.grid}>
        {TOGGLES.map((t) => {
          const active = !!avoidance[t.key];
          return (
            <Pressable
              key={t.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggle(t.key)}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={active ? colors.accent : colors.textMuted}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  heading: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: '#1a2010',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  labelActive: {
    color: colors.accent,
  },
});
