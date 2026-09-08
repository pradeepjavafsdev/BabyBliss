# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Design system — Claymorphism + baby mascots (required)

BabyBliss UI is **claymorphism** with an intent-matched **cartoon baby mascot** on every screen (Dribbble-style clay kids apps).

## Recipe

1. **Pastel clay canvas** — soft peach/sage atmosphere (`gradients.hero` + `ClayAtmosphere`), never flat pure white alone.
2. **Plump surfaces** — use `ClaySurface` or `SoftCard` with `radii.clay` / `radii.clayXl`. No sharp cards or hairline dividers as primary containers.
3. **Dual lighting** — bright top/left rim + warm bottom/right shade + soft outer shadow (`clayShadowOut` / `clayShadowLift` from `src/theme/clay.ts`).
4. **Shared primitives** — restyle via `Button`, `Input`, `Chip`, `Screen`, `EmptyState`, `MemoryCard`, `ReminderRow`, `MilestoneRow`; do not invent flat bordered boxes.
5. **Tones** — `default | warm | cool | brand | accent | premium` on `ClaySurface` / `SoftCard`.
6. **Motion** — soft spring fade/scale via `FadeIn`; press scale via `clayPressable`.
7. **Baby mascot by intent** — every screen must include a clay cartoon baby that matches the page purpose:
   - `welcome`, `onboarding`, `home`, `memories`, `milestones`, `reminders`
   - `family`, `export`, `premium`, `analytics`, `profile`, `share`, `more`
   - Use `Screen mascot="…"`, `MascotHero`, `MascotHeader`, `BabyMascot`, or `EmptyState mascot="…"`.
   - Assets live in `assets/mascots/` and map via `src/components/mascots/mascotAssets.ts`.

## New page checklist

```tsx
import { Screen } from '../components/ui/Screen';
import { SoftCard } from '../components/ui/Motion';
import { MascotHero } from '../components/mascots/MascotHero';
import { Button } from '../components/ui/Button';

export function ExampleScreen() {
  return (
    <Screen title="Title" subtitle="One short line" mascot="home">
      <MascotHero intent="home" tone="warm">
        {/* primary content — mascot sits on the clay card */}
      </MascotHero>
      <Button title="Primary action" onPress={() => {}} />
    </Screen>
  );
}
```

Tokens live in `src/theme/` (`colors`, `clay`, `spacing.radii`, `shadows`). Prefer composing theme helpers over one-off shadows.

**Do not change backend / service / context logic for visual-only work.**
