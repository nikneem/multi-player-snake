## Why

The app's current background is a flat dark color (`#0f0f23`). Adding a subtle, animated wireframe surface gives the game a sense of depth and visual polish befitting a modern multiplayer game, while staying unobtrusive so it never distracts from gameplay.

## What Changes

- Add a new full-viewport background Angular component that renders a Canvas-based animated wireframe mesh
- The mesh lines are drawn in a color slightly brighter than the background (`#0f0f23`)
- Mesh intersection vertices are rendered as bright glowing dots using the same hue family
- The surface deforms subtly over time using layered sine waves to simulate a slow, wavy undulation
- The component is placed behind all other content (fixed position, `z-index: -1`) and added globally in `app.html` so it persists across all routes

## Capabilities

### New Capabilities

- `wireframe-background`: A standalone Angular component (`snk-wireframe-background`) that renders an animated wireframe mesh on an HTML5 Canvas, covering the full viewport; includes color theming, glow effects, and subtle wave animation

### Modified Capabilities

<!-- none -->

## Impact

- `src/App/src/app/app.html` — add `<snk-wireframe-background>` as the first element, before `<router-outlet>`
- `src/App/src/app/app.ts` — import the new component
- New files: `src/App/src/app/wireframe-background/wireframe-background.ts`, `.html`, `.scss`
- No backend, API, or infrastructure changes
- No new npm dependencies (uses native Canvas API)
