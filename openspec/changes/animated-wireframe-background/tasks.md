## 1. Component Scaffold

- [x] 1.1 Create directory `src/App/src/app/wireframe-background/`
- [x] 1.2 Create `wireframe-background.ts` — standalone Angular component (`snk-wireframe-background`), `OnPush`, imports nothing, has `ElementRef` / `AfterViewInit` / `OnDestroy`
- [x] 1.3 Create `wireframe-background.html` — single `<canvas #canvas>` element
- [x] 1.4 Create `wireframe-background.scss` — host styles: `display: block; position: fixed; inset: 0; z-index: -1; pointer-events: none`

## 2. Canvas Sizing

- [x] 2.1 In `ngAfterViewInit`, set `canvas.width` and `canvas.height` to `window.innerWidth` / `window.innerHeight`
- [x] 2.2 Add a `resize` event listener on `window` that updates canvas dimensions and triggers a grid rebuild
- [x] 2.3 Remove the `resize` listener in `ngOnDestroy`

## 3. Grid & Wave Math

- [x] 3.1 Implement a `buildGrid(cols, rows)` helper that returns a 2D array of base `{x, y}` vertex positions spaced ~80px apart, covering the canvas
- [x] 3.2 Implement a `getDisplacement(bx, by, t)` function returning a y-offset: `A₁·sin(bx·f₁ + by·f₂ + t·s₁) + A₂·sin(bx·f₃ - by·f₄ + t·s₂)` with amplitude ~18px

## 4. Canvas Rendering

- [x] 4.1 Implement `drawFrame(t)` that clears the canvas each frame
- [x] 4.2 Draw horizontal grid lines: for each row, connect adjacent displaced vertices with `strokeStyle = 'rgba(40, 40, 80, 0.6)'`, `lineWidth = 1`
- [x] 4.3 Draw vertical grid lines: for each column, connect adjacent displaced vertices with the same style
- [x] 4.4 Draw vertex dots: for each intersection, set `shadowBlur = 12`, `shadowColor = 'rgba(100, 100, 255, 0.9)'`, fill a circle of radius 2 with `fillStyle = 'rgba(120, 120, 220, 1)'`
- [x] 4.5 Reset `shadowBlur = 0` after drawing dots so it doesn't affect lines

## 5. Animation Loop

- [x] 5.1 Start a `requestAnimationFrame` loop in `ngAfterViewInit` that calls `drawFrame(t)` with a time value (e.g., `performance.now() / 1000`)
- [x] 5.2 Store the rAF frame ID; cancel it in `ngOnDestroy`
- [x] 5.3 Add a `visibilitychange` listener: cancel rAF when tab is hidden, restart when visible
- [x] 5.4 Remove the `visibilitychange` listener in `ngOnDestroy`

## 6. App Integration

- [x] 6.1 Import `WireframeBackground` in `app.ts` and add it to the `imports` array
- [x] 6.2 Add `<snk-wireframe-background />` as the first element in `app.html`, before `<router-outlet />`

## 7. Verification

- [x] 7.1 Run `npm start` and confirm the animated wireframe background is visible behind the game UI
- [x] 7.2 Resize the browser window and confirm the canvas fills the new viewport without gaps
- [x] 7.3 Switch to another tab and back; confirm animation pauses and resumes
- [x] 7.4 Run `npm test` and confirm no existing tests are broken
