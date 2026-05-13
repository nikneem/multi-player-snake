## Why

The snake moves but has no purpose. Without food there is no growth, no challenge, and no game loop. Adding a food item — a target the snake can "eat" to grow — is the next fundamental mechanic that turns the playfield into an actual game.

## What Changes

- `SnakeService` gains a `foodPosition = signal<SnakeSegment>()` that holds one active food cell at a time.
- On each game tick, if the snake's new head position equals the food position, the snake grows by one segment (tail is **not** removed) and a new food item is placed at a random unoccupied cell.
- Food placement SHALL never land on a cell currently occupied by the snake.
- `PlayfieldComponent` renders the food cell with a distinct `food` CSS class.
- No scoring or game-over in this change.

## Capabilities

### New Capabilities

- `snake-food`: A single food item appears on the playfield at a random unoccupied cell. When the snake's head moves onto the food cell, the snake grows by one segment and a new food item is immediately placed at another random unoccupied cell.

### Modified Capabilities

- `snake-movement`: The tick logic must now check for food collision — when the head lands on the food cell the tail is **not** removed (growth). This changes the normative tick behaviour defined in the `snake-movement` spec.
- `playfield`: The playfield must render the food cell with a `food` CSS class in addition to `snake-head` and `snake-body`.

## Impact

- **`SnakeService`** (`src/app/snake.service.ts`): add `foodPosition` signal, food-spawn helper, and food-collision check in `tick()`.
- **`PlayfieldComponent`** (`src/app/playfield/`): add `foodIndex` computed signal and `[class.food]` binding in the template; add `.food` style rule.
- **No backend changes** required.
- **No new npm dependencies** required.
