## Requirements

### Requirement: Snake has an initial position and direction
The system SHALL initialise the snake as a 5-segment body starting near the centre of the 100 × 100 grid, moving right.

#### Scenario: Initial state on service construction
- **WHEN** `SnakeService` is first constructed
- **THEN** the snake consists of exactly 5 segments positioned horizontally near grid centre, with direction set to `right`

---

### Requirement: Snake advances one cell per tick
The system SHALL move the snake one cell in its current direction every 150 ms. When the new head position coincides with the food cell, the snake grows by one segment (tail is NOT removed). When the new head position does not coincide with the food cell, the tail is removed as before, preserving snake length.

#### Scenario: Head moves forward each tick (no food)
- **WHEN** one game tick elapses and the new head position is not the food cell
- **THEN** the snake head moves exactly one cell in the current direction and the tail segment is removed so overall length is preserved

#### Scenario: Snake grows when head reaches food cell
- **WHEN** one game tick elapses and the new head position equals the food cell position
- **THEN** the new head is prepended to the segments array and the tail is NOT removed, increasing the snake length by exactly one

#### Scenario: Snake length increases by one after eating
- **WHEN** the snake has length N and its head moves onto the food cell
- **THEN** after the tick the snake has length N + 1

---

### Requirement: Wall-collision replaces edge wrapping
Moving outside the grid boundary SHALL trigger the death sequence (see `snake-collision` spec). Edge wrapping SHALL NOT be applied.

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

---

### Requirement: 180° direction reversal is ignored
The system SHALL silently discard any direction command that is directly opposite to the snake's current direction of travel.

#### Scenario: Reverse while moving right
- **WHEN** the snake is moving `right` and a `left` direction command is issued
- **THEN** the snake continues moving `right` and the command is discarded

#### Scenario: Reverse while moving up
- **WHEN** the snake is moving `up` and a `down` direction command is issued
- **THEN** the snake continues moving `up` and the command is discarded
