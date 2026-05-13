## ADDED Requirements

### Requirement: Automatic game reset after death
The system SHALL automatically reset the game to its initial state after a 600 ms pause following a death event. No user interaction SHALL be required to restart.

#### Scenario: Reset fires after death pause
- **WHEN** the game transitions to `'dead'`
- **THEN** after exactly 600 ms the system SHALL call `resetGame()`
- **THEN** `gameState` SHALL return to `'playing'`

### Requirement: Snake reset to initial state
On `resetGame()`, the snake SHALL be restored to its initial configuration: 5 segments at row 50, cols 48–52, direction `'right'`.

#### Scenario: Reset clears current snake
- **WHEN** `resetGame()` is called
- **THEN** `segments` SHALL contain exactly 5 segments at `[{col:52,row:50}, {col:51,row:50}, {col:50,row:50}, {col:49,row:50}, {col:48,row:50}]`
- **THEN** `direction` SHALL be `'right'`

### Requirement: Food respawn on reset
On `resetGame()`, the current food item SHALL be discarded and a new food item SHALL be spawned in a random unoccupied cell (using the existing `spawnFood()` logic).

#### Scenario: New food after reset
- **WHEN** `resetGame()` is called
- **THEN** `foodPosition` SHALL be set to a cell not occupied by any reset snake segment
