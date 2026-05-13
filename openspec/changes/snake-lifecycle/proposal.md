## Why

The snake currently moves forever with no failure state. Players need a win/lose mechanic — the snake should die when it collides with its own body or the playfield boundary, and the game should automatically reset so play can continue without a page refresh.

## What Changes

- The snake dies when its head enters a cell already occupied by any body segment (self-collision).
- The snake dies when its head moves outside the 100 × 100 grid boundary (wall collision), replacing the current wrapping behaviour.
- On death, a brief visual death state is shown (the snake is highlighted red for ~600 ms).
- After the death pause, the game resets: the snake returns to its initial 5-segment position, a new food item spawns, and the tick loop resumes.

## Capabilities

### New Capabilities

- `snake-collision`: Detects head-vs-body and head-vs-wall collisions each tick; triggers the death sequence when either condition is met.
- `game-reset`: Clears the current game state and reinitialises the snake and food after the death animation completes.

### Modified Capabilities

- `snake-movement`: Wall wrapping is replaced by wall-death. The tick logic changes from `% 100` wrapping to an out-of-bounds check.

## Impact

- **`SnakeService`** (`src/app/snake.ts`): add `gameState` signal (`'playing' | 'dead'`); add collision detection in `tick()`; add `resetGame()` method; remove edge wrapping, add wall-death.
- **`PlayfieldComponent`** (`src/app/playfield/playfield.ts`): read `gameState` signal; expose it to template for dead-snake styling.
- **`playfield.scss`** / template: add `.snake-dead` class that colours the entire snake red during the death pause.
- **No backend or routing changes** required.
