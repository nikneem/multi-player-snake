## Context

The Snake frontend is a fresh Angular 21 application. No game UI exists yet. The playfield is the first visual element — a 100 × 100 grid of equal-sized cells that will later host the snake, food, and collision feedback.

The challenge is rendering 10 000 cells efficiently and keeping the grid square and responsive across the full device spectrum: small phones (≥ 320 px wide) through large 4 K monitors. The grid must never overflow horizontally and cells must always be square.

## Goals / Non-Goals

**Goals:**
- Render a 100 × 100 cell grid as the central game board.
- Guarantee square cells at every viewport width.
- Scale the board to fill as much of the available viewport as possible without overflow.
- Centre the board both horizontally and vertically on large screens.
- Keep the component self-contained, performant, and ready to accept game-state bindings later.

**Non-Goals:**
- No snake, food, scoring, or game logic in this change.
- No animation, colour themes, or accessibility beyond basic visual structure.
- No server-side rendering or prerendering concerns.

## Decisions

### D1 — CSS Grid with `aspect-ratio` for square cells

**Decision**: Use a single CSS `display: grid` with `grid-template-columns: repeat(100, 1fr)` and enforce `aspect-ratio: 1` on each cell.

**Rationale**: `1fr` columns naturally distribute available width equally across 100 columns. Combining that with `aspect-ratio: 1` means cells grow and shrink together while always remaining square. No JavaScript is needed to recalculate cell sizes.

**Alternatives considered**:
- `<canvas>`: better raw performance for animation, but requires imperative drawing code; Angular component bindings become awkward. Deferring canvas until game-state rendering is needed.
- SVG grid: verbose markup, harder to style with CSS, no significant advantage for a static grid.
- Fixed `px` sizes with `transform: scale`: would work but ties sizing to a hard-coded base resolution.

### D2 — Container sizing with `min()` / `vmin`

**Decision**: The board's width is set to `min(100vw, 100vh, 90vmin)` (adjusted to leave a small margin), letting the shorter viewport dimension govern so the board is always fully visible without scrolling.

**Rationale**: `vmin` naturally adapts to both portrait (phones) and landscape (tablets, desktops) orientations. A small reduction (e.g. `90vmin`) leaves breathing room around the board edge.

**Alternatives considered**:
- Media-query step sizes: brittle, requires maintaining breakpoints.
- JavaScript resize observer: unnecessary complexity; pure CSS is sufficient and more performant.

### D3 — `*ngFor` over a pre-computed array in the component

**Decision**: The component pre-computes a flat array of 10 000 cell indices and uses Angular's `@for` with `track` to render them.

**Rationale**: Declarative template loops are idiomatic Angular. A flat array (rather than nested rows) paired with CSS Grid avoids nested DOM elements and keeps the component simple.

**Alternatives considered**:
- Nested `@for` (rows × columns): produces nested DOM; harder to address cells by flat index later.
- Virtual scrolling: overkill for a fixed-size grid; the entire board must always be visible.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| 10 000 DOM nodes may affect initial render performance on low-end devices | Cells are plain `<div>` elements with minimal CSS; no JS per cell; benchmark at implementation time and switch to `<canvas>` if needed |
| `aspect-ratio` CSS not supported in very old browsers | Property has >96 % global support (Can I Use); the game targets modern browsers only |
| Very small phones (< 320 px) may clip the board | `min()` sizing already adapts; add a `min-width` clamp if needed after visual testing |
