import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ReminderRow } from '../../components/reminders/ReminderRow';
import { EmptyState } from '../../components/ui/EmptyState';
import { Chip } from '../../components/ui/Chip';
import { useApp } from '../../context/AppContext';
import { colors, fonts, gradients, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

export function RemindersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reminders, toggleReminderComplete, snoozeReminder } = useApp();
  const [filter, setFilter] = useState<'open' | 'done' | 'all'>('open');

  const list = useMemo(() => {
    return reminders
      .filter((r) => {
        if (filter === 'open') return !r.completed;
        if (filter === 'done') return r.completed;
        return true;
      })
      .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  }, [reminders, filter]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...gradients.hero]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reminders</Text>
            <Text style={styles.sub}>Vaccines, visits, care rhythms</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddReminder')}>
            <Ionicons name="add" size={24} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          <Chip label="Open" selected={filter === 'open'} onPress={() => setFilter('open')} />
          <Chip label="Done" selected={filter === 'done'} onPress={() => setFilter('done')} tone="accent" />
          <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} tone="neutral" />
        </View>

        <FlatList
          data={list}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="notifications-outline"
              title="No reminders"
              message="Add vaccinations, appointments, or photo nudges."
            />
          }
          renderItem={({ item }) => (
            <ReminderRow
              reminder={item}
              onToggle={() => toggleReminderComplete(item.id)}
              onSnooze={() => {
                const until = new Date(Date.now() + 60 * 60 * 1000).toISOString();
                snoozeReminder(item.id, until);
              }}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
});
