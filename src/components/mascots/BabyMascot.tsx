import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MASCOT_SOURCES, MascotIntent } from './mascotAssets';

type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<MascotSize, number> = {
  xs: 40,
  sm: 60,
  md: 92,
  lg: 124,
  xl: 168,
};

interface BabyMascotProps {
  intent: MascotIntent;
  size?: MascotSize;
  style?: StyleProp<ViewStyle>;
  float?: boolean;
}

/** Soft clay cartoon baby for page intent — place on heroes, headers, and empty states. */
export function BabyMascot({ intent, size = 'md', style, float = true }: BabyMascotProps) {
  const dim = SIZE_MAP[size];
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!float) return;
    bob.value = withDelay(
      200,
      withRepeat(
        withSequence(withTiming(-6, { duration: 1400 }), withTiming(0, { duration: 1400 })),
        -1,
        false
      )
    );
  }, [bob, float]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, { width: dim, height: dim }, animStyle, style]} pointerEvents="none">
      <Image
        source={MASCOT_SOURCES[intent]}
        style={{ width: dim, height: dim, backgroundColor: 'transparent' }}
        contentFit="contain"
        transition={200}
        accessibilityLabel={`${intent} baby mascot`}
      />
    </Animated.View>
  );
}

/** Circular clay avatar that can show a tiny mascot. */
export function MascotBubble({
  intent = 'profile',
  size = 52,
  style,
}: {
  intent?: MascotIntent;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.bubble, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Image
        source={MASCOT_SOURCES[intent]}
        style={{ width: size * 0.92, height: size * 0.92, backgroundColor: 'transparent' }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6F1',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(150,110,90,0.28)',
  },
});
