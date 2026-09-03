import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SoftCard } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { formatBabyAge, formatShortDate } from '../../utils/date';
import { isFirebaseConfigured } from '../../services/firebase';
import { colors, fonts, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, baby, updateBaby, setPremium, signOut, memories, achievements, reminders } = useApp();
  const [weight, setWeight] = useState(String(baby?.weightKg ?? ''));
  const [height, setHeight] = useState(String(baby?.heightCm ?? ''));

  if (!user || !baby) return null;

  const saveGrowth = () => {
    updateBaby({
      weightKg: weight ? Number(weight) : undefined,
      heightCm: height ? Number(height) : undefined,
    });
    Alert.alert('Saved', 'Growth details updated.');
  };

  return (
    <Screen title="Profile" subtitle="BabyBliss settings & baby details">
      <SoftCard style={styles.card}>
        <Text style={styles.brand}>BabyBliss</Text>
        <Text style={styles.tagline}>Blissful Memories, Forever Treasured</Text>
        <Text style={styles.meta}>{user.name} · {user.email}</Text>
        <Text style={styles.meta}>Plan: {user.isPremium ? 'Premium' : 'Free'}</Text>
        <Text style={styles.meta}>
          Firebase: {isFirebaseConfigured() ? 'Connected' : 'Demo mode (configure .env)'}
        </Text>
      </SoftCard>

      <SoftCard style={styles.card}>
        <Text style={styles.label}>{baby.name}</Text>
        <Text style={styles.body}>
          Born {formatShortDate(baby.birthDate)} · {formatBabyAge(baby.birthDate)}
        </Text>
        <Text style={styles.body}>
          {memories.length} memories · {achievements.length} milestones · {reminders.length} reminders
        </Text>
        <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
        <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
        <Button title="Save growth" variant="secondary" onPress={saveGrowth} />
      </SoftCard>

      <View style={styles.actions}>
        <Button title="Family access" onPress={() => navigation.navigate('Family')} />
        <Button title="Export memory book" variant="secondary" onPress={() => navigation.navigate('Export')} />
        <Button title="AI & analytics" variant="premium" onPress={() => navigation.navigate('PremiumInsights')} />
        <Button
          title={user.isPremium ? 'Downgrade to free (demo)' : 'Upgrade to premium (demo)'}
          variant="ghost"
          onPress={() => setPremium(!user.isPremium)}
        />
        <Button
          title="Sign out"
          variant="danger"
          onPress={() => {
            Alert.alert('Sign out?', 'Local demo data will be cleared.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
            ]);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  brand: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.brandDeep },
  tagline: { fontFamily: fonts.handwritten, fontSize: 20, color: colors.inkSoft },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  label: { ...typography.section },
  body: { ...typography.body },
  actions: { gap: spacing.sm },
});
