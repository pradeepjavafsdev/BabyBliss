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
 * Clay hero card with a cartoon baby on the top-right corner —
 * content stays on the left / below so stats and copy are never covered.
 */
export function MascotHero({
  intent,
  children,
  tone = 'warm',
  size = 'xl',
  lift = true,
  style,
  mascotAlign = 'right',
  mascotSize = 'md',
}: MascotHeroProps) {
  const padBySize = { sm: 52, md: 76, lg: 100, xl: 120 }[mascotSize];
  const padRight = mascotAlign === 'right' ? padBySize : undefined;
  const padLeft = mascotAlign === 'left' ? padBySize : undefined;
  const padTop = mascotAlign === 'top' ? padBySize : undefined;

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
        pointerEvents="none"
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
      <BabyMascot intent={intent} size="sm" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginBottom: 8,
    overflow: 'visible',
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
    top: -18,
    right: -10,
  },
  mascotLeft: {
    top: -18,
    left: -10,
  },
  mascotTop: {
    alignSelf: 'center',
    top: -36,
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
