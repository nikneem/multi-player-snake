## 1. SnakeService — Game State Signal

- [x] 1.1 Add `gameState = signal<'playing' | 'dead'>('playing')` to `SnakeService`
- [x] 1.2 At the top of `tick()`, return early if `gameState()` is `'dead'`

## 2. SnakeService — Wall Collision

- [x] 2.1 Remove the modulo wrapping arithmetic from `tick()` (the `% 100` / `(col - 1 + 100) % 100` expressions)
- [x] 2.2 Compute the raw new col/row without wrapping (simple `col + 1`, `col - 1`, `row + 1`, `row - 1`)
- [x] 2.3 After computing new position, check `col < 0 || col >= 100 || row < 0 || row >= 100`; if true call `die()` and return

## 3. SnakeService — Self-Collision

- [x] 3.1 After the wall check, build a `Set<number>` from `segments().slice(1, -1)` (body segments that remain after tail removal) mapped to flat indices `s.row * 100 + s.col`
- [x] 3.2 Check if `newRow * 100 + newCol` is in the set; if true call `die()` and return

## 4. SnakeService — Die & Reset Methods

- [x] 4.1 Implement private `die()` method: set `gameState` to `'dead'`, schedule `setTimeout(() => this.resetGame(), 600)`
- [x] 4.2 Implement `resetGame()` method: set `direction` to `'right'`, call `initialiseSnake()` (which sets segments and calls `spawnFood()`), then set `gameState` to `'playing'`

## 5. PlayfieldComponent — Dead State

- [x] 5.1 Add `isDead = computed(() => this.snakeService.gameState() === 'dead')` to `PlayfieldComponent`
- [x] 5.2 Bind `[class.is-dead]="isDead()"` to the `.playfield` container `<div>` in the template

## 6. PlayfieldComponent — Death Styles

- [x] 6.1 Add `.is-dead .snake-head, .is-dead .snake-body { background-color: #ef4444; }` to `playfield.scss`

## 7. Manual Verification

- [x] 7.1 Run `npm start` and steer the snake into the left, right, top, or bottom wall — confirm it flashes red and resets
- [x] 7.2 Steer the snake back onto its own body — confirm death and reset
- [x] 7.3 Confirm the snake resets to 5 segments at the centre moving right
- [x] 7.4 Confirm a new food item appears after reset
- [x] 7.5 Confirm the game resumes automatically without a page refresh

