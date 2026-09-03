import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { SoftCard } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { MEMORY_TAG_LABELS } from '../../data/presets';
import { colors, fonts, spacing } from '../../theme';

export function AnalyticsScreen() {
  const { memories, achievements, milestones, growth, baby } = useApp();

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach((m) => m.tags.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [memories]);

  const density = useMemo(() => {
    const byMonth: Record<string, number> = {};
    memories.forEach((m) => {
      const key = m.capturedAt.slice(0, 7);
      byMonth[key] = (byMonth[key] ?? 0) + 1;
    });
    return Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0]));
  }, [memories]);

  return (
    <Screen title="Analytics" subtitle={baby ? `${baby.name}'s patterns` : 'Growth & memory insights'}>
      <SoftCard style={styles.card}>
        <Text style={styles.label}>Memory density</Text>
        {density.map(([month, count]) => (
          <View key={month} style={styles.barRow}>
            <Text style={styles.barLabel}>{month}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.min(100, count * 20)}%` }]} />
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        ))}
        {!density.length ? <Text style={styles.empty}>Capture memories to see trends.</Text> : null}
      </SoftCard>

      <SoftCard style={styles.card}>
        <Text style={styles.label}>Most photographed themes</Text>
        {tagCounts.map(([tag, count]) => (
          <Text key={tag} style={styles.row}>
            {MEMORY_TAG_LABELS[tag] ?? tag} — {count}
          </Text>
        ))}
      </SoftCard>

      <SoftCard style={styles.card}>
        <Text style={styles.label}>Milestone timeline</Text>
        {achievements.map((a) => {
          const def = milestones.find((m) => m.id === a.milestoneId);
          return (
            <Text key={a.id} style={styles.row}>
              {new Date(a.achievedAt).toLocaleDateString()} · {def?.title}
            </Text>
          );
        })}
        {!achievements.length ? <Text style={styles.empty}>No milestones yet.</Text> : null}
      </SoftCard>

      <SoftCard style={styles.card}>
        <Text style={styles.label}>Growth chart</Text>
        {growth.map((g) => (
          <Text key={g.id} style={styles.row}>
            {new Date(g.date).toLocaleDateString()} · {g.weightKg} kg · {g.heightCm} cm
          </Text>
        ))}
        {!growth.length ? <Text style={styles.empty}>Add measurements in Profile.</Text> : null}
      </SoftCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 72, fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.brandMist,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.brand },
  barCount: { width: 24, fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.ink },
  row: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
