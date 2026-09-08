import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ClaySurface } from './ClaySurface';
import { ClayTone, colors, fonts, spacing } from '../../theme';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeIn({ children, delay = 0, style }: FadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 480 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 16, stiffness: 110 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 120 }));
  }, [delay, opacity, translateY, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}

interface SoftCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: ClayTone;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Clay card surface — alias kept for existing screens; use for new pages too. */
export function SoftCard({ children, onPress, style, tone = 'default', size = 'lg' }: SoftCardProps) {
  return (
    <ClaySurface tone={tone} size={size} onPress={onPress} style={style}>
      {children}
    </ClaySurface>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
});
