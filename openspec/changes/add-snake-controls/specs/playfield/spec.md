## MODIFIED Requirements

### Requirement: PlayfieldComponent is a standalone Angular component
The system SHALL implement the playfield as a standalone Angular component named `PlayfieldComponent` with the selector `snk-playfield`, following the project's Angular 21 conventions (OnPush change detection, SCSS styles, `inject()` for DI). The component SHALL inject `SnakeService` and expose computed signals for occupied cell indices to drive cell class bindings.

#### Scenario: Component renders without errors
- **WHEN** `<snk-playfield>` is placed in a host template
- **THEN** the component renders with no console errors

#### Scenario: Component is hosted in AppComponent
- **WHEN** the application starts
- **THEN** `AppComponent` renders `<snk-playfield>` as its primary content

---

## ADDED Requirements

### Requirement: Snake head cell is visually distinct
The system SHALL apply a `snake-head` CSS class to the single cell occupied by the snake's head.

#### Scenario: Head cell styled
- **WHEN** the snake is rendered on the playfield
- **THEN** exactly one cell carries the `snake-head` class at any given tick

---

### Requirement: Snake body cells are visually distinct
The system SHALL apply a `snake-body` CSS class to every cell occupied by the snake's body (all segments except the head).

#### Scenario: Body cells styled
- **WHEN** the snake has a length of 5
- **THEN** exactly 4 cells carry the `snake-body` class and 1 cell carries the `snake-head` class

---

### Requirement: Unoccupied cells have no snake styling
The system SHALL ensure that cells not occupied by the snake carry neither `snake-head` nor `snake-body` classes.

#### Scenario: Empty cells are unstyled
- **WHEN** the snake occupies 5 cells on the 100 × 100 grid
- **THEN** the remaining 9 995 cells have neither `snake-head` nor `snake-body` class applied
