## ADDED Requirements

### Requirement: One food item exists on the playfield at all times
The system SHALL maintain exactly one active food item on the 100 × 100 grid at all times once the game starts.

#### Scenario: Food present on start
- **WHEN** `SnakeService` is constructed
- **THEN** `foodPosition()` is a non-null `SnakeSegment` with `col` in [0, 99] and `row` in [0, 99]

#### Scenario: Only one food item at a time
- **WHEN** the snake eats the food item
- **THEN** exactly one new food item appears and no old food item remains

---

### Requirement: Food is never placed on a cell occupied by the snake
The system SHALL ensure the food spawn position is not occupied by any segment of the snake at the time of placement.

#### Scenario: Food spawns on unoccupied cell
- **WHEN** a new food item is spawned (on start or after eating)
- **THEN** the food cell index does not appear in the current snake segments

---

### Requirement: Eating food spawns a new food item immediately
The system SHALL place a new food item at a random unoccupied cell in the same tick that the snake eats the current food.

#### Scenario: New food appears after eating
- **WHEN** the snake head moves onto the food cell
- **THEN** in the same tick `foodPosition()` is updated to a new cell that is not the cell just eaten and is not occupied by the now-longer snake
