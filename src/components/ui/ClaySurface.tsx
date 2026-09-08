import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  clayPressable,
  clayShadowLift,
  clayShadowOut,
  clayToneFill,
  colors,
  radii,
  spacing,
} from '../../theme';
import type { ClayTone } from '../../theme';

export type { ClayTone };
export type ClaySize = 'sm' | 'md' | 'lg' | 'xl';

interface ClaySurfaceProps {
  children: React.ReactNode;
  tone?: ClayTone;
  size?: ClaySize;
  padded?: boolean;
  lift?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const radiusFor: Record<ClaySize, number> = {
  sm: radii.md,
  md: radii.lg,
  lg: radii.clay,
  xl: radii.clayXl,
};

/**
 * Plump clay surface — the default container for BabyBliss UI.
 * Prefer this (or SoftCard) over flat bordered cards on new screens.
 */
export function ClaySurface({
  children,
  tone = 'default',
  size = 'lg',
  padded = true,
  lift = false,
  onPress,
  style,
  contentStyle,
}: ClaySurfaceProps) {
  const radius = radiusFor[size];
  const fill = clayToneFill[tone];
  const isPremium = tone === 'premium';

  const body = (
    <View
      style={[
        styles.shell,
        lift ? clayShadowLift : clayShadowOut,
        {
          borderRadius: radius,
          backgroundColor: fill,
          borderTopColor: isPremium ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.95)',
          borderLeftColor: isPremium ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.9)',
          borderRightColor: isPremium ? 'rgba(0,0,0,0.28)' : 'rgba(180,140,120,0.22)',
          borderBottomColor: isPremium ? 'rgba(0,0,0,0.38)' : 'rgba(140,100,80,0.28)',
        },
        style,
      ]}
    >
      {!isPremium ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 0.85 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          pointerEvents="none"
        />
      ) : null}
      <View style={[padded && styles.pad, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && clayPressable}>
        {body}
      </Pressable>
    );
  }

  return body;
}

/** Decorative soft clay blobs for screen atmosphere. */
export function ClayAtmosphere() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.blob, styles.blobTL]} />
      <View style={[styles.blob, styles.blobBR]} />
      <View style={[styles.blob, styles.blobMid]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 2.5,
    overflow: 'hidden',
  },
  pad: {
    padding: spacing.md,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.9,
  },
  blobTL: {
    width: 220,
    height: 220,
    top: -70,
    left: -60,
    backgroundColor: colors.brandSoft,
  },
  blobBR: {
    width: 260,
    height: 260,
    bottom: 40,
    right: -90,
    backgroundColor: colors.accentSoft,
  },
  blobMid: {
    width: 160,
    height: 160,
    top: '42%',
    left: -50,
    backgroundColor: colors.apricotSoft,
    opacity: 0.7,
  },
});
