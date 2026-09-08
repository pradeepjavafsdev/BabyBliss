import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { clayShadowInset, clayShadowOut, colors, fonts, radii, spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkSoft,
    letterSpacing: 0.2,
    marginLeft: 4,
  },
  input: {
    minHeight: 54,
    borderRadius: radii.clay,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(150,110,90,0.28)',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md + 2,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    ...clayShadowOut,
  },
  inputFocused: {
    backgroundColor: colors.surfaceSoft,
    borderRightColor: 'rgba(224,122,110,0.35)',
    borderBottomColor: 'rgba(196,95,85,0.4)',
    ...clayShadowInset,
  },
  inputError: {
    borderRightColor: 'rgba(214,106,106,0.45)',
    borderBottomColor: 'rgba(180,70,70,0.5)',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.danger,
    marginLeft: 4,
  },
});
