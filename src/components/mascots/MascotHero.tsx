import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ClaySurface, ClaySize } from '../ui/ClaySurface';
import { ClayTone } from '../../theme';
import { BabyMascot } from './BabyMascot';
import { MascotIntent } from './mascotAssets';

interface MascotHeroProps {
  intent: MascotIntent;
  children: React.ReactNode;
  tone?: ClayTone;
  size?: ClaySize;
  lift?: boolean;
  style?: StyleProp<ViewStyle>;
  mascotAlign?: 'right' | 'left' | 'top';
  mascotSize?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Clay hero card with a cartoon baby sitting on / overlapping the surface —
 * matches the Dribbble clay kids-app layout where characters live on cards.
 */
export function MascotHero({
  intent,
  children,
  tone = 'warm',
  size = 'xl',
  lift = true,
  style,
  mascotAlign = 'right',
  mascotSize = 'lg',
}: MascotHeroProps) {
  const padRight = mascotAlign === 'right' ? 108 : undefined;
  const padLeft = mascotAlign === 'left' ? 108 : undefined;
  const padTop = mascotAlign === 'top' ? 96 : undefined;

  return (
    <View style={[styles.wrap, style]}>
      <ClaySurface
        tone={tone}
        size={size}
        lift={lift}
        contentStyle={[
          styles.content,
          padRight ? { paddingRight: padRight } : null,
          padLeft ? { paddingLeft: padLeft } : null,
          padTop ? { paddingTop: padTop } : null,
        ]}
      >
        {children}
      </ClaySurface>
      <View
        style={[
          styles.mascot,
          mascotAlign === 'right' && styles.mascotRight,
          mascotAlign === 'left' && styles.mascotLeft,
          mascotAlign === 'top' && styles.mascotTop,
        ]}
      >
        <BabyMascot intent={intent} size={mascotSize} />
      </View>
    </View>
  );
}

interface MascotHeaderProps {
  intent: MascotIntent;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Compact header row: title block + floating mascot. */
export function MascotHeader({ intent, children, style }: MascotHeaderProps) {
  return (
    <View style={[styles.headerRow, style]}>
      <View style={styles.headerText}>{children}</View>
      <BabyMascot intent={intent} size="md" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginBottom: 8,
  },
  content: {
    minHeight: 120,
    gap: 4,
  },
  mascot: {
    position: 'absolute',
    zIndex: 2,
  },
  mascotRight: {
    right: -8,
    bottom: -6,
  },
  mascotLeft: {
    left: -8,
    bottom: -6,
  },
  mascotTop: {
    alignSelf: 'center',
    top: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
});
