## Context

`SnakeService` already maintains a `segments` signal and a `tick()` method that moves the snake one cell per 150 ms. The tick method currently always removes the tail after prepending the new head (constant-length movement). This change extends `tick()` to check for food collision and skip tail removal when food is eaten, thereby growing the snake.

A `foodPosition` signal holds the one active food cell. A spawn helper picks a random cell from the 10 000-cell grid, verifies it is not occupied by the snake, and retries if needed.

## Goals / Non-Goals

**Goals:**
- Place one food item at a random unoccupied cell when the game starts.
- Grow the snake by one segment when its head lands on the food cell.
- Immediately spawn a new food item at another random unoccupied cell after eating.
- Render the food cell visually in `PlayfieldComponent`.

**Non-Goals:**
- Multiple simultaneous food items.
- Scoring or high-score tracking.
- Game-over on self-collision (deferred).
- Animated food or growth transitions.
- Weighted/special food items.

## Decisions

### D1 — Food position stored as a signal in `SnakeService`

**Decision**: Add `foodPosition = signal<SnakeSegment | null>(null)` to `SnakeService`. Initialise with a random spawn on construction (after the snake is initialised so the spawn excludes snake cells).

**Rationale**: Co-locating food state in `SnakeService` keeps all game state in one place. `PlayfieldComponent` can compute `foodIndex` from `snakeService.foodPosition()` the same way it computes `headIndex` — a simple `computed` signal, no extra service needed.

**Alternatives considered**:
- Separate `FoodService`: unnecessary indirection for a single position value.
- Food position in the component: breaks the separation of game logic from presentation.

### D2 — Growth by skipping tail removal

**Decision**: In `tick()`, after prepending the new head, check `if newHead equals foodPosition`. If true, skip `pop()` (tail stays → snake is one longer) and call `spawnFood()`. If false, call `pop()` as before.

**Rationale**: The simplest possible growth mechanic — no secondary buffer or growth queue needed for a 1-segment-per-food-item design.

**Alternatives considered**:
- Growth queue (accumulate N pending growth steps): needed if food could grant >1 segment, but the spec says exactly 1; overkill here.

### D3 — Food spawn: rejection sampling

**Decision**: `spawnFood()` builds a `Set` of occupied cell indices from the current segments, then picks `Math.floor(Math.random() * 10_000)` and retries until the index is not in the set.

**Rationale**: On a 100 × 100 grid with a snake of typical length (<< 10 000), the expected number of retries is negligible. Simple, dependency-free, and easy to read.

**Alternatives considered**:
- Shuffle the list of unoccupied cells: correct but O(n) allocation on every food spawn; overkill given the grid size and snake length.
- Crypto random: unnecessary for a game.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Rejection sampling could theoretically loop many times if snake nearly fills the board | Snake growth is capped naturally by the board size (10 000 cells); at extreme lengths the loop is still bounded and fast |
| `foodPosition` signal update inside `tick()` triggers a second `computed` invalidation on the same frame as segment update | Both signals are read in separate `computed`s in the component; `OnPush` batches the two reads into one render cycle |
