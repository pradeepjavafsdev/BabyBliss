import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/ui/Screen';
import { FadeIn, SectionLabel, SoftCard } from '../../components/ui/Motion';
import { MemoryCard } from '../../components/memories/MemoryCard';
import { useApp } from '../../context/AppContext';
import { buildDailyInsight } from '../../data/demo';
import { babyAgeInDays, formatBabyAge, formatShortDate } from '../../utils/date';
import { colors, fonts, gradients, radii, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { baby, memories, reminders, achievements, milestones, user } = useApp();

  const ageLabel = baby ? formatBabyAge(baby.birthDate) : '';
  const days = baby ? babyAgeInDays(baby.birthDate) : 0;
  const upcomingReminders = reminders.filter((r) => !r.completed).slice(0, 3);
  const upcomingMilestones = useMemo(() => {
    const achieved = new Set(achievements.map((a) => a.milestoneId));
    const ageMonths = baby ? Math.floor(days / 30.44) : 0;
    return milestones
      .filter((m) => !achieved.has(m.id))
      .sort(
        (a, b) =>
          Math.abs(a.typicalAgeMonths - ageMonths) - Math.abs(b.typicalAgeMonths - ageMonths)
      )
      .slice(0, 3);
  }, [achievements, milestones, baby, days]);

  const insight = baby ? buildDailyInsight(baby) : null;

  if (!baby) return null;

  return (
    <Screen padded>
      <FadeIn>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>BabyBliss</Text>
            <Text style={styles.hello}>Hello, {user?.name?.split(' ')[0] ?? 'Parent'}</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>{(user?.name ?? 'P').slice(0, 1)}</Text>
          </Pressable>
        </View>
      </FadeIn>

      <FadeIn delay={80}>
        <LinearGradient colors={[...gradients.softPeach]} style={styles.ageHero}>
          <Text style={styles.babyName}>{baby.name}</Text>
          <Text style={styles.age}>{ageLabel}</Text>
          <Text style={styles.ageSub}>{days} days of wonder · Born {formatShortDate(baby.birthDate)}</Text>
          <View style={styles.statsRow}>
            <Stat label="Memories" value={String(memories.length)} />
            <Stat label="Milestones" value={String(achievements.length)} />
            <Stat label="Reminders" value={String(upcomingReminders.length)} />
          </View>
        </LinearGradient>
      </FadeIn>

      <FadeIn delay={160}>
        <View style={styles.quickRow}>
          <QuickAction
            icon="camera"
            label="Memory"
            onPress={() => navigation.navigate('AddMemory')}
          />
          <QuickAction
            icon="flag"
            label="Milestone"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Milestones' })}
          />
          <QuickAction
            icon="alarm"
            label="Reminder"
            onPress={() => navigation.navigate('AddReminder')}
          />
          <QuickAction
            icon="sparkles"
            label="AI"
            onPress={() => navigation.navigate('PremiumInsights')}
          />
        </View>
      </FadeIn>

      {insight ? (
        <FadeIn delay={220}>
          <SectionLabel>Today's thought</SectionLabel>
          <SoftCard
            onPress={() => navigation.navigate('PremiumInsights')}
            style={styles.insightCard}
          >
            <View style={styles.insightTop}>
              <Ionicons name="sparkles" size={18} color={colors.premium} />
              <Text style={styles.premiumBadge}>{user?.isPremium ? 'Premium' : 'Preview'}</Text>
            </View>
            <Text style={styles.insightText}>{insight.reflection}</Text>
            <Text style={styles.insightTip}>{insight.tip}</Text>
          </SoftCard>
        </FadeIn>
      ) : null}

      <FadeIn delay={280}>
        <View style={styles.sectionHead}>
          <SectionLabel>Recent memories</SectionLabel>
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Memories' })}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {memories.slice(0, 3).map((m) => (
            <Pressable key={m.id} onPress={() => navigation.navigate('MemoryDetail', { id: m.id })}>
              <MemoryCard memory={m} compact />
            </Pressable>
          ))}
          {!memories.length ? (
            <Text style={styles.empty}>No memories yet — capture the first one.</Text>
          ) : null}
        </View>
      </FadeIn>

      <FadeIn delay={340}>
        <SectionLabel>Upcoming milestones</SectionLabel>
        <View style={styles.list}>
          {upcomingMilestones.map((m) => (
            <SoftCard key={m.id} style={styles.mileItem}>
              <Text style={styles.mileTitle}>{m.title}</Text>
              <Text style={styles.mileMeta}>Typical ~{m.typicalAgeMonths} months</Text>
            </SoftCard>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={400}>
        <SectionLabel>Next reminders</SectionLabel>
        <View style={styles.list}>
          {upcomingReminders.map((r) => (
            <SoftCard key={r.id} style={styles.mileItem}>
              <Text style={styles.mileTitle}>{r.title}</Text>
              <Text style={styles.mileMeta}>{formatShortDate(r.scheduledAt)}</Text>
            </SoftCard>
          ))}
          {!upcomingReminders.length ? (
            <Text style={styles.empty}>You're all caught up.</Text>
          ) : null}
        </View>
      </FadeIn>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quick}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={20} color={colors.brandDeep} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.brandDeep,
    letterSpacing: -0.5,
  },
  hello: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
  ageHero: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: 4,
  },
  babyName: {
    fontFamily: fonts.handwrittenBold,
    fontSize: 28,
    color: colors.brandDeep,
  },
  age: {
    ...typography.hero,
  },
  ageSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quick: { alignItems: 'center', gap: 6, width: '23%' },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.inkSoft,
  },
  insightCard: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  insightTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  premiumBadge: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.premium,
  },
  insightText: {
    fontFamily: fonts.handwritten,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  insightTip: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 20,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.brand,
    marginBottom: spacing.sm,
  },
  list: { gap: spacing.sm, marginBottom: spacing.xl },
  empty: { fontFamily: fonts.body, color: colors.muted, fontSize: 14 },
  mileItem: { gap: 2 },
  mileTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  mileMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
