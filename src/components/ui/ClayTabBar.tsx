import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { clayPressable, clayShadowChip, clayShadowLift, colors, fonts, radii } from '../../theme';

const TAB_ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Home: { on: 'home', off: 'home-outline' },
  Memories: { on: 'images', off: 'images-outline' },
  Milestones: { on: 'flag', off: 'flag-outline' },
  Reminders: { on: 'alarm', off: 'alarm-outline' },
  More: { on: 'grid', off: 'grid-outline' },
};

/** Floating clay pill tab bar — dual lighting, plump active blob. */
export function ClayTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.lift}>
        <View style={styles.bar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 0.9 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? String(options.tabBarLabel)
                : options.title !== undefined
                  ? options.title
                  : route.name;
            const icons = TAB_ICONS[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={onPress}
                style={({ pressed }) => [styles.item, pressed && clayPressable]}
              >
                <View style={[styles.blob, focused && styles.blobActive]}>
                  <Ionicons
                    name={focused ? icons.on : icons.off}
                    size={focused ? 22 : 20}
                    color={focused ? colors.brandDeep : colors.muted}
                  />
                </View>
                <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  lift: {
    borderRadius: radii.clayXl,
    ...clayShadowLift,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.clayXl,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(180,140,120,0.22)',
    borderBottomColor: 'rgba(140,100,80,0.28)',
    paddingHorizontal: 6,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  blob: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobActive: {
    backgroundColor: colors.brandSoft,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(200,130,120,0.28)',
    borderBottomColor: 'rgba(180,110,100,0.32)',
    ...clayShadowChip,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.muted,
  },
  labelActive: {
    color: colors.brandDeep,
  },
});
