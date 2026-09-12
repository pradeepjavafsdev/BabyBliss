/**
 * Firebase client for BabyBliss (project babybliss-c1379).
 * Auth, Firestore, Realtime Database, and Storage initialize when env is present.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error RN persistence is exported from the React Native Firebase Auth bundle
  getReactNativePersistence,
  Auth,
  signInAnonymously,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database, ref, get, set, remove } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import type { Analytics } from 'firebase/analytics';
import { AppState } from '../types';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

const CLOUD_STATE_PATH = 'babybliss/app/state';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey) &&
  !firebaseConfig.apiKey.startsWith('YOUR_') &&
  Boolean(firebaseConfig.projectId) &&
  !firebaseConfig.projectId.startsWith('YOUR_');

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function initAuth(firebaseApp: FirebaseApp): Auth {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
    auth = initAuth(app);
    db = getFirestore(app);
    rtdb = firebaseConfig.databaseURL ? getDatabase(app) : null;
    storage = getStorage(app);

    if (Platform.OS === 'web') {
      void import('firebase/analytics')
        .then(async ({ getAnalytics, isSupported }) => {
          if (app && (await isSupported())) {
            analytics = getAnalytics(app);
          }
        })
        .catch(() => {
          // Analytics is optional and web-only.
        });
    }
  }
  return app;
}

export function getFirebaseAuth() {
  getFirebaseApp();
  return auth;
}

export function getFirebaseDb() {
  getFirebaseApp();
  return db;
}

export function getFirebaseDatabase() {
  getFirebaseApp();
  return rtdb;
}

export function getFirebaseStorage() {
  getFirebaseApp();
  return storage;
}

export function getFirebaseAnalytics() {
  getFirebaseApp();
  return analytics;
}

/** Anonymous session so Storage rules that require auth can succeed. */
export async function ensureFirebaseAuth() {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) return null;
  if (firebaseAuth.currentUser) return firebaseAuth.currentUser;
  try {
    const cred = await signInAnonymously(firebaseAuth);
    return cred.user;
  } catch (error) {
    console.warn(
      'Firebase anonymous sign-in failed. Enable Anonymous auth in Firebase Console → Authentication → Sign-in method.',
      error
    );
    return null;
  }
}

export async function loadFirebaseState(): Promise<Partial<AppState> | null> {
  const database = getFirebaseDatabase();
  if (!database) return null;
  try {
    const snap = await get(ref(database, CLOUD_STATE_PATH));
    if (!snap.exists()) return null;
    return snap.val() as Partial<AppState>;
  } catch (error) {
    console.warn('Firebase state load failed', error);
    return null;
  }
}

export async function persistFirebaseState(state: AppState): Promise<void> {
  const database = getFirebaseDatabase();
  if (!database) return;
  const { hydrated: _h, ...rest } = state;
  try {
    await set(ref(database, CLOUD_STATE_PATH), stripUndefined(rest));
  } catch (error) {
    console.warn('Firebase state save failed', error);
  }
}

export async function clearFirebaseState(): Promise<void> {
  const database = getFirebaseDatabase();
  if (!database) return;
  try {
    await remove(ref(database, CLOUD_STATE_PATH));
  } catch (error) {
    console.warn('Firebase state clear failed', error);
  }
}

getFirebaseApp();
