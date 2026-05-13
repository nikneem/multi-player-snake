## Context

The 100 × 100 playfield renders a static grid. The next layer is the snake itself: an autonomous, player-directed entity that moves one cell per game tick. The snake must run entirely in the Angular frontend with no backend involvement. Two input vectors must be supported: keyboard (`ArrowUp/Down/Left/Right`) for desktop and touch swipe for mobile. The playfield component already owns the cell array; it needs to be extended to apply visual state classes per cell.

## Goals / Non-Goals

**Goals:**
- Maintain snake state (segments, direction) in a dedicated `SnakeService`.
- Drive autonomous movement via a fixed-interval tick loop inside `SnakeService`.
- Translate keyboard and touch-swipe events into direction commands via an `InputService`.
- Render head/body segments on the playfield using CSS class bindings.
- Wrap the snake at board edges (teleport, no wall death).
- Prevent illegal 180° direction reversal (can't go directly backwards).

**Non-Goals:**
- Food, scoring, or growth — deferred to a subsequent change.
- Collision death — deferred.
- Multiplayer — deferred.
- Server communication — not needed here.
- Configurable speed / difficulty — out of scope.

## Decisions

### D1 — `SnakeService` owns all game state as Angular signals

**Decision**: `SnakeService` is a `providedIn: 'root'` service that holds `signal<SnakeSegment[]>` for the body and `signal<Direction>` for the current heading. A `setInterval` (or `rxjs interval`) drives tick advancement.

**Rationale**: Signals integrate naturally with `OnPush` components — `PlayfieldComponent` can read `snakeService.segments()` inside a `computed` that builds a `Set<number>` of occupied cell indices, triggering re-render only when segments change. No `BehaviorSubject` wiring or zone pressure needed.

**Alternatives considered**:
- NgRx / component store: overkill for single-player local state.
- Direct state in `PlayfieldComponent`: violates separation of concerns; harder to test.

### D2 — Cell state as a `computed` flat `Set<number>`

**Decision**: `PlayfieldComponent` computes `occupiedCells = computed(() => new Set(snakeService.segments().map(s => s.row * 100 + s.col)))` and a separate `headIndex = computed(...)`. The `@for` loop uses `[class.snake-body]` and `[class.snake-head]` bindings against these sets.

**Rationale**: A `Set` look-up inside the template binding is O(1) and avoids rebuilding the entire cell array on every tick. Only the `computed` signal is invalidated, not the outer `cells` array (which is static).

**Alternatives considered**:
- Array of per-cell state objects: rebuilding 10 000 objects every tick is wasteful.
- String-indexed object map: functionally similar but `Set` is idiomatic JS.

### D3 — `InputService` with `@HostListener`-free approach using `inject(DOCUMENT)`

**Decision**: `InputService` uses Angular's `inject(DOCUMENT)` to attach a `keydown` listener in `afterNextRender` and a `touchstart`/`touchend` listener on the playfield host element (passed via a directive or through the service). Direction changes are written to a `signal<Direction>` that `SnakeService` reads at the start of each tick.

**Rationale**: Avoids `@HostListener` on `AppComponent` (project convention disallows `@HostBinding`/`@HostListener`). Registering on `DOCUMENT` is correct for keyboard (global) while touch is scoped to the playfield element.

**Alternatives considered**:
- RxJS `fromEvent`: viable but adds subscription management; signals are preferred in this codebase.
- `(keydown)` template binding on `<body>`: requires `tabindex`, awkward for a game.

### D4 — Swipe gesture detection: delta-threshold on `touchstart`/`touchend`

**Decision**: Record `touchstart` coordinates; on `touchend` compute `dx`/`dy`; if `|delta| > 30 px`, emit the dominant axis direction. No external gesture library.

**Rationale**: The gesture requirement is simple (4-direction swipe only). A threshold-based approach has zero dependencies and is straightforward to test.

**Alternatives considered**:
- `HammerJS`: Angular dropped built-in support; adds bundle weight.
- Pointer events API: cross-platform but unnecessarily complex for 4-direction swipe.

### D5 — Tick rate: 150 ms interval, started on service initialisation

**Decision**: `SnakeService` starts a 150 ms `setInterval` when constructed (eagerly provided). The interval calls a `tick()` method that advances the snake.

**Rationale**: 150 ms (≈ 6.7 fps for movement) is a comfortable starting speed for a 100-cell board. The interval is cleared via `DestroyRef` injection to avoid leaks.

**Alternatives considered**:
- `requestAnimationFrame` loop with accumulator: more complex; game speed becomes frame-rate dependent.
- RxJS `timer`: adds subscription; signals-first approach preferred.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| 10 000 class-binding evaluations every 150 ms may cause perceptible jank on low-end devices | `computed` signals are lazy and memoised; only cells whose class actually changes re-render with `OnPush`. Profile at implementation time. |
| Touch events on the playfield may interfere with browser scroll | Call `preventDefault()` on `touchstart` within the playfield to suppress scroll while playing |
| `setInterval` drift over long sessions | Acceptable for a game tick; no high-precision timing needed |
| 180° reversal guard must be applied at input time, not tick time | Guard added in `SnakeService.changeDirection()` — if new direction is opposite of current, the command is silently ignored |
