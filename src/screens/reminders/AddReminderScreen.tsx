import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useApp } from '../../context/AppContext';
import { REMINDER_TYPE_LABELS } from '../../data/presets';
import { ReminderFrequency, ReminderType } from '../../types';
import { fonts, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddReminder'>;

export function AddReminderScreen({ navigation }: Props) {
  const { addReminder } = useApp();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<ReminderType>('doctor');
  const [frequency, setFrequency] = useState<ReminderFrequency>('once');
  const [when, setWhen] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const save = () => {
    if (!title.trim()) return;
    addReminder({
      title: title.trim(),
      notes: notes.trim() || undefined,
      type,
      frequency,
      scheduledAt: new Date(when).toISOString(),
    });
    navigation.goBack();
  };

  return (
    <Screen title="New reminder" subtitle="One-time or repeating care cues.">
      <View style={styles.block}>
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Vaccination visit" />
        <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional details" />
        <Input
          label="Schedule (YYYY-MM-DDTHH:mm)"
          value={when}
          onChangeText={setWhen}
          placeholder="2026-09-04T10:30"
        />
        <Text style={styles.label}>Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {(Object.keys(REMINDER_TYPE_LABELS) as ReminderType[]).map((t) => (
            <Chip key={t} label={REMINDER_TYPE_LABELS[t]} selected={type === t} onPress={() => setType(t)} />
          ))}
        </ScrollView>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.chipsWrap}>
          {(['once', 'daily', 'weekly', 'monthly', 'age_based'] as ReminderFrequency[]).map((f) => (
            <Chip key={f} label={f.replace('_', ' ')} selected={frequency === f} onPress={() => setFrequency(f)} tone="accent" />
          ))}
        </View>
        <Button title="Save reminder" onPress={save} disabled={!title.trim()} />
        <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.md },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  chips: { gap: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
