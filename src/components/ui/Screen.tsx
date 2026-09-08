import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayAtmosphere } from './ClaySurface';
import { BabyMascot } from '../mascots/BabyMascot';
import { MascotIntent } from '../mascots/mascotAssets';
import { colors, fonts, gradients, spacing, typography } from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  /** Intent-matched clay baby mascot shown beside the page title. */
  mascot?: MascotIntent;
  scroll?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  padded?: boolean;
}

export function Screen({
  children,
  title,
  subtitle,
  mascot,
  scroll = true,
  rightAction,
  style,
  contentStyle,
  refreshing,
  onRefresh,
  padded = true,
}: ScreenProps) {
  const header =
    title || rightAction || mascot ? (
      <View style={styles.header}>
        <View style={styles.headerText}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {mascot ? <BabyMascot intent={mascot} size="sm" style={styles.headerMascot} /> : null}
        {rightAction}
      </View>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={[...gradients.hero]} style={StyleSheet.absoluteFill} />
      <ClayAtmosphere />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[
              padded && styles.pad,
              styles.scrollContent,
              contentStyle,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
              ) : undefined
            }
          >
            {body}
          </ScrollView>
        ) : (
          <View style={[padded && styles.pad, styles.fill, contentStyle]}>{body}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  safe: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  pad: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 110,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  headerMascot: {
    marginTop: -4,
  },
});
