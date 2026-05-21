## ADDED Requirements

### Requirement: Full-viewport canvas background
The `snk-wireframe-background` component SHALL render an HTML5 Canvas element that covers the entire viewport at all times, positioned fixed behind all other content (`position: fixed; inset: 0; z-index: -1`).

#### Scenario: Canvas fills viewport on load
- **WHEN** the app initialises
- **THEN** the canvas element SHALL have a width and height matching the viewport dimensions in CSS pixels

#### Scenario: Canvas resizes with viewport
- **WHEN** the browser viewport is resized
- **THEN** the canvas SHALL update its width and height to match the new viewport dimensions within one animation frame

### Requirement: Wireframe grid rendered on canvas
The component SHALL draw a regular grid of vertices connected by horizontal and vertical line segments. Grid spacing SHALL be approximately 80 CSS pixels.

#### Scenario: Grid lines are drawn
- **WHEN** the canvas is rendered
- **THEN** horizontal and vertical line segments connecting adjacent vertices SHALL be visible across the full canvas

#### Scenario: Grid line color is subtly brighter than background
- **WHEN** the canvas is rendered
- **THEN** the grid lines SHALL be drawn in a color that is noticeably brighter than `#0f0f23` but still very dark (e.g., `rgba(40, 40, 80, 0.6)`) so they do not compete with foreground content

### Requirement: Glowing vertex dots at grid intersections
The component SHALL render a filled circle at every grid intersection point. Each dot SHALL use a bright color within the same blue-purple hue family as the background, with a Canvas shadow blur applied to create a glow effect.

#### Scenario: Dots are visible at intersections
- **WHEN** the canvas is rendered
- **THEN** small filled circles SHALL appear at every grid vertex position

#### Scenario: Dots have a visible glow
- **WHEN** the canvas is rendered
- **THEN** each dot SHALL have a blur/glow halo (Canvas `shadowBlur ≥ 8`) making it appear to emit light against the dark background

### Requirement: Subtle wave animation
The grid vertices SHALL be displaced vertically (y-axis) using at least two layered sine waves that progress over time, creating a slow, continuous undulation across the surface. The animation SHALL run at the display's native refresh rate using `requestAnimationFrame`.

#### Scenario: Surface appears to wave
- **WHEN** the component is rendered for more than one second
- **THEN** the grid vertices SHALL have visibly shifted positions compared to their initial state, producing a wave-like motion

#### Scenario: Animation speed is subtle
- **WHEN** the component is rendering
- **THEN** the wave motion SHALL be slow enough that it does not distract from foreground UI (full wave cycle SHALL take at least 4 seconds)

#### Scenario: Two independent wave layers produce organic motion
- **WHEN** the animation is running
- **THEN** the displacement of each vertex SHALL be the sum of at least two sine functions with different frequencies and time offsets, so the motion does not appear mechanically repetitive

### Requirement: Animation pauses when tab is hidden
The component SHALL pause the `requestAnimationFrame` loop when the browser tab is hidden and resume it when the tab becomes visible again.

#### Scenario: Animation pauses on tab hide
- **WHEN** `document.visibilityState` changes to `'hidden'`
- **THEN** the rAF loop SHALL be cancelled and no further Canvas draw calls SHALL occur

#### Scenario: Animation resumes on tab show
- **WHEN** `document.visibilityState` changes to `'visible'`
- **THEN** the rAF loop SHALL restart and the animation SHALL continue from its current time offset

### Requirement: No memory leaks on component destroy
The component SHALL cancel the `requestAnimationFrame` loop and remove all event listeners when it is destroyed.

#### Scenario: Cleanup on destroy
- **WHEN** the `snk-wireframe-background` component is destroyed (e.g., in tests)
- **THEN** the rAF loop SHALL be cancelled and `resize` / `visibilitychange` listeners SHALL be removed

### Requirement: Component integrated at app root
The `snk-wireframe-background` component SHALL be rendered as the first child of `snk-root` (in `app.html`) so it appears behind all routed content on every page.

#### Scenario: Background visible on all routes
- **WHEN** the user navigates between routes
- **THEN** the wireframe background SHALL remain continuously visible without remounting
