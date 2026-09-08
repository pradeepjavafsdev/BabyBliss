import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clayShadowOut, colors, fonts, gradients, radii, spacing } from '../../theme';
import { Memory } from '../../types';
import { formatShortDate } from '../../utils/date';
import { MEMORY_TAG_LABELS } from '../../data/presets';

interface MemoryCardProps {
  memory: Memory;
  onPress?: () => void;
  compact?: boolean;
}

export function MemoryCard({ memory, compact }: MemoryCardProps) {
  const initial = memory.title.slice(0, 1).toUpperCase();
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <View style={styles.media}>
        {memory.mediaUri ? (
          <Image source={{ uri: memory.mediaUri }} style={styles.image} />
        ) : (
          <LinearGradient colors={[...gradients.memory]} style={styles.placeholder}>
            <Text style={styles.initial}>{initial}</Text>
          </LinearGradient>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {memory.title}
        </Text>
        <Text style={styles.meta}>
          {formatShortDate(memory.capturedAt)}
          {memory.location ? ` · ${memory.location}` : ''}
        </Text>
        {!compact ? (
          <Text style={styles.note} numberOfLines={2}>
            {memory.note}
          </Text>
        ) : null}
        <Text style={styles.tags} numberOfLines={1}>
          {memory.tags.map((t) => MEMORY_TAG_LABELS[t] ?? t).join(' · ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm + 2,
    borderRadius: radii.clay,
    backgroundColor: colors.surface,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(150,110,90,0.28)',
    ...clayShadowOut,
  },
  compact: {
    padding: spacing.sm,
  },
  media: {
    width: 88,
    height: 88,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    color: colors.white,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 2,
  },
  tags: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.brand,
    marginTop: 4,
  },
});
