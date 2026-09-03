import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  displayLight: 'Fraunces_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  handwritten: 'Caveat_500Medium',
  handwrittenBold: 'Caveat_700Bold',
} as const;

export const typography = {
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.8,
    color: colors.ink,
  } satisfies TextStyle,
  hero: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: colors.ink,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.ink,
  } satisfies TextStyle,
  section: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  } satisfies TextStyle,
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
  } satisfies TextStyle,
  handwritten: {
    fontFamily: fonts.handwritten,
    fontSize: 22,
    lineHeight: 28,
    color: colors.inkSoft,
  } satisfies TextStyle,
  button: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  } satisfies TextStyle,
};
