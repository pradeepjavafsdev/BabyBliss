export type AuthStackParamList = {
  Welcome: undefined;
  AddBaby: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Memories: undefined;
  Milestones: undefined;
  Reminders: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  AddMemory: undefined;
  MemoryDetail: { id: string };
  AddReminder: undefined;
  ShareMemory: { id: string };
  Family: undefined;
  Export: undefined;
  PremiumInsights: undefined;
  Analytics: undefined;
  Profile: undefined;
};
