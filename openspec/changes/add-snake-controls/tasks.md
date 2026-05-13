## 1. Snake State Model

- [x] 1.1 Create `src/app/models/snake.model.ts` defining `Direction` type (`'up' | 'down' | 'left' | 'right'`) and `SnakeSegment` interface (`{ col: number; row: number }`)

## 2. SnakeService

- [x] 2.1 Generate `SnakeService` with `ng generate service snake` (`providedIn: 'root'`)
- [x] 2.2 Add `segments = signal<SnakeSegment[]>([])` and `direction = signal<Direction>('right')` fields
- [x] 2.3 Implement `initialiseSnake()` private method that creates 5 horizontal segments centred near row 50, cols 48–52, direction `right`
- [x] 2.4 Call `initialiseSnake()` in the constructor
- [x] 2.5 Implement `changeDirection(dir: Direction)` — silently ignore if `dir` is the direct opposite of the current direction
- [x] 2.6 Implement `tick()` private method: compute new head position (current head ± 1, wrapped with `% 100` / `+ 100 % 100`), prepend new head, pop tail
- [x] 2.7 Start a `setInterval(() => this.tick(), 150)` in the constructor
- [x] 2.8 Inject `DestroyRef` and call `clearInterval` in `onDestroy` to prevent leaks

## 3. InputService

- [x] 3.1 Generate `InputService` with `ng generate service input` (`providedIn: 'root'`)
- [x] 3.2 Inject `DOCUMENT` and `SnakeService`
- [x] 3.3 In `afterNextRender`, register a `keydown` listener on `document` that maps `ArrowUp/Down/Left/Right` to `snakeService.changeDirection()` and calls `event.preventDefault()` for those keys
- [x] 3.4 Store a reference to the touch-start coordinates; expose a `registerPlayfieldElement(el: HTMLElement)` method that attaches `touchstart` / `touchend` listeners
- [x] 3.5 In `touchend` handler: compute `dx = endX - startX`, `dy = endY - startY`; if `Math.max(|dx|, |dy|) >= 30` emit the dominant-axis direction to `snakeService.changeDirection()`; always call `preventDefault()` on the touch events

## 4. PlayfieldComponent — Inject Services & Compute State

- [x] 4.1 Inject `SnakeService` and `InputService` into `PlayfieldComponent`
- [x] 4.2 Add `headIndex = computed(() => { const h = snakeService.segments()[0]; return h ? h.row * 100 + h.col : -1; })`
- [x] 4.3 Add `bodyIndices = computed(() => new Set(snakeService.segments().slice(1).map(s => s.row * 100 + s.col)))`
- [x] 4.4 In `afterNextRender` (or `ngAfterViewInit`), call `inputService.registerPlayfieldElement(hostElement)` passing the native host element via `inject(ElementRef).nativeElement`

## 5. PlayfieldComponent — Template Bindings

- [x] 5.1 Update the `@for` cell template to bind `[class.snake-head]="headIndex() === cell"` and `[class.snake-body]="bodyIndices().has(cell)"`

## 6. PlayfieldComponent — Styles

- [x] 6.1 Add `.snake-head { background-color: #4ade80; }` (bright green) to `playfield.scss`
- [x] 6.2 Add `.snake-body { background-color: #16a34a; }` (darker green) to `playfield.scss`

## 7. Manual Verification

- [x] 7.1 Run `npm start` and confirm a green snake appears and moves automatically on the board
- [x] 7.2 Press arrow keys and confirm direction changes (no 180° reversal)
- [x] 7.3 Let the snake reach an edge and confirm it wraps to the opposite side
- [x] 7.4 On a mobile device or DevTools touch emulation, swipe the playfield and confirm direction changes
- [x] 7.5 Confirm arrow keys no longer scroll the page

