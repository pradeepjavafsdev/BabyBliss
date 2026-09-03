import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = '@babybliss/state_v1';

export async function loadPersistedState(): Promise<Partial<AppState> | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

export async function persistState(state: AppState): Promise<void> {
  try {
    const { hydrated: _h, ...rest } = state;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // ignore persistence errors in demo
  }
}

export async function clearPersistedState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
