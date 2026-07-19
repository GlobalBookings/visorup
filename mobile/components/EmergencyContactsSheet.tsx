import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import { EmergencyContact, getCrashContacts, setCrashContacts } from '../lib/crash-detection';
import { tapHaptic, successHaptic } from '../lib/haptics';

type Relationship = EmergencyContact['relationship'];

const RELATIONSHIPS: Relationship[] = ['Partner', 'Family', 'Friend', 'Other'];
const MAX_CONTACTS = 3;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function EmergencyContactsSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('Family');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) loadContacts();
  }, [visible]);

  async function loadContacts() {
    setLoading(true);
    const stored = await getCrashContacts();
    setContacts(stored);
    setLoading(false);
  }

  function resetForm() {
    setName('');
    setPhone('');
    setRelationship('Family');
    setEditingContact(null);
  }

  function startEdit(contact: EmergencyContact) {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    tapHaptic();
  }

  async function saveContact() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter both name and phone number.');
      return;
    }

    let updated: EmergencyContact[];
    if (editingContact) {
      updated = contacts.map((c) =>
        c.id === editingContact.id
          ? { ...c, name: name.trim(), phone: phone.trim(), relationship }
          : c,
      );
    } else {
      if (contacts.length >= MAX_CONTACTS) {
        Alert.alert('Limit Reached', `Maximum ${MAX_CONTACTS} emergency contacts allowed.`);
        return;
      }
      const newContact: EmergencyContact = {
        id: generateId(),
        name: name.trim(),
        phone: phone.trim(),
        relationship,
      };
      updated = [...contacts, newContact];
    }

    await setCrashContacts(updated);
    setContacts(updated);
    resetForm();
    successHaptic();
  }

  async function deleteContact(id: string) {
    Alert.alert('Remove Contact', 'Are you sure you want to remove this emergency contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const updated = contacts.filter((c) => c.id !== id);
          await setCrashContacts(updated);
          setContacts(updated);
          if (editingContact?.id === id) resetForm();
          tapHaptic();
        },
      },
    ]);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Contacts</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.description}>
          These contacts will be notified automatically if a crash is detected during your ride.
        </Text>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Contact List */}
          {!loading && contacts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No emergency contacts added</Text>
            </View>
          )}

          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                <Text style={styles.contactRelationship}>{contact.relationship}</Text>
              </View>
              <View style={styles.contactActions}>
                <Pressable onPress={() => startEdit(contact)} style={styles.actionButton}>
                  <Ionicons name="pencil" size={18} color={colors.accent} />
                </Pressable>
                <Pressable onPress={() => deleteContact(contact.id)} style={styles.actionButton}>
                  <Ionicons name="trash" size={18} color={colors.danger} />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Add/Edit Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {/* Relationship Selector */}
            <Text style={styles.fieldLabel}>Relationship</Text>
            <View style={styles.relationshipRow}>
              {RELATIONSHIPS.map((rel) => (
                <Pressable
                  key={rel}
                  style={[
                    styles.relationshipChip,
                    relationship === rel && styles.relationshipChipActive,
                  ]}
                  onPress={() => {
                    setRelationship(rel);
                    tapHaptic();
                  }}
                >
                  <Text
                    style={[
                      styles.relationshipChipText,
                      relationship === rel && styles.relationshipChipTextActive,
                    ]}
                  >
                    {rel}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.formButtons}>
              <Pressable style={styles.saveButton} onPress={saveContact}>
                <Ionicons
                  name={editingContact ? 'checkmark' : 'add'}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.saveButtonText}>
                  {editingContact ? 'Update' : 'Add Contact'}
                </Text>
              </Pressable>

              {editingContact && (
                <Pressable style={styles.cancelFormButton} onPress={resetForm}>
                  <Text style={styles.cancelFormText}>Cancel</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
            <Text style={styles.infoText}>
              Contacts are stored securely on-device and never shared with third parties.
              Maximum {MAX_CONTACTS} contacts allowed.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textBright,
    fontSize: 22,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    color: colors.textBright,
    fontSize: 16,
    fontWeight: '700',
  },
  contactPhone: {
    color: colors.text,
    fontSize: 14,
  },
  contactRelationship: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  formTitle: {
    color: colors.textBright,
    fontSize: 17,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.textBright,
    fontSize: 15,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  relationshipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  relationshipChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relationshipChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  relationshipChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  relationshipChipTextActive: {
    color: '#ffffff',
  },
  formButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelFormButton: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  cancelFormText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 2,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
