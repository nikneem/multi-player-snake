## Context

The snake currently wraps around playfield edges and never collides with its own body. There is no failure state — the game runs indefinitely. Adding lifecycle events (death + reset) is the minimum foundation for a playable game, giving players a reason to navigate carefully and try to beat their previous score.

The existing `SnakeService` owns all game state (`segments`, `direction`, `foodPosition`) and drives the 150 ms tick loop. The `PlayfieldComponent` reads these signals via `computed` values and renders them. This change extends that model with a `gameState` signal and collision detection inside `tick()`.

## Goals / Non-Goals

**Goals:**
- Detect self-collision (head enters a body segment) and wall collision (head moves out of bounds) each tick.
- Transition the game into a `'dead'` state on collision, pause movement, and visually indicate death (all snake segments rendered red).
- Automatically reset the game after a 600 ms death pause — no user action required.
- Replace edge wrapping with wall-death so the boundary is a meaningful obstacle.

**Non-Goals:**
- No score tracking, high scores, or persistence in this change.
- No explicit "Game Over" screen or overlay UI; the death flash is sufficient for now.
- No multiplayer collision (other players' snakes) — single-player only.
- No configurable reset delay or difficulty settings.

## Decisions

### D1 — `gameState` signal on `SnakeService`

**Decision**: Add `gameState = signal<'playing' | 'dead'>('playing')` to `SnakeService`. The tick loop checks this at entry and returns immediately when `'dead'`. A `setTimeout` in the death handler calls `resetGame()` after 600 ms.

**Rationale**: Centralising state in the service keeps the component purely presentational. The component only needs to read `gameState()` to apply a CSS class — no extra logic required there.

**Alternatives considered**:
- Separate `isDead` boolean signal: functionally equivalent but a string union is more extensible (e.g., `'paused'` later).
- RxJS BehaviorSubject: unnecessary complexity; Angular signals already provide reactive reads.

### D2 — Wall-death replaces wrapping

**Decision**: Remove `% 100` / `(col - 1 + 100) % 100` wrapping arithmetic. Instead compute the raw new position and check `col < 0 || col >= 100 || row < 0 || row >= 100`. If out of bounds, call `die()`.

**Rationale**: Wrapping made the boundary invisible and non-threatening. Wall-death makes the boundary a tangible hazard that requires skill to avoid, which is standard Snake behaviour.

**Alternatives considered**:
- Keep wrapping as an option toggled by a setting: deferred — the proposal scopes this change to wall-death only.

### D3 — Self-collision check via the existing `bodyIndices` set approach

**Decision**: In `tick()`, after computing the new head position, check if the flat index `newRow * 100 + newCol` is in a `Set` built from the current segments (all segments, not just the tail that will be removed). This is an O(n) build + O(1) lookup — acceptable for n ≤ a few hundred segments.

**Rationale**: Reuses the same flat-index approach already used for `bodyIndices` in the component. Consistent and simple.

### D4 — Visual death state via CSS class on the playfield host

**Decision**: `PlayfieldComponent` exposes `isDead = computed(() => snakeService.gameState() === 'dead')`. The template adds `[class.is-dead]` to the `.playfield` container. In SCSS, `.is-dead .snake-head, .is-dead .snake-body { background-color: #ef4444; }` overrides the green colour with red.

**Rationale**: One CSS rule on the container is simpler than toggling individual cell classes. The `:host` `is-dead` class propagates via the DOM naturally.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Player frustration from accidental wall-death at high speed | Acceptable for classic Snake; no mitigation needed at this stage |
| 600 ms reset delay feels wrong on some devices | Value is hardcoded; easy to tune during manual testing |
| Self-collision check includes the tail that is *about to be removed* | Check occupancy of the post-tick body (all current segments minus the last) to avoid false positives from the vacating tail segment |
