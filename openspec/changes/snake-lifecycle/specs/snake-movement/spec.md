## MODIFIED Requirements

### Requirement: Snake movement wrapping removed
Edge wrapping behaviour is replaced by wall-death. The snake's position SHALL NOT be wrapped using modulo arithmetic. Instead, moving outside the grid boundary SHALL trigger the death sequence (see `snake-collision` spec).

#### Scenario: Snake at right edge moves right
- **WHEN** the snake head is at col 99 and direction is `'right'`
- **THEN** the computed new col is 100, which is out of bounds, and the game transitions to `'dead'`

#### Scenario: Snake at left edge moves left
- **WHEN** the snake head is at col 0 and direction is `'left'`
- **THEN** the computed new col is -1, which is out of bounds, and the game transitions to `'dead'`

#### Scenario: Snake at bottom edge moves down
- **WHEN** the snake head is at row 99 and direction is `'down'`
- **THEN** the computed new row is 100, which is out of bounds, and the game transitions to `'dead'`

#### Scenario: Snake at top edge moves up
- **WHEN** the snake head is at row 0 and direction is `'up'`
- **THEN** the computed new row is -1, which is out of bounds, and the game transitions to `'dead'`
