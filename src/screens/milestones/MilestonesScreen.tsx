import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MilestoneRow } from '../../components/milestones/MilestoneRow';
import { Chip } from '../../components/ui/Chip';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ClayAtmosphere, ClaySurface } from '../../components/ui/ClaySurface';
import { useApp } from '../../context/AppContext';
import { MilestoneCategory } from '../../types';
import { babyAgeInMonths, formatShortDate } from '../../utils/date';
import { clayPressable, clayShadowLift, clayShadowOut, colors, fonts, gradients, radii, spacing } from '../../theme';

const CATEGORIES: Array<MilestoneCategory | 'all' | 'achieved'> = [
  'all',
  'physical',
  'social',
  'cognitive',
  'language',
  'custom',
  'achieved',
];

export function MilestonesScreen() {
  const { milestones, achievements, baby, completeMilestone, uncompleteMilestone, addCustomMilestone } =
    useApp();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('all');
  const [showCustom, setShowCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const achievedMap = useMemo(() => {
    const map = new Map(achievements.map((a) => [a.milestoneId, a]));
    return map;
  }, [achievements]);

  const ageMonths = baby ? babyAgeInMonths(baby.birthDate) : 0;

  const list = useMemo(() => {
    return milestones
      .filter((m) => {
        if (filter === 'all') return true;
        if (filter === 'achieved') return achievedMap.has(m.id);
        return m.category === filter;
      })
      .sort((a, b) => a.typicalAgeMonths - b.typicalAgeMonths);
  }, [milestones, filter, achievedMap]);

  const onPressMilestone = (id: string, title: string) => {
    const existing = achievedMap.get(id);
    if (existing) {
      Alert.alert(title, `Achieved ${formatShortDate(existing.achievedAt)}`, [
        { text: 'Undo', style: 'destructive', onPress: () => uncompleteMilestone(id) },
        { text: 'OK' },
      ]);
      return;
    }
    Alert.alert('Mark achieved?', title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark done',
        onPress: () =>
          completeMilestone({
            milestoneId: id,
            achievedAt: new Date().toISOString(),
            note: 'Celebrated in BabyBliss',
          }),
      },
    ]);
  };

  const saveCustom = () => {
    if (!customTitle.trim()) return;
    addCustomMilestone({
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom family milestone',
      category: 'custom',
      typicalAgeMonths: ageMonths,
    });
    setCustomTitle('');
    setCustomDesc('');
    setShowCustom(false);
    setFilter('custom');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...gradients.hero]} style={StyleSheet.absoluteFill} />
      <ClayAtmosphere />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Milestones</Text>
            <Text style={styles.sub}>
              {achievements.length} achieved · ~{ageMonths} months old
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && clayPressable]}
            onPress={() => setShowCustom((v) => !v)}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </Pressable>
        </View>

        <ClaySurface tone="accent" size="lg" style={styles.calendar}>
          <Text style={styles.calTitle}>Milestone calendar</Text>
          <View style={styles.calRow}>
            {achievements.slice(0, 6).map((a) => {
              const def = milestones.find((m) => m.id === a.milestoneId);
              return (
                <View key={a.id} style={styles.calChip}>
                  <Text style={styles.calChipText} numberOfLines={1}>
                    {def?.title ?? 'Done'}
                  </Text>
                </View>
              );
            })}
            {!achievements.length ? (
              <Text style={styles.calEmpty}>Achievements will bloom here.</Text>
            ) : null}
          </View>
        </ClaySurface>

        {showCustom ? (
          <ClaySurface tone="warm" size="lg" style={styles.customBox}>
            <Input label="Custom milestone" value={customTitle} onChangeText={setCustomTitle} placeholder="First beach day" />
            <Input label="Description" value={customDesc} onChangeText={setCustomDesc} placeholder="Optional" />
            <Button title="Add milestone" onPress={saveCustom} />
          </ClaySurface>
        ) : null}

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => (
            <Chip
              label={item === 'all' ? 'All' : item === 'achieved' ? 'Achieved' : item}
              selected={filter === item}
              onPress={() => setFilter(item)}
              tone={item === 'achieved' ? 'accent' : 'brand'}
            />
          )}
        />

        <FlatList
          data={list}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MilestoneRow
              milestone={item}
              achieved={achievedMap.has(item.id)}
              achievedAt={achievedMap.get(item.id)?.achievedAt}
              onPress={() => onPressMilestone(item.id, item.title)}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.35)',
    borderRightColor: 'rgba(40,90,80,0.35)',
    borderBottomColor: 'rgba(30,70,60,0.45)',
    ...clayShadowLift,
  },
  calendar: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  calTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.accentDeep },
  calRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  calChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.2)',
    borderBottomColor: 'rgba(150,110,90,0.25)',
    ...clayShadowOut,
  },
  calChipText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.ink, maxWidth: 120 },
  calEmpty: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  customBox: { marginHorizontal: spacing.lg, marginTop: spacing.md, gap: spacing.sm },
  filters: { paddingHorizontal: spacing.lg, gap: spacing.xs, paddingVertical: spacing.md },
  list: { paddingHorizontal: spacing.md, paddingBottom: 110 },
});
