import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import { tapHaptic } from '../lib/haptics';
import RoadsideHelpSheet, { RoadsideView } from './RoadsideHelpSheet';

const CARDS: { view: RoadsideView; icon: any; label: string; sub: string }[] = [
  { view: 'breakdown', icon: 'construct-outline', label: 'Breakdown', sub: 'Providers & your cover' },
  { view: 'garage', icon: 'location-outline', label: 'Nearest Garage', sub: 'Repair garages near you' },
  { view: 'firstaid', icon: 'medkit-outline', label: 'First Aid', sub: 'Crash-scene basics' },
];

export default function RoadsideEssentials() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<RoadsideView>('menu');

  const open = (v: RoadsideView) => { tapHaptic(); setView(v); setVisible(true); };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>On-Road Essentials</Text>

      <TouchableOpacity style={styles.helpBtn} activeOpacity={0.85} onPress={() => open('menu')}>
        <View style={styles.helpIcon}>
          <Ionicons name="alert-circle" size={24} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.helpTitle}>Roadside Help</Text>
          <Text style={styles.helpSub}>Emergency numbers, garages & first aid</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <View style={styles.grid}>
        {CARDS.map((c) => (
          <TouchableOpacity key={c.view} style={styles.card} activeOpacity={0.7} onPress={() => open(c.view)}>
            <Ionicons name={c.icon} size={22} color={colors.accent} />
            <Text style={styles.cardLabel}>{c.label}</Text>
            <Text style={styles.cardSub}>{c.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <RoadsideHelpSheet visible={visible} initialView={view} onClose={() => setVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  sectionTitle: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm },

  helpBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.danger, borderRadius: 12, padding: spacing.md,
  },
  helpIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  helpTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  helpSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },

  grid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  card: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  cardLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 4 },
  cardSub: { color: colors.textMuted, fontSize: 11, lineHeight: 15 },
});
