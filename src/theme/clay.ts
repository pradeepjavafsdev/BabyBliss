import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';
import { radii } from './spacing';

/**
 * Claymorphism design tokens for BabyBliss.
 *
 * Visual recipe (use on every new screen/component):
 * - Soft pastel fills (never flat pure white alone)
 * - Extra-plump radii (radii.clay / radii.xl)
 * - Dual lighting: bright top-left rim + warm soft drop shadow
 * - Thick soft borders in near-white / pastel
 * - No sharp cards, hairline rules, or glass blur as primary surfaces
 */
export const clayColors = {
  canvas: colors.canvas,
  blobPeach: 'rgba(255, 196, 176, 0.55)',
  blobSage: 'rgba(167, 214, 198, 0.45)',
  blobApricot: 'rgba(255, 214, 170, 0.5)',
  surface: '#FFFCF9',
  surfaceWarm: '#FFF1EA',
  surfaceCool: '#EEF7F3',
  surfaceBrand: '#FBE4DF',
  surfaceAccent: '#DFF0EB',
  surfacePremium: '#2F2824',
  rim: 'rgba(255, 255, 255, 0.92)',
  rimSoft: 'rgba(255, 255, 255, 0.7)',
  shade: 'rgba(180, 140, 120, 0.22)',
  shadeDeep: 'rgba(120, 90, 75, 0.28)',
} as const;

/** Soft outer clay drop shadow (bottom-right warmth). */
export const clayShadowOut: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#B48C78',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
  },
  android: {
    elevation: 8,
    shadowColor: '#B48C78',
  },
  default: {
    shadowColor: '#B48C78',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
})!;

/** Stronger lift for primary CTAs and hero clay blocks. */
export const clayShadowLift: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#A87868',
    shadowOffset: { width: 8, height: 14 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
  },
  android: {
    elevation: 12,
    shadowColor: '#A87868',
  },
  default: {
    shadowColor: '#A87868',
    shadowOffset: { width: 8, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
  },
})!;

/** Soft pressed / inset clay feel. */
export const clayShadowInset: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#C9A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  android: {
    elevation: 2,
  },
  default: {
    shadowColor: '#C9A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
})!;

export type ClayTone = 'default' | 'warm' | 'cool' | 'brand' | 'accent' | 'premium';

export const clayToneFill: Record<ClayTone, string> = {
  default: clayColors.surface,
  warm: clayColors.surfaceWarm,
  cool: clayColors.surfaceCool,
  brand: clayColors.surfaceBrand,
  accent: clayColors.surfaceAccent,
  premium: clayColors.surfacePremium,
};

/** Base clay surface style — compose with padding/layout in components. */
export function claySurface(tone: ClayTone = 'default', plump: 'md' | 'lg' | 'xl' = 'lg'): ViewStyle {
  return {
    backgroundColor: clayToneFill[tone],
    borderRadius: plump === 'xl' ? radii.clayXl : plump === 'lg' ? radii.clay : radii.lg,
    borderWidth: 2.5,
    borderTopColor: tone === 'premium' ? 'rgba(255,255,255,0.18)' : clayColors.rim,
    borderLeftColor: tone === 'premium' ? 'rgba(255,255,255,0.14)' : clayColors.rim,
    borderRightColor: tone === 'premium' ? 'rgba(0,0,0,0.25)' : clayColors.shade,
    borderBottomColor: tone === 'premium' ? 'rgba(0,0,0,0.35)' : clayColors.shadeDeep,
    ...clayShadowOut,
  };
}

export const clayPressable: ViewStyle = {
  transform: [{ scale: 0.985 }],
  opacity: 0.96,
};
