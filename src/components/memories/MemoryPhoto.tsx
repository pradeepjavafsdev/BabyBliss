import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '../../theme';

interface MemoryPhotoProps {
  uri?: string;
  title: string;
  style?: ViewStyle;
  letterSize?: number;
}

export function MemoryPhoto({ uri, title, style, letterSize = 32 }: MemoryPhotoProps) {
  const initial = title.slice(0, 1).toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, style]}
        contentFit="cover"
        transition={200}
        accessibilityLabel={title}
      />
    );
  }

  return (
    <LinearGradient colors={[...gradients.memory]} style={[styles.placeholder, style]}>
      <Text style={[styles.initial, { fontSize: letterSize }]}>{initial}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.brandSoft,
  },
  placeholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.displayBold,
    color: colors.white,
  },
});
