# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Design system — Claymorphism (required)

BabyBliss UI is **claymorphism**. Keep this look on every existing and **new** screen.

## Recipe

1. **Pastel clay canvas** — soft peach/sage atmosphere (`gradients.hero` + `ClayAtmosphere`), never flat pure white alone.
2. **Plump surfaces** — use `ClaySurface` or `SoftCard` with `radii.clay` / `radii.clayXl`. No sharp cards or hairline dividers as primary containers.
3. **Dual lighting** — bright top/left rim + warm bottom/right shade + soft outer shadow (`clayShadowOut` / `clayShadowLift` from `src/theme/clay.ts`).
4. **Shared primitives** — restyle via `Button`, `Input`, `Chip`, `Screen`, `EmptyState`, `MemoryCard`, `ReminderRow`, `MilestoneRow`; do not invent flat bordered boxes.
5. **Tones** — `default | warm | cool | brand | accent | premium` on `ClaySurface` / `SoftCard`.
6. **Motion** — soft spring fade/scale via `FadeIn`; press scale via `clayPressable`.

## New page checklist

```tsx
import { Screen } from '../components/ui/Screen';
import { SoftCard } from '../components/ui/Motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ExampleScreen() {
  return (
    <Screen title="Title" subtitle="One short line">
      <SoftCard tone="warm">{/* content */}</SoftCard>
      <Button title="Primary action" onPress={() => {}} />
    </Screen>
  );
}
```

Tokens live in `src/theme/` (`colors`, `clay`, `spacing.radii`, `shadows`). Prefer composing theme helpers over one-off shadows.

**Do not change backend / service / context logic for visual-only work.**
