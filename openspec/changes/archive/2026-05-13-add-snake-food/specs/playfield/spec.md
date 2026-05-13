## MODIFIED Requirements

### Requirement: PlayfieldComponent is a standalone Angular component
The system SHALL implement the playfield as a standalone Angular component named `PlayfieldComponent` with the selector `snk-playfield`, following the project's Angular 21 conventions (OnPush change detection, SCSS styles, `inject()` for DI). The component SHALL inject `SnakeService` and expose computed signals for occupied cell indices and the food cell index to drive cell class bindings.

#### Scenario: Component renders without errors
- **WHEN** `<snk-playfield>` is placed in a host template
- **THEN** the component renders with no console errors

#### Scenario: Component is hosted in AppComponent
- **WHEN** the application starts
- **THEN** `AppComponent` renders `<snk-playfield>` as its primary content

---

## ADDED Requirements

### Requirement: Food cell is visually distinct on the playfield
The system SHALL apply a `food` CSS class to the single cell occupied by the current food item so it is rendered with a distinct colour.

#### Scenario: Food cell is styled
- **WHEN** the snake is rendered on the playfield
- **THEN** exactly one cell carries the `food` class at any given tick

#### Scenario: Food cell does not carry snake classes
- **WHEN** the food is rendered
- **THEN** the food cell does not have `snake-head` or `snake-body` class applied (food and snake never overlap by the spawn rules)
