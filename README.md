# BabyBliss

**Blissful Memories, Forever Treasured**

Cross-platform React Native (Expo) app for parents to capture, organize, and celebrate their newborn's journey — memories, milestones, reminders, family sharing, PDF keepsakes, and premium AI insights.

## Stack

- **Frontend**: React Native + Expo SDK 57, TypeScript, React Navigation
- **State**: React Context + AsyncStorage persistence
- **Backend-ready**: Firebase Auth / Firestore / Storage stubs
- **SMS invites**: Twilio via secure Cloud Function proxy (never embed Twilio secrets in the app)
- **PDF**: `expo-print` memory books
- **AI**: OpenAI / Vision-ready service stubs (`src/services/ai.ts`)

## Quick start

```bash
cd BabyBliss
npm install
npx expo start
```

Then open in Expo Go (iOS/Android) or press `w` for web.

### Demo mode

On the welcome screen tap **Explore demo** to load sample baby “Nova” with memories, milestones, reminders, and family members — no Firebase required.

## Features shipped

### Free tier
- Photo/video memory capture with tags, notes, location, timeline + gallery + search
- Predefined + custom milestones, age calculator, achievement calendar
- Reminders (vaccination, doctor, feeding, sleep, medicine, diaper, photo) with snooze
- Family invites via email/SMS (Twilio proxy) and permission levels
- PDF memory book export with free templates
- Dashboard: age, recent memories, upcoming milestones, next reminders

### Premium (demo toggle in Profile / AI screen)
- Daily AI thoughts, memory summarization, parenting assistant Q&A
- Analytics: memory density, tag themes, milestone timeline, growth entries
- Premium PDF magazine template gate

## Configure integrations

Copy `.env.example` to `.env` and fill values:

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase web config |
| `EXPO_PUBLIC_TWILIO_PROXY_URL` | Backend endpoint that sends SMS with Twilio |
| `EXPO_PUBLIC_AI_PROXY_URL` | Optional AI Cloud Function |

See `functions/twilioInvite.example.js` for a sample HTTPS Cloud Function.

## Project structure

```
src/
  theme/           # Brand colors, typography (Fraunces, DM Sans, Caveat)
  types/           # Domain models
  data/            # Milestone presets + demo seed
  context/         # App state & CRUD
  services/        # Firebase, Twilio, AI, PDF, storage
  components/      # UI primitives & feature rows
  screens/         # Auth, dashboard, memories, milestones, reminders, share, export, premium
  navigation/      # Tabs + stack
```

## Scripts

| Command | Description |
|---|---|
| `npm start` / `npx expo start` | Dev server |
| `npx tsc --noEmit` | Typecheck |
| `npm run android` / `ios` / `web` | Platform targets |

## Design notes

Warm peach–coral brand with seafoam accents, atmospheric gradients, and expressive typography. Brand name is a first-viewport hero signal on welcome and home.

## Roadmap hooks

Wire Firebase Auth + Firestore collections (`users`, `babies`, `memories`, `milestones`, `reminders`, `family`), FCM push for reminders, Google Vision / OpenAI proxies, Socket.io family feed, and multi-baby profiles when backend credentials are available.
