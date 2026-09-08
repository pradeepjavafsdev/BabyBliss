import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { clayPressable, clayShadowLift, clayShadowOut, colors, radii, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'premium' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && !disabled && clayPressable,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' || variant === 'secondary' ? colors.brandDeep : colors.white} />
      ) : (
        <Text style={[styles.text, textStyles[variant], textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.pill,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  primary: {
    backgroundColor: colors.brand,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.35)',
    borderRightColor: 'rgba(140,60,50,0.35)',
    borderBottomColor: 'rgba(120,50,45,0.45)',
    ...clayShadowLift,
  },
  secondary: {
    backgroundColor: colors.brandSoft,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(200,130,120,0.28)',
    borderBottomColor: 'rgba(180,110,100,0.32)',
    ...clayShadowOut,
  },
  ghost: {
    backgroundColor: colors.surface,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.2)',
    borderBottomColor: 'rgba(160,120,100,0.25)',
    ...clayShadowOut,
  },
  premium: {
    backgroundColor: colors.ink,
    borderTopColor: 'rgba(255,255,255,0.18)',
    borderLeftColor: 'rgba(255,255,255,0.12)',
    borderRightColor: 'rgba(0,0,0,0.35)',
    borderBottomColor: 'rgba(0,0,0,0.45)',
    ...clayShadowLift,
  },
  danger: {
    backgroundColor: colors.danger,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(120,40,40,0.35)',
    borderBottomColor: 'rgba(100,30,30,0.45)',
    ...clayShadowOut,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    ...typography.button,
  },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.brandDeep },
  ghost: { color: colors.ink },
  premium: { color: colors.premiumSoft },
  danger: { color: colors.white },
});
