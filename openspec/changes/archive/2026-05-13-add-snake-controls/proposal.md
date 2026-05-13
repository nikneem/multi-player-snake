## Why

The playfield exists but nothing moves on it. Adding a controllable snake is the core mechanic of the game — without it there is no game. Keyboard controls serve desktop players; swipe gestures serve mobile players, which are a primary target given the responsive playfield already built.

## What Changes

- Add a `SnakeService` that owns the snake's state: position (array of `[col, row]` segments), current direction, and a game-tick loop.
- Add an `InputService` (or equivalent) that translates keyboard `ArrowUp/Down/Left/Right` events and touch swipe gestures into direction changes fed to the snake.
- Update `PlayfieldComponent` to visually render snake segments by applying a CSS class to the corresponding cells.
- The snake starts at a fixed position, moves one cell per tick in its current direction, and wraps around the board edges (classic Snake behaviour — no wall death in this change).
- No food, scoring, collision death, or multiplayer in this change.

## Capabilities

### New Capabilities

- `snake-movement`: Core snake state and autonomous tick-based movement across the 100 × 100 grid, including edge wrapping.
- `snake-input`: Keyboard arrow-key and mobile touch-swipe direction control that feeds into snake movement.

### Modified Capabilities

- `playfield`: The playfield must now render snake segments on top of the grid. Cells occupied by the snake head or body SHALL receive distinct visual styling.

## Impact

- **Angular frontend** (`src/App/`): new `SnakeService`, new `InputService` (or directive), updated `PlayfieldComponent` template and styles.
- **No backend changes** required for this change.
- **No new npm dependencies** anticipated (native browser APIs for keyboard/touch events are sufficient).
