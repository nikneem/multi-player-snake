## MODIFIED Requirements

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
