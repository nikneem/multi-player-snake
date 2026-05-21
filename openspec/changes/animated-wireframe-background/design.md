## Context

The app background is a solid dark navy (`#0f0f23`) set globally in `styles.scss`. No visual decoration or depth exists beyond this flat color. The goal is to add a continuously-animated, full-viewport wireframe mesh that sits behind all UI content, enhancing visual polish without impeding gameplay.

The Angular app is structured as standalone components; the root component (`snk-root` in `app.ts`/`app.html`) renders a `<router-outlet>`. Adding the background at this level ensures it appears on every route.

## Goals / Non-Goals

**Goals:**
- Render a 3D-perspective wireframe grid on an HTML5 Canvas, viewed slightly from above
- Animate vertices with layered sine waves to create a slow, undulating wave effect
- Color lines slightly brighter than the background (`#0f0f23` → ~`#1c1c3a`)
- Render intersection vertices as bright, glowing dots (same hue, high-brightness with CSS/Canvas shadow blur)
- Resize the canvas automatically when the viewport changes
- Pause animation when the tab is hidden (using `document.visibilitychange`)
- Use Angular `OnPush` change detection; no Angular state needed (canvas is imperative)

**Non-Goals:**
- 3D perspective projection (a flat top-down or slight-angle grid is sufficient)
- WebGL or Three.js (native Canvas 2D API only — zero dependencies)
- User interaction (mouse parallax, click effects)
- Per-route variations of the background

## Decisions

### D1 — Canvas 2D vs WebGL vs CSS

**Decision**: HTML5 Canvas 2D API.

**Rationale**: No new npm dependencies. A flat, animated 2D sine-wave grid is well within Canvas 2D performance limits at 60 fps. WebGL/Three.js would be overkill for a subtle decorative element and would increase bundle size. Pure CSS animations cannot draw arbitrary mesh topology.

### D2 — Component placement in `app.html`

**Decision**: Add `<snk-wireframe-background>` as the first child inside `snk-root`, before `<router-outlet>`. Style it with `position: fixed; inset: 0; z-index: -1`.

**Rationale**: Fixed positioning removes the element from document flow so it never affects layout. Placing it at the app root ensures it persists across route changes without remounting.

### D3 — Animation loop management

**Decision**: Use `requestAnimationFrame` (rAF) with a stored frame ID. Start in `ngAfterViewInit`, cancel in `ngOnDestroy`. Pause when `document.visibilityState === 'hidden'`.

**Rationale**: rAF is the standard, battery-efficient way to drive Canvas animations. Cancelling in `ngOnDestroy` prevents memory leaks during testing or if the component is ever conditionally removed.

### D4 — Wave algorithm

**Decision**: Displace each grid vertex vertically using the sum of two sine waves with different frequencies and phases, both progressing with time:  
`z = A₁·sin(x·f₁ + y·f₂ + t·speed₁) + A₂·sin(x·f₃ - y·f₄ + t·speed₂)`  
Project the result as a simple y-offset (no true perspective) for a top-down wavy surface look.

**Rationale**: Two overlapping waves with slightly different frequencies create organic, non-repeating motion. A single wave looks mechanical. The top-down projection keeps the implementation trivial and readable.

### D5 — Color palette

**Decision**: Derive colors programmatically from the background base `#0f0f23`:
- **Grid lines**: `rgba(40, 40, 80, 0.6)` — subtly brighter than background
- **Vertex dots**: `rgba(120, 120, 220, 1)` — same blue-purple hue, high brightness
- **Vertex glow**: Canvas `shadowBlur = 12`, `shadowColor = rgba(100, 100, 255, 0.9)`

**Alternative considered**: CSS custom properties for theming. Rejected for now — the component is self-contained and the palette is tightly coupled to the one global background color.

## Risks / Trade-offs

- **[Risk] Performance on low-end devices** → A dense grid at 60 fps may cause frame drops on very low-end hardware. _Mitigation_: Default grid spacing of ~80px keeps vertex count under 200 for any viewport; reduce grid density if perf issues are reported.
- **[Risk] Canvas resize flicker** → Resizing a Canvas element clears its bitmap. _Mitigation_: Redraw is immediate on the next rAF frame; the gap is imperceptible.
- **[Trade-off] No true 3D perspective** → The surface appears flat/top-down rather than receding to a horizon. Acceptable for a subtle background; true perspective adds significant complexity.
