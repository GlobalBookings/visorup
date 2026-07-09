import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../lib/achievements';
import { colors, spacing } from '../lib/theme';

export function BadgeToast({ badge, onHide }: { badge: Badge | null; onHide: () => void }) {
  const translateY = useRef(new Animated.Value(-140)).current;

  useEffect(() => {
    if (!badge) return;
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 60 }).start();
    const t = setTimeout(() => {
      Animated.timing(translateY, { toValue: -140, duration: 250, useNativeDriver: true }).start(
        ({ finished }) => { if (finished) onHide(); },
      );
    }, 3200);
    return () => clearTimeout(t);
  }, [badge]);

  if (!badge) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }]}>
      <View style={styles.icon}>
        <Ionicons name={badge.icon as any} size={20} color={colors.background} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Achievement unlocked</Text>
        <Text style={styles.name}>{badge.title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceLight,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 2 },
});
