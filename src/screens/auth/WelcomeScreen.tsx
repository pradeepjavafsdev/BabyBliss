import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FadeIn } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { colors, fonts, gradients, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const { signIn, loadDemoData } = useApp();
  const [mode, setMode] = useState<'welcome' | 'signin'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!email.trim()) return;
    signIn(email.trim(), name.trim() || 'Parent');
    navigation.replace('AddBaby');
  };

  if (mode === 'signin') {
    return (
      <View style={styles.root}>
        <LinearGradient colors={[...gradients.sunrise]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.form}>
            <Text style={styles.brandSmall}>BabyBliss</Text>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.sub}>Sign in to continue your baby's story.</Text>
            <Input label="Name" value={name} onChangeText={setName} placeholder="Alex" autoCapitalize="words" />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button title="Continue" onPress={handleContinue} disabled={!email.trim()} />
            <Button title="Back" variant="ghost" onPress={() => setMode('welcome')} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <LinearGradient colors={[...gradients.sunrise]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <FadeIn>
            <Text style={styles.brand}>BabyBliss</Text>
          </FadeIn>
          <FadeIn delay={120}>
            <Text style={styles.tagline}>Blissful Memories,{'\n'}Forever Treasured</Text>
          </FadeIn>
          <FadeIn delay={240}>
            <Text style={styles.lead}>
              Capture moments, track milestones, and share your newborn's journey with the people who love them most.
            </Text>
          </FadeIn>
        </View>
        <FadeIn delay={360} style={styles.actions}>
          <Button title="Get started" onPress={() => setMode('signin')} />
          <Button
            title="Explore demo"
            variant="secondary"
            onPress={() => {
              loadDemoData();
            }}
          />
        </FadeIn>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  safe: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between' },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.md, paddingTop: spacing.xxl },
  brand: { ...typography.brand, color: colors.brandDeep },
  brandSmall: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.brandDeep,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: fonts.handwritten,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
  },
  lead: {
    ...typography.body,
    maxWidth: 340,
    marginTop: spacing.sm,
  },
  actions: { gap: spacing.sm, paddingBottom: spacing.xl },
  form: { flex: 1, justifyContent: 'center', gap: spacing.md },
  heading: { ...typography.hero },
  sub: { ...typography.body, marginBottom: spacing.sm },
});
