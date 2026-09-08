import { ImageSourcePropType } from 'react-native';

/**
 * Page-intent mascots for BabyBliss clay UI.
 * Pick the intent that matches the screen purpose (like the Dribbble clay kids apps).
 */
export type MascotIntent =
  | 'welcome'
  | 'home'
  | 'memories'
  | 'milestones'
  | 'reminders'
  | 'family'
  | 'export'
  | 'premium'
  | 'analytics'
  | 'profile'
  | 'share'
  | 'onboarding'
  | 'more';

export const MASCOT_SOURCES: Record<MascotIntent, ImageSourcePropType> = {
  welcome: require('../../../assets/mascots/welcome.png'),
  home: require('../../../assets/mascots/home.png'),
  memories: require('../../../assets/mascots/memories.png'),
  milestones: require('../../../assets/mascots/milestones.png'),
  reminders: require('../../../assets/mascots/reminders.png'),
  family: require('../../../assets/mascots/family.png'),
  export: require('../../../assets/mascots/export.png'),
  premium: require('../../../assets/mascots/premium.png'),
  analytics: require('../../../assets/mascots/analytics.png'),
  profile: require('../../../assets/mascots/profile.png'),
  share: require('../../../assets/mascots/share.png'),
  onboarding: require('../../../assets/mascots/onboarding.png'),
  more: require('../../../assets/mascots/more.png'),
};

export const MASCOT_LABELS: Record<MascotIntent, string> = {
  welcome: 'Welcoming baby',
  home: 'Curious reading baby',
  memories: 'Camera baby',
  milestones: 'Celebrating baby',
  reminders: 'Clock baby',
  family: 'Love baby',
  export: 'Storybook baby',
  premium: 'Sparkle baby',
  analytics: 'Chart baby',
  profile: 'Portrait baby',
  share: 'Sharing baby',
  onboarding: 'Newborn peek baby',
  more: 'Playful toys baby',
};
