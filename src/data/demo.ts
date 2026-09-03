import { subDays, subMonths } from 'date-fns';
import {
  Baby,
  DailyInsight,
  FamilyMember,
  Memory,
  MilestoneAchievement,
  Reminder,
  User,
} from '../types';
import { PREDEFINED_MILESTONES } from './presets';
import { formatBabyAge } from '../utils/date';

const now = new Date();
const birth = subMonths(now, 7);

export const DEMO_USER: User = {
  id: 'user_demo',
  name: 'Alex Parent',
  email: 'alex@babybliss.app',
  phone: '+15550199',
  isPremium: false,
  createdAt: subMonths(now, 7).toISOString(),
};

export const DEMO_BABY: Baby = {
  id: 'baby_demo',
  name: 'Nova',
  birthDate: birth.toISOString(),
  gender: 'girl',
  photoUri: undefined,
  weightKg: 7.8,
  heightCm: 68,
};

export const DEMO_MEMORIES: Memory[] = [
  {
    id: 'mem_1',
    babyId: DEMO_BABY.id,
    title: 'Morning sunlight',
    note: 'Caught the softest yawn just as the light hit the crib.',
    mediaType: 'photo',
    tags: ['everyday', 'sleep'],
    location: 'Nursery',
    capturedAt: subDays(now, 1).toISOString(),
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    aiSummary: 'A quiet morning moment filled with warmth and rest.',
  },
  {
    id: 'mem_2',
    babyId: DEMO_BABY.id,
    title: 'First giggle storm',
    note: 'Uncle made the funniest face and Nova laughed until hiccups.',
    mediaType: 'photo',
    tags: ['funny', 'first_moment', 'family'],
    location: 'Living room',
    capturedAt: subDays(now, 5).toISOString(),
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 5).toISOString(),
  },
  {
    id: 'mem_3',
    babyId: DEMO_BABY.id,
    title: 'Park picnic',
    note: 'Tiny toes in the grass for the very first time.',
    mediaType: 'photo',
    tags: ['outdoors', 'milestone'],
    location: 'Riverside Park',
    capturedAt: subDays(now, 12).toISOString(),
    createdAt: subDays(now, 12).toISOString(),
    updatedAt: subDays(now, 12).toISOString(),
  },
  {
    id: 'mem_4',
    babyId: DEMO_BABY.id,
    title: 'Sitting tall',
    note: 'Held sitting position for almost a full minute — so proud.',
    mediaType: 'photo',
    tags: ['milestone', 'achievement'],
    capturedAt: subDays(now, 20).toISOString(),
    createdAt: subDays(now, 20).toISOString(),
    updatedAt: subDays(now, 20).toISOString(),
  },
];

export const DEMO_ACHIEVEMENTS: MilestoneAchievement[] = [
  {
    id: 'ach_1',
    milestoneId: 'phys_smile',
    babyId: DEMO_BABY.id,
    achievedAt: subMonths(now, 5).toISOString(),
    note: 'That first real smile melted everyone.',
  },
  {
    id: 'ach_2',
    milestoneId: 'soc_laugh',
    babyId: DEMO_BABY.id,
    achievedAt: subMonths(now, 3).toISOString(),
    note: 'Belly laughs during peek-a-boo.',
  },
  {
    id: 'ach_3',
    milestoneId: 'phys_sit',
    babyId: DEMO_BABY.id,
    achievedAt: subDays(now, 20).toISOString(),
    note: 'Sitting tall!',
    memoryId: 'mem_4',
  },
];

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem_1',
    babyId: DEMO_BABY.id,
    title: 'Pediatric checkup',
    type: 'doctor',
    notes: 'Bring growth chart printout',
    frequency: 'once',
    scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 30).toISOString(),
    completed: false,
  },
  {
    id: 'rem_2',
    babyId: DEMO_BABY.id,
    title: 'Vitamin D drops',
    type: 'medicine',
    frequency: 'daily',
    scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
    completed: false,
  },
  {
    id: 'rem_3',
    babyId: DEMO_BABY.id,
    title: 'Capture a golden-hour photo',
    type: 'photo',
    frequency: 'weekly',
    scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 30).toISOString(),
    completed: false,
  },
];

export const DEMO_FAMILY: FamilyMember[] = [
  {
    id: 'fam_1',
    name: 'Grandma Rose',
    email: 'rose@example.com',
    relationship: 'Grandmother',
    permission: 'comment',
    avatarColor: '#D4726A',
  },
  {
    id: 'fam_2',
    name: 'Uncle Sam',
    phone: '+15550123',
    relationship: 'Uncle',
    permission: 'view',
    avatarColor: '#4A9B8C',
  },
];

export function buildDailyInsight(baby: Baby): DailyInsight {
  const ageLabel = formatBabyAge(baby.birthDate);
  return {
    id: `insight_${new Date().toISOString().slice(0, 10)}`,
    date: new Date().toISOString(),
    babyAgeLabel: ageLabel,
    reflection: `At ${ageLabel}, ${baby.name} is discovering the world through touch, sound, and your voice. Today's quiet moments matter as much as the big firsts.`,
    tip: 'Narrate simple routines out loud — diaper changes, walks, mealtime. It builds language pathways and connection.',
    developmentalNote: 'Around this stage, many babies strengthen sitting balance and experiment with transferring toys between hands.',
    memoryHighlightIds: ['mem_2', 'mem_4'],
  };
}

export { PREDEFINED_MILESTONES };
