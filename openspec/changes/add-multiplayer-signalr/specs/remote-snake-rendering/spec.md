## ADDED Requirements

### Requirement: Local snake renders in green
The local player's snake (head and body) SHALL be rendered in green in the `playing` state. The `dead`-state colour override defined by the `snake-collision` capability SHALL still apply and take precedence when the local game state is `dead`.

#### Scenario: Local snake while playing
- **WHEN** the local game state is `playing`
- **THEN** all local `.snake-head` and `.snake-body` cells SHALL appear green

#### Scenario: Local snake while dead
- **WHEN** the local game state is `dead`
- **THEN** local snake cells SHALL appear red (per the `snake-collision` death-visual requirement), overriding the green styling

---

### Requirement: Each remote snake renders in a distinct shade of red
Every remote snake SHALL be rendered with a colour in the red band (hue between 0° and 20° inclusive on the HSL colour wheel) derived deterministically from its `connectionId`. Two simultaneously-connected remote players SHALL receive visibly different shades through variation in saturation and/or lightness.

#### Scenario: Two remote players are visually distinguishable
- **WHEN** two distinct remote players (different `connectionId`s) are connected and visible
- **THEN** their snake cells SHALL be rendered with different colours, both within the red band

#### Scenario: A remote player's colour is stable for the session
- **WHEN** a remote player remains connected with the same `connectionId` across multiple state updates
- **THEN** their snake colour SHALL NOT change between updates

#### Scenario: Local player is never rendered as a remote
- **WHEN** the local client's own state would otherwise appear in the remote-snakes map
- **THEN** the local snake SHALL continue to render green and SHALL NOT receive a remote red shade

---

### Requirement: Remote snake cells do not overlap local snake rendering
When a cell would qualify as both a local snake segment and a remote snake segment in the same frame, the local rendering (green head / green body, or red when dead) SHALL take precedence over the remote colouring for that cell.

#### Scenario: Overlap between local and remote
- **WHEN** a single cell index is occupied by both a local segment and a remote segment in the same render pass
- **THEN** the cell SHALL render with the local snake style, not the remote red shade

---

### Requirement: Remote snakes disappear on player disconnect
When a remote player disconnects (a `PlayerLeft` event is received for their connection id), their snake segments SHALL no longer be rendered on the playfield.

#### Scenario: Remote player leaves mid-game
- **WHEN** a remote player with currently-visible segments disconnects
- **THEN** within the next change-detection pass none of their previous segments SHALL be styled as a remote snake
