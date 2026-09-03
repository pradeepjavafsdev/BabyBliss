import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radii, spacing } from '../../theme';
import { MilestoneDefinition } from '../../types';

interface MilestoneRowProps {
  milestone: MilestoneDefinition;
  achieved?: boolean;
  achievedAt?: string;
  onPress?: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  physical: colors.brand,
  social: colors.apricot,
  cognitive: colors.accent,
  language: colors.sage,
  custom: colors.inkSoft,
};

export function MilestoneRow({ milestone, achieved, achievedAt, onPress }: MilestoneRowProps) {
  const color = CATEGORY_COLOR[milestone.category] ?? colors.brand;
  return (
    <Pressable onPress={onPress} style={[styles.row, achieved && styles.achieved]}>
      <View style={[styles.dot, { backgroundColor: color }]}>
        <Ionicons
          name={achieved ? 'checkmark' : 'ellipse-outline'}
          size={achieved ? 16 : 14}
          color={colors.white}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{milestone.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {milestone.description}
        </Text>
        <Text style={styles.meta}>
          Typical ~{milestone.typicalAgeMonths} mo
          {achievedAt ? ` · Achieved` : ''}
          {milestone.isCustom ? ' · Custom' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  achieved: {
    backgroundColor: colors.accentMist,
    borderRadius: radii.md,
    borderBottomWidth: 0,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  desc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
});
