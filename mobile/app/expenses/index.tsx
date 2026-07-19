import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase, UserBike } from '../../lib/supabase';
import {
  Expense, ExpenseType, EXPENSE_TYPES, fetchExpenses, addExpense, deleteExpense, summarise, estimateMpg,
} from '../../lib/expenses';
import { colors, spacing } from '../../lib/theme';
import { tapHaptic, successHaptic } from '../../lib/haptics';

const iconForType = (type: ExpenseType): string =>
  EXPENSE_TYPES.find((t) => t.type === type)?.icon || 'ellipsis-horizontal';
const labelForType = (type: ExpenseType): string =>
  EXPENSE_TYPES.find((t) => t.type === type)?.label || 'Other';

const gbp = (n: number) => `£${n.toFixed(2)}`;

export default function ExpensesScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bikes, setBikes] = useState<UserBike[]>([]);
  const [selectedBike, setSelectedBike] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formType, setFormType] = useState<ExpenseType>('fuel');
  const [formAmount, setFormAmount] = useState('');
  const [formLitres, setFormLitres] = useState('');
  const [formMileage, setFormMileage] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));

  const loadExpenses = useCallback(async (bikeId: string | null) => {
    const rows = await fetchExpenses(bikeId);
    setExpenses(rows);
  }, []);

  const load = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (!u) { setLoading(false); return; }
    try {
      const { data: b } = await supabase
        .from('user_bikes')
        .select('*')
        .eq('user_id', u.id)
        .order('is_primary', { ascending: false });
      if (b) setBikes(b);
    } catch {}
    await loadExpenses(selectedBike);
    setLoading(false);
  }, [loadExpenses, selectedBike]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses(selectedBike);
    setRefreshing(false);
  }, [loadExpenses, selectedBike]);

  const selectBike = (bikeId: string | null) => {
    tapHaptic();
    setSelectedBike(bikeId);
    loadExpenses(bikeId);
  };

  const openForm = () => {
    tapHaptic();
    setFormType('fuel');
    setFormAmount('');
    setFormLitres('');
    setFormMileage('');
    setFormNotes('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setShowForm(true);
  };

  const save = async () => {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Enter an amount', 'The amount must be greater than zero.');
      return;
    }
    setSaving(true);
    const litres = formType === 'fuel' && formLitres ? parseFloat(formLitres) || null : null;
    const mileage = formType === 'fuel' && formMileage ? parseFloat(formMileage) || null : null;
    const { error } = await addExpense({
      bike_id: selectedBike,
      type: formType,
      amount,
      litres,
      mileage,
      notes: formNotes.trim() || null,
      spent_at: formDate,
    });
    setSaving(false);
    if (error) {
      Alert.alert('Could not save', error);
      return;
    }
    successHaptic();
    setShowForm(false);
    await loadExpenses(selectedBike);
  };

  const confirmDelete = (e: Expense) => {
    Alert.alert('Delete expense', `Remove this ${labelForType(e.type).toLowerCase()} entry?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteExpense(e.id);
          await loadExpenses(selectedBike);
        },
      },
    ]);
  };

  if (!user && !loading) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wallet-outline" size={48} color={colors.accent} />
        <Text style={styles.emptyTitle}>Sign in to track expenses</Text>
      </View>
    );
  }

  const summary = summarise(expenses);
  const mpg = selectedBike ? estimateMpg(expenses) : null;

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          <TouchableOpacity
            style={[styles.pill, selectedBike === null && styles.pillActive]}
            onPress={() => selectBike(null)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, selectedBike === null && styles.pillTextActive]}>All bikes</Text>
          </TouchableOpacity>
          {bikes.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[styles.pill, selectedBike === b.id && styles.pillActive]}
              onPress={() => selectBike(b.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, selectedBike === b.id && styles.pillTextActive]} numberOfLines={1}>
                {b.nickname || `${b.make} ${b.model}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{gbp(summary.total)}</Text>
            <Text style={styles.statLabel}>Total spend</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{gbp(summary.fuelSpend)}</Text>
            <Text style={styles.statLabel}>Fuel · {summary.fuelLitres.toFixed(1)}L</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {summary.avgPricePerLitre !== null ? gbp(summary.avgPricePerLitre) : '—'}
            </Text>
            <Text style={styles.statLabel}>Avg £/litre</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mpg !== null ? mpg.toFixed(0) : '—'}</Text>
            <Text style={styles.statLabel}>Est. MPG</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={openForm} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={colors.background} />
          <Text style={styles.addBtnText}>Add expense</Text>
        </TouchableOpacity>

        {expenses.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Ionicons name="wallet-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyText}>No expenses logged yet.</Text>
          </View>
        ) : (
          expenses.map((e) => (
            <View key={e.id} style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name={iconForType(e.type) as any} size={18} color={colors.accent} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{labelForType(e.type)}</Text>
                {e.type === 'fuel' && e.litres ? (
                  <Text style={styles.rowSub}>{e.litres.toFixed(1)}L · {e.spent_at}</Text>
                ) : (
                  <Text style={styles.rowSub}>{e.spent_at}</Text>
                )}
                {e.notes ? <Text style={styles.rowNotes} numberOfLines={1}>{e.notes}</Text> : null}
              </View>
              <Text style={styles.rowAmount}>{gbp(e.amount || 0)}</Text>
              <TouchableOpacity style={styles.rowDelete} onPress={() => confirmDelete(e)}>
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add expense</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.formLabel}>Type</Text>
              <View style={styles.typeRow}>
                {EXPENSE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.type}
                    style={[styles.typePill, formType === t.type && styles.typePillActive]}
                    onPress={() => setFormType(t.type)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={14}
                      color={formType === t.type ? colors.background : colors.textMuted}
                    />
                    <Text style={[styles.typePillText, formType === t.type && styles.typePillTextActive]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Amount (£) *</Text>
              <TextInput
                style={styles.formInput}
                value={formAmount}
                onChangeText={setFormAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
              />

              {formType === 'fuel' && (
                <View style={styles.formRow2}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Litres</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formLitres}
                      onChangeText={setFormLitres}
                      keyboardType="decimal-pad"
                      placeholder="15.0"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Mileage</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formMileage}
                      onChangeText={setFormMileage}
                      keyboardType="decimal-pad"
                      placeholder="12345"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>
              )}

              <Text style={styles.formLabel}>Date</Text>
              <TextInput
                style={styles.formInput}
                value={formDate}
                onChangeText={setFormDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />

              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={styles.formInput}
                value={formNotes}
                onChangeText={setFormNotes}
                placeholder="Optional"
                placeholderTextColor={colors.textMuted}
              />

              {formType === 'fuel' && (
                <Text style={styles.formHint}>Add litres + mileage on fill-ups to unlock fuel economy estimates.</Text>
              )}

              <TouchableOpacity style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]} onPress={save} disabled={saving}>
                <Text style={styles.primaryBtnText}>{saving ? 'Saving...' : 'Save expense'}</Text>
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
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  pillRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, maxWidth: 180,
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.background, fontWeight: '700' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, gap: spacing.sm,
  },
  statCard: {
    width: '47%', backgroundColor: colors.surfaceLight, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm,
  },
  statValue: { color: colors.textBright, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md,
    backgroundColor: colors.accent, borderRadius: 10, padding: spacing.md,
  },
  addBtnText: { color: colors.background, fontSize: 15, fontWeight: '700' },
  emptyBlock: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { color: colors.textMuted, fontSize: 14 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.md, marginBottom: spacing.sm, padding: spacing.md,
    backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
  },
  rowInfo: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  rowSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  rowNotes: { color: colors.textMuted, fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  rowAmount: { color: colors.textBright, fontSize: 15, fontWeight: '800' },
  rowDelete: { padding: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    maxHeight: '85%', borderTopWidth: 1, borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  formLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  formInput: {
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 15,
  },
  formRow2: { flexDirection: 'row', gap: 10 },
  formCol: { flex: 1 },
  formHint: { color: colors.textMuted, fontSize: 11, marginTop: 8, lineHeight: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16,
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
  },
  typePillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typePillText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  typePillTextActive: { color: colors.background, fontWeight: '700' },
  primaryBtn: {
    width: '100%', backgroundColor: colors.accent, borderRadius: 10,
    padding: spacing.md, alignItems: 'center', marginTop: spacing.md,
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: colors.background, fontSize: 15, fontWeight: '700' },
});
