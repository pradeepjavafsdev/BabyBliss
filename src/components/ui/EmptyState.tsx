import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClaySurface } from './ClaySurface';
import { colors, fonts, spacing, typography } from '../../theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon = 'heart-outline', title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <ClaySurface tone="brand" size="md" style={styles.iconShell} contentStyle={styles.iconPad}>
        <Ionicons name={icon} size={28} color={colors.brandDeep} />
      </ClaySurface>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  iconShell: {
    width: 72,
    height: 72,
    marginBottom: spacing.xs,
  },
  iconPad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  title: {
    ...typography.section,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
});
