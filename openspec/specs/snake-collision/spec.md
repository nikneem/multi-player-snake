## ADDED Requirements

### Requirement: Self-collision detection
The system SHALL detect when the snake's head moves into a cell occupied by any of its own body segments. The occupancy check SHALL be performed against the body segments that will remain after the tail is removed (i.e. `segments.slice(1, -1)` for a non-growing tick), so the vacating tail cell does not cause a false positive.

#### Scenario: Head enters a body segment
- **WHEN** the new head position matches the flat index of any remaining body segment
- **THEN** the game SHALL transition to the `'dead'` state immediately

#### Scenario: Head does not enter a body segment
- **WHEN** the new head position does not match any remaining body segment
- **THEN** the game SHALL remain in the `'playing'` state and the tick proceeds normally

### Requirement: Wall-collision detection
The system SHALL detect when the snake's head would move outside the 100 × 100 grid boundary (col < 0, col ≥ 100, row < 0, or row ≥ 100). Edge wrapping SHALL NOT be applied.

#### Scenario: Head moves past left or right wall
- **WHEN** the computed new column is less than 0 or greater than or equal to 100
- **THEN** the game SHALL transition to the `'dead'` state immediately

#### Scenario: Head moves past top or bottom wall
- **WHEN** the computed new row is less than 0 or greater than or equal to 100
- **THEN** the game SHALL transition to the `'dead'` state immediately

#### Scenario: Head moves within bounds
- **WHEN** the computed new position has col in [0, 99] and row in [0, 99]
- **THEN** no wall collision occurs and the tick proceeds normally

### Requirement: Death visual state
The system SHALL render all snake segments (head and body) with a red colour (`#ef4444`) when `gameState` is `'dead'`. The playfield container SHALL receive an `is-dead` CSS class during this state.

#### Scenario: Snake dies
- **WHEN** `gameState()` transitions to `'dead'`
- **THEN** the `.playfield` element SHALL have the `is-dead` CSS class applied
- **THEN** all `.snake-head` and `.snake-body` cells SHALL appear red

#### Scenario: Game resets after death
- **WHEN** `gameState()` transitions back to `'playing'`
- **THEN** the `is-dead` CSS class SHALL be removed from `.playfield`
- **THEN** snake cells SHALL return to their normal green colour
