## 1. Food State in SnakeService

- [x] 1.1 Add `foodPosition = signal<SnakeSegment | null>(null)` to `SnakeService`
- [x] 1.2 Implement private `spawnFood()` method: build a `Set<number>` of occupied cell indices from current segments, then pick `Math.floor(Math.random() * 10_000)` in a loop until the index is not in the set; convert index back to `{ col: index % 100, row: Math.floor(index / 100) }` and call `foodPosition.set()`
- [x] 1.3 Call `spawnFood()` at the end of `initialiseSnake()` so food is present from the first frame

## 2. Eating Logic in SnakeService.tick()

- [x] 2.1 After computing the new head position, compare it to `foodPosition()` — check `newHead.col === food.col && newHead.row === food.row`
- [x] 2.2 If the head lands on food: prepend the new head to `segments` **without** removing the tail, then call `spawnFood()` to place a new food item
- [x] 2.3 If the head does not land on food: prepend the new head and remove the tail as before (existing behaviour, no change needed)

## 3. PlayfieldComponent — Food Computed Signal

- [x] 3.1 Add `foodIndex = computed(() => { const f = snakeService.foodPosition(); return f ? f.row * 100 + f.col : -1; })` to `PlayfieldComponent`

## 4. PlayfieldComponent — Template Binding

- [x] 4.1 Add `[class.food]="foodIndex() === cell"` to the cell `<div>` in the `@for` loop (alongside the existing `snake-head` and `snake-body` bindings)

## 5. PlayfieldComponent — Food Style

- [x] 5.1 Add `.food { background-color: #f97316; }` (orange) to `playfield.scss`

## 6. Manual Verification

- [x] 6.1 Run `npm start` and confirm an orange food cell appears on the board at startup
- [x] 6.2 Navigate the snake to the food cell and confirm the snake grows by one segment
- [x] 6.3 Confirm a new food item appears immediately after eating in a different position
- [x] 6.4 Confirm the new food item does not appear on a cell occupied by the snake
- [x] 6.5 Eat several food items in succession and confirm the snake keeps growing correctly

