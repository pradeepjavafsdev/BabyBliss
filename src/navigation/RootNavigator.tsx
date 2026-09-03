import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { AddBabyScreen } from '../screens/onboarding/AddBabyScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { MemoriesScreen } from '../screens/memories/MemoriesScreen';
import { AddMemoryScreen } from '../screens/memories/AddMemoryScreen';
import { MemoryDetailScreen } from '../screens/memories/MemoryDetailScreen';
import { MilestonesScreen } from '../screens/milestones/MilestonesScreen';
import { RemindersScreen } from '../screens/reminders/RemindersScreen';
import { AddReminderScreen } from '../screens/reminders/AddReminderScreen';
import { ShareMemoryScreen } from '../screens/share/ShareMemoryScreen';
import { FamilyScreen } from '../screens/family/FamilyScreen';
import { ExportScreen } from '../screens/export/ExportScreen';
import { PremiumInsightsScreen } from '../screens/premium/PremiumInsightsScreen';
import { AnalyticsScreen } from '../screens/premium/AnalyticsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Screen } from '../components/ui/Screen';
import { SoftCard } from '../components/ui/Motion';
import { colors, fonts } from '../theme';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  dark: false,
  colors: {
    ...DarkTheme.colors,
    primary: colors.brand,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.line,
    notification: colors.brand,
  },
};

function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = [
    { title: 'Export memory book', route: 'Export' as const, icon: 'book-outline' as const },
    { title: 'Family circle', route: 'Family' as const, icon: 'people-outline' as const },
    { title: 'AI insights', route: 'PremiumInsights' as const, icon: 'sparkles-outline' as const },
    { title: 'Analytics', route: 'Analytics' as const, icon: 'stats-chart-outline' as const },
    { title: 'Profile & settings', route: 'Profile' as const, icon: 'person-outline' as const },
  ];
  return (
    <Screen title="More" subtitle="Sharing, keepsakes, and premium tools">
      <View style={{ gap: 10 }}>
        {items.map((item) => (
          <SoftCard key={item.route} onPress={() => navigation.navigate(item.route)}>
            <View style={styles.moreRow}>
              <Ionicons name={item.icon} size={20} color={colors.brandDeep} />
              <Text style={styles.moreText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </View>
          </SoftCard>
        ))}
      </View>
    </Screen>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brandDeep,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Memories: 'images',
            Milestones: 'flag',
            Reminders: 'alarm',
            More: 'grid',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Memories" component={MemoriesScreen} />
      <Tab.Screen name="Milestones" component={MilestonesScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="AddBaby" component={AddBabyScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="AddMemory" component={AddMemoryScreen} options={{ title: 'New memory', headerShown: false }} />
      <RootStack.Screen name="MemoryDetail" component={MemoryDetailScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="AddReminder" component={AddReminderScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="ShareMemory" component={ShareMemoryScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Family" component={FamilyScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Export" component={ExportScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="PremiumInsights" component={PremiumInsightsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
}

export function RootNavigator() {
  const { user, onboardingComplete, hydrated } = useApp();

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>BabyBliss</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user && onboardingComplete ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moreText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
  bootBrand: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    color: colors.brandDeep,
  },
});
