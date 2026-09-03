import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii, spacing } from '../../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'brand' | 'accent' | 'neutral';
}

export function Chip({ label, selected, onPress, tone = 'brand' }: ChipProps) {
  const palette =
    tone === 'accent'
      ? { bg: colors.accentSoft, fg: colors.accentDeep, active: colors.accent }
      : tone === 'neutral'
        ? { bg: colors.canvasWarm, fg: colors.inkSoft, active: colors.ink }
        : { bg: colors.brandSoft, fg: colors.brandDeep, active: colors.brand };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? palette.active : palette.bg },
      ]}
    >
      <Text style={[styles.text, { color: selected ? colors.white : palette.fg }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
});
