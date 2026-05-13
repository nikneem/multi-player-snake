## Why

The game currently has no visual playing area. Players need a rendered playfield before any game logic or multiplayer features can be built on top of it. Delivering the playfield now establishes the visual foundation for the entire application.

## What Changes

- Add a `PlayfieldComponent` that renders a 100 × 100 cell grid.
- The grid must be fully responsive: it fills the available viewport on all screen sizes without overflowing, with cells that remain square at all times.
- On mobile devices the playfield scales down gracefully so the entire grid is visible without horizontal scrolling.
- On desktop/large screens the playfield expands to make good use of the available space while staying visually clean.
- The playfield is the primary content of the app shell and will serve as the canvas for snake movement, food, and collision rendering in subsequent changes.

## Capabilities

### New Capabilities

- `playfield`: Responsive 100 × 100 cell grid component that renders the snake game board, scales to fit any screen size while keeping cells square, and provides a clean visual surface ready for game-state rendering.

### Modified Capabilities

_(none — this is the first visual feature)_

## Impact

- **Angular frontend** (`src/App/`): new standalone `PlayfieldComponent` added; `AppComponent` updated to host it.
- **Styles**: global or component SCSS updated to support the responsive grid layout.
- **No backend changes** required for this change.
