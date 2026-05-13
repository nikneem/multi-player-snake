## ADDED Requirements

### Requirement: Playfield renders a 100 × 100 cell grid
The system SHALL render exactly 10 000 equal cells arranged in 100 columns and 100 rows using CSS Grid.

#### Scenario: Correct cell count
- **WHEN** the `PlayfieldComponent` is rendered
- **THEN** the DOM contains exactly 10 000 cell elements inside the grid container

#### Scenario: Grid layout is 100 columns
- **WHEN** the `PlayfieldComponent` is rendered
- **THEN** the grid container uses `grid-template-columns: repeat(100, 1fr)` so cells wrap into exactly 100 columns

---

### Requirement: Cells are always square
The system SHALL enforce that each grid cell has an equal width and height at all viewport sizes.

#### Scenario: Square cells at default viewport
- **WHEN** the playfield is displayed at any viewport width
- **THEN** every cell element has an equal computed width and height (aspect ratio 1:1)

---

### Requirement: Playfield is responsive and fits within the viewport
The system SHALL size the playfield so it is always fully visible without horizontal or vertical scrolling, on any device from 320 px wide upward.

#### Scenario: No overflow on a 320 px wide screen
- **WHEN** the viewport width is 320 px
- **THEN** the playfield fits within the viewport bounds and no horizontal scrollbar appears

#### Scenario: No overflow on a 768 px wide tablet
- **WHEN** the viewport width is 768 px
- **THEN** the playfield fits within the viewport bounds

#### Scenario: Board fills available space on a large screen
- **WHEN** the viewport is 1920 × 1080 px or larger
- **THEN** the playfield occupies a large portion of the visible area (no tiny board in the corner)

---

### Requirement: Playfield is centred on screen
The system SHALL horizontally and vertically centre the playfield within the viewport.

#### Scenario: Centred on desktop
- **WHEN** the playfield is rendered on a viewport wider than the board
- **THEN** the board is centred both horizontally and vertically

---

### Requirement: PlayfieldComponent is a standalone Angular component
The system SHALL implement the playfield as a standalone Angular component named `PlayfieldComponent` with the selector `snk-playfield`, following the project's Angular 21 conventions (OnPush change detection, SCSS styles, `inject()` for DI).

#### Scenario: Component renders without errors
- **WHEN** `<snk-playfield>` is placed in a host template
- **THEN** the component renders with no console errors

#### Scenario: Component is hosted in AppComponent
- **WHEN** the application starts
- **THEN** `AppComponent` renders `<snk-playfield>` as its primary content
