import { Platform, ViewStyle } from 'react-native';

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/** Claymorphism favors plump radii — prefer clay / clayXl for surfaces. */
export const radii = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 32,
  clay: 28,
  clayXl: 36,
  pill: 999,
} as const;

export const shadows = {
  soft: {
    shadowColor: '#B48C78',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  } satisfies ViewStyle,
  lift: {
    shadowColor: '#A87868',
    shadowOffset: { width: 6, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 9,
  } satisfies ViewStyle,
  clay: Platform.select({
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
  }) as ViewStyle,
};
