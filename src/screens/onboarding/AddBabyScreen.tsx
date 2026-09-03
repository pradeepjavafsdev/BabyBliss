import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useApp } from '../../context/AppContext';
import { Gender } from '../../types';
import { createId } from '../../utils/date';
import { colors, fonts, spacing, typography } from '../../theme';

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'girl', label: 'Girl' },
  { id: 'boy', label: 'Boy' },
  { id: 'other', label: 'Other' },
  { id: 'prefer_not', label: 'Prefer not' },
];

export function AddBabyScreen() {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('2025-02-01');
  const [gender, setGender] = useState<Gender>('girl');
  const [step, setStep] = useState(0);

  const finish = () => {
    if (!name.trim()) return;
    completeOnboarding({
      id: createId('baby'),
      name: name.trim(),
      birthDate: new Date(birthDate).toISOString(),
      gender,
    });
  };

  if (step === 0) {
    return (
      <Screen title="Meet your little one" subtitle="We'll personalize age, milestones, and reminders.">
        <View style={styles.block}>
          <Input label="Baby's name" value={name} onChangeText={setName} placeholder="Nova" autoFocus />
          <Button title="Continue" onPress={() => name.trim() && setStep(1)} disabled={!name.trim()} />
        </View>
      </Screen>
    );
  }

  if (step === 1) {
    return (
      <Screen title="Birth date" subtitle="Used for age calculation and milestone suggestions.">
        <View style={styles.block}>
          <Input
            label="Birth date (YYYY-MM-DD)"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="2025-02-01"
          />
          <Text style={styles.hint}>You can update growth details anytime from Profile.</Text>
          <Button title="Continue" onPress={() => setStep(2)} />
          <Button title="Back" variant="ghost" onPress={() => setStep(0)} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Almost there" subtitle={`How should we refer to ${name || 'your baby'}?`}>
      <View style={styles.block}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.chips}>
          {GENDERS.map((g) => (
            <Chip key={g.id} label={g.label} selected={gender === g.id} onPress={() => setGender(g.id)} />
          ))}
        </View>
        <View style={styles.tourCard}>
          <Text style={styles.tourTitle}>A quick tour awaits</Text>
          <Text style={styles.tourBody}>
            Capture memories, mark milestones, set gentle reminders, and invite family — all in one calm place.
          </Text>
        </View>
        <Button title="Enter BabyBliss" onPress={finish} />
        <Button title="Back" variant="ghost" onPress={() => setStep(1)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.md, marginTop: spacing.md },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.inkSoft },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tourCard: {
    backgroundColor: colors.accentMist,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  tourTitle: { ...typography.section },
  tourBody: { ...typography.body },
});
