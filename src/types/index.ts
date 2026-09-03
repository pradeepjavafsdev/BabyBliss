export type Gender = 'girl' | 'boy' | 'other' | 'prefer_not';

export type MemoryTag =
  | 'milestone'
  | 'first_moment'
  | 'funny'
  | 'achievement'
  | 'everyday'
  | 'family'
  | 'sleep'
  | 'feeding'
  | 'outdoors'
  | 'custom';

export type MilestoneCategory = 'physical' | 'social' | 'cognitive' | 'language' | 'custom';

export type ReminderType =
  | 'vaccination'
  | 'doctor'
  | 'feeding'
  | 'sleep'
  | 'medicine'
  | 'diaper'
  | 'photo'
  | 'custom';

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'age_based';

export type SharePermission = 'view' | 'comment' | 'collaborate';

export type MediaType = 'photo' | 'video';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: Gender;
  photoUri?: string;
  weightKg?: number;
  heightCm?: number;
}

export interface Memory {
  id: string;
  babyId: string;
  title: string;
  note: string;
  mediaUri?: string;
  mediaType: MediaType;
  tags: MemoryTag[];
  location?: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  reactions?: MemoryReaction[];
  comments?: MemoryComment[];
}

export interface MemoryReaction {
  id: string;
  userId: string;
  userName: string;
  emoji: string;
  createdAt: string;
}

export interface MemoryComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  typicalAgeMonths: number;
  isCustom?: boolean;
}

export interface MilestoneAchievement {
  id: string;
  milestoneId: string;
  babyId: string;
  achievedAt: string;
  note?: string;
  photoUri?: string;
  memoryId?: string;
}

export interface Reminder {
  id: string;
  babyId: string;
  title: string;
  type: ReminderType;
  notes?: string;
  frequency: ReminderFrequency;
  scheduledAt: string;
  completed: boolean;
  snoozedUntil?: string;
  ageMonthsTrigger?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  relationship: string;
  permission: SharePermission;
  avatarColor: string;
}

export interface ShareLink {
  id: string;
  memoryIds: string[];
  permission: SharePermission;
  isPublic: boolean;
  expiresAt?: string;
  url: string;
  createdAt: string;
}

export interface DailyInsight {
  id: string;
  date: string;
  babyAgeLabel: string;
  reflection: string;
  tip: string;
  developmentalNote: string;
  memoryHighlightIds: string[];
}

export interface GrowthEntry {
  id: string;
  babyId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  headCm?: number;
}

export type PdfTemplateId = 'classic' | 'soft_bloom' | 'timeline' | 'magazine';

export interface AppState {
  user: User | null;
  baby: Baby | null;
  memories: Memory[];
  milestones: MilestoneDefinition[];
  achievements: MilestoneAchievement[];
  reminders: Reminder[];
  family: FamilyMember[];
  growth: GrowthEntry[];
  onboardingComplete: boolean;
  hydrated: boolean;
}
