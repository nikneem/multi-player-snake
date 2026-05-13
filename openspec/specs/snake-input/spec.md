## ADDED Requirements

### Requirement: Keyboard arrow keys change the snake direction
The system SHALL listen for `ArrowUp`, `ArrowDown`, `ArrowLeft`, and `ArrowRight` `keydown` events on the document and translate them into direction commands sent to `SnakeService`.

#### Scenario: ArrowRight pressed
- **WHEN** the user presses `ArrowRight`
- **THEN** `SnakeService.changeDirection('right')` is called

#### Scenario: ArrowUp pressed
- **WHEN** the user presses `ArrowUp`
- **THEN** `SnakeService.changeDirection('up')` is called

#### Scenario: Arrow keys do not scroll the page
- **WHEN** the user presses any arrow key while the game is active
- **THEN** the default browser scroll behaviour is prevented

---

### Requirement: Touch swipe gestures change the snake direction on mobile
The system SHALL detect swipe gestures on the playfield element using `touchstart` and `touchend` events, and translate dominant-axis swipes of at least 30 px into direction commands.

#### Scenario: Swipe right
- **WHEN** the user swipes right (horizontal delta ≥ 30 px, dominant axis is horizontal)
- **THEN** `SnakeService.changeDirection('right')` is called

#### Scenario: Swipe left
- **WHEN** the user swipes left (horizontal delta ≤ −30 px, dominant axis is horizontal)
- **THEN** `SnakeService.changeDirection('left')` is called

#### Scenario: Swipe up
- **WHEN** the user swipes up (vertical delta ≤ −30 px, dominant axis is vertical)
- **THEN** `SnakeService.changeDirection('up')` is called

#### Scenario: Swipe down
- **WHEN** the user swipes down (vertical delta ≥ 30 px, dominant axis is vertical)
- **THEN** `SnakeService.changeDirection('down')` is called

#### Scenario: Short touch that is not a swipe
- **WHEN** the user touches and releases the playfield with a delta less than 30 px in both axes
- **THEN** no direction change is issued

#### Scenario: Touch scroll is suppressed on the playfield
- **WHEN** the user swipes on the playfield element
- **THEN** the default browser scroll behaviour is prevented so the page does not scroll
