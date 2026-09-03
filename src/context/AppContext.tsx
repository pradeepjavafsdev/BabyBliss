import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState,
  Baby,
  FamilyMember,
  Memory,
  MilestoneAchievement,
  MilestoneDefinition,
  Reminder,
  User,
} from '../types';
import {
  DEMO_ACHIEVEMENTS,
  DEMO_BABY,
  DEMO_FAMILY,
  DEMO_MEMORIES,
  DEMO_REMINDERS,
  DEMO_USER,
  PREDEFINED_MILESTONES,
} from '../data/demo';
import { clearPersistedState, loadPersistedState, persistState } from '../services/storage';
import { createId } from '../utils/date';

interface AppContextValue extends AppState {
  signIn: (email: string, name?: string) => void;
  signOut: () => Promise<void>;
  completeOnboarding: (baby: Baby) => void;
  updateBaby: (patch: Partial<Baby>) => void;
  setPremium: (value: boolean) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'babyId'>) => Memory;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  addCustomMilestone: (milestone: Omit<MilestoneDefinition, 'id' | 'isCustom'>) => void;
  completeMilestone: (payload: Omit<MilestoneAchievement, 'id' | 'babyId'>) => void;
  uncompleteMilestone: (milestoneId: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'babyId' | 'completed'>) => void;
  updateReminder: (id: string, patch: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;
  snoozeReminder: (id: string, untilIso: string) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeFamilyMember: (id: string) => void;
  loadDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  user: null,
  baby: null,
  memories: [],
  milestones: PREDEFINED_MILESTONES,
  achievements: [],
  reminders: [],
  family: [],
  growth: [],
  onboardingComplete: false,
  hydrated: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    (async () => {
      const saved = await loadPersistedState();
      if (saved) {
        setState((s) => ({
          ...s,
          ...saved,
          milestones: saved.milestones?.length ? saved.milestones : PREDEFINED_MILESTONES,
          hydrated: true,
        }));
      } else {
        setState((s) => ({ ...s, hydrated: true }));
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    void persistState(state);
  }, [state]);

  const signIn = useCallback((email: string, name = 'Parent') => {
    setState((s) => ({
      ...s,
      user: {
        id: createId('user'),
        name,
        email,
        isPremium: false,
        createdAt: new Date().toISOString(),
      },
    }));
  }, []);

  const signOut = useCallback(async () => {
    await clearPersistedState();
    setState({ ...initialState, hydrated: true });
  }, []);

  const completeOnboarding = useCallback((baby: Baby) => {
    setState((s) => ({
      ...s,
      baby,
      onboardingComplete: true,
    }));
  }, []);

  const updateBaby = useCallback((patch: Partial<Baby>) => {
    setState((s) => (s.baby ? { ...s, baby: { ...s.baby, ...patch } } : s));
  }, []);

  const setPremium = useCallback((value: boolean) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, isPremium: value } } : s));
  }, []);

  const addMemory = useCallback(
    (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'babyId'>) => {
      const now = new Date().toISOString();
      const created: Memory = {
        ...memory,
        id: createId('mem'),
        babyId: state.baby?.id ?? 'baby_unknown',
        createdAt: now,
        updatedAt: now,
      };
      setState((s) => ({ ...s, memories: [created, ...s.memories] }));
      return created;
    },
    [state.baby?.id]
  );

  const updateMemory = useCallback((id: string, patch: Partial<Memory>) => {
    setState((s) => ({
      ...s,
      memories: s.memories.map((m) =>
        m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m
      ),
    }));
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setState((s) => ({ ...s, memories: s.memories.filter((m) => m.id !== id) }));
  }, []);

  const addCustomMilestone = useCallback(
    (milestone: Omit<MilestoneDefinition, 'id' | 'isCustom'>) => {
      setState((s) => ({
        ...s,
        milestones: [
          ...s.milestones,
          { ...milestone, id: createId('ms'), isCustom: true, category: 'custom' },
        ],
      }));
    },
    []
  );

  const completeMilestone = useCallback(
    (payload: Omit<MilestoneAchievement, 'id' | 'babyId'>) => {
      setState((s) => ({
        ...s,
        achievements: [
          {
            ...payload,
            id: createId('ach'),
            babyId: s.baby?.id ?? 'baby_unknown',
          },
          ...s.achievements.filter((a) => a.milestoneId !== payload.milestoneId),
        ],
      }));
    },
    []
  );

  const uncompleteMilestone = useCallback((milestoneId: string) => {
    setState((s) => ({
      ...s,
      achievements: s.achievements.filter((a) => a.milestoneId !== milestoneId),
    }));
  }, []);

  const addReminder = useCallback(
    (reminder: Omit<Reminder, 'id' | 'babyId' | 'completed'>) => {
      setState((s) => ({
        ...s,
        reminders: [
          {
            ...reminder,
            id: createId('rem'),
            babyId: s.baby?.id ?? 'baby_unknown',
            completed: false,
          },
          ...s.reminders,
        ],
      }));
    },
    []
  );

  const updateReminder = useCallback((id: string, patch: Partial<Reminder>) => {
    setState((s) => ({
      ...s,
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setState((s) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) }));
  }, []);

  const toggleReminderComplete = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      reminders: s.reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      ),
    }));
  }, []);

  const snoozeReminder = useCallback((id: string, untilIso: string) => {
    setState((s) => ({
      ...s,
      reminders: s.reminders.map((r) =>
        r.id === id ? { ...r, snoozedUntil: untilIso, scheduledAt: untilIso } : r
      ),
    }));
  }, []);

  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    setState((s) => ({
      ...s,
      family: [...s.family, { ...member, id: createId('fam') }],
    }));
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setState((s) => ({ ...s, family: s.family.filter((f) => f.id !== id) }));
  }, []);

  const loadDemoData = useCallback(() => {
    setState({
      user: DEMO_USER,
      baby: DEMO_BABY,
      memories: DEMO_MEMORIES,
      milestones: PREDEFINED_MILESTONES,
      achievements: DEMO_ACHIEVEMENTS,
      reminders: DEMO_REMINDERS,
      family: DEMO_FAMILY,
      growth: [
        {
          id: 'g1',
          babyId: DEMO_BABY.id,
          date: DEMO_BABY.birthDate,
          weightKg: 3.4,
          heightCm: 50,
        },
        {
          id: 'g2',
          babyId: DEMO_BABY.id,
          date: new Date().toISOString(),
          weightKg: DEMO_BABY.weightKg ?? 7.8,
          heightCm: DEMO_BABY.heightCm ?? 68,
        },
      ],
      onboardingComplete: true,
      hydrated: true,
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      completeOnboarding,
      updateBaby,
      setPremium,
      addMemory,
      updateMemory,
      deleteMemory,
      addCustomMilestone,
      completeMilestone,
      uncompleteMilestone,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminderComplete,
      snoozeReminder,
      addFamilyMember,
      removeFamilyMember,
      loadDemoData,
    }),
    [
      state,
      signIn,
      signOut,
      completeOnboarding,
      updateBaby,
      setPremium,
      addMemory,
      updateMemory,
      deleteMemory,
      addCustomMilestone,
      completeMilestone,
      uncompleteMilestone,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminderComplete,
      snoozeReminder,
      addFamilyMember,
      removeFamilyMember,
      loadDemoData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// re-export for typing convenience
export type { User, Baby };
