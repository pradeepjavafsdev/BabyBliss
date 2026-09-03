import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radii, spacing } from '../../theme';
import { Reminder } from '../../types';
import { REMINDER_TYPE_LABELS } from '../../data/presets';
import { formatMemoryDate } from '../../utils/date';

interface ReminderRowProps {
  reminder: Reminder;
  onToggle?: () => void;
  onSnooze?: () => void;
  onPress?: () => void;
}

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  vaccination: 'medkit-outline',
  doctor: 'medical-outline',
  feeding: 'nutrition-outline',
  sleep: 'moon-outline',
  medicine: 'flask-outline',
  diaper: 'water-outline',
  photo: 'camera-outline',
  custom: 'notifications-outline',
};

export function ReminderRow({ reminder, onToggle, onSnooze, onPress }: ReminderRowProps) {
  return (
    <Pressable onPress={onPress} style={[styles.row, reminder.completed && styles.done]}>
      <Pressable onPress={onToggle} hitSlop={10} style={styles.check}>
        <Ionicons
          name={reminder.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={reminder.completed ? colors.accent : colors.muted}
        />
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.title, reminder.completed && styles.strike]}>{reminder.title}</Text>
        <Text style={styles.meta}>
          {REMINDER_TYPE_LABELS[reminder.type]} · {reminder.frequency} ·{' '}
          {formatMemoryDate(reminder.scheduledAt)}
        </Text>
      </View>
      {!reminder.completed && onSnooze ? (
        <Pressable onPress={onSnooze} style={styles.snooze}>
          <Ionicons name="time-outline" size={18} color={colors.brand} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.sm,
  },
  done: {
    opacity: 0.55,
  },
  check: {
    paddingRight: 2,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.ink,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  snooze: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
