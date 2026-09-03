import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { SoftCard } from '../../components/ui/Motion';
import { useApp } from '../../context/AppContext';
import { MEMORY_TAG_LABELS } from '../../data/presets';
import { formatMemoryDate } from '../../utils/date';
import { summarizeMemory } from '../../services/ai';
import { colors, fonts, radii, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryDetail'>;

export function MemoryDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { memories, deleteMemory, updateMemory, baby, user } = useApp();
  const memory = memories.find((m) => m.id === id);

  if (!memory) {
    return (
      <Screen title="Memory">
        <Text style={styles.missing}>This memory was removed.</Text>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const runAi = async () => {
    if (!baby) return;
    if (!user?.isPremium) {
      navigation.navigate('PremiumInsights');
      return;
    }
    const summary = await summarizeMemory(memory, baby);
    updateMemory(memory.id, { aiSummary: summary });
  };

  const confirmDelete = () => {
    Alert.alert('Delete memory?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMemory(memory.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen
      title={memory.title}
      subtitle={formatMemoryDate(memory.capturedAt)}
      rightAction={
        <Pressable onPress={confirmDelete} hitSlop={12}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      }
    >
      <View style={styles.media}>
        <Text style={styles.mediaLetter}>{memory.title.slice(0, 1)}</Text>
      </View>

      {memory.location ? <Text style={styles.location}>{memory.location}</Text> : null}

      <Text style={styles.note}>{memory.note || 'No notes yet.'}</Text>

      <View style={styles.tags}>
        {memory.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{MEMORY_TAG_LABELS[t] ?? t}</Text>
          </View>
        ))}
      </View>

      {memory.aiSummary ? (
        <SoftCard style={styles.aiBox}>
          <Text style={styles.aiLabel}>AI summary</Text>
          <Text style={styles.aiText}>{memory.aiSummary}</Text>
        </SoftCard>
      ) : null}

      <View style={styles.actions}>
        <Button title="Share with family" onPress={() => navigation.navigate('ShareMemory', { id: memory.id })} />
        <Button title="AI insights" variant="premium" onPress={runAi} />
        <Button
          title="Append edited mark"
          variant="ghost"
          onPress={() => {
            updateMemory(memory.id, {
              note: memory.note ? `${memory.note}\n\nUpdated ${new Date().toLocaleString()}` : 'Updated note',
            });
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, marginBottom: spacing.md },
  media: {
    height: 220,
    borderRadius: radii.xl,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  mediaLetter: { fontFamily: fonts.displayBold, fontSize: 72, color: colors.brandDeep },
  location: { fontFamily: fonts.bodyMedium, color: colors.accent, marginBottom: spacing.sm },
  note: {
    fontFamily: fonts.handwritten,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.accentDeep },
  aiBox: { marginBottom: spacing.lg, gap: 6 },
  aiLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.premium },
  aiText: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  actions: { gap: spacing.sm },
});
