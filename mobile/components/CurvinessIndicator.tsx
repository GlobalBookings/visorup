import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCurvinessLabel, getCurvinessColor } from '../lib/curviness';
import { colors, spacing } from '../lib/theme';

type Props = {
  score: number;
};

export default function CurvinessIndicator({ score }: Props) {
  const clamped = Math.max(1, Math.min(10, Math.round(score)));
  const label = getCurvinessLabel(clamped);
  const color = getCurvinessColor(clamped);
  const fillPercent = (clamped / 10) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{clamped}/10</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${fillPercent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
