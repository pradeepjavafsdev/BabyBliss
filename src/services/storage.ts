import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';
import {
  clearFirebaseState,
  isFirebaseConfigured,
  loadFirebaseState,
  persistFirebaseState,
} from './firebase';

const STORAGE_KEY = '@babybliss/state_v1';

export async function loadPersistedState(): Promise<Partial<AppState> | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Partial<AppState>;
  } catch {
    // fall through to cloud
  }

  if (isFirebaseConfigured()) {
    return loadFirebaseState();
  }
  return null;
}

export async function persistState(state: AppState): Promise<void> {
  const { hydrated: _h, ...rest } = state;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // keep going so cloud sync can still run
  }
  if (isFirebaseConfigured()) {
    void persistFirebaseState(state);
  }
}

export async function clearPersistedState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  if (isFirebaseConfigured()) {
    await clearFirebaseState();
  }
}
