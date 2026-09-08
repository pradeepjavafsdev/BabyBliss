# BabyBliss Claymorphism Design System

This app uses a **claymorphism** visual language: soft, puffy, pastel surfaces with dual lighting (highlight + warm drop shadow), plus **intent-matched clay baby mascots** on every screen.

## Core building blocks

| Piece | Path | Use for |
| --- | --- | --- |
| Tokens | `src/theme/clay.ts`, `colors.ts`, `spacing.ts` | fills, radii, shadows |
| `ClaySurface` | `src/components/ui/ClaySurface.tsx` | plump containers + atmosphere blobs |
| `SoftCard` | `src/components/ui/Motion.tsx` | pressable clay cards (alias of ClaySurface) |
| `Screen` | `src/components/ui/Screen.tsx` | page shell with clay canvas + optional header mascot |
| `BabyMascot` / `MascotHero` / `MascotHeader` | `src/components/mascots/*` | cartoon babies by page intent |
| Mascot PNGs | `assets/mascots/*.png` | welcome, home, memories, milestones, … |
| `Button` / `Input` / `Chip` | `src/components/ui/*` | interactive clay controls |

## Mascot intents

Pick the character that matches the screen job (characters sit on / beside clay cards, like the Dribbble clay kids-app reference):

| Intent | Use on |
| --- | --- |
| `welcome` | Welcome / sign-in |
| `onboarding` | Add baby flow |
| `home` | Dashboard hero |
| `memories` | Memories list / add / detail |
| `milestones` | Milestones |
| `reminders` | Reminders |
| `family` | Family circle |
| `export` | Memory book export |
| `premium` | AI insights |
| `analytics` | Analytics |
| `profile` | Profile |
| `share` | Share memory |
| `more` | More menu |

## Rules for future screens

1. Wrap pages in `Screen` with a `mascot` prop (or the same gradient + `ClayAtmosphere` pattern used by tab screens + `MascotHeader`).
2. Put hero content in `MascotHero` / `SoftCard` / `ClaySurface` — pick a `tone`.
3. Use shared `Button`, `Input`, `Chip` — do not create flat bordered controls.
4. Prefer `radii.clay` / `radii.clayXl` and `clayShadowOut` for custom elements.
5. Keep coral/peach + sage pastels; avoid purple-glass / stark dashboard looks.
6. UI-only changes must not touch `src/services/*`, `src/context/*`, or Firebase/Twilio logic.

## Tones

- `default` — cream surface
- `warm` — peach clay
- `cool` / `accent` — sage clay
- `brand` — coral clay
- `premium` — deep ink clay for upsell
