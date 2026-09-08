import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clayPressable, clayShadowOut, colors, fonts, radii, spacing } from '../../theme';
import { Reminder } from '../../types';
import { REMINDER_TYPE_LABELS } from '../../data/presets';
import { formatMemoryDate } from '../../utils/date';

interface ReminderRowProps {
  reminder: Reminder;
  onToggle?: () => void;
  onSnooze?: () => void;
  onPress?: () => void;
}

export function ReminderRow({ reminder, onToggle, onSnooze, onPress }: ReminderRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        reminder.completed && styles.done,
        pressed && clayPressable,
      ]}
    >
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
          <Ionicons name="time-outline" size={18} color={colors.brandDeep} />
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
    borderRadius: radii.clay,
    backgroundColor: colors.surface,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(150,110,90,0.28)',
    marginBottom: spacing.sm,
    ...clayShadowOut,
  },
  done: {
    opacity: 0.6,
    backgroundColor: colors.accentSoft,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandSoft,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(150,110,90,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    ...clayShadowOut,
  },
});
