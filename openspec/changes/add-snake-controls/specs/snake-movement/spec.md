## ADDED Requirements

### Requirement: Snake has an initial position and direction
The system SHALL initialise the snake as a 5-segment body starting near the centre of the 100 × 100 grid, moving right.

#### Scenario: Initial state on service construction
- **WHEN** `SnakeService` is first constructed
- **THEN** the snake consists of exactly 5 segments positioned horizontally near grid centre, with direction set to `right`

---

### Requirement: Snake advances one cell per tick
The system SHALL move the snake one cell in its current direction every 150 ms.

#### Scenario: Head moves forward each tick
- **WHEN** one game tick elapses
- **THEN** the snake head moves exactly one cell in the current direction, and the tail segment is removed so overall length is preserved

---

### Requirement: Snake wraps at board edges
The system SHALL teleport the snake head to the opposite edge when it crosses any board boundary.

#### Scenario: Wrapping at right edge
- **WHEN** the snake head is at column 99 and direction is `right`
- **THEN** on the next tick the head appears at column 0, same row

#### Scenario: Wrapping at top edge
- **WHEN** the snake head is at row 0 and direction is `up`
- **THEN** on the next tick the head appears at row 99, same column

#### Scenario: Wrapping at left edge
- **WHEN** the snake head is at column 0 and direction is `left`
- **THEN** on the next tick the head appears at column 99, same row

#### Scenario: Wrapping at bottom edge
- **WHEN** the snake head is at row 99 and direction is `down`
- **THEN** on the next tick the head appears at row 0, same column

---

### Requirement: 180° direction reversal is ignored
The system SHALL silently discard any direction command that is directly opposite to the snake's current direction of travel.

#### Scenario: Reverse while moving right
- **WHEN** the snake is moving `right` and a `left` direction command is issued
- **THEN** the snake continues moving `right` and the command is discarded

#### Scenario: Reverse while moving up
- **WHEN** the snake is moving `up` and a `down` direction command is issued
- **THEN** the snake continues moving `up` and the command is discarded
