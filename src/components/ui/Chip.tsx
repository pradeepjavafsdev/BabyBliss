import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { clayPressable, clayShadowOut, colors, fonts, radii, spacing } from '../../theme';

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
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? palette.active : palette.bg,
          borderTopColor: selected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.95)',
          borderLeftColor: selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
          borderRightColor: selected ? 'rgba(80,40,30,0.3)' : 'rgba(180,140,120,0.22)',
          borderBottomColor: selected ? 'rgba(60,30,20,0.35)' : 'rgba(150,110,90,0.28)',
        },
        pressed && clayPressable,
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
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 4,
    borderRadius: radii.pill,
    borderWidth: 2,
    ...clayShadowOut,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
});
