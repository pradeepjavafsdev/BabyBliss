# BabyBliss Claymorphism Design System

This app uses a **claymorphism** visual language: soft, puffy, pastel surfaces with dual lighting (highlight + warm drop shadow).

## Core building blocks

| Piece | Path | Use for |
| --- | --- | --- |
| Tokens | `src/theme/clay.ts`, `colors.ts`, `spacing.ts` | fills, radii, shadows |
| `ClaySurface` | `src/components/ui/ClaySurface.tsx` | plump containers + atmosphere blobs |
| `SoftCard` | `src/components/ui/Motion.tsx` | pressable clay cards (alias of ClaySurface) |
| `Screen` | `src/components/ui/Screen.tsx` | page shell with clay canvas |
| `Button` / `Input` / `Chip` | `src/components/ui/*` | interactive clay controls |

## Rules for future screens

1. Wrap pages in `Screen` (or the same gradient + `ClayAtmosphere` pattern used by tab screens).
2. Put content blocks in `SoftCard` / `ClaySurface` — pick a `tone`.
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
